/* =========================================================
   Portfolio — Takwa Zaghdoudi
   ========================================================= */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Année du footer ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Navigation : fond au scroll + menu mobile ---------- */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- Lien actif selon la section visible ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navMap = {};
  links.querySelectorAll("a").forEach(a => (navMap[a.getAttribute("href").slice(1)] = a));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        Object.values(navMap).forEach(a => a.classList.remove("is-active"));
        navMap[e.target.id]?.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => spy.observe(s));

  /* ---------- Apparition au scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal, .langs");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(el => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Filtre des projets ---------- */
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  filters.forEach(btn =>
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const f = btn.dataset.filter;
      projects.forEach(p => {
        const show = f === "all" || p.dataset.cat.split(" ").includes(f);
        p.classList.toggle("is-hidden", !show);
        if (show) p.classList.add("is-visible");
      });
    })
  );

  /* ---------- Terminal animé ---------- */
  const term = document.getElementById("terminal");
  const script = [
    { t: "p", s: "takwa@iset:~$ " }, { t: "", s: "whoami\n" },
    { t: "ok", s: "étudiante L3 RSI — ISET Radès\n" },
    { t: "p", s: "takwa@iset:~$ " }, { t: "", s: "cat interets.txt\n" },
    { t: "", s: "réseaux · sécurité · cloud · systèmes\n" },
    { t: "p", s: "takwa@iset:~$ " }, { t: "", s: "ping stage.entreprise\n" },
    { t: "ok", s: "64 bytes: icmp_seq=1 ttl=64 — prête !\n" },
    { t: "p", s: "takwa@iset:~$ " }
  ];

  const render = (upTo, partial) => {
    let html = "";
    script.forEach((line, i) => {
      if (i > upTo) return;
      const txt = i === upTo ? line.s.slice(0, partial) : line.s;
      const safe = txt.replace(/&/g, "&amp;").replace(/</g, "&lt;");
      html += line.t ? `<span class="${line.t}">${safe}</span>` : safe;
    });
    term.innerHTML = html + '<span class="caret"></span>';
  };

  if (reduceMotion) {
    render(script.length - 1, Infinity);
  } else {
    let i = 0, c = 0;
    const tick = () => {
      if (i >= script.length) return;
      const line = script[i];
      // le prompt et les réponses s'affichent d'un coup, les commandes se "tapent"
      const instant = line.t === "p" || line.t === "ok" || (i > 0 && script[i - 1].t !== "p");
      if (instant) { render(i, line.s.length); i++; c = 0; setTimeout(tick, 350); return; }
      c++;
      render(i, c);
      if (c >= line.s.length) { i++; c = 0; setTimeout(tick, 300); }
      else setTimeout(tick, 45 + Math.random() * 45);
    };
    setTimeout(tick, 600);
  }

  /* ---------- Fond "topologie réseau" ---------- */
  const canvas = document.getElementById("netCanvas");
  const ctx = canvas.getContext("2d");
  let nodes = [], w, h, dpr, raf;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth; h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(70, (w * h) / 22000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      r: Math.random() * 1.6 + .8
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const max = 140;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < max) {
          ctx.strokeStyle = `rgba(96,165,250,${(1 - d / max) * .35})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.fillStyle = "rgba(45,212,191,.85)";
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    });
  };

  const step = () => {
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });
    draw();
    raf = requestAnimationFrame(step);
  };

  resize();
  if (reduceMotion) draw(); else step();

  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => { cancelAnimationFrame(raf); resize(); reduceMotion ? draw() : step(); }, 200);
  });

  // pause de l'animation quand l'onglet est caché
  document.addEventListener("visibilitychange", () => {
    if (reduceMotion) return;
    if (document.hidden) cancelAnimationFrame(raf); else step();
  });
})();
