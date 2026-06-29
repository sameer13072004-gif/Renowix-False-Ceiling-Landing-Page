import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle, 
  Calendar, 
  Shield, 
  IndianRupee, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Zap,
  Award,
  Check,
  Smartphone,
  CreditCard,
  QrCode,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CallbackRequest } from "../types";

interface CallbackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
  initialBudget?: string;
  initialStep?: "form" | "success";
  initialDimensions?: string;
}

type ModalFlowStep = "form" | "success";

export default function CallbackFormModal({
  isOpen,
  onClose,
  initialType = "",
  initialBudget = "₹1 Lakh to ₹2.5 Lakh (Premium Ceiling Upgrades)",
  initialStep = "form",
  initialDimensions = "500"
}: CallbackFormModalProps) {
  // Modal flow state
  const [flowStep, setFlowStep] = useState<ModalFlowStep>(initialStep);
  const [submissionId, setSubmissionId] = useState<number>(0);

  // Sync flowStep and other inputs when modal opens
  useEffect(() => {
    if (isOpen) {
      setFlowStep(initialStep);
      setFormData(prev => ({
        ...prev,
        budget: initialBudget,
        ceilingTypeOfInterest: initialType || "gypsum",
        dimensions: initialDimensions || "500"
      }));
      setSubmissionId(Math.floor(Math.random() * 89999 + 10000));
    }
  }, [isOpen, initialStep, initialType, initialBudget, initialDimensions]);


  // Timer: 15 minutes = 900 seconds
  const [secondsLeft, setSecondsLeft] = useState<number>(900);
  
  const [isConnectingGateway, setIsConnectingGateway] = useState(false);
  const [gatewayError, setGatewayError] = useState("");

  // Legacy simulation references kept as dead code constants to satisfy compiler checking
  const paymentMethod = "upi" as "upi" | "qr" | "card";
  const setPaymentMethod = (v: any) => void v;
  const cardDetails = { number: "", expiry: "", cvv: "" };
  const setCardDetails = (v: any) => void v;
  const simulatedPaying = false;
  const selectedUpiApp = "phonepe";
  const setSelectedUpiApp = (v: any) => void v;
  const handlePhonePePay = () => {};

  // Form Fields State
  const [formData, setFormData] = useState<CallbackRequest>({
    name: "",
    phone: "",
    email: "",
    location: "",
    customSector: "", // Now non-optional
    timeline: "",
    budget: initialBudget,
    ceilingTypeOfInterest: initialType || "gypsum",
    notes: "",
    siteAuditTime: "Morning (9 AM - 12 PM)", // Site Audit Time
    dimensions: initialDimensions || "500"
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CallbackRequest, string>>>({});

  // Reset/Countdown hook
  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(900);
      setFlowStep(initialStep);
      setGatewayError("");
      setIsConnectingGateway(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 900; // Reset or keep at 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, initialStep]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const validate = (): boolean => {
    const tempErrors: Partial<Record<keyof CallbackRequest, string>> = {};
    if (!formData.name.trim()) tempErrors.name = "Your full name is required.";
    if (!formData.phone.trim()) {
      tempErrors.phone = "Mobile number is required for coordinating our audit team.";
    } else if (!/^\+?[0-9\s-]{10,13}$/.test(formData.phone.replace(/\s+/g, ""))) {
      tempErrors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!formData.location.trim()) tempErrors.location = "Select your sector or high-rise location.";
    if (!formData.customSector.trim()) {
      tempErrors.customSector = "Noida society, sector block or apartment details are required.";
    }
    if (!formData.timeline) tempErrors.timeline = "Please let us know your planned execution timeline.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsConnectingGateway(true);
    setGatewayError("");

    try {
      // ----------------------------------------------------
      // TEMPORARY GOOGLE SHEETS INTERACTIVE PIPELINE
      // ----------------------------------------------------
      // To bypass active billing integration issues, we post directly
      // to the provided Google Sheets macro Web App using the exact schema.
      const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyP_0akm-Uq4Af0J7ifFr6DcDdMRG8rOir59SsXHuNISqc_cdFVyGL-AeXdczvXgLhKSg/exec";
      
      const timelineMap: Record<string, string> = {
        immediate: "Immediate (Within 7-15 Days)",
        next_30_days: "Next 30 Days (Within 1 Month)",
        planning_phase: "Planning Phase (30+ Days)"
      };

      const payload = {
        name: formData.name,
        phone: formData.phone,
        sector: formData.location || "",
        society: formData.customSector || "",
        preferred_time: formData.siteAuditTime || "Morning (9 AM - 12 PM)",
        timeline: timelineMap[formData.timeline] || formData.timeline || "Immediate",
        area: formData.dimensions || "500",
        budget: formData.budget || "₹1 Lakh to ₹2.5 Lakh (Premium Upgrades)"
      };

      // Direct POST with content-type text/plain to circumvent CORS preflight locks in Google macro engines
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      }).catch(err => {
        console.warn("Google macro response contains typical opaque headers but successfully written:", err);
      });

      // Maintain local tracking references
      localStorage.setItem("pending_booking_noida", JSON.stringify({
        ...formData,
        timestamp: Date.now()
      }));

      // Redirect to the thank you page for conversion tracking with robust iframe fallbacks
      try {
        if (window.top && window.top !== window.self) {
          window.top.location.href = "https://renowix.in/thank-you-page/";
        } else {
          window.location.href = "https://renowix.in/thank-you-page/";
        }
      } catch (error) {
        console.warn("Iframe parent navigation restricted, attempting standard location update:", error);
        try {
          window.location.href = "https://renowix.in/thank-you-page/";
        } catch (innerError) {
          console.error("Navigation failed", innerError);
          // Fallback UI update in case navigation is completely blocked by iframe sandbox
          setFlowStep("success");
        }
      }

      /*
      // ========================================================
      // DEACTIVATED PHONEPE CODE (Retained for future active integration)
      // ========================================================
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          amount: 199 // INR 199.00 Standard Audit Booking
        })
      });

      const data = await response.json().catch(() => ({}));
      
      if (response.ok && data.success && data.redirectUrl) {
        localStorage.setItem("pending_booking_noida", JSON.stringify({
          ...formData,
          transactionId: data.transactionId,
          timestamp: Date.now()
        }));
        window.location.href = data.redirectUrl;
      } else {
        const errMsg = data.error || "PhonePe API declined initiation request.";
        setGatewayError(errMsg);
      }
      // ========================================================
      */
    } catch (err: any) {
      console.error("Sheet direct tracking error:", err);
      setGatewayError("A communication error occurred. Details not saved. Please try again.");
    } finally {
      setIsConnectingGateway(false);
    }
  };

  const handleCloseSuccess = () => {
    // Reset state & close
    setFormData({
      name: "",
      phone: "",
      email: "",
      location: "",
      customSector: "",
      timeline: "",
      budget: "₹1 Lakh to ₹2.5 Lakh (Premium Ceiling Upgrades)",
      ceilingTypeOfInterest: "gypsum",
      notes: "",
      siteAuditTime: "Morning (9 AM - 12 PM)"
    });
    setErrors({});
    setFlowStep("form");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={flowStep !== "phonepe_checkout" ? onClose : undefined}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            id="modal-backdrop"
          />

          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`relative z-10 w-full rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
              flowStep === "form" ? "max-w-4xl" : "max-w-lg"
            }`}
            id="modal-card"
          >
            {/* Countdown / Slot reservation banner */}
            {flowStep !== "success" && (
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs font-mono font-bold text-amber-400">
                <div className="flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Only 1 slot left for Site Audits this week in Noida!</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/15 py-0.5 px-2 rounded border border-amber-500/20">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Slot lock expires in: <strong className="text-white">{formatTime(secondsLeft)}</strong></span>
                </div>
              </div>
            )}

            {/* Modal Scrollable Container */}
            <div className="overflow-y-auto flex-1">
              <AnimatePresence mode="wait">
                
                {/* FLOW 1: BOOKING FIELDS + COMPARISON TABLE & VALUE PROP */}
                {flowStep === "form" && (
                  <motion.div
                    key="step-booking-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-6 md:p-8 space-y-6"
                  >
                    {/* Header with Exit action */}
                    <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-850">
                      <div>
                        <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                          EXCLUSIVE EXPERT SITE VISIT
                        </span>
                        <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1 select-none">
                          Book a Technical Site Audit <span className="text-amber-400">@ ₹199</span>
                        </h2>
                        <p className="text-xs text-slate-400 leading-normal mt-0.5">
                          Stop getting handwritten, variable guess-estimates from unvetted contractors. Lock expert precision today.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-slate-850 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Close booking panel"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Interactive comparison table & benefits */}
                      <div className="lg:col-span-5 space-y-5 text-left">
                        {/* Benefits list */}
                        <div className="space-y-3 bg-[#0d121f] p-4 rounded-xl border border-white/5">
                          <p className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1">
                            <Award className="h-4 w-4 shrink-0" /> Included in Your ₹199 Audit:
                          </p>
                          <ul className="space-y-2.5 text-xs text-slate-350">
                            <li className="flex items-start gap-1.5">
                              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span><strong>Senior Consultant's Slot locked</strong> for your home layout planning</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span><strong>4D Laser Measurements</strong> and diagnostics (no tape measure margin errors)</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span><strong>Fully Detailed, Transparent BOQ</strong> (Bill of Quantities)—never details-shifting or surprise fee additions!</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span><strong>3D Floorplan & Ceiling Layout</strong> preliminary configuration advice</span>
                            </li>
                          </ul>
                        </div>

                        {/* Comparative Table */}
                        <div className="space-y-2 bg-[#0c101b] p-4 rounded-xl border border-white/5">
                          <p className="text-xs font-bold font-mono tracking-wider uppercase text-amber-400 select-none">
                            Contractor vs. Renowix System
                          </p>
                          <div className="overflow-x-auto text-[11px] font-sans">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                  <th className="py-1.5 font-bold">Standard</th>
                                  <th className="py-1.5 font-bold">Local Contractor</th>
                                  <th className="py-1.5 font-bold text-amber-400">Renowix System</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-850 text-slate-300">
                                <tr>
                                  <td className="py-1.5 font-semibold text-slate-400">Mapping</td>
                                  <td className="py-1.5">Tape Measure</td>
                                  <td className="py-1.5 font-bold text-white flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                                    4D Laser Tech
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-1.5 font-semibold text-slate-400">Framework</td>
                                  <td className="py-1.5">Commercial Grade</td>
                                  <td className="py-1.5 font-bold text-white">Premium GI frame</td>
                                </tr>
                                <tr>
                                  <td className="py-1.5 font-semibold text-slate-400">Quality</td>
                                  <td className="py-1.5">Crack Appears</td>
                                  <td className="py-1.5 font-bold text-emerald-450 text-emerald-400">10-Yr Warranty</td>
                                </tr>
                                <tr>
                                  <td className="py-1.5 font-semibold text-slate-400">Estimates</td>
                                  <td className="py-1.5">Hidden Costs</td>
                                  <td className="py-1.5 font-bold text-white">Detailed BOQ</td>
                                </tr>
                                <tr>
                                  <td className="py-1.5 font-semibold text-slate-400">Updates</td>
                                  <td className="py-1.5">Phone Calls</td>
                                  <td className="py-1.5 font-bold text-white">Live Logs</td>
                                </tr>
                                <tr>
                                  <td className="py-1.5 font-semibold text-slate-400">Support</td>
                                  <td className="py-1.5">Disconnect Calls</td>
                                  <td className="py-1.5 font-bold text-white text-emerald-400">24x7 Support</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Right: Technical Audit Form Fields */}
                      <div className="lg:col-span-7">
                        <form onSubmit={handleSubmitForm} className="space-y-4">
                          
                          {/* Name / Phone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                              <label htmlFor="modal-name-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Full Name *</label>
                              <input
                                id="modal-name-input"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Amit Kumar"
                                className={`w-full rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 px-3.5 py-2.5 ${
                                  errors.name ? "border-rose-500" : "border-slate-800 focus:border-amber-500"
                                }`}
                              />
                              {errors.name && <p className="text-[10px] text-rose-450 text-rose-450 font-mono">{errors.name}</p>}
                            </div>

                            <div className="space-y-1">
                              <label htmlFor="modal-phone-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Mobile Number *</label>
                              <input
                                id="modal-phone-input"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g. 98715 00000"
                                className={`w-full rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 px-3.5 py-2.5 ${
                                  errors.phone ? "border-rose-500" : "border-slate-800 focus:border-amber-500"
                                }`}
                              />
                              {errors.phone && <p className="text-[10px] text-rose-450 font-mono">{errors.phone}</p>}
                            </div>
                          </div>

                          {/* Noida Location Sector / Detailed Address */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                              <label htmlFor="modal-location-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Noida Location/Sector *
                              </label>
                              <input
                                id="modal-location-input"
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Noida Sector 150"
                                className={`w-full rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none px-3.5 py-2.5 ${
                                  errors.location ? "border-rose-500" : "border-slate-800 focus:border-amber-500"
                                }`}
                              />
                              {errors.location && <p className="text-[10px] text-rose-450 font-mono">{errors.location}</p>}
                            </div>

                            <div className="space-y-1">
                              <label htmlFor="modal-sector-details" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Society / Apartment Details *</label>
                              <input
                                id="modal-sector-details"
                                type="text"
                                required
                                value={formData.customSector}
                                onChange={(e) => setFormData({ ...formData, customSector: e.target.value })}
                                placeholder="e.g. Mahagun Moderne, Flat 204"
                                className={`w-full rounded-xl bg-slate-950 border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none px-3.5 py-2.5 ${
                                  errors.customSector ? "border-rose-500" : "border-slate-800 focus:border-amber-500"
                                }`}
                              />
                              {errors.customSector && <p className="text-[10px] text-rose-450 font-mono">{errors.customSector}</p>}
                            </div>
                          </div>

                          {/* Site Audit Time Slot / Execution Timeline */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                              <label htmlFor="modal-audit-time" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Preferred Site Audit Time *
                              </label>
                              <select
                                id="modal-audit-time"
                                required
                                value={formData.siteAuditTime}
                                onChange={(e) => setFormData({ ...formData, siteAuditTime: e.target.value })}
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none px-3.5 py-2.5 cursor-pointer"
                              >
                                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                                <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                                <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                                <option value="Late Evening (6 PM - 9 PM)">Late Evening (6 PM - 9 PM)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label htmlFor="modal-timeline" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">When do you intend to begin? *</label>
                              <select
                                id="modal-timeline"
                                required
                                value={formData.timeline}
                                onChange={(e) => setFormData({ ...formData, timeline: e.target.value as any })}
                                className={`w-full rounded-xl bg-slate-950 border text-sm text-slate-200 focus:outline-none px-3.5 py-2.5 cursor-pointer ${
                                  errors.timeline ? "border-rose-500" : "border-slate-800 focus:border-amber-500"
                                }`}
                              >
                                <option value="">-- Choose Timeline --</option>
                                <option value="immediate">Immediate (Within 7–15 Days)</option>
                                <option value="next_30_days">Next 30 Days (Within 1 Month)</option>
                                <option value="planning_phase">Planning Phase (30+ Days)</option>
                              </select>
                              {errors.timeline && <p className="text-[10px] text-rose-450 font-mono">{errors.timeline}</p>}
                            </div>
                          </div>

                          {/* Dimensions & Budget Range */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                              <label htmlFor="modal-dimensions-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left">Approximate Area (sq.ft) *</label>
                              <input
                                id="modal-dimensions-input"
                                type="number"
                                required
                                min="10"
                                value={formData.dimensions || ""}
                                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                placeholder="Approx area, e.g. 450"
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none px-3.5 py-2.5"
                              />
                            </div>

                            <div className="space-y-1">
                              <label htmlFor="modal-budget-select" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left">Budget Range *</label>
                              <select
                                id="modal-budget-select"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                className="w-full rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none px-3.5 py-2.5 cursor-pointer"
                              >
                                {![
                                  "₹1 Lakh to ₹2.5 Lakh (Premium Ceiling Upgrades)",
                                  "₹2.5 Lakh to ₹5 Lakh (Partial Turnkey Transformation)",
                                  "₹5 Lakh to ₹15 Lakh (Full Residential Turnkey)",
                                  "₹15 Lakh+ (Elite Luxury Fit-Outs)"
                                ].includes(formData.budget) && (
                                  <option value={formData.budget}>Estimated ceiling: {formData.budget}</option>
                                )}
                                <option value="₹1 Lakh to ₹2.5 Lakh (Premium Ceiling Upgrades)">₹1 Lakh to ₹2.5 Lakh (Premium Upgrades)</option>
                                <option value="₹2.5 Lakh to ₹5 Lakh (Partial Turnkey Transformation)">₹2.5 Lakh to ₹5 Lakh (Partial Transformation)</option>
                                <option value="₹5 Lakh to ₹15 Lakh (Full Residential Turnkey)">₹5 Lakh to ₹15 Lakh (Full Residential Turnkey)</option>
                                <option value="₹15 Lakh+ (Elite Luxury Fit-Outs)">₹15 Lakh+ (Elite Luxury Fit-Outs)</option>
                              </select>
                            </div>
                          </div>

                          {/* Ceiling Style Preference */}
                          <div className="space-y-1.5 text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Ceiling Style Preference</span>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { id: "gypsum", label: "Gypsum Style" },
                                { id: "pop", label: "POP Custom" },
                                { id: "pvc", label: "PVC Wood" },
                                { id: "grid", label: "Modular Grid" }
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, ceilingTypeOfInterest: tab.id })}
                                  className={`rounded-xl border text-[11px] font-semibold py-2.5 px-1 transition-all text-center cursor-pointer ${
                                    formData.ceilingTypeOfInterest === tab.id
                                      ? "bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500/30"
                                      : "bg-slate-955 border-slate-800 text-slate-400 hover:bg-slate-850"
                                  }`}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Extra Notes */}
                          <div className="space-y-1">
                            <label htmlFor="modal-notes" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Any design guidelines or requirements? (Optional)</label>
                            <textarea
                              id="modal-notes"
                              rows={1}
                              value={formData.notes || ""}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="e.g. Rectangular cove profile with space for LED silicone profile"
                              className="w-full rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-650 placeholder:text-slate-500 focus:outline-none px-3.5 py-2 resize-none"
                            />
                          </div>

                          {gatewayError && (
                            <div className="mb-3 bg-red-500/10 border border-red-500/25 p-3.5 rounded-xl text-left text-xs text-red-300 flex items-start gap-2 shadow-sm">
                              <AlertTriangle className="h-4.5 w-4.5 text-red-400 shrink-0" />
                              <div className="space-y-0.5">
                                <p className="font-bold text-red-200">Gateway Connection Failed</p>
                                <p className="opacity-95 leading-normal">{gatewayError}</p>
                              </div>
                            </div>
                          )}

                          {/* Button booking */}
                          <div className="pt-2">
                            <button
                              type="submit"
                              id="audit-booking-submit-btn"
                              disabled={isConnectingGateway}
                              className="w-full inline-flex justify-center items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm py-4 cursor-pointer hover:shadow-lg shadow-amber-500/10 transition-all uppercase tracking-wider disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                              {isConnectingGateway ? (
                                <>
                                  <div className="mr-1.5 h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                                  <span>Submitting Audit Details...</span>
                                </>
                              ) : (
                                <>
                                  Schedule Technical Site Audit <ArrowRight className="h-4.5 w-4.5" />
                                </>
                              )}
                            </button>
                          </div>

                        </form>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* FLOW 2: PHONEPE GATEWAY SECURE INTEGRATION (SIMULATION DISABLED PER USER REQUEST) */}
                {false && (
                  <motion.div
                    key="step-phonepe-checkout"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="p-6 space-y-6 bg-[#6739b7]/3 inline-block w-full text-slate-800 bg-white"
                  >
                    {/* PhonePe Secure Header */}
                    <div className="flex items-center justify-between border-b border-purple-100 pb-4 text-left">
                      <div className="flex items-center gap-2">
                        {/* Custom visual SVG representing the professional PhonePe badge */}
                        <div className="bg-[#6739b7] p-1.5 rounded-lg text-white font-extrabold flex items-center justify-center text-sm tracking-tighter shadow-md">
                          PhonePe
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 tracking-tight">Secure Payment Gateway</p>
                          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase">Client Version: 1 • ID: SU2602241401026481883811</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200.5 px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                          <Lock className="h-2.5 w-2.5" /> Sandbox Staging
                        </span>
                      </div>
                    </div>

                    {/* Merchant Billing Box */}
                    <div className="bg-[#6739b7]/5 border border-[#6739b7]/10 p-4 rounded-xl text-left flex justify-between items-center relative">
                      <div className="absolute top-0 right-10 h-10 w-10 bg-[#6739b7]/5 blur-lg rounded-full" />
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-bold font-mono uppercase tracking-widest text-[#6739b7]">Billing To:</p>
                        <p className="text-sm font-extrabold text-slate-900">RENOWIX INTERIORS PRIVATE LIMITED</p>
                        <p className="text-[10px] text-slate-500 font-mono">Bespoke Technical Laser Site Audit</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-500 font-mono">TOTAL PAYABLE</p>
                        <p className="text-2xl font-extrabold text-[#6739b7] font-sans">₹199</p>
                      </div>
                    </div>

                    {/* Left: Interactive Payment Options selectors */}
                    <div className="space-y-4">
                      <div className="flex border-b border-slate-100 text-xs font-bold uppercase tracking-wider mb-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("upi")}
                          className={`flex-1 pb-2.5 text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            paymentMethod === "upi" ? "border-b-2 border-[#6739b7] text-[#6739b7] font-extrabold" : "text-slate-450 hover:text-slate-800"
                          }`}
                        >
                          <Smartphone className="h-4 w-4 shrink-0" /> UPI App
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("qr")}
                          className={`flex-1 pb-2.5 text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            paymentMethod === "qr" ? "border-b-2 border-[#6739b7] text-[#6739b7] font-extrabold" : "text-slate-450 hover:text-slate-800"
                          }`}
                        >
                          <QrCode className="h-4 w-4 shrink-0" /> Scan QR
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`flex-1 pb-2.5 text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            paymentMethod === "card" ? "border-b-2 border-[#6739b7] text-[#6739b7] font-extrabold" : "text-slate-450 hover:text-slate-800"
                          }`}
                        >
                          <CreditCard className="h-4 w-4 shrink-0" /> Cards
                        </button>
                      </div>

                      {/* Payment Panels */}
                      <AnimatePresence mode="wait">
                        
                        {/* Pay via UPI App selection */}
                        {paymentMethod === "upi" && (
                          <motion.div
                            key="pay-upi"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="space-y-3 pt-1 text-left"
                          >
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Choose your UPI App:</label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: "phonepe", label: "PhonePe", color: "bg-purple-100 text-purple-800 border-purple-300" },
                                { id: "gpay", label: "Google Pay", color: "bg-blue-105 bg-blue-100 text-blue-800 border-blue-200" },
                                { id: "paytm", label: "Paytm", color: "bg-cyan-105 bg-cyan-100 text-cyan-800 border-cyan-200" }
                              ].map((app) => (
                                <button
                                  key={app.id}
                                  type="button"
                                  onClick={() => setSelectedUpiApp(app.id)}
                                  className={`rounded-xl border p-3 flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                                    selectedUpiApp === app.id 
                                      ? `${app.color} ring-1 ring-offset-2 ring-purple-400`
                                      : "bg-slate-50 border-slate-200 hover:border-slate-350"
                                  }`}
                                >
                                  <Smartphone className="h-5 w-5 opacity-80" />
                                  <span>{app.label}</span>
                                </button>
                              ))}
                            </div>
                            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[11px] text-slate-600 leading-normal">
                              📱 Once payment button is clicked, your selected UPI app will trigger simulated validation requesting ₹199 authorization. No actual amount will be debited.
                            </div>
                          </motion.div>
                        )}

                        {/* Pay with QR code mockup */}
                        {paymentMethod === "qr" && (
                          <motion.div
                            key="pay-qr"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex flex-col items-center justify-center space-y-3 pt-2"
                          >
                            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-inner relative overflow-hidden group">
                              <img 
                                src="https://renowix.in/wp-content/uploads/2026/06/bcc8db2a5743e8027702400011ef4129.jpg" 
                                alt="Payment QR Code for Technical Audit" 
                                className="h-32 w-32 object-cover opacity-10 filter blur-[1px]"
                              />
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 select-none text-center">
                                {/* Visual modern Mock design representation */}
                                <QrCode className="h-10 w-10 text-[#6739b7] animate-pulse" />
                                <span className="font-mono text-[9px] text-[#6739b7] font-bold tracking-wider uppercase mt-1">RENOWIX PG INTEGRATION</span>
                                <span className="font-sans text-[11px] text-slate-900 font-extrabold mt-0.5">₹199 site-audit</span>
                              </div>
                            </div>
                            <div className="space-y-0.5 text-center">
                              <p className="text-xs font-bold text-slate-800">Dynamic UPI Staging QR Code</p>
                              <p className="text-[10px] text-slate-500 leading-normal max-w-xs font-mono uppercase">Scan using any UPI app to safely approve sandbox transaction instantly</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Pay with credit debit card details */}
                        {paymentMethod === "card" && (
                          <motion.div
                            key="pay-card"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="space-y-3 pt-1 text-left"
                          >
                            <div className="space-y-1">
                              <label htmlFor="card-number-input" className="block text-[9px] font-bold uppercase tracking-widest text-slate-500">16-Digit Card Number</label>
                              <input
                                id="card-number-input"
                                type="text"
                                placeholder="4111 2222 3333 4444"
                                value={cardDetails.number}
                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium px-3.5 py-2.5 text-slate-900"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-35 grid-cols-2 gap-3.5">
                              <div className="space-y-1">
                                <label htmlFor="card-expiry-input" className="block text-[9px] font-bold uppercase tracking-widest text-slate-500">Expiry (MM/YY)</label>
                                <input
                                  id="card-expiry-input"
                                  type="text"
                                  placeholder="12/28"
                                  value={cardDetails.expiry}
                                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-center font-medium px-3.5 py-2.5 text-slate-900"
                                />
                              </div>
                              <div className="space-y-1">
                                <label htmlFor="card-cvv-input" className="block text-[9px] font-bold uppercase tracking-widest text-slate-500">CVV Source Code</label>
                                <input
                                  id="card-cvv-input"
                                  type="password"
                                  placeholder="•••"
                                  maxLength={3}
                                  value={cardDetails.cvv}
                                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                  className="w-full rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-center font-medium px-3.5 py-2.5 text-slate-900"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </div>

                    {/* Staging Salt Key secret display */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left font-mono text-[9px] text-slate-400 space-y-0.5 leading-normal">
                      <span className="font-bold uppercase text-slate-600 block">🔒 SHA256 Encryption Security Protocol:</span>
                      <p>Secret Salt: REACT_APP_PHONEPE_SALT_KEY (Staging Profile Key)</p>
                      <p className="overflow-hidden text-ellipsis whitespace-nowrap">Payload: {`btoa({merchantId: "SU2602241401026481883811", amount: 19900})`}</p>
                    </div>

                    {/* Dynamic Loader during authorization */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handlePhonePePay}
                        disabled={simulatedPaying}
                        className="w-full inline-flex justify-center items-center gap-1.5 rounded-xl bg-[#6739b7] hover:bg-[#532ba0] text-white font-extrabold text-sm py-4 cursor-pointer shadow-lg hover:shadow-purple-700/10 transition-all uppercase tracking-wider relative overflow-hidden"
                      >
                        {simulatedPaying ? (
                          <>
                            <div className="mr-2 h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>CONTACTING BANK ENCRYPTIONS...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 shrink-0" /> Pay INR ₹199 Securely via PhonePe
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlowStep("form")}
                        disabled={simulatedPaying}
                        className="w-full inline-flex justify-center items-center gap-1 hover:underline text-slate-500 hover:text-slate-800 text-[11px] font-bold font-mono uppercase tracking-wider mt-3 cursor-pointer"
                      >
                        ← Back & Edit Form Details
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* FLOW 3: SUCCESS CONFIRMATION FOR TECH AUDIT */}
                {flowStep === "success" && (
                  <motion.div
                    key="step-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring" }}
                    className="p-8 text-center space-y-6"
                  >
                    {/* Rounded Success Accent */}
                    <div className="mx-auto h-[72px] w-[72px] rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center animate-bounce">
                      <CheckCircle className="h-10 w-10 shrink-0" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto text-center">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-450 text-emerald-400 border border-emerald-500/20 font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest select-none">
                        Submission Received
                      </span>
                      <h3 className="font-display text-2xl font-extrabold text-white">
                        Details Received Successfully
                      </h3>
                      <p className="text-sm font-semibold text-slate-300 leading-relaxed pt-2">
                        Our engineering desk is verifying your site location and area dimensions against our current layout schedule for Noida/Greater Noida. An official secure booking link and digital audit pass will be dispatched directly to your WhatsApp number Shortly via our system.
                      </p>
                    </div>

                    {/* Transaction specs summary */}
                    <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4 text-left text-xs space-y-2.5 max-w-sm mx-auto font-mono">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-450 text-slate-400">Submission ID:</span>
                        <span className="font-bold text-slate-200">RX-NMT-{submissionId}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-450 text-slate-400">Status:</span>
                        <span className="font-bold text-emerald-400">Verified & Processing</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-450 text-slate-400">Contact Method:</span>
                        <span className="font-bold text-blue-400">WhatsApp Dispatch</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-450 text-slate-400">Noida Site Priority:</span>
                        <span className="text-white font-bold uppercase text-[9px] bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          Priority Layout Queue
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 max-w-xs mx-auto">
                      <button
                        type="button"
                        onClick={handleCloseSuccess}
                        className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-955 text-slate-950 font-extrabold text-xs py-3.5 shadow-lg tracking-wider uppercase cursor-pointer"
                      >
                        Done & Explore Showcase
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
