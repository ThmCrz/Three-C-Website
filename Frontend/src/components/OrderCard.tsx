import {Row, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Order } from "../types/Order";

interface OrdersCardProps {
    status: number;
    orders: Order[];
    // Other props...
  }

  export default function OrdersCard({ status, orders }: OrdersCardProps) {

    const navigate = useNavigate();

    function getStatusText(status: number): string {
        switch (status) {
          case -1:
            return "Cancelled Orders";
          case 1:
            return "Unconfirmed Orders";
          case 2:
            return "Confirmed Orders";
          case 3:
            return "Prepared Orders";
          case 4:
            return "Out for Delivery Orders";
          case 5:
            return "Completed Orders";
          default:
            return "";
        }
      }

    return (
      <Row>
        <Card className="mb-3 mx-3">
          <Card.Header>{getStatusText(status)}</Card.Header>
          <Card.Body>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  {[-1, 5].includes(status) && (
                    <>
                      <th>PAID</th>
                      <th>DELIVERED</th>
                    </>
                  )}
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>
                      {order.createdAt ? order.createdAt.substring(0, 10) : ""}
                    </td>
                    <td>
                    ₱{order.totalPrice ? order.totalPrice.toFixed(2) : ""}
                    </td>
                    {[-1, 5].includes(order.status) && (
                      <>
                        <td>
                          {order.status === -1
                            ? "Cancelled"
                            : order.isPaid
                            ? order.paidAt
                              ? order.paidAt.substring(0, 10)
                              : ""
                            : "No"}
                        </td>
                        <td>
                          {order.status === -1
                            ? "Cancelled"
                            : order.isDelivered
                            ? order.deliveredAt
                              ? order.deliveredAt.substring(0, 10)
                              : "Yes"
                            : "No"}
                        </td>
                      </>
                    )}
                    <td>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => {
                          navigate(`/OrderManagementPage/${order._id}`);
                        }}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
        </Card>
      </Row>
    );
  }