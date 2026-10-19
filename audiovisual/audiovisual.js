// LF Creative — LP de Produção Audiovisual
// Transforma as cenas empilhadas em um palco fixo que troca de cena conforme a rolagem.
// Sem JS ou com "reduzir movimento", nada disso roda e as cenas ficam como seções comuns.
// O tracking de CTA e a entrada das seções vêm de ../js/main.js.

document.addEventListener('DOMContentLoaded', () => {
  const raiz = document.documentElement;
  const filme = document.getElementById('filme');
  const palco = filme && filme.querySelector('.palco');
  const cenas = filme ? [...filme.querySelectorAll('.cena')] : [];

  // Tela de carregamento: sai quando a primeira imagem chega (no mínimo 0,9 s, no máximo 3 s)
  // Vinheta 3D do logo, com fundo transparente. Safari e os navegadores do iPhone usam HEVC com alfa;
  // os demais, WebM com alfa. Sem movimento reduzido. Se o vídeo falhar, fica o logo parado.
  const logo3d = document.querySelector('.logo-3d');
  const webkit = /^((?!chrome|chromium|android|edg).)*safari/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (logo3d && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    logo3d.addEventListener('loadeddata', () => raiz.classList.add('logo-vivo'), { once: true });
    logo3d.addEventListener('error', () => raiz.classList.remove('logo-vivo'));
    logo3d.src = webkit ? 'assets/video/logo-3d.mov?v=2' : 'assets/video/logo-3d.webm?v=2';
    logo3d.load();
  }
  const libera = () => {
    raiz.classList.remove('carregando'); raiz.classList.add('pronto');
    if (logo3d && logo3d.src) setTimeout(() => logo3d.play().catch(() => {}), 400);   // toca uma vez, depois que a tela de carregamento some
  };
  const primeira = cenas[0] && cenas[0].querySelector('img');
  const espera = Math.max(0, 900 - performance.now());
  if (!primeira || primeira.complete) setTimeout(libera, espera);
  else {
    const pronto = () => setTimeout(libera, Math.max(0, 900 - performance.now()));
    primeira.addEventListener('load', pronto, { once: true });
    primeira.addEventListener('error', pronto, { once: true });
    setTimeout(libera, 3000);
  }

  if (!palco || !cenas.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const n = cenas.length;
  raiz.style.setProperty('--cenas', n);
  raiz.classList.add('com-rolagem');

  // Opções visuais. Padrões aprovados pelo Breno em 12/10/2026: transição lateral e vidro escuro.
  // Sem botões na página; para comparar, usar a URL: ?transicao=suave  ?painel=claro
  const param = new URLSearchParams(location.search);
  raiz.dataset.transicao = param.get('transicao') || 'lateral';
  raiz.dataset.painel = param.get('painel') || 'escuro';

  // Geometria da rolagem
  const percurso = () => filme.offsetHeight - palco.offsetHeight;
  const inicio = () => filme.getBoundingClientRect().top + window.scrollY;
  const noFilme = () => { const r = filme.getBoundingClientRect(); return r.top <= 1 && r.bottom >= window.innerHeight - 1; };
  const vai = (i) => window.scrollTo({ top: inicio() + percurso() * (i + 0.5) / n, behavior: 'smooth' });

  // Linha do tempo: um botão por etapa e um cursor que acompanha a rolagem
  const passos = filme.querySelector('.passos');
  const botoes = cenas.map((cena, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = cena.dataset.nome || String(i + 1);
    b.setAttribute('aria-label', `Ir para a cena ${i + 1}: ${cena.querySelector('h1, h2').textContent.trim()}`);
    b.addEventListener('click', () => vai(i));
    passos.appendChild(b);
    return b;
  });
  const cursor = document.createElement('i');
  cursor.className = 'cursor';
  passos.appendChild(cursor);

  // Visor de câmera: cantos de enquadramento, REC e um timecode que anda com a rolagem
  const hud = document.createElement('div');
  hud.className = 'hud'; hud.setAttribute('aria-hidden', 'true');
  hud.innerHTML = '<i></i><i></i><i></i><i></i><p class="hud-rec"><b></b>REC <span>00:00:00:00</span></p>';
  palco.appendChild(hud);
  const relogio = hud.querySelector('span');

  // Vídeo da cena: só é criado quando a cena entra, e só se data-video tiver um arquivo
  const economia = navigator.connection && navigator.connection.saveData;
  const tocaVideo = (cena, ligar) => {
    const arquivo = cena.dataset.video;
    if (!arquivo || economia) return;
    let video = cena.querySelector('video.cena-video');
    if (!video && ligar) {
      video = document.createElement('video');
      Object.assign(video, { muted: true, loop: !('umaVez' in cena.dataset), playsInline: true, preload: 'auto', src: arquivo });
      video.setAttribute('aria-hidden', 'true');
      video.className = 'cena-video';
      video.addEventListener('playing', () => video.classList.add('tocando'), { once: true });   // entra em fade por cima da imagem
      cena.querySelector('.cena-midia').appendChild(video);
    }
    if (!video) return;
    if (ligar && 'umaVez' in cena.dataset) video.currentTime = 0;   // cena que conta uma ação: sempre do começo, para no último quadro
    if (ligar) video.play().catch(() => {}); else video.pause();
  };

  // Cena com vários quadros (produção): eles se revezam sozinhos, só enquanto a cena está ativa.
  // Cada quadro fica 3,5 s (ou data-dur); a passagem é um giro de câmera, com desfoque de movimento.
  // Quadro com data-video toca o vídeo nesse intervalo. A cada quadro entra mais uma palavra no painel.
  const giros = new Map();
  const gira = (cena, ligar) => {
    const quadros = [...cena.querySelectorAll('img.quadro')];
    if (quadros.length < 2) return;
    clearTimeout(giros.get(cena));
    cena.querySelectorAll('.quadro-video').forEach((v) => v.pause());
    if (!ligar) return;
    quadros.forEach((q) => { q.loading = 'eager'; });
    const palavras = [...cena.querySelectorAll('.cena-palavras li')];
    let k = 0, anterior = -1;
    const passo = () => {
      const q = quadros[k];
      [q, quadros[(k + 1) % quadros.length]].forEach((el) => {   // o atual e o seguinte, já carregando
        if (!el.dataset.video || economia || el.videoDoQuadro) return;
        const video = document.createElement('video');
        Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto', src: el.dataset.video });
        video.className = 'quadro-video'; video.setAttribute('aria-hidden', 'true');
        el.after(video);
        el.videoDoQuadro = video;
      });
      quadros.forEach((el, m) => {
        [el, el.videoDoQuadro].forEach((alvo) => {
          if (!alvo) return;
          alvo.classList.toggle('on', m === k);
          alvo.classList.toggle('saiu', m === anterior);
          alvo.classList.toggle('primeiro', m === k && anterior === -1);
        });
        if (el.videoDoQuadro && m !== k && m !== anterior) el.videoDoQuadro.pause();
      });
      if (q.videoDoQuadro) { q.videoDoQuadro.currentTime = 0; q.videoDoQuadro.play().catch(() => {}); }
      palavras.forEach((p, m) => { p.classList.toggle('on', m <= k); p.classList.toggle('nova', m === k); });
      if (anterior !== -1) giroDeCamera(false);
      const espera = (Number(q.dataset.dur) || 3.5) * 1000;
      giros.set(cena, setTimeout(() => { anterior = k; k = (k + 1) % quadros.length; passo(); }, espera));
    };
    passo();
  };

  document.addEventListener('visibilitychange', () => { if (atual >= 0) gira(cenas[atual], !document.hidden); });

  // Reprodução automática (pedido do Breno em 12/10/2026): a abertura fica parada; quando a pessoa
  // rola para a primeira etapa, o filme segue sozinho até o fechamento. Rolar, tocar ou usar o teclado
  // devolve o controle para a pessoa. Passar o mouse num painel segura a cena para dar tempo de ler.
  let auto = false, manual = false, pausado = false, sobre = false, relogioAuto = 0, autoDesde = 0;
  const duracao = (cena) => {   // produção: 3,5 s por quadro; demais: tempo de leitura do texto, entre 3,8 e 5,5 s
    const q = cena.querySelectorAll('img.quadro').length;
    if (q > 1) return q * 3500;
    if (cena.dataset.dur) return Number(cena.dataset.dur) * 1000;   // cena com vídeo de ação: o tempo do vídeo
    const letras = (cena.querySelector('.cena-painel') || cena).textContent.replace(/\s+/g, ' ').length;
    return Math.min(5500, Math.max(3800, 1800 + letras * 22));   // mais rápido: o filme passa sozinho
  };
  const controle = document.createElement('button');
  controle.type = 'button'; controle.className = 'auto-ctl'; controle.hidden = true;
  palco.appendChild(controle);
  const pinta = () => {
    controle.hidden = atual < 1;
    const tocando = auto && !pausado;
    controle.textContent = tocando ? 'Pausar' : 'Continuar';
    controle.setAttribute('aria-label', tocando ? 'Pausar a sequência' : 'Continuar a sequência');
    hud.classList.toggle('parado', !tocando && atual >= 1);
  };
  const agenda = () => {
    clearTimeout(relogioAuto);
    pinta();
    if (!auto || pausado || sobre || atual < 1) return;
    relogioAuto = setTimeout(() => {
      if (atual >= n - 1) { auto = false; pinta(); document.getElementById('contato').scrollIntoView({ behavior: 'smooth' }); }
      else vai(atual + 1);
    }, duracao(cenas[atual]));
  };
  // Convite para rolar: clicar faz o mesmo que rolar, o filme começa e segue sozinho
  const rolar = filme.querySelector('.rolar');
  if (rolar) rolar.addEventListener('click', () => vai(1));

  controle.addEventListener('click', () => {
    if (auto) pausado = !pausado;
    else { auto = true; manual = false; pausado = false; autoDesde = performance.now(); }
    agenda();
  });
  const assume = (e) => {   // a pessoa assumiu o controle
    if (!auto || performance.now() - autoDesde < 1600) return;   // ignora a inércia do gesto que deu a partida
    if (e.type === 'keydown' && !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', ' '].includes(e.key)) return;
    auto = false; manual = true; agenda();
  };
  ['wheel', 'touchmove', 'keydown'].forEach((tipo) => window.addEventListener(tipo, assume, { passive: true }));
  palco.addEventListener('pointerover', (e) => { if (e.pointerType === 'mouse' && e.target.closest('.cena-painel')) { sobre = true; agenda(); } });
  palco.addEventListener('pointerout', (e) => { if (e.pointerType === 'mouse' && e.target.closest('.cena-painel')) { sobre = false; agenda(); } });

  // Giro de câmera: desfoque de movimento horizontal durante a troca de cena.
  // Sobe rápido, atinge o pico no meio do giro e some quando a cena assenta. Só em telas com mouse,
  // porque em celular o filtro pesa.
  const borrao = document.querySelector('#borrao-h feGaussianBlur');
  const comBorrao = borrao && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let quadroGiro = 0;
  const giroDeCamera = (deTras) => {
    cenas.forEach((c) => c.classList.toggle('de-tras', deTras));
    if (!comBorrao) return;
    cancelAnimationFrame(quadroGiro);
    palco.classList.add('movendo');
    const t0 = performance.now(), dur = 760, pico = 54;
    const passo = (t) => {
      const x = Math.min(1, (t - t0) / dur);
      borrao.setAttribute('stdDeviation', (Math.sin(Math.PI * x) ** 1.4 * pico).toFixed(1) + ' 0');
      if (x < 1) quadroGiro = requestAnimationFrame(passo);
      else { palco.classList.remove('movendo'); borrao.setAttribute('stdDeviation', '0 0'); }
    };
    quadroGiro = requestAnimationFrame(passo);
  };

  let atual = -1, fracao = 0;
  const atualiza = () => {
    const p = Math.min(0.9999, Math.max(0, (window.scrollY - inicio()) / percurso()));
    const i = Math.floor(p * n);
    fracao = p * n - i;
    passos.style.setProperty('--p', p.toFixed(4));
    // só a abertura tem fundo claro; depois do filme vem o fechamento, que é escuro
    const passou = filme.getBoundingClientRect().bottom < 80;
    raiz.dataset.tom = passou ? 'escuro' : (cenas[i].dataset.tom || 'escuro');
    const noFim = filme.getBoundingClientRect().bottom < window.innerHeight * 0.6;
    raiz.dataset.conversa = (i === 0 || noFim) ? 'off' : 'on';   // abertura e fechamento já têm os próprios botões
    raiz.classList.toggle('na-abertura', i === 0 && !passou);
    hud.classList.toggle('fora', passou);   // pausa o piscar do REC fora da tela
    const quadros = Math.round(p * n * 10 * 24);   // cada cena vale 10 s a 24 quadros
    const dois = (v) => String(v).padStart(2, '0');
    relogio.textContent = `00:${dois(Math.floor(quadros / 1440))}:${dois(Math.floor(quadros / 24) % 60)}:${dois(quadros % 24)}`;
    if (i === atual) return;
    if (atual !== -1) { hud.classList.remove('corte'); void hud.offsetWidth; hud.classList.add('corte'); }   // cantos buscam o foco
    const anterior = atual;
    atual = i;
    if (anterior !== -1) giroDeCamera(i < anterior);
    if (i === 0) { auto = false; manual = false; pausado = false; }
    else if (anterior === 0 && !manual && !auto) { auto = true; autoDesde = performance.now(); }
    agenda();
    cenas.forEach((cena, m) => {
      cena.classList.toggle('ativa', m === i);
      cena.classList.toggle('visivel', m === i);   // liga o traço ciano do título (regra da LP geral)
      cena.classList.toggle('antes', m < i);
      cena.inert = m !== i;                        // teclado e leitor de tela só veem a cena ativa
      botoes[m].setAttribute('aria-current', m === i ? 'true' : 'false');
      tocaVideo(cena, m === i);
      gira(cena, m === i);
    });
    const proxima = cenas[i + 1] && cenas[i + 1].querySelector('img');
    if (proxima) proxima.loading = 'eager';
  };

  // Encaixe: quando a rolagem para, a página assenta numa cena inteira.
  // Passou de 15% na direção do movimento, avança; senão, volta. Na última cena, descer libera o fechamento.
  let ultimoY = window.scrollY, direcao = 0, pausa = 0;
  const encaixa = () => {
    if (!noFilme()) return;
    let alvo = atual;
    if (direcao > 0 && fracao > 0.65) alvo = atual + 1;
    if (direcao < 0 && fracao < 0.35) alvo = atual - 1;
    if (alvo >= n) return;
    alvo = Math.max(0, alvo);
    const y = inicio() + percurso() * (alvo + 0.5) / n;
    if (Math.abs(window.scrollY - y) > 4) window.scrollTo({ top: y, behavior: 'smooth' });
  };
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y !== ultimoY) direcao = y > ultimoY ? 1 : -1;
    ultimoY = y;
    atualiza();
    clearTimeout(pausa);
    pausa = setTimeout(encaixa, 190);
  }, { passive: true });
  window.addEventListener('resize', () => { atual = -1; atualiza(); });
  atualiza();

  // Teclado: setas, PageUp/PageDown e espaço trocam de cena enquanto o filme ocupa a tela
  window.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || !noFilme()) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const frente = ['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey;
    const tras = ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (!frente && !tras) return;
    if (e.key === ' ' && e.target.closest('a, button')) return;   // espaço num botão continua sendo clique
    if (tras && atual === 0) return;
    e.preventDefault();
    if (frente && atual === n - 1) document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
    else vai(atual + (frente ? 1 : -1));
  });

  // Toque: deslizar o dedo para o lado troca de cena
  let toque = null;
  palco.addEventListener('touchstart', (e) => { toque = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
  palco.addEventListener('touchend', (e) => {
    if (!toque) return;
    const dx = e.changedTouches[0].clientX - toque.x, dy = e.changedTouches[0].clientY - toque.y;
    toque = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const alvo = atual + (dx < 0 ? 1 : -1);
    if (alvo >= n) document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
    else if (alvo >= 0) vai(alvo);
  }, { passive: true });

  // Painel flutuante: inclina de leve acompanhando o mouse, só em telas com cursor
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let quadro = 0;
    palco.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const r = palco.getBoundingClientRect();
        raiz.style.setProperty('--gx', (((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2) + 'deg');
        raiz.style.setProperty('--gy', (((e.clientY - r.top) / r.height - 0.5) * -4).toFixed(2) + 'deg');
      });
    });
    palco.addEventListener('pointerleave', () => { raiz.style.setProperty('--gx', '0deg'); raiz.style.setProperty('--gy', '0deg'); });
  }
});
