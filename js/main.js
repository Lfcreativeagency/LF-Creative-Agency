// LF Creative — Landing Page Geral
// JS mínimo, conforme skill desenvolvimento-landing-page: só tracking de CTA por enquanto.
// Eventos de GA4/GTM reais serão configurados na Etapa 7 (skill integracoes-marketing).

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      const label = el.getAttribute('data-cta');
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'cta_click',
          cta_label: label,
        });
      }
      // eslint-disable-next-line no-console
      console.log('[tracking] cta_click:', label);
    });
  });
});
