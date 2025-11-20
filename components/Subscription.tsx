import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

interface SubscriptionProps {
  onSubscribe: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ onSubscribe }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-in fade-in duration-700">
        
        <div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Unlock Your <br/><span className="text-blue-500">Potential.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            DeepGetty is more than a fitness app. It is a comprehensive operating system for human performance. Join the movement.
          </p>
          <div className="space-y-4 mb-8">
            {[
              'Unlimited Access to 12 Disciplines',
              'Real-time AI Form Correction',
              'DeepGetty Go Mobile Access',
              'Advanced Biometric Tracking',
              'Priority Access to Peptide Protocols'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-1 rounded-full">
                  <Check className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl">
            MOST POPULAR
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">All Access Membership</h3>
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-5xl font-bold text-white">$97</span>
            <span className="text-gray-500">/month</span>
          </div>

          <button 
            onClick={onSubscribe}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-colors mb-6 shadow-lg shadow-blue-900/20"
          >
            Start Membership
          </button>

          <p className="text-xs text-gray-500 text-center mb-6">
            24-hour risk-free trial. Cancel anytime.
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-black/20 py-2 rounded-lg">
            <ShieldCheck className="w-3 h-3" />
            <span>Secure Payment via Stripe</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Subscription;