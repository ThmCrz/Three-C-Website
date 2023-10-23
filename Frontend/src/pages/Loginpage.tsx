import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Loginpage() {
  return (
    <div>
      Loginpage
      <Link to={"/SignUp"}>
        <Button>Sign Up</Button>
      </Link>
    </div>
  );
}
