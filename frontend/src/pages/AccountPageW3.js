import { useWeb3 } from "../providers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import EthPrice from "../providers/web3/ethPrice";
import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "short",
};

const AccountPageW3 = () => {
  const { connect, isLoading, isWeb3Loaded, useAccount, web3, provider } =
    useWeb3();
  const { account, network, targetNetwork, isSupported } = useAccount(
    web3,
    provider
  );

  let currentPrice = EthPrice();

  const [currency, setCurrency] = useState(["Loading...", "Loading..."]);
  const [currencyChange, setCurrencyChange] = useState("Loading...");
  const [loadOrders, setLoadOrders] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (currentPrice && isMounted) {
      setCurrency([currentPrice.market_data.current_price["aed"], "AED"]);
      setCurrencyChange(
        currentPrice.market_data.price_change_24h_in_currency["aed"]
      );
    }

    return () => {
      isMounted = false;
    };
  }, [currentPrice]);

  const chooseCurrency = (e) => {
    setCurrency([
      currentPrice.market_data.current_price[e.target.value.toLowerCase()],
      e.target.value.toLowerCase(),
    ]);
    setCurrencyChange(
      currentPrice.market_data.price_change_24h_in_currency[
        e.target.value.toLowerCase()
      ]
    );
  };
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo);

  const fetchOrders = async () => {
    try {
      const orders = await axios.get("/api/orders");
      // setLoadOrders(true);
      return orders;
    } catch (error) {
      // Handle errors
      return null;
    }
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <Row>
          <h1>Account Details</h1>
        </Row>

        <Row>
          <Col md={4}>
            <h3>Address Info</h3>
          </Col>
          <Col md={4}>
            <h3>Network</h3>
          </Col>
          <Col md={4}>
            <Row>
              <Col md={8}>
                <h3>Ether status</h3>{" "}
              </Col>
              {/* <Col md={3}> choose cuurency</Col> */}
              <Col md={4}>
                <span>
                  <Form.Select onChange={chooseCurrency}>
                    {currentPrice && currentPrice.market_data ? (
                      Object.keys(currentPrice.market_data.current_price).map(
                        (val, idx) => (
                          <option key={idx}>{val.toUpperCase()}</option>
                        )
                      )
                    ) : (
                      <option>Loading...</option>
                    )}
                  </Form.Select>
                </span>
                <span className="fw-bold"> </span>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <b>Your address</b> :{" "}
            {account
              ? account
              : "Please install metamask and connect to show address"}{" "}
            {/* <br /> */}
          </Col>
          <Col md={4}>
            <b>Currently on</b> : {network}
            {/* <br /> */}
          </Col>
          <Col md={4}>
            <ListGroup.Item>
              1<img src="/small-eth.webp" style={{ width: "25px" }}></img>
              {"(ETH)"} = {currency[0]} {currency[1].toUpperCase()}
            </ListGroup.Item>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <b></b> {}
          </Col>
          <Col md={4}></Col>
          <Col md={4}>
            <ListGroup.Item>
              Variance in 24 hrs :{" "}
              <span
                className="fw-bold"
                style={{ color: currencyChange > 0 ? "green" : "red" }}
              >
                {currencyChange}
              </span>
            </ListGroup.Item>
          </Col>
        </Row>

        <Row>
          <Col md={8}></Col>
          <Col md={4}>
            <ListGroup.Item>
              Variance in 1 hr :{" "}
              <span
                className="fw-bold"
                style={{
                  color:
                    currentPrice && currentPrice.market_data
                      ? currentPrice.market_data
                          .price_change_percentage_1h_in_currency[
                          currency[1].toLowerCase()
                        ] > 0
                        ? "green"
                        : "red"
                      : "Loading...",
                }}
              >
                {currentPrice && currentPrice.market_data
                  ? currentPrice.market_data
                      .price_change_percentage_1h_in_currency[
                      currency[1].toLowerCase()
                    ]
                  : "Loading..."}
              </span>
            </ListGroup.Item>
          </Col>
        </Row>

        <Row>
          <Col md={8}></Col>
          <Col md={4}>
            <ListGroup.Item className="text">
              Last Updated :{" "}
              <span className="fw-bold">
                {currentPrice
                  ? new Date(currentPrice.last_updated).toLocaleString(
                      "en-US",
                      options
                    )
                  : "Loading..."}
              </span>
            </ListGroup.Item>
          </Col>
        </Row>

        <Col md={8}>
          <br />
          <Row></Row>
          <br />
        </Col>
      </Row>
    </Container>
  );
};

export default AccountPageW3;
