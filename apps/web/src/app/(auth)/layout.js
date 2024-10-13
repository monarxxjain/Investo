"use client"
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <AptosWalletAdapterProvider
        autoConnect={true}
        dappConfig={{ network: Network.TESTNET }}
        optInWallets={["Petra","Nightly","Pontem Wallet", "Mizu Wallet"]}
        >
            {children}
        </AptosWalletAdapterProvider>
      </body>
    </html>
  );
}
