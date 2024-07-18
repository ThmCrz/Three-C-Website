import { useState, useContext, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import { useSigninMutation } from "../hooks/UserHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";

export default function SigninPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const { mutateAsync: signin, isLoading } = useSigninMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const data = await signin({
        email,
        password,
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("cartItems", JSON.stringify(data.currentCart));
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(
          data.shippingAddress || {
            address: "",
            city: "",
            country: "",
            fullName: "",
            postalCode: "",
          }
        )
      );
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate("/adminPage");
        return;
      } else {
        navigate(redirect);
      }
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Card className="small-container mt-4">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h2 className="my-3">Sign In</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="main_div">
          <Button className="signUpButton" disabled={isLoading} type="submit">
          {isLoading ? (<LoadingBox />):("Sign In")}
          </Button>
        </div>
      </Form>
      <div className="OthersigninButtons mt-4">
        <div>
        <p>New customer?</p>
          <Button
            className="button"
            onClick={() => navigate(`/signup?redirect=${redirect}`)}
          >
            Create your account
            <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
              <path
                clip-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
        <div>
        <p>Forgot Password?</p>
          <Button className="button" onClick={() => navigate(`/resetPassword`)}>
            Forgot Password
            <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
              <path
                clip-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  );
}
