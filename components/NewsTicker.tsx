import React, { useEffect, useState } from 'react';
import { generateNewsTicker } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const [headlines, setHeadlines] = useState<string[]>([
    "BREAKING: OHIO CONFIRMED REAL",
    "SCIENTISTS DISCOVER NEW RIZZ VARIANT",
    "FANUM TAX RATES INCREASED TO 50%",
    "SKIBIDI DOP DOP YES YES"
  ]);

  useEffect(() => {
    // Refresh headlines every 60 seconds
    const fetchNews = async () => {
      const news = await generateNewsTicker();
      if (news.length > 0) {
        setHeadlines(prev => [...prev, ...news].slice(-20)); // Keep last 20
      }
    };
    
    const interval = setInterval(fetchNews, 60000);
    fetchNews(); // Initial fetch
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-yellow-400 text-black border-y-4 border-red-600 overflow-hidden whitespace-nowrap py-1 relative z-50">
      <div className="inline-block animate-[scroll_20s_linear_infinite] font-black text-xl uppercase tracking-widest">
        {headlines.map((h, i) => (
          <span key={i} className="mx-8">🚨 {h} 🚨</span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;