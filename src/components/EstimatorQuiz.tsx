import React, { useState, useEffect } from "react";
import { Calculator, ArrowRight, ArrowLeft, Ruler, Check, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { CEILING_TYPES, NOIDA_LOCATIONS } from "../constants";

interface EstimatorQuizProps {
  onOpenCallbackWithData: (type: string, estimatedBudget: string) => void;
}

export default function EstimatorQuiz({ onOpenCallbackWithData }: EstimatorQuizProps) {
  const [step, setStep] = useState<number>(1);
  const [spaceType, setSpaceType] = useState<string>("living");
  const [selectedCeilingId, setSelectedCeilingId] = useState<string>("gypsum");
  
  // Dimensions
  const [roomLength, setRoomLength] = useState<number>(12);
  const [roomWidth, setRoomWidth] = useState<number>(10);
  const [customArea, setCustomArea] = useState<number>(120);
  const [isCustomArea, setIsCustomArea] = useState<boolean>(false);
  
  // Location
  const [noidaLoc, setNoidaLoc] = useState<string>(NOIDA_LOCATIONS[0]);

  // Sync custom area when length/width changes
  useEffect(() => {
    if (!isCustomArea) {
      setCustomArea(roomLength * roomWidth);
    }
  }, [roomLength, roomWidth, isCustomArea]);

  const selectedCeiling = CEILING_TYPES.find((c) => c.id === selectedCeilingId) || CEILING_TYPES[0];
  
  // Cost calculation
  // Lower end is the basic rate. Higher end is up to 50% more to account for complex highlights (wider bands, center tables, curves, etc.)
  const baseCost = customArea * selectedCeiling.startingPrice;
  const calculatedCostMin = Math.round(baseCost);
  const calculatedCostMax = Math.round(baseCost * 1.5);

  const formattedCostRange = `₹${calculatedCostMin.toLocaleString("en-IN")} - ₹${calculatedCostMax.toLocaleString("en-IN")}`;

  const spaces = [
    { id: "living", title: "Living room / Hall", icon: "🛋️", desc: "Usually requires decorative multi-tiered coves and spot lighting." },
    { id: "bedroom", title: "Bedroom", icon: "🛏️", desc: "Suits minimalist indirect tray designs for relaxing, glare-free nights." },
    { id: "balcony", title: "Balcony / Deck", icon: "🪴", desc: "Best with waterproof, timber-finish robust PVC panels." },
    { id: "bathroom", title: "Kitchen / Bathroom", icon: "🚿", desc: "Requires anti-damp panels to avoid paint peeling." },
    { id: "office", title: "Commercial Office / Corridor", icon: "🏢", desc: "Optimized with high efficiency acoustic layouts & quick wire access." }
  ];

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSetCommonSize = (length: number, width: number) => {
    setIsCustomArea(false);
    setRoomLength(length);
    setRoomWidth(width);
  };

  const handleFinishQuiz = () => {
    onOpenCallbackWithData(selectedCeilingId, formattedCostRange);
  };

  return (
    <div id="estimator-panel" className="rounded-3xl glass-panel p-6 md:p-8 shadow-2xl max-w-3xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-10 leading-none h-40 w-40 bg-purple-500/5 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-10 leading-none h-40 w-40 bg-amber-500/5 blur-3xl rounded-full" />
      
      {/* Progress header */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider mb-2 font-mono">
          <span>Noida Pricing Estimator Quiz</span>
          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/15 px-2.5 py-1 rounded-full text-[10px]">
            Step {step} of 4
          </span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Space Type Selection */}
      {step === 1 && (
        <div id="step-1" className="space-y-4 relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display text-lg font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xl text-amber-400">1.</span> Which spatial area are we renovating?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Each space in Noida has unique material guidelines based on dampness & illumination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {spaces.map((s) => (
              <button
                key={s.id}
                type="button"
                id={`space-opt-${s.id}`}
                onClick={() => {
                  setSpaceType(s.id);
                  if (s.id === "balcony" && selectedCeilingId !== "pvc") {
                    setSelectedCeilingId("pvc"); // Suggest PVC automatically for balconies
                  } else if (s.id === "office" && selectedCeilingId !== "grid") {
                    setSelectedCeilingId("grid"); // Suggest Grid for office
                  } else if ((s.id === "living" || s.id === "bedroom") && (selectedCeilingId === "grid" || selectedCeilingId === "pvc")) {
                    setSelectedCeilingId("gypsum"); // Default living space back to premium gypsum
                  }
                  handleNextStep();
                }}
                className={`flex items-start text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  spaceType === s.id
                    ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30 shadow-sm"
                    : "bg-black/20 border-white/8 hover:border-white/15 hover:bg-white/5"
                }`}
              >
                <span className="text-3xl mr-3 filter drop-shadow-sm select-none">{s.icon}</span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-white">{s.title}</p>
                  <p className="text-[11px] text-slate-400 leading-normal">{s.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Ceiling Material Selection */}
      {step === 2 && (
        <div id="step-2" className="space-y-4 relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display text-lg font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xl text-amber-400">2.</span> Choose your structural material
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Select standard gypsum boards, customizable POP plaster, moisture-proof PVC panels, or industrial grids.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {CEILING_TYPES.map((c) => (
              <button
                key={c.id}
                type="button"
                id={`material-opt-${c.id}`}
                onClick={() => {
                  setSelectedCeilingId(c.id);
                }}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedCeilingId === c.id
                    ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30 shadow-sm"
                    : "bg-black/20 border-white/8 hover:border-white/15 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    Est: ₹{c.startingPrice}/sq.ft
                  </span>
                  {selectedCeilingId === c.id && (
                    <span className="bg-amber-500 text-slate-950 rounded-full p-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-white font-display mt-0.5">{c.name}</p>
                <p className="text-[11px] text-slate-400 mt-1 flex-grow leading-relaxed">
                  {c.description}
                </p>
                <span className="text-[10px] bg-white/5 text-slate-200 border border-white/10 px-2 py-0.5 rounded mt-2.5 self-start font-medium select-none">
                  🔍 {c.highlight}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center bg-white/0">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1 text-xs font-semibold text-slate-450 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-5 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-amber-500/10"
            >
              Next Step <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Dimensions Slider */}
      {step === 3 && (
        <div id="step-3" className="space-y-4 relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display text-lg font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xl text-amber-400">3.</span> What are your approximate ceiling dimensions?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Don't worry if it is not exact. Our specialist coordinator will confirm final measurements during design selection.
            </p>
          </div>

          <div className="bg-black/20 border border-white/8 rounded-2xl p-5 space-y-5">
            {/* Common standard Room Dimensions selector preset */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-450 mb-2.5">Quick Popular Sizes:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: "Small Room (10x10 ft)", l: 10, w: 10, area: 100 },
                  { text: "Standard Room (12x10 ft)", l: 12, w: 10, area: 120 },
                  { text: "Master Suite (14x14 ft)", l: 14, w: 14, area: 196 },
                  { text: "Living Hall (20x15 ft)", l: 20, w: 15, area: 300 }
                ].map((preset) => (
                  <button
                    key={preset.text}
                    type="button"
                    onClick={() => handleSetCommonSize(preset.l, preset.w)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                      !isCustomArea && roomLength === preset.l && roomWidth === preset.w
                        ? "bg-amber-500/15 border-amber-500 text-amber-300 font-bold"
                        : "bg-white/5 border-white/8 text-slate-350 hover:bg-white/10"
                    }`}
                  >
                    {preset.text}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomArea(true)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                    isCustomArea
                      ? "bg-amber-500/15 border-amber-500 text-amber-300 font-bold"
                      : "bg-white/5 border-white/8 text-slate-350 hover:bg-white/10"
                  }`}
                >
                  Custom Area (sq.ft)
                </button>
              </div>
            </div>

            {/* Visual Sliders depending on custom area */}
            {!isCustomArea ? (
              <div className="space-y-4">
                {/* Length */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-semibold flex items-center gap-1"><Ruler className="h-3 w-3 text-amber-500" /> Length of Room:</span>
                    <span className="font-mono bg-white/5 border border-white/10 px-20 py-0.5 rounded font-bold text-amber-400">{roomLength} Ft</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="40"
                    value={roomLength}
                    onChange={(e) => setRoomLength(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Width */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-semibold flex items-center gap-1"><Ruler className="h-3 w-3 text-amber-500" /> Width of Room:</span>
                    <span className="font-mono bg-white/5 border border-white/10 px-20 py-0.5 rounded font-bold text-amber-400">{roomWidth} Ft</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="30"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-405">
                  <label htmlFor="area-numeric-input">Enter Custom Flat Area (sq.ft)</label>
                  <span className="font-mono text-amber-400 font-bold">{customArea} Sq.Ft</span>
                </div>
                <input
                  type="number"
                  id="area-numeric-input"
                  min="30"
                  max="10000"
                  value={customArea}
                  onChange={(e) => setCustomArea(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl px-3.5 py-2.5 text-sm glass-input placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            )}

            {/* Live calculated area showcase */}
            <div className="bg-amber-500/5 p-3.5 rounded-lg border border-dashed border-amber-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">Calculated Area:</span>
              <span className="font-mono font-bold text-amber-300 text-sm">{customArea} sq.ft</span>
            </div>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1 text-xs font-semibold text-slate-450 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-5 py-2.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-amber-500/10"
            >
              Estimate Price <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Final Estimate Screen */}
      {step === 4 && (
        <div id="step-4" className="space-y-5 relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display text-lg font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Customized Noida Ceiling Estimate
            </h4>
            <p className="text-xs text-slate-400 leading-normal font-mono">
              Calculated using the latest summer 2026 Renowix structural catalog rates.
            </p>
          </div>

          {/* Pricing Estimation Showcase box */}
          <div className="bg-[#0b0e14]/90 text-white rounded-2xl p-6 relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
            {/* Glow backing */}
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 bg-amber-500/10 blur-xl rounded-full" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400">
                  {selectedCeiling.name} Package
                </span>
                <p className="font-sans text-3xl font-extrabold text-amber-500 mt-1">
                  {formattedCostRange}
                </p>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                  Starting rate estimation for premium materials. These are starting estimations, final price will be decided after design confirmation. Highly complex highlights (e.g. wider bands, centered curves) are counted as extra work. Does not include any lighting or wiring work.
                </p>
              </div>

              <div className="border-t sm:border-t-0 sm:border-l border-zinc-800 pt-3 sm:pt-0 sm:pl-6 space-y-1.5 shrink-0">
                <div className="text-[11px] text-zinc-400 font-mono">Project Parameters:</div>
                <div className="text-xs text-white flex flex-col gap-1">
                  <span>📐 Work Area: <strong className="text-amber-400">{customArea} sq.ft</strong></span>
                  <span>📍 Site: <strong className="text-amber-400">Noida (Sector Base)</strong></span>
                  <span>🛡️ Sag Guard: <strong className="text-amber-400">10 Years</strong></span>
                </div>
              </div>
            </div>

            {/* Inclusions checklist details */}
            <div className="mt-5 pt-4 border-t border-zinc-800">
              <p className="text-xs font-semibold text-amber-300 mb-2">What is included in this estimate?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Premium 12mm Galvanized Suspension framing channel",
                  "Original sound-absorbent drywall taping & joining paste",
                  "Full flush surface jointing and micro-sanding pre-paint layout",
                  "Authentic factory certificate for Saint-Gobain/Sakarni cores",
                  "Complete debris sweeping and workspace cleanup guarantees"
                ].map((inc) => (
                  <div key={inc} className="flex items-start gap-1.5 text-[10px] text-zinc-300">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location assurance filter */}
          <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-300 leading-normal">
            <div className="space-y-0.5">
              <p className="font-bold flex items-center gap-1.5 text-white">
                🚀 Secure your Bespoke Technical Site Audit slot in Noida
              </p>
              <p className="text-slate-450 text-[11px]">
                Lock our senior consultant with 4D laser measurement tech diagnostics and itemized BOQ calculations!
              </p>
            </div>
            <select
              id="estimator-noida-loc"
              value={noidaLoc}
              onChange={(e) => setNoidaLoc(e.target.value)}
              className="bg-slate-900 border border-white/12 text-slate-100 rounded-lg px-2.5 py-1.5 focus:outline-none font-medium text-xs scale-95"
            >
              {NOIDA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-slate-950 text-white">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-1 text-xs font-semibold border border-white/10 rounded-xl px-4 py-3 hover:bg-white/5 text-slate-350 transition-colors cursor-pointer"
            >
              Restart Quiz
            </button>
            <button
              onClick={handleFinishQuiz}
              className="flex-grow flex items-center justify-center gap-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl py-3.5 px-5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer text-center uppercase tracking-wider animate-pulse"
            >
              Book Tech Site Audit @ ₹199 <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
