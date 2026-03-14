#!/usr/bin/env python3
"""Update live-data manifests for ParaCharts example pages.

Safety guarantees:
- Existing cached manifests are never deleted preemptively.
- Each target file is updated atomically only after new data passes validation.
- Failed source fetches keep prior cached files untouched.
"""

from __future__ import annotations

import csv
import datetime as dt
import io
import json
import math
import os
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "docs" / "data" / "manifests"
STATUS_FILE = REPO_ROOT / "docs" / "data" / "live-data-status.json"

BLS_SERIES = "LNS14000000"
CPI_SERIES = "CPIAUCSL"
FEDFUNDS_SERIES = "FEDFUNDS"


def http_get_text(url: str, timeout: int = 40) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "ParaCharts-live-data-updater/1.0 (+https://github.com/fizzstudio/ParaCharts)",
            "Accept": "application/json,text/csv,text/plain,*/*",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", "replace")


def http_get_json(url: str, timeout: int = 40) -> dict[str, Any]:
    return json.loads(http_get_text(url, timeout=timeout))


def validate_manifest(manifest: dict[str, Any]) -> bool:
    if not isinstance(manifest, dict):
        return False
    datasets = manifest.get("datasets")
    if not isinstance(datasets, list) or not datasets:
        return False
    ds = datasets[0]
    if not isinstance(ds, dict):
        return False
    if ds.get("type") not in {
        "line",
        "column",
        "bar",
        "donut",
        "scatter",
        "heatmap",
        "waterfall",
        "stepline",
    }:
        return False
    series = ds.get("series")
    if not isinstance(series, list) or not series:
        return False
    for s in series:
        if not isinstance(s, dict):
            return False
        recs = s.get("records")
        if not isinstance(recs, list) or not recs:
            return False
        for r in recs:
            if not isinstance(r, dict) or "x" not in r or "y" not in r:
                return False
    return True


def atomic_write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=path.name + ".", suffix=".tmp", dir=str(path.parent))
    os.close(fd)
    tmp_path = Path(tmp_name)
    try:
        with tmp_path.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            f.write("\n")
        tmp_path.replace(path)
    finally:
        if tmp_path.exists():
            tmp_path.unlink(missing_ok=True)


def load_json_if_exists(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def fmt_num(v: float, digits: int = 2) -> str:
    if math.isnan(v) or math.isinf(v):
        raise ValueError("Invalid numeric value")
    return f"{v:.{digits}f}".rstrip("0").rstrip(".")


_MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
_QUARTER_MARK_MONTHS = {3: 'Mar', 6: 'Jun', 9: 'Sep'}


def format_month_labels(yyyymm_list: list[str]) -> list[str]:
    """Convert a list of 'YYYY-MM' strings to compact x-axis display labels.

    For series of 18 months or fewer every month gets a label:
    abbreviated month plus 2-digit year on first entry and on each year change,
    abbreviated month only otherwise.  e.g. "Feb '25", "Mar", …, "Jan '26".

    For longer series sparse mode activates to prevent axis crowding:
    the 4-digit year appears at the first entry of each calendar year,
    abbreviated months appear at quarterly pivots (Mar, Jun, Sep), and all
    other months receive an empty string.
    """
    if len(yyyymm_list) <= 18:
        labels: list[str] = []
        prev_year: int | None = None
        for ym in yyyymm_list:
            year, month = int(ym[:4]), int(ym[5:7])
            abbr = _MONTH_ABBR[month - 1]
            if prev_year is None or year != prev_year:
                labels.append(f"{abbr} '{str(year)[2:]}")
            else:
                labels.append(abbr)
            prev_year = year
        return labels

    # Sparse mode: year at first entry of each calendar year,
    # abbreviated month at Mar/Jun/Sep quarterly pivots, empty otherwise.
    seen_years: set[int] = set()
    sparse: list[str] = []
    for ym in yyyymm_list:
        year, month = int(ym[:4]), int(ym[5:7])
        if year not in seen_years:
            sparse.append(str(year))
            seen_years.add(year)
        elif month in _QUARTER_MARK_MONTHS:
            sparse.append(_QUARTER_MARK_MONTHS[month])
        else:
            sparse.append('')
    return sparse


def make_xy_manifest(
    *,
    chart_type: str,
    title: str,
    x_label: str,
    y_label: str,
    series: list[tuple[str, list[tuple[str, float]]]],
    y_units: str | None = None,
    y_multiplier: float | None = None,
) -> dict[str, Any]:
    y_facet: dict[str, Any] = {
        "label": y_label,
        "variableType": "dependent",
        "measure": "ratio",
        "datatype": "number",
        "displayType": {"type": "axis", "orientation": "vertical"},
    }
    if y_units:
        y_facet["units"] = y_units
    if y_multiplier is not None:
        y_facet["multiplier"] = y_multiplier

    return {
        "datasets": [
            {
                "type": chart_type,
                "title": title,
                "facets": {
                    "x": {
                        "label": x_label,
                        "variableType": "independent",
                        "measure": "interval",
                        "datatype": "string",
                        "displayType": {"type": "axis", "orientation": "horizontal"},
                    },
                    "y": y_facet,
                },
                "series": [
                    {
                        "key": key,
                        "records": [{"x": x, "y": fmt_num(y)} for x, y in records],
                    }
                    for key, records in series
                ],
                "data": {"source": "inline"},
                "settings": {"controlPanel.isControlPanelDefaultOpen": True},
            }
        ]
    }


def make_xy_numeric_manifest(
    *,
    chart_type: str,
    title: str,
    x_label: str,
    y_label: str,
    series: list[tuple[str, list[tuple[float, float]]]],
    x_units: str | None = None,
    y_units: str | None = None,
    x_multiplier: float | None = None,
    y_multiplier: float | None = None,
) -> dict[str, Any]:
    x_facet: dict[str, Any] = {
        "label": x_label,
        "variableType": "independent",
        "measure": "interval",
        "datatype": "number",
        "displayType": {"type": "axis", "orientation": "horizontal"},
    }
    y_facet: dict[str, Any] = {
        "label": y_label,
        "variableType": "dependent",
        "measure": "ratio",
        "datatype": "number",
        "displayType": {"type": "axis", "orientation": "vertical"},
    }
    if x_units:
        x_facet["units"] = x_units
    if y_units:
        y_facet["units"] = y_units
    if x_multiplier is not None:
        x_facet["multiplier"] = x_multiplier
    if y_multiplier is not None:
        y_facet["multiplier"] = y_multiplier

    return {
        "datasets": [
            {
                "type": chart_type,
                "title": title,
                "facets": {"x": x_facet, "y": y_facet},
                "series": [
                    {
                        "key": key,
                        "records": [{"x": round(x, 3), "y": round(y, 3)} for x, y in records],
                    }
                    for key, records in series
                ],
                "data": {"source": "inline"},
                "settings": {"controlPanel.isControlPanelDefaultOpen": True},
            }
        ]
    }


def make_donut_manifest(*, title: str, records: list[tuple[str, float]]) -> dict[str, Any]:
    return {
        "datasets": [
            {
                "type": "donut",
                "title": title,
                "facets": {
                    "x": {
                        "label": "Generation source",
                        "variableType": "independent",
                        "measure": "nominal",
                        "datatype": "string",
                        "displayType": {"type": "marking"},
                    },
                    "y": {
                        "label": "Generation (million kilowatthours)",
                        "variableType": "dependent",
                        "measure": "ratio",
                        "datatype": "number",
                        "displayType": {"type": "angle"},
                    },
                },
                "series": [
                    {
                        "key": "Top 5 electricity generation sources",
                        "records": [{"x": x, "y": fmt_num(y)} for x, y in records],
                    }
                ],
                "data": {"source": "inline"},
                "settings": {"controlPanel.isControlPanelDefaultOpen": True},
            }
        ]
    }


def fetch_bls_series(start_year: int, end_year: int) -> list[tuple[int, int, float]]:
    url = (
        f"https://api.bls.gov/publicAPI/v2/timeseries/data/{BLS_SERIES}?"
        f"startyear={start_year}&endyear={end_year}"
    )
    payload = http_get_json(url)
    if payload.get("status") != "REQUEST_SUCCEEDED":
        raise RuntimeError(f"BLS request failed: {payload.get('message')}")

    entries = payload["Results"]["series"][0]["data"]
    out: list[tuple[int, int, float]] = []
    for e in entries:
        period = e.get("period", "")
        if not period.startswith("M") or period == "M13":
            continue
        raw_value = str(e.get("value", "")).strip()
        if raw_value in {"", "-", ".", "NA", "null"}:
            continue
        year = int(e["year"])
        month = int(period[1:])
        try:
            value = float(raw_value)
        except ValueError:
            continue
        out.append((year, month, value))

    out.sort(key=lambda t: (t[0], t[1]))
    return out


def fetch_fred_monthly_series(series_id: str) -> list[tuple[str, float]]:
    csv_text = http_get_text(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}")
    reader = csv.DictReader(io.StringIO(csv_text))
    if not reader.fieldnames:
        raise RuntimeError(f"FRED CSV missing header row for series {series_id}")

    date_key = None
    for key in reader.fieldnames:
        if key and key.lower() in {"date", "observation_date"}:
            date_key = key
            break
    if date_key is None:
        date_key = reader.fieldnames[0]

    value_key = None
    for key in reader.fieldnames:
        if key != date_key:
            value_key = key
            break
    if value_key is None:
        raise RuntimeError(f"FRED CSV missing value column for series {series_id}")

    out: list[tuple[str, float]] = []
    for row in reader:
        date = (row.get(date_key) or "").strip()
        raw = (row.get(value_key) or "").strip()
        if not date or raw in {"", ".", "NA", "null"}:
            continue
        try:
            out.append((date[:7], float(raw)))
        except ValueError:
            continue
    return out


def yoy_from_monthly(series: list[tuple[str, float]]) -> dict[str, float]:
    out: dict[str, float] = {}
    for i in range(12, len(series)):
        cur_label, cur_val = series[i]
        prev_label, prev_val = series[i - 12]
        if prev_val == 0:
            continue
        if cur_label[:4] != str(int(prev_label[:4]) + 1) or cur_label[5:] != prev_label[5:]:
            continue
        out[cur_label] = ((cur_val / prev_val) - 1.0) * 100.0
    return out


def build_us_unemployment_monthly_manifest() -> dict[str, Any]:
    now = dt.date.today()
    pts = fetch_bls_series(now.year - 3, now.year)
    pts = pts[-12:]
    if len(pts) < 10:
        raise RuntimeError("Insufficient BLS monthly points for unemployment chart")

    raw_keys = [f"{y}-{m:02d}" for y, m, v in pts]
    labels = format_month_labels(raw_keys)
    records = [(lbl, v) for lbl, (_, _, v) in zip(labels, pts)]
    return make_xy_manifest(
        chart_type="column",
        title="U.S. Unemployment Rate (Last 12 Months)",
        x_label="Month",
        y_label="Unemployment rate",
        y_units="percent",
        y_multiplier=0.01,
        series=[("Unemployment rate", records)],
    )


def build_us_unemployment_decade_manifest() -> dict[str, Any]:
    now = dt.date.today()
    pts = fetch_bls_series(now.year - 11, now.year)
    yearly: dict[int, list[float]] = {}
    for y, _m, v in pts:
        yearly.setdefault(y, []).append(v)

    years = sorted(yearly.keys())[-10:]
    if len(years) < 8:
        raise RuntimeError("Insufficient BLS annual points for decade chart")

    records = [(str(y), sum(yearly[y]) / len(yearly[y])) for y in years]
    return make_xy_manifest(
        chart_type="line",
        title="U.S. Unemployment Rate (Annual Average, Last 10 Years)",
        x_label="Year",
        y_label="Unemployment rate",
        y_units="percent",
        y_multiplier=0.01,
        series=[("Unemployment rate", records)],
    )


def build_us_census_median_age_manifest() -> dict[str, Any]:
    now = dt.date.today()
    start = now.year - 12
    values: list[tuple[int, float]] = []
    for year in range(start, now.year + 1):
        url = f"https://api.census.gov/data/{year}/acs/acs1?get=NAME,B01002_001E&for=us:1"
        try:
            payload = json.loads(http_get_text(url))
            if len(payload) >= 2 and payload[1][1] not in (None, "", "null"):
                values.append((year, float(payload[1][1])))
        except urllib.error.HTTPError:
            # Some ACS years are unavailable; skip and continue.
            continue

    values = values[-10:]
    if len(values) < 6:
        raise RuntimeError("Insufficient Census median-age points")

    records = [(str(y), v) for y, v in values]
    return make_xy_manifest(
        chart_type="line",
        title="U.S. Median Age (Census ACS 1-Year)",
        x_label="Year",
        y_label="Median age",
        y_units="years",
        series=[("Median age", records)],
    )


def build_us_eu_inflation_manifest() -> dict[str, Any]:
    eu_url = (
        "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/"
        "prc_hicp_manr?geo=EU27_2020&coicop=CP00&freq=M"
    )
    eu = http_get_json(eu_url)
    dim = eu.get("dimension", {})
    time_idx = dim.get("time", {}).get("category", {}).get("index", {})
    values_map = eu.get("value", {})

    eu_series: dict[str, float] = {}
    for period, idx in time_idx.items():
        v = values_map.get(str(idx), values_map.get(idx))
        if v is None:
            continue
        label: str | None = None
        if len(period) == 7 and period[4] == "-":
            label = period
        elif "M" in period:
            year, month = period.split("M")
            label = f"{int(year):04d}-{int(month):02d}"
        if label is None:
            continue
        eu_series[label] = float(v)

    us_yoy = yoy_from_monthly(fetch_fred_monthly_series(CPI_SERIES))

    common = sorted(set(eu_series.keys()) & set(us_yoy.keys()))
    common = common[-120:]
    if len(common) < 24:
        raise RuntimeError("Insufficient overlapping inflation points")

    eu_records = [(k, eu_series[k]) for k in common]
    us_records = [(k, us_yoy[k]) for k in common]
    return make_xy_manifest(
        chart_type="line",
        title="Inflation Rate: EU vs United States (YoY, Monthly)",
        x_label="Month",
        y_label="Inflation rate",
        y_units="percent",
        y_multiplier=0.01,
        series=[("EU (HICP annual rate)", eu_records), ("United States (CPI YoY)", us_records)],
    )


def build_us_macro_scatter_manifest() -> dict[str, Any]:
    now = dt.date.today()
    bls = fetch_bls_series(now.year - 6, now.year)
    unemployment_by_month = {f"{y:04d}-{m:02d}": v for y, m, v in bls}

    inflation_yoy = yoy_from_monthly(fetch_fred_monthly_series(CPI_SERIES))
    common_months = sorted(set(unemployment_by_month.keys()) & set(inflation_yoy.keys()))
    common_months = common_months[-60:]
    if len(common_months) < 24:
        raise RuntimeError("Insufficient overlapping unemployment and inflation points")

    points = [(unemployment_by_month[m], inflation_yoy[m]) for m in common_months]
    manifest = make_xy_numeric_manifest(
        chart_type="scatter",
        title="U.S. Macro Relationship: Unemployment vs Inflation (Monthly)",
        x_label="Unemployment rate",
        y_label="Inflation rate (CPI YoY)",
        x_units="percent",
        y_units="percent",
        x_multiplier=0.01,
        y_multiplier=0.01,
        series=[("Monthly observations", points)],
    )
    manifest["datasets"][0]["settings"].update(
        {
            "type.scatter.isDrawTrendLine": True,
            "type.scatter.isShowOutliers": True,
        }
    )
    return manifest


def build_us_hourly_heatmap_manifest() -> dict[str, Any]:
    today = dt.date.today()
    first_of_month = today.replace(day=1)
    end_prev_month = first_of_month - dt.timedelta(days=1)
    start_prev_month = end_prev_month.replace(day=1)

    query = urllib.parse.urlencode(
        {
            "latitude": "40.7128",
            "longitude": "-74.0060",
            "start_date": start_prev_month.isoformat(),
            "end_date": end_prev_month.isoformat(),
            "hourly": "temperature_2m",
            "timezone": "UTC",
        }
    )
    payload = http_get_json(f"https://archive-api.open-meteo.com/v1/archive?{query}")
    hourly = payload.get("hourly", {})
    times = hourly.get("time", [])
    temps = hourly.get("temperature_2m", [])
    if len(times) != len(temps) or len(times) < 24 * 10:
        raise RuntimeError("Insufficient hourly records from Open-Meteo archive")

    points: list[tuple[float, float]] = []
    for ts, temp in zip(times, temps):
        if temp in (None, "", "NA", "null"):
            continue
        try:
            hour = float(str(ts)[11:13])
            points.append((hour, float(temp)))
        except Exception:
            continue

    if len(points) < 24 * 10:
        raise RuntimeError("Insufficient valid hourly points for heatmap")

    month_label = start_prev_month.strftime("%Y-%m")
    manifest = make_xy_numeric_manifest(
        chart_type="heatmap",
        title=f"Hourly Temperature Pattern (New York City, {month_label})",
        x_label="Hour of day (UTC)",
        y_label="Temperature",
        y_units="celsius",
        series=[("Hourly observations", points)],
    )
    manifest["datasets"][0]["settings"]["type.heatmap.resolution"] = 24
    return manifest


def _parse_xlsx_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    ns = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    values: list[str] = []
    for si in root.findall("a:si", ns):
        values.append("".join((t.text or "") for t in si.findall(".//a:t", ns)))
    return values


def _xlsx_sheet_xml_for_name(zf: zipfile.ZipFile, sheet_name: str) -> ET.Element:
    ns = {
        "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
        "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    }
    wb = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    rel_map = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels}

    for sh in wb.findall(".//a:sheets/a:sheet", ns):
        if sh.attrib.get("name") == sheet_name:
            rid = sh.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
            target = "xl/" + rel_map[rid]
            return ET.fromstring(zf.read(target))
    raise RuntimeError(f"Sheet '{sheet_name}' not found")


def _xlsx_cell_value(cell: ET.Element, shared: list[str], ns: dict[str, str]) -> str | None:
    v = cell.find("a:v", ns)
    if v is None:
        return None
    raw = v.text or ""
    if cell.attrib.get("t") == "s":
        try:
            return shared[int(raw)]
        except Exception:
            return raw
    return raw


def build_us_gdp_industry_manifest() -> dict[str, Any]:
    # No-key fallback based on BEA's public GDP workbook table 14 (latest available release).
    url = "https://www.bea.gov/sites/default/files/2026-01/gdp3q25-updated.xlsx"
    with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as tf:
        tmp_name = tf.name
    try:
        urllib.request.urlretrieve(url, tmp_name)
        with zipfile.ZipFile(tmp_name) as zf:
            shared = _parse_xlsx_shared_strings(zf)
            sheet = _xlsx_sheet_xml_for_name(zf, "Table 14")

        ns = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
        rows = {int(r.attrib["r"]): r for r in sheet.findall(".//a:sheetData/a:row", ns)}

        # Column headers for recent quarters live in row 4 (year) and row 5 (quarter).
        quarter_cols = ["D", "E", "F", "G", "H"]

        def row_map(row_num: int) -> dict[str, str]:
            out: dict[str, str] = {}
            row = rows[row_num]
            for c in row.findall("a:c", ns):
                ref = c.attrib.get("r", "")
                col = "".join(ch for ch in ref if ch.isalpha())
                val = _xlsx_cell_value(c, shared, ns)
                if val is not None:
                    out[col] = val
            return out

        r4 = row_map(4)
        r5 = row_map(5)
        labels: list[str] = []
        for c in quarter_cols:
            year = r4.get(c)
            quarter = r5.get(c)
            if year and quarter:
                labels.append(f"{year}-{quarter}")
            else:
                labels.append(c)

        # Rows from Table 14:
        # 6 = GDP total, 18 = Information, 22 = Professional/scientific/technical services.
        gdp_row = row_map(6)
        info_row = row_map(18)
        tech_row = row_map(22)

        def as_points(row: dict[str, str]) -> list[tuple[str, float]]:
            pts: list[tuple[str, float]] = []
            for i, c in enumerate(quarter_cols):
                if c not in row:
                    continue
                pts.append((labels[i], float(row[c])))
            return pts

        gdp_pts = as_points(gdp_row)
        info_pts = as_points(info_row)
        tech_pts = as_points(tech_row)

        if min(len(gdp_pts), len(info_pts), len(tech_pts)) < 4:
            raise RuntimeError("Insufficient BEA points in workbook table 14")

        manifest = make_xy_manifest(
            chart_type="line",
            title="U.S. GDP by Industry Group (Recent Quarters)",
            x_label="Quarter",
            y_label="Billions of dollars",
            series=[
                ("Gross domestic product", gdp_pts),
                ("Information", info_pts),
                ("Professional, scientific, and technical services", tech_pts),
            ],
        )
        manifest["datasets"][0]["settings"]["chart.hasDirectLabels"] = False
        return manifest
    finally:
        Path(tmp_name).unlink(missing_ok=True)


def build_us_electricity_top5_manifest() -> dict[str, Any]:
    url = "https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T07.02A"
    rows = list(csv.DictReader(io.StringIO(http_get_text(url))))

    annual_keys = [r["YYYYMM"] for r in rows if r["YYYYMM"].endswith("13")]
    if not annual_keys:
        raise RuntimeError("No annual EIA rows found")

    latest = max(annual_keys)
    annual_rows = [r for r in rows if r["YYYYMM"] == latest]

    def to_float(v: str) -> float:
        return float(v) if v not in ("", "NA", "null") else float("nan")

    gen_rows = []
    for r in annual_rows:
        desc = r.get("Description", "")
        if not desc.startswith("Electricity Net Generation From"):
            continue
        if "Pumped Storage" in desc:
            continue
        val = to_float(r["Value"])
        if math.isnan(val) or val <= 0:
            continue
        label = (
            desc.replace("Electricity Net Generation From ", "")
            .replace(", All Sectors", "")
            .strip()
        )
        gen_rows.append((label, val))

    gen_rows.sort(key=lambda t: t[1], reverse=True)
    top5 = gen_rows[:5]
    if len(top5) < 5:
        raise RuntimeError("Failed to extract top 5 generation sources")

    title_year = latest[:4]
    return make_donut_manifest(
        title=f"Top 5 U.S. Electricity Generation Sources ({title_year})",
        records=top5,
    )


def build_us_electricity_waterfall_manifest() -> dict[str, Any]:
    rows = list(csv.DictReader(io.StringIO(http_get_text("https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T07.02A"))))
    month_keys = sorted({r["YYYYMM"] for r in rows if len(r["YYYYMM"]) == 6 and not r["YYYYMM"].endswith("13")})
    if len(month_keys) < 2:
        raise RuntimeError("Insufficient monthly EIA rows for waterfall chart")

    latest, prev = month_keys[-1], month_keys[-2]

    def parse_month(yyyymm: str) -> tuple[dict[str, float], float | None]:
        sources: dict[str, float] = {}
        total: float | None = None
        for r in rows:
            if r.get("YYYYMM") != yyyymm:
                continue
            desc = (r.get("Description") or "").strip()
            raw = (r.get("Value") or "").strip()
            try:
                value = float(raw)
            except ValueError:
                continue
            if desc.startswith("Electricity Net Generation From "):
                if "Pumped Storage" in desc:
                    continue
                label = desc.replace("Electricity Net Generation From ", "").replace(", All Sectors", "").strip()
                sources[label] = value
            elif desc.startswith("Electricity Net Generation Total"):
                total = value
        return sources, total

    latest_sources, latest_total = parse_month(latest)
    prev_sources, prev_total = parse_month(prev)
    if latest_total is None or prev_total is None:
        raise RuntimeError("Missing total row in EIA monthly data")

    common_sources = sorted(set(latest_sources.keys()) & set(prev_sources.keys()))
    deltas = [(s, latest_sources[s] - prev_sources[s]) for s in common_sources]
    deltas = [d for d in deltas if abs(d[1]) >= 0.01]
    if not deltas:
        raise RuntimeError("No non-zero source deltas for waterfall chart")

    latest_label = f"{latest[:4]}-{latest[4:6]}"
    prev_label = f"{prev[:4]}-{prev[4:6]}"
    title_left = latest_label
    title_right = prev_label
    total_change = latest_total - prev_total

    # Compatibility note: some renderers fail when every cumulative step is negative.
    # If all deltas are <= 0, invert the comparison direction and update labels.
    if not any(v > 0 for _k, v in deltas):
        deltas = [(k, -v) for k, v in deltas]
        total_change = -total_change
        title_left = prev_label
        title_right = latest_label

    deltas.sort(key=lambda t: abs(t[1]), reverse=True)
    top = deltas[:4]
    if len(top) < 3:
        raise RuntimeError("Insufficient source deltas for waterfall chart")

    residual = total_change - sum(v for _k, v in top)

    # Keep positive contributions first so cumulative totals cross above zero when possible.
    contributions = top + [("Other sources", residual)]
    positives = [row for row in contributions if row[1] >= 0]
    negatives = [row for row in contributions if row[1] < 0]
    waterfall_records = positives + negatives + [("Net total change", total_change)]

    return make_xy_manifest(
        chart_type="waterfall",
        title=f"U.S. Electricity Generation Change by Source ({title_left} vs {title_right})",
        x_label="Source contribution",
        y_label="Change in generation (million kilowatthours)",
        series=[("Month-over-month contribution", waterfall_records)],
    )


def build_us_policy_rate_stepline_manifest() -> dict[str, Any]:
    monthly = fetch_fred_monthly_series(FEDFUNDS_SERIES)
    monthly = monthly[-72:]
    if len(monthly) < 24:
        raise RuntimeError("Insufficient FEDFUNDS monthly points for stepline chart")

    labels = format_month_labels([m for m, _ in monthly])
    records = list(zip(labels, [v for _, v in monthly]))
    return make_xy_manifest(
        chart_type="stepline",
        title="U.S. Policy Rate Timeline (FEDFUNDS, Last 6 Years)",
        x_label="Month",
        y_label="Effective federal funds rate",
        y_units="percent",
        y_multiplier=0.01,
        series=[("Effective federal funds rate", records)],
    )


def build_us_inflation_snapshot_manifest() -> dict[str, Any]:
    monthly = fetch_fred_monthly_series(CPI_SERIES)
    yoy = yoy_from_monthly(monthly)

    sorted_months = sorted(yoy.keys())[-24:]
    if len(sorted_months) < 18:
        raise RuntimeError("Insufficient CPI YoY points for inflation snapshot")

    labels = format_month_labels(sorted_months)
    records = [(lbl, yoy[m]) for lbl, m in zip(labels, sorted_months)]
    return make_xy_manifest(
        chart_type="column",
        title="U.S. Inflation Rate: Last 24 Months (CPI YoY)",
        x_label="Month",
        y_label="Inflation rate (CPI YoY)",
        y_units="percent",
        y_multiplier=0.01,
        series=[("Inflation rate (CPI YoY)", records)],
    )


def build_us_policy_unemployment_manifest() -> dict[str, Any]:
    now = dt.date.today()
    bls = fetch_bls_series(now.year - 6, now.year)
    unemployment_by_month = {f"{y:04d}-{m:02d}": v for y, m, v in bls}

    fedfunds = fetch_fred_monthly_series(FEDFUNDS_SERIES)
    fedfunds_by_month = dict(fedfunds)

    common = sorted(set(unemployment_by_month.keys()) & set(fedfunds_by_month.keys()))
    common = common[-72:]
    if len(common) < 24:
        raise RuntimeError("Insufficient overlapping months for policy-unemployment line chart")

    shared_labels = format_month_labels(common)
    unemployment_records = [(lbl, unemployment_by_month[m]) for lbl, m in zip(shared_labels, common)]
    fedfunds_records = [(lbl, fedfunds_by_month[m]) for lbl, m in zip(shared_labels, common)]

    manifest = make_xy_manifest(
        chart_type="line",
        title="U.S. Policy Rate and Unemployment Rate (Last 6 Years)",
        x_label="Month",
        y_label="Rate",
        y_units="percent",
        y_multiplier=0.01,
        series=[
            ("Unemployment rate", unemployment_records),
            ("Federal funds rate", fedfunds_records),
        ],
    )
    manifest["datasets"][0]["settings"]["chart.hasDirectLabels"] = False
    return manifest


def build_us_electricity_top_movers_manifest() -> dict[str, Any]:
    rows = list(csv.DictReader(io.StringIO(http_get_text("https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T07.02A"))))
    month_keys = sorted({r["YYYYMM"] for r in rows if len(r["YYYYMM"]) == 6 and not r["YYYYMM"].endswith("13")})
    if len(month_keys) < 2:
        raise RuntimeError("Insufficient monthly EIA rows for top movers chart")

    latest, prev = month_keys[-1], month_keys[-2]

    def parse_sources(yyyymm: str) -> dict[str, float]:
        sources: dict[str, float] = {}
        for r in rows:
            if r.get("YYYYMM") != yyyymm:
                continue
            desc = (r.get("Description") or "").strip()
            raw = (r.get("Value") or "").strip()
            try:
                value = float(raw)
            except ValueError:
                continue
            if desc.startswith("Electricity Net Generation From "):
                if "Pumped Storage" in desc:
                    continue
                label = (
                    desc.replace("Electricity Net Generation From ", "")
                    .replace(", All Sectors", "")
                    .strip()
                )
                sources[label] = value
        return sources

    latest_sources = parse_sources(latest)
    prev_sources = parse_sources(prev)

    common = sorted(set(latest_sources.keys()) & set(prev_sources.keys()))
    deltas = [(s, latest_sources[s] - prev_sources[s]) for s in common]
    deltas.sort(key=lambda t: abs(t[1]), reverse=True)
    top = deltas[:6]
    if len(top) < 3:
        raise RuntimeError("Insufficient source deltas for top movers bar chart")

    latest_label = f"{latest[:4]}-{latest[4:6]}"
    prev_label = f"{prev[:4]}-{prev[4:6]}"
    return make_xy_manifest(
        chart_type="bar",
        title=f"U.S. Electricity: Top Generation Movers ({latest_label} vs {prev_label})",
        x_label="Electricity source",
        y_label="Change in generation (million kilowatthours)",
        series=[("Month-over-month change", top)],
    )


def build_us_policy_scatter_manifest() -> dict[str, Any]:
    now = dt.date.today()
    bls = fetch_bls_series(now.year - 6, now.year)
    unemployment_by_month = {f"{y:04d}-{m:02d}": v for y, m, v in bls}

    fedfunds = fetch_fred_monthly_series(FEDFUNDS_SERIES)
    fedfunds_by_month = dict(fedfunds)

    common_months = sorted(set(unemployment_by_month.keys()) & set(fedfunds_by_month.keys()))
    common_months = common_months[-60:]
    if len(common_months) < 24:
        raise RuntimeError("Insufficient overlapping points for policy scatter")

    points = [(unemployment_by_month[m], fedfunds_by_month[m]) for m in common_months]
    return make_xy_numeric_manifest(
        chart_type="scatter",
        title="U.S. Policy Response: Unemployment vs Federal Funds Rate (Monthly)",
        x_label="Unemployment rate",
        y_label="Federal funds rate",
        x_units="percent",
        y_units="percent",
        x_multiplier=0.01,
        y_multiplier=0.01,
        series=[("Monthly observations", points)],
    )


def main() -> int:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    targets: list[tuple[str, Path, Any]] = [
        (
            "us_unemployment_monthly",
            DATA_DIR / "us-unemployment-monthly.json",
            build_us_unemployment_monthly_manifest,
        ),
        (
            "us_median_age_census",
            DATA_DIR / "us-median-age-census.json",
            build_us_census_median_age_manifest,
        ),
        (
            "us_gdp_industry_tech",
            DATA_DIR / "us-gdp-industry-tech.json",
            build_us_gdp_industry_manifest,
        ),
        (
            "us_eu_inflation",
            DATA_DIR / "us-eu-inflation.json",
            build_us_eu_inflation_manifest,
        ),
        (
            "us_unemployment_decade",
            DATA_DIR / "us-unemployment-decade.json",
            build_us_unemployment_decade_manifest,
        ),
        (
            "us_electricity_top5",
            DATA_DIR / "us-electricity-top5.json",
            build_us_electricity_top5_manifest,
        ),
        (
            "us_macro_scatter",
            DATA_DIR / "us-macro-scatter.json",
            build_us_macro_scatter_manifest,
        ),
        (
            "us_hourly_heatmap",
            DATA_DIR / "us-hourly-temperature-heatmap.json",
            build_us_hourly_heatmap_manifest,
        ),
        (
            "us_electricity_waterfall",
            DATA_DIR / "us-electricity-waterfall.json",
            build_us_electricity_waterfall_manifest,
        ),
        (
            "us_policy_rate_stepline",
            DATA_DIR / "us-policy-rate-stepline.json",
            build_us_policy_rate_stepline_manifest,
        ),
        (
            "us_inflation_snapshot",
            DATA_DIR / "us-inflation-snapshot.json",
            build_us_inflation_snapshot_manifest,
        ),
        (
            "us_policy_unemployment_line",
            DATA_DIR / "us-policy-unemployment-line.json",
            build_us_policy_unemployment_manifest,
        ),
        (
            "us_electricity_top_movers",
            DATA_DIR / "us-electricity-top-movers.json",
            build_us_electricity_top_movers_manifest,
        ),
        (
            "us_policy_scatter",
            DATA_DIR / "us-policy-scatter.json",
            build_us_policy_scatter_manifest,
        ),
    ]

    status: dict[str, Any] = {
        "updatedAt": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "sources": {},
        "policy": "cached files are retained until replacement data is downloaded and validated",
    }

    failures = 0
    updates = 0

    for name, path, builder in targets:
        existing = load_json_if_exists(path)
        try:
            candidate = builder()
            if not validate_manifest(candidate):
                raise RuntimeError("Manifest validation failed")

            atomic_write_json(path, candidate)
            updates += 1
            status["sources"][name] = {
                "state": "updated",
                "path": str(path.relative_to(REPO_ROOT)).replace("\\", "/"),
            }
        except Exception as exc:
            if existing is not None and validate_manifest(existing):
                status["sources"][name] = {
                    "state": "kept_cached",
                    "path": str(path.relative_to(REPO_ROOT)).replace("\\", "/"),
                    "reason": str(exc),
                }
            else:
                failures += 1
                status["sources"][name] = {
                    "state": "failed_no_cache",
                    "path": str(path.relative_to(REPO_ROOT)).replace("\\", "/"),
                    "reason": str(exc),
                }

    atomic_write_json(STATUS_FILE, status)

    print(json.dumps(status, indent=2))
    print(f"Updated: {updates}, Failures without cache: {failures}")

    return 1 if failures > 0 else 0


if __name__ == "__main__":
    raise SystemExit(main())
