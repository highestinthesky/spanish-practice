(function (root) {
  'use strict';
  const D = (root.Drill = root.Drill || {});

  // Every choreography in the app. Each call is a no-op (and calls `done` at once) when motion is off:
  // no GSAP (offline, blocked CDN) or prefers-reduced-motion.
  function createMotion({ G, enabled }) {
    const on = () => Boolean(G) && enabled();
    const rand = (a, b) => a + Math.random() * (b - a);
    const pickOne = (list) => list[Math.floor(Math.random() * list.length)];

    /* ---------- letters in ---------- */

    const ENTRANCES = {
      // Each letter flips up from below its baseline.
      rise(chars, delay) {
        G.fromTo(chars, { y: '0.55em', rotationX: -85, opacity: 0 },
          { y: 0, rotationX: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.032, delay, clearProps: 'transform,opacity' });
      },
      // Letters drift in from every direction and gather into the word.
      converge(chars, delay) {
        G.fromTo(chars,
          { x: () => rand(-220, 220), y: () => rand(-140, 140), rotation: () => rand(-120, 120), scale: 0.3, opacity: 0 },
          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.75, ease: 'expo.out', stagger: { each: 0.025, from: 'random' }, delay, clearProps: 'transform,opacity' });
      },
      // A ripple runs along the word.
      wave(chars, delay) {
        G.fromTo(chars, { y: '-0.9em', opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'elastic.out(1, 0.45)', stagger: 0.045, delay, clearProps: 'transform,opacity' });
      },
      // Letters spin open from the middle outwards.
      spin(chars, delay) {
        G.fromTo(chars, { scale: 0, rotation: (i) => (i % 2 ? -200 : 200), opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.6)', stagger: { each: 0.03, from: 'center' }, delay, clearProps: 'transform,opacity' });
      },
      // Letters drop in from above and bounce on the baseline.
      drop(chars, delay) {
        G.fromTo(chars, { y: () => rand(-160, -70), rotation: () => rand(-25, 25), opacity: 0 },
          { y: 0, rotation: 0, opacity: 1, duration: 0.85, ease: 'bounce.out', stagger: { each: 0.03, from: 'random' }, delay, clearProps: 'transform,opacity' });
      },
    };

    /* ---------- letters out ---------- */

    const EXITS = {
      // Up and apart from the middle.
      scatter(chars, done) {
        const mid = (chars.length - 1) / 2;
        G.to(chars, {
          x: (i) => (i - mid) * 16 + rand(-8, 8), y: () => rand(-80, -36), rotation: () => rand(-40, 40), opacity: 0,
          duration: 0.4, ease: 'power2.in', stagger: { each: 0.014, from: 'center' }, onComplete: done,
        });
      },
      // Every letter flies off on its own heading, all round the compass.
      explode(chars, done) {
        const n = chars.length;
        G.to(chars, {
          x: (i) => Math.cos((i / n) * Math.PI * 2 + rand(-0.4, 0.4)) * rand(110, 220),
          y: (i) => Math.sin((i / n) * Math.PI * 2 + rand(-0.4, 0.4)) * rand(80, 170),
          rotation: () => rand(-260, 260), scale: 0.4, opacity: 0,
          duration: 0.6, ease: 'power3.out', onComplete: done,
        });
      },
      // Gravity: letters tumble off the bottom.
      fall(chars, done) {
        G.to(chars, {
          y: () => rand(180, 320), x: () => rand(-30, 30), rotation: () => rand(-140, 140), opacity: 0,
          duration: () => rand(0.55, 0.85), ease: 'power2.in', stagger: { each: 0.02, from: 'random' }, onComplete: done,
        });
      },
      // Letters spiral into the middle and vanish.
      vortex(chars, done) {
        const mid = (chars.length - 1) / 2;
        G.to(chars, {
          x: (i) => (mid - i) * 22, y: -20, rotation: (i) => (i < mid ? 360 : -360), scale: 0, opacity: 0,
          duration: 0.55, ease: 'power2.in', stagger: { each: 0.02, from: 'edges' }, onComplete: done,
        });
      },
      // A gust blows the word away, sideways and up.
      wind(chars, done) {
        G.to(chars, {
          x: (i) => 220 + i * 12 + rand(0, 60), y: () => rand(-80, 20), rotation: () => rand(30, 110), opacity: 0,
          duration: 0.6, ease: 'power1.in', stagger: 0.025, onComplete: done,
        });
      },
    };

    let lastIn = '';
    let lastOut = '';
    const fresh = (names, last) => pickOne(names.filter((n) => n !== last));

    function enter(chars, delay = 0) {
      if (!on() || !chars.length) return;
      lastIn = fresh(Object.keys(ENTRANCES), lastIn);
      ENTRANCES[lastIn](chars, delay);
    }

    function exit(chars, done) {
      if (!on() || !chars.length) {
        if (done) done();
        return;
      }
      lastOut = fresh(Object.keys(EXITS), lastOut);
      EXITS[lastOut](chars, done);
    }

    // A detached copy of the old text leaves while the new text is already usable.
    function ghost(source, host) {
      if (!on() || !source.textContent.trim() || !source.getClientRects().length) return;
      const box = host.getBoundingClientRect();
      const r = source.getBoundingClientRect();
      const g = source.cloneNode(true);
      g.removeAttribute('id');
      g.setAttribute('aria-hidden', 'true');
      g.classList.add('ghost');
      Object.assign(g.style, {
        left: `${r.left - box.left}px`, top: `${r.top - box.top}px`, width: `${r.width}px`, height: `${r.height}px`,
        color: getComputedStyle(source).color,
      });
      host.appendChild(g);
      const chars = Array.from(g.querySelectorAll('.ch'));
      if (!chars.length) {
        G.to(g, { y: -24, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => g.remove() });
        return;
      }
      exit(chars, () => g.remove());
    }

    /* ---------- feedback ---------- */

    function burst(layer, from, n) {
      if (!on()) return;
      const box = layer.getBoundingClientRect();
      const r = from.getBoundingClientRect();
      const cx = r.left + r.width / 2 - box.left;
      const cy = r.top + r.height / 2 - box.top;
      for (let i = 0; i < n; i += 1) {
        const s = document.createElement('span');
        s.className = `spark spark-${i % 3}${i % 4 === 0 ? ' spark-round' : ''}`;
        s.style.left = `${cx}px`;
        s.style.top = `${cy}px`;
        layer.appendChild(s);
        const a = Math.random() * Math.PI * 2;
        const d = 36 + Math.random() * (n > 12 ? 190 : 100);
        G.fromTo(s, { x: -4, y: -4, scale: 1, rotation: 0, opacity: 1 }, {
          x: Math.cos(a) * d, y: Math.sin(a) * d - 24, rotation: rand(-200, 200), scale: 0.3, opacity: 0,
          duration: 0.55 + Math.random() * 0.4, ease: 'power3.out', onComplete: () => s.remove(),
        });
      }
    }

    // A ring spreads from the button that was pressed.
    function ripple(layer, from, tone = 'good') {
      if (!on()) return;
      const box = layer.getBoundingClientRect();
      const r = from.getBoundingClientRect();
      const ring = document.createElement('span');
      ring.className = `ripple ripple-${tone}`;
      Object.assign(ring.style, { left: `${r.left + r.width / 2 - box.left}px`, top: `${r.top + r.height / 2 - box.top}px` });
      layer.appendChild(ring);
      G.fromTo(ring, { scale: 0.2, opacity: 0.7 }, { scale: 3.2, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ring.remove() });
    }

    // Copies of the right answer float off like released balloons, each on its own heading,
    // while the answer itself hops in a wave.
    function balloons(chars, layer) {
      if (!on() || !chars.length) return;
      G.to(chars, { keyframes: { y: [0, -14, 0], scale: [1, 1.22, 1] }, duration: 0.42, ease: 'power1.inOut', stagger: 0.035 });
      const box = layer.getBoundingClientRect();
      for (const ch of chars) {
        if (!ch.textContent.trim()) continue;
        const r = ch.getBoundingClientRect();
        const b = ch.cloneNode(true);
        b.classList.add('balloon');
        b.setAttribute('aria-hidden', 'true');
        Object.assign(b.style, { left: `${r.left - box.left}px`, top: `${r.top - box.top}px`, font: getComputedStyle(ch).font });
        layer.appendChild(b);
        G.to(b, {
          x: rand(-90, 90), y: rand(-170, -80), rotation: rand(-50, 50), scale: rand(0.7, 1.4), opacity: 0,
          duration: rand(0.9, 1.4), ease: 'sine.out', delay: rand(0.05, 0.25), onComplete: () => b.remove(),
        });
      }
    }

    // A big streak stamp thumps onto the card, then floats off.
    function stamp(layer, text) {
      if (!on()) return;
      const s = document.createElement('span');
      s.className = 'stamp';
      s.textContent = text;
      s.setAttribute('aria-hidden', 'true');
      layer.appendChild(s);
      G.timeline({ onComplete: () => s.remove() })
        .fromTo(s, { scale: 2.6, rotation: -16, opacity: 0 }, { scale: 1, rotation: -6, opacity: 1, duration: 0.35, ease: 'back.out(2.4)' })
        .to(s, { y: -90, rotation: 4, opacity: 0, duration: 0.7, ease: 'power2.in', delay: 0.45 });
    }

    function pop(target, scale = 1.18) {
      if (!on()) return;
      G.fromTo(target, { scale: 1 }, { scale, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', clearProps: 'transform' });
    }

    function shake(target, dist = 12) {
      if (!on()) return;
      const k = [0, -dist, dist * 0.8, -dist * 0.55, dist * 0.3, 0];
      G.fromTo(target, { x: 0 }, { keyframes: { x: k }, duration: 0.42, ease: 'none', clearProps: 'transform' });
    }

    // Wrong letters drop in from above, then the missed ones pulse.
    function correction(chars) {
      if (!on()) return;
      const tl = G.timeline({ delay: 0.08 });
      tl.fromTo(chars, { opacity: 0, y: -22, rotation: -10 },
        { opacity: 1, y: 0, rotation: 0, duration: 0.42, ease: 'back.out(2.2)', stagger: 0.035, clearProps: 'transform,opacity' });
      const misses = chars.filter((c) => c.classList.contains('miss'));
      if (misses.length) tl.to(misses, { keyframes: { scale: [1, 1.3, 1] }, duration: 0.32, ease: 'power2.out', stagger: 0.05, clearProps: 'transform' });
    }

    function rise(targets, delay = 0, stagger = 0.05) {
      if (!on()) return;
      G.fromTo(targets, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, delay, stagger, ease: 'power3.out', clearProps: 'transform,opacity' });
    }

    /* ---------- choices ---------- */

    // Buttons arrive from alternating sides.
    function choicesIn(buttons, delay = 0.12) {
      if (!on()) return;
      G.fromTo(buttons, { x: (i) => (i % 2 ? 46 : -46), opacity: 0, rotation: (i) => (i % 2 ? 2 : -2) },
        { x: 0, opacity: 1, rotation: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06, delay, clearProps: 'transform,opacity' });
    }

    // The right option pops; the others tip over and fade back.
    function choicesSettle(buttons, right, picked) {
      if (!on()) return;
      const others = buttons.filter((b) => b !== right && b !== picked);
      G.to(others, { y: 8, rotation: () => rand(-5, 5), duration: 0.35, ease: 'power2.out', stagger: 0.04 });
      if (picked && picked !== right) shake(picked, 8);
      G.fromTo(right, { scale: 1 }, { keyframes: { scale: [1, 1.06, 1] }, duration: 0.4, ease: 'power2.out', delay: picked === right ? 0 : 0.25, clearProps: 'transform' });
    }

    /* ---------- surfaces ---------- */

    // The card turns over a little when the mode changes.
    function swap(card) {
      if (!on()) return;
      G.fromTo(card, { rotationX: -14, y: 22, opacity: 0, transformPerspective: 900 },
        { rotationX: 0, y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' });
    }

    // The tab underline slides to the chosen tab. Transform only: x plus a scale of a 100px bar.
    function ink(bar, tab, instant) {
      const x = tab.offsetLeft;
      const sx = tab.offsetWidth / 100;
      if (on() && !instant) G.to(bar, { x, scaleX: sx, duration: 0.45, ease: 'expo.out' });
      else bar.style.transform = `translateX(${x}px) scaleX(${sx})`;
    }

    /* ---------- ambient glyphs ---------- */

    const GLYPHS = ['¿', '¡', 'ñ', 'á', 'é', 'í', 'ó', 'ú', 'ü', '?', '!', 'ñ', 'é', '¿'];
    let floaters = [];

    // Faint Spanish marks drift behind the stage; each correct answer sends a gust through them.
    function ambient(layer) {
      if (!on() || floaters.length) return;
      for (let i = 0; i < GLYPHS.length; i += 1) {
        const wrap = document.createElement('span');
        wrap.className = 'glyph';
        wrap.style.left = `${4 + ((i * 37) % 92)}%`;
        wrap.style.top = `${20 + ((i * 53) % 74)}%`;
        const inner = document.createElement('span');
        inner.className = 'glyph-in';
        inner.textContent = GLYPHS[i];
        inner.style.fontSize = `${Math.round(rand(28, 92))}px`;
        wrap.appendChild(inner);
        layer.appendChild(wrap);
        floaters.push(wrap);
        G.fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 1.6, delay: i * 0.08 });
        G.to(inner, {
          x: () => rand(-40, 40), y: () => rand(-50, 50), rotation: () => rand(-25, 25),
          duration: () => rand(7, 13), ease: 'sine.inOut', repeat: -1, yoyo: true, repeatRefresh: true,
        });
      }
    }

    function gust(strong) {
      if (!on() || !floaters.length) return;
      G.to(floaters, {
        keyframes: { y: [0, strong ? -90 : -40, 0], rotation: [0, strong ? 30 : 12, 0] },
        duration: strong ? 1.6 : 1.1, ease: 'sine.inOut', stagger: { each: 0.03, from: 'random' },
      });
    }

    function stopAmbient() {
      for (const f of floaters) {
        if (G) G.killTweensOf(f.firstChild);
        f.remove();
      }
      floaters = [];
    }

    return {
      on, enter, exit, ghost, burst, ripple, balloons, stamp, pop, shake, correction, rise,
      choicesIn, choicesSettle, swap, ink, ambient, gust, stopAmbient,
    };
  }

  D.createMotion = createMotion;
})(typeof window !== 'undefined' ? window : globalThis);
