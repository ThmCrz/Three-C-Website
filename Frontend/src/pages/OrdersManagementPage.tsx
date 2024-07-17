import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { useGetOrdersQuery } from "../hooks/OrderHooks";
import OrdersCard from "../components/OrderCard";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useNavigate } from "react-router-dom";


export default function OrdersManagementPage() {

    const { data: orders, isLoading, error } = useGetOrdersQuery();
    const [ orderStatus, setOrderStatus ] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();


    const filteredOrder = orders?.filter((order) => {
      if (!searchTerm) {
        return false; // Show nothing if searchTerm is empty
      }
    
      const searchTermLower = searchTerm.toLowerCase();
      // Combine all match conditions using logical AND (&&)
      return order._id.toLowerCase().includes(searchTermLower) &&
             order.user.toLowerCase().includes(searchTermLower);
    });

    if (!orders) {
        return null; // Render an empty element when orders is undefined
      }

    return (
      <Container fluid className="admin-page-container">
        <Col>
          <Row>
            <AdminSidebar />
            <h2 className="hide-on-print">Orders Management</h2>
            <Row>
              <div className="input-container">
                <input
                  className="input"
                  id="SearchTableInput"
                  type="text"
                  placeholder="Search Order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="icon3">
                  <svg
                    width="19px"
                    height="19px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        opacity="1"
                        d="M14 5H20"
                        stroke="#000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        opacity="1"
                        d="M14 8H17"
                        stroke="#000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                        stroke="#000"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        opacity="1"
                        d="M22 22L20 20"
                        stroke="#000"
                        stroke-width="3.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </span>
              </div>

              {filteredOrder?.length === 0 ? (
                null
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>DATE</th>
                      <th>TOTAL</th>
                      <th>PAYMENT METHOD</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrder?.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>
                          {order.createdAt
                            ? order.createdAt.substring(0, 10)
                            : ""}
                        </td>
                        <td>
                          ₱{order.totalPrice ? order.totalPrice.toFixed(2) : ""}
                        </td>
                        <td>{order.paymentMethod}</td>
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
              )}
            </Row>

            <Row>
              <Col className="hide-on-print" md={3}>
                <Card className="border-0">
                  <Card.Body>
                    <Card.Title>
                      <div className="mb-2">Orders Management Menu:</div>
                    </Card.Title>
                    {/* Add admin's info here */}
                  </Card.Body>

                  <ul className="list-group list-group-flush">
                    {/* Sidebar menu items */}

                    <li
                      className={`list-group-item Sidebar-menu ${
                        orderStatus === 1 ? "active" : ""
                      }`}
                      onClick={() => {
                        setOrderStatus(1);
                      }}
                    >
                      <Badge pill bg="danger">
                        {orders.filter((order) => order.status === 1).length}
                      </Badge>{" "}
                      Unconfirmed Orders
                    </li>
                    <li
                      className={`list-group-item Sidebar-menu ${
                        orderStatus === 2 ? "active" : ""
                      }`}
                      onClick={() => {
                        setOrderStatus(2);
                      }}
                    >
                      <Badge pill bg="danger">
                        {orders.filter((order) => order.status === 2).length}
                      </Badge>{" "}
                      Confirmed Orders
                    </li>
                    <li
                      className={`list-group-item Sidebar-menu ${
                        orderStatus === 3 ? "active" : ""
                      }`}
                      onClick={() => {
                        setOrderStatus(3);
                      }}
                    >
                      <Badge pill bg="danger">
                        {orders.filter((order) => order.status === 3).length}
                      </Badge>{" "}
                      Prepared Orders{" "}
                    </li>
                    <li
                      className={`list-group-item Sidebar-menu ${
                        orderStatus === 4 ? "active" : ""
                      }`}
                      onClick={() => {
                        setOrderStatus(4);
                      }}
                    >
                      <Badge pill bg="danger">
                        {orders.filter((order) => order.status === 4).length}
                      </Badge>{" "}
                      Out for Delivery Orders{" "}
                    </li>
                    <li
                      className={`list-group-item Sidebar-menu ${
                        orderStatus === 5 ? "active" : ""
                      }`}
                      onClick={() => {
                        setOrderStatus(5);
                      }}
                    >
                      <Badge pill bg="danger">
                        {orders.filter((order) => order.status === 5).length}
                      </Badge>{" "}
                      Completed Orders{" "}
                    </li>
                    <li
                      className={`list-group-item Sidebar-menu ${
                        orderStatus === -1 ? "active" : ""
                      }`}
                      onClick={() => {
                        setOrderStatus(-1);
                      }}
                    >
                      <Badge pill bg="danger">
                        {orders.filter((order) => order.status === -1).length}
                      </Badge>{" "}
                      Cancelled Orders{" "}
                    </li>
                    {/* Add more menu items for other pages */}
                  </ul>
                </Card>
              </Col>

              <Col>
                <div>
                  <Helmet>
                    <title>Orders Management Dashboard</title>
                  </Helmet>
                  {isLoading ? (
                    <LoadingBox />
                  ) : error ? (
                    <MessageBox variant="danger">
                      {getError(error as ApiError)}
                    </MessageBox>
                  ) : (
                    <div>
                      <Col className="equal-height-column">
                        <OrdersCard
                          status={orderStatus}
                          orders={orders.filter(
                            (order) => order.status === orderStatus
                          )}
                        />
                      </Col>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Row>
        </Col>
      </Container>
    );
    }

