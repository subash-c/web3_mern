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

  const getUser = async () => {
    const { data } = await axios.get("/api/users/profile/" + userInfo._id);
    return data;
  };

  const createOrder = async (orderData) => {
    // return;
    const { cartItem } = orderData;
    const resultOrder = await paymentEth(
      cartItem,
      userInfo,
      web3,
      account,
      contract,
      contractAddress
    );
    const sendTransaction = await resultOrder.sendPayment();

    if (sendTransaction.status) {
      const transactionHash = sendTransaction.transactionHash;
      try {
        const { data } = await axios.post("/api/orders", {
          cartItem,
          transactionHash,
          paymentMethod: "Ether",

          account,
          userInfo,
        });
        return data;
      } catch (e) {
        console.log("er", e);
        return null;
      }
    }
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
