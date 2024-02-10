import { Row, Col, Card, Button, Form, Spinner, Badge, Nav } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useGetOrderHistoryQuery } from "../hooks/OrderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { Store } from "../Store";
import { useContext, useEffect, useState } from "react";
import { useAccountDetailsMutation, useEmailConfirmMutation } from "../hooks/UserHooks";
import { toast } from "react-toastify";
import UserOrdersCard from "../components/UserOrderCard";
import useEmail from "../hooks/NodeMailerHook";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery();
  const {
    mutateAsync: updateAccountDetails,
    isLoading: isAccountDetailsLoading,
  } = useAccountDetailsMutation();
  const {
    dispatch,
    state: {
      userInfo,
      cart: { shippingAddress },
    },
  } = useContext(Store);
  const {mutateAsync: confirmEmail} = useEmailConfirmMutation()

  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [isEditingAccountDetails, setIsEditingAccountDetails] = useState(false);
  const [ orderStatus, setOrderStatus ] = useState(1);

  const [ isconfirmingEmail, setisconfirmingEmail] = useState(false);

  const [confirmationCodeEmail, setconfirmationCodeEmail] = useState(userInfo.name || "");
  const [confirmationCode, setconfirmationCode] = useState(userInfo.name || "");

  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [isSendButtonPressed, setisSendButtonPressed] = useState(false);
  
  const { sendEmail, loading} = useEmail();

  useEffect(() => {
    if (isSendButtonPressed === true) {
      setIsSendButtonDisabled(true);
      setTimeout(() => {
        setIsSendButtonDisabled(false);
      }, 300000); // 300 seconds
    }
  }, [isSendButtonPressed]);
  


  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    dispatch({
      type: "SAVE_USER_DETAILS",
      payload: {
        _id: userInfo._id,
        name,
        email,
        phone,
      },
    });

    try {
      await updateAccountDetails({ _id: userInfo._id, name, email, phone });
      toast.success("Email Confirmed");

    } catch (error) {
      toast.error(`${error as ApiError}`);
    }

    setIsEditingAccountDetails(false);
  };

  function generateSixDigitCode(): string {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
  
    // Generate a random number between min and max
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  
    // Convert the number to a string and return
    return randomCode.toString();
  }
  
  const handleSendEmail = async (confirmationCode: string) => {
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
      toast.error('Failed to send test email.');
      console.error('Error sending test email:', err);
    }
  };

const handleSendButtonPress = () => {
  sendEmailwithcode()
  setisSendButtonPressed(true)
}

const sendEmailwithcode = () => {
  const codeForEmail = generateSixDigitCode()
  setconfirmationCodeEmail(codeForEmail);
  handleSendEmail(codeForEmail);

}

const checkConfirmationCode = () => {
  if (confirmationCodeEmail === confirmationCode) {
    emailConfirmation();
    updateLocalStorage();
  } else {
    setconfirmationCode("");
    toast.error('Incorrect confirmation code');
  }
};

const updateLocalStorage = () => {
  const userInfoString = localStorage.getItem('userInfo');

  if (userInfoString) {
    // Step 2: Parse the data to modify the specific value
    const userInfo = JSON.parse(userInfoString);
    
    // Update the isEmailConfirmed to false
    userInfo.isEmailConfirmed = true;
  
    // Step 3: Update the modified data in localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  
    toast.success('Updated userInfo:', userInfo);
  } else {
    toast.error('userInfo not found in localStorage');
  }

}


  const emailConfirmation = async () => {

    try {
      await confirmEmail({ _id: userInfo._id});
      toast.success("Email Confirmed");
    } catch (error) {
      toast.error(`${error as ApiError}`);
    }
    dispatch({ type: "SAVE_USER_DETAILS_EMAIL_CONFIRM", payload: { isEmailConfirmed: true } });
      
    setisconfirmingEmail(false)
  };

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Row>
        <Col className="equal-height-column">
          <Card className="mb-3 white-BG">
            <Card.Body className="mb-3 white-BG">
              <Card.Title className="mb-3 white-BG">
                Manage My Account <span>|</span>{" "}
                {isEditingAccountDetails ? (
                  <span>Editing...</span>
                ) : (
                  <Button onClick={() => setIsEditingAccountDetails(true)}>
                    Edit
                  </Button>
                )}
              </Card.Title>
              {isAccountDetailsLoading ? (
                <div className="BlurBox">
                  <Spinner
                    className="Account-Detail-Spinner"
                    animation="border"
                    role="status"
                  />
                </div>
              ) : (
                ""
              )}
              <Card.Text className="mb-3 white-BG MMAccount">
              {/*   */}
                {isEditingAccountDetails ? (
                  // Render the form here
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="fullName">
                      <Form.Label>Userame:</Form.Label>
                      <Form.Control
                        className="white-BG"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control
                        className="white-BG"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="city">
                      <Form.Label>Phone:</Form.Label>
                      <Form.Control
                        className="white-BG"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Link to={`/ChangePasswordPage`}>Change Password</Link>

                    <div className="mb-3 mt-3">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isAccountDetailsLoading}
                      >
                        {isLoading ? "saving..." : "Save"}
                      </Button>
                      {" | "}
                      <Button
                        onClick={() => setIsEditingAccountDetails(false)}
                        disabled={isAccountDetailsLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                    
                  </Form>
                ) : (
                  // Render the regular text here
                  <>
                    Username: {userInfo.name} <br />
                    Email: {userInfo.email}{" "}
                    {isconfirmingEmail ? (
                      <>
                        <Form onSubmit={checkConfirmationCode}>
                          <Form.Group className="mb-3" controlId="address">
                            <Form.Label>
                              Enter Confirmation Code sent to your Email
                            </Form.Label>
                            <Form.Control
                              className="white-BG"
                              onChange={(e) =>
                                setconfirmationCode(e.target.value)
                              }
                              required
                            />
                          </Form.Group>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                          >
                            {isLoading
                              ? "Checking Confirmation Code..."
                              : "Submit Code"}
                          </Button>
                          {"   |   "}
                          <Button  
                          disabled={isSendButtonDisabled}
                          onClick={() => handleSendButtonPress() }>
                            Send Code
                          </Button>
                          {"   |   "}
                          <Button onClick={() => setisconfirmingEmail(false)}>
                            Cancel
                          </Button>
                        </Form>
                      </>
                    ) : (
                      <></>
                    )}
                    {userInfo.isEmailConfirmed ? (
                      <span className={"confirmed"}>Confirmed</span>
                    ) : (
                      <>
                        {isconfirmingEmail ? (
                          <></>
                        ) : (
                          <Button onClick={() => setisconfirmingEmail(true)}>
                            Confirm your email
                          </Button>
                        )}
                      </>
                      
                    )}
                    <br />
                    Phone:{" "}
                    {userInfo.phone ? userInfo.phone : "Add a Phone number"}
                    <br />
                    {userInfo.isAdmin ? (
                      <Button onClick={() => navigate("/adminPage")}>
                        {" "}
                        Admin Dashboard
                      </Button>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="equal-height-column">
          <Card className="mb-3 white-BG">
            <Card.Body className="mb-3 white-BG">
              <Card.Title className="mb-3 white-BG">
                Address Book <span>| </span>{" "}
                <Button onClick={() => navigate("/editShipping")}>Edit</Button>
              </Card.Title>
              <Row>
                <Col>
                  <Card.Text className="mb-3 white-BG">
                    <strong>Default Shipping Address</strong> <br />
                    {shippingAddress.fullName} <br />
                    {shippingAddress.address} - {shippingAddress.city}
                    <span> </span>
                    {shippingAddress.postalCode} - {shippingAddress.country}{" "}
                    <br />
                  </Card.Text>
                </Col>
                <Col className="mb-3 white-BG">
                  <Card.Text className="mb-3 white-BG">
                    <strong>Default Billing Address</strong> <br />
                    {shippingAddress.fullName} <br />
                    {shippingAddress.address} - {shippingAddress.city}
                    <span> </span>
                    {shippingAddress.postalCode} - {shippingAddress.country}{" "}
                    <br />
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <br />
      <h3>Order History</h3>
      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : orders ? (
        <Nav variant="tabs" className="mt-3">
          <Nav.Link
            className={`Sidebar-menu ${orderStatus === 1 ? "active" : ""}`}
            onClick={() => {
              setOrderStatus(1);
            }}
          >
            Unconfirmed Orders{" "}
            <Badge pill bg="danger">
              {orders.filter((order) => order.status === 1).length}
            </Badge>
          </Nav.Link>
          <Nav.Link
            className={`Sidebar-menu ${orderStatus === 2 ? "active" : ""}`}
            onClick={() => {
              setOrderStatus(2);
            }}
          >
            Confirmed Orders{" "}
            <Badge pill bg="danger">
              {orders.filter((order) => order.status === 2).length}
            </Badge>
          </Nav.Link>
          <Nav.Link
            className={`Sidebar-menu ${orderStatus === 3 ? "active" : ""}`}
            onClick={() => {
              setOrderStatus(3);
            }}
          >
            Prepared Orders{" "}
            <Badge pill bg="danger">
              {orders.filter((order) => order.status === 3).length}
            </Badge>
          </Nav.Link>
          <Nav.Link
            className={`Sidebar-menu ${orderStatus === 4 ? "active" : ""}`}
            onClick={() => {
              setOrderStatus(4);
            }}
          >
            Out for Delivery Orders{" "}
            <Badge pill bg="danger">
              {orders.filter((order) => order.status === 4).length}
            </Badge>
          </Nav.Link>
          <Nav.Link
            className={`Sidebar-menu ${orderStatus === 5 ? "active" : ""}`}
            onClick={() => {
              setOrderStatus(5);
            }}
          >
            Completed Orders{" "}
            <Badge pill bg="danger">
              {orders.filter((order) => order.status === 5).length}
            </Badge>
          </Nav.Link>
          <Nav.Link
            className={`Sidebar-menu ${orderStatus === -1 ? "active" : ""}`}
            onClick={() => {
              setOrderStatus(-1);
            }}
          >
            Cancelled Orders{" "}
            <Badge pill bg="danger">
              {orders.filter((order) => order.status === -1).length}
            </Badge>
          </Nav.Link>
        </Nav>
      ) : (
        ""
      )}

      {isLoading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : orders ? (
        <UserOrdersCard
          status={orderStatus}
          orders={orders.filter((order) => order.status === orderStatus)}
        />
      ) : (
        ""
      )}
    </div>
  );
}
