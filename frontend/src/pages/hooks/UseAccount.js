import { useState, useEffect } from "react";

const NETWORKS = {
  1: "Ethereum Main Network",
  5: "Goerli Test Network",
  11155111: "Sepolia test network",
  59140: "Linea Goerli test network",
  1337: "Localhost test networks (Ex. Ganache)",
};

const targetNetwork =
  NETWORKS[process.env.REACT_APP_PUBLIC_TARGET_CHAIN_ID_DEVELOPMENT];

export const UseAccount = (web3, provider) => {
  const [account, setAccount] = useState(null);
  // const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState(
    "Please install metamask and connect to show the network"
  );
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      // const bal = await web3.eth.getBalance(accounts[0]);

      // setBalance(web3.utils.fromWei(bal, "ether"));

      // console.log(bal, balance);
    };

    const getChainId = async () => {
      const chainId = await web3.eth.getChainId();
      setNetwork(() => NETWORKS[parseInt(chainId)]);
      // console.log(
      //   "HB",
      //   chainId,
      //   network,
      //   NETWORKS[parseInt(chainId)],
      //   targetNetwork,
      //   process.env.REACT_APP_PUBLIC_TARGET_CHAIN_ID_DEVELOPMENT,
      //   targetNetwork === network
      // );
    };

    web3 && getAccount() && getChainId();
  }, [web3]);

  useEffect(() => {
    provider &&
      provider.on("accountsChanged", (accounts) =>
        setAccount(accounts[0] ?? null)
      );
    provider &&
      provider.on("chainChanged", (chainId) => {
        setNetwork(NETWORKS[parseInt(chainId)]);
      });
  }, [provider]);
  return {
    account: web3 ? account : null,
    network,
    targetNetwork,
    isSupported: targetNetwork === network,
  };
};
