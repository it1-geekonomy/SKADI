'use client';

import { useState, useEffect } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phoneNumber: '',
    industry: '',
    estimatedMonthlyBookings: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // ── Scroll lock ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── Escape key close ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
          setFormData({
            fullName: '',
            workEmail: '',
            phoneNumber: '',
            industry: '',
            estimatedMonthlyBookings: ''
          });
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    /*
     * Overlay
     * - fixed inset-0 + z-50: covers entire viewport
     * - overflow-y-auto: lets the overlay itself scroll on very short screens
     *   so the modal is never clipped
     * - p-4 sm:p-6: breathing room on all sides
     * - items-start sm:items-center: align top on mobile (avoids keyboard
     *   pushing content off-screen), centered on larger screens
     */
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center
                 overflow-y-auto p-4 sm:p-6
                 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/*
       * Modal card
       * - w-full max-w-md: full width on mobile, capped on desktop
       * - max-h-[calc(100dvh-2rem)]: never taller than the viewport (dvh
       *   accounts for mobile browser chrome / virtual keyboard)
       * - overflow-y-auto: scroll inside the card when content is tall
       * - my-auto: vertical centering inside the flex column on short screens
       */}
      <div
        className="relative bg-parchment rounded-xl shadow-2xl
                   w-full max-w-md
                   max-h-[calc(100dvh-2rem)]
                   overflow-y-auto
                   my-auto"
      >
        {/* ── Sticky header ─────────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-10 bg-parchment
                     flex justify-between items-center
                     px-5 sm:px-6 pt-5 sm:pt-6 pb-3
                     border-b border-stone/30"
        >
          <h3
            id="modal-title"
            className="text-2xl sm:text-3xl font-bebas text-forest tracking-[0.04em]"
          >
            Book a Demo
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-mid hover:text-forest hover:bg-stone/20
                       rounded-lg p-1 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Form body ─────────────────────────────────────────────────── */}
        <div className="px-5 sm:px-6 py-5 sm:py-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name + Phone side-by-side on wider screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName"
                       className="block text-sm font-medium text-forest mb-1">
                  Full Name *
                </label>
                <input
                  type="text" id="fullName" name="fullName" required
                  value={formData.fullName} onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-stone rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-forest
                             focus:border-transparent bg-parchment"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber"
                       className="block text-sm font-medium text-forest mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel" id="phoneNumber" name="phoneNumber" required
                  value={formData.phoneNumber} onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-stone rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-forest
                             focus:border-transparent bg-parchment"
                />
              </div>
            </div>

            {/* Work Email */}
            <div>
              <label htmlFor="workEmail"
                     className="block text-sm font-medium text-forest mb-1">
                Work Email *
              </label>
              <input
                type="email" id="workEmail" name="workEmail" required
                value={formData.workEmail} onChange={handleChange}
                placeholder="john@company.com"
                className="w-full px-3 py-2 border border-stone rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-forest
                           focus:border-transparent bg-parchment"
              />
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry"
                     className="block text-sm font-medium text-forest mb-1">
                Industry *
              </label>
              <select
                id="industry" name="industry" required
                value={formData.industry} onChange={handleChange}
                className="w-full px-3 py-2 border border-stone rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-forest
                           focus:border-transparent bg-parchment"
              >
                <option value="">Select an industry</option>
                <option value="healthcare">Healthcare</option>
                <option value="legal">Legal</option>
                <option value="real-estate">Real Estate</option>
                <option value="automotive">Automotive</option>
                <option value="hospitality">Hospitality</option>
                <option value="restaurants">Restaurants</option>
                <option value="retail">Retail</option>
                <option value="services">Professional Services</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Estimated Monthly Bookings */}
            <div>
              <label htmlFor="estimatedMonthlyBookings"
                     className="block text-sm font-medium text-forest mb-1">
                Estimated Monthly Bookings *
              </label>
              <select
                id="estimatedMonthlyBookings" name="estimatedMonthlyBookings" required
                value={formData.estimatedMonthlyBookings} onChange={handleChange}
                className="w-full px-3 py-2 border border-stone rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-forest
                           focus:border-transparent bg-parchment"
              >
                <option value="">Select range</option>
                <option value="0-50">0–50</option>
                <option value="51-100">51–100</option>
                <option value="101-250">101–250</option>
                <option value="251-500">251–500</option>
                <option value="501-1000">501–1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>

            {/* Status messages */}
            {submitStatus === 'success' && (
              <div className="text-green-600 text-center font-medium">
                ✓ Booking submitted successfully! We'll be in touch soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="text-red-600 text-center font-medium">
                ✗ Failed to submit. Please try again.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-forest text-parchment py-3 rounded-lg
                         font-medium tracking-[0.04em] transition-all duration-200
                         hover:bg-canopy hover:-translate-y-px active:translate-y-0
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:bg-forest disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}