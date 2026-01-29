document.querySelectorAll(".job").forEach(job => {
  const endDate = new Date(job.getAttribute("end-date"));
  const statusElement = job.querySelector(".status");

  // تنسيق التاريخ بالعربي
  function formatDate(date) {
    return date.toLocaleDateString("ar-TN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function updateCountdown() {
    const now = new Date();
    const timeRemaining = endDate - now;

    if (timeRemaining <= 0) {
      // التسجيل انتهى
      statusElement.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ⛔ انتهى أجل التسجيل<br>
          📅 تاريخ انتهاء التسجيل: <strong>${formatDate(endDate)}</strong>
        </div>
      `;
    } else {
      const totalHours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      let countdownText;
      if (days === 1 && hours === 0) {
        countdownText = `⏱ باقي ${totalHours} ساعة`;
      } else if (days > 0) {
        countdownText = `⏱ باقي ${days} يوم و${hours} ساعة`;
      } else if (hours > 0) {
        countdownText = `⏱ باقي ${hours} ساعة و${minutes} دقيقة`;
      } else {
        countdownText = `⏱ باقي ${minutes} دقيقة و${seconds} ثانية`;
      }

      statusElement.innerHTML = `
        <div class="alert alert-success" role="alert">
          التسجيل مفتوح<br>
          ${countdownText}<br>
          📅 آخر أجل: ${formatDate(endDate)}
        </div>
      `;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
