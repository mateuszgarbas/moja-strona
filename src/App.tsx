import { motion, animate} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReactCompareImage from "react-compare-image";


// const GOLD = "#d4af37"; // jeśli już masz, to usuń ten duplikat


/** Kolory */

const GOLD = "#d4af37";
const CartIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);


/** Klasy przycisków */
const goldButtonClass =
  "transition-transform active:scale-[.98] bg-gold hover:bg-gold-hover text-black font-semibold shadow-lg rounded-2xl";
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
  { title: "Pakiet Essential Plus", features: ["Raporty co 2 tygodnie", "Pełne prowadzenie treningowe", "Monitorowanie diety", "20% zniżki na e-booki", "Analiza psychologiczna stylu motywacji", "Kontakt w razie pytań"] },
  { title: "Pakiet PRO", features: ["Raporty co tydzień", "Pełne prowadzenie treningowe", "Monitorowanie diety", "E-book gratis", "Analiza psychologiczna stylu motywacji", "Priorytetowy kontakt"] }
];

/** Produkty (e-booki) */
const PRODUCTS = [
  { id: 1, title: "7 mitów o hipertrofii mięśniowej, które blokują Twój progres", desc: "...", priceCents: 8900, image: "/assets/ebook1.png" },
  { id: 2, title: "Jak jeść smacznie, zdrowo i skutecznie – bez restrykcyjnych diet", desc: "...", priceCents: 8900, image: "/assets/ebook2.png" }
];

/** Utils */
function formatPLN(cents: number): string {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(cents / 100);
}

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
  const [placesLeft, setPlacesLeft] = useState(7);
const countRef = useRef<HTMLSpanElement | null>(null);

useEffect(() => {
  const timer = setInterval(() => {
    setPlacesLeft(prev => (prev > 0 ? prev - 1 : 0));
  }, 155000);
  return () => clearInterval(timer);
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

  const [isHovering, setIsHovering] = useState(false);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  type CartItem = { id: number; title: string; priceCents: number; qty: number };
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const addToCart = (productId: number) => {
    const p = PRODUCTS.find((x) => x.id === productId);
    if (!p) return;
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === p.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { id: p.id, title: p.title, priceCents: p.priceCents, qty: 1 }];
    });
    setCartOpen(true);
  };

  const inc = (id: number) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id: number) => setCart((prev) => prev.flatMap((i) => (i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i])));
  const removeItem = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));
  const subtotal = cart.reduce((sum, i) => sum + i.priceCents * i.qty, 0);

  const checkout = () => {
    const payload = { items: cart.map((i) => ({ id: i.id, qty: i.qty })), amountCents: subtotal, method: "przelewy24" };
    console.log("Checkout payload (Przelewy24):", payload);
    alert("Symulacja płatności Przelewy24 — payload w konsoli.");
  };
const [isVisible, setIsVisible] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    if (window.innerWidth < 768) { // tylko mobile
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollY && currentScroll > 50) {
        // przewijanie w dół i nie jesteśmy na samej górze
        setIsVisible(false);
      } else if (lastScrollY - currentScroll > 50) {
        // przewijanie w górę o więcej niż 50px
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
      <a href="#top" className="flex items-center gap-2 font-semibold text-lg">
        <img src="/assets/favicon.png" alt="Logo" className="h-12 w-12 rounded-full border border-[#d4af37]" />
        Mateusz Garbas
      </a>

        <div className="hidden md:flex items-center gap-8 text-lg font-sans tracking-wide font-semibold">
          <a href="#oferta" className="transition-colors duration-200 hover:text-[#d4af37]">OFERTA</a>
          <a href="#ebooki" className="transition-colors duration-200 hover:text-[#d4af37]">E-BOOKI</a>
          <a href="#opinie" className="transition-colors duration-200 hover:text-[#d4af37]">OPINIE</a>
          <a href="#faq" className="transition-colors duration-200 hover:text-[#d4af37]">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <button
  onClick={() => setCartOpen(true)}
  className="relative rounded-2xl border border-neutral-700 p-2 hover:border-[#d4af37]"
  aria-label="Koszyk"
>
  <CartIcon className="w-6 h-6" />
  {cart.length > 0 && (
    <span className="absolute -top-2 -right-2 text-xs bg-white text-black rounded-full px-2 py-0.5">
      {cart.reduce((n, i) => n + i.qty, 0)}
    </span>
  )}
</button>

         <a
  href="#konsultacja"
  className="px-4 py-2 text-sm font-bold rounded-2xl text-black bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:shadow-[0_0_25px_rgba(255,255,255,1)] transition-all duration-300 md:px-8 md:py-4 md:text-xl"
>
  Umów konsultację
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
    backgroundColor: "#d4af37", // złote tło
    boxShadow: "0 0 15px rgba(212, 175, 55, 0.8)",
    transition: "all 0.3s ease"
  }}
  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 0 25px rgba(212, 175, 55, 1)"}
  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 0 15px rgba(212, 175, 55, 0.8)"}
>
  Umów konsultację
</a>

        <a href="#ebooki" className="rounded-2xl border border-neutral-700 px-8 py-4 text-xl font-bold hover:border-[#d4af37]">
          Zobacz e-booki  
        </a>
      </div>

      {/* Licznik */}
      <div
  className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-2xl text-lg font-semibold mx-auto text-center"
  style={{
    backgroundColor: "#ffffff", // białe tło
    border: "1px solid #ffffff",
    color: "#000000" // czarny tekst
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

    {/* Prawa kolumna (obrazek) */}
    <div className="relative">
      <img
        src="/assets/trener1.jpg"
        alt="Mateusz Garbas"
        className="w-full aspect-[4/5] object-cover rounded-3xl border border-neutral-700"
      />
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
          before: "/assets/przed2.png",
          after: "/assets/po2.png",
          name: "Kasia",
          desc: "3 miesiące – -8 kg, poprawa siły i wytrzymałości."
        },
        {
          before: "/assets/przed1.png",
          after: "/assets/po1.png",
          name: "Marek",
          desc: "5 miesięcy – +5 kg masy mięśniowej."
        }
      ].map((c, idx) => (
       <div
  key={idx}
  className="rounded-2xl border border-neutral-800 p-4 bg-neutral-900/40 flex flex-col justify-between h-full"
>
<div className="w-full aspect-[3/4] overflow-hidden rounded-xl">
  <div className="w-full h-full">
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
            { t: "Konsultacja wstępna", d: "PRozmowa o Twoich celach, możliwościach i dotychczasowych doświadczeniach." },
            { t: "Analiza i plan", d: "ASprawdzamy Twoje nawyki, poziom wytrenowania i układamy plan dopasowany do Ciebie." },
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
          Wszystkie opcje zawierają pełne prowadzenie treningowe online oraz monitorowanie diety. Do każdego pakietu dorzucam gwarancję satysfakcji – jeśli nie zrobisz postępu wg planu i raportów, otrzymasz kolejny miesiąc gratis pod moją opieką.
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
      { f: "Zniżka na e-booki / e-book", v: ["—", "20%", "E-book gratis"] },
      { f: "Analiza stylu motywacji", v: ["—", "✓", "✓"] },
      { f: "Kontakt priorytetowy", v: ["—", "—", "✓"] }
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
  {/* Mobile: ikona SVG */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-white md:hidden"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
    />
  </svg>

  {/* Desktop: tekst */}
  <span className="hidden md:inline text-white font-bold">Umów konsultację</span>
</a>



</div>

      </div>
    </section>

    {/* WIDEO O MNIE */}
    <section id="o-mnie-wideo" className="py-16 border-t border-neutral-800">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold text-center" style={{ color: GOLD }}>Poznaj mnie lepiej</h2>
        <p className="text-neutral-300 mt-2 text-xl">Kilka słów o mnie, moim podejściu do treningów i jak wygląda współpraca krok po kroku.</p>
        <div className="mt-8 aspect-video w-full rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900/40">
          <iframe
src="https://www.youtube.com/embed/kq6nOJkaReg?si=jG49M9kqEqZKHT5g"
            title="O mnie - Mateusz Garbas"
            className="w-full h-full"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="mt-4">
  <a
    href="#konsultacja"
    className="px-4 py-2 text-lg font-bold rounded-2xl shadow-lg transition-transform active:scale-[.98]"
    style={{
      backgroundColor: "#ffffff",
      color: "#000000",
      boxShadow: "0 0 12px rgba(255, 255, 255, 0.9)"
    }}
  >
    Umów konsultację
  </a>
</div>


      </div>
    </section>

    {/* KONSULTACJA */}
    <section id="konsultacja" className="py-16 border-t border-neutral-800">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center" style={{ color: GOLD }}>
          WYBIERZ TERMIN SWOJEJ KONSULTACJI
        </h2>
        <div className="mt-8 rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900/60 shadow-lg p-3 max-w-3xl mx-auto">
          <iframe
            title="Calendly"
            src="https://calendly.com/mateuszgarbas/45min?hide_event_type_details=1&hide_gdpr_banner=1"
            className="w-full h-[500px] rounded-xl"
            style={{ backgroundColor: "white", border: "none" }}
          />
        </div>
      </div>
    </section>

    {/* E-BOOKI */}
    <section id="ebooki" className="py-16">
  <div className="mx-auto max-w-4xl px-4">

        <div className="text-center">
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-6 px-6 py-3 rounded-2xl mx-auto w-fit"
            style={{
              color: GOLD,
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${GOLD}`
            }}
          >
            E-Booki
          </h2>
        </div>
        <p className="text-neutral-300 mt-2 max-w-prose mx-auto text-center text-xl">Przeczytaj i wdrażaj od razu.</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto md:max-w-none">
  {PRODUCTS.map((e) => (
    <div
      key={e.id}
      className="rounded-2xl border border-neutral-800 p-4 md:p-6 bg-neutral-900/40 flex flex-col justify-between h-full"
    >

              <div>
                <img
  src={e.image}
  alt={`Okładka e-booka: ${e.title}`}
  className="w-32 md:w-40 aspect-[2/3] object-cover rounded-xl border border-neutral-700 mx-auto"
/>



                <h3 className="mt-4 text-xl font-semibold">{e.title}</h3>
                <p className="text-neutral-300 mt-1 text-xl">{e.desc}</p>
                <ul className="list-disc list-inside mt-3 text-xl text-neutral-400">
                  <li>Szybsze efekty</li>
                  <li>Proste i praktyczne wskazówki</li>
                  <li>Bez zbędnych restrykcji</li>
                </ul>
                <div className="mt-3 font-semibold">{formatPLN(e.priceCents)}</div>
              </div>
              <div className="mt-10">
                <button onClick={() => addToCart(e.id)} className={whiteButtonClass}>Dodaj do koszyka</button>
              </div>
            </div>
          ))}
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
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={GOLD}
        className={`w-6 h-6 transition-transform transform hover:scale-125 hover:rotate-12 sparkle`}
        style={{ animationDelay: `${i * 0.3}s` }}
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c.414 0 .79.26.94.65l2.12 5.18 5.66.44c.4.03.74.28.86.65.12.37.02.78-.26 1.06l-4.24 3.82 1.28 5.5c.09.39-.09.8-.45 1.02a.94.94 0 0 1-1.05-.02L12 18.77l-4.92 3.21a.94.94 0 0 1-1.05.02c-.36-.22-.54-.63-.45-1.02l1.28-5.5-4.24-3.82a1 1 0 0 1-.26-1.06c.12-.37.46-.62.86-.65l5.66-.44 2.12-5.18c.15-.39.53-.65.94-.65z"
          clipRule="evenodd"
        />
      </svg>
    ))}
  </div>
</h2>



        </div>
        <div
  ref={marqueeRef}
  className="relative mt-8 overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth scrollbar-hide"
  onMouseEnter={() => setIsHovering(true)}
  onMouseLeave={() => setIsHovering(false)}
  onTouchStart={() => setIsHovering(true)}
  onTouchEnd={() => setIsHovering(false)}
>
  <div className="flex gap-5 w-max">
    {[...REVIEWS, ...REVIEWS].map(([name, text], idx) => (
      <div
        key={idx}
        className="inline-block align-top snap-center"
        style={{ flex: "0 0 auto" }}
      >
        <div className="w-[80vw] sm:w-[340px] md:w-[360px] rounded-2xl border border-neutral-800 p-6 bg-neutral-900/40 h-full">
          <p className="text-base leading-relaxed text-neutral-300">“{text}”</p>
          <div className="mt-3 text-sm text-neutral-400">— {name}</div>
        </div>
      </div>
    ))}
  </div>
</div>

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

    {/* Karuzela pozioma */}
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {[
        { before: "/assets/przed2.png", after: "/assets/po2.png", name: "Kasia", desc: "3 miesiące – -8 kg, poprawa siły i wytrzymałości." },
        { before: "/assets/przed1.png", after: "/assets/po1.png", name: "Marek", desc: "5 miesięcy – +5 kg masy mięśniowej." },
        { before: "/assets/przed3.png", after: "/assets/po3.png", name: "Anna", desc: "-6 kg, wyrzeźbienie sylwetki." },
        { before: "/assets/przed4.png", after: "/assets/po4.png", name: "Paweł", desc: "+4 kg masy mięśniowej." },
        { before: "/assets/przed5.png", after: "/assets/po5.png", name: "Ola", desc: "-10 kg i poprawa kondycji." }
      ].map((c, idx) => (
        <div
          key={idx}
          className="min-w-[250px] rounded-2xl border border-neutral-800 p-4 bg-neutral-900/40 flex flex-col justify-between"
        >
          {/* Dwa zdjęcia obok siebie */}
          <div className="flex gap-2">
            <div className="relative w-1/2 aspect-[3/4]">
              <img
                src={c.before}
                alt={`${c.name} przed`}
                className="w-full h-full object-cover rounded-lg"
              />
              <span className="absolute bottom-0 left-0 w-full bg-black/60 text-center text-xs text-white py-1 rounded-b-lg">
                Przed
              </span>
            </div>
            <div className="relative w-1/2 aspect-[3/4]">
              <img
                src={c.after}
                alt={`${c.name} po`}
                className="w-full h-full object-cover rounded-lg"
              />
              <span className="absolute bottom-0 left-0 w-full bg-black/60 text-center text-xs text-white py-1 rounded-b-lg">
                Po
              </span>
            </div>
          </div>

          {/* Opis */}
          <div className="mt-4 text-center">
            <div className="font-semibold">{c.name}</div>
            <div className="text-neutral-300 text-base min-h-[40px]">{c.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      </div>
    </section>

    {/* FAQ */}
    <section id="faq" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center" style={{ color: GOLD }}>Najczęstsze pytania</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {[
            [
    "Czy współpraca jest dla początkujących?",
    "Tak. Na początku przeprowadzam szczegółowy wywiad i przygotowuję plan dostosowany do Twojego poziomu, doświadczenia i dostępnego sprzętu."
  ],
  [
    "Jak wygląda kontakt?",
    "W zależności od wybranego pakietu raportujesz postępy co 4, 2 lub 1 tydzień. W pakietach Essential Plus i PRO masz też stały kontakt w razie pytań."
  ],
  [
    "Czy mogę trenować w domu?",
    "Tak – plan dopasowuję do sprzętu, którym dysponujesz, oraz czasu, jakim dysponujesz. Otrzymasz też alternatywy ćwiczeń, jeśli coś okaże się niewygodne."
  ],
  [
    "Jak wygląda pierwszy miesiąc współpracy?",
    "Zaczynamy od szczegółowego wywiadu, aby poznać Twoje cele i możliwości. Następnie przygotowuję dla Ciebie indywidualny plan treningowy oraz ustalam praktyczne wskazówki dietetyczne. W trakcie pierwszego miesiąca regularnie raportujesz postępy (co tydzień, dwa lub cztery tygodnie – w zależności od pakietu), a ja na bieżąco wprowadzam potrzebne modyfikacje."
  ],
  [
    "Jak długo trwa współpraca?",
    "Rekomenduję minimum 3 miesiące, aby zobaczyć pełne i trwałe efekty – choć wielu podopiecznych zostaje ze mną dłużej, by kontynuować progres."
  ],
  [
    "Jak płacę?",
    "Płatności realizowane są online przez Przelewy24. Po opłaceniu otrzymasz link do pobrania e-booka lub potwierdzenie rozpoczęcia współpracy."
  ]
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
    <img src="/assets/mess.png" alt="Messenger" className="w-10 h-10" />
  </a>
  <a
    href="https://instagram.com/mateusz.garbas"
    target="_blank"
    rel="noopener noreferrer"
    className="w-14 h-14 rounded-full bg-[#ffffff1a] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
    aria-label="Otwórz Instagram"
  >
    <img src="/assets/instagram.png" alt="Instagram" className="w-10 h-10" />
  </a>
</div>

{/* Desktop: pływające po prawej */}
<div className="hidden md:flex fixed bottom-24 right-6 flex-col gap-3 z-50">
  <a
    href="https://m.me/61569722611144"
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 rounded-full bg-[#ffffff1a] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
    aria-label="Wyślij wiadomość na Messenger"
  >
    <img src="/assets/mess.png" alt="Messenger" className="w-8 h-8" />
  </a>
  <a
    href="https://instagram.com/mateusz.garbas"
    target="_blank"
    rel="noopener noreferrer"
    className="w-12 h-12 rounded-full bg-[#ffffff1a] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
    aria-label="Otwórz Instagram"
  >
    <img src="/assets/instagram.png" alt="Instagram" className="w-8 h-8" />
  </a>
</div>

    {/* STOPKA */}
    <footer className="py-10 border-t border-neutral-800 text-sm">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="text-neutral-400">© {new Date().getFullYear()} Mateusz Garbas. Wszelkie prawa zastrzeżone.</div>
        <div className="flex gap-4 text-neutral-400">
          <a href="#" className="hover:opacity-80">Regulamin</a>
          <a href="#" className="hover:opacity-80">Polityka prywatności</a>
          <a href="#" className="hover:opacity-80">Wysyłka i płatności</a>
        </div>
      </div>
    </footer>
    {/* STICKY KOSZYK (desktop) */}
    <button
  onClick={() => setCartOpen(true)}
  className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2 rounded-2xl p-3 bg-white text-black shadow-lg"
  aria-label="Koszyk"
>
  <CartIcon className="w-6 h-6" />
  {cart.length > 0 && (
    <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 text-xs rounded-full bg-black text-white">
      {cart.reduce((n, i) => n + i.qty, 0)}
    </span>
  )}
</button>


    {/* DRAWER KOSZYKA */}
    {cartOpen && (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/60" onClick={() => setCartOpen(false)} />
        <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-neutral-950 border-l border-neutral-800 p-5 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Twój koszyk</h3>
            <button onClick={() => setCartOpen(false)} className="text-neutral-400 hover:text-white">Zamknij</button>
          </div>
          <div className="mt-4 space-y-4 overflow-auto">
            {cart.length === 0 && <div className="text-neutral-400">Koszyk jest pusty</div>}
            {cart.map((i) => (
              <div key={i.id} className="flex items-start justify-between gap-3 rounded-xl border border-neutral-800 p-4">
                <div className="text-sm">
                  <div className="font-medium">{i.title}</div>
                  <div className="text-neutral-400 mt-1">{formatPLN(i.priceCents)} × {i.qty}</div>
                  <div className="text-neutral-200 mt-1">Suma: {formatPLN(i.priceCents * i.qty)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => dec(i.id)} className="px-2 py-1 rounded border border-neutral-700">−</button>
                  <button onClick={() => inc(i.id)} className="px-2 py-1 rounded border border-neutral-700">+</button>
                  <button onClick={() => removeItem(i.id)} className="px-2 py-1 rounded border border-red-700 text-red-400">Usuń</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between text-lg font-semibold">
              <div>Razem</div>
              <div>{formatPLN(subtotal)}</div>
            </div>
            <button
  onClick={checkout}
  disabled={cart.length === 0}
  className={`${goldButtonClass} w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed`}
>
  Przejdź do płatności (Stripe)
</button>

            <div className="mt-4 flex gap-3 items-center justify-center opacity-80">
              <img src="/assets/przelewy24.png" alt="Przelewy24" className="h-6" />
              <img src="/assets/visa.png" alt="Visa" className="h-6" />
              <img src="/assets/mastercard.png" alt="Mastercard" className="h-6" />
            </div>
          </div>
        </aside>
      </div>
    )}

   {/* Floating Messenger / Instagram */}
{!cartOpen && (
  <>
    {/* Desktop: pływające */}
    <div className="hidden md:flex fixed bottom-24 right-6 flex-col gap-3 z-50">
      <a
        href="https://m.me/61569722611144"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#ffffff1a] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
        aria-label="Wyślij wiadomość na Messenger"
      >
        <img src="/assets/mess.png" alt="Messenger" className="w-8 h-8" />
      </a>
      <a
        href="https://instagram.com/mateusz.garbas"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#ffffff1a] backdrop-blur-sm flex items-center justify-center shadow-lg border border-[#d4af37] hover:scale-110 transition-transform"
        aria-label="Otwórz Instagram"
      >
        <img src="/assets/instagram.png" alt="Instagram" className="w-8 h-8" />
      </a>
    </div>
  </>
)}


    </div>
  ); // zamknięcie return
} // zamknięcie App()
