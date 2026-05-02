import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { motion } from "motion/react";
import { getAllGarments, deleteGarment, SavedGarment } from "../services/storage";

export function GarmentGalleryScreen() {
  const navigate = useNavigate();
  const [garments, setGarments] = useState<SavedGarment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllGarments()
      .then(setGarments)
      .catch(e => console.error("Failed to load garments", e))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteGarment(id);
      setGarments(prev => prev.filter(g => g.id !== id));
    } catch (e) {
      console.error("Failed to delete garment", e);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#050505] overflow-y-auto">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
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
            <h2 className="text-2xl font-light tracking-tight text-white">My Wardrobe</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Garment Inventory</p>
          </div>
        </div>

        <div className="pb-10">
          {loading ? (
            <div className="text-center text-white/40 mt-10 animate-pulse">Syncing wardrobe...</div>
          ) : garments.length === 0 ? (
            <div className="text-center text-white/40 mt-10 space-y-4">
              <p className="text-lg font-light text-white">Your digital closet is empty.</p>
              <button 
                onClick={() => navigate("/add-garment")}
                className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              >
                Scan First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {garments.map((g) => (
                <motion.div 
                  key={g.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden relative backdrop-blur-md group"
                >
                  <div className="aspect-square w-full">
                    <img src={g.image} alt="Garment" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white truncate">{g.analysis.sub_type}</h4>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1 truncate">{g.analysis.detected_brand || "Custom"}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(g.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-red-400 border border-red-500/20"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
              
              <button 
                onClick={() => navigate("/add-garment")}
                className="aspect-square rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                  <Plus size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Add Item</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
