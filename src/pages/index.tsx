import React from 'react';
import { WalletConnect } from '@/components/WalletConnect';
import { CampaignStats } from '@/components/CampaignStats';
import { DonationForm } from '@/components/DonationForm';
import { motion } from 'framer-motion';

export default function Home() {
  const contractId = process.env.NEXT_PUBLIC_CONTRACT_ID || '';

  return (
    <div className="px-6 py-12 lg:py-20 flex flex-col gap-12 max-w-7xl mx-auto">
      {/* Header section with title and wallet */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200/50 dark:border-slate-800/50 pb-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
             <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-4">
          <div className="w-1 h-4 bg-blue-600 dark:bg-blue-400 rounded-full" />
          Soroban Live Network
          <span className="mx-2 text-slate-300">/</span>
          <a 
            href={`https://stellar.expert/explorer/testnet/contract/${contractId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors flex items-center gap-1 group"
          >
            Contract: {contractId.slice(0, 6)}...{contractId.slice(-6)}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-50 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            Empowering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Global Future.</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed">
            Support innovative projects and community-driven grants through the high-performance Stellar network. 
            Transparent, secure, and decentralized.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0"
        >
          <WalletConnect />
        </motion.div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Campaign stats */}
        <section className="lg:col-span-7 xl:col-span-8">
          <CampaignStats contractId={contractId} />
        </section>

        {/* Right column: Donation form */}
        <section className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
          <DonationForm contractId={contractId} />
        </section>
      </div>
      
      {/* Footer Info / Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
         {[
           { label: 'Blockchain', value: 'Stellar Soroban' },
           { label: 'Network status', value: 'Active Testnet' },
           { label: 'Protocol Version', value: '20+' }
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 + i * 0.1 }}
             className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-800/50"
           >
              <p className="text-xs uppercase tracking-widest text-slate-400 font-black mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{stat.value}</p>
           </motion.div>
         ))}
      </section>
    </div>
  );
}
