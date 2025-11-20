
import React, { useState } from 'react';
import { Dna, Activity, Droplets, ChevronRight, ShoppingCart, Shield, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

const Life: React.FC = () => {
  const [view, setView] = useState<'LANDING' | 'ASSESSMENT' | 'RESULTS'>('LANDING');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const startAssessment = () => {
    setView('ASSESSMENT');
    setAssessmentStep(0);
  };

  const handleAnswer = (question: string, answer: string) => {
    setAnswers({ ...answers, [question]: answer });
    if (assessmentStep < 2) {
      setAssessmentStep(prev => prev + 1);
    } else {
      setView('RESULTS');
    }
  };

  const renderAssessment = () => {
    const questions = [
      {
        q: "Optimization Target",
        sub: "What is your primary biological objective?",
        options: ["Accelerated Recovery", "Cognitive Clarity", "Muscle Hypertrophy", "Anti-Aging / Longevity"]
      },
      {
        q: "Inflammation Status",
        sub: "Do you currently experience joint pain or systemic fatigue?",
        options: ["Chronic / Severe", "Occasional", "Rarely / Never", "Post-Training Only"]
      },
      {
        q: "Energy Profile",
        sub: "How would you rate your midday metabolic output?",
        options: ["Consistent", "Minor Dip", "Major Crash", "Highly Variable"]
      }
    ];

    const currentQ = questions[assessmentStep];

    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-8">
        <div className="mb-12 flex items-center gap-2 text-sm text-gray-500">
          <span className="text-red-500 font-bold uppercase tracking-wider">Protocol Assessment</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Phase {assessmentStep + 1} / 3</span>
        </div>

        <div className="text-center mb-16">
           <h2 className="text-5xl font-serif font-bold text-white mb-4">{currentQ.q}</h2>
           <p className="text-xl text-gray-400">{currentQ.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentQ.options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleAnswer(currentQ.q, opt)}
              className="group relative bg-zinc-900 border border-zinc-800 hover:border-red-500/50 rounded-2xl p-8 cursor-pointer transition-all hover:bg-zinc-800"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-300 group-hover:text-white transition-colors">{opt}</span>
                <div className="w-12 h-12 rounded-full bg-black border border-zinc-700 group-hover:bg-red-500 group-hover:border-red-500 flex items-center justify-center transition-all">
                   <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 max-w-6xl mx-auto">
       <div className="bg-gradient-to-br from-zinc-900 to-red-900/20 border border-zinc-800 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Dna className="w-96 h-96 text-red-500" />
          </div>
          
          <div className="relative z-10">
             <div className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-full text-xs font-bold mb-8 border border-green-900/50">
               <CheckCircle2 className="w-4 h-4" /> MATCH IDENTIFIED
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
               <div>
                 <h3 className="text-5xl font-serif font-bold text-white mb-6">Performance<br/>Recovery Stack</h3>
                 <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                   Based on your biometric inputs, this protocol targets systemic inflammation and accelerates soft tissue repair using a synergy of BPC-157 and TB-500. This is the standard for elite athletic recovery.
                 </p>
                 
                 <div className="space-y-6 mb-8">
                   <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                      <div>
                        <h4 className="font-bold text-white">BPC-157 (5mg)</h4>
                        <p className="text-sm text-gray-500">Systemic healing and gut health optimization.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                      <div>
                        <h4 className="font-bold text-white">TB-500 (5mg)</h4>
                        <p className="text-sm text-gray-500">Cellular migration and actin upregulation.</p>
                      </div>
                   </div>
                 </div>
               </div>

               <div className="flex flex-col justify-center bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
                 <div className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Protocol Investment</div>
                 <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-6xl font-bold text-white">$997</span>
                    <span className="text-xl text-gray-500">/ cycle</span>
                 </div>
                 
                 <button 
                   onClick={() => setShowPurchaseModal(true)}
                   className="w-full bg-white text-black hover:bg-gray-200 py-5 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3 mb-4"
                 >
                   <ShoppingCart className="w-5 h-5" />
                   Secure Protocol
                 </button>
                 
                 <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                   <Shield className="w-4 h-4" />
                   <span>Physician Approved • HIPAA Secure</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
        <button onClick={() => setView('LANDING')} className="mt-8 text-gray-500 hover:text-white text-sm flex items-center gap-2">
           <ChevronRight className="w-4 h-4 rotate-180" /> Return to Life Dashboard
        </button>
    </div>
  );

  if (view === 'ASSESSMENT') return <div className="py-12">{renderAssessment()}</div>;
  if (view === 'RESULTS') return <div className="py-12">{renderResults()}</div>;

  return (
    <div className="animate-in fade-in duration-500 relative">
      
      <div className="text-center mb-16">
        <h1 className="text-6xl font-serif font-bold text-white mb-6">DeepGetty <span className="text-red-600">Life</span></h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Optimization at the cellular level. Discover the peptide protocols engineered for your biology.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Assessment CTA - Styled as High End Card */}
        <div 
          onClick={startAssessment}
          className="group relative bg-zinc-900 border border-zinc-800 hover:border-red-600 transition-all duration-500 rounded-3xl p-10 overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between min-h-[300px]">
             <div>
               <div className="w-16 h-16 bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 mb-8 border border-red-900/30">
                 <Activity className="w-8 h-8" />
               </div>
               <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-red-500 transition-colors">Protocol Assessment</h3>
               <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                 Advanced biometric survey to match your physiology with the correct peptide stack.
               </p>
             </div>
             <div className="flex items-center gap-3 text-white font-bold mt-12 group-hover:translate-x-2 transition-transform">
               Initiate Scan <ArrowRight className="w-5 h-5" />
             </div>
          </div>
        </div>

        {/* Bloodwork Panel - Styled as High End Card */}
        <div className="group relative bg-zinc-900 border border-zinc-800 hover:border-blue-600 transition-all duration-500 rounded-3xl p-10 overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Droplets className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between min-h-[300px]">
             <div>
               <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 mb-8 border border-blue-900/30">
                 <Droplets className="w-8 h-8" />
               </div>
               <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-blue-500 transition-colors">Blood Analysis</h3>
               <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                 Upload existing panels for AI interpretation. We track 80+ biomarkers including testosterone and cortisol.
               </p>
             </div>
             <div className="flex items-center gap-3 text-white font-bold mt-12 group-hover:translate-x-2 transition-transform">
               Upload Data <ArrowRight className="w-5 h-5" />
             </div>
          </div>
        </div>

      </div>

      {/* Purchase Modal Overlay */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full p-8 relative shadow-2xl shadow-red-900/20">
            <button 
              onClick={() => setShowPurchaseModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6 rotate-90" />
            </button>
            
            <h2 className="text-3xl font-serif font-bold text-white mb-2">Secure Checkout</h2>
            <p className="text-gray-500 mb-8">Deep Getty Life • Pharmacy Fulfillment</p>

            <div className="mb-8 p-6 bg-zinc-900 rounded-2xl border border-zinc-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-white text-lg">Recovery Stack</p>
                <p className="text-sm text-gray-500">12-Week Supply</p>
              </div>
              <p className="font-bold text-white text-2xl">$997.00</p>
            </div>

            <form className="space-y-6">
               <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl flex gap-3 items-start">
                 <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-300 leading-relaxed">
                   By proceeding, you authorize Deep Getty Corp to transmit your health assessment to a licensed physician for prescription approval.
                 </p>
               </div>
               <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                 Confirm & Pay
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Life;
