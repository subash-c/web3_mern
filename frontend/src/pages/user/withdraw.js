const withdrawETH = async (web3, contract, account, item) => {
  const amount = await web3.utils.toWei(String(1), "ether");

  const gasPrice = await web3.eth.getGasPrice();
  console.log("Ac1", account);
  //   const gasEstimate = await contract.methods
  //     .withdrawFunds(amount)
  //     .estimateGas();

  // Use Ethereum provider (e.g., MetaMask) to sign and send the transaction
  console.log("Ac2", account);
  const transaction = await contract.methods.withdrawFunds(amount).call; //.send({
  //  from: account,//
  // gas: gasEstimate,
  // gasPrice: gasPrice,
  // value: amount,
  //});
  console.log("txs", transaction);
  console.log("VFYJU", contract.methods);

  //   const txObject = {
  //     from: account,
  //     data: contract.methods.withdrawFunds(amount).encodeABI(),
  //   };

  //   const result = await web3.eth.sendTransaction(txObject);
  //   console.log(result);
  //   return result;
  // const objectIdHexString = item.productID.toString();
  // const paddedHexString = objectIdHexString.padStart(64, "0");
  // const hexCourseId = "0x" + paddedHexString;

  // const orderHash = web3.utils.soliditySha3(
  //   { t: "bytes32", v: hexCourseId },
  //   { t: "address", v: account }
  // );

  // const emailHash = web3.utils.sha3(userInfo.email);
  // const proof = web3.utils.keccak256(emailHash + orderHash);

  // try {
  //   // const gasPriceGwei = 1; // Specify the gas price in Gwei
  //   console.log("Purccc");
  //   // const gasPriceWei = web3.utils.toWei(String(gasPriceGwei), "ether");

  //   const txObject = {
  //     from: account,
  //     to: contractAddress,
  //     data: contract.methods.purchaseCourse(hexCourseId, proof).encodeABI(),
  //     value,
  //   };

  //   const result = await web3.eth.sendTransaction(txObject);
  //   console.log(result);
  //   return result;
  // } catch (err) {
  //   console.error("Purchase course: Operation has failed.", err);
  //   return null;
  // }
};

export default withdrawETH;
