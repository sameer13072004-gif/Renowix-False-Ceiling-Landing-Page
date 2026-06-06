import React, { useState, useEffect } from "react";
import { 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Check, 
  Star, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  Layers, 
  Hammer, 
  Ruler, 
  Zap,
  CheckCircle,
  HelpCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { 
  CEILING_TYPES, 
  NOIDA_LOCATIONS, 
  TESTIMONIALS, 
  FAQ_ITEMS, 
  BRAND_NAME, 
  NOIDA_PHONE 
} from "./constants";
import CallbackFormModal from "./components/CallbackFormModal";
import EstimatorQuiz from "./components/EstimatorQuiz";
import { FalseCeilingType } from "./types";

export default function App() {
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState<boolean>(false);
  const [modalPreference, setModalPreference] = useState<string>("gypsum");
  const [modalBudget, setModalBudget] = useState<string>("₹25,000 - ₹50,000");

  // Dynamic Auto-height hook for clean WordPress/Elementor embedding without duplicate scrollbars
  useEffect(() => {
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight || document.body.scrollHeight;
      // Post the message to parent window
      window.parent.postMessage({ type: "RENOWIX_FRAME_RESIZE", height }, "*");
    };

    // Run initially & with minor delayed buffers to allow layout transitions
    sendHeight();
    const timeoutId1 = setTimeout(sendHeight, 150);
    const timeoutId2 = setTimeout(sendHeight, 500);

    // Bind event listeners
    window.addEventListener("load", sendHeight);
    window.addEventListener("resize", sendHeight);

    // Monitor internal DOM transformations (e.g., calculator state changes, tabs, accordion)
    const observer = new MutationObserver(() => {
      sendHeight();
      // Second tick after any browser reflow
      requestAnimationFrame(sendHeight);
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      window.removeEventListener("load", sendHeight);
      window.removeEventListener("resize", sendHeight);
      observer.disconnect();
    };
  }, []);
  
  // Ceiling explore state
  const [activeCeilingId, setActiveCeilingId] = useState<string>("gypsum");
  
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Noida sector filtering for local projects
  const [selectedNoidaSector, setSelectedNoidaSector] = useState<string>("All Sectors");

  const activeCeilingItem = CEILING_TYPES.find((c) => c.id === activeCeilingId) || CEILING_TYPES[0];

  const handleOpenCallback = (ceilingId: string = "gypsum", budgetRange: string = "₹25,000 - ₹50,000") => {
    setModalPreference(ceilingId);
    setModalBudget(budgetRange);
    setIsCallbackModalOpen(true);
  };

  const handleToggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Structured local Noida Projects data with precise filter capability
  const localProjectList = [
    {
      id: "p1",
      title: "Master Suite Cove Ceiling",
      sector: "Noida Sector 150 (Premium Residential)",
      type: "gypsum",
      typeName: "Premium Gypsum Board",
      area: "160 sq.ft",
      rate: "Starting ₹99/sq.ft",
      image: "https://renowix.in/wp-content/uploads/2026/06/94a42591bddd00ce8910d581259a8e6a.jpg",
      highlight: "Seamless Cove + Ambient lighting layout"
    },
    {
      id: "p2",
      title: "Modern Duplex Living Hall",
      sector: "Noida Sector 74, 75 & 76",
      type: "gypsum",
      typeName: "Gypsum Design Steps",
      area: "280 sq.ft",
      rate: "Starting ₹99/sq.ft",
      image: "https://renowix.in/wp-content/uploads/2026/06/4b5804a0910992862ea80454953d4859.jpg",
      highlight: "Double tier steps with central fan box"
    },
    {
      id: "p3",
      title: "Royal Mandala Dining Dome",
      sector: "Noida Sector 137 & Express Way",
      type: "pop",
      typeName: "Handcarved POP Plaster",
      area: "140 sq.ft",
      rate: "Starting ₹139/sq.ft",
      image: "https://renowix.in/wp-content/uploads/2026/06/4d363de7ca4d19d62f93e2a3a6a0f643.jpg",
      highlight: "Central decorative plate + deep tier molding"
    },
    {
      id: "p4",
      title: "Balcony Wood-Finish Paneling",
      sector: "Noida Extension / Greater Noida West",
      type: "pvc",
      typeName: "Waterproof Teak PVC",
      area: "85 sq.ft",
      rate: "Starting ₹119/sq.ft",
      image: "https://renowix.in/wp-content/uploads/2026/06/bcc8db2a5743e8027702400011ef4129.jpg",
      highlight: "Moisture barrier & accent spotlights layout"
    },
    {
      id: "p5",
      title: "Commercial Co-working Grid",
      sector: "Noida Sector 62 & 63 (Commercial Hub)",
      type: "grid",
      typeName: "Acoustic T-Grid Systems",
      area: "1,200 sq.ft",
      rate: "Starting ₹99/sq.ft",
      image: "https://renowix.in/wp-content/uploads/2026/06/5d6b9033bef27960f5349608e9dbdcde.jpg",
      highlight: "Acoustic tiles & linear ceiling grids"
    },
    {
      id: "p6",
      title: "Lobby Reception Acoustic Ceiling",
      sector: "Noida Sector 62 & 63 (Commercial hub)",
      type: "grid",
      typeName: "Armstrong Lay-In Ceiling",
      area: "450 sq.ft",
      rate: "Starting ₹99/sq.ft",
      image: "https://renowix.in/wp-content/uploads/2026/06/grid-tiles.jpg",
      highlight: "Moisture resistant grid panels"
    }
  ];

  const filteredProjects = selectedNoidaSector === "All Sectors"
    ? localProjectList
    : localProjectList.filter((p) => p.sector === selectedNoidaSector || p.sector.includes(selectedNoidaSector.split(" ")[1] || ""));

  return (
    <div className="min-h-screen bg-[#070b13] text-[#f1f5f9] font-sans selection:bg-amber-500/20 selection:text-white border-t-4 border-amber-500 bg-mesh overflow-x-hidden relative">
      
      {/* Background ambient orbs */}
      <div className="absolute top-0 left-1/4 h-96 w-96 bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 h-96 w-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 h-96 w-96 bg-blue-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/40 border-b border-white/8 backdrop-blur-md transition-all shadow-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://renowix.in/wp-content/uploads/2025/12/Renowix-logo-scaled.png" 
              alt="Renowix Interiors Logo" 
              className="h-[50px] sm:h-[56px] w-auto object-contain flex-shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="hidden sm:block border-l border-white/20 pl-3">
              <span className="font-display text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1">
                {BRAND_NAME} <span className="text-amber-400 font-normal text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/15">Ceilings</span>
              </span>
              <p className="text-[8px] font-mono text-slate-400 tracking-wider uppercase">Bespoke Ceilings Noida</p>
            </div>
          </div>

          {/* Quick navigation selectors - Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#services-explore" className="hover:text-amber-400 transition-colors">Ceiling Catalog</a>
            <a href="#estimator-parent" className="hover:text-amber-400 text-amber-300 flex items-center gap-1 transition-colors">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-400 shrink-0" /> Calculator
            </a>
            <a href="#projects-showcase" className="hover:text-amber-400 transition-colors">Noida Portfolios</a>
            <a href="#testimonials" className="hover:text-amber-400 transition-colors">Reviews</a>
            <a href="#faqs" className="hover:text-amber-400 transition-colors">FAQs</a>
          </nav>

          {/* Action Header Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenCallback()}
              id="header-cta"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider"
            >
              Request Callback <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative overflow-hidden py-12 md:py-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Copy Columns */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Noida Specific Badge */}
              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-full text-[11px] font-mono font-bold text-amber-300 shadow-inner select-none">
                <MapPin className="h-3.5 w-3.5 text-amber-600/90 shrink-0" />
                No.1 Architectural Ceiling Specialist in Noida & Extension
              </div>

              {/* Majestic conversational title */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
                Turn Your Plain Concrete Ceiling into an <span className="accent-text-gradient font-serif italic font-normal">Architectural Masterpiece</span>
              </h1>

              {/* Conversational copy */}
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Hey, homeowners of Noida! Planning your new home interior or correcting a hot top-floor apartment? At <strong className="text-white font-semibold">{BRAND_NAME}</strong>, we install beautiful, fire-retardant, and moisture-immune false ceilings with zero-hassle dust shields. Fully transparent starting rates: premium Gypsum at <strong className="text-amber-400">₹99/sq.ft</strong>, POP at <strong className="text-amber-400">₹139/sq.ft</strong>, and design PVC at <strong className="text-amber-400">₹119/sq.ft</strong>. No middleman markups! (Rates exclude any lighting & wiring work).
              </p>

              {/* CTA Buttons bar */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-3">
                <a
                  href="#estimator-parent"
                  id="hero-quiz-btn"
                  className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-bold text-sm py-4 px-6 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center uppercase tracking-wider"
                >
                  <Sparkles className="h-4.5 w-4.5 text-slate-950 shrink-0" /> Estimate Room Rate Now
                </a>
                <button
                  type="button"
                  id="hero-callback-btn"
                  onClick={() => handleOpenCallback()}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold text-sm py-4 px-6 rounded-xl border border-white/8 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Request Callback <Clock className="h-4 w-4 text-amber-500 shrink-0 animate-pulse" />
                </button>
              </div>

              {/* Proof badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 border-t border-white/5">
                <div className="text-left space-y-0.5">
                  <span className="block font-display font-extrabold text-2xl text-white">10-Year</span>
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-404">Sag Framework Guarantee</span>
                </div>
                <div className="text-left space-y-0.5">
                  <span className="block font-display font-extrabold text-2xl text-white">850+</span>
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-404">Noida Projects Done</span>
                </div>
                <div className="text-left space-y-0.5">
                  <span className="block font-display font-extrabold text-2xl text-white">4.9/5</span>
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-404">Google Customer Rating</span>
                </div>
              </div>
            </div>

            {/* Visual Column / Interactive image mockup showcasing high-end interior */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-amber-550 to-amber-700 opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000" />
              
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-3 shadow-2xl">
                
                {/* Simulated high-fidelity ceiling photography */}
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src="https://renowix.in/wp-content/uploads/2026/06/d278461f57c12866efa7d330a15d13b7-1.jpg"
                    alt="Luxury living room false ceiling Noida by Renowix"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Local Noida sector highlight */}
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-md border border-white/10 select-none">
                    📍 Noida Sector 150 project (Gypsum + LED)
                  </div>

                  {/* Overlaid prompt highlight */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 text-white">
                    <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold font-mono">Completed Design #841</span>
                    <p className="font-display font-bold text-sm text-white">Ambient Glow Recessed Ceiling</p>
                    <p className="text-[11px] text-zinc-300 leading-normal">Saint-Gobain Coreboards with Berger Silk finish paint.</p>
                  </div>
                </div>

                {/* Instant Callback trigger from image */}
                <div className="bg-white/5 border border-white/8 p-3.5 rounded-xl mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold flex items-center gap-1.5 font-sans">
                    <Zap className="h-4 w-4 animate-bounce text-amber-400 shrink-0" /> Love this exact ceiling layout?
                  </span>
                  <button
                    onClick={() => handleOpenCallback("gypsum", "₹50,000 - ₹1,00,000")}
                    className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition-colors text-[10px] cursor-pointer"
                  >
                    Match This Style
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-16 md:py-20 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center space-y-2 mb-12 max-w-2xl mx-auto">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">The Noida Standard</h2>
            <p className="font-display text-2xl md:text-3.5xl font-bold text-white">
              Why Noida Families Exclusively Choose {BRAND_NAME} for Ceiling Renovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:border-white/12 transition-all group duration-300">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">10-Year Frame Lock Guarantee</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We use premium high-gauge galvanized iron (GI) channels that block water rust and prevent sagging ceilings forever.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:border-white/12 transition-all group duration-300">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/25 group-hover:scale-105 transition-transform">
                  <span className="text-emerald-400 font-bold text-sm">✓</span>
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Dust-Free Sanding Machines</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No messy white plaster dust over furniture. We use vacuum-integrated motorized sanders to keep Noida apartments clean.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:border-white/12 transition-all group duration-300">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/25 group-hover:scale-105 transition-transform">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">100% Certified Materials</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We use genuine Saint-Gobain Gyproc coreboards, Sakarni class POP plaster, and high-gauge channel frames. No local replicas.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl hover:border-white/12 transition-all group duration-300">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Qualified & Trained Team</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our ceiling supervisors and master installers are fully trained and registered. No unvetted freelancers or random sub-contractors.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ceiling Explorer Tabs */}
      <section id="services-explore" className="py-16 md:py-24 relative border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
            <div className="space-y-2 max-w-xl text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">Detailed Catalog</span>
              <h2 className="font-display text-2xl md:text-3xl.5 font-bold text-white">
                Explore Our Bespoke False Ceiling Options & Rates
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Starting rates include framing structure and base installation. Switch options to read specifications.
              </p>
            </div>

            {/* Tab buttons */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/60 border border-white/5 rounded-2xl self-start">
              {CEILING_TYPES.map((c) => (
                <button
                  key={c.id}
                  id={`explorer-tab-${c.id}`}
                  onClick={() => setActiveCeilingId(c.id)}
                  className={`text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    activeCeilingId === c.id
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {c.name.split(" ")[0]} Style
                </button>
              ))}
            </div>
          </div>

          {/* Tab active details dashboard representation */}
          <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Info Block */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2.5 text-left">
                  <span className="inline-flex bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase select-none tracking-wider">
                    ⭐ Starting at <span className="text-white ml-1">₹{activeCeilingItem.startingPrice}</span> / sq.ft (Inclusive)
                  </span>
                  <h3 className="font-display text-2.5xl font-bold text-white leading-tight">{activeCeilingItem.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider font-mono">Premium Grade: {activeCeilingItem.material}</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans text-left">{activeCeilingItem.detailedDescription}</p>

                {/* Features Checklist */}
                <div className="space-y-3 pt-2 text-left">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Key Technical Features:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeCeilingItem.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros list */}
                <div className="flex flex-wrap gap-2.5 pt-4 border-t border-white/5 items-center">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200 shrink-0 select-none">Top Benefits:</span>
                  {activeCeilingItem.pros.map((p) => (
                    <span key={p} className="bg-white/5 border border-white/8 text-slate-200 text-[10px] font-medium px-3 py-1 rounded-full">
                      ✓ {p}
                    </span>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/8 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 text-left">
                    <p className="font-bold font-mono tracking-wider text-slate-300 uppercase text-[10px]">Area Recommended for:</p>
                    <p className="text-zinc-300">{activeCeilingItem.bestFor}</p>
                  </div>
                  <button
                    onClick={() => handleOpenCallback(activeCeilingItem.id)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
                  >
                    Request Callback Now
                  </button>
                </div>
              </div>

              {/* Picture view */}
              <div className="lg:col-span-5">
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={activeCeilingItem.imageUrl}
                    alt={`${activeCeilingItem.name} Noida layout by Renowix`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono tracking-wide bg-slate-950/80 backdrop-blur text-slate-200 px-3 py-1.5 rounded-lg border border-white/10 select-none">
                    Real physical rendering
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Interactive Price Estimator section (Parent Anchor) */}
      <section id="estimator-parent" className="py-16 md:py-24 relative border-b border-white/5">
        <div className="absolute top-1/4 right-1/4 h-80 w-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center space-y-3 mb-10 max-w-2xl mx-auto text-center">
            <span className="inline-flex bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[10px] px-3 py-1 rounded-lg font-bold uppercase select-none tracking-widest">
              Interactive Dialog Flow
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Get an Instant Noida Installation Quote in 10 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Answer 3 simple questions about your room layout and Noida sector to get an estimate based on Saint-Gobain drywall standards.
            </p>
          </div>

          {/* Render Quiz */}
          <EstimatorQuiz 
            onOpenCallbackWithData={(type, budget) => handleOpenCallback(type, budget)} 
          />
        </div>
      </section>

      {/* Noida Local Projects Showroom Section */}
      <section id="projects-showcase" className="py-16 md:py-24 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-2 text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">Real Work Integrity</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                Recent Projects Handed Over in Noida
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                We serve all major projects, high-rise sectors, and corporate parks in Noida. Filter portfolios by sector:
              </p>
            </div>

            {/* Filter slider */}
            <select
              id="noida-project-sector-select"
              value={selectedNoidaSector}
              onChange={(e) => setSelectedNoidaSector(e.target.value)}
              className="bg-slate-950/80 border border-white/10 text-xs sm:text-sm rounded-xl px-4 py-3 w-full sm:w-64 font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer uppercase tracking-wider"
            >
              <option value="All Sectors" className="bg-slate-950 text-white">All Sectors & Highrises</option>
              {NOIDA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-slate-950 text-white">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((proj) => (
                <div key={proj.id} className="glass-panel rounded-2xl overflow-hidden shadow-2xl hover:border-white/12 transition-all group duration-300">
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover opacity-85 group-hover:scale-103 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur text-amber-400 text-[9px] font-mono font-bold px-2.5 py-1 rounded-md border border-white/10">
                      {proj.rate}
                    </div>
                  </div>
                  <div className="p-5 space-y-3 text-left">
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">{proj.typeName}</p>
                    <h3 className="text-sm font-bold text-white leading-tight">{proj.title}</h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 font-sans">
                      <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" /> {proj.sector}
                    </p>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Dimension: {proj.area}</span>
                      <span className="font-mono text-amber-400 font-bold tracking-wide uppercase">{proj.highlight}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 glass-panel border border-white/10 rounded-2xl">
                <p className="text-sm text-slate-300 font-medium font-mono">No showcased projects filtered for this specific location yet.</p>
                <button
                  onClick={() => setSelectedNoidaSector("All Sectors")}
                  className="text-amber-400 text-xs font-bold uppercase tracking-wider hover:underline mt-2 cursor-pointer"
                >
                  Clear filter to see all projects
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Noida Customer Testimonials Review List */}
      <section id="testimonials" className="py-16 md:py-24 relative border-b border-white/5">
        <div className="absolute top-1/2 right-10 h-72 w-72 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center space-y-2 mb-14 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">Client Endorsements</span>
            <h2 className="font-display text-2.5xl md:text-3.5xl font-bold text-white">
              Verified Word of Mouth from Noida Residents
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              We collect post-renovation audit scores to continuously uphold Saint-Gobain standard compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((test) => (
              <div key={test.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between text-left shadow-2xl relative hover:border-white/12 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-350 italic leading-relaxed">
                    "{test.text}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{test.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-amber-400" /> {test.location}
                    </p>
                  </div>
                  <span className="bg-white/5 border border-white/8 text-amber-400 text-[9px] font-mono px-2.5 py-1 font-bold rounded-lg uppercase tracking-wide">
                    {test.ceilingType.split(" ")[0]} Unit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion FAQs Section */}
      <section id="faqs" className="py-16 md:py-24 relative border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">Pre-Booking Clarity</span>
            <h2 className="font-display text-2.5xl md:text-3.5xl font-bold text-white">
              Frequently Asked False Ceiling Queries
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Got technical questions before starting? We answer everything transparently.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-950/40 border border-white/8 rounded-2xl overflow-hidden hover:border-white/12 transition-all shadow-xl"
              >
                <button
                  type="button"
                  id={`faq-toggle-${index}`}
                  onClick={() => handleToggleFaq(index)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-white text-xs sm:text-sm hover:bg-white/5 transition-colors cursor-pointer tracking-wide"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-4.5 w-4.5 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                  )}
                </button>

                {openFaqIndex === index && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 bg-white/2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom conversational Callback / Estimation Banner */}
      <section className="py-12 md:py-16 relative">
        <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 bg-slate-950/60 shadow-2xl text-center space-y-6 relative overflow-hidden">
            {/* Glow styling */}
            <div className="absolute right-0 bottom-0 h-48 w-48 bg-amber-500/10 blur-3xl rounded-full" />
            <div className="absolute left-10 top-0 h-32 w-32 bg-purple-500/5 blur-2xl rounded-full" />

            <div className="relative z-10 space-y-6">
              <span className="inline-flex bg-amber-500/15 text-amber-450 border border-amber-500/20 font-mono text-[10px] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-widest select-none">
                Get Started Anywhere in Noida & Greater Noida
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Ready to upgrade your home? Lock in today's best starting rates.
              </h2>
              
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                Don't pay hefty fees to random middlemen or local contractors who pass off duplicate local boards as premium brands. Book a structural laser check with <strong className="text-white font-semibold">{BRAND_NAME}</strong> today. We carry original brand certificates.
              </p>

              <div className="flex justify-center items-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenCallback()}
                  id="bottom-accent-cta"
                  className="w-full sm:w-96 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm px-6 py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  Request Callback & Site Survey <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-[10px] font-mono text-slate-450 uppercase tracking-widest">
                ⏳ Fast replies! Specialists answer callback inquiries within 15 minutes max.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean human footer */}
      <footer className="bg-[#030508] text-slate-300 py-16 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Branding Column */}
            <div className="space-y-4">
              <span className="font-display font-bold text-white text-lg tracking-tight">
                {BRAND_NAME} Noida
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Noida Sector-wise premium home interior & bespoke plaster of paris / gypsum drywall ceilings installers.
              </p>
              <p className="text-xs text-slate-500 font-mono">© 2026 Renowix Interiors. All rights reserved.</p>
            </div>

            {/* Ceiling types shortcut */}
            <div className="space-y-3 text-left text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-mono text-amber-400">Ceiling Materials & Rates</h4>
              <ul className="space-y-2.5 text-slate-400">
                <li><span className="hover:text-amber-400 transition-colors">Seamless Gypsum Ceilings (from ₹99/sq.ft)</span></li>
                <li><span className="hover:text-amber-450 transition-colors">Ornate POP Plaster Ceilings (from ₹139/sq.ft)</span></li>
                <li><span className="hover:text-amber-400 transition-colors">Waterproof PVC Wooden Panels (from ₹119/sq.ft)</span></li>
                <li><span className="hover:text-amber-400 transition-colors">Commercial Acoustic Grids (from ₹99/sq.ft)</span></li>
              </ul>
            </div>

            {/* Noida Sectors List */}
            <div className="space-y-3 text-left text-xs md:col-span-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px] font-mono text-amber-400">Noida Local Sectors Served</h4>
              <p className="text-slate-450 leading-relaxed text-[11px]">
                Noida Sector 15, Sector 18, Sector 50, Sector 51, Sector 60, Sector 62, Sector 63, Sector 70, Sector 74, Sector 75, Sector 78, Sector 93, Sector 104, Sector 110, Sector 120, Sector 121, Sector 122, Sector 137, Sector 143, Sector 150, Noida Express Way, Greater Noida, and Noida Extension (Greater Noida West).
              </p>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center text-[10px] text-slate-500 space-y-1.5 select-none font-sans">
            <p className="leading-relaxed max-w-4xl mx-auto">
              Disclaimer: Base square-foot rates may vary depending on design steps, room complexity, electrical groove layout, and physical site measurements. Laser measurement checks in Noida are 100% free with no hidden billing.
            </p>
            <p className="text-slate-600 font-mono uppercase tracking-wider">
              Developed by Renowix Home Renovation Service. Noida highrise specialist partners.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (Callback shortcut) */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => handleOpenCallback()}
          id="floating-cta"
          className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 rounded-full p-4 shadow-2xl hover:shadow-amber-500/20 transition-all hover:scale-105 flex items-center justify-center gap-1.5 cursor-pointer"
          title="Free Measurement Callback"
        >
          <Phone className="h-5 w-5 shrink-0" />
          <span className="text-xs font-extrabold uppercase tracking-wider hidden sm:inline leading-none ml-1">
            Request Callback
          </span>
        </button>
      </div>

      {/* Interactive Modal Callback Dialog */}
      <CallbackFormModal
        isOpen={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
        initialType={modalPreference}
        initialBudget={modalBudget}
      />

    </div>
  );
}
