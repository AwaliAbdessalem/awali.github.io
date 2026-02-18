

// ===============================
// 🔹 تعديل يدوي للتاريخ الهجري
// 0 = بدون تعديل
// 1 = + يوم
// -1 = - يوم
// ===============================
const hijriAdjustment = 1;



// ===============================
// 📅 التاريخ الميلادي
// ===============================
function showDate() {
    const now = new Date();
    
    const formattedDate = now.toLocaleString('ar-TN',{
        year: 'numeric',
        month: 'long',
        day:'numeric',
        weekday: 'long'
    });
   
    document.getElementById("date").innerText = formattedDate;
}

showDate();



// ===============================
// 🌙 التاريخ الهجري (API + تعديل يدوي)
// ===============================
async function showDate2() {
    try {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const response = await fetch(
            `https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}&adjustment=${hijriAdjustment}`
        );

        const data = await response.json();
        const hijri = data.data.hijri;

        const formattedHijri =
            hijri.weekday.ar + " " +
            hijri.day + " " +
            hijri.month.ar + " " +
            hijri.year + " هـ";

        document.getElementById("date2").innerText = formattedHijri;

    } catch (error) {
        document.getElementById("date2").innerText = "تعذر تحميل التاريخ الهجري";
        console.error("Hijri error:", error);
    }
}

showDate2();



// ===============================
// 🏙 قائمة الولايات التونسية
// ===============================
const governorates = [
    "تونس", "أريانة", "بن عروس", "منوبة", "بنزرت", "نابل", "زغوان",
    "سوسة", "المنستير", "المهدية", "صفاقس", "القيروان", "القصرين", "سيدي بوزيد",
    "قفصة", "توزر", "قبلي", "مدنين", "تطاوين", "الكاف", "سليانة", "جندوبة"
];

let tickerInterval;



// ===============================
// 🎨 لون عشوائي
// ===============================
function getRandomColor() {
    const colors = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe"];
    return colors[Math.floor(Math.random() * colors.length)];
}



// ===============================
// 🕌 جلب أوقات الصلاة
// ===============================
async function fetchAllPrayerTimes() {
    const requests = governorates.map(city =>
        fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Tunisia&method=18`)
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



// ===============================
// 🔄 تحديث الشريط
// ===============================
async function updateTicker() {
    const prayerTimes = await fetchAllPrayerTimes();

    const tickerList = document.getElementById("timesTicker");
    tickerList.innerHTML = "";

    prayerTimes.forEach(({ city, imsak, maghrib }) => {
        const listItem = document.createElement("li");
        listItem.className = "ticker-item";

        const cityColor = getRandomColor();

        listItem.innerHTML =
            `🌙 <span style="color:${cityColor}; font-weight:bold; font-family:Cairo;">${city}</span>: إمساك ${imsak} - إفطار ${maghrib}`;

        tickerList.appendChild(listItem);
    });

    startTickerAnimation();
}



// ===============================
// ⬆ حركة الشريط
// ===============================
function startTickerAnimation() {
    const tickerList = document.getElementById("timesTicker");

    if (!document.querySelector(".ticker-item")) return;

    let scrollAmount = 0;
    const itemHeight = document.querySelector(".ticker-item").offsetHeight;
    const totalHeight = tickerList.scrollHeight;

    function scrollUp() {
        if (scrollAmount >= totalHeight - itemHeight) {
            scrollAmount = 0;
            tickerList.style.transition = "none";
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



// ===============================
// ⏸ إيقاف الحركة عند التفاعل
// ===============================
const widget = document.getElementById("widget");

if (widget) {
    widget.addEventListener("mouseenter", () => clearInterval(tickerInterval));
    widget.addEventListener("mouseleave", startTickerAnimation);
    widget.addEventListener("touchstart", () => clearInterval(tickerInterval));
    widget.addEventListener("touchend", startTickerAnimation);
}



// ===============================
// 🚀 تشغيل عند تحميل الصفحة
// ===============================
updateTicker();

