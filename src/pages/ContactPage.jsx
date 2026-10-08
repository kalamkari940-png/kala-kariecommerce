import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { MapPin, Phone, Mail, Sparkles, CheckCircle2, Send, Clock } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

export function ContactPage() {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Reveal className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/10 dark:bg-amber-400/10 border border-amber-800/20 text-[#b4833e] dark:text-amber-300 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Atelier Concierge</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif text-foreground">Connect With Us</h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
          Book a bespoke bridal consultation or reach out to our Chennai studio for styling inquiries.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Left Card */}
        <div className="lg:col-span-5 space-y-8 glass-panel p-6 sm:p-8 rounded-sm shadow-md h-fit">
          <h2 className="text-2xl font-serif text-foreground font-semibold border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
            Chennai Studio
          </h2>

          <div className="space-y-6 text-xs font-light">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-amber-800 dark:text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-foreground uppercase tracking-wider">Studio Address</p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">{settings.contact?.studio}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-amber-800 dark:text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-foreground uppercase tracking-wider">Call / WhatsApp</p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">{settings.contact?.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-amber-800 dark:text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-foreground uppercase tracking-wider">Email Concierge</p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">{settings.contact?.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-amber-800 dark:text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-foreground uppercase tracking-wider">Visiting Hours</p>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">Monday – Saturday: 10:30 AM – 7:30 PM (IST)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Right */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-sm shadow-md">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 grid place-items-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-foreground">Message Received</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light max-w-sm mx-auto">
                Thank you for getting in touch. Our styling concierge team will reach out to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="text-xl font-serif text-foreground font-semibold border-b border-neutral-200/80 dark:border-neutral-800 pb-3">
                Send an Inquiry
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ananya Ramachandran"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 rounded-xs outline-none text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="ananya@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full glass-input px-3 py-2.5 rounded-xs outline-none text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Subject / Outfit Category</label>
                <input
                  required
                  type="text"
                  placeholder="Bridal Consultation / Custom Fit Inquiry"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full glass-input px-3 py-2.5 rounded-xs outline-none text-foreground"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 mb-1 font-semibold">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about the occasion, preferred dates, or custom requirements..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full glass-input p-3 rounded-xs outline-none text-foreground"
                />
              </div>

              <button
                type="submit"
                className="bg-[#1c2d27] text-[#f7f4ee] dark:bg-amber-400 dark:text-black px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#263e36] transition shadow-md flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
