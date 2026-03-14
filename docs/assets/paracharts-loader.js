const PUBLIC_BUNDLE_URL = 'https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js';
const LOAD_ERROR_MESSAGE = 'ParaCharts failed to load for this page. If you are building from source, configure NPM_AUTH_TOKEN with read access to https://npm.fizz.studio.';

function replaceWithError(chart) {
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
  message.textContent = LOAD_ERROR_MESSAGE;
  chart.replaceWith(message);
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
    }
  }, { once: true });

  document.head.appendChild(script);

  setTimeout(() => {
    if (!customElements.get('para-chart')) {
      fail();
    }
  }, 5000);
}

ensureParaChartsRuntime();
