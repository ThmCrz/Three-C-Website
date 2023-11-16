import { Row, Col, Card, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useGetOrderHistoryQuery } from "../hooks/OrderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { Store } from "../Store";
import { useContext } from "react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery();
  const {
    state: { userInfo },
  } = useContext(Store);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Row>
        <Col className="equal-height-column">
          <Card className="mb-3 white-BG">
            <Card.Body className="mb-3 white-BG">
              <Card.Title className="mb-3 white-BG">Manage My Account <span>|</span> <Button>Edit (PlaceHolder)</Button> </Card.Title>
              <Card.Text className="mb-3 white-BG MMAccount">
                Username: {userInfo.name} <br /> Email: {userInfo.email} <br/>
                {userInfo.isAdmin ? (
                  <Button> Admin Dashboard</Button>
                ):( <></>)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="equal-height-column">
          <Card className="mb-3 white-BG">
            <Card.Body className="mb-3 white-BG">
              <Card.Title className="mb-3 white-BG">"Address Book (PlaceHolder)" <span>|</span> <Button>Edit (PlaceHolder)</Button> </Card.Title>
              <Row>
                <Col>
                  <Card.Text className="mb-3 white-BG">
                    <strong>Default Shipping Address</strong> <br/>
                    Thom Ezer Cruz <br/>
                    #2 Teachers Village Street Nueva Ecija - Cabanatuan -
                    Kapitan Pepe (Pob.) (+63) 09338652791
                  </Card.Text>
                </Col>
                <Col className="mb-3 white-BG">
                  <Card.Text className="mb-3 white-BG">
                    <strong>Default Billing Address</strong> <br/>
                    Thom Ezer Cruz <br/>
                    #2 Teachers Village Street Nueva Ecija - Cabanatuan -
                    Kapitan Pepe (Pob.) (+63) 09338652791
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
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
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
