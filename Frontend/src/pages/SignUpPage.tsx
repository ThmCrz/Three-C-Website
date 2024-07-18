import { useState, useContext, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { useSignupMutation } from "../hooks/UserHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import useEmail from "../hooks/NodeMailerHook";

export default function SignupPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { sendEmail } = useEmail();

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const { mutateAsync: signup } = useSignupMutation();

  const handleSendEmail = async () => {
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Three C Enterprises - Registration Confirmation",
        text: `Thank you for choosing Three C Enterprises! We are delighted to welcome you to our community.

        This email is to confirm that your registration was successful. Your account has been created, 
        and you are now a valued member of Three C Enterprises.
        
        Account Information:
        
        Username: ${name}
        Email: ${email}

        Next Steps:

        Now that you're a registered member, you can enjoy the following benefits:
        
        Access to exclusive content and resources.
        Receive updates on our latest products and services.
        Engage with our community through forums and discussions.
        Feel free to explore our website and let us know if you have any questions 
        or if there's anything we can assist you with. 
        We're here to make your experience with Three C Enterprises exceptional.
        
        Thank you again for choosing Three C Enterprises. We look forward to serving you!
        
        Best Regards,
        
        Three C Enterprises
        `,
      });
      toast.success("We Have Sent an Email. Please check your email address");
    } catch (err) {
      toast.error("Failed to send test email.");
      console.error("Error sending test email:", err);
    }
  };

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const data = await signup({
        name,
        email,
        password,
        phone,
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      handleSendEmail();
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container mt-4">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h2 className="my-3">Sign Up</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

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
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className="main_div">
          <Button className="signUpButton" type="submit">
            Sign Up
          </Button>
        </div>
        <div className="mt-4">
          Already have an account?{" "}
          <Button
            className="button mt-3"
            onClick={() => navigate(`/signin?redirect=${redirect}`)}
          >
            Sign-In
            <svg fill="currentColor" viewBox="0 0 24 24" className="icon">
              <path
                clip-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                fill-rule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
      </Form>
    </Container>
  );
}
