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
      <ToastContainer position="bottom-center" limit={1} autoClose={1000}/>
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
