// LF Creative — Landing Page Geral
// JS mínimo: tracking de CTA e entrada discreta das seções ao rolar.
// O GTM (e o GA4 dentro dele) entra pelo snippet do index.html, na Etapa 7.

document.addEventListener('DOMContentLoaded', () => {
  // Tracking de CTA: cada clique vira o evento "cta_click" no dataLayer, lido pelo GTM.
  // cta_label diz qual botão foi clicado; cta_tipo separa WhatsApp de link interno.
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      const destino = el.getAttribute('href') || '';
      window.dataLayer.push({
        event: 'cta_click',
        cta_label: el.getAttribute('data-cta'),
        cta_tipo: destino.includes('wa.me') ? 'whatsapp' : 'ancora',
      });
    });
  });

  // Entrada das seções. Sem JS ou com "reduzir movimento", a página aparece inteira e parada.
  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (menosMovimento || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('com-movimento');
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  document.querySelectorAll('.revela').forEach((el) => observador.observe(el));
});
