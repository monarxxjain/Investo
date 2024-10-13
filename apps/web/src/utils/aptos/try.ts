import { InputTransactionData,useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { useEffect, useState } from "react";

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
const aptos = new Aptos(new AptosConfig({ network:  Network.TESTNET }));

export const ConnectAptos =  () => {

    const {account, signAndSubmitTransaction} = useWallet()
    const reciever_address = "0xb2726432e64ae3e5ce48c598e630d0becf52992eaa9f41c2a16f7dd779134bd2";
    const moduleAddress = "0x584848e93ffed3018350365dba554cac52392cfaf0a31aea33d595f850005d69";

  const dosomething = async () => {
    if (!account) return [];

    try {
        
        const transaction:InputTransactionData = {
        data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [reciever_address, 1],
        },
        };

        // sign and submit transaction to chain
        const response = await signAndSubmitTransaction(transaction);
        // wait for transaction
        await aptos.waitForTransaction({ transactionHash: response.hash });
        console.log(aptos);

    } catch (error) {
        console.log(error);
    }
  };
}