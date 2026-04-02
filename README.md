# GlobalGrant | Stellar Crowdfunding DApp

GlobalGrant is a decentralized crowdfunding platform built on the **Stellar Soroban** network. It allows users to support innovative projects and community-driven grants with transparency, security, and real-time updates.

## 🚀 Live Demo
[View Live Demo](https://steller-project-level-2.vercel.app/) *(Optional - Replace with your actual deployment link)*

## 🛠 Features
- **Wallet Integration:** Supports major Stellar wallets (Freighter, Albedo, XBull, Rabet, Hana, LOBSTR).
- **Smart Contract Based:** All donations are handled securely by a Soroban smart contract on the Testnet.
- **Real-time Tracking:** See exactly how much remains to reach the funding goal.
- **Transparent Transactions:** Every donation is verifiable on the Stellar Expert explorer.
- **Premium UI:** Sleek, glassmorphic dark theme built with Next.js and Tailwind CSS.

## 📋 Submission Checklist
- [x] Public GitHub repository
- [x] README with setup instructions
- [x] Minimum 2+ meaningful commits
- [x] Screenshot of wallet options available
- [x] Deployed contract address
- [x] Transaction hash of a contract call (verifiable on Stellar Explorer)

## 🏗 Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [Stellar Wallet](https://www.stellar.org/wallets) (e.g., Freighter) configured for Testnet.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd steller-project-level-2
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your contract details:
```env
NEXT_PUBLIC_CONTRACT_ID=CBDWWMTVIXTKNGZSO7C75RQC77PN4ZOXEMU5SJCYHCJ4CZ554HKXFHN7
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔗 Blockchain Details
- **Network:** Soroban Testnet
- **Contract ID:** `CBDWWMTVIXTKNGZSO7C75RQC77PN4ZOXEMU5SJCYHCJ4CZ554HKXFHN7`
- **Verified Transaction:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/97770f217776848e9358a8cb42ad439e89c1aa7816246f1006a3188a0202064b)
  - **Hash:** `97770f217776848e9358a8cb42ad439e89c1aa7816246f1006a3188a0202064b`

## 📸 Wallet Support
![Wallet Options](/artifacts/wallet_options_final_1775157400116.png)
*Support for Freighter, Albedo, Rabet, Hana, and LOBSTR.*

---
Built with ❤️ for the Stellar Developer Community.
