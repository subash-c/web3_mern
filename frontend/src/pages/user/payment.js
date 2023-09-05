const paymentEth = async (
  item,
  userInfo,
  web3,
  account,
  contract,
  contractAddress
) => {
  // const objectIdHexString = item.productID.toString();
  // const paddedHexString = objectIdHexString.padStart(64, "0");
  // const hexCourseId = "0x" + paddedHexString;

  // const orderHash = web3.utils.soliditySha3(
  //   { t: "bytes32", v: hexCourseId },
  //   { t: "address", v: account }
  // );

  // const emailHash = web3.utils.sha3(userInfo.email);
  // const proof = web3.utils.keccak256(emailHash + orderHash);

  const value = await web3.utils.toWei(String(item.price / 9999999), "ether");
  const options = {
    from: account,
    value: value,
  };
  console.log("m", contract.methods);
  console.log("eve", contract.events);

  const sendPayment = async () => {
    try {
      return await contract.methods
        .sendPayment()
        .send(options, (error, transactionHash) => {
          if (!error) {
            // Payment successful, transactionHash contains the transaction ID
            return { status: true, transactionHash };
          } else {
            // Payment failed, handle the error
            return { status: false, error };
          }
        });
    } catch (err) {
      console.error("Send payment: Operation has failed.", err);
      return { status: false, err };
    }
  };

  const paymentConfirmed = async () => {
    return await new Promise(async (resolve, reject) => {
      try {
        const events = await contract.getPastEvents("PaymentSent", {
          fromBlock: 0, // Start block number
          toBlock: "latest", // End block number (or "latest" for the latest block)
        });

        resolve(events);
      } catch (error) {
        reject(error);
      }
    });
  };
  return { sendPayment, paymentConfirmed };

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

export default paymentEth;
