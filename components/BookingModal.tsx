'use client';

import { useState } from 'react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-parchment rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bebas text-forest tracking-[0.04em]">
              Book a Demo
            </h3>
            <button
              onClick={onClose}
              className="text-mid hover:text-forest transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-forest mb-1">
                Full Name*
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Work Email */}
            <div>
              <label htmlFor="workEmail" className="block text-sm font-medium text-forest mb-1">
                Work Email*
              </label>
              <input
                type="email"
                id="workEmail"
                name="workEmail"
                required
                value={formData.workEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                placeholder="john@company.com"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-forest mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-forest mb-1">
                Industry*
              </label>
              <select
                id="industry"
                name="industry"
                required
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
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
              <label htmlFor="estimatedMonthlyBookings" className="block text-sm font-medium text-forest mb-1">
                Estimated Monthly Bookings*
              </label>
              <select
                id="estimatedMonthlyBookings"
                name="estimatedMonthlyBookings"
                required
                value={formData.estimatedMonthlyBookings}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
              >
                <option value="">Select range</option>
                <option value="0-50">0-50</option>
                <option value="51-100">51-100</option>
                <option value="101-250">101-250</option>
                <option value="251-500">251-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-forest text-parchment py-3 rounded-lg font-medium tracking-[0.04em] transition-all duration-200 hover:bg-canopy hover:-translate-y-px"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
