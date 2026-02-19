


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
function showDate2() {

    const now = new Date();

    // تاريخ بداية رمضان 2026 في تونس
    const ramadanStart = new Date("2026-02-19");
    const ramadanEnd = new Date("2026-03-20"); // 30 رمضان تقريبًا

    const hijriMonths = [
        "محرم", "صفر", "ربيع الأول", "ربيع الثاني",
        "جمادى الأولى", "جمادى الآخرة",
        "رجب", "شعبان", "رمضان",
        "شوال", "ذو القعدة", "ذو الحجة"
    ];

    const weekdays = [
        "الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"
    ];

    // ✅ إذا كنا داخل رمضان 2026
    if (now >= ramadanStart && now <= ramadanEnd) {

        const diffTime = now - ramadanStart;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const ramadanDay = diffDays + 1; // اليوم من رمضان

        const formattedHijri =
            weekdays[now.getDay()] + " " +
            ramadanDay + " رمضان 1447 هـ";

        document.getElementById("date2").innerText = formattedHijri;

    } else {

        // خارج رمضان → نحسب عادي بالمتصفح
        const formattedDate = now.toLocaleString(
            'ar-TN-u-ca-islamic',
            {
                year: 'numeric',
                month: 'long',
                day:'numeric',
                weekday: 'long'
            }
        );

        document.getElementById("date2").innerText = formattedDate;
    }
}

showDate2();



// ===============================
// 🏙 قائمة الولايات التونسية
// ===============================
// ===============================
// 🏙 Tunisian Governorates (English for API)
// ===============================
const governorates = [
    { ar: "تونس", en: "Tunis" },
    { ar: "أريانة", en: "Ariana" },
    { ar: "بن عروس", en: "Ben Arous" },
    { ar: "منوبة", en: "Manouba" },
    { ar: "بنزرت", en: "Bizerte" },
    { ar: "نابل", en: "Nabeul" },
    { ar: "زغوان", en: "Zaghouan" },
    { ar: "سوسة", en: "Sousse" },
    { ar: "المنستير", en: "Monastir" },
    { ar: "المهدية", en: "Mahdia" },
    { ar: "صفاقس", en: "Sfax" },
    { ar: "القيروان", en: "Kairouan" },
    { ar: "القصرين", en: "Kasserine" },
    { ar: "سيدي بوزيد", en: "Sidi Bouzid" },
    { ar: "قفصة", en: "Gafsa" },
    { ar: "توزر", en: "Tozeur" },
    { ar: "قبلي", en: "Kebili" },
    { ar: "مدنين", en: "Medenine" },
    { ar: "تطاوين", en: "Tataouine" },
    { ar: "الكاف", en: "El Kef" },
    { ar: "سليانة", en: "Siliana" },
    { ar: "جندوبة", en: "Jendouba" }
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
    const requests = governorates.map(gov =>
        fetch(`https://api.aladhan.com/v1/timingsByCity?city=${gov.en}&country=Tunisia&method=18`)
            .then(response => response.json())
            .then(data => ({
                city: gov.ar, // show Arabic name in ticker
                imsak: data.data.timings.Imsak,
                maghrib: data.data.timings.Maghrib
            }))
            .catch(error => {
                console.error(`Error fetching data for ${gov.en}:`, error);
                return { city: gov.ar, imsak: "00:00", maghrib: "00:00" };
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
