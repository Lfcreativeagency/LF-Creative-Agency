// LF Flow — landing page
// O mês de exemplo da abertura (celular em 3D com os conteúdos em órbita), o tracking dos botões, o aviso de cookies (o pixel só carrega com aceite),
// a linha do tempo e a entrada das cenas.

document.addEventListener('DOMContentLoaded', () => {
  const raiz = document.documentElement;
  const guarda = {
    le(chave) { try { return localStorage.getItem(chave); } catch { return null; } },
    grava(chave, valor) { try { localStorage.setItem(chave, valor); } catch { /* sem armazenamento, segue sem lembrar */ } },
  };

  // ---- O mês de exemplo ----
  // Conteúdo fictício de dois negócios do público do Flow: 8 vídeos, 2 carrosséis e 2 fotos, como no pacote real.
  const meses = {
    moda: [
      { tipo: 'Vídeo', titulo: 'A peça que mais vende, e por quê', linhas: [['Primeira frase', 'Essa é a peça que esgota em toda coleção.'], ['Fale', 'Conte qual é, de que tecido é feita e com o que as clientes mais usam.'], ['Mostre', 'A peça no corpo, de frente e de costas.']] },
      { tipo: 'Carrossel', titulo: '3 jeitos de usar a mesma camisa', linhas: [['Capa', 'Uma camisa, três looks.'], ['Miolo', 'Um look por tela: trabalho, fim de semana e noite.'], ['Final', 'Qual é o seu? Comenta o número.']] },
      { tipo: 'Vídeo', titulo: 'Bastidor: do rolo de tecido à arara', linhas: [['Primeira frase', 'Antes de chegar na arara, ela passou por tudo isso.'], ['Fale', 'Narre as etapas e quem faz cada uma.'], ['Mostre', 'Corte, costura e acabamento, sem arrumar nada.']] },
      { tipo: 'Vídeo', titulo: 'Como escolher o seu tamanho', linhas: [['Primeira frase', 'Ficou na dúvida entre o P e o M? Olha isso.'], ['Fale', 'Explique as medidas e como a peça veste.'], ['Mostre', 'A mesma peça em dois tamanhos, lado a lado.']] },
      { tipo: 'Foto', titulo: 'A cliente da semana', linhas: [['Legenda', 'A Júlia levou o vestido da coleção nova para o casamento da irmã. Olha como ficou.'], ['Chamada', 'Marque a gente no seu look.']] },
      { tipo: 'Vídeo', titulo: 'Vocês entregam para todo o Brasil?', linhas: [['Primeira frase', 'A pergunta que a gente mais recebe.'], ['Fale', 'Explique prazo, frete e como funciona a troca.'], ['Mostre', 'Um pedido sendo embalado.']] },
      { tipo: 'Vídeo', titulo: 'Por que essa peça custa o que custa', linhas: [['Primeira frase', 'Vou te mostrar o que tem dentro desse preço.'], ['Fale', 'Tecido, costura, acabamento e quem produz.'], ['Mostre', 'Os detalhes de perto: costura, botão e etiqueta.']] },
      { tipo: 'Carrossel', titulo: 'A coleção nova, peça por peça', linhas: [['Capa', 'Chegou. Passa para o lado.'], ['Miolo', 'Uma peça por tela, com nome e tecido.'], ['Final', 'Qual você quer primeiro?']] },
      { tipo: 'Vídeo', titulo: 'Provando a coleção nova', linhas: [['Primeira frase', 'Primeira prova da coleção. Sem filtro.'], ['Fale', 'Diga o que achou de cada peça e para quem indica.'], ['Mostre', 'Você no provador, trocando de look.']] },
      { tipo: 'Vídeo', titulo: 'Um pedido, do clique à sua porta', linhas: [['Primeira frase', 'O caminho do seu pedido, em 30 segundos.'], ['Fale', 'Compra no site, separação, embalagem e envio.'], ['Mostre', 'Uma cena curta de cada etapa.']] },
      { tipo: 'Foto', titulo: 'Quem faz: conheça a Dona Marta', linhas: [['Legenda', 'Há 12 anos é ela quem costura as nossas peças. Cada acabamento passa pela mão dela.'], ['Chamada', 'Deixa um recado para ela aqui embaixo.']] },
      { tipo: 'Vídeo', titulo: 'Últimas peças da coleção', linhas: [['Primeira frase', 'Sobraram poucas peças dessa coleção.'], ['Fale', 'Diga quais tamanhos restam e até quando.'], ['Mostre', 'A arara com o que sobrou.']] },
    ],
    arquitetura: [
      { tipo: 'Vídeo', titulo: 'O projeto que mais pedem, e por quê', linhas: [['Primeira frase', 'Esse é o pedido que mais chega no escritório.'], ['Fale', 'Conte qual é o ambiente e o que as pessoas querem resolver.'], ['Mostre', 'Um projeto pronto desse tipo.']] },
      { tipo: 'Carrossel', titulo: '3 erros ao reformar a cozinha', linhas: [['Capa', 'Vai reformar a cozinha? Evite estes 3 erros.'], ['Miolo', 'Tomada no lugar errado, bancada baixa demais e pouca luz.'], ['Final', 'Chame no WhatsApp antes de quebrar a parede.']] },
      { tipo: 'Vídeo', titulo: 'Bastidor: dia de obra', linhas: [['Primeira frase', 'Hoje é dia de visita na obra. Vem comigo.'], ['Fale', 'Mostre o que você confere e por quê.'], ['Mostre', 'A obra como está, sem arrumar nada.']] },
      { tipo: 'Vídeo', titulo: 'Quanto custa um projeto?', linhas: [['Primeira frase', 'Quanto custa contratar um arquiteto?'], ['Fale', 'Explique como você cobra e o que está incluído.'], ['Mostre', 'Você no escritório, falando direto para a câmera.']] },
      { tipo: 'Foto', titulo: 'O antes e depois da semana', linhas: [['Legenda', 'A sala da Camila ganhou luz e espaço sem derrubar nenhuma parede.'], ['Chamada', 'Tem um ambiente assim? Me chama.']] },
      { tipo: 'Vídeo', titulo: 'Vocês acompanham a obra?', linhas: [['Primeira frase', 'A pergunta que a gente mais recebe.'], ['Fale', 'Explique o que você acompanha e com que frequência.'], ['Mostre', 'Você na obra, conversando com a equipe.']] },
      { tipo: 'Vídeo', titulo: 'Antes de contratar, pergunte isto', linhas: [['Primeira frase', 'Três perguntas para fazer a qualquer arquiteto.'], ['Fale', 'O que está incluído? Quem acompanha a obra? Qual o prazo?'], ['Mostre', 'Você falando direto para a câmera.']] },
      { tipo: 'Carrossel', titulo: 'Um projeto, ambiente por ambiente', linhas: [['Capa', 'Apartamento de 70 m², do começo ao fim.'], ['Miolo', 'Um ambiente por tela, com a ideia principal.'], ['Final', 'Qual ambiente você mais gostou?']] },
      { tipo: 'Vídeo', titulo: 'Escolhendo o piso com a cliente', linhas: [['Primeira frase', 'Dois pisos na mesa. Qual você escolheria?'], ['Fale', 'Diga a diferença de preço, de cuidado e de resultado.'], ['Mostre', 'As amostras lado a lado.']] },
      { tipo: 'Vídeo', titulo: 'Um projeto, da primeira conversa à entrega', linhas: [['Primeira frase', 'Como funciona um projeto, em 30 segundos.'], ['Fale', 'Conversa, medição, projeto, obra e entrega.'], ['Mostre', 'Uma cena curta de cada etapa.']] },
      { tipo: 'Foto', titulo: 'Quem faz: conheça o seu Antônio', linhas: [['Legenda', 'Há 15 anos é ele quem executa a marcenaria dos nossos projetos.'], ['Chamada', 'Deixa um recado para ele aqui embaixo.']] },
      { tipo: 'Vídeo', titulo: 'Agenda de projetos do mês', linhas: [['Primeira frase', 'Abrimos 2 vagas de projeto para este mês.'], ['Fale', 'Diga para que tipo de projeto e como reservar.'], ['Mostre', 'A agenda do escritório na sua mão.']] },
    ],
  };
  let mes = meses.moda;

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
      li.append(Object.assign(document.createElement('b'), { textContent: rotulo }), texto);
      lista.append(li);
    });
    peca.append(tipo, titulo, lista);
    grade.querySelectorAll('.dia').forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
  };

  // ---- A órbita ----
  // Os 12 cartões giram em volta do celular. O dia escolhido vem para a frente e o roteiro dele aparece na tela.
  // Sozinha, a órbita avança um dia a cada 3,2 s, dá uma volta e para. Quando a pessoa escolhe um dia, ela assume o controle.
  let dia = 0, escolhe = (i) => { dia = i; mostra(i); };
  const orbita = () => {
    const cena = document.getElementById('orbita');
    const fone = cena.querySelector('.fone');
    const cartoes = [...grade.querySelectorAll('.dia')];
    const n = cartoes.length, inclina = 72 * Math.PI / 180;
    const parado = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pos = 0, visivel = true, pausaAte = 0, t0 = performance.now(), ultimoPasso = t0, raio = 150, passosSozinha = 0, sozinha = true;
    const mede = () => { raio = Math.min(cena.clientWidth * (cena.clientWidth < 420 ? .47 : .56), cena.clientHeight * .5); cena.style.setProperty('--raio', `${raio.toFixed(0)}px`); };
    const sai = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
    const desenha = (agora) => {
      const t = (agora - t0) / 1000;
      const entrada = parado ? 1 : sai((t - .15) / 1.3);
      let d = dia - pos; d -= Math.round(d / n) * n;            // caminho mais curto até o dia escolhido
      pos += parado ? d : d * .07;
      cartoes.forEach((c, i) => {
        const a = Math.PI / 2 + (i - pos) * (2 * Math.PI / n);
        const x = Math.cos(a) * raio * entrada, p = Math.sin(a) * raio * entrada;
        c.style.transform = `translate3d(${x.toFixed(1)}px, ${(p * Math.cos(inclina)).toFixed(1)}px, ${(p * Math.sin(inclina)).toFixed(1)}px)`;
        c.style.opacity = (entrada * (.55 + .45 * (Math.sin(a) + 1) / 2)).toFixed(2);
      });
      fone.style.setProperty('--fy', `${(-16 + (parado ? 0 : Math.sin(t * .45) * 7) + (1 - entrada) * 70).toFixed(2)}deg`);
      fone.style.setProperty('--sobe', `${((1 - entrada) * 90).toFixed(1)}px`);
      fone.style.opacity = Math.min(1, entrada * 1.6).toFixed(2);
    };
    const laco = (agora) => {
      if (visivel && !document.hidden) {
        if (!parado && sozinha && agora > pausaAte && agora - ultimoPasso > 3200) { ultimoPasso = agora; dia = (dia + 1) % n; mostra(dia); passosSozinha += 1; if (passosSozinha >= n) sozinha = false; }
        desenha(agora);
      }
      if (!parado) requestAnimationFrame(laco);
    };
    escolhe = (i, daPessoa) => {
      dia = i; mostra(i);
      if (daPessoa) sozinha = false;
      if (parado) desenha(performance.now());
    };
    cena.addEventListener('pointerenter', () => { pausaAte = Math.max(pausaAte, performance.now() + 4000); });
    cena.addEventListener('focusin', () => { pausaAte = performance.now() + 15000; });
    window.addEventListener('resize', () => { mede(); if (parado) desenha(performance.now()); });
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(cena);
    mede(); mostra(0);
    if (parado) desenha(performance.now()); else requestAnimationFrame(laco);
  };

  if (grade && peca) {
    mes.forEach((item, i) => {
      const botao = Object.assign(document.createElement('button'), { type: 'button', className: 'dia' });
      botao.setAttribute('aria-pressed', 'false');
      botao.setAttribute('aria-label', `${i + 1} ${item.tipo}. ${item.titulo}`);
      botao.append(
        Object.assign(document.createElement('span'), { className: 'dia-numero', textContent: String(i + 1) }),
        Object.assign(document.createElement('span'), { textContent: item.tipo }),
      );
      botao.addEventListener('click', () => escolhe(i, true));
      grade.append(botao);
    });
    orbita();
    // Troca de exemplo: marca de moda ou escritório de arquitetura
    const trocas = [...document.querySelectorAll('[data-mes]')];
    trocas.forEach((b) => b.addEventListener('click', () => {
      mes = meses[b.dataset.mes];
      trocas.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
      grade.querySelectorAll('.dia').forEach((d, i) => d.setAttribute('aria-label', `${i + 1} ${mes[i].tipo}. ${mes[i].titulo}`));
      escolhe(0, true);
    }));
  }

  // ---- O que chega: o celular troca de tela conforme o item da lista ----
  // No computador, o item que está no meio da tela manda. No celular, a lista anda sozinha e o toque escolhe.
  const entregas = document.getElementById('entregas');
  const foneRecebe = document.getElementById('fone-recebe');
  if (entregas && foneRecebe) {
    const itens = [...entregas.children], telas = [...foneRecebe.querySelectorAll('.tela')];
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const largo = window.matchMedia('(min-width: 1024px)');
    const atual = document.getElementById('recebe-atual');
    let passo = 0, pausa = 0, naTela = false, trocas = 0;
    const ativa = (i) => {
      passo = i;
      itens.forEach((el, n) => el.classList.toggle('on', n === i));
      telas.forEach((el, n) => el.classList.toggle('on', n === i));
      foneRecebe.style.setProperty('--fy', `${-12 + i * 6}deg`);
      if (atual) atual.textContent = itens[i].querySelector('dt').textContent;
    };
    entregas.classList.add('passo-a-passo');
    ativa(0);
    itens.forEach((el, i) => el.addEventListener('click', () => { ativa(i); pausa = Infinity; }));
    if ('IntersectionObserver' in window) {
      const meio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && largo.matches) ativa(itens.indexOf(e.target)); }), { rootMargin: '-45% 0px -45% 0px' });
      itens.forEach((el) => meio.observe(el));
      new IntersectionObserver(([e]) => { naTela = e.isIntersecting; }, { threshold: .25 }).observe(entregas);
    }
    if (!semMovimento) setInterval(() => { if (!largo.matches && naTela && !document.hidden && performance.now() > pausa && trocas < itens.length * 2) { trocas += 1; ativa((passo + 1) % itens.length); } }, 2800);
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
    raiz.dataset.rolou = window.scrollY > 140 ? 'sim' : 'nao';
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

  // Indicação: tocar no cartão N vira os N primeiros e mostra o que a pessoa ganha (regras dos termos, cláusula 12).
  // Quando a seção entra na tela, os três viram sozinhos uma vez, para mostrar o melhor caso.
  const amigos = document.getElementById('amigos');
  if (amigos) {
    const cartoes = [...amigos.querySelectorAll('.amigo')], resultado = document.getElementById('amigos-resultado');
    const frases = [
      'Toque em um cartão para ver o que você ganha.',
      '1 amigo: você ganha 1 mês grátis quando ele pagar o segundo mês.',
      '2 amigos: são 2 meses grátis para você.',
      '3 amigos ativos ao mesmo tempo: o seu Flow sai de graça enquanto os três ficarem.',
    ];
    let quantos = 0;
    const marca = (n) => {
      quantos = n;
      cartoes.forEach((c, i) => c.setAttribute('aria-pressed', String(i < n)));
      resultado.textContent = frases[n];
    };
    cartoes.forEach((c, i) => c.addEventListener('click', () => marca(quantos === i + 1 ? i : i + 1)));
    if ('IntersectionObserver' in window) {
      const olho = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; olho.disconnect(); setTimeout(() => { if (quantos === 0) marca(3); }, 500); }, { threshold: .6 });
      olho.observe(amigos);
    }
  }

  // Garantia: o 7 ganha espessura (camadas empilhadas para trás) e gira conforme a seção atravessa a tela
  const sete = document.querySelector('#sete .sete-n');
  if (sete) {
    for (let i = 1; i <= 16; i += 1) {
      const camada = Object.assign(document.createElement('i'), { textContent: '7' });
      camada.style.transform = `translateZ(${-i * 2.5}px)`;
      sete.append(camada);
    }
    const frente = Object.assign(document.createElement('i'), { textContent: '7' });   // a face da frente volta a ser preta
    frente.style.cssText = 'color: var(--cor-preto); transform: translateZ(.5px)';
    sete.append(frente);
    const gira = () => {
      const r = sete.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));   // 0 quando entra por baixo, 1 quando sai por cima
      sete.style.setProperty('--giro', `${(-34 + p * 62).toFixed(1)}deg`);
    };
    window.addEventListener('scroll', () => requestAnimationFrame(gira), { passive: true });
    gira();
  }

  // Planos: cada cartão inclina na direção do mouse, só em telas com cursor
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.plano').forEach((cartao) => {
      let q = 0;
      cartao.addEventListener('pointermove', (e) => {
        cancelAnimationFrame(q);
        q = requestAnimationFrame(() => {
          const r = cartao.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          cartao.classList.add('mexendo');
          cartao.style.setProperty('--rx', `${((x - .5) * 9).toFixed(2)}deg`);
          cartao.style.setProperty('--ry', `${((.5 - y) * 7).toFixed(2)}deg`);
          cartao.style.setProperty('--mx', `${(x * 100).toFixed(0)}%`);
          cartao.style.setProperty('--my', `${(y * 100).toFixed(0)}%`);
        });
      });
      cartao.addEventListener('pointerleave', () => {
        cancelAnimationFrame(q);
        cartao.classList.remove('mexendo');
        cartao.style.setProperty('--rx', '0deg'); cartao.style.setProperty('--ry', '0deg');
      });
    });
  }

  // A órbita inclina de leve acompanhando o mouse, só em telas com cursor
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
