import React from 'react';
import { ShieldCheck, FileText, Lock, AlertTriangle } from 'lucide-react';

const Legal: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-white mb-4">Legal & Compliance</h1>
        <p className="text-gray-400">Transparency is part of the discipline.</p>
      </div>

      <div className="space-y-12">
        
        {/* HIPAA */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">HIPAA Compliance</h2>
          </div>
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              Deep Getty Corp is fully compliant with the Health Insurance Portability and Accountability Act (HIPAA). 
              Any Protected Health Information (PHI) you provide—including body scans, bloodwork results, and health history—is encrypted both in transit and at rest using military-grade AES-256 encryption.
            </p>
            <p>
              We partner with verified laboratories and pharmacies to fulfill Deep Getty Life orders. Your data is only shared with these covered entities for the sole purpose of treatment and healthcare operations.
            </p>
            <p>
              You have the right to request your medical records at any time via the Admin panel or Concierge support.
            </p>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-white">Medical Disclaimer</h2>
          </div>
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              <strong>Deep Getty is not a doctor.</strong> The AI features, including form correction and "Protocol Specialist" chat agents, are for informational and coaching purposes only. They do not constitute professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              <strong>Peptide Protocols:</strong> All peptide protocols available through Deep Getty Life are prescribed by third-party licensed physicians based on the health data you provide. Results may vary. Potential side effects should be discussed with your assigned physician.
            </p>
            <p>
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
            </p>
          </div>
        </section>

        {/* Terms */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
          </div>
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              <strong>Membership:</strong> The Deep Getty membership is billed at $97/month. You agree to a recurring monthly charge. 
            </p>
            <p>
              <strong>Trial Period:</strong> New users are entitled to a 24-hour trial period. If you cancel within 24 hours of initial sign-up, you will not be charged.
            </p>
            <p>
              <strong>User Conduct:</strong> You agree not to misuse the AI features, including attempting to jailbreak the AI agents or use the platform for illegal activities. Deep Getty Corp reserves the right to terminate accounts found in violation of these terms.
            </p>
          </div>
        </section>

      </div>

      <div className="mt-12 text-center text-xs text-gray-600">
        Last Updated: October 24, 2025
      </div>
    </div>
  );
};

export default Legal;