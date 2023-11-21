import { Row, Col, Card, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useGetOrderHistoryQuery } from "../hooks/OrderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { Store } from "../Store";
import { useContext, useState } from "react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery();
  const {
    state: { userInfo,
      cart: { shippingAddress }, },
  } = useContext(Store);

  const [isEditingAccountDetails, setIsEditingAccountDetails, ] = useState(false);

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
                  <>
                    <Button onClick={() => setIsEditingAccountDetails(false)}>Save</Button>{" "}
                    <Button onClick={() => setIsEditingAccountDetails(false)}>Cancel</Button>{" "}
                  </>
                ) : (
                  <Button onClick={() => setIsEditingAccountDetails(true)}>Edit</Button>
                )}
              </Card.Title>
              <Card.Text className="mb-3 white-BG MMAccount">
                {isEditingAccountDetails ? (
                  // Render the form here
                  <form>
                    <Col>
                    <Row>
                    Username: <input className="transparent-input" type="text" title="username" value={userInfo.name} />
                    </Row>
                    <Row>
                    Email: <input className="transparent-input" type="email" title="email" value={userInfo.email} />
                    </Row>
                    <Row>
                    Phone: <input className="transparent-input"
                      type="tel"
                      title="phone"
                      value={
                        userInfo.phone ? userInfo.phone : "Add a Phone number"
                      }
                      />
                      </Row>
                    </Col>
                  </form>
                ) : (
                  // Render the regular text here
                  <>
                    Username: {userInfo.name} <br />
                    Email: {userInfo.email} <br />
                    Phone: {" "}
                    {userInfo.phone ? userInfo.phone : "Add a Phone number"}
                    <br />
                    {userInfo.isAdmin ? (
                      <Button> Admin Dashboard</Button>
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
                Address Book <span>|</span> 
                  <Button onClick={() => navigate("/editShipping")}>Edit</Button>
                
              </Card.Title>
              <Row>
                <Col>
                  <Card.Text className="mb-3 white-BG">
                    <strong>Default Shipping Address</strong> <br />
                    {shippingAddress.fullName} <br />
                    {shippingAddress.address} -{" "}
                    {shippingAddress.city}
                    <span> </span>
                    {shippingAddress.postalCode} -{" "}
                    {shippingAddress.country} <br />
                  </Card.Text>
                </Col>
                <Col className="mb-3 white-BG">
                  <Card.Text className="mb-3 white-BG">
                    <strong>Default Billing Address</strong> <br />
                    {shippingAddress.fullName} <br />
                    {shippingAddress.address} -{" "}
                    {shippingAddress.city}
                    <span> </span>
                    {shippingAddress.postalCode} -{" "}
                    {shippingAddress.country} <br />
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
            {orders!.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.createdAt ? order.createdAt.substring(0, 10) : ""}
                </td>
                <td>{order.totalPrice.toFixed(2)}</td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
