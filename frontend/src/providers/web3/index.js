import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { UseAccount } from "../../pages/hooks/UseAccount";
import loadContract from "./loadContract";
const contract = loadContract;

const {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} = require("react");

const Web3Context = createContext(null);

export default function Web3Provider({ children }) {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isLoading: true,
  });

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        // const contract = loadContract("Marketplace", provider);
        // const provider = new ethers.providers.JsonRpcProvider("YOUR_ETHEREUM_RPC_URL");
        // const contract = new Contract(contractAddress, contractABI, provider);

        const web3 = new Web3(provider);
        const contract1 = await contract(web3);
        setWeb3Api({
          provider,
          web3,
          contract: contract1,
          isLoading: false,
        });
      } else {
        setWeb3Api((api) => ({ ...api, isLoading: false }));
        console.error("Please, install Metamask.");
      }
    };
    loadProvider();
  }, []);

  const _web3Api = useMemo(() => {
    const { web3, provider } = web3Api;
    return {
      ...web3Api,
      isWeb3Loaded: web3 != null,
      useAccount: UseAccount,
      connect: provider
        ? async () => {
            try {
              await web3Api.provider.request({ method: "eth_requestAccounts" });
            } catch {
              window.location.reload();
            }
          }
        : () =>
            console.error(
              "Cannot connect to Metamask, try to reload your browser please."
            ),
    };
  }, [web3Api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
