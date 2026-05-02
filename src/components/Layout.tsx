import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex justify-center w-full">
      <div className="w-full max-w-md bg-[#000] min-h-screen shadow-2xl relative overflow-hidden flex flex-col border-x border-[#1a1a1a]">
        
        {/* Header */}
        <header className="h-16 flex items-center px-4 justify-between z-10 sticky top-0 bg-[#000]/80 backdrop-blur-md border-b border-[#1a1a1a]">
          {!isHome ? (
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#333] transition"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <div className="w-10"></div> /* Spacer */
          )}
          
          <h1 className="text-xl tracking-[0.15em] font-light uppercase">DRAPE</h1>
          
          <div className="w-10"></div> {/* Spacer */}
        </header>

        {/* Content Area with Animation */}
        <main className="flex-1 flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
