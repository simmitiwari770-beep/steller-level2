import React from 'react';
import { useCampaign } from '@/hooks/useCampaign';
import { formatStroopsToXLM } from '@/lib/contract';
import { motion, AnimatePresence } from 'framer-motion';

interface CampaignStatsProps {
  contractId: string;
}

export const CampaignStats: React.FC<CampaignStatsProps> = ({ contractId }) => {
  const { campaign, isLoading, error, refetch } = useCampaign(contractId);

  if (isLoading) {
    return (
      <div className="bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/40 dark:border-slate-800/40 animate-pulse min-h-[400px]">
        <div className="h-64 bg-slate-200/50 dark:bg-slate-800/50 rounded-[2rem] mb-8" />
        <div className="space-y-4">
          <div className="h-10 bg-slate-200/50 dark:bg-slate-800/50 w-3/4 rounded-lg" />
          <div className="h-6 bg-slate-200/50 dark:bg-slate-800/50 w-1/2 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500/5 dark:bg-red-500/10 rounded-3xl p-10 border border-red-500/20 text-center"
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Campaign Not Found</h3>
        <p className="text-slate-500 dark:text-slate-400">Failed to load campaign data. Deployment might be pending or the Contract ID is invalid.</p>
        {contractId && <p className="text-xs mt-4 font-mono opacity-50 bg-slate-100 dark:bg-slate-900 p-2 rounded">ID: {contractId}</p>}
      </motion.div>
    );
  }

  const raised = campaign.total_raised || 0n;
  const goal = campaign.goal_amount || 1n;
  const progressPercent = Math.min(Number((raised * 100n) / goal), 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white/50 dark:bg-slate-900/50 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl border border-white/60 dark:border-slate-800/40 overflow-hidden group"
    >
      <div className="relative h-72 w-full overflow-hidden">
        <img 
          src="/grant_banner.png" 
          alt="Campaign Grant" 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.1em] font-bold border border-white/20">
            Verified Grant
          </span>
          <span className="bg-blue-600/80 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.1em] font-bold border border-blue-400/30">
            Active
          </span>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-extrabold text-white drop-shadow-2xl mb-2"
          >
            {campaign.title}
          </motion.h2>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
             <span>Currently accepting donations via Soroban Testnet</span>
          </div>
        </div>
      </div>
      
      <div className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Total Amount Raised</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white transition-colors duration-300">
                {formatStroopsToXLM(raised)}
              </span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">XLM</span>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 text-right">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Campaign Funding Goal</p>
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white transition-colors duration-300">
                {formatStroopsToXLM(goal)}
              </span>
              <span className="text-xl font-bold text-slate-400">XLM</span>
            </div>
          </div>
        </div>

        {/* Simplified Remaining Section */}
        <div className="mb-6 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
          <div>
             <p className="text-xs uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Goal Status</p>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Funding</h3>
          </div>
          <div className="text-right">
             <span className="text-slate-400 text-sm font-bold uppercase tracking-widest block mb-1">Remaining to Goal</span>
             <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
               {formatStroopsToXLM(goal - raised > 0n ? goal - raised : 0n)} XLM
             </span>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 grid grid-cols-2 gap-4">
           <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">Campaign Owner</p>
              <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                 </div>
                 <p className="text-xs text-blue-600 dark:text-blue-400 truncate font-mono font-medium">{campaign.owner}</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">Asset Policy</p>
              <div className="flex items-center justify-end gap-2">
                 <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Native XLM (Public Testnet)</p>
                 <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
