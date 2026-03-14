const PUBLIC_BUNDLE_URL = 'https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js';
const LOAD_ERROR_MESSAGE = 'ParaCharts failed to load for this page. The public runtime could not be loaded for this example.';

function formatErrorMessage(detail) {
  const detailText = detail ? ` Runtime detail: ${detail}` : '';
  return `This chart could not be rendered by the public ParaCharts runtime.${detailText} If this keeps happening, use the source build with NPM_AUTH_TOKEN read access to https://npm.fizz.studio.`;
}

function replaceWithError(chart, detail) {
  const message = document.createElement('p');
  message.className = 'paracharts-load-error';
  message.setAttribute('role', 'alert');
  message.style.margin = '0.75rem 0';
  message.style.padding = '0.75rem 1rem';
  message.style.border = '1px solid #c92a2a';
  message.style.background = '#fff5f5';
  message.style.color = '#7f1d1d';
  message.style.maxWidth = '52rem';
  message.style.fontWeight = '600';
  message.textContent = detail ? formatErrorMessage(detail) : LOAD_ERROR_MESSAGE;
  chart.replaceWith(message);
}

function hasRenderedChart(chart) {
  const state = chart?.paraState?.dataState ?? chart?._paraState?.dataState;
  if (state === 'complete') {
    return true;
  }
  const root = chart?.shadowRoot;
  if (!root) {
    return false;
  }
  return Boolean(root.querySelector('[role="application"], svg, para-view'));
}

function watchChartForRenderFailure(chart) {
  if (chart.dataset.parachartsWatched === 'true') {
    return;
  }
  chart.dataset.parachartsWatched = 'true';

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    const loaded = chart.loaded;
    if (loaded && typeof loaded.then === 'function') {
      clearInterval(timer);
      loaded.catch((error) => {
        const detail = error?.message || String(error || 'Unknown render error');
        // Some public-bundle promise rejections are non-fatal; only replace truly blank/error charts.
        setTimeout(() => {
          const state = chart?.paraState?.dataState ?? chart?._paraState?.dataState;
          if (state === 'error' || !hasRenderedChart(chart)) {
            replaceWithError(chart, detail);
          }
        }, 400);
      });
    } else if (attempts > 40) {
      clearInterval(timer);
    }
  }, 125);
}

function ensureParaChartsRuntime() {
  const charts = Array.from(document.querySelectorAll('para-chart'));
  if (!charts.length) {
    return;
  }
  if (customElements.get('para-chart')) {
    charts.forEach(watchChartForRenderFailure);
    return;
  }
  if (window.__parachartsPublicBundleLoading) {
    return;
  }

  window.__parachartsPublicBundleLoading = true;

  const script = document.createElement('script');
  script.type = 'module';
  script.src = PUBLIC_BUNDLE_URL;

  const fail = () => {
    charts.forEach(replaceWithError);
  };

  script.addEventListener('error', fail, { once: true });
  script.addEventListener('load', () => {
    if (!customElements.get('para-chart')) {
      fail();
      return;
    }
    customElements.whenDefined('para-chart').then(() => {
      document.querySelectorAll('para-chart').forEach(watchChartForRenderFailure);
    });
  }, { once: true });

  document.head.appendChild(script);

  setTimeout(() => {
    if (!customElements.get('para-chart')) {
      fail();
      return;
    }
    document.querySelectorAll('para-chart').forEach((chart) => {
      if (!hasRenderedChart(chart)) {
        replaceWithError(chart);
      }
    });
  }, 5000);
}

ensureParaChartsRuntime();
