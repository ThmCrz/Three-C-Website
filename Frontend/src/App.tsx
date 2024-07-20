// import "./App.css";
import "./index.css";
import CustomNavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() { 
  return (
    <div className="d-flex flex-column min-vh-100 min-vw-100">
      <ToastContainer className="hide-on-print" position="bottom-center" limit={3} autoClose={1000}/>
      <header>
        <CustomNavBar />
      </header>
      <main>
        <Container className="">
          <Outlet />
        </Container>
      </main>
      <footer>All rights reserved.</footer>
    </div>
  );
}

export default App;
