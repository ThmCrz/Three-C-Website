import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { Badge, Button, NavDropdown } from "react-bootstrap";
import { useContext, useEffect } from "react";
import { Store } from "../Store";


function CustomNavBar() {
  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store);

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", mode);
  }, [mode]);

  const switchModeHandler = () => {
    dispatch({ type: "SWITCH_MODE" });
  };

  const signoutHandler = () => {
   dispatch({ type: "USER_SIGNOUT" })
   localStorage.removeItem('userInfo')
   localStorage.removeItem('cartItems')
   localStorage.removeItem('shippingAddress')
   localStorage.removeItem('paymentMethod')
   localStorage.removeItem('__paypal_storage__')

   window.location.href =  '/signin'
  }

  

  return (
    <>
      <Navbar bg="black" variant="dark">
        <Container>
          <Link to="/">
            <Navbar.Brand>
              <img
                alt=""
                src="/Images/Logo2.png"
                width="50px"
                height="50px"
                className="d-inline-block align-top"
              />
              <img
                alt=""
                src="/Images/Logo.jpg.png"
                width="150px"
                height="50px"
                className="d-inline-block align-top"
              />{" "}
            </Navbar.Brand>
          </Link>
          <Nav className="justify-content-end" activeKey="/home">
            <Nav.Item>
              <Button variant={mode} onClick={switchModeHandler}>
                <i
                  className={mode === "light" ? "fa fa-sun" : "fa fa-moon"}
                ></i>
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Link to={"Cart"}>
                <Nav.Link href="/cart">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </Link>
            </Nav.Item>
            <Nav.Item>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  {userInfo.isAdmin ? (
                    <Link className="dropdown-item" to="/adminPage">
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link className="dropdown-item" to="/dashboard">
                      User Dashboard
                    </Link>
                  )}
                  <Link
                    className="dropdown-item"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                <Link to={"SignIn"}>
                  <Nav.Link href="/home">Sign in</Nav.Link>
                </Link>
              )}
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default CustomNavBar;
