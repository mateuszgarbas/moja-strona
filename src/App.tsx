import { motion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReactCompareImage from "react-compare-image";

/** Kolory */
const GOLD = "#d4af37";

/** Klasy przycisków */
const whiteButtonClass =
  "transition-transform active:scale-[.98] bg-white hover:bg-neutral-200 text-black px-6 py-3 font-semibold shadow-lg rounded-2xl";

/** Opinie */
const REVIEWS: [string, string][] = [
  ["Piotr", "Sympatyczny chłopak, któremu przede wszystkim się chce trenować ludzi takich osób potrzeba pełne zaangażowanie z jego strony przyniosło efekty o których nie śniłem."],
  ["Bartosz", "Profesjonalne podejście trenerskie, zero obijania się, kontrola przy ćwiczeniach. Rezultat powyżej oczekiwania."],
  ["Dominik", "Mateusz to świetny trener personalny, profesjonalny, zaangażowany i motywujący. Dzięki niemu osiągnąłem swoje cele szybciej, niż się spodziewałem. Zdecydowanie polecam!!"],
  ["Maciej", "Serdecznie polecam współpracę z Mateuszem! Treningi są zawsze dobrze zaplanowane, dostosowane do moich celów i możliwości."],
  ["Kamil", "Naprawdę sympatyczny trener mega mi pomógł naprawdę da się z nim dogadać."],
  ["Wojciech", "Serdecznie polecam, dzięki trenerowi Mateuszowi wyszedłem ze swojej strefy komfortu i poprawiłem swoje życie."],
  ["Patrycja", "Pełen profesjonalizm, polecam 😀"],
  ["Sara", "Profesjonalista 💪 polecam z czystym sumieniem ☺️"],
  ["Ksawery", "Mateusz to świetny trener, który nie tylko mega motywuje, ale też układa skuteczne plany."],
  ["Seweryn", "Świetna robota! Trener zrobił mi plan treningowy który naprawdę działa."],
  ["Milena", "Jestem bardzo zadowolona ze współpracy, z miłą chęcią polecam!"],
  ["Miłosz", "Rewelacyjna współpraca! Trener stworzył dla mnie plan treningowy, który działa i daje satysfakcję."]
];

/** Pakiety */
const PACKAGES = [
  { title: "Pakiet Essential", features: ["Raporty co 4 tygodnie", "Pełne prowadzenie treningowe", "Monitorowanie diety"] },
  { title: "Pakiet Essential Plus", features: ["Raporty co 2 tygodnie", "Pełne prowadzenie treningowe", "Monitorowanie diety", "Kontakt w razie pytań" , "Gwarancja satysfakcji"] },
  { title: "Pakiet PRO", features: ["Raporty co tydzień", "Pełne prowadzenie treningowe", "Monitorowanie diety", "Analiza psychologiczna motywacji", "Priorytetowy kontakt" , "Gwarancja satysfakcji"] }
];

/** Hook: sprawdzanie czy element jest w widoku */
function useInView(ref: React.RefObject<HTMLElement | null>, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Komponent animujący liczby */
function CountUp({ end, duration = 1.6, suffix = "+" }: { end: number; duration?: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const start = useRef<number | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(holderRef, "-20% 0px");

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const step = (ts: number) => {
      if (start.current == null) start.current = ts;
      const p = Math.min(1, (ts - start.current) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, inView]);

  return (
    <div ref={holderRef}>
      <span>{val}</span>
      <span>{suffix}</span>
    </div>
  );
}

export default function App() {
const [placesLeft, setPlacesLeft] = useState(() => {
  const stored = localStorage.getItem("placesLeft");
  return stored !== null ? parseInt(stored) : 7; // ← 7 to wartość domyślna
});
  const countRef = useRef<HTMLSpanElement | null>(null);
  const [cartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlacesLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 155000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
localStorage.setItem("placesLeft", placesLeft.toString());
}, [placesLeft]);


useEffect(() => {
  const today = new Date();
  const isFirstDay = today.getDate() === 1;

  const lastReset = localStorage.getItem("placesLastReset");

  // Format: YYYY-MM
  const currentMonthKey = `${today.getFullYear()}-${today.getMonth() + 1}`;

  if (isFirstDay && lastReset !== currentMonthKey) {
    setPlacesLeft(7); // ← domyślna liczba miejsc
    localStorage.setItem("placesLastReset", currentMonthKey);
  }
}, []);


  useEffect(() => {
    if (countRef.current) {
      animate(parseInt(countRef.current.textContent || "0"), placesLeft, {
        duration: 0.8,
        ease: "easeOut",
        onUpdate: latest => {
          if (countRef.current) {
            countRef.current.textContent = Math.round(latest).toString();
          }
        }
      });
    }
  }, [placesLeft]);

const [isHovering] = useState(false);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    let raf = 0;
    const speed = 0.35;
    const step = () => {
      const el = marqueeRef.current;
      if (el && !isHovering) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isHovering]);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        const currentScroll = window.scrollY;
        if (currentScroll > lastScrollY && currentScroll > 50) {
          setIsVisible(false);
        } else if (lastScrollY - currentScroll > 50) {
          setIsVisible(true);
        }
        setLastScrollY(currentScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  
  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* NAV */}
      <header
        className={`sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/70 border-b border-neutral-800 shadow-md md:shadow-none transition-transform duration-300 md:translate-y-0 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 font-semibold text-lg">
            <img
              src="/assets/favicon.webp"
              alt="Logo"
              className="h-12 w-12 rounded-full border border-[#d4af37]"
              loading="lazy"
              decoding="async"
            />
            Mateusz Garbas
          </a>

          {/* Linki + przycisk */}
          <div className="hidden md:flex items-center gap-8 text-lg font-sans tracking-wide font-semibold mx-auto translate-x-[-40px]">
            <a href="#oferta" className="transition-colors duration-200 hover:text-[#d4af37]">OFERTA</a>
            <a href="#opinie" className="transition-colors duration-200 hover:text-[#d4af37]">OPINIE</a>
            <a href="#faq" className="transition-colors duration-200 hover:text-[#d4af37]">FAQ</a>
            <a
              href="#konsultacja"
              className="px-4 py-2 text-sm font-bold rounded-2xl text-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:shadow-[0_0_25px_rgba(255,255,255,1)] transition-all duration-300 md:px-8 md:py-4 md:text-xl"
            >
              Dołącz do Programu
            </a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          {/* Lewa kolumna */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold leading-tight text-center md:text-left"
            >
              Schudnij i zbuduj formę życia w 90 dni
            </motion.h1>
            <p className="mt-4 text-neutral-300 max-w-prose text-xl text-center md:text-left">
              Prowadzenie treningowe online dopasowane do Ciebie. Plany, analiza postępów i stałe wsparcie.
            </p>

            {/* Przyciski */}
            <div className="mt-6 flex gap-4 flex-wrap justify-center md:justify-start">
  <a
    href="#konsultacja"
    className="text-xl px-8 py-4 font-bold rounded-2xl text-black"
    style={{
      backgroundColor: "#fff200", // neon yellow
      boxShadow: "0 0 20px rgba(255, 242, 0, 0.9)",
      transition: "all 0.3s ease"
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.boxShadow =
        "0 0 35px rgba(255, 242, 0, 1)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.boxShadow =
        "0 0 20px rgba(255, 242, 0, 0.9)")
    }
  >
    Dołącz do Programu
  </a>
</div>

            {/* Licznik */}
            <div
              className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-2xl text-lg font-semibold mx-auto text-center"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #ffffff",
                color: "#000000"
              }}
            >
              Pozostało
              <span
                ref={countRef}
                className="text-2xl font-bold pulse-red mx-3"
                style={{ color: "red" }}
              >
                {placesLeft}
              </span>
              miejsc w tym miesiącu
            </div>
          </div>

          {/* Prawa kolumna */}
          <div className="relative">
            <picture>
              <source srcSet="/assets/trener1.webp" type="image/webp" />
              <img
                src="/assets/trener1.jpg"
                alt="Mateusz Garbas"
                loading="lazy"
                decoding="async"
                fetchPriority="high"
                className="w-full aspect-[4/5] object-cover rounded-3xl border border-neutral-700"
                style={{ transform: "scaleX(-1)" }}
              />
            </picture>
          </div>
        </div>
      </section>


         {/* DLACZEGO */}
      <section id="dlaczego" className="py-12 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2
              className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit"
              style={{
                color: GOLD,
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${GOLD}`
              }}
            >
              Dlaczego warto mi zaufać
            </h2>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/40">
              <div className="text-xl font-semibold flex items-end gap-1">
                <span className="text-3xl md:text-4xl font-bold" style={{ color: GOLD }}>
                  <CountUp end={6} suffix="+" />
                </span>
                <span>lat doświadczenia</span>
              </div>
              <div className="text-neutral-300 text-base mt-1">Setki godzin na sali i w prowadzeniu online.</div>
            </div>
            <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/40">
              <div className="text-xl font-semibold flex items-end gap-1">
                <span className="text-3xl md:text-4xl font-bold" style={{ color: GOLD }}>
                  <CountUp end={43} suffix="+" />
                </span>
                <span>zadowolonych klientów</span>
              </div>
              <div className="text-neutral-300 text-base mt-1">Realne metamorfozy i utrzymane efekty.</div>
            </div>
            <div className="rounded-2xl border border-neutral-800 p-5 bg-neutral-900/40">
              <div className="text-xl font-semibold">Gwarancja satysfakcji</div>
              <div className="text-neutral-300 text-base mt-1">Brak postępów według planu = miesiąc gratis.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRZED I PO */}
      <section id="przedpo" className="py-16 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-10 text-center px-6 py-3 rounded-2xl w-fit mx-auto"
            style={{
              color: GOLD,
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${GOLD}`
            }}
          >
            Efekty moich podopiecznych
          </h2>
          <div className="text-lg grid md:grid-cols-2 gap-8">
            {[
              {
                before: "/assets/przed2.webp",
                after: "/assets/po2.webp",
                name: "Kasia",
                desc: "3 miesiące – -8 kg, poprawa siły i wytrzymałości."
              },
              {
                before: "/assets/przed1.webp",
                after: "/assets/po1.webp",
                name: "Marek",
                desc: "1 miesiąc mini cut – -8 kg (tłuszcz i woda)."
              }
            ].map((c, idx) => (
              <div
  key={idx}
  className="rounded-2xl border border-neutral-800 p-4 bg-neutral-900/40 flex flex-col h-full"
>
  <div className="flex-grow overflow-hidden rounded-xl">
    <ReactCompareImage
      leftImage={c.before}
      rightImage={c.after}
      sliderLineColor={GOLD}
      leftImageCss={{
        objectFit: "cover",
        width: "100%",
        height: "100%",
        objectPosition: "center"
      }}
      rightImageCss={{
        objectFit: "cover",
        width: "100%",
        height: "100%",
        objectPosition: "center"
      }}
    />
  </div>
  <div className="mt-4 text-center">
    <div className="font-semibold">{c.name}</div>
    <div className="text-neutral-300 text-base min-h-[40px]">{c.desc}</div>
  </div>
</div>

            ))}
          </div>
        </div>
      </section>

      {/* WSPÓŁPRACA */}
      <section id="kroki" className="py-16 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2
              className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit"
              style={{
                color: GOLD,
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${GOLD}`
              }}
            >
              Jak wygląda współpraca krok po kroku
            </h2>
          </div>
          <div className="mt-8 grid md:grid-cols-4 gap-6">
            {[
              { t: "Konsultacja wstępna", d: "Rozmowa o Twoich celach, możliwościach i dotychczasowych doświadczeniach." },
              { t: "Analiza i plan", d: "Sprawdzamy Twoje nawyki, poziom wytrenowania i układamy plan dopasowany do Ciebie." },
              { t: "Realizacja z moim wsparciem", d: "Wdrażasz plan krok po kroku, uczysz się techniki i dobrych nawyków." },
              { t: "Stały monitoring i korekty", d: "Regularne raporty i modyfikacje planu, by efekty były maksymalne." }
            ].map((s, idx) => (
              <div key={idx} className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40 text-center">
                <div className="text-5xl font-bold mb-2" style={{ color: GOLD }}>{idx + 1}</div>
                <div className="text-xl font-semibold">{s.t}</div>
                <div className="text-base text-neutral-300 mt-1">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section id="oferta" className="py-16 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2
              className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit"
              style={{
                color: GOLD,
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${GOLD}`
              }}
            >
              Oferta
            </h2>
          </div>
         <p className="text-neutral-300 mt-2 max-w-prose mx-auto text-center text-lg">
            Wszystkie opcje zawierają pełne prowadzenie treningowe online oraz monitorowanie diety.
        </p>



          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {PACKAGES.map((p) => (
              <div key={p.title} className="rounded-2xl border border-neutral-800 p-6 pb-12 bg-neutral-900/40">
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <ul className="mt-4 space-y-2 text-lg leading-relaxed text-neutral-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: GOLD }} /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <a href="#konsultacja" className={whiteButtonClass}>Zacznij teraz</a>
                </div>
              </div>
            ))}
          </div>

          {/* Tabela porównawcza */}
          <div className="mt-12 overflow-x-auto md:overflow-x-visible">
            <table className="w-full text-xs md:text-sm border border-neutral-800 rounded-2xl overflow-hidden table-fixed">
              <thead className="bg-neutral-900/60">
                <tr>
                  <th className="p-3.5 text-left text-lg font-semibold">Funkcja</th>
                  {PACKAGES.map((p) => (
                    <th key={p.title} className="p-3.5 text-left text-lg font-semibold">{p.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { f: "Raporty", v: ["co 4 tyg.", "co 2 tyg.", "co tydzień"] },
                  { f: "Prowadzenie treningowe", v: ["✓", "✓", "✓"] },
                  { f: "Monitorowanie diety", v: ["✓", "✓", "✓"] },
                  { f: "Analiza stylu motywacji", v: ["—", "—", "✓"] },
                  { f: "Kontakt priorytetowy", v: ["—", "—", "✓"] } ,
                  { f: "Gwarancja Satysfakcji", v: ["—", "✓", "✓"] }

                ].map((row, i) => (
                  <tr key={i} className="odd:bg-neutral-950">
                    <td className="p-3.5 border-t border-neutral-800">{row.f}</td>
                    {row.v.map((val, j) => (
                      <td key={j} className="p-3.5 border-t border-neutral-800">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href="#konsultacja"
              className="px-4 py-3 rounded-2xl bg-[#bf00ff] flex items-center justify-center shadow-[0_0_15px_rgba(191,0,255,0.8)] hover:shadow-[0_0_25px_rgba(191,0,255,1)] transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
              </svg>
              <span className="hidden md:inline text-white font-bold">Dołącz do Programu</span>
            </a>
          </div>
        </div>
      </section>

      {/* OPINIE */}
      <section id="opinie" className="py-16 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2
  className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit flex items-center gap-3"
  style={{
    color: GOLD,
    background: "rgba(255, 255, 255, 0.05)",
    border: `1px solid ${GOLD}`
  }}
>
  OPINIE
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <motion.svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={GOLD}
        className="w-6 h-6"
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c.414 0 .79.26.94.65l2.12 5.18 5.66.44c.4.03.74.28.86.65.12.37.02.78-.26 1.06l-4.24 3.82 1.28 5.5c.09.39-.09.8-.45 1.02a.94.94 0 0 1-1.05-.02L12 18.77l-4.92 3.21a.94.94 0 0 1-1.05.02c-.36-.22-.54-.63-.45-1.02l1.28-5.5-4.24-3.82a1 1 0 0 1-.26-1.06c.12-.37.46-.62.86-.65l5.66-.44 2.12-5.18c.15-.39.53-.65.94-.65z"
          clipRule="evenodd"
        />
      </motion.svg>
    ))}
  </div>
</h2>
          </div>

          <div className="relative mt-8 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide">
            <div className="flex gap-5 w-max">
              {[...REVIEWS, ...REVIEWS].map(([name, text], idx) => (
                <div key={idx} className="inline-block align-top snap-center" style={{ flex: "0 0 auto" }}>
                  <div className="w-[80vw] sm:w-[340px] md:w-[360px] rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40 h-full">
                    <p className="text-base leading-relaxed text-neutral-300">“{text}”</p>
                    <div className="mt-3 text-sm text-neutral-400">— {name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA PRZEMIAN */}
      <section id="galeria" className="py-16 border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-10 text-center px-6 py-3 rounded-2xl w-fit mx-auto"
            style={{
              color: GOLD,
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${GOLD}`
            }}
          >
            Galeria przemian
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { before: "/assets/przed2.webp", after: "/assets/po2.webp", name: "Kasia", desc: "3 miesiące – -8 kg, poprawa siły i wytrzymałości." },
              { before: "/assets/przed1.webp", after: "/assets/po1.webp", name: "Marek", desc: "1 miesiąc mini cut – -8 kg (tłuszcz i woda)." },
              { before: "/assets/przed4.webp", after: "/assets/po4.webp", name: "Anna", desc: "-6 kg, wyrzeźbienie sylwetki." },
              { before: "/assets/przed3.webp", after: "/assets/po3.webp", name: "Paweł", desc: "+4 kg masy mięśniowej." },
              { before: "/assets/przed5.webp", after: "/assets/po5.webp", name: "Ola", desc: "-10 kg i poprawa kondycji." }
            ].map((c, idx) => (
              <div key={idx} className="min-w-[250px] rounded-2xl border border-neutral-800 p-4 bg-neutral-900/40 flex flex-col justify-between">
                <div className="flex gap-2">
                  <div className="relative w-1/2 aspect-[3/4]">
                    <img src={c.before} alt={`${c.name} przed`} loading="lazy" decoding="async" width="300" height="400" className="w-full h-full object-cover rounded-lg" />
                    <span className="absolute bottom-0 left-0 w-full bg-black/60 text-center text-xs text-white py-1 rounded-b-lg">Przed</span>
                  </div>
                  <div className="relative w-1/2 aspect-[3/4]">
                    <img src={c.after} alt={`${c.name} po`} loading="lazy" decoding="async" width="300" height="400" className="w-full h-full object-cover rounded-lg" />
                    <span className="absolute bottom-0 left-0 w-full bg-black/60 text-center text-xs text-white py-1 rounded-b-lg">Po</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-neutral-300 text-base min-h-[40px]">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


          {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-center" style={{ color: GOLD }}>Najczęstsze pytania</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {[
              ["Czy współpraca jest dla początkujących?", "Tak. Na początku przeprowadzam szczegółowy wywiad i przygotowuję plan dostosowany do Twojego poziomu, doświadczenia i dostępnego sprzętu."],
              ["Jak wygląda kontakt?", "W zależności od wybranego pakietu raportujesz postępy co 4, 2 lub 1 tydzień. W pakietach Essential Plus i PRO masz też stały kontakt w razie pytań."],
              ["Czy mogę trenować w domu?", "Tak – plan dopasowuję do sprzętu, którym dysponujesz, oraz czasu, jakim dysponujesz. Otrzymasz też alternatywy ćwiczeń, jeśli coś okaże się niewygodne."],
              ["Jak wygląda pierwszy miesiąc współpracy?", "Zaczynamy od szczegółowego wywiadu, aby poznać Twoje cele i możliwości. Następnie przygotowuję dla Ciebie indywidualny plan treningowy oraz ustalam praktyczne wskazówki dietetyczne. W trakcie pierwszego miesiąca regularnie raportujesz postępy (co tydzień, dwa lub cztery tygodnie – w zależności od pakietu), a ja na bieżąco wprowadzam potrzebne modyfikacje."],
              ["Jak długo trwa współpraca?", "Rekomenduję minimum 3 miesiące, aby zobaczyć pełne i trwałe efekty – choć wielu podopiecznych zostaje ze mną dłużej, by kontynuować progres."],
              ["Jak płacę?", "Płatności ustalane indywidualnie podczas konsultacji."]
            ].map(([q, a]) => (
              <div key={q} className="rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40">
                <div className="font-semibold">{q}</div>
                <div className="mt-1 text-neutral-300 text-base">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ikony social - mobile nad stopką */}
      <div className="flex justify-center gap-4 mt-8 md:hidden">
        <a
          href="https://m.me/61569722611144"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#ffffff1a] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
          aria-label="Wyślij wiadomość na Messenger"
        >
          <img src="/assets/mess.webp" alt="Messenger" className="w-10 h-10" />
        </a>
        <a
          href="https://instagram.com/mateusz.garbas"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#ffffff1a] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
          aria-label="Otwórz Instagram"
        >
          <img src="/assets/instagram.webp" alt="Instagram" className="w-10 h-10" />
        </a>
      </div>

{/* KONTAKT */}
<section id="konsultacja" className="py-16 border-t border-neutral-800">
  <div className="mx-auto max-w-6xl px-4">
    <h2 className="text-3xl font-bold text-center mb-4" style={{ color: "#fff200" }}>
      Gotowy, żeby zacząć?
    </h2>
   <div className="text-center">
  <p className="inline-block font-semibold text-neutral-800 bg-white rounded-xl px-4 py-2 text-lg mb-8 shadow">
    Kliknij w przycisk poniżej i wypełnij krótki formularz — odezwę się do Ciebie z planem działania!
  </p>
</div>
    <div className="text-center">
      <a
        href="https://forms.gle/gWb73dYNUmcmZ7Nx7"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 rounded-2xl font-bold text-black text-lg transition-all duration-300"
        style={{
          backgroundColor: "#fff200",
          boxShadow: "0 0 20px rgba(255, 242, 0, 0.9)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "0 0 35px rgba(255, 242, 0, 1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 242, 0, 0.9)")
        }
      >
        Dołącz do Programu
      </a>
    </div>
  </div>
</section>
{/* STOPKA */}
<footer className="py-10 border-t border-neutral-800 text-sm">
  <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
    <div className="text-neutral-400">
      © {new Date().getFullYear()} Mateusz Garbas. Wszelkie prawa zastrzeżone.
    </div>
    <div className="flex gap-4 text-neutral-400">
      <a
        href="https://1drv.ms/w/c/f0f134e394e04c2d/Ed0fv3lva2dLsfQFnxwQfmYBJs4TYGxIm5B33uqiQJEnJA?e=L0juVw"
        className="hover:opacity-80"
        target="_blank"
        rel="noopener"
      >
        Regulamin
      </a>
      <a
        href="https://1drv.ms/w/c/f0f134e394e04c2d/Eco7GFxaO5BPrTrDfbulBZkB_ctC1simPP2PsuG10RSznw?e=PmeuZd"
        className="hover:opacity-80"
        target="_blank"
        rel="noopener"
      >
        Polityka prywatnosci
      </a>
      <a
        href="https://1drv.ms/w/c/f0f134e394e04c2d/Edg6u4a4UrJKrkEcKGVBTS8Br5pmnYtA5aysngndYIgmCA?e=TZepIT"
        className="hover:opacity-80"
        target="_blank"
        rel="noopener"
      >
        Wysylka i platnosci
      </a>
    </div>
  </div>
</footer>



      {/* Floating Messenger / Instagram */}
      {!cartOpen && (
        <div className="hidden md:flex fixed bottom-24 right-6 flex-col gap-3 z-50">
          <a
            href="https://m.me/61569722611144"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#ffffff] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
            aria-label="Wyślij wiadomość na Messenger"
          >
            <img src="/assets/mess.webp" alt="Messenger" className="w-8 h-8" />
          </a>
          <a
            href="https://instagram.com/mateusz.garbas"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#ffffff] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
            aria-label="Otwórz Instagram"
          >
            <img src="/assets/instagram.webp" alt="Instagram" className="w-8 h-8" />
          </a>
        </div>
      )}
    </div>
  );
}
