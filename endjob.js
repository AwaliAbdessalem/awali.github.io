
  document.querySelectorAll(".job").forEach(job => {
    const endDate = new Date(job.getAttribute("end-date"));
    const statusElement = job.querySelector(".status");

    function updateCountdown() {
      const now = new Date();
      const timeRemaining = endDate - now;

      if (timeRemaining <= 0) {
        // Job has ended
        statusElement.innerHTML = '<div class="alert alert-danger" role="alert">انتهى أجل التسجيل</div>';
      } else {
        // Calculate days, hours, minutes, and seconds
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

           // Determine display format
        const countdownText = days > 0 
          ? `⏱ باقي ${days} يوم و${hours} ساعة `
          : `⏱ باقي ${hours} ساعة و${minutes} دقيقة `;

        // Update the countdown in a Bootstrap alert
        statusElement.innerHTML = `
          <div class="alert alert-success" role="alert">
            التسجيل مفتوح - ${countdownText}
          </div>
        `;
      }
    }

    // Update countdown immediately and set an interval to update it every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });

