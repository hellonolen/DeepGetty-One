
import React, { useState } from 'react';
import { ArrowRight, Lock, Upload, CreditCard, FileText, Check, Eye, EyeOff, User, MapPin, Calendar, ShieldAlert } from 'lucide-react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AuthProps {
  onLogin: (email: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState(1); // For signup wizard
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State - Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Form State - Profile (New)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('USA');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');

  // Form State - Verification & Payment
  const [idFile, setIdFile] = useState<File | null>(null);
  const [ccName, setCcName] = useState('');
  const [ccNum, setCcNum] = useState('');

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
        // onLogin will be triggered by the onAuthStateChanged listener in App.tsx
      } else {
        // Fallback for demo without Firebase keys
        onLogin(email);
      }
    } catch (err: any) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  const handleOwnerBypass = () => {
    onLogin('owner@deepgetty.com');
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleCompleteSignup();
    }
  };

  const handleCompleteSignup = async () => {
    setError(null);
    setLoading(true);

    try {
      if (auth && db) {
        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save Profile to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email,
          phone,
          city,
          state,
          country,
          dob,
          joinDate: new Date().toISOString(),
          idVerified: false, // Default to false until admin reviews ID
          subscriptionStatus: 'active' // Start with 24h trial active
        });

        // onLogin triggered by App.tsx listener
      } else {
        // Demo Fallback
        onLogin(email);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            {mode === 'LOGIN' ? 'Access Terminal' : 'Initiate Profile'}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === 'LOGIN' ? 'Enter your credentials.' : `Step ${step} of 4: ${
              step === 1 ? 'Credentials' : 
              step === 2 ? 'Personal' : 
              step === 3 ? 'Verification' : 'Membership'
            }`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-800 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleSubmitLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-zinc-700 bg-black text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="text-xs text-gray-400 cursor-pointer select-none">Remember credentials</label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Enter Studio'} <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="text-center mt-4">
              <button type="button" onClick={() => setMode('SIGNUP')} className="text-gray-500 hover:text-white text-sm">
                New? Create Account
              </button>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-800">
               <button 
                 type="button"
                 onClick={handleOwnerBypass}
                 className="w-full flex items-center justify-center gap-2 text-xs text-zinc-600 hover:text-red-500 transition-colors uppercase font-bold tracking-widest"
               >
                 <ShieldAlert className="w-3 h-3" /> Owner Override Sequence
               </button>
            </div>
          </form>
        )}

        {/* SIGNUP MODE - WIZARD */}
        {mode === 'SIGNUP' && (
          <form onSubmit={handleNextStep} className="space-y-4">
            
            {/* Step 1: Credentials */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Mobile Phone</label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Password</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Personal Profile (NEW) */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input 
                      type="date" 
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-black border border-zinc-700 text-white p-4 pl-12 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">City</label>
                    <input 
                      type="text" 
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">State / Prov</label>
                    <input 
                      type="text" 
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Country</label>
                  <input 
                    type="text" 
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="bg-blue-900/20 border border-blue-900 p-4 rounded-lg flex gap-3">
                  <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                  <div className="text-xs text-blue-200">
                    Government-issued ID required for age verification and access to Deep Getty Life protocols.
                  </div>
                </div>

                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center hover:border-gray-500 transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    {idFile ? (
                       <>
                         <Check className="w-8 h-8 text-green-500 mb-2" />
                         <span className="text-white font-medium">{idFile.name}</span>
                       </>
                    ) : (
                       <>
                         <Upload className="w-8 h-8 text-gray-500 mb-2" />
                         <span className="text-gray-400 text-sm font-bold">Upload Driver's License or Passport</span>
                       </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <input type="checkbox" required id="hipaa" className="mt-1" />
                  <label htmlFor="hipaa" className="text-xs text-gray-500">
                    I consent to Deep Getty Corp storing my medical data in a HIPAA-compliant environment.
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                 <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl mb-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-white">Total Access Membership</span>
                     <span className="font-bold text-white">$97/mo</span>
                   </div>
                   <div className="text-xs text-gray-500">Includes 24-hour free trial. Billed monthly thereafter.</div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Cardholder Name</label>
                   <input 
                     type="text" 
                     required
                     value={ccName}
                     onChange={(e) => setCcName(e.target.value)}
                     className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Card Number</label>
                   <div className="relative">
                     <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                     <input 
                       type="text" 
                       required
                       placeholder="0000 0000 0000 0000"
                       value={ccNum}
                       onChange={(e) => setCcNum(e.target.value)}
                       className="w-full bg-black border border-zinc-700 text-white p-4 pl-12 rounded-xl"
                     />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="MM/YY" className="bg-black border border-zinc-700 text-white p-4 rounded-xl" />
                   <input type="text" placeholder="CVC" className="bg-black border border-zinc-700 text-white p-4 rounded-xl" />
                 </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 flex gap-3">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-4 bg-zinc-800 rounded-xl text-white font-bold hover:bg-zinc-700"
                >
                  Back
                </button>
              )}
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : step === 4 ? 'Complete Registration' : 'Next Step'} 
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-center mt-4">
              <button type="button" onClick={() => setMode('LOGIN')} className="text-gray-500 hover:text-white text-sm">
                Already have an account? Login
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-center gap-2 text-xs text-gray-600">
          <Lock className="w-3 h-3" />
          <span>256-bit SSL Encrypted Connection</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
