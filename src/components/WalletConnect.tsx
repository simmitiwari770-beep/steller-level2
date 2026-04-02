import React from 'react';
import { useStellar } from '@/hooks/useStellar';
import { motion, AnimatePresence } from 'framer-motion';

export const WalletConnect: React.FC = () => {
  const { address, balance, isConnecting, error, connect, disconnect } = useStellar();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <AnimatePresence mode="wait">
        {error && (
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/5 px-4 py-2 rounded-lg border border-red-500/10"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      
      {address ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1">Stellar Wallet</span>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full" />
               <span className="text-sm font-bold font-mono tracking-tight">{formatAddress(address)}</span>
            </div>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />
          
          <div className="flex flex-col text-right">
             <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1">Balance</span>
             <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono tracking-tight">{parseFloat(balance).toLocaleString()} XLM</span>
          </div>

          <button
            onClick={disconnect}
            className="ml-2 w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-slate-400"
            title="Disconnect Wallet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </button>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={connect}
          disabled={isConnecting}
          className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-3 min-w-[200px]"
        >
           {isConnecting ? (
             <>
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <span>Connecting...</span>
             </>
           ) : (
             <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Connect Wallet</span>
             </>
           )}
        </motion.button>
      )}
    </div>
  );
};
