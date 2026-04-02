import Head from 'next/head';
import { useEffect, useState } from 'react';


export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['Outfit']">
      <Head>
        <title>GlobalGrant | Stellar Crowdfunding</title>
        <meta name="description" content="Secure and transparent decentralized crowdfunding on Stellar Soroban" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Decorative blurred blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-pink-500/10 dark:bg-pink-600/10 rounded-full blur-[110px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="sticky top-0 z-50 px-6 py-4 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/40 dark:border-slate-800/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Global<span className="text-blue-600 dark:text-blue-400">Grant</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Stellar Powered</p>
            </div>
          </div>
          
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {children}
      </main>

      <footer className="mt-20 py-10 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-60">
             <div className="w-6 h-6 bg-slate-400 rounded-lg" />
             <span className="text-sm font-medium">Stellar Crowdfunding © 2026</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-slate-500 dark:text-slate-400">
             <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
             <a href="#" className="hover:text-blue-500 transition-colors">Explorer</a>
             <a href="#" className="hover:text-blue-500 transition-colors">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
