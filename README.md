# GlobalGrant — Stellar Crowdfunding DApp

A decentralized crowdfunding platform built on the **Stellar Soroban** smart contract network. GlobalGrant enables transparent, on-chain donations where every contribution is verifiable on the Stellar blockchain. Users connect a Stellar wallet, donate XLM to a campaign, and track progress in real-time.

## 🚀 Live Demo

**[https://steller-level2.vercel.app](https://steller-level2.vercel.app)**

---

## 📋 Project Description

GlobalGrant is a full-stack Web3 application that demonstrates:

- **Multi-wallet support** — Freighter, Albedo, Rabet, Hana Wallet, and LOBSTR via the [Stellar Wallets Kit](https://github.com/AntCompTech/stellar-wallets-kit).
- **Soroban smart contract** — A Rust-based crowdfunding contract deployed to the Stellar Testnet that handles campaign initialization, donations, and state tracking.
- **Real-time campaign tracking** — Progress bar, total raised, and goal amount fetched directly from on-chain data via Soroban RPC simulation.
- **Transaction verification** — Every donation returns a blockchain hash that can be verified on [Stellar Expert](https://stellar.expert/explorer/testnet).
- **Event-driven history** — Recent donations are streamed from Soroban contract events and displayed in a live activity feed.
- **Premium UI** — Glassmorphism dark theme with Framer Motion animations, built with Next.js and Tailwind CSS.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (Pages Router), React, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Blockchain | Stellar Soroban (Testnet) |
| Smart Contract | Rust (Soroban SDK) |
| Wallet Integration | Stellar Wallets Kit |
| RPC | Soroban RPC + Horizon API |
| Deployment | Vercel |

---

## 🏗 Setup Instructions

### Prerequisites

- **Node.js** v18 or later — [Download](https://nodejs.org/)
- **A Stellar Wallet** — [Freighter](https://www.freighter.app/) (recommended) configured for Testnet
- **Rust + Soroban CLI** — Only if you want to rebuild the smart contract

### 1. Clone & Install

```bash
git clone https://github.com/simmitiwari770-beep/steller-level2.git
cd steller-level2
npm install
```

### 2. Environment Variables

The app ships with a committed `.env.production` that works out of the box. For local development, create a `.env` file:

```env
NEXT_PUBLIC_CONTRACT_ID=CBDWWMTVIXTKNGZSO7C75RQC77PN4ZOXEMU5SJCYHCJ4CZ554HKXFHN7
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. (Optional) Redeploy the Smart Contract

```bash
node scripts/deploy.mjs
```

This will generate a new keypair, fund it via Friendbot, upload the WASM, create the contract instance, initialize the campaign, and update your `.env` with the new contract ID.

---

## 📁 Folder Structure

```
steller-level2/
├── contracts/
│   └── crowdfunding/          # Soroban smart contract (Rust)
│       ├── Cargo.toml
│       └── src/               # Contract source code
├── scripts/
│   ├── deploy.mjs             # Automated contract deployment script
│   └── get_id.mjs             # Utility to fetch contract ID
├── public/
│   ├── .well-known/
│   │   └── stellar.toml       # SEP-0001 for wallet verification
│   ├── screenshots/           # README screenshots
│   └── grant_banner.png       # Campaign banner image
├── src/
│   ├── components/
│   │   ├── CampaignStats.tsx   # Campaign progress & stats display
│   │   ├── DonationForm.tsx    # Donation input & transaction handling
│   │   ├── Layout.tsx          # App layout with navbar
│   │   ├── TransactionHistory.tsx  # Live event feed from contract
│   │   └── WalletConnect.tsx   # Wallet connect/disconnect button
│   ├── hooks/
│   │   ├── useCampaign.ts      # Campaign data fetching hook
│   │   └── useStellar.ts       # Zustand store for wallet state
│   ├── lib/
│   │   ├── contract.ts         # Soroban RPC calls (donate, getCampaign, events)
│   │   └── stellar-wallet.ts   # Stellar Wallets Kit initialization
│   ├── pages/
│   │   ├── _app.tsx            # App wrapper
│   │   ├── _document.tsx       # Document head
│   │   └── index.tsx           # Main page
│   └── styles/
│       └── globals.css         # Global styles & Tailwind imports
├── .env.production             # Production environment variables (committed)
├── next.config.ts              # Next.js config with env fallbacks & CORS headers
├── package.json
└── tsconfig.json
```

---

## 🔗 Blockchain Details

| Detail | Value |
|--------|-------|
| **Network** | Stellar Soroban Testnet |
| **Contract ID** | `CBDWWMTVIXTKNGZSO7C75RQC77PN4ZOXEMU5SJCYHCJ4CZ554HKXFHN7` |
| **Explorer** | [View Contract on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBDWWMTVIXTKNGZSO7C75RQC77PN4ZOXEMU5SJCYHCJ4CZ554HKXFHN7) |
| **Verified Tx** | [`97770f2177...`](https://stellar.expert/explorer/testnet/tx/97770f217776848e9358a8cb42ad439e89c1aa7816246f1006a3188a0202064b) |

---

## 📸 Screenshots

### 1. Wallet Options Available
*Multi-wallet support: Freighter, Albedo, Rabet, Hana Wallet, and LOBSTR via Stellar Wallets Kit.*
<img width="1440" height="900" alt="Screenshot 2026-04-03 at 1 07 10 PM" src="https://github.com/user-attachments/assets/719b4e27-0a25-4b8e-b28f-3027c2cc0ef7" />
tions.png)


### 2. Wallet Connected & Balance
*Connected wallet showing truncated address and real-time XLM balance alongside campaign stats.*
<img width="1432" height="859" alt="Screenshot 2026-04-03 at 1 08 03 PM" src="https://github.com/user-attachments/assets/4c85accd-be92-4958-adab-62a58acbf502" />


### 3. Successful Transaction
*Donation confirmed on-chain with blockchain reference hash and a link to verify on Stellar Expert.*

<img width="1431" height="865" alt="Screenshot 2026-04-03 at 1 09 23 PM" src="https://github.com/user-attachments/assets/ff79e418-41e4-4c2a-8ac0-de8bbb3f7956" />

<img width="1438" height="859" alt="Screenshot 2026-04-03 at 1 10 19 PM" src="https://github.com/user-attachments/assets/164ea393-8793-47f3-8a35-f2e20e075848" />


