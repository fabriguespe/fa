"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { loadKeys, storeKeys } from "./XMTPHelpers";
import { useCallback } from "react";
import { useClient, Client } from "@xmtp/react-sdk";
import { useWalletClient } from "wagmi";

export default function Home() {
  const { isConnected, address, connector } = useAccount();
  const { initialize } = useClient();
  const { data: walletClient } = useWalletClient();
  const { address: accountAddress } = useAccount();

  const handleConnect = async () => {
    try {
      const options = {
        env: "dev",
      };
      console.log("Initializing XMTP...");
      let keys = loadKeys(accountAddress);
      if (!keys) {
        keys = await Client.getKeys(walletClient, {
          ...options,
          skipContactPublishing: true,
          persistConversations: false,
        });
        storeKeys(accountAddress, keys);
      }
      await initialize({ keys, options, signer: walletClient });
      console.log("Works!");
    } catch (error) {
      console.error("Error initializing XMTP:", error);
    }
  };
  return (
    <>
      <ConnectKitButton />

      {isConnected && <button onClick={handleConnect}>XMTP Login</button>}
    </>
  );
}
