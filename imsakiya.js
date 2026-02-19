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

    const formattedDate = now.toLocaleString('ar-TN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    const dateElement = document.getElementById("date");
    if (dateElement) {
        dateElement.innerText = formattedDate;
    }
}


// ===============================
// 🌙 التاريخ الهجري
// ===============================
function showDate2() {

    const now = new Date();

    // تعديل يدوي إذا لزم
    now.setDate(now.getDate() + hijriAdjustment);

    const ramadanStart = new Date("2026-02-19");
    const ramadanEnd = new Date("2026-03-20");

    const weekdays = [
        "الأحد","الاثنين","الثلاثاء","الأربعاء",
        "الخميس","الجمعة","السبت"
    ];

    const dateElement = document.getElementById("date2");
    if (!dateElement) return;

    // داخل رمضان 2026
    if (now >= ramadanStart && now <= ramadanEnd) {

        const diffTime = now - ramadanStart;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const ramadanDay = diffDays + 1;

        dateElement.innerText =
            weekdays[now.getDay()] + " " +
            ramadanDay + " رمضان 1447 هـ";

    } else {

        const formattedDate = now.toLocaleString(
            'ar-TN-u-ca-islamic',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
            }
        );

        dateElement.innerText = formattedDate;
    }
}


// ===============================
// 🏙 قائمة الولايات التونسية
// ===============================
const governorates = [
    "تونس", "أريانة", "بن عروس", "منوبة", "بنزرت", "نابل", "زغوان",
    "سوسة", "المنستير", "المهدية", "صفاقس", "القيروان", "القصرين",
    "سيدي بوزيد", "قفصة", "توزر", "قبلي", "مدنين", "تطاوين",
    "الكاف", "سليانة", "جندوبة"
];

let tickerInterval;


// ===============================
// 🎨 لون عشوائي
// ===============================
function getRandomColor() {
    const colors = [
        "#e6194b", "#3cb44b", "#ffe119", "#4363d8",
        "#f58231", "#911eb4", "#46f0f0",
        "#f032e6", "#bcf60c", "#fabebe"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}


// ===============================
// 🕌 جلب أوقات الصلاة
// ===============================
async function fetchAllPrayerTimes() {

    const requests = governorates.map(city =>
        fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Tunisia&method=18`)
            .then(response => response.json())
            .then(data => {

                if (!data || !data.data || !data.data.timings) {
                    return null;
                }

                return {
                    city,
                    imsak: data.data.timings.Imsak || "--:--",
                    maghrib: data.data.timings.Maghrib || "--:--"
                };
            })
            .catch(() => null)
    );

    const results = await Promise.all(requests);

    return results.filter(item => item !== null);
}


// ===============================
// 🔄 تحديث الشريط
// ===============================
async function updateTicker() {

    const tickerList = document.getElementById("timesTicker");
    if (!tickerList) return;

    tickerList.innerHTML =
        "<li class='ticker-item'>⏳ جاري تحميل أوقات الصلاة...</li>";

    const prayerTimes = await fetchAllPrayerTimes();

    tickerList.innerHTML = "";

    if (prayerTimes.length === 0) {
        tickerList.innerHTML =
            "<li class='ticker-item'>⚠ تعذر تحميل البيانات</li>";
        return;
    }

    prayerTimes.forEach(({ city, imsak, maghrib }) => {

        const listItem = document.createElement("li");
        listItem.className = "ticker-item";

        const cityColor = getRandomColor();

        listItem.innerHTML =
            `🌙 <span style="color:${cityColor}; font-weight:bold; font-family:Cairo;">${city}</span>:
            إمساك ${imsak} - إفطار ${maghrib}`;

        tickerList.appendChild(listItem);
    });

    startTickerAnimation();
}


// ===============================
// ⬆ حركة الشريط
// ===============================
function startTickerAnimation() {

    const tickerList = document.getElementById("timesTicker");
    if (!tickerList) return;

    const firstItem = document.querySelector(".ticker-item");
    if (!firstItem) return;

    let scrollAmount = 0;
    const itemHeight = firstItem.offsetHeight;
    const totalHeight = tickerList.scrollHeight;

    clearInterval(tickerInterval);

    tickerInterval = setInterval(() => {

        if (scrollAmount >= totalHeight - itemHeight) {

            scrollAmount = 0;
            tickerList.style.transition = "none";
            tickerList.style.transform = `translateY(0px)`;

        } else {

            scrollAmount += itemHeight;
            tickerList.style.transition = "transform 0.5s ease-in-out";
            tickerList.style.transform = `translateY(-${scrollAmount}px)`;
        }

    }, 2000);
}


// ===============================
// ⏸ إيقاف الحركة عند التفاعل
// ===============================
function setupWidgetEvents() {

    const widget = document.getElementById("widget");
    if (!widget) return;

    widget.addEventListener("mouseenter", () =>
        clearInterval(tickerInterval)
    );

    widget.addEventListener("mouseleave", startTickerAnimation);

    widget.addEventListener("touchstart", () =>
        clearInterval(tickerInterval)
    );

    widget.addEventListener("touchend", startTickerAnimation);
}


// ===============================
// 🚀 تشغيل بعد تحميل الصفحة بالكامل
// ===============================
document.addEventListener("DOMContentLoaded", async function () {

    showDate();
    showDate2();
    setupWidgetEvents();

    await updateTicker();
});
