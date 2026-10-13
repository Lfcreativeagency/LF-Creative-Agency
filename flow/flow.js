// LF Flow — landing page
// O mês de exemplo da abertura, o tracking dos botões, o aviso de cookies (o pixel só carrega com aceite),
// a linha do tempo e a entrada das cenas.

document.addEventListener('DOMContentLoaded', () => {
  const raiz = document.documentElement;
  const guarda = {
    le(chave) { try { return localStorage.getItem(chave); } catch { return null; } },
    grava(chave, valor) { try { localStorage.setItem(chave, valor); } catch { /* sem armazenamento, segue sem lembrar */ } },
  };

  // ---- O mês de exemplo ----
  // Conteúdo fictício de uma confeitaria de bairro: 8 vídeos, 2 carrosséis e 2 fotos, como no pacote real.
  const mes = [
    { tipo: 'Vídeo', titulo: 'O bolo que mais sai, e por quê', linhas: [['Primeira frase', 'Esse é o bolo que acaba antes do meio-dia.'], ['Fale', 'Conte qual é, de onde veio a receita e para que ocasião o pessoal pede.'], ['Mostre', 'O bolo sendo cortado, de perto.']] },
    { tipo: 'Carrossel', titulo: '3 erros na hora de encomendar bolo de festa', linhas: [['Capa', 'Vai encomendar bolo? Não cometa estes 3 erros.'], ['Miolo', 'Deixar para a última semana, errar a conta de convidados, não avisar sobre alergias.'], ['Final', 'Chame no WhatsApp e a gente calcula com você.']] },
    { tipo: 'Vídeo', titulo: 'Bastidor: 6 da manhã na cozinha', linhas: [['Primeira frase', 'Enquanto você dorme, isso aqui já está no forno.'], ['Fale', 'Narre o que entra primeiro e por que tudo é feito no dia.'], ['Mostre', 'A cozinha acordando, sem arrumar nada.']] },
    { tipo: 'Vídeo', titulo: 'Quanto bolo para 30 pessoas?', linhas: [['Primeira frase', 'Festa para 30 pessoas: quantos quilos de bolo?'], ['Fale', 'Dê a conta simples e o tamanho que você indica.'], ['Mostre', 'Os tamanhos lado a lado no balcão.']] },
    { tipo: 'Foto', titulo: 'A cliente da semana', linhas: [['Legenda', 'A Marina encomendou o bolo dos 5 anos do Theo com a gente. Olha a carinha dele.'], ['Chamada', 'Tem festa chegando? Reserve a sua data.']] },
    { tipo: 'Vídeo', titulo: 'Vocês entregam no mesmo dia?', linhas: [['Primeira frase', 'A pergunta que a gente mais recebe.'], ['Fale', 'Explique até que horas dá para pedir e quais bairros você atende.'], ['Mostre', 'A caixa sendo fechada e saindo para entrega.']] },
    { tipo: 'Vídeo', titulo: 'Antes de fechar o pedido, pergunte isto', linhas: [['Primeira frase', 'Três perguntas para fazer a qualquer confeitaria.'], ['Fale', 'É feito no dia? Qual o recheio? Como transportar?'], ['Mostre', 'Você no balcão, falando direto para a câmera.']] },
    { tipo: 'Carrossel', titulo: 'Os sabores do mês', linhas: [['Capa', 'O que tem de novo na vitrine.'], ['Miolo', 'Um sabor por tela, com foto de perto e o nome.'], ['Final', 'Qual você prova primeiro? Comenta aqui.']] },
    { tipo: 'Vídeo', titulo: 'O recheio novo, provado na hora', linhas: [['Primeira frase', 'Primeira colherada do recheio novo. Sem cortes.'], ['Fale', 'Diga o que sentiu e com qual massa combina.'], ['Mostre', 'A sua reação de verdade.']] },
    { tipo: 'Vídeo', titulo: 'Uma encomenda, do pedido à entrega', linhas: [['Primeira frase', 'O caminho do seu bolo, em 30 segundos.'], ['Fale', 'Pedido no WhatsApp, produção no dia, entrega na porta.'], ['Mostre', 'Uma cena curta de cada etapa.']] },
    { tipo: 'Foto', titulo: 'Quem faz: conheça a Dona Lúcia', linhas: [['Legenda', 'Há 14 anos é ela quem abre a cozinha. Se o seu bolo ficou perfeito, a culpa é dela.'], ['Chamada', 'Deixa um recado para ela aqui embaixo.']] },
    { tipo: 'Vídeo', titulo: 'Últimas datas do mês', linhas: [['Primeira frase', 'Sobraram 4 datas para encomenda neste mês.'], ['Fale', 'Diga quais são e como reservar.'], ['Mostre', 'A agenda de pedidos aberta na sua mão.']] },
  ];

  const grade = document.getElementById('mes-grade');
  const peca = document.getElementById('mes-peca');

  const mostra = (i) => {
    const item = mes[i];
    peca.replaceChildren();
    const tipo = Object.assign(document.createElement('p'), { className: 'peca-tipo', textContent: `Dia ${i + 1}, ${item.tipo.toLowerCase()}` });
    const titulo = Object.assign(document.createElement('p'), { className: 'peca-titulo', textContent: item.titulo });
    const lista = Object.assign(document.createElement('ul'), { className: 'peca-linhas' });
    item.linhas.forEach(([rotulo, texto]) => {
      const li = document.createElement('li');
      li.append(Object.assign(document.createElement('b'), { textContent: `${rotulo}: ` }), texto);
      lista.append(li);
    });
    peca.append(tipo, titulo, lista);
    grade.querySelectorAll('.dia').forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
  };

  if (grade && peca) {
    mes.forEach((item, i) => {
      const botao = Object.assign(document.createElement('button'), { type: 'button', className: 'dia' });
      botao.setAttribute('aria-pressed', 'false');
      botao.setAttribute('aria-label', `Dia ${i + 1}, ${item.tipo}: ${item.titulo}`);
      botao.append(
        Object.assign(document.createElement('span'), { className: 'dia-numero', textContent: String(i + 1) }),
        Object.assign(document.createElement('span'), { textContent: item.tipo }),
      );
      botao.addEventListener('click', () => mostra(i));
      grade.append(botao);
    });
    mostra(0);
  }

  // ---- Aviso de cookies e Meta Pixel ----
  // O pixel "LP FLOW" grava dados de quem visita, então só é carregado depois do aceite.
  // A escolha fica guardada; "Preferências de cookies", no rodapé, reabre o aviso.
  const PIXEL = '2266283787124186';
  const aviso = document.getElementById('cookies');
  const carregaPixel = () => {
    if (window.fbq) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
  };
  if (aviso) {
    const escolha = guarda.le('flow-cookies');
    if (escolha === 'sim') carregaPixel();
    else if (escolha !== 'nao') aviso.hidden = false;
    const reabre = document.getElementById('abre-cookies');
    let veioDoRodape = false;
    const fecha = () => { aviso.hidden = true; if (veioDoRodape && reabre) reabre.focus(); veioDoRodape = false; };
    aviso.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecha(); });
    aviso.querySelectorAll('[data-cookies]').forEach((b) => b.addEventListener('click', () => {
      guarda.grava('flow-cookies', b.dataset.cookies);
      fecha();
      if (b.dataset.cookies === 'sim') carregaPixel();
      else if (window.fbq) window.fbq('consent', 'revoke');
    }));
    if (reabre) reabre.addEventListener('click', () => { veioDoRodape = true; aviso.hidden = false; aviso.querySelector('button').focus(); });
  }

  // ---- Tracking dos botões ----
  // Evento "cta_click" no dataLayer. No Meta Pixel, "Lead" nos dois caminhos, "Contact" para WhatsApp e "InitiateCheckout" para o botão de assinar (só existe fbq se houve aceite).
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      const destino = el.getAttribute('href') || '';
      const rotulo = el.getAttribute('data-cta');
      const checkout = destino.includes('mpago.la') || destino.includes('mercadopago');
      window.dataLayer.push({ event: 'cta_click', cta_label: rotulo, cta_tipo: destino.includes('wa.me') ? 'whatsapp' : checkout ? 'checkout' : 'ancora' });
      if (typeof window.fbq !== 'function') return;
      // "Lead" é o evento de intenção que a campanha do teste otimiza: sai no clique de WhatsApp e no de assinar
      if (destino.includes('wa.me') || checkout) window.fbq('track', 'Lead', { content_name: rotulo });
      if (destino.includes('wa.me')) window.fbq('track', 'Contact', { content_name: rotulo });
      // Início de checkout: o pagamento acontece no Mercado Pago; a compra é marcada na página obrigado/
      if (checkout) window.fbq('track', 'InitiateCheckout', { content_name: el.dataset.plano, value: Number(el.dataset.valor), currency: 'BRL' });
    });
  });

  // ---- Linha do tempo, tom do topo e botão de conversa ----
  const cenas = [...document.querySelectorAll('.cena')];
  const marcos = cenas.filter((c) => c.dataset.nome);
  const passos = document.getElementById('passos');
  const relogio = document.getElementById('relogio');
  const links = marcos.map((cena) => {
    const a = Object.assign(document.createElement('a'), { href: `#${cena.id}`, textContent: cena.dataset.nome });
    passos.append(a);
    return a;
  });
  passos.append(Object.assign(document.createElement('i'), { className: 'cursor' }));
  passos.hidden = false;

  const clara = (cena) => cena.classList.contains('cena-clara');
  const cenaEm = (y) => cenas.find((c) => { const r = c.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
  const semBotao = ['abertura', 'planos', 'comecar'];   // cenas que já têm o próprio botão de WhatsApp
  const dois = (v) => String(v).padStart(2, '0');

  const atualiza = () => {
    const alto = window.innerHeight;
    const noTopo = cenaEm(38), noPe = cenaEm(alto - 30), noMeio = cenaEm(alto / 2);
    raiz.dataset.tomTopo = noTopo && clara(noTopo) ? 'claro' : 'escuro';
    raiz.dataset.tom = noPe && clara(noPe) ? 'claro' : 'escuro';
    raiz.dataset.passos = noPe ? 'on' : 'off';   // some sobre o rodapé
    raiz.dataset.conversa = !noMeio || semBotao.includes(noMeio.id) || !noPe ? 'off' : 'on';

    // cursor: posição dentro da sequência de marcos
    const meio = window.scrollY + alto / 2;
    let i = 0;
    marcos.forEach((c, n) => { if (c.offsetTop <= meio) i = n; });
    const de = marcos[i].offsetTop, ate = marcos[i + 1] ? marcos[i + 1].offsetTop : document.documentElement.scrollHeight;
    const p = (i + Math.min(1, Math.max(0, (meio - de) / (ate - de)))) / marcos.length;
    passos.style.setProperty('--p', Math.min(.999, p).toFixed(4));
    links.forEach((a, n) => a.setAttribute('aria-current', String(n === i)));

    if (relogio) {   // o timecode anda com a rolagem: cada tela vale 10 s a 24 quadros
      const quadros = Math.round((window.scrollY / alto) * 10 * 24);
      relogio.textContent = `00:${dois(Math.floor(quadros / 1440))}:${dois(Math.floor(quadros / 24) % 60)}:${dois(quadros % 24)}`;
    }
  };
  let quadro = 0;
  const pede = () => { cancelAnimationFrame(quadro); quadro = requestAnimationFrame(atualiza); };
  window.addEventListener('scroll', pede, { passive: true });
  window.addEventListener('resize', pede);
  atualiza();

  // ---- Movimento ----
  // Sem JS ou com "reduzir movimento", a página aparece inteira e parada.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  raiz.classList.add('com-movimento');
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  document.querySelectorAll('.revela, .entra').forEach((el) => observador.observe(el));

  // Painel do mês: inclina de leve acompanhando o mouse, só em telas com cursor
  const palco = document.getElementById('abertura');
  if (palco && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let q = 0;
    palco.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(q);
      q = requestAnimationFrame(() => {
        const r = palco.getBoundingClientRect();
        palco.style.setProperty('--gx', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
        palco.style.setProperty('--gy', (((e.clientY - r.top) / r.height - 0.5) * -3).toFixed(2) + 'deg');
      });
    });
    palco.addEventListener('pointerleave', () => { palco.style.setProperty('--gx', '0deg'); palco.style.setProperty('--gy', '0deg'); });
  }
});
