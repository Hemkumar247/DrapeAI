import { useNavigate } from "react-router-dom";
import { Plus, Grid, Bookmark, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useGlobalState } from "../store/GlobalContext";

export function HomeScreen() {
  const navigate = useNavigate();
  const { setGarments, setUserPhoto, setGeneratedImage, setCaption } = useGlobalState();

  const handleNewTryOn = () => {
    setGarments([]);
    setUserPhoto(null);
    setGeneratedImage(null);
    setCaption(null);
    navigate("/add-garment");
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
      
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-6 space-y-8">
        
        {/* Top Section with 3D Hero Asset */}
        <div className="relative pt-10 pb-4 flex flex-col items-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-0 w-full h-[280px] flex justify-center pointer-events-none"
          >
            <motion.img 
              src="/hero-asset.png" 
              alt="3D Fashion Tech"
              className="h-full object-contain mix-blend-lighten opacity-80"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.div>

          <div className="mt-[220px] text-center space-y-2 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center mb-2"
            >
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center space-x-2 backdrop-blur-md">
                <Sparkles size={12} className="text-purple-400" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">Future of Fashion</span>
              </div>
            </motion.div>
            <h2 className="text-5xl font-light tracking-tighter text-white leading-[0.9]">
              DRAPE<span className="font-serif italic text-purple-400">AI</span>
            </h2>
            <p className="text-white/40 text-[11px] uppercase tracking-[0.3em] font-semibold pt-2">Virtual Intelligence Studio</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end space-y-4 pb-4">
          
          {/* Main Action Card */}
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewTryOn}
            className="relative h-[180px] bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col justify-between group overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Plus size={80} strokeWidth={1} />
            </div>
            
            <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              <Plus size={28} />
            </div>
            
            <div className="text-left">
              <h3 className="text-2xl font-light text-white">New Try-On</h3>
              <p className="text-white/40 text-sm">Create your digital look</p>
            </div>
          </motion.button>

          <div className="grid grid-cols-2 gap-4 h-[140px]">
            <motion.button 
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/wardrobe")}
              className="bg-white/5 border border-white/10 rounded-[32px] p-5 flex flex-col justify-between backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Bookmark size={20} />
              </div>
              <h3 className="text-lg font-light text-white text-left">Saved Looks</h3>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/gallery")}
              className="bg-white/5 border border-white/10 rounded-[32px] p-5 flex flex-col justify-between backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Grid size={20} />
              </div>
              <h3 className="text-lg font-light text-white text-left">My Wardrobe</h3>
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  );
}
