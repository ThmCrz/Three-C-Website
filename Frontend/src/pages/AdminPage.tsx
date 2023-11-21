import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useGetOrdersQuery } from "../hooks/OrderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { Store } from "../Store";
import { useContext, useState } from "react";
import { useAccountDetailsMutation } from "../hooks/UserHooks";
import { toast } from "react-toastify";

export default function AdminPage() { 
    const navigate = useNavigate();
    const { data: orders, isLoading, error } = useGetOrdersQuery();



return (
  <Container fluid className="admin-page-container">
    <Helmet>
      <title>Admin Dashboard</title>
    </Helmet>
    <Row>
      {/* Sidebar */}
      <Col md={2}>
        <Card className="border-0">
          <Card.Body>
            <Card.Title>Admin Info</Card.Title>
            {/* Add admin's info here */}
          </Card.Body>

          <ul className="list-group list-group-flush">
            {/* Sidebar menu items */}
            <li className="list-group-item">
              <Link to={`/revenue`}>Revenue</Link>
            </li>
            <li className="list-group-item">
              <Link to={`/orders`}>Order Management</Link>
            </li>
            <li className="list-group-item">
              <Link to={`/inventory`}>Inventory Management</Link>
            </li>
            {/* Add more menu items for other pages */}
          </ul>
        </Card>
      </Col>

      <Col fluid className="mt-3">
        <h1>Store Management Admin Dashboard</h1>

        <Row>
          <Col md={4} className="border-0" >
            <Card>
              <Card.Body>
                <Card.Title>Revenue Overview</Card.Title>
                <Card.Text>
                  Total Sales: A summary of the total sales over a specified
                  period. <br />
                  Sales Trends: Graphs or charts showing sales trends over time.{" "}
                  <br />
                  Average Order Value (AOV): The average amount customers spend
                  per order.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Sales</Card.Title>
                <Card.Text>
                  Sales Trends: Analyze sales data to identify trends and
                  seasonality, helping with stocking and promotions. <br />
                  Customer Purchase History: Understand what your customers are
                  buying to tailor promotions and marketing. <br />
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="border-0">
            <Card>
              <Card.Body>
                <Card.Title>Financial Overview</Card.Title>
                <Card.Text>
                  Profit and Loss: A summary of the financial performance of the
                  store. <br />
                  Expenses: Details on various expenses related to the business.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Card>
            <Card.Body>
              <Card.Title>Order Management</Card.Title>
              <Card.Text>
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
                    {isLoading ? (
                      <LoadingBox></LoadingBox>
                    ) : error ? (
                      <MessageBox variant="danger">
                        {getError(error as ApiError)}
                      </MessageBox>
                    ) : (
                      orders?.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>
                            {order.createdAt
                              ? order.createdAt.substring(0, 10)
                              : ""}
                          </td>
                          <td>{order.totalPrice ? order.totalPrice.toFixed(2) : ""}</td>
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
                                : "Yes"
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
                    )}
                  </tbody>
                </table>
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>

        <Row>
          <Card>
            <Row>
              <Col>
                <div>
                  <Card.Body>
                    <Card.Title>Reports</Card.Title>
                    <Card.Text>
                      <Row>
                        <Button className="mt-2 mb-2">
                          Generate Daily Report
                        </Button>
                      </Row>
                      <Row>
                        <Button className="mt-2 mb-2">
                          Generate Weekly Report
                        </Button>
                      </Row>
                      <Row>
                        <Button className="mt-2 mb-2">
                          Generate Monthly Report
                        </Button>
                      </Row>
                      <Row>
                        <Button className="mt-2 mb-2">
                          Generate Yearly Report
                        </Button>
                      </Row>
                    </Card.Text>
                  </Card.Body>
                </div>
              </Col>
              <Col>
                <div>
                  <Card.Body>
                    <Card.Title>Feedback and Reviews</Card.Title>
                    <Card.Text></Card.Text>
                  </Card.Body>
                </div>
              </Col>
            </Row>
          </Card>
        </Row>
      </Col>
    </Row>
  </Container>
);
}