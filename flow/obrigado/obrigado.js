// LF Flow — página de confirmação
// O Mercado Pago devolve o cliente para cá depois do pagamento (endereço de retorno configurado em cada plano:
// .../flow/obrigado/?plano=flow ou ?plano=plus). Aqui a compra é marcada no pixel "LP FLOW", uma vez por
// navegador e só para quem aceitou os cookies na página do Flow.
// Limite: quem abrir este endereço direto também conta. A confirmação segura é a do Mercado Pago (aviso de
// pagamento enviado ao n8n e repassado ao Meta pela API de conversões), que fica na frente de automações.

document.addEventListener('DOMContentLoaded', () => {
  const planos = { flow: ['LF Flow', 697], plus: ['LF Flow Design', 1297] };
  const plano = planos[new URLSearchParams(location.search).get('plano')];
  const le = (c) => { try { return localStorage.getItem(c); } catch { return null; } };
  const grava = (c, v) => { try { localStorage.setItem(c, v); } catch { /* segue sem lembrar */ } };

  window.dataLayer = window.dataLayer || [];
  if (plano && le('flow-compra') !== 'sim') {
    window.dataLayer.push({ event: 'purchase', plano: plano[0], value: plano[1], currency: 'BRL' });
    if (le('flow-cookies') === 'sim') {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', '2266283787124186');
      window.fbq('track', 'PageView');
      window.fbq('track', 'Purchase', { content_name: plano[0], value: plano[1], currency: 'BRL' });
      window.fbq('track', 'Subscribe', { content_name: plano[0], value: plano[1], currency: 'BRL', predicted_ltv: plano[1] });
    }
    grava('flow-compra', 'sim');
  }

  document.querySelectorAll('[data-cta]').forEach((el) => el.addEventListener('click', () => {
    window.dataLayer.push({ event: 'cta_click', cta_label: el.dataset.cta, cta_tipo: 'whatsapp' });
    if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { content_name: el.dataset.cta });
  }));
});
