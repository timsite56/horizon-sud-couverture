/* Script commun des pages intérieures (services, zones, mentions légales)
   - menu mobile
   - accordéon FAQ
   - synchronisation depuis data/content.json : téléphone, nom d'entreprise
     ET PALETTE — si le client change sa couleur dans l'admin, toutes les
     pages intérieures suivent, exactement comme la page d'accueil. */

(function () {
  /* Menu mobile */
  var burger = document.getElementById('hamburger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () { links.classList.toggle('open'); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* FAQ */
  document.querySelectorAll('.faq-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });

  /* ── Palette : MÊME logique que l'accueil (index.html → applyContent) ──
     Toute palette ajoutée ici doit l'être aussi dans index.html, sinon les
     pages intérieures et l'accueil divergent. */
  var PALETTES = {
    noir: '#0a0a0a', bleu: '#1e6ba3', vert: '#065f46',
    orange: '#9a3412', bordeaux: '#881337', ardoise: '#334155',
    violet: '#5b21b6', brun: '#78350f', rouge: '#d60a1a'
  };
  function hexToRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
  function appliquerPalette(design) {
    var nom = (design && design.palette) || 'noir';
    var primary = PALETTES[nom] || '#0a0a0a';
    var root = document.documentElement.style;
    root.setProperty('--primary', primary);

    if (nom === 'rouge') {
      /* rouge vif en accent, texte anthracite — jamais de texte rouge foncé */
      root.setProperty('--text', '#2b3038');
      root.setProperty('--muted', 'rgba(43,48,56,0.62)');
      root.setProperty('--border', 'rgba(43,48,56,0.11)');
      root.setProperty('--surface', 'rgba(43,48,56,0.045)');
      root.setProperty('--footer-bg', '#20242b');
    } else if (primary === '#0a0a0a') {
      root.setProperty('--text', '#0a0a0a');
      root.setProperty('--muted', 'rgba(10,10,10,0.60)');
      root.setProperty('--border', 'rgba(10,10,10,0.08)');
      root.setProperty('--surface', 'rgba(10,10,10,0.04)');
      root.setProperty('--footer-bg', '#0a0a0a');
    } else {
      var pc = hexToRgb(primary), r = pc[0], g = pc[1], b = pc[2];
      var dr = Math.round(r * 0.55), dg = Math.round(g * 0.53), db = Math.round(b * 0.57);
      var fr = Math.round(r * 0.5), fg = Math.round(g * 0.5), fb = Math.round(b * 0.52);
      root.setProperty('--text', 'rgb(' + dr + ',' + dg + ',' + db + ')');
      root.setProperty('--muted', 'rgba(10,10,10,0.58)');
      root.setProperty('--border', 'rgba(' + r + ',' + g + ',' + b + ',0.12)');
      root.setProperty('--surface', 'rgba(' + r + ',' + g + ',' + b + ',0.06)');
      root.setProperty('--footer-bg', 'rgb(' + fr + ',' + fg + ',' + fb + ')');
    }
    /* Voile assombri du hero des pages : teinte de la primaire × 0.39 — c'est
       exactement le rapport qu'avait le brun d'origine avec l'orange figé.
       Sur palette noire, un gris neutre (le ×0.39 donnerait un voile trop clair). */
    if (primary === '#0a0a0a') {
      root.setProperty('--hero-overlay', 'rgba(10,10,10,0.62)');
    } else {
      var o = hexToRgb(primary);
      root.setProperty('--hero-overlay', 'rgba(' + Math.round(o[0] * 0.39) + ',' +
        Math.round(o[1] * 0.39) + ',' + Math.round(o[2] * 0.39) + ',0.72)');
    }

    var theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.setAttribute('content', primary);
  }

  fetch('data/content.json', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      appliquerPalette(d.design);
      if (d.telephone_tel) {
        document.querySelectorAll('.phone-link').forEach(function (el) { el.href = 'tel:' + d.telephone_tel; });
      }
      if (d.telephone_affiche) {
        document.querySelectorAll('.phone-text').forEach(function (el) { el.textContent = d.telephone_affiche; });
      }
      if (d.nom_entreprise) {
        document.querySelectorAll('.brand-name').forEach(function (el) { el.textContent = d.nom_entreprise; });
      }
    })
    .catch(function () { /* les valeurs écrites en dur restent affichées */ });
})();
