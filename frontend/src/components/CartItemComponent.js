import {
  Row,
  Col,
  Image,
  ListGroup,
  Form,
  Button,
  Badge,
} from "react-bootstrap";
import RemoveFromCartComponent from "./RemoveFromCartComponent";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../redux/actions/cartActions";

const CartItemComponent = ({
  item,
  show = true,
  createOrder,
  removeFromCartHandler = false,
  orderCreated = false,
  changeCount = false,
  status,
  metamaskConnect = false,
  network = false,
}) => {
  const reduxDispatch = useDispatch();
  const [statusChange, setStatusChange] = useState(status);
  const [count, setCount] = useState(item.quantity);
  const [mul, setMul] = useState(item.quantity);
  console.log("PPPP", item);
  console.log(status);
  const orderHandler = () => {
    const orderData = {
      cartItem: {
        productID: item.productID,
        name: item.name,
        price: item.price,
        image: { path: item.image ? item.image.path ?? null : null },
        quantity: item.quantity,
        count: item.count,
      },

      // paymentMethod: "eth",
    };
    setStatusChange("Loading...");
    createOrder(orderData)
      .then((data) => {
        console.log("data=", data);
        if (data) {
          // navigate("/user/order-details/" + data._id);
          setStatusChange("Placed 🙂");
          console.log("===>", data);
          setTimeout(() => {
            reduxDispatch(
              removeFromCart(item.productID, item.quantity, item.price)
            );
          }, 2000);
        } else setStatusChange("Retry again");
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col md={2}>
            <Image
              crossOrigin="anonymous"
              src={item.image ? item.image.path ?? null : null}
              fluid
              style={{ maxHeight: "5rem" }}
            />
          </Col>
          <Col md={show ? 2 : 3}>{item.name}</Col>
          <Col md={2}>
            <b>{(item.price / 9999999) * mul} ETH</b>
          </Col>
          <Col md={show ? 2 : 3}>
            <Row className="justify-content-md-center">
              <Col md={5} md="auto">
                <Button
                  variant="secondary"
                  disabled={count === item.count ? true : false}
                  onClick={
                    changeCount && count + 1 <= item.count
                      ? () => {
                          changeCount(item.productID, count + 1);
                          setMul(count + 1);

                          setCount(count + 1);
                        }
                      : undefined
                  }
                >
                  +
                </Button>
              </Col>
              <Col md={2} md="auto">
                <Button variant="outline-dark" disabled={true}>
                  {count}
                  {console.log(count)}
                </Button>
              </Col>
              <Col md={5} md="auto">
                <Button
                  variant="secondary"
                  disabled={count === 1 ? true : false}
                  onClick={
                    changeCount && count - 1 > 0
                      ? () => {
                          changeCount(item.productID, count - 1);
                          setMul(count - 1);

                          setCount(count - 1);
                        }
                      : undefined
                  }
                >
                  -
                </Button>
              </Col>
            </Row>
          </Col>
          <Col md={2}>
            <RemoveFromCartComponent
              orderCreated={orderCreated}
              productID={item.productID}
              quantity={item.quantity}
              price={item.price}
              removeFromCartHandler={
                removeFromCartHandler ? removeFromCartHandler : undefined
              }
            />
          </Col>
          {show ? (
            <Col md={2}>
              <div className="d-grid gap-2">
                <Button
                  size="md"
                  // style={{ "z-index": "8080" }}
                  onClick={orderHandler}
                  variant={
                    statusChange === "Placed 🙂" ||
                    statusChange === "Loading..."
                      ? "success"
                      : statusChange === "Place order"
                      ? "secondary"
                      : "danger"
                  }
                  type="button"
                  disabled={
                    (statusChange === "Loading..." ||
                    statusChange === "Placed 🙂"
                      ? true
                      : false) ||
                    metamaskConnect ||
                    network
                  }
                >
                  {/* {console.log("CTYFY", network)} */}
                  {metamaskConnect
                    ? "Connect metamask"
                    : network
                    ? "Change network"
                    : statusChange}
                </Button>
              </div>
            </Col>
          ) : null}
        </Row>
      </ListGroup.Item>
    </>
  );
};

export default CartItemComponent;
