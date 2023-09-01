import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent";

import { useEffect, useState } from "react";
import { useWeb3 } from "../../../providers";
import { useNavigate } from "react-router-dom";

const UserCartDetailsPageComponent = ({
  cartItems,
  itemsCount,
  cartSubtotal,
  userInfo,
  addToCart,
  removeFromCart,
  reduxDispatch,
  getUser,
  createOrder,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [userAddress, setUserAddress] = useState(false);
  const [missingAddress, setMissingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pp");
  const [status, setStatus] = useState([]);
  const [change, setChange] = useState("Place order");
  const { connect, isLoading, isWeb3Loaded, useAccount, web3, provider } =
    useWeb3();
  const { account, network, targetNetwork, isSupported } = useAccount(
    web3,
    provider
  );

  const navigate = useNavigate();

  const changeCount = (productID, count) => {
    reduxDispatch(addToCart(productID, count));
  };

  const removeFromCartHandler = (productID, quantity, price) => {
    if (window.confirm("Are you sure?")) {
      reduxDispatch(removeFromCart(productID, quantity, price));
    }
  };

  useEffect(() => {
    getUser()
      .then((data) => {
        if (
          !data.address ||
          !data.city ||
          !data.country ||
          !data.zipCode ||
          !data.state ||
          !data.phoneNumber
        ) {
          setButtonDisabled(true);
          setMissingAddress(
            " Check your account address before making transaction"
          );
        } else {
          setUserAddress({
            address: data.address,
            city: data.city,
            country: data.country,
            zipCode: data.zipCode,
            state: data.state,
            phoneNumber: data.phoneNumber,
          });
          setMissingAddress(false);
        }
      })
      .catch((er) =>
        console.log(
          er.response.data.message ? er.response.data.message : er.response.data
        )
      );
  }, [userInfo._id]);

  const orderHandler = () => {
    const orderData = {
      orderTotal: {
        itemsCount: itemsCount,
        cartSubtotal: cartSubtotal,
      },
      cartItems: cartItems.map((item) => {
        return {
          productID: item.productID,
          name: item.name,
          price: item.price,
          image: { path: item.image ? item.image.path ?? null : null },
          quantity: item.quantity,
          count: item.count,
        };
      }),
      paymentMethod: paymentMethod,
    };
    createOrder(orderData)
      .then((data) => {
        console.log("data=", data);
        if (data) {
          // navigate("/user/order-details/" + data._id);
        }
      })
      .catch((err) => console.log("error", err));
  };

  const choosePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  useEffect(
    () =>
      setStatus(
        cartItems.map((item) => ({ status: "Place order", start: true }))
      ),
    [cartItems]
  );
  // console.log(status);

  return (
    <Container fluid>
      <Row>
        <div>
          <br />{" "}
        </div>
      </Row>
      <Container fluid>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h1>Cart Details</h1>
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <br />
            <Row>
              <Col md={6}>
                <h2>Shipping</h2>
                <b>Name</b>: {userInfo.name} {userInfo.lastName} <br />
                {userAddress.address ? (
                  <>
                    <b>Address</b>
                    <>
                      : {userAddress.address} {userAddress.city}{" "}
                      {userAddress.state} {userAddress.zipCode} <br />
                    </>
                  </>
                ) : null}
                {userAddress.phoneNumber ? (
                  <>
                    <b>Phone</b>: {userAddress.phoneNumber}
                  </>
                ) : null}
                <b>Sender</b>: {account} <br />
              </Col>
              <Col md={6}>
                <h2>Payment method</h2>
                <Form.Select onChange={choosePayment}>
                  <option>Pay using ether</option>
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Alert className="mt-3" variant="danger">
                  {/* Not delivered */}
                  {missingAddress}
                </Alert>
              </Col>
              <Col>
                <Alert className="mt-3" variant="success">
                  Make payment using Ether
                </Alert>
              </Col>
            </Row>

            <br />
          </Col>
          <Col md={4}>
            <ListGroup>
              <ListGroup.Item>
                <h3>Order summary</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                Items price (after tax):{" "}
                <span className="fw-bold">
                  {(cartSubtotal / 9999999).toFixed(4)} ETH
                </span>
              </ListGroup.Item>
              <ListGroup.Item>
                Shipping: <span className="fw-bold">included</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Tax: <span className="fw-bold">included</span>
              </ListGroup.Item>
              <ListGroup.Item className="text-danger">
                Total price:{" "}
                <span className="fw-bold">{cartSubtotal / 9999999} ETH</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="d-grid gap-2">
                  <Button
                    size="lg"
                    onChange={orderHandler}
                    variant="danger"
                    type="button"
                    disabled={true}
                  >
                    Check the price before making transaction
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        <Row className="mt-4">
          <Row>
            <h2>Order items</h2>
          </Row>
          <Row>
            {console.log(status)}
            <ListGroup variant="flush">
              {cartItems.map((item, idx) => (
                <CartItemComponent
                  item={item}
                  key={idx}
                  removeFromCartHandler={removeFromCartHandler}
                  changeCount={changeCount}
                  status={status[idx] ? status[idx].status : "Place order"}
                  createOrder={createOrder}
                />
              ))}
            </ListGroup>
          </Row>
        </Row>
      </Container>
    </Container>
  );
};

export default UserCartDetailsPageComponent;
