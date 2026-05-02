import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Download, Share2, Search, ArrowLeft, Sparkles } from "lucide-react";
import { useGlobalState } from "../store/GlobalContext";
import { saveLook } from "../services/storage";

export function ResultScreen() {
  const navigate = useNavigate();
  const { generatedImage, caption, garments, setGarments, setUserPhoto, setGeneratedImage, setCaption } = useGlobalState();
  
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  if (!generatedImage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#050505]">
        <p className="mb-4 text-white/40">Neural result buffer empty.</p>
        <button onClick={() => navigate("/")} className="px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs">Initialize System</button>
      </div>
    );
  }

  const handleTryAnother = () => {
    setGarments([]);
    setUserPhoto(null);
    setGeneratedImage(null);
    setCaption(null);
    navigate("/");
  };

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My DRAPE Try-On',
          text: caption || 'Check out my new look!',
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  const handleZoom = () => {
     setScale(s => s === 1 ? 1.5 : 1);
  };

  const handleSaveLook = async () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);
    try {
      await saveLook({
        id: Date.now().toString(),
        generatedImage: generatedImage!,
        garmentImages: garments.map(g => g.image),
        garmentLabels: garments.map(g => ({
          subType: g.analysis.sub_type,
          brand: g.analysis.detected_brand
        })),
        caption,
        createdAt: Date.now()
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save look:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto relative">
      
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={handleTryAnother}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex space-x-3">
          <button onClick={shareResult} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white">
            <Share2 size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Main Preview */}
      <div className="w-full relative bg-black overflow-hidden" style={{ minHeight: "75vh" }}>
        <motion.img 
          ref={imgRef}
          src={generatedImage} 
          alt="Generated Try-On"
          className="w-full h-full object-cover cursor-zoom-in shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={handleZoom}
          drag={scale > 1}
          dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        />
      </div>

      {/* Details & Actions */}
      <div className="p-8 pb-16 space-y-8 bg-[#050505]">
        
        {/* AI Insights Button & Expandable Section */}
        <div className="space-y-4">
          <button 
            onClick={() => setShowInsights(!showInsights)}
            className="w-full py-4 rounded-3xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center space-x-3 text-purple-400 hover:bg-purple-600/20 transition-all group"
          >
            <Sparkles size={18} className={showInsights ? "fill-purple-400" : ""} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">{showInsights ? "Hide Insights" : "View AI Insights"}</span>
          </button>

          <motion.div 
            initial={false}
            animate={{ height: showInsights ? "auto" : 0, opacity: showInsights ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-1 h-4 bg-purple-500 rounded-full" />
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/50">Neural Styling Report</h4>
              </div>
              <p className="text-white text-lg font-light leading-relaxed italic">
                "{caption || "Precision fit achieved. Your silhouette has been optimized for this aesthetic. Consider pairing with minimalist accessories to maintain the clean lines."}"
              </p>
            </div>
          </motion.div>
        </div>
        
        {garments.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">Analyzed Components</h4>
            <div className="flex flex-col space-y-4">
              {garments.map((g) => (
               <div key={g.id} className="flex items-center space-x-5 p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                     <img src={g.image} alt="Original garment" className="w-full h-full object-cover" />
                  </div>
                  <div>
                     <h4 className="text-sm font-semibold text-white uppercase tracking-wider">{g.analysis.sub_type}</h4>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{g.analysis.detected_brand || "Selected Garment"}</p>
                  </div>
               </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={handleSaveLook}
            disabled={isSaved || isSaving}
            className={`w-full py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm transition-all duration-500 ${
              isSaved 
                ? "bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.3)]" 
                : isSaving
                ? "bg-white/10 text-white/40 cursor-wait"
                : "bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
            }`}
          >
            {isSaved ? "Look Archived" : isSaving ? "Syncing..." : "Save to Wardrobe"}
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.open(`https://www.google.com/search?q=buy+${garments[0]?.analysis.detected_brand || ''}+${garments[0]?.analysis.sub_type || 'clothing'}`)}
              className="py-4 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center space-x-2 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition backdrop-blur-md"
            >
              <Search size={14} />
              <span>Acquire Item</span>
            </button>

            <button 
              onClick={handleTryAnother}
              className="py-4 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center space-x-2 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition backdrop-blur-md"
            >
              <span>Reset Flow</span>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
