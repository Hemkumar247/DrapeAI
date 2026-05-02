import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { getAllLooks, deleteLook, SavedLook } from "../services/storage";

export function WardrobeScreen() {
  const navigate = useNavigate();
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLooks()
      .then((looks) => setSavedLooks(looks))
      .catch((e) => console.error("Failed to load wardrobe:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteLook(id);
      setSavedLooks((prev) => prev.filter((look) => look.id !== id));
    } catch (e) {
      console.error("Failed to delete look:", e);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050505] overflow-y-auto">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px]" />
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
            <h2 className="text-2xl font-light tracking-tight text-white">Saved Looks</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Outfit Archive</p>
          </div>
        </div>

        <div className="space-y-8">
          {loading ? (
            <div className="text-center text-white/40 mt-10">
              <p className="animate-pulse">Accessing archives...</p>
            </div>
          ) : savedLooks.length === 0 ? (
            <div className="text-center text-white/40 mt-10 space-y-4">
              <p className="text-lg font-light text-white">No saved looks yet.</p>
              <p className="text-sm max-w-[200px] mx-auto leading-relaxed">Try on an outfit and save your favorite results here.</p>
              <button 
                onClick={() => navigate("/add-garment")}
                className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              >
                Start New Session
              </button>
            </div>
          ) : (
            savedLooks.map((look) => (
              <motion.div 
                key={look.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-md"
              >
                <div className="relative aspect-[3/4] w-full group">
                  <img src={look.generatedImage} alt="Saved Look" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                  <button 
                    onClick={() => handleDelete(look.id)}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-red-400 border border-red-500/20 shadow-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="p-8">
                  {look.caption && (
                    <p className="text-white text-lg font-light italic mb-6 leading-relaxed">"{look.caption}"</p>
                  )}
                  <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {look.garmentImages.map((img, i) => (
                      <div key={i} className="flex items-center gap-3 shrink-0 p-2 bg-white/5 rounded-full border border-white/10">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                          <img src={img} alt="garment" className="w-full h-full object-cover" />
                        </div>
                        {look.garmentLabels[i] && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 pr-3">{look.garmentLabels[i].subType}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
