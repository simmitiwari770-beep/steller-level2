import React, { useEffect, useState } from 'react';
import { getTransactionHistory, HistoryItem } from '@/lib/contract';
import { motion, AnimatePresence } from 'framer-motion';

export const TransactionHistory: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchHistory = async () => {
    setIsSyncing(true);
    try {
      const data = await getTransactionHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFirstLoad(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 15000); // Sync every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/40 dark:bg-slate-950/40 rounded-[2rem] p-8 border border-white/40 dark:border-slate-800/20 backdrop-blur-xl h-fit min-h-[300px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
           <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
        </div>
        <button 
           onClick={fetchHistory}
           disabled={isSyncing}
           className="text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-widest flex items-center gap-1 disabled:opacity-50"
        >
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
           </svg>
           {isSyncing ? 'Syncing...' : 'Live Sync'}
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {isFirstLoad ? (
          <div className="space-y-3">
             {[1,2,3,4].map(i => (
               <div key={i} className="h-20 bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-3xl" />
             ))}
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-4 bg-slate-50/10 dark:bg-slate-900/10 rounded-[1.5rem] border border-dashed border-slate-200 dark:border-slate-800">
             <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
             </div>
             <p className="text-slate-400 font-medium italic">Waiting for transactions...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence initial={false}>
              {history.map((tx) => (
                <motion.div 
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex items-center justify-between p-5 bg-white/60 dark:bg-slate-900/40 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/40 hover:border-blue-500/30 transition-all hover:translate-x-1 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-500 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-bold tracking-tight">{tx.from}</p>
                           <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                           <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{tx.amount} XLM</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Confirmed {new Date(tx.createdAt).toLocaleTimeString()}</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                     <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono font-bold text-slate-400 hover:text-blue-500 transition-colors bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md"
                     >
                        # {tx.id.slice(0, 6)}
                     </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      <div className="mt-10 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-center">
         <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] opacity-30 select-none">Stellar Ledger Hash Feed</p>
      </div>
    </motion.div>
  );
};
