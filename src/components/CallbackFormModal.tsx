import React, { useState } from "react";
import { X, CheckCircle, Calendar, Shield, IndianRupee, MapPin, Clock } from "lucide-react";
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
    location: "",
    customSector: "",
    timeline: "",
    budget: initialBudget,
    ceilingTypeOfInterest: initialType || "gypsum",
    notes: "",
    callbackTime: "Anytime (9 AM - 9 PM)"
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CallbackRequest, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const tempErrors: Partial<Record<keyof CallbackRequest, string>> = {};
    if (!formData.name.trim()) tempErrors.name = "We need your name to address you.";
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required for callback.";
    } else if (!/^\+?[0-9\s-]{10,13}$/.test(formData.phone.replace(/\s+/g, ""))) {
      tempErrors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (!formData.location.trim()) tempErrors.location = "Please tell us your sector or location.";
    if (!formData.timeline) tempErrors.timeline = "Please select a starting timeline.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const formatWhatsAppMessage = (data: CallbackRequest) => {
    const materialName = 
      data.ceilingTypeOfInterest === "gypsum" ? "Seamless Gypsum" :
      data.ceilingTypeOfInterest === "pop" ? "Handcarved POP Plaster" :
      data.ceilingTypeOfInterest === "pvc" ? "Waterproof PVC Wood" :
      data.ceilingTypeOfInterest === "grid" ? "Acoustic T-Grid" : data.ceilingTypeOfInterest;

    const timelineLabel = 
      data.timeline === "within_1_month" ? "Within 1 Month (Immediate)" :
      data.timeline === "within_3_months" ? "Within 3 Months" :
      data.timeline === "within_6_months" ? "Within 6 Months" :
      data.timeline === "after_1_year" ? "After 1 Year" : "Not Specified";

    return `Hello Renowix Ceilings, I want to request a callback for False Ceiling work in Noida.

*• Name:* ${data.name}
*• Mobile:* ${data.phone}
*• Preferred Callback Time:* ${data.callbackTime}
*• Noida Location/Sector:* ${data.location}
*• Specific Address:* ${data.customSector || "Not specified"}
*• Preferred Material:* ${materialName}
*• Installation Timeline:* ${timelineLabel}
*• Estimated Budget:* ${data.budget || "Not specified"}
*• Special Design Requests:* ${data.notes || "None"}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      const message = formatWhatsAppMessage(formData);
      const url = `https://api.whatsapp.com/send?phone=919211429635&text=${encodeURIComponent(message)}`;
      
      // 1. Immediately launch the pre-filled WhatsApp link in a new focused tab.
      // Because this is directly executed within the synchronous `submit` click handler,
      // all modern browsers and pop-up blockers accept it fully without restriction.
      try {
        window.open(url, "_blank");
      } catch (err) {
        console.error("Failed to auto-launch WhatsApp window:", err);
      }
      
      // 2. Simultaneously redirect the active primary tab to the official WordPress thank-you page.
      // This is the absolute highest authority navigation and is fully supported for firing Meta Ads pixels.
      setTimeout(() => {
        setIsSubmitting(false);
        try {
          if (window.top) {
            window.top.location.href = "https://renowix.in/thank-you-page/";
          } else {
            window.location.href = "https://renowix.in/thank-you-page/";
          }
        } catch (err) {
          window.location.href = "https://renowix.in/thank-you-page/";
        }
        onClose();
      }, 500);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      location: "",
      customSector: "",
      timeline: "",
      budget: "₹25,000 - ₹50,000",
      ceilingTypeOfInterest: "gypsum",
      notes: "",
      callbackTime: "Anytime (9 AM - 9 PM)"
    });
    setErrors({});
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
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            id="modal-backdrop"
          />

          {/* Modal content: light and clean */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white text-slate-800 shadow-2xl border border-slate-150"
            id="modal-card"
          >
            {/* Header branding accents */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 border-b border-amber-200/50 px-6 py-5 text-slate-900 relative">
              <div className="absolute top-0 right-12 h-16 w-16 bg-amber-500/5 blur-xl rounded-full" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700">Noida Installation</span>
                  <p className="font-display text-xl font-bold text-slate-900 tracking-tight">Request an Expert Callback</p>
                </div>
                <button
                  type="button"
                  id="close-modal-btn"
                  onClick={onClose}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Inner Content */}
            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
              <form id="callback-request-form" onSubmit={handleSubmit} className="space-y-4 text-left">
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Fill out this simple, optimized form, and we will coordinate layouts & technical catalogs with you instantly via WhatsApp.
                </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-1">
                      <label htmlFor="name-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Your Full Name *</label>
                      <input
                        type="text"
                        id="name-input"
                        required
                        placeholder="e.g. Amit Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                          errors.name ? "border-rose-500/60 focus:ring-rose-500/20" : ""
                        }`}
                      />
                      {errors.name && <p className="text-xs text-rose-500 font-semibold">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label htmlFor="phone-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Mobile Number *</label>
                      <input
                        type="tel"
                        id="phone-input"
                        required
                        placeholder="e.g. 98715 XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                          errors.phone ? "border-rose-500/60 focus:ring-rose-500/20" : ""
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-rose-500 font-semibold">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Noida Location Sector Selection */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="location-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-amber-600" /> Noida Location / Sector *
                      </label>
                      <input
                        type="text"
                        id="location-input"
                        required
                        placeholder="e.g. Sector 137, Noida"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className={`w-full rounded-xl bg-slate-50 border px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium ${
                          errors.location ? "border-rose-500/60 focus:ring-rose-500/20" : "border-slate-200"
                        }`}
                      />
                      {errors.location && <p className="text-xs text-rose-500 font-semibold">{errors.location}</p>}
                    </div>

                    {/* Best Time to Call Section */}
                    <div className="space-y-1">
                      <label htmlFor="callback-time-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-600" /> Best Callback Time *
                      </label>
                      <select
                        id="callback-time-select"
                        required
                        value={formData.callbackTime}
                        onChange={(e) => setFormData({ ...formData, callbackTime: e.target.value })}
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium cursor-pointer"
                      >
                        <option value="Anytime (9 AM - 9 PM)">Anytime (9 AM - 9 PM)</option>
                        <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                        <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                        <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                        <option value="Late Evening (6 PM - 9 PM)">Late Evening (6 PM - 9 PM)</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom specific address details */}
                  <div className="space-y-1">
                    <label htmlFor="custom-sector-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Society / Apartment details (Optional)</label>
                    <input
                      type="text"
                      id="custom-sector-input"
                      placeholder="e.g. Mahagun Moderne, Flat 402, Sector 78"
                      value={formData.customSector}
                      onChange={(e) => setFormData({ ...formData, customSector: e.target.value })}
                      className="w-full rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Timeline Dropdown */}
                    <div className="space-y-1">
                      <label htmlFor="timeline-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-amber-600" /> Installation Timeline *
                      </label>
                      <select
                        id="timeline-select"
                        required
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value as any })}
                        className={`w-full rounded-xl bg-slate-50 border px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 cursor-pointer font-medium ${
                          errors.timeline ? "border-rose-500 focus:ring-rose-200" : "border-slate-200 focus:ring-amber-500/20 focus:border-amber-500"
                        }`}
                      >
                        <option value="" className="text-slate-400">-- Choose Timeline --</option>
                        <option value="within_1_month">Within 1 month (Immediate)</option>
                        <option value="within_3_months">Within 3 months</option>
                        <option value="within_6_months">Within 6 months</option>
                        <option value="after_1_year">After 1 year</option>
                      </select>
                      {errors.timeline && <p className="text-xs text-rose-500 font-semibold">{errors.timeline}</p>}
                    </div>

                    {/* Budget Dropdown / Select */}
                    <div className="space-y-1">
                      <label htmlFor="budget-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5 text-amber-600" /> Budget Range
                      </label>
                      <select
                        id="budget-select"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium cursor-pointer"
                      >
                        <option value="Under ₹25,000">Under ₹25,000 (Single Room)</option>
                        <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000 (standard)</option>
                        <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                        <option value="Over ₹1,00,000">Over ₹1,00,000 (Full Flat)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Material Radio buttons */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Preferred Material</label>
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
                          className={`rounded-xl border px-3.5 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                            formData.ceilingTypeOfInterest === item.id
                              ? "bg-amber-500/10 border-amber-500 text-amber-805 ring-1 ring-amber-500 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-1">
                    <label htmlFor="notes-textarea" className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Special Requests? (Optional)</label>
                    <textarea
                      id="notes-textarea"
                      rows={1}
                      placeholder="e.g. Need rectangular cove, space for strip lighting."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full rounded-xl px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500/20 focus:border-amber-500 font-medium resize-none"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      id="callback-submit-btn"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center items-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/10 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                          Redirecting to Thank-You Page...
                        </>
                      ) : (
                        "Request Callback"
                      )}
                    </button>
                    <p className="mt-2 text-center text-[9px] text-slate-450 flex items-center justify-center gap-1 select-none font-mono uppercase tracking-widest">
                      <Shield className="h-3 w-3 text-emerald-500" /> Secure Encryption
                    </p>
                  </div>
                </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
