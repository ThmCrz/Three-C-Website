import { Row, Col, Card, Button, Form, Spinner, Badge, Nav } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useGetOrderHistoryQuery } from "../hooks/OrderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { Store } from "../Store";
import { useContext, useState } from "react";
import { useAccountDetailsMutation} from "../hooks/UserHooks";
import { toast } from "react-toastify";
import UserOrdersCard from "../components/UserOrderCard";

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
  const [ orderStatus, setOrderStatus ] = useState(1);

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
      toast.success("Phone Number has been updated");

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
                        disabled
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="address">
                      <Form.Label>Email:</Form.Label>
                      <Form.Control
                        className="white-BG"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
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
                    {userInfo.isEmailConfirmed ? (
                      <span className={"confirmed"}>Confirmed</span>
                    ) : null}
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
        <LoadingBox/>
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
        null
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
