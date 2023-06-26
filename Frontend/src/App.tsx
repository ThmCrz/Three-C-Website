import "./App.css";
import CustomNavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

function App() {
 
  return (
    <div className="d-flex flex-column min-vh-100 min-vw-100">
      <header>
        <CustomNavBar />
      </header>
      <main>
        <Container className="mt-3">
          <Outlet />
        </Container>
      </main>
      <footer className="c">All rights reserved.</footer>
    </div>
  );
}

export default App;
