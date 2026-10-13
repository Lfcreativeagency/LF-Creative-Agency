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
  const libera = () => { raiz.classList.remove('carregando'); raiz.classList.add('pronto'); };
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

  // Som opcional, desligado por padrão: tom de sala sintetizado e um bipe curto a cada corte.
  // Tudo gerado no navegador, sem arquivo de áudio. Só começa depois do clique, como os navegadores exigem.
  let audio = null;
  const som = document.createElement('button');
  som.type = 'button'; som.className = 'som'; som.textContent = 'Som: off'; som.setAttribute('aria-pressed', 'false');
  som.setAttribute('aria-label', 'Ligar ou desligar o som ambiente');
  som.addEventListener('click', () => {
    if (!audio) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d = buf.getChannelData(0);
      let ult = 0;
      for (let k = 0; k < d.length; k++) { ult = (ult + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[k] = ult * 3.5; }   // ruído marrom
      const fonte = ctx.createBufferSource(); fonte.buffer = buf; fonte.loop = true;
      const filtro = ctx.createBiquadFilter(); filtro.type = 'lowpass'; filtro.frequency.value = 420;
      const ganho = ctx.createGain(); ganho.gain.value = 0;
      fonte.connect(filtro).connect(ganho).connect(ctx.destination); fonte.start();
      audio = { ctx, ganho, ligado: false };
    }
    audio.ligado = !audio.ligado;
    audio.ctx.resume();
    audio.ganho.gain.setTargetAtTime(audio.ligado ? 0.07 : 0, audio.ctx.currentTime, 0.25);
    som.textContent = audio.ligado ? 'Som: on' : 'Som: off';
    som.setAttribute('aria-pressed', String(audio.ligado));
  });
  palco.appendChild(som);
  const bipe = () => {
    if (!audio || !audio.ligado) return;
    const { ctx } = audio, o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = 1200; g.gain.setValueAtTime(0.035, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.1);
  };

  // Vídeo da cena: só é criado quando a cena entra, e só se data-video tiver um arquivo
  const economia = navigator.connection && navigator.connection.saveData;
  const tocaVideo = (cena, ligar) => {
    const arquivo = cena.dataset.video;
    if (!arquivo || economia) return;
    let video = cena.querySelector('video');
    if (!video && ligar) {
      video = document.createElement('video');
      Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto', src: arquivo });
      video.setAttribute('aria-hidden', 'true');
      const capa = cena.querySelector('img');
      if (capa) video.poster = capa.currentSrc;
      cena.querySelector('.cena-midia').appendChild(video);
    }
    if (!video) return;
    if (ligar) video.play().catch(() => {}); else video.pause();
  };

  // Cena com várias imagens (produção): elas se revezam sozinhas, só enquanto a cena está ativa.
  // Imagem parada fica 3,2 s; quadro com data-video toca o vídeo por data-dur segundos.
  // A cada quadro entra mais uma palavra no painel; quando o ciclo recomeça, a lista também.
  const giros = new Map();
  const gira = (cena, ligar) => {
    const quadros = [...cena.querySelectorAll('img.quadro')];
    if (quadros.length < 2) return;
    clearTimeout(giros.get(cena));
    cena.querySelectorAll('.quadro-video').forEach((v) => v.pause());
    if (!ligar) return;
    quadros.forEach((q) => { q.loading = 'eager'; });
    const palavras = [...cena.querySelectorAll('.cena-palavras li')];
    let k = 0;
    const passo = () => {
      quadros.forEach((q, m) => q.classList.toggle('on', m === k));
      palavras.forEach((p, m) => { p.classList.toggle('on', m <= k); p.classList.toggle('nova', m === k); });
      const q = quadros[k];
      let video = null, espera = 3200;
      if (q.dataset.video && !economia) {
        video = q.videoDoQuadro;
        if (!video) {
          video = document.createElement('video');
          Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'auto', src: q.dataset.video });
          video.className = 'quadro-video'; video.setAttribute('aria-hidden', 'true');
          q.after(video);
          q.videoDoQuadro = video;
        }
        video.currentTime = 0;
        video.play().catch(() => {});
        espera = (Number(q.dataset.dur) || 7) * 1000;
      }
      cena.querySelectorAll('.quadro-video').forEach((v) => { v.classList.toggle('on', v === video); if (v !== video) v.pause(); });
      giros.set(cena, setTimeout(() => { k = (k + 1) % quadros.length; passo(); }, espera));
    };
    passo();
  };

  document.addEventListener('visibilitychange', () => { if (atual >= 0) gira(cenas[atual], !document.hidden); });

  let atual = -1, fracao = 0;
  const atualiza = () => {
    const p = Math.min(0.9999, Math.max(0, (window.scrollY - inicio()) / percurso()));
    const i = Math.floor(p * n);
    fracao = p * n - i;
    passos.style.setProperty('--p', p.toFixed(4));
    // só a abertura tem fundo claro; depois do filme vem o fechamento, que é escuro
    const passou = filme.getBoundingClientRect().bottom < 80;
    raiz.dataset.tom = passou ? 'escuro' : (cenas[i].dataset.tom || 'escuro');
    hud.classList.toggle('fora', passou);   // pausa o piscar do REC fora da tela
    const quadros = Math.round(p * n * 10 * 24);   // cada cena vale 10 s a 24 quadros
    const dois = (v) => String(v).padStart(2, '0');
    relogio.textContent = `00:${dois(Math.floor(quadros / 1440))}:${dois(Math.floor(quadros / 24) % 60)}:${dois(quadros % 24)}`;
    if (i === atual) return;
    if (atual !== -1) { hud.classList.remove('corte'); void hud.offsetWidth; hud.classList.add('corte'); bipe(); }   // cantos buscam o foco
    atual = i;
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
