import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ChevronRight, AlertTriangle, Loader2, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useGlobalState } from "../store/GlobalContext";
import { validateUserPhoto, UserPhotoValidationResult } from "../services/ai";

export function AddUserPhotoScreen() {
  const navigate = useNavigate();
  const { userPhoto, setUserPhoto, userPhotoValidation, setUserPhotoValidation } = useGlobalState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setUserPhoto(null);
    setUserPhotoValidation(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const validation = await validateUserPhoto(base64, file.type);
          setUserPhotoValidation(validation);
          
          if (validation.usable_for_tryon) {
            setUserPhoto(base64);
          } else {
            setUserPhoto(base64); 
          }
        } catch (err: any) {
          setErrorMsg(err.message || "Failed to validate photo.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setLoading(false);
    }
  };

  const proceed = () => {
    if (userPhotoValidation?.usable_for_tryon) {
      navigate("/generating");
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-6 h-full">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mr-4 backdrop-blur-md"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-light tracking-tight text-white">Your Photo</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1">AI Body Scanner</p>
          </div>
        </div>

        {!userPhoto && !loading && (
          <div className="flex-1 flex flex-col space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-md">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-white/70">Optimization Protocol</h3>
              <ul className="space-y-4">
                {[
                  { text: "Full body visible (head to feet)", active: true },
                  { text: "Standing in a neutral pose", active: true },
                  { text: "Good, even studio lighting", active: true },
                  { text: "No extremely loose clothing", active: false }
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-white/20'}`} />
                    <span className="text-white/70">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border border-dashed border-white/10 rounded-[32px] bg-white/[0.02] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-white/[0.05] transition backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-3xl bg-white text-black flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <Camera size={24} />
              </div>
              <h3 className="text-xl font-light text-white mb-2">Capture Photo</h3>
              <p className="text-white/40 text-sm max-w-[180px]">Take a photo or upload from library</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="animate-spin text-white relative z-10" size={48} strokeWidth={1} />
            </div>
            <p className="text-xs text-white/40 tracking-[0.3em] uppercase font-bold">Scanning Human Silhouette...</p>
          </div>
        )}

        {userPhoto && userPhotoValidation && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-6"
          >
            <div className="w-full flex-1 min-h-0 bg-white/5 rounded-[32px] overflow-hidden relative border border-white/10 backdrop-blur-md">
              <img 
                src={userPhoto} 
                alt="User" 
                className={`w-full h-full object-cover ${!userPhotoValidation.usable_for_tryon ? 'opacity-40 grayscale blur-sm' : ''}`} 
              />
              
              {!userPhotoValidation.usable_for_tryon && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40">
                  <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4 backdrop-blur-xl border border-red-500/20">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-xl font-light mb-2 text-white">Scan Failed</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">
                    {userPhotoValidation.user_tip || "Silhoutte detection incomplete."}
                  </p>
                  <div className="px-4 py-2 bg-black/60 rounded-full border border-white/5 text-[10px] uppercase tracking-widest text-white/40">
                    Error: {userPhotoValidation.rejection_reason?.replace(/_/g, ' ')}
                  </div>
                </div>
              )}
              
              {userPhotoValidation.usable_for_tryon && (
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-green-500/30 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Scan Complete: {Math.round(userPhotoValidation.estimated_photo_quality * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
            
            {userPhotoValidation.usable_for_tryon ? (
              <button 
                onClick={proceed}
                className="w-full py-5 rounded-full bg-white text-black flex items-center justify-center space-x-2 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
              >
                <span>Initialize Try-On</span>
                <Sparkles size={18} className="fill-black" />
              </button>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-5 rounded-full border border-white/10 bg-white/5 text-white uppercase tracking-widest text-sm font-bold hover:bg-white/10 transition backdrop-blur-md"
              >
                Rescan Silhouette
              </button>
            )}
          </motion.div>
        )}

        {errorMsg && !loading && (
          <div className="mt-4 p-5 rounded-[24px] bg-red-500/5 border border-red-500/20 backdrop-blur-md">
            <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-6 w-full py-4 rounded-full border border-red-500/20 text-center uppercase tracking-widest text-[10px] font-bold text-red-400 hover:bg-red-500/10"
            >
              Retry Protocol
            </button>
          </div>
        )}

        <input 
          type="file" 
          accept="image/*" 
          capture="user"
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
