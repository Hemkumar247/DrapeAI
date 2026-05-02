import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ChevronRight, AlertCircle, Loader2, ArrowLeft, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useGlobalState } from "../store/GlobalContext";
import { analyzeGarment } from "../services/ai";
import { saveGarment } from "../services/storage";

export function AddGarmentScreen() {
  const navigate = useNavigate();
  const { garments, setGarments } = useGlobalState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [errorObj, setErrorObj] = useState<{ reason: string, message: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    setLoading(true);
    setErrorObj(null);

    const newGarments: any[] = [];
    let hasError = false;

    try {
      await Promise.all(
        files.map(async (file) => {
          const reader = new FileReader();
          return new Promise<void>((resolve) => {
            reader.onloadend = async () => {
              const base64 = reader.result as string;
              try {
                const analysis = await analyzeGarment(base64, file.type);
                if (!analysis.is_valid_apparel) {
                  setErrorObj({
                    reason: analysis.rejection_reason || "unknown",
                    message: getErrorMessage(analysis.rejection_reason)
                  });
                  hasError = true;
                } else {
                  const garment = {
                    id: Math.random().toString(36).substring(7),
                    image: base64,
                    analysis
                  };
                  newGarments.push(garment);
                  
                  try {
                    await saveGarment({
                      ...garment,
                      createdAt: Date.now()
                    });
                  } catch (e) {
                    console.error("Failed to save garment to gallery", e);
                  }
                }
              } catch (err: any) {
                setErrorObj({
                  reason: "api_error",
                  message: err.message || "Failed to analyze image."
                });
                hasError = true;
              } finally {
                resolve();
              }
            };
            reader.readAsDataURL(file);
          });
        })
      );

      if (!hasError && newGarments.length > 0) {
        setGarments((prev: any) => [...prev, ...newGarments]);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getErrorMessage = (reason: string | null) => {
    switch (reason) {
      case "no_garment_detected": return "We couldn't detect any clothing in this image.";
      case "multiple_garments_no_focus": return "There are too many items here. Please upload an image focusing on one garment.";
      case "garment_already_on_person": return "This looks like it's already being worn. Please upload a standalone product image.";
      case "image_too_blurry": return "The image is too blurry to analyze accurately.";
      case "image_too_small": return "The image is too small. Please use a higher resolution image.";
      case "nsfw_content": return "The image was flagged for inappropriate content.";
      default: return "The image couldn't be used. Please try another one.";
    }
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-6 h-full">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mr-4 backdrop-blur-md"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-light tracking-tight text-white">Select Garment</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Upload Product Photo</p>
          </div>
        </div>

        {garments.length === 0 && !loading && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border border-dashed border-white/10 rounded-[32px] bg-white/[0.02] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-white/[0.05] transition backdrop-blur-sm"
          >
            <div className="w-16 h-16 rounded-3xl bg-white text-black flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Upload size={24} />
            </div>
            <h3 className="text-xl font-light text-white mb-2">Tap to Upload</h3>
            <p className="text-white/40 text-sm max-w-[180px]">Upload garments from your camera roll or Pinterest</p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="animate-spin text-white relative z-10" size={48} strokeWidth={1} />
            </div>
            <p className="text-xs text-white/40 tracking-[0.3em] uppercase font-bold">AI Analyzing Texture...</p>
          </div>
        )}

        {errorObj && !loading && (
          <div className="mb-6 p-4 rounded-[24px] bg-red-500/5 border border-red-500/20 flex items-start space-x-3 backdrop-blur-md">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-red-400 font-medium text-sm">Analysis Note</h4>
              <p className="text-red-200/50 text-sm mt-1 leading-relaxed">{errorObj.message}</p>
            </div>
          </div>
        )}
        
        {garments.length > 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-4 min-h-0"
          >
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {garments.map((g) => (
                <div key={g.id} className="w-full bg-white/5 border border-white/10 rounded-[32px] overflow-hidden relative backdrop-blur-md">
                  <div className="aspect-square w-full">
                    <img src={g.image} alt="Garment" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-light capitalize text-white">{g.analysis.sub_type}</h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                          {g.analysis.fit} fit • {g.analysis.fabric_guess}
                        </p>
                      </div>
                      <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                        {g.analysis.garment_type}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {g.analysis.primary_colors.map((color, i) => (
                        <div key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] uppercase tracking-widest text-white/60">
                          {color}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 border border-dashed border-white/10 rounded-[32px] bg-white/[0.02] text-white/40 hover:text-white hover:bg-white/5 transition flex justify-center items-center gap-2 text-sm font-medium"
              >
                <Plus size={18} /> Add Another Item
              </button>
            </div>
            
            <button 
              onClick={() => navigate("/add-user-photo")}
              className="w-full py-5 rounded-full bg-white text-black flex items-center justify-center space-x-2 font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
            >
              <span>Continue</span>
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        <input 
          type="file" 
          multiple
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
