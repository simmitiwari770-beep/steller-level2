import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@creit.tech/stellar-wallets-kit"],
  // Hardcoded fallbacks — these are overridden by Vercel env vars if set,
  // but guarantee the app works even without any dashboard configuration.
  // Safe to commit: all values are public testnet identifiers, no secrets.
  env: {
    NEXT_PUBLIC_CONTRACT_ID:
      process.env.NEXT_PUBLIC_CONTRACT_ID ||
      "CBDWWMTVIXTKNGZSO7C75RQC77PN4ZOXEMU5SJCYHCJ4CZ554HKXFHN7",
    NEXT_PUBLIC_HORIZON_URL:
      process.env.NEXT_PUBLIC_HORIZON_URL ||
      "https://horizon-testnet.stellar.org",
    NEXT_PUBLIC_SOROBAN_RPC_URL:
      process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ||
      "https://soroban-testnet.stellar.org",
    NEXT_PUBLIC_NETWORK_PASSPHRASE:
      process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
      "Test SDF Network ; September 2015",
  },
  // SEP-0001: Allow wallets (Freighter, etc.) to fetch stellar.toml via CORS
  async headers() {
    return [
      {
        source: "/.well-known/stellar.toml",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET" },
          { key: "Content-Type", value: "text/plain" },
        ],
      },
    ];
  },
};

export default nextConfig;
