// Compatibility shim — delegates to core.js if loaded, otherwise provides
// equivalent scroll-reveal and utility init for legacy pages.
(function () {
  if (typeof window.__h2eoCoreLoaded !== 'undefined') return; // core.js already ran
  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('ready');

    // Scroll reveal (.animate-on-scroll maps to .reveal via style-compat.css)
    var elements = Array.from(document.querySelectorAll('.animate-on-scroll, .reveal, .reveal-left, .reveal-right, .reveal-scale'));
    if ('IntersectionObserver' in window && elements.length > 0) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      elements.forEach(function (el) { observer.observe(el); });
    } else {
      elements.forEach(function (el) { el.classList.add('in-view'); });
    }

    // Smooth scroll for anchor links
    Array.from(document.querySelectorAll('a[href^="#"]')).forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id && id.length > 1) {
          var target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Trademark normalization
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var textNodes = [];
    var node = walker.nextNode();
    while (node) {
      if (node.nodeValue && node.nodeValue.includes('™')) textNodes.push(node);
      node = walker.nextNode();
    }
    textNodes.forEach(function (tn) {
      var span = document.createElement('span');
      span.innerHTML = tn.nodeValue.replace(/™/g, '<sup class="tm">™</sup>');
      tn.parentNode.replaceChild(span, tn);
    });
  });
})();
