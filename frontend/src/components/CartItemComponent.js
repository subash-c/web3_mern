import { Row, Col, Image, ListGroup, Form, Button } from "react-bootstrap";
import RemoveFromCartComponent from "./RemoveFromCartComponent";
import { useState } from "react";

const CartItemComponent = ({
  item,
  createOrder,
  removeFromCartHandler = false,
  orderCreated = false,
  changeCount = false,
  status,
}) => {
  const [statusChange, setStatusChange] = useState(status);
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

      // paymentMethod: paymentMethod,
    };
    setStatusChange("Loading...");
    createOrder(orderData)
      .then((data) => {
        console.log("data=", data);
        if (data) {
          // navigate("/user/order-details/" + data._id);
          setStatusChange("Placed 🙂");
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
            />
          </Col>
          <Col md={2}>{item.name}</Col>
          <Col md={2}>
            <b>{item.price / 9999999} ETH</b>
          </Col>
          <Col md={2}>
            <Form.Select
              onChange={
                changeCount
                  ? (e) => changeCount(item.productID, e.target.value)
                  : undefined
              }
              disabled={orderCreated}
              value={item.quantity}
            >
              {[...Array(item.count).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </Form.Select>
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
          <Col md={2}>
            <div className="d-grid gap-2">
              <Button
                size="md"
                style={{ "z-index": "8080" }}
                onClick={orderHandler}
                variant={
                  statusChange === "Placed 🙂" || statusChange === "Loading..."
                    ? "success"
                    : statusChange === "Place order"
                    ? "secondary"
                    : "danger"
                }
                type="button"
                disabled={
                  statusChange === "Loading..." || statusChange === "Placed 🙂"
                    ? true
                    : false
                }
              >
                {statusChange}
              </Button>
            </div>
          </Col>
        </Row>
      </ListGroup.Item>
    </>
  );
};

export default CartItemComponent;
