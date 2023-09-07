import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Form,
  DropdownButton,
  Dropdown,
  Button,
  InputGroup,
} from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCategories } from "../redux/actions/categoryActions";
import socketIOClient from "socket.io-client";
import {
  setChatRooms,
  setSocket,
  setMessageReceived,
  removeChatRoom,
} from "../redux/actions/chatActions";

import "../css/headerComponent.css";
import { useWeb3 } from "../providers";

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userRegisterLogin);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const { categories } = useSelector((state) => state.getCategories);
  const { messageReceived } = useSelector((state) => state.adminChat);

  const [searchCategoryToggle, setSearchCategoryToggle] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const truncateAddress = (address) => {
    return `${address.substring(0, 9)}...${address.substring(
      address.length - 9
    )}`;
  };

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const submitHandler = (e) => {
    if (e.keyCode && e.keyCode !== 13) return;
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchCategoryToggle === "All") {
        navigate(`/product-list/search/${searchQuery}`);
      } else {
        navigate(
          `/product-list/category/${searchCategoryToggle.replaceAll(
            "/",
            ","
          )}/search/${searchQuery}`
        );
      }
    } else if (searchCategoryToggle !== "All") {
      navigate(
        `/product-list/category/${searchCategoryToggle.replaceAll("/", ",")}`
      );
    } else {
      navigate("/product-list");
    }
  };

  useEffect(() => {
    if (userInfo.isAdmin) {
      var audio = new Audio("/audio/chat-msg.mp3");
      const socket = socketIOClient();
      socket.emit(
        "admin connected with server",
        "Admin" + Math.floor(Math.random() * 1000000000000)
      );
      socket.on(
        "server sends message from client to admin",
        ({ user, message }) => {
          dispatch(setSocket(socket));
          //   let chatRooms = {
          //     fddf54gfgfSocketID: [{ "client": "dsfdf" }, { "client": "dsfdf" }, { "admin": "dsfdf" }],
          //   };
          dispatch(setChatRooms(user, message));
          dispatch(setMessageReceived(true));
          audio.play();
        }
      );
      socket.on("disconnected", ({ reason, socketId }) => {
        dispatch(removeChatRoom(socketId));
      });
      return () => socket.disconnect();
    }
  }, [userInfo.isAdmin]);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const isVisible = prevScrollPos > currentScrollPos;

    setPrevScrollPos(currentScrollPos);
    setVisible(isVisible);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //added
  const { connect, isLoading, isWeb3Loaded, useAccount, web3, provider } =
    useWeb3();
  const { account } = useAccount(web3, provider);

  return (
    <Container fluid className="paddingColor">
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        className={`custom-navbar ${
          visible ? "navbar-visible" : "navbar-hidden"
        }`}
      >
        <Container fluid>
          <LinkContainer to="/">
            <Navbar.Brand href="/">C.S 🛍</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <InputGroup>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={searchCategoryToggle}
                >
                  <Dropdown.Item onClick={() => setSearchCategoryToggle("All")}>
                    All
                  </Dropdown.Item>
                  {categories.map((category, id) => (
                    <Dropdown.Item
                      key={id}
                      onClick={() => setSearchCategoryToggle(category.name)}
                    >
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <Form.Control
                  id="aa"
                  className=" col-lg-6 "
                  onKeyUp={submitHandler}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Type here to search ..."
                />
                <Button onClick={submitHandler} variant="warning">
                  <i className="bi bi-search text-dark"></i>
                </Button>
              </InputGroup>
            </Nav>
            <Nav>
              {userInfo.isAdmin ? (
                <LinkContainer to="/admin/orders">
                  <Nav.Link>
                    Admin
                    {messageReceived && (
                      <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
                    )}
                  </Nav.Link>
                </LinkContainer>
              ) : userInfo.name && !userInfo.isAdmin ? (
                <NavDropdown
                  title={`${userInfo.name} ${userInfo.lastName}`}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item
                    eventKey="/user/my-orders"
                    as={Link}
                    to="/user/my-orders"
                  >
                    My orders
                  </NavDropdown.Item>
                  <NavDropdown.Item eventKey="/user" as={Link} to="/user">
                    My profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => dispatch(logout())}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>Register</Nav.Link>
                  </LinkContainer>
                </>
              )}

              <LinkContainer to="/cart">
                <Nav.Link>
                  <Badge pill bg="danger">
                    {itemsCount === 0 ? "" : itemsCount}
                  </Badge>
                  <i className="bi bi-cart-dash"></i>
                  <span className="ms-1">CART</span>
                </Nav.Link>
              </LinkContainer>
              {/* <Button variant="primary"> */}
              <LinkContainer to="/accountw3">
                <Nav.Link disabled={isLoading ? true : false}>
                  <span onClick={connect} className="ms-1">
                    {isLoading
                      ? "Loading..."
                      : isWeb3Loaded
                      ? account
                        ? truncateAddress(account)
                        : "Connect"
                      : "Please install metamask 🦊"}
                  </span>
                </Nav.Link>
              </LinkContainer>
              {/* </Button> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Container>
  );
};

export default HeaderComponent;
