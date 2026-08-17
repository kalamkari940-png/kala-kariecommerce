import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

export function ContactPage() {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs uppercase tracking-[0.3em] font-medium text-amber-800">Atelier Concierge</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif">Contact Us</h1>
        <p className="mt-4 text-sm text-neutral-500 font-light">Book an appointment or speak with our personal bridal stylists.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8 bg-neutral-50 dark:bg-neutral-900 p-8 rounded-sm border">
          <h2 className="text-2xl font-serif">Chennai Atelier</h2>

          <div className="space-y-6 text-xs font-light">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-amber-800 shrink-0" />
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Studio Address</p>
                <p className="text-neutral-500 mt-1">{settings.contact?.studio}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-amber-800 shrink-0" />
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Call / WhatsApp</p>
                <p className="text-neutral-500 mt-1">{settings.contact?.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-amber-800 shrink-0" />
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Email</p>
                <p className="text-neutral-500 mt-1">{settings.contact?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {submitted ? (
            <div className="bg-emerald-50 text-emerald-900 p-8 rounded-sm text-center">
              <h3 className="text-2xl font-serif">Message Received</h3>
              <p className="text-xs mt-2 font-light">Our bridal concierge team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 mb-1">Your Name</label>
                  <input required type="text" className="w-full border px-3 py-2.5 rounded-sm outline-none bg-neutral-50 dark:bg-neutral-800" />
                </div>
                <div>
                  <label className="block text-neutral-500 mb-1">Email</label>
                  <input required type="email" className="w-full border px-3 py-2.5 rounded-sm outline-none bg-neutral-50 dark:bg-neutral-800" />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Subject</label>
                <input required type="text" placeholder="Bridal Consultation / Custom Order" className="w-full border px-3 py-2.5 rounded-sm outline-none bg-neutral-50 dark:bg-neutral-800" />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Message</label>
                <textarea required rows={5} className="w-full border p-3 rounded-sm outline-none bg-neutral-50 dark:bg-neutral-800" />
              </div>

              <button type="submit" className="bg-neutral-950 text-white dark:bg-white dark:text-black px-8 py-3.5 text-xs uppercase tracking-widest font-medium">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
