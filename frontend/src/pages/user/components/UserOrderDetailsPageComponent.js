import {
  Container,
  Row,
  Col,
  Form,
  Image,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const UserOrderDetailsPageComponent = ({
  userInfo,
  getUser,
  getOrder,
  loadPayPalScript,
}) => {
  const [userAddress, setUserAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [total, setTotal] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(0);
  const [count, setCount] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const { id } = useParams();

  // useEffect(() => {
  //   getUser()
  //     .then((data) => {
  //       setCount(data.count);
  //       setPaymentMethod(data.paymentMethod);
  //       setImage(data.image);
  //       setUserAddress(data.account);
  //       setPrice(data.price);
  //       setQuantity(data.quantity);
  //       setTotal(data.total);
  //       setDate(data.createdAt.substring(0, 10));
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    getOrder(id)
      .then((data) => {
        console.log("DD", data);
        setCount(data.count);
        setName(data.name);
        setPaymentMethod(data.paymentMethod);
        setTransactionHash(data.transactionHash);
        setImage(data.image.path);
        // console.log("img", image);
        setUserAddress(data.account);
        setPrice(data.price);
        setQuantity(data.quantity);
        setTotal(data.total);
        setDate(data.createdAt.substring(0, 10));
        const timeComponents = new Date(data.createdAt)
          .toLocaleTimeString("en-US")
          .split(/:| /);

        setTime(
          ` ${timeComponents[0]}:${timeComponents[1]}:${timeComponents[2]}`
        );
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container style={{ padding: "2%", margin: "0" }}>
      <Row>
        <Col md={6}>
          <Image src={image} style={{ maxWidth: "90%", paddingTop: "2%" }} />
        </Col>
        <Col md={6}>
          <b>Account : </b>
          {userAddress}
          <br />
          <br />
          <b>Transaction hash : </b>
          {transactionHash}
          <br />
          <br />
          <b>Price : </b> {price}{" "}
          <img
            src={"/small-eth.webp"}
            alt="Ether"
            style={{ width: "25px", paddingBottom: "5px" }}
          />
          <br />
          <br />
          <b>Quantity : </b>
          {quantity}
          <br />
          <br />
          <b>Total amount : </b>
          {total}{" "}
          <img
            alt="Ether"
            src={"/small-eth.webp"}
            style={{ width: "25px", paddingBottom: "5px" }}
          />
          <br />
          <br />
          {/* <b>SS</b> */}
        </Col>
      </Row>
      <Row style={{ paddingTop: "20px" }}>
        <Col md={4}>
          <b>Product name : </b>
          {name}
        </Col>
        <Col>
          <b>Time : </b> {time}
        </Col>
        <Col>
          <b>Ordered date : </b>
          {date}
        </Col>
        <Col>
          <b>Payment method : </b>
          {paymentMethod}
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrderDetailsPageComponent;
