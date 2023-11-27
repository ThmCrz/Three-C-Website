import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useGetOrdersQuery } from "../hooks/OrderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { Store } from "../Store";
import { useContext, useEffect } from "react";
import Chart from 'chart.js/auto';

// import { useAccountDetailsMutation } from "../hooks/UserHooks";
// import { toast } from "react-toastify";

export default function AdminPage() { 

  const {
    state: {
      userInfo,
    },
  } = useContext(Store);

    const navigate = useNavigate();
    const { data: orders, isLoading, error } = useGetOrdersQuery();

    useEffect(() => {
      // Get the canvas elements
      const lineCanvas = document.getElementById('lineChart') as HTMLCanvasElement;
      const barCanvas = document.getElementById('barChart') as HTMLCanvasElement;
      const dougnutCanvas = document.getElementById('doughnutChart') as HTMLCanvasElement;
    
      if (lineCanvas && barCanvas && dougnutCanvas) {
        // Create new chart instances
        const colors = ['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'pink'];
        const lineChart = new Chart(lineCanvas, {
          type: "line",
          data: {
            labels: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            datasets: [
              {
                label: "Total Revenue",
                data: [4112, 3235, 5623, 5235, 6533, 0, 0],
                borderColor: colors,
                backgroundColor: colors,
                fill: false,
                pointStyle: "circle",
                pointRadius: 10,
                pointHoverRadius: 15,
              },
            ],
          },
          options: {
            responsive: true, // Set responsive to true
            maintainAspectRatio: false, // Set maintainAspectRatio to true
          },
        });
        
        const barChart = new Chart(barCanvas, {
          type: 'bar',
          data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [
              {
                label: 'Total Sales',
                data: [50, 23, 60, 46, 12, 0, 0],
                backgroundColor: colors,
              },
            ],
          },
          options: {
            responsive: true, // Set responsive to true
            maintainAspectRatio: false, // Set maintainAspectRatio to true
          },
        });
        
        const doughnutChart = new Chart(dougnutCanvas, {
          type: 'doughnut',
          data: {
            labels: ["Profit", "Loss", "Expense"],
            datasets: [
              {
                label: 'Pesos',
                data: [6134, 2645, 5455],
                backgroundColor: ['green', 'red', 'yellow'],
              },
            ],
          },
          options: {
            responsive: true, // Set responsive to true
            maintainAspectRatio: false, // Set maintainAspectRatio to true
          },
        });

    
        // Update the charts when the component re-renders
        lineChart.update();
        barChart.update();
        doughnutChart.update();
        
        // Clean up the charts when the component unmounts
        return () => {
          lineChart.destroy();
          barChart.destroy();
          doughnutChart.destroy();
        };
      }
    }, []);


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
            <Card.Title>
              <div className="mb-2">Administrator:</div>
              {userInfo.name}
            </Card.Title>
            {/* Add admin's info here */}
          </Card.Body>

          <ul className="list-group list-group-flush">
            {/* Sidebar menu items */}
            <li className="list-group-item"></li>
            <li className="list-group-item">
              <Link to={`/adminPage`}>Order Management</Link>
            </li>
            <li className="list-group-item">
              <Link to={`/InventoryManagementPage`}>Inventory Management</Link>
            </li>
            <li className="list-group-item"></li>
            {/* Add more menu items for other pages */}
          </ul>
        </Card>
      </Col>

      <Col fluid className="mt-3">
        <h1>Store Management Admin Dashboard</h1>

        <Row className="mt-5">
          <Col md={4} className="border-0 equal-height-column">
            <Card>
              <Card.Body>
                <Card.Title>Revenue Overview</Card.Title>
                <canvas id="lineChart" className="chart-container"></canvas>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className=" equal-height-column">
            <Card>
              <Card.Body>
                <Card.Title>Sales</Card.Title>
                <canvas id="barChart" className="chart-container"></canvas>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="border-0 equal-height-column">
            <Card>
              <Card.Body>
                <Card.Title>Financial Overview</Card.Title>
                <Card.Text>
                  <canvas id="doughnutChart" className="chart-container"></canvas>
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
                          <td>
                            {order.totalPrice
                              ? order.totalPrice.toFixed(2)
                              : ""}
                          </td>
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
                                navigate(`/OrderManagementPage/${order._id}`);
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

        <Row className="mt-3">
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
                    <table className="table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Feedback</th>
                          <th>Review</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Map over the data and render each row */}
                        {isLoading ? (
                          <LoadingBox></LoadingBox>
                        ) : error ? (
                          <MessageBox variant="danger">
                            {getError(error as ApiError)}
                          </MessageBox>
                        ) : (
                          orders?.map((order) => (
                            <tr key={order._id}>
                              <td>dadfa</td>
                              <td>asdfasdf</td>
                              <td>asdfasdf</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
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