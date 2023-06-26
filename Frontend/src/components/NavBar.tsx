import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useContext, useEffect } from "react";
import { Store } from "../Store";


function CustomNavBar() {

  const {
    state: { mode },
    dispatch,
  } = useContext(Store);

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", mode);
  }, [mode]);

  const switchModeHandler = () => {
    dispatch({type : "SWITCH_MODE"})
  }

  return (
    <>
      <Navbar bg="black" variant="dark">
        <Container>
          <Link to={""}>
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
                 className={mode === 'light' ? 'fa fa-sun' : 'fa fa-moon'}
               ></i>
             </Button>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/home">Cart</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Link to={"Login"}>
              <Nav.Link href="/home">Sign in</Nav.Link>
              </Link>
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default CustomNavBar;
