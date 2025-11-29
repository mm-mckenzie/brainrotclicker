import React from 'react';

const StimulationFeed: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col gap-2 w-72 h-full p-2 border-r-4 border-yellow-400 bg-black overflow-hidden sticky top-0 z-20">
        <div className="bg-red-600 text-white font-black text-center animate-pulse text-sm py-1 uppercase tracking-widest">
            ⚠️ DOPAMINE INJECTOR ⚠️
        </div>
        
        {/* Subway Surfers / Temple Run style gameplay */}
        <div className="w-full flex-1 relative rounded-xl overflow-hidden border-4 border-blue-500 shadow-[0_0_20px_rgba(0,0,255,0.5)]">
            <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjZ5eXF6aW82aW82aW82aW82aW82aW82aW82aW82aW82aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nqi89GMgyT3va/giphy.gif" 
                alt="Subway Surfers" 
                className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/70 px-2 rounded text-white font-mono text-xs animate-bounce">
                SATISFYING.EXE
            </div>
        </div>

        {/* Sensory/ASMR */}
        <div className="w-full flex-1 relative rounded-xl overflow-hidden border-4 border-pink-500 shadow-[0_0_20px_rgba(255,0,255,0.5)]">
             <img 
                src="https://media.giphy.com/media/3o7TKSjRrfIPjeiVYQ/giphy.gif" 
                alt="Hydraulic Press" 
                className="w-full h-full object-cover"
            />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-6xl animate-spin opacity-50">😵‍💫</span>
             </div>
        </div>

        {/* Chaos/Funny */}
        <div className="w-full flex-1 relative rounded-xl overflow-hidden border-4 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.5)]">
             <img 
                src="https://media.giphy.com/media/l0HlPybz4dM8uXlQI/giphy.gif" 
                alt="GTA Stunts" 
                className="w-full h-full object-cover"
             />
             <div className="absolute bottom-2 right-2 bg-red-600 text-white font-black px-2 rotate-12 animate-pulse">
                 FUNNY MOMENTS
             </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 font-mono">
            DONT LOOK AWAY. DONT BLINK.
        </div>
    </div>
  );
};

export default StimulationFeed;