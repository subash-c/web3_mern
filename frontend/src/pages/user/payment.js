const paymentEth = async (
  item,
  userInfo,
  web3,
  account,
  contract,
  contractAddress
) => {
  const objectIdHexString = item.productID.toString();
  const paddedHexString = objectIdHexString.padStart(64, "0");
  const hexCourseId = "0x" + paddedHexString;

  const orderHash = web3.utils.soliditySha3(
    { t: "bytes32", v: hexCourseId },
    { t: "address", v: account }
  );

  const emailHash = web3.utils.sha3(userInfo.email);
  console.log(userInfo.email, emailHash);
  const proof = web3.utils.keccak256(emailHash + orderHash);

  console.log("Item,", proof, hexCourseId);
  console.log(item.price);
  const value = web3.utils.toWei(String(item.price / 9999999), "ether");

  try {
    // const gasPriceGwei = 1; // Specify the gas price in Gwei
    console.log("Purccc");
    // const gasPriceWei = web3.utils.toWei(String(gasPriceGwei), "ether");

    const txObject = {
      from: account,
      to: contractAddress,
      data: contract.methods.purchaseCourse(hexCourseId, proof).encodeABI(),
      value,
    };

    const result = await web3.eth.sendTransaction(txObject);
    console.log(result);
    return { data: result };
  } catch (err) {
    // console.log(item.price, value);
    console.log(await contract.methods);
    console.error("Purchase course: Operation has failed.", err);
    console.log(err.receipt);
  }
};

export default paymentEth;
