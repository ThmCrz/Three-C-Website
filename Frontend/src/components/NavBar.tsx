import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useLocation, useNavigate  } from "react-router-dom";
import { Badge, Button, NavDropdown } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { useGetProductsQuery } from "../hooks/ProductHooks";
import Select from 'react-select';

import 'react-bootstrap-typeahead/css/Typeahead.css';

function CustomNavBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
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

  const { data: products} = useGetProductsQuery();


  const uniqueCategories = products
  ? Array.from(new Set(products.map(product => product.category)))
  : [];

  const location = useLocation();
  const navigate = useNavigate();


  const shouldHideNav = location.pathname !== "/" && location.pathname !== "/InventoryManagementPage";

  return (
    <>
      <Navbar bg="black" variant="dark">
        <Container>
          <Link to="/">
            <Navbar.Brand>
              {/* Move the images outside of the Navbar.Brand */}
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
          {shouldHideNav ? null : (
            <Nav>
              <Nav.Item className="d-flex align-items-center">
                <NavDropdown
                  className="ml-auto"
                  title="Products"
                  id="basic-nav-dropdown"
                  show={dropdownVisible}
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                >
                  {uniqueCategories.map((category, index) => (
                    <NavDropdown.Item
                      key={index}
                      onClick={(event) => {
                        event.stopPropagation();
                        const categoryElement =
                          document.getElementById(category);
                        if (categoryElement) {
                          const windowHeight = window.innerHeight;
                          const elementHeight = categoryElement.offsetHeight;
                          const offset = (windowHeight - elementHeight) / 4;

                          // Set scroll-margin-top dynamically to create the desired gap
                          categoryElement.style.scrollMarginTop = `${offset}px`;

                          categoryElement.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                            inline: "nearest",
                          });
                        }
                        setDropdownVisible(false);
                      }}
                    >
                      {category}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              </Nav.Item>

              <Nav.Item className="d-flex align-items-center">
                {products && (
                  <Select
                  className="yourSelectClass"
  options={products.map((product) => ({
    value: product.name,
    label: (
      <div>
        <img src={product.image} alt={product.name} width="50px" height="50px" />
        <span>{product.name}</span>
      </div>
    ),
  }))}
  placeholder="Search"
  onChange={(selected) => {
    if (selected) {
      const selectedProduct = products.find(
        (product) => product.name === selected.value
      );
      if (selectedProduct) {
        if(location.pathname === "/InventoryManagementPage"){
          navigate(`/product/${selectedProduct.slug}/AdminProductPage`);
        }else{
          navigate(`/product/${selectedProduct.slug}`);
        }
      }
    }
  }}
/>
                )}
              </Nav.Item>
            </Nav>
          )}

          <Nav activeKey="/home">
            <Nav.Item className="hide-on-print">
              <Button variant={mode} onClick={switchModeHandler}>
                <i
                  className={mode === "light" ? "fa fa-sun" : "fa fa-moon"}
                ></i>
              </Button>
            </Nav.Item>

            <Nav.Item>
              {/* Cart link */}
              <Link to={"Cart"}>
                <Nav.Link className="hide-on-print" href="/cart">
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
              {/* User info or sign-in link */}
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
