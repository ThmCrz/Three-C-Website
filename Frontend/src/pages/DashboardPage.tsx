import { Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useGetOrderHistoryQuery } from "../hooks/OrderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { Store } from "../Store";
import { useContext, useState } from "react";
import { useAccountDetailsMutation } from "../hooks/UserHooks";
import { toast } from "react-toastify";

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

  const [name, setName] = useState(userInfo.name || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [phone, setPhone] = useState(userInfo.phone || "");
  const [isEditingAccountDetails, setIsEditingAccountDetails] = useState(false);

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
      toast.success("User details updated");
      navigate("/dashboard");
    } catch (error) {
      toast.error(`${error as ApiError}`);
    }

    setIsEditingAccountDetails(false);
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
              {isAccountDetailsLoading ? <div className="BlurBox"><Spinner className="Account-Detail-Spinner" animation="border" role="status"/></div> : ""}
              <Card.Text className="mb-3 white-BG MMAccount">
                {isEditingAccountDetails ? (
                  // Render the form here
                  <Form onSubmit={submitHandler} >
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

                    <div className="mb-3">
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
                    Email: {userInfo.email} <br />
                    Phone:{" "}
                    {userInfo.phone ? userInfo.phone : "Add a Phone number"}
                    <br />
                    {userInfo.isAdmin ? (
                      <Button onClick={() => navigate("/adminPage")}> Admin Dashboard</Button>
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
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.createdAt ? order.createdAt.substring(0, 10) : ""}
                  </td>
                  <td>₱ {order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid
                      ? order.paidAt
                        ? order.paidAt.substring(0, 10)
                        : ""
                      : "No"}
                  </td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt
                        ? order.deliveredAt.substring(0, 10)
                        : ""
                      : "No"}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))

            ):( <></>)}
            
          </tbody>
        </table>
      )}
    </div>
  );
}
