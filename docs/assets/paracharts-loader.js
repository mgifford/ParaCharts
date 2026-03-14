const PUBLIC_BUNDLE_URL = 'https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js';
const LOAD_ERROR_MESSAGE = 'ParaCharts failed to load for this page. If you are building from source, configure NPM_AUTH_TOKEN with read access to https://npm.fizz.studio.';

function formatErrorMessage(detail) {
  const detailText = detail ? ` Runtime detail: ${detail}` : '';
  return `This chart could not be rendered by the public ParaCharts runtime.${detailText} If you are building from source, configure NPM_AUTH_TOKEN with read access to https://npm.fizz.studio.`;
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

function replaceAllChartsWithError(detail) {
  document.querySelectorAll('para-chart').forEach((chart) => replaceWithError(chart, detail));
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
        replaceWithError(chart, detail);
      });
    } else if (attempts > 40) {
      clearInterval(timer);
    }
  }, 125);
}

function installGlobalRuntimeErrorHandlers() {
  if (window.__parachartsRuntimeErrorHandlersInstalled) {
    return;
  }
  window.__parachartsRuntimeErrorHandlersInstalled = true;

  window.addEventListener('error', (event) => {
    const source = `${event?.filename || ''} ${event?.message || ''}`;
    if (source.includes('paracharts.js')) {
      replaceAllChartsWithError(event?.message || 'Unknown runtime error');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const text = `${reason?.stack || ''} ${reason?.message || reason || ''}`;
    if (text.includes('paracharts.js') || text.includes('ParaLoader') || text.includes('is not iterable')) {
      const detail = reason?.message || String(reason || 'Unknown promise rejection');
      replaceAllChartsWithError(detail);
    }
  });
}

function ensureParaChartsRuntime() {
  const charts = Array.from(document.querySelectorAll('para-chart'));
  if (!charts.length) {
    return;
  }
  if (customElements.get('para-chart')) {
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
    }
  }, 5000);
}

installGlobalRuntimeErrorHandlers();
ensureParaChartsRuntime();
