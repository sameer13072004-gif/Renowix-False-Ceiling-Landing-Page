import React, { useState } from "react";
import { X, CheckCircle, Calendar, Shield, IndianRupee, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CallbackRequest } from "../types";
import { NOIDA_LOCATIONS } from "../constants";

interface CallbackFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
  initialBudget?: string;
}

export default function CallbackFormModal({
  isOpen,
  onClose,
  initialType = "",
  initialBudget = "₹25,000 - ₹50,000"
}: CallbackFormModalProps) {
  const [formData, setFormData] = useState<CallbackRequest>({
    name: "",
    phone: "",
    email: "",
    location: NOIDA_LOCATIONS[0],
    customSector: "",
    timeline: "",
    budget: initialBudget,
    ceilingTypeOfInterest: initialType || "gypsum",
    notes: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CallbackRequest, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const tempErrors: Partial<Record<keyof CallbackRequest, string>> = {};
    if (!formData.name.trim()) tempErrors.name = "We need your name to address you.";
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required for callback.";
    } else if (!/^\+?[0-9\s-]{10,13}$/.test(formData.phone.replace(/\s+/g, ""))) {
      tempErrors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!formData.timeline) tempErrors.timeline = "Please select a starting timeline.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API post (front-end only as requested)
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 900);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      location: NOIDA_LOCATIONS[0],
      customSector: "",
      timeline: "",
      budget: "₹25,000 - ₹50,000",
      ceilingTypeOfInterest: "gypsum",
      notes: ""
    });
    setErrors({});
    setIsSubmitted(false);
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
            onClick={onClose}
            className="absolute inset-0 bg-[#0c0f14]/80 backdrop-blur-md"
            id="modal-backdrop"
          />

          {/* Modal content cardboard */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl glass-panel-heavy shadow-2xl ring-1 ring-white/10"
            id="modal-card"
          >
            {/* Header branding accents */}
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-700/20 border-b border-white/10 px-6 py-5 text-white relative">
              <div className="absolute top-0 right-12 h-16 w-16 bg-amber-500/10 blur-xl rounded-full" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">Noida Installation</span>
                  <p className="font-display text-xl font-bold text-white tracking-tight">Request an Expert Callback</p>
                </div>
                <button
                  type="button"
                  id="close-modal-btn"
                  onClick={onClose}
                  className="rounded-full bg-white/5 p-2 text-slate-300 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Inner Content */}
            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
              {isSubmitted ? (
                <div id="submission-success-view" className="py-6 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">Callback Request Confirmed!</h3>
                  <div className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto space-y-3">
                    <p>
                      Hello <strong className="text-amber-400 font-semibold">{formData.name}</strong>, thank you for choosing Renowix False Ceiling services Noida!
                    </p>
                    <p className="bg-emerald-500/10 text-emerald-300 p-4 rounded-xl border border-emerald-500/20 font-medium">
                      📱 An interiors specialist will call your mobile number <span className="underline font-mono text-emerald-250 font-bold">{formData.phone}</span> within 15 minutes to coordinate details.
                    </p>
                    <p className="text-xs text-slate-400 leading-normal">
                      We will discuss the design highlights (such as center tables, bands, curves) and guide you on the starting configurations and technical estimates.
                    </p>
                  </div>
                  <div className="pt-6">
                    <button
                      type="button"
                      id="callback-success-close-btn"
                      onClick={handleReset}
                      className="w-full inline-flex justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 focus:outline-none transition-all font-sans cursor-pointer uppercase tracking-wider"
                    >
                      Awesome, see you soon!
                    </button>
                  </div>
                </div>
              ) : (
                <form id="callback-request-form" onSubmit={handleSubmit} className="space-y-5 text-left">
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    Provide basic installation details below. No upfront payment required. Our specialists will call you to discuss configurations and design requirements.
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-1">
                      <label htmlFor="name-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Full Name *</label>
                      <input
                        type="text"
                        id="name-input"
                        required
                        placeholder="e.g. Amit Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-sm glass-input placeholder:text-slate-500 focus:outline-none ${
                          errors.name ? "border-rose-500/60 focus:ring-rose-500/20" : ""
                        }`}
                      />
                      {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label htmlFor="phone-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Mobile Number *</label>
                      <input
                        type="tel"
                        id="phone-input"
                        required
                        placeholder="e.g. 98715 XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-sm glass-input placeholder:text-slate-500 focus:outline-none ${
                          errors.phone ? "border-rose-500/60 focus:ring-rose-500/20" : ""
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-rose-400">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="email-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address (Optional)</label>
                    <input
                      type="email"
                      id="email-input"
                      placeholder="amit.kumar@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm glass-input placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* Noida Location Sector Selection */}
                  <div className="space-y-1">
                    <label htmlFor="location-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-amber-500" /> Noida Location / Sector *
                    </label>
                    <select
                      id="location-select"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-xl bg-slate-900 border border-white/12 px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      {NOIDA_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-slate-950 text-white">
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom specific address details */}
                  <div className="space-y-1">
                    <label htmlFor="custom-sector-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Specific Society or Street Address</label>
                    <input
                      type="text"
                      id="custom-sector-input"
                      placeholder="e.g. Mahagun Moderne, Flat 402, Sector 78"
                      value={formData.customSector}
                      onChange={(e) => setFormData({ ...formData, customSector: e.target.value })}
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm glass-input placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Timeline Dropdown */}
                    <div className="space-y-1">
                      <label htmlFor="timeline-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" /> Installation Timeline *
                      </label>
                      <select
                        id="timeline-select"
                        required
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value as any })}
                        className={`w-full rounded-xl bg-slate-900 border px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 search-select ${
                          errors.timeline ? "border-rose-500 focus:ring-rose-200" : "border-white/12 focus:ring-amber-500/20 focus:border-amber-500"
                        }`}
                      >
                        <option value="" className="bg-slate-950 text-slate-400">-- Choose Timeline --</option>
                        <option value="within_1_month" className="bg-slate-950 text-white">Within 1 month (Immediate)</option>
                        <option value="within_3_months" className="bg-slate-950 text-white">Within 3 months</option>
                        <option value="within_6_months" className="bg-slate-950 text-white">Within 6 months</option>
                        <option value="after_1_year" className="bg-slate-950 text-white">After 1 year</option>
                      </select>
                      {errors.timeline && <p className="text-xs text-rose-400">{errors.timeline}</p>}
                    </div>

                    {/* Budget Dropdown / Select */}
                    <div className="space-y-1">
                      <label htmlFor="budget-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5 text-amber-500" /> Budget Range
                      </label>
                      <select
                        id="budget-select"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full rounded-xl bg-slate-900 border border-white/12 px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        <option value="Under ₹25,000" className="bg-slate-950 text-white">Under ₹25,000 (Single Room)</option>
                        <option value="₹25,000 - ₹50,000" className="bg-slate-950 text-white">₹25,000 - ₹50,000 (Standard Hall)</option>
                        <option value="₹50,000 - ₹1,00,000" className="bg-slate-950 text-white">₹50,000 - ₹1,00,000 (2 BHK Quality)</option>
                        <option value="Over ₹1,00,000" className="bg-slate-950 text-white">Over ₹1,00,000 (Full 3/4 BHK Luxury)</option>
                      </select>
                    </div>
                  </div>

                  {/* Ceiling type of Interest */}
                  <div className="space-y-1.5">
                    <label htmlFor="ceiling-type-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Preferred Ceiling Material</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "gypsum", label: "Gypsum (Seamless)" },
                        { id: "pop", label: "POP plaster" },
                        { id: "pvc", label: "PVC wood panel" },
                        { id: "grid", label: "Acoustic T-Grid" }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          id={`ceiling-pref-${item.id}`}
                          onClick={() => setFormData({ ...formData, ceilingTypeOfInterest: item.id })}
                          className={`rounded-xl border px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                            formData.ceilingTypeOfInterest === item.id
                              ? "bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500"
                              : "bg-black/20 border-white/8 text-slate-300 hover:bg-white/5"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom ceiling details */}
                  <div className="space-y-1">
                    <label htmlFor="notes-textarea" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Special Design Requests? (Optional)</label>
                    <textarea
                      id="notes-textarea"
                      rows={2}
                      placeholder="e.g. Need rectangular cove ceiling with space for profile lighting strip."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm glass-input placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* Trust indicator and CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      id="callback-submit-btn"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center items-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 px-5 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                          Sending Call Proposal...
                        </>
                      ) : (
                        "Request My Call Discovery"
                      )}
                    </button>
                    <p className="mt-2.5 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1 select-none font-mono uppercase tracking-widest">
                      <Shield className="h-3.5 w-3.5 text-emerald-500" /> Direct from Renowix. Your data is 100% secure.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
