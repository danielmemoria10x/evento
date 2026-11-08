/* Semana del SuperEstudiante · la hora en tu país, la cuenta regresiva y la barra fija */
(function () {
  var NIGHTS = [
    new Date('2026-11-30T00:00:00Z'), // domingo 29/11, 21:00 Brasília
    new Date('2026-12-01T00:00:00Z'), // lunes 30/11
    new Date('2026-12-02T00:00:00Z')  // martes 1/12
  ];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // "En tu hora": la hora de la noche 1 en el huso del navegador
  function localTime() {
    var els = document.querySelectorAll('[data-local-time]');
    if (!els.length) return;
    try {
      var fmt = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
      var txt = fmt.format(NIGHTS[0]);
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      for (var i = 0; i < els.length; i++) {
        els[i].textContent = 'En tu hora: ' + txt + (tz ? ' (' + tz.replace(/_/g, ' ') + ')' : '');
      }
    } catch (e) { /* sin Intl, la tabla fija basta */ }
  }

  // la cuenta regresiva hasta la próxima noche
  function nextNight(now) {
    for (var i = 0; i < NIGHTS.length; i++) {
      // cada noche vale hasta 90 minutos después de empezar
      if (now < NIGHTS[i].getTime() + 90 * 60 * 1000) return { date: NIGHTS[i], index: i };
    }
    return null;
  }

  function countdown() {
    var box = document.querySelector('[data-countdown]');
    if (!box) return;
    var label = document.querySelector('[data-countdown-label]');
    function tick() {
      var now = Date.now();
      var next = nextNight(now);
      if (!next) {
        box.innerHTML = '';
        if (label) label.textContent = 'Las tres noches ya pasaron. Déjanos tu correo y te avisamos de la próxima.';
        return;
      }
      var diff = Math.max(0, next.date.getTime() - now);
      if (diff === 0) {
        if (label) label.textContent = 'Estamos en vivo. Revisa tu correo o el grupo de WhatsApp para entrar.';
      } else if (label) {
        label.textContent = next.index === 0 ? 'Empezamos en' : 'La noche ' + (next.index + 1) + ' empieza en';
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      box.innerHTML =
        '<div><b>' + d + '</b><span>días</span></div>' +
        '<div><b>' + pad(h) + '</b><span>horas</span></div>' +
        '<div><b>' + pad(m) + '</b><span>min</span></div>' +
        '<div><b>' + pad(s) + '</b><span>seg</span></div>';
    }
    tick();
    setInterval(tick, 1000);
  }

  // la barra fija del celular aparece cuando el formulario sale de la pantalla
  function sticky() {
    var bar = document.querySelector('.sticky');
    var form = document.getElementById('inscripcion');
    if (!bar || !form || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      bar.classList.toggle('is-visible', !visible && window.scrollY > 300);
    }, { threshold: 0.15 });
    io.observe(form);
  }

  // el pixel: Lead en la página de gracias
  function pixelLead() {
    if (document.body.getAttribute('data-page') !== 'gracias') return;
    var tries = 0;
    (function fire() {
      if (typeof window.fbq === 'function') { window.fbq('track', 'Lead'); return; }
      if (tries++ < 50) setTimeout(fire, 100);
    })();
  }

  document.addEventListener('DOMContentLoaded', function () {
    localTime();
    countdown();
    sticky();
    pixelLead();
  });
})();
