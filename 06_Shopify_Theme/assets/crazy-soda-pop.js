/**
 * Crazy Soda Pop — minimal homepage enhancements
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.csp-header');
    if (!header) return;

    var clubLink = header.querySelector('a[href*="soda-discovery"], a[href*="subscription"]');
    if (clubLink) {
      clubLink.classList.add('csp-nav-club-highlight');
    }
  });
})();
