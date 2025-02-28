
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
        const totalHours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

           // Determine display format
          let countdownText;
       if (days === 1 && hours === 0) {
          countdownText = `⏱ باقي ${totalHours} ساعة`; // If exactly 1d 0h, show total hours
        } else if (days > 0) {
          countdownText = `⏱ باقي ${days} يوم و${hours} ساعة`;
        } else if (hours > 0) {
          countdownText = `⏱ باقي ${hours} ساعة و${minutes} دقيقة`;
        } else {
          countdownText = `⏱ باقي ${minutes} دقيقة و${seconds} ثانية`;
        }
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

