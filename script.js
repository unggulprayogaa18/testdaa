document.addEventListener("DOMContentLoaded", function () {


    

    // --- 1. SCROLLYTELLING LOGIC ---
    const section = document.getElementById("scrolly-section");
    const texts = section.querySelectorAll(".scroll-text");
    const progressBar = document.querySelector(".scrolly-progress-bar");

    window.addEventListener("scroll", function () {
        if (!section) return; // Mencegah error jika section tidak ada
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;

        let progress = -sectionTop / (sectionHeight - windowHeight);
        progress = Math.max(0, Math.min(1, progress));

        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }

        texts.forEach(text => text.classList.remove("active"));

        if (progress < 0.33) {
            if (texts[0]) texts[0].classList.add("active");
        } else if (progress >= 0.33 && progress < 0.66) {
            if (texts[1]) texts[1].classList.add("active");
        } else {
            if (texts[2]) texts[2].classList.add("active");
        }
    });

    // --- 2. SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambahkan class 'active' saat elemen masuk ke layar
                entry.target.classList.add("active");
                // Stop mengamati setelah animasi selesai agar tidak mengulang-ulang terus
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Animasi mulai saat 15% bagian elemen terlihat
        rootMargin: "0px 0px -50px 0px" // Trigger sedikit sebelum elemen benar-benar menyentuh batas bawah layar
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 3.splash screen logic

  const splashScreen = document.querySelector('.splash-screen');
    const percentageText = document.querySelector('.loading-percentage');
    
    if (splashScreen) {
        document.body.style.overflow = 'hidden'; // Kunci scroll

        // Animasi angka persentase dari 0 ke 100
        let percentage = 0;
        const interval = setInterval(() => {
            percentage += Math.floor(Math.random() * 5) + 2; // Naik secara acak antara 2-6%
            if (percentage >= 100) {
                percentage = 100;
                clearInterval(interval);
            }
            if (percentageText) percentageText.innerText = `${percentage}%`;
        }, 50);

        // Hilangkan splash screen setelah 3.2 detik
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Buka kunci scroll
            
            setTimeout(() => {
                splashScreen.remove();
            }, 800);
        }, 3200); 
    }



    // 4 pesawat

  const flightSection = document.getElementById('animated-cta-section');
    
    // Element Pesawat Utama
    const mainPath = document.getElementById('flight-route-main');
    const mainPlane = document.getElementById('airplane-main');
    
    // Element Pesawat Intruder
    const intruderPath = document.getElementById('flight-route-intruder');
    const intruderPlane = document.getElementById('airplane-intruder');

    if (flightSection && mainPath && mainPlane && intruderPath && intruderPlane) {
        // Ambil total panjang masing-masing garis
        const mainLen = mainPath.getTotalLength();
        const intruderLen = intruderPath.getTotalLength();

        window.addEventListener('scroll', () => {
            const rect = flightSection.getBoundingClientRect();
            
            // Kalkulasi persentase scroll (0 sampai 1) saat section terlihat di layar
            const scrollStart = window.innerHeight; 
            const scrollEnd = -rect.height; 
            let progress = (scrollStart - rect.top) / (scrollStart - scrollEnd);
            progress = Math.max(0, Math.min(1, progress));

            // --- TAMBAHAN: Logika Fade Out ---
            // Mulai memudar saat animasi mencapai 85% (0.85) sampai 100% (1.0)
            let planeOpacity = 1;
            if (progress > 0.85) {
                // Konversi sisa jarak 0.15 menjadi rentang 1 ke 0
                planeOpacity = 1 - ((progress - 0.85) / 0.15); 
            }
            
            // Terapkan tingkat opacity ke elemen pesawat
            mainPlane.style.opacity = Math.max(0, planeOpacity);
            intruderPlane.style.opacity = Math.max(0, planeOpacity);
            // ---------------------------------

            // --- 1. Animasi Pesawat Utama (Melengkung Hindar) ---
            const ptMain = mainPath.getPointAtLength(progress * mainLen);
            const ptMainNext = mainPath.getPointAtLength(Math.min((progress * mainLen) + 1, mainLen));
            // Kalkulasi sudut kemiringan moncong pesawat utama
            const angleMain = Math.atan2(ptMainNext.y - ptMain.y, ptMainNext.x - ptMain.x) * (180 / Math.PI);
            mainPlane.setAttribute('transform', `translate(${ptMain.x}, ${ptMain.y}) rotate(${angleMain})`);

            // --- 2. Animasi Pesawat Intruder (Lurus Berlawanan) ---
            const ptIntruder = intruderPath.getPointAtLength(progress * intruderLen);
            const ptIntruderNext = intruderPath.getPointAtLength(Math.min((progress * intruderLen) + 1, intruderLen));
            // Kalkulasi sudut kemiringan moncong pesawat intruder
            const angleIntruder = Math.atan2(ptIntruderNext.y - ptIntruder.y, ptIntruderNext.x - ptIntruder.x) * (180 / Math.PI);
            intruderPlane.setAttribute('transform', `translate(${ptIntruder.x}, ${ptIntruder.y}) rotate(${angleIntruder})`);
        });

        // Trigger animasi sekali saat pertama kali halaman dimuat
        window.dispatchEvent(new Event('scroll'));
    }

    // ==========================================
    // 7. PARTNER SCROLLYTELLING LOGIC
    // ==========================================
    const partnerScrolly = document.getElementById('partner-scrolly');
    const pPhase1 = document.querySelector('.p-phase-1');
    const pPhase2 = document.querySelector('.p-phase-2');

    if (partnerScrolly && pPhase1 && pPhase2) {
        window.addEventListener('scroll', () => {
            const rect = partnerScrolly.getBoundingClientRect();
            
            // Hitung progress scroll di dalam section partner (0.0 sampai 1.0)
            let scrollProgress = -rect.top / (rect.height - window.innerHeight);

            // Eksekusi hanya jika area terlihat di viewport
            if (scrollProgress >= -0.2 && scrollProgress <= 1.2) {
                // Di bawah 50% scroll = Kiri (Phase 1)
                if (scrollProgress < 0.5) {
                    pPhase1.classList.add('active');
                    pPhase2.classList.remove('active');
                } 
                // Di atas 50% scroll = Kanan (Phase 2)
                else {
                    pPhase1.classList.remove('active');
                    pPhase2.classList.add('active');
                }
            }
        });
    }

    // ==========================================
    // 8. PAGE TRANSITION (SCROLL TO BOTTOM)
    // ==========================================
    let isRedirecting = false;
    const transitionOverlay = document.getElementById('page-transition-overlay');
    const transitionBar = document.querySelector('.transition-bar');

    window.addEventListener('scroll', () => {
        // Kalkulasi posisi scroll saat ini.
        // Math.ceil digunakan untuk menghindari nilai pecahan yang mencegah trigger di beberapa browser.
        // Angka 10 adalah threshold (toleransi 10px dari batas bawah) agar lebih responsif.
        const scrollPosition = Math.ceil(window.innerHeight + window.scrollY);
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= documentHeight - 10) {
            if (!isRedirecting && transitionOverlay) {
                isRedirecting = true; // Kunci agar tidak ter-trigger berulang kali
                
                // Mencegah scroll lebih lanjut
                document.body.style.overflow = 'hidden'; 
                
                // 1. Munculkan layar transisi
                transitionOverlay.classList.add('active');

                // 2. Animasikan loading bar setelah layar terangkat penuh (0.8 detik)
                setTimeout(() => {
                    if (transitionBar) transitionBar.style.width = '100%';
                }, 800);

                // 3. Arahkan ke halaman Cargo setelah animasi selesai
                setTimeout(() => {
                    window.location.href = 'https://revnaerocargo.vercel.app/';
                }, 2200); // Tunggu 2.2 detik (0.8s slide + 1.2s loading + 0.2s jeda)
            }
        }
    });
});
