document.getElementById('redirectBtn').addEventListener('click', function () {
    let seconds = 10;
    const btn = this;
    const redirectUrl = btn.getAttribute('data-url');

    btn.disabled = true;
    btn.style.background = '#6c757d';
    btn.textContent = `انتظر قليلا سيتم توجيهك خلال ${seconds} ثواني...`;

    const interval = setInterval(() => {
      seconds--;
      if (seconds > 0) {
        btn.textContent = `سيتم توجيهك خلال ${seconds} ثواني...`;
      } else {
        clearInterval(interval);
        window.location.href = redirectUrl;
      }
    }, 1000);
  });
