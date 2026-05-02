import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useGlobalState } from "../store/GlobalContext";
import { generateMockTryOn, generateStyleCaption } from "../services/ai";

const PHASES = [
  "Uploading your images...",
  "Reading your outfit...",
  "Draping your look...",
  "Adding final touches..."
];

export function GeneratingScreen() {
  const navigate = useNavigate();
  const { garments, userPhoto, setGeneratedImage, setCaption } = useGlobalState();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (garments.length === 0 || !userPhoto) {
      navigate("/");
      return;
    }

    let isMounted = true;

    const runGenerationPipeline = async () => {
      try {
        setPhaseIndex(0);
        setProgress(15);
        await new Promise(r => setTimeout(r, 1000));
        setProgress(25);

        setPhaseIndex(1);
        setProgress(35);
        await new Promise(r => setTimeout(r, 1500));
        setProgress(50);

        setPhaseIndex(2);
        setProgress(60);
        
        const tryOnResult = await generateMockTryOn(userPhoto, garments.map(g => g.image));
        
        if (!isMounted) return;
        setGeneratedImage(tryOnResult);
        setProgress(85);

        setPhaseIndex(3);
        setProgress(95);
        
        try {
          const garmentImages = garments.map(g => g.image);
          const captionRes = await generateStyleCaption(tryOnResult, garmentImages);
          if (isMounted) setCaption(captionRes);
        } catch (e) {
          console.error("Captioning failed, skipping", e);
        }

        setProgress(100);
        
        setTimeout(() => {
          if (isMounted) {
            navigate("/result", { replace: true });
          }
        }, 800);

      } catch (err: any) {
        console.error("Generation pipeline failed:", err);
        alert("Failed to generate try-on. " + err.message);
        if (isMounted) navigate("/");
      }
    };

    runGenerationPipeline();

    return () => {
      isMounted = false;
    };
  }, [garments, userPhoto, navigate, setGeneratedImage, setCaption]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[#050505] p-8">
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Advanced AI Loader */}
        <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
          {/* External Halo */}
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
            className="absolute inset-0 border border-white/[0.03] rounded-full"
          />
          
          {/* Active Orbit */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            className="absolute inset-10 border border-white/10 rounded-full border-t-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          />

          {/* Inner Glow */}
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            className="w-12 h-12 bg-white rounded-full blur-[20px]"
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">Draping</span>
          </div>
        </div>

        <div className="w-full max-w-[280px] text-center space-y-8">
          <div className="space-y-3">
            <motion.p 
              key={phaseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white text-2xl font-light tracking-tight"
            >
              {PHASES[phaseIndex]}
            </motion.p>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold">Neural Engine v2.5</p>
          </div>
          
          {/* Progress Indicator */}
          <div className="space-y-4">
            <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "circOut", duration: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-white rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-white/20 uppercase tracking-widest">
              <span>Status: Processing</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
