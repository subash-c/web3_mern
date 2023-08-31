import UserCartDetailsPageComponent from "./components/UserCartDetailsPageComponent";
import { useWeb3 } from "../../providers";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cartActions";
import paymentEth from "./payment";

import axios from "axios";

const UserCartDetailsPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  const reduxDispatch = useDispatch();

  const {
    connect,
    isLoading,
    isWeb3Loaded,
    useAccount,
    web3,
    provider,
    contract,
    contractAddress,
  } = useWeb3();
  const { account } = useAccount(web3, provider);
  // const { userInfo } = useSelector((state) => state.userRegisterLogin);
  // console.log(userInfo);
  const getUser = async () => {
    const { data } = await axios.get("/api/users/profile/" + userInfo._id);
    return data;
  };

  const createOrder = async (orderData) => {
    // const { data } = await axios.post("/api/orders", {
    //   ...orderData,

    //   account,
    //   userInfo,
    // });
    // return data;
    const { cartItems } = orderData;
    console.log(cartItems);
    const resultOrder = await paymentEth(
      cartItems[0],
      userInfo,
      web3,
      account,
      contract,
      contractAddress
    );
    return;

    const orders = await Promise.all(
      cartItems.map(async (item) => {
        // const hexCourseId = web3.utils.asciiToHex(item.productID);
        const objectIdHexString = item.productID.toString();
        const paddedHexString = objectIdHexString.padStart(64, "0");
        const hexCourseId = "0x" + paddedHexString;
        // console.log(hexCourseId, account);
        const orderHash = web3.utils.soliditySha3(
          { t: "bytes32", v: hexCourseId },
          { t: "address", v: account }
        );
        console.log(
          "O->",
          orderHash,
          web3.utils.keccak256(account + hexCourseId)
        );
        const emailHash = web3.utils.sha3(userInfo.email);
        console.log(userInfo.email, emailHash);
        const proof = web3.utils.keccak256(emailHash + orderHash);

        // const proof = web3.utils.soliditySha3(
        //   { t: "bytes32", v: emailHash },
        //   { t: "bytes32", v: orderHash }
        // );
        console.log("Item,", proof, hexCourseId);
        console.log(item.price);
        const value = web3.utils.toWei(String(item.price / 9999999), "ether");

        try {
          const gasPriceGwei = 1; // Specify the gas price in Gwei
          console.log("Purccc");
          const gasPriceWei = web3.utils.toWei(String(gasPriceGwei), "ether");
          const result = await contract.methods
            .purchaseCourse(hexCourseId, proof)
            .send({
              from: account,
              value,
            });
          console.log(result);
          return { status: false, data: result };
        } catch (err) {
          // console.log(item.price, value);
          console.log(await contract.methods);
          console.error("Purchase course: Operation has failed.", err);
          console.log(err.receipt);
          return { status: false, data: err };
        }
      })
    );
    const oo = await orders;

    console.log("9->>>", orderData, await orders);
    return oo;
  };

  return (
    <UserCartDetailsPageComponent
      cartItems={cartItems}
      itemsCount={itemsCount}
      cartSubtotal={cartSubtotal}
      userInfo={userInfo}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
      reduxDispatch={reduxDispatch}
      getUser={getUser}
      createOrder={createOrder}
    />
  );
};

export default UserCartDetailsPage;
