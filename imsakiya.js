
   function showDate() {
            const now = new Date();
            
            const formattedDate = now.toLocaleString('ar-TN',{ year: 'numeric', month: 'long', day:'numeric',weekday: 'long'}); // Formats based on the user's locale
           
            document.getElementById("date").innerText = formattedDate;
            
        }

        showDate();
        
       function showDate2() {
            const now = new Date();
            
            const formattedDate = now.toLocaleString('ar-TN-u-ca-islamic',{ year: 'numeric', month: 'long', day:'numeric',weekday: 'long'}); // Formats based on the user's locale
           
            document.getElementById("date2").innerText = formattedDate;
            
        }

        showDate2();

// قائمة الولايات التونسية
const governorates = [
    "تونس", "أريانة", "بن عروس", "منوبة", "بنزرت", "نابل", "زغوان",
    "سوسة", "المنستير", "المهدية", "صفاقس", "القيروان", "القصرين", "سيدي بوزيد",
    "قفصة", "توزر", "قبلي", "مدنين", "تطاوين", "الكاف", "سليانة", "جندوبة"
];

let tickerInterval;

// دالة لاختيار لون عشوائي
function getRandomColor() {
    const colors = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// جلب أوقات الصلاة دفعة واحدة
async function fetchAllPrayerTimes() {
    const requests = governorates.map(city =>
        fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=TN&method=18`)
            .then(response => response.json())
            .then(data => ({
                city,
                imsak: data.data.timings.Imsak,
                maghrib: data.data.timings.Maghrib
            }))
            .catch(error => {
                console.error(`خطأ في جلب البيانات لـ ${city}:`, error);
                return { city, imsak: "00:00", maghrib: "00:00" };
            })
    );

    return Promise.all(requests);
}

// تحديث الشريط بالأوقات
async function updateTicker() {
    const prayerTimes = await fetchAllPrayerTimes();

    const tickerList = document.getElementById("timesTicker");
    tickerList.innerHTML = ""; // تفريغ القائمة قبل التحديث

    prayerTimes.forEach(({ city, imsak, maghrib }) => {
        const listItem = document.createElement("li");
        listItem.className = "ticker-item";
        const cityColor = getRandomColor(); // تحديد لون عشوائي للمدينة
        listItem.innerHTML = `🌙 <span style="color:${cityColor}; font-weight:bold; font-family:Cairo;">${city}</span>: إمساك ${imsak} - إفطار ${maghrib}`;
        tickerList.appendChild(listItem);
    });

    startTickerAnimation();
}

// حركة الشريط من الأسفل إلى الأعلى
function startTickerAnimation() {
    const tickerList = document.getElementById("timesTicker");
    let scrollAmount = 0;
    const itemHeight = document.querySelector(".ticker-item").offsetHeight;
    const totalHeight = tickerList.scrollHeight;

    function scrollUp() {
        if (scrollAmount >= totalHeight - itemHeight) {
            scrollAmount = 0;
            tickerList.style.transition = "none"; // إعادة التعيين بدون حركة مفاجئة
            tickerList.style.transform = `translateY(0px)`;
        } else {
            scrollAmount += itemHeight;
            tickerList.style.transition = "transform 0.5s ease-in-out";
            tickerList.style.transform = `translateY(-${scrollAmount}px)`;
        }
    }

    clearInterval(tickerInterval);
    tickerInterval = setInterval(scrollUp, 2000);
}

// ⏸️ إيقاف الحركة عند لمس الماوس أو الشاشة
const widget = document.getElementById("widget");
widget.addEventListener("mouseenter", () => clearInterval(tickerInterval));
widget.addEventListener("mouseleave", startTickerAnimation);
widget.addEventListener("touchstart", () => clearInterval(tickerInterval));
widget.addEventListener("touchend", startTickerAnimation);

// تشغيل الوظيفة عند تحميل الصفحة
updateTicker();


