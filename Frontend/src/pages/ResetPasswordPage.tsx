import { Button, Form } from "react-bootstrap";
import { Link, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import useEmail from "../hooks/NodeMailerHook";
import { useState } from "react";
import { useCheckEmailMutation, usePasswordMutation } from "../hooks/UserHooks";
import { ApiError } from "../types/ApiError";
import LoadingBox from "../components/LoadingBox";

export default function ResetPasswordPage() {
  // State variables
  const [email, setEmail] = useState("");
  const [confirmationCodeEmail, setconfirmationCodeEmail] = useState("");
  const [confirmationCode, setconfirmationCode] = useState("");

  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  const [PasswordResetStep, setPasswordResetStep] = useState(1);

  // Custom hook for sending email
  const { sendEmail } = useEmail();

  const { mutateAsync: passwordMutation, isLoading} = usePasswordMutation();
  const { mutateAsync: checkEmail, isLoading: loadingEmail } = useCheckEmailMutation();

  // Function to generate a six-digit code
  function generateSixDigitCode(): string {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode.toString();
  }

  // Function to send email with the generated code
  const sendEmailwithcode = () => {
    const codeForEmail = generateSixDigitCode()
    setconfirmationCodeEmail(codeForEmail);
    handleSendEmail(codeForEmail);
  }

  // Function to handle the sending of email
  const handleSendEmail = async (confirmationCode: string) => {
    try {
      await sendEmail({
        to: email,
        subject: 'Reset Password',
        text: (`Here is your Email Confirmation Code to reset your password: ${confirmationCode} Thank you again for choosing Three C Enterprises. We look forward to serving you! Best Regards, Three C Enterprises`),
      }); 
      toast.success("We Have Sent an Email to confirm your account. Please check your email address")
      setPasswordResetStep(2)
    } catch (err) {
      toast.error('Failed to send test email.');
      console.error('Error sending test email:', err);
    }
  };

  // Function to handle the pressing of the send button
  const handleSendButtonPress = async () => {
    try {
      await checkEmail({email});
      sendEmailwithcode();
    } catch (emailError) {
      toast.error(`User Not Found`);
    }
 
  }

  // Function to check the confirmation code
  const checkConfirmationCode = () => {
     if (confirmationCodeEmail === confirmationCode) {
      setPasswordResetStep(3)
      
    } else {
      setconfirmationCode("");
      toast.error('Incorrect confirmation code');
    }
  };

  const handlePasswordResetSubmit = async () => {
if (password === ConfirmPassword) {
  try {
    await passwordMutation({email, password})
    toast.success("Password reset Successful");
  }catch(err){
    toast.error(`${err as ApiError}`);
  }
} else {
  toast.error("Passwords do not match");
}
  }

  // Render
  return (
    <div>
      <h1>Reset Password</h1>

      <div>
        {PasswordResetStep === 1 ? (
        <Form >
          <Form.Group controlId="Email">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
            type="email" 
            value={email} 
            placeholder="Enter email" 
            onChange={(e) => setEmail(e.target.value)}
            required />
          </Form.Group>
          <Button
            variant="primary"
            onClick={() => {handleSendButtonPress()}}
            disabled={loadingEmail}
          >
            Send Code {loadingEmail ? (<LoadingBox/>) : null}
          </Button>
        </Form>
         ) : null}

        {PasswordResetStep === 2 ? (
          <Form >
            <Form.Group controlId="formBasicCode">
              <Form.Label>We've send a code to your email to Reset your password</Form.Label>
              <Form.Control
                type="text"
                value={confirmationCode} 
                onChange={(e) => setconfirmationCode(e.target.value)}
                placeholder="Enter code"
                required
              />
            </Form.Group>
            <Button 
            variant="primary" 
            onClick={() => checkConfirmationCode()}
            >
              Submit
            </Button>
          </Form>
        ) : null}

        {PasswordResetStep === 3 ? (
          <Form>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)}
            required />
            </Form.Group>
            <Form.Group controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm password" onChange={(e) => setConfirmPassword(e.target.value)}
            required />
            </Form.Group>
            
            <Button variant="primary" disabled={isLoading} onClick={() => {handlePasswordResetSubmit()}}>
              Reset Password {isLoading ? (<LoadingBox/>): null}
            </Button>
          </Form>
        ) : null}
      </div>   
      <div className="mb-3">
        New customer?{" "}
        <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
      </div>


    </div>
  );
}