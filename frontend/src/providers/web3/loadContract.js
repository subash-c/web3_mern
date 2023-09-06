// const contract = require("@truffle/contract");

// const loadContract = async (name, provider) => {
//   const res = await fetch(`/contracts/${name}.json`);
//   const Artifact = await res.json();

//   const _contract = contract(Artifact);
//   _contract.setProvider(provider);

//   let deployedContract = null;
//   try {
//     deployedContract = await _contract.deployed();
//   } catch {
//     console.log(`Contract ${name} cannot be loaded`);
//   }

//   return deployedContract;
// };

// export default loadContract;

// ------       Using web3      --------------

// const contractAddress = "0xFf66f82A2E4c351365925609b6C8D427ecfc53F7"; // Replace with your contract address

// async function fetchContractABI() {
//   try {
//     const response = await fetch("/contracts/MarketPlace.json"); // Path to the JSON file
//     const abi = await response.json();
//     console.log(abi.abi);
//     return abi.abi;
//   } catch (error) {
//     console.error("Error fetching contract ABI:", error);
//     return null;
//   }
// }

// const loadContract = async (web3) => {
//   const abi = await fetchContractABI();
//   console.log("ABI");
//   console.log(await new web3.eth.Contract(abi, contractAddress));
//   return await new web3.eth.Contract(abi, contractAddress);
// };

// export default loadContract;

// --- Another Approach --

// const NETWORK_ID = 5777;

// const loadContract = async (web3) => {
//   if (!NETWORK_ID) {
//     return Promise.reject("Network ID is not defined!");
//   }

//   const res = await fetch(`/contracts/MarketPlace.json`);
//   console.log("res", res);
//   const Artifact = await res.json();
//   console.log("->", Artifact.networks[NETWORK_ID].address);
//   if (Artifact.networks[NETWORK_ID].address) {
//     const contract = new web3.eth.Contract(
//       Artifact.abi,
//       Artifact.networks[NETWORK_ID].address
//     );
//     console.log(contract);

//     return {
//       contract: contract,
//       contractAddress: Artifact.networks[NETWORK_ID].address,
//     };
//   } else {
//     return Promise.reject(`Contract: [MarketPlace] cannot be loaded!`);
//   }
// };

// export default loadContract;

// from sepolia test network

const NETWORK_ID = process.env.REACT_APP_PUBLIC_NETWORK_ID;

const loadContract = async (web3) => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await fetch(`/contracts/MarketPlace.json`);
  console.log("res", res);
  const Artifact = await res.json();
  // console.log("->", Artifact.networks[NETWORK_ID].address);
  if (Artifact) {
    const contract = new web3.eth.Contract(
      Artifact.abi,
      process.env.REACT_APP_PUBLIC_CONTRACT_ADDRESS
    );
    console.log(contract);

    return {
      contract: contract,
      contractAddress: process.env.REACT_APP_PUBLIC_CONTRACT_ADDRESS,
    };
  } else {
    return Promise.reject(`Contract: [MarketPlace] cannot be loaded!`);
  }
};

export default loadContract;
