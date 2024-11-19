import { useState, useEffect } from "react";
import { Container, Button, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import { useSignupMutation } from "../hooks/UserHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import useEmail from "../hooks/NodeMailerHook";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCodeEmail, setconfirmationCodeEmail] = useState("vnaksdoqwebsadgjasdfasdofasfjwendsflasdfsaslfjh");
  const [confirmationCode, setconfirmationCode] = useState("Enter Authentication Code");
  const [authenticationInput, setAuthenticationInput] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isEmailInputValid, setIsEmailInputvalid] = useState(true);
  const [isSendButtonPressed, setIsSendButtonPressed] = useState(false);
  const [resendButton, setResendButton] = useState(false);
  const [isResendButton, setIsResendButton] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  
  const { sendEmail } = useEmail();
  const { mutateAsync: signup } = useSignupMutation();
    
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Check if email is valid
    const isValid = emailRegex.test(email);
    setIsEmailInputvalid(!isValid);
  };

  useEffect(() => {
    // Check for autofill values after the component mounts
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    if (emailInput && emailInput.value) {
      setEmail(emailInput.value);
      isEmailValid(emailInput.value);
    }
  }, []);

  const handleSendButtonPress = () => {
    sendEmailwithcode();
    setIsSendButtonPressed(true);
  };

  function generateSixDigitCode(): string {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
  
    // Generate a random number between min and max
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  
    // Convert the number to a string and return
    return randomCode.toString();
  }

  const sendEmailwithcode = () => {
    const codeForEmail = generateSixDigitCode()
    setconfirmationCodeEmail(codeForEmail);
    handleSendEmailVerificationCode(codeForEmail);
  
  }
  const resendEmailwithcode = () => {
    handleSendEmailVerificationCode(confirmationCodeEmail);
  }

  const handleSendEmailVerificationCode = async (confirmationCode: string) => {
    try {
      await sendEmail({
        to: email,
        subject: 'Email Confirmation',
        text: (`
        Here is your Email Confirmation Code:

        ${confirmationCode}

        Thank you again for choosing Three C Enterprises. We look forward to serving you!
        
        Best Regards,
        
        Three C Enterprises
        `),
       
      }); 
      toast.success("We Have Sent an Email to confirm your account. Please check your email address")
    } catch (err) {
      toast.error('Failed to send Confirmation email.');
      console.error('Error sending Confirmation email:', err);
    }
  };

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
      toast.error("Failed to send Welcome email.");
      console.error("Error sending Welcome email:", err);
    }
  };

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else if (confirmationCode === "Enter Authentication Code") {
      toast.error("Please enter an Authentication Code");
      return;
    }else if(confirmationCodeEmail !== confirmationCode) {
      toast.error('Incorrect confirmation code');
      return;
    }
    try {
       await signup({
        name,
        email,
        password,
        phone,
      });
      toast.success("Successfully signed up, You may now Sign In");
      handleSendEmail();
      navigate("/signin");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSendButtonPressed) {
      setIsResendButton(true);
      setRemainingTime(300); // 300 seconds

      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsResendButton(false);
            setIsSendButtonPressed(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isSendButtonPressed]);

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
          <Form.Label className="flex">Email  {isEmailInputValid && hasInteracted && (<p className="red">Please Enter a Valid Email*</p>)}</Form.Label>
          <Form.Control
            type="email"
            required
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              const target = e.target as HTMLInputElement;
              setEmail(target.value);
              isEmailValid(target.value);
              setconfirmationCodeEmail('vnaksdoqwebsadgjasdfasdofasfjwendsflasdfsaslfjh');
              setHasInteracted(true);
            }}
          />
          
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Authentication Code</Form.Label>
          <Form.Control
            type="number"
            required
            onChange={(e) => setconfirmationCode(e.target.value)}
            disabled={authenticationInput}
          />
          {resendButton ? (
            <div className="ResendContainer">
            <p className="mt-2">did not Recieve Email?</p>
            <span className="m-2"></span>
            <Button
            className="bt"
            id="bt"
            onClick={() => {resendEmailwithcode(); setResendButton(true)}}
            disabled={isResendButton}
            >
            <span className="msg"></span>
            {isResendButton ? `Resend Code (${remainingTime}s)` : 'Resend Code'}
          </Button>
            </div>
          ):(<Button
            className="bt"
            id="bt"
            onClick={() => {handleSendButtonPress(); setAuthenticationInput(false); setResendButton(true)}}
            disabled={isSendButtonPressed || isEmailInputValid}
            >
            {" "}
            <span className="msg"></span>
            Send Code
          </Button>)}
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
          <Button className="signUpButton" type="submit" disabled={isEmailInputValid}>
            Sign Up
          </Button>
        </div>
        <div className="mt-4">
          Already have an account?{" "}
          <Button
            className="button mt-3"
            onClick={() => navigate(`/signin`)}
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
