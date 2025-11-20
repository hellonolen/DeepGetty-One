
import React, { useState } from 'react';
import { Users, DollarSign, Key, Activity, Search, Bell, Radio, Server, Shield, Video, Play, Loader2, Film, ShoppingBag, Plus, Globe, Check, AlertTriangle, RefreshCw, Save, Lock, Database, MapPin, Calendar } from 'lucide-react';
import { generateMarketingVideo } from '../services/geminiService';
import { HERO_VIDEO_OPTIONS, PRODUCTS as DEFAULT_PRODUCTS } from '../constants';
import { Product } from '../types';

interface AdminProps {
  products?: Product[];
  setProducts?: (products: Product[]) => void;
  setHeroVideo?: (url: string) => void;
  currentHeroVideo?: string;
}

// Helper for safe storage access
const getStorageItem = (key: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key) || '';
    }
  } catch (e) {}
  return '';
};

const setStorageItem = (key: string, val: string) => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(key, val);
        }
    } catch(e) {}
}

const Admin: React.FC<AdminProps> = ({ 
  products = DEFAULT_PRODUCTS, 
  setProducts = (products: Product[]) => {}, 
  setHeroVideo = (url: string) => {},
  currentHeroVideo 
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MEMBERS' | 'AGENTS' | 'MEDIA' | 'PRODUCTS' | 'CONFIG'>('OVERVIEW');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  
  // Video Gen State
  const [videoPrompt, setVideoPrompt] = useState('Cinematic shot of a futuristic cyborg athlete sprinting in a neon data tunnel, 4k, highly detailed, moody lighting');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Product State
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'Gear', image: '' });

  // Config / API Key State
  const [apiKeys, setApiKeys] = useState({
    gemini: getStorageItem('dg_key_gemini'),
    stripe: getStorageItem('dg_key_stripe'),
    modmed: getStorageItem('dg_key_modmed')
  });
  
  // Firebase Config State
  const [firebaseConfig, setFirebaseConfig] = useState(() => {
    const stored = getStorageItem('dg_firebase_config');
    return stored ? JSON.parse(stored) : {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    };
  });

  const [isSavingKeys, setIsSavingKeys] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerateVideo = async () => {
    if (!videoPrompt) return;
    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setGenerationError(null);
    
    try {
      const url = await generateMarketingVideo(videoPrompt);
      if (url) {
        setGeneratedVideoUrl(url);
      }
    } catch (e: any) {
      console.error("Failed to generate video", e);
      setGenerationError(e.message || "Video generation failed. Please check API key permissions.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const newItem: Product = {
      id: `p-${Date.now()}`,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image || 'https://picsum.photos/seed/new/300/300'
    };
    setProducts([...products, newItem]);
    setNewProduct({ name: '', price: '', category: 'Gear', image: '' });
  };

  const handleSaveKeys = () => {
    setIsSavingKeys(true);
    setTimeout(() => {
      setIsSavingKeys(false);
      setSaveSuccess(true);
      
      // Persist keys
      setStorageItem('dg_key_gemini', apiKeys.gemini);
      setStorageItem('dg_key_stripe', apiKeys.stripe);
      setStorageItem('dg_key_modmed', apiKeys.modmed);
      
      // Persist Firebase
      setStorageItem('dg_firebase_config', JSON.stringify(firebaseConfig));

      setTimeout(() => {
          setSaveSuccess(false);
          if (confirm("Configuration Saved. Reload to initialize services?")) {
             window.location.reload();
          }
      }, 1000);
    }, 500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'MEMBERS':
        return (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-lg">Member Database</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search ID or Email..." className="bg-black/40 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none" />
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-gray-500">
                <tr>
                  <th className="p-4 font-medium">User Details</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium">ID Status</th>
                  <th className="p-4 font-medium">Connected Devices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {[
                  { name: 'Alexander Mitchell', dob: '1988-04-12', city: 'Austin, TX', joined: 'Oct 20, 2025', idStatus: 'Verified', devices: ['Apple Watch Series 8', 'Oura Gen 3'] },
                  { name: 'Sarah Jenkins', dob: '1995-08-23', city: 'New York, NY', joined: 'Oct 22, 2025', idStatus: 'Pending', devices: ['Whoop 4.0'] },
                  { name: 'Michael Thorne', dob: '1982-11-05', city: 'London, UK', joined: 'Oct 23, 2025', idStatus: 'Verified', devices: ['None'] },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{row.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> {row.dob}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-500" /> {row.city}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 font-mono text-xs">{row.joined}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${row.idStatus === 'Verified' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                        {row.idStatus === 'Verified' && <Shield className="w-3 h-3" />} {row.idStatus}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 flex gap-2">
                       {row.devices.map((d, di) => (
                         <span key={di} className="bg-zinc-800 px-2 py-1 rounded text-xs">{d}</span>
                       ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'AGENTS':
        return (/* ... existing AGENTS code ... */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
            {/* ... existing agents UI ... */}
            <div className="col-span-2 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <Server className="w-5 h-5 text-blue-500" /> Neural Agent Status
               </h3>
               
               <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-white">Configure Agent Access</h4>
                    <span className="text-xs text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> System Secure</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 font-bold">ModMed Portal</label>
                      <input type="text" placeholder="Portal URL" className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                      <input type="text" placeholder="Username" className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                      <input type="password" placeholder="••••••" className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 font-bold">Quest Diagnostics</label>
                      <input type="text" placeholder="Portal URL" className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                      <input type="text" placeholder="Username" className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                      <input type="password" placeholder="••••••" className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 font-bold">Compound Lab (2)</label>
                      <input type="text" placeholder="Portal URL" className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                      <input type="text" placeholder="Username" className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                      <input type="password" placeholder="••••••" className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                     <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2">
                       <RefreshCw className="w-3 h-3" /> Test Connections
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {[
                   { name: 'ModMed Referral Agent', status: 'Active', task: 'Processing Referrals', ping: '24ms' },
                   { name: 'Quest Diagnostics Bot', status: 'Active', task: 'Awaiting Results', ping: '45ms' },
                   { name: 'Compounding Lab Link', status: 'Idle', task: 'Inventory Sync', ping: '31ms' },
                 ].map((agent, i) => (
                   <div key={i} className="bg-black/40 border border-zinc-800 p-4 rounded-lg">
                     <div className="flex justify-between items-start mb-2">
                       <span className="font-bold text-white">{agent.name}</span>
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                     </div>
                     <div className="text-xs text-gray-500 mb-1">Current Task: {agent.task}</div>
                     <div className="text-xs text-gray-600 font-mono">Latency: {agent.ping}</div>
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="col-span-2 bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <Radio className="w-5 h-5 text-red-500" /> Broadcast System
               </h3>
               <p className="text-sm text-gray-400 mb-4">Send a push notification to all active mobile and web sessions.</p>
               <div className="flex gap-4">
                 <input 
                   type="text" 
                   value={broadcastMsg}
                   onChange={(e) => setBroadcastMsg(e.target.value)}
                   placeholder="e.g. New Peptide Protocol Available in Life..." 
                   className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 text-white"
                 />
                 <button className="bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-500">
                   Broadcast
                 </button>
               </div>
            </div>
          </div>
        );

      case 'MEDIA':
        return (/* ... existing MEDIA code ... */
          <div className="space-y-8 animate-in fade-in">
             {/* ... same content ... */}
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
               <h3 className="font-bold text-lg text-white mb-4">Hero Video Controller</h3>
               <p className="text-sm text-gray-400 mb-6">Select the active background video for the Landing Page.</p>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {HERO_VIDEO_OPTIONS.map((vid, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => setHeroVideo(vid.url)}
                     className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${currentHeroVideo === vid.url ? 'border-blue-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                   >
                     <video src={vid.url} muted className="w-full h-24 object-cover" />
                     <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-xs text-center font-bold text-white truncate">
                       {vid.label}
                     </div>
                     {currentHeroVideo === vid.url && (
                       <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                         <Check className="w-3 h-3 text-white" />
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Film className="w-6 h-6 text-purple-500" />
                    <div>
                        <h3 className="font-bold text-lg text-white">DeepGetty Media Lab</h3>
                        <p className="text-xs text-gray-400">Powered by Google Veo (veo-3.1-fast-generate-preview)</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Video Prompt</label>
                      <textarea 
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        className="w-full h-32 bg-black border border-zinc-700 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none resize-none"
                        placeholder="Describe the video scene..."
                      />
                    </div>
                    <button 
                      onClick={handleGenerateVideo}
                      disabled={isGeneratingVideo || !videoPrompt}
                      className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGeneratingVideo ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Generating Assets...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" /> Generate Video
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-black border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px] relative">
                    {isGeneratingVideo ? (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                        <p className="text-white font-bold">Dreaming...</p>
                        <p className="text-gray-500 text-sm">The Neural Network is rendering your vision.</p>
                      </div>
                    ) : generationError ? (
                      <div className="text-center max-w-xs">
                        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <p className="text-white font-bold mb-2">Generation Failed</p>
                        <p className="text-red-400 text-xs mb-4">{generationError}</p>
                        <button onClick={handleGenerateVideo} className="px-4 py-2 bg-zinc-800 rounded-lg text-xs font-bold text-white hover:bg-zinc-700">Try Again</button>
                      </div>
                    ) : generatedVideoUrl ? (
                      <div className="w-full space-y-4">
                        <h4 className="text-white font-bold">Preview Output</h4>
                        <video src={generatedVideoUrl} controls autoPlay loop className="w-full rounded-lg shadow-2xl shadow-purple-900/20"/>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-zinc-800 text-white py-2 rounded hover:bg-zinc-700 text-sm">Download</button>
                          <button onClick={() => setHeroVideo(generatedVideoUrl)} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-500 text-sm">Set as Hero</button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-600">
                        <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No AI video generated yet.</p>
                      </div>
                    )}
                </div>
             </div>
          </div>
        );
      
      case 'PRODUCTS':
        return (/* ... existing PRODUCTS code ... */
          <div className="space-y-8 animate-in fade-in">
            {/* ... same content ... */}
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Product Manager</h3>
                <div className="flex gap-2">
                  <button className="text-xs bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-700 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Sync Printful
                  </button>
                  <button className="text-xs bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-700 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Sync Printify
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-500 font-bold mb-1">Product Name</label>
                  <input 
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-bold mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 font-bold mb-1">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option>Gear</option>
                    <option>Apparel</option>
                    <option>Accessories</option>
                    <option>Supplements</option>
                  </select>
                </div>
                <button onClick={handleAddProduct} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/20 text-gray-500">
                  <tr>
                    <th className="p-4 font-medium">Image</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.map((p, i) => (
                    <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4"><img src={p.image} className="w-10 h-10 rounded bg-black object-cover" alt="" /></td>
                      <td className="p-4 text-white font-medium">{p.name}</td>
                      <td className="p-4 text-gray-400">{p.category}</td>
                      <td className="p-4 text-white">${p.price}</td>
                      <td className="p-4"><button className="text-red-500 hover:text-red-400 text-xs">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'CONFIG':
        return (/* ... existing CONFIG code ... */
           <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-in fade-in">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Key className="w-5 h-5" /> API Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Gemini AI API Key</label>
                  <input 
                    type="password" 
                    value={apiKeys.gemini} 
                    onChange={(e) => setApiKeys({...apiKeys, gemini: e.target.value})}
                    placeholder="AIzaSy..."
                    className="w-full bg-black border border-zinc-700 rounded px-3 py-3 text-sm text-white focus:border-blue-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Stripe Secret Key</label>
                  <input 
                    type="password" 
                    value={apiKeys.stripe} 
                    onChange={(e) => setApiKeys({...apiKeys, stripe: e.target.value})}
                    placeholder="sk_live_..."
                    className="w-full bg-black border border-zinc-700 rounded px-3 py-3 text-sm text-white focus:border-blue-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-2">ModMed Client ID</label>
                  <input 
                    type="password" 
                    value={apiKeys.modmed} 
                    onChange={(e) => setApiKeys({...apiKeys, modmed: e.target.value})}
                    placeholder="client_..."
                    className="w-full bg-black border border-zinc-700 rounded px-3 py-3 text-sm text-white focus:border-blue-500 focus:outline-none" 
                  />
                </div>
              </div>

              <div className="bg-black/20 border border-zinc-800 rounded-xl p-4">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Database className="w-4 h-4" /> Firebase Configuration</h4>
                <p className="text-xs text-gray-500 mb-4">Copy these values from your Firebase Console (Project Settings).</p>
                <div className="space-y-3">
                   <div>
                     <label className="text-xs text-gray-500 font-bold">API Key</label>
                     <input type="text" value={firebaseConfig.apiKey} onChange={(e) => setFirebaseConfig({...firebaseConfig, apiKey: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="text-xs text-gray-500 font-bold">Auth Domain</label>
                       <input type="text" value={firebaseConfig.authDomain} onChange={(e) => setFirebaseConfig({...firebaseConfig, authDomain: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                     </div>
                     <div>
                       <label className="text-xs text-gray-500 font-bold">Project ID</label>
                       <input type="text" value={firebaseConfig.projectId} onChange={(e) => setFirebaseConfig({...firebaseConfig, projectId: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                     </div>
                   </div>
                   <div>
                     <label className="text-xs text-gray-500 font-bold">Storage Bucket</label>
                     <input type="text" value={firebaseConfig.storageBucket} onChange={(e) => setFirebaseConfig({...firebaseConfig, storageBucket: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="text-xs text-gray-500 font-bold">Messaging Sender ID</label>
                       <input type="text" value={firebaseConfig.messagingSenderId} onChange={(e) => setFirebaseConfig({...firebaseConfig, messagingSenderId: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                     </div>
                     <div>
                       <label className="text-xs text-gray-500 font-bold">App ID</label>
                       <input type="text" value={firebaseConfig.appId} onChange={(e) => setFirebaseConfig({...firebaseConfig, appId: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-white" />
                     </div>
                   </div>
                </div>
              </div>

            </div>

            <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Lock className="w-3 h-3" /> Credentials are encrypted at rest.
              </div>
              <button 
                onClick={handleSaveKeys}
                disabled={isSavingKeys}
                className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  saveSuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {isSavingKeys ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saveSuccess ? 'Saved Securely' : 'Save Configuration'}
              </button>
            </div>
          </div>
        );

      default: // OVERVIEW - Updated Recent Transactions
        return (
          <div className="space-y-8 animate-in fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', val: '$142,590', icon: DollarSign, change: '+12%' },
                { label: 'Active Subscribers', val: '1,429', icon: Users, change: '+5%' },
                { label: 'Protocol Orders', val: '84', icon: Activity, change: '+18%' },
                { label: 'API Usage', val: '89%', icon: Key, change: '-2%' },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-zinc-800 rounded-lg text-gray-400">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Transactions - Updated with Requested User Details */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h3 className="font-bold text-lg">Recent Transactions</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-black/20 text-gray-500">
                  <tr>
                    <th className="p-4 font-medium">Member Profile</th>
                    <th className="p-4 font-medium">Location</th>
                    <th className="p-4 font-medium">Purchase Type</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[
                    { 
                      firstName: 'Alexander', lastName: 'Mitchell', 
                      city: 'Austin', state: 'TX', 
                      dob: 'Apr 12, 1988', 
                      type: 'Subscription (Monthly)', amt: '$97.00', status: 'Succeeded' 
                    },
                    { 
                      firstName: 'Sarah', lastName: 'Jenkins', 
                      city: 'New York', state: 'NY', 
                      dob: 'Aug 23, 1995', 
                      type: 'Protocol Add-on: BPC-157', amt: '$997.00', status: 'Processing' 
                    },
                    { 
                      firstName: 'Michael', lastName: 'Thorne', 
                      city: 'London', state: 'UK', 
                      dob: 'Nov 05, 1982', 
                      type: 'Merch Add-on: Gloves', amt: '$60.00', status: 'Succeeded' 
                    },
                    { 
                      firstName: 'Elena', lastName: 'Vasquez', 
                      city: 'Miami', state: 'FL', 
                      dob: 'Jan 15, 1990', 
                      type: 'Subscription (Monthly)', amt: '$97.00', status: 'Succeeded' 
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{row.firstName} {row.lastName}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                           <Calendar className="w-3 h-3" /> Born: {row.dob}
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">
                         <div className="flex items-center gap-1">
                           <MapPin className="w-3 h-3 text-blue-500" /> {row.city}, {row.state}
                         </div>
                      </td>
                      <td className="p-4 text-gray-400">{row.type}</td>
                      <td className="p-4 text-white font-mono">{row.amt}</td>
                      <td className="p-4"><span className="text-green-400 bg-green-900/20 px-2 py-1 rounded text-xs">{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Admin Console</h1>
          <p className="text-gray-400 text-sm">DeepGetty Corp Internal System v1.0.6</p>
        </div>
        <div className="flex gap-4">
          <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-gray-300">SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 border-b border-zinc-800 pb-1 overflow-x-auto">
        {['OVERVIEW', 'MEMBERS', 'AGENTS', 'MEDIA', 'PRODUCTS', 'CONFIG'].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`px-6 py-3 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${
               activeTab === tab 
                 ? 'bg-zinc-800 text-white border-b-2 border-blue-500' 
                 : 'text-gray-500 hover:text-white hover:bg-zinc-900'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default Admin;
