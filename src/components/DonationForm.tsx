import React, { useState, useEffect } from 'react';
import { useStellar } from '@/hooks/useStellar';
import { useCampaign } from '@/hooks/useCampaign';
import { donateToCampaign } from '@/lib/contract';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const DonationForm: React.FC<{ contractId: string }> = ({ contractId }) => {
  const { address, balance, updateBalance } = useStellar();
  const { campaign, refetch } = useCampaign(contractId);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Use a local state for raised amount to enable "optimistic" and "scrolling" updates
  const [localRaised, setLocalRaised] = useState(0n);
  const goal = campaign?.goal_amount || 1n;

  // Whenever the campaign data changes from the blockchain, update our local progress
  useEffect(() => {
    if (campaign?.total_raised) {
      setLocalRaised(campaign.total_raised);
    }
  }, [campaign?.total_raised]);

  const progressPercent = Math.min(Number((localRaised * 100n) / goal), 100);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return toast.error('Please connect your wallet first');
    if (!amount || parseFloat(amount) <= 0) return toast.error('Please enter a valid amount');
    if (parseFloat(amount) > parseFloat(balance)) return toast.error('Insufficient balance');

    const donationVal = BigInt(Math.floor(parseFloat(amount) * 10_000_000));
    setLoading(true);
    
    try {
      const result = await donateToCampaign(address, amount);
      setTxHash(result.hash);
      
      // OPTIMISTIC UPDATE: Update the progress immediately so the user sees it "increasing"
      setLocalRaised(prev => prev + donationVal);
      
      // Reset form and show success
      setAmount('');
      setShowSuccess(true);
      
      // Tx is already confirmed — refresh balance & campaign state immediately
      await updateBalance();
      await refetch();

      // One more refresh after 2s to catch any ledger propagation lag
      setTimeout(async () => {
        await updateBalance();
        await refetch();
      }, 2000);
      
    } catch (e: any) {
      toast.error(e.message || 'Transaction failed or rejected');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative bg-white/60 dark:bg-slate-900/60 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-xl border border-white/60 dark:border-slate-800/40 h-fit overflow-hidden"
      >
        {/* Decorative gradient corners */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl -ml-12 -mb-12" />

        {/* Decorative gradient corners */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl -ml-12 -mb-12" />

        <div className="flex items-center gap-3 mb-8 relative z-10">
           <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
           </div>
           <div>
              <h2 className="text-2xl font-bold tracking-tight">Make a Donation</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Every XLM helps reach the goal</p>
           </div>
        </div>

        <form onSubmit={handleDonate} className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
               <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Amount (XLM)</label>
               {address && (
                  <span className="text-xs font-medium text-slate-400">
                    Balance: <span className="text-blue-600 dark:text-blue-400 font-bold">{parseFloat(balance).toLocaleString()} XLM</span>
                  </span>
               )}
            </div>
            
            <div className="relative group">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading || !address}
                className="w-full px-7 py-6 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-['JetBrains_Mono'] text-3xl font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 disabled:opacity-50"
                placeholder="0.00"
                step="0.01"
                required
              />
              <div className="absolute right-7 top-1/2 -translate-y-1/2 flex flex-col items-end">
                 <span className="font-black text-slate-300 dark:text-slate-600 text-xl group-focus-within:text-blue-500 tracking-tighter transition-colors">XLM</span>
                 <AnimatePresence>
                    {amount && (
                      <motion.span 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="text-[10px] font-bold text-blue-500/60 uppercase"
                      >
                        Native Asset
                      </motion.span>
                    )}
                 </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading || !address || !amount || parseFloat(amount) <= 0}
              className="group relative w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:opacity-30 disabled:active:scale-100 disabled:cursor-not-allowed rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing Transaction...</span>
                  </span>
                ) : (
                  <>
                    <span>Donate to Grant</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </div>
               {/* Shine effect */}
               <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-[-20deg]" />
            </button>
            
            {!address && (
               <p className="mx-auto text-center text-xs font-bold text-red-500/80 bg-red-500/5 py-3 rounded-xl border border-red-500/10 animate-pulse uppercase tracking-[0.05em]">
                 Connect your wallet to donate
               </p>
            )}
          </div>
        </form>
      </motion.div>

      {/* Success Modal Popup */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 text-center"
            >
              {/* Confetti-like decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
              
              <div className="mb-8 relative inline-block">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                {/* Halo effect */}
                <div className="absolute top-0 left-0 w-full h-full rounded-full bg-green-500 animate-ping opacity-20" />
              </div>

              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Donation Confirmed!</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">
                Your transaction has been written to the Stellar blockchain successfully. 
                Your contribution directly impact projects of global scale.
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl mb-10 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Blockchain Reference</p>
                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 truncate mb-4 underline">
                   {txHash}
                </p>
                <a 
                   href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                   Verify on Explorer
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                   </svg>
                </a>
              </div>

              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl"
              >
                Continue Exploring
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
