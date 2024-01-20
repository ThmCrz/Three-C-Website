import { Row, Col, Card, Button, Container, Badge } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useGetOrdersQuery } from "../hooks/OrderHooks";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import AdminSidebar from "../components/AdminSidebar";
import { Nav } from "react-bootstrap";
import { Order } from "../types/Order";
import OrdersCard from "../components/OrderCard";

// import { useAccountDetailsMutation } from "../hooks/UserHooks";
// import { toast } from "react-toastify";

export default function AdminPage() {

  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [weeklyOrders, setWeeklyOrders] = useState<number[]>([]);
  const [DailyTotal, setDailyTotal] = useState<number[]>([]);
  const [ orderStatus, setOrderStatus ] = useState(1);


  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

 const calculateWeeklyOrders = (orders: Order[]) => {
  const currentDate = new Date();
  const currentWeekStart = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate() - (currentDate.getDay() + 6) % 7
);

  const weeklyOrders = Array(7).fill(0);
  const dailyTotal = Array(7).fill(0); // New array to store the daily total prices

 orders.forEach((order) => {
  if (order.status === 2 || order.status === 3 || order.status === 4 || order.status === 5) {
    const orderDate = new Date(order.createdAt);
    if (orderDate >= currentWeekStart && orderDate <= currentDate) {
      const dayIndex = orderDate.getDay();
      weeklyOrders[dayIndex]++;
      dailyTotal[dayIndex] += order.totalPrice;
    }
  }
});


  setWeeklyOrders(weeklyOrders);
  setDailyTotal(dailyTotal);// Set the new state for the array of daily total prices
};

  useEffect(() => {
  if (!isLoading && !error && orders) {
    calculateWeeklyOrders(orders);
  }
}, [isLoading, orders, error]);


  

  const [activeChart, setActiveChart] = useState<string>("lineChart");
  const RevenueData = DailyTotal;
  const SalesData = weeklyOrders;
  const FinancialData = [50000, 28000, 22000];
  

  const LineChart = () => {
    
    useEffect(() => {
      const colors = ["blue", "green", "red", "yellow", "orange", "purple", "pink"];
      const lineCanvas = document.getElementById("lineChart") as HTMLCanvasElement;
  
      if (lineCanvas) {
        const lineChart = new Chart(lineCanvas, {
          type: "line",
          data: {
            labels: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            datasets: [
              {
                label: "Total Revenue",
                data: RevenueData,
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
            responsive: true,
            maintainAspectRatio: false,
          },
        });
  
        return () => {
          lineChart.destroy();
        };
      }
    }, []);
  
    return <canvas id="lineChart" className="chart-container"></canvas>;
  };
  
  const BarChart = () => {
    
    useEffect(() => {
      const colors = ["blue", "green", "red", "yellow", "orange", "purple", "pink"];
      const barCanvas = document.getElementById("barChart") as HTMLCanvasElement;
  
      if (barCanvas) {
        const barChart = new Chart(barCanvas, {
          type: "bar",
          data: {
            labels: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            datasets: [
              {
                label: "Total Sales",
                data: SalesData,
                backgroundColor: colors,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
  
        return () => {
          barChart.destroy();
        };
      }
    }, []);
  
    return <canvas id="barChart" className="chart-container"></canvas>;
  };
  
  const DoughnutChart = () => {
    useEffect(() => {
      const doughnutCanvas = document.getElementById(
        "doughnutChart"
      ) as HTMLCanvasElement;
  
      if (doughnutCanvas) {
        const doughnutChart = new Chart(doughnutCanvas, {
          type: "doughnut",
          data: {
            labels: ["Profit", "Loss", "Expense"],
            datasets: [
              {
                label: "Pesos",
                data: FinancialData,
                backgroundColor: ["green", "red", "yellow"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
  
        return () => {
          doughnutChart.destroy();
        };
      }
    }, []);
  
    return <canvas id="doughnutChart" className="chart-container"></canvas>;
  };
  

  return (
    <Container fluid className="admin-page-container">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <Row>
        {/* Sidebar */}
        <Col md={2}>
          <AdminSidebar />
        </Col>

        <Col fluid className="mt-3">
          <h1>Store Management Admin Dashboard</h1>

          <Row className="mt-5">
            <Nav variant="tabs" className="mt-3">
              <Nav.Item>
                <Nav.Link
                  eventKey="lineChart"
                  active={activeChart === "lineChart"}
                  onClick={() => setActiveChart("lineChart")}
                >
                  Revenue Overview
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="barChart"
                  active={activeChart === "barChart"}
                  onClick={() => setActiveChart("barChart")}
                >
                  Sales Overview
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="doughnutChart"
                  active={activeChart === "doughnutChart"}
                  onClick={() => setActiveChart("doughnutChart")}
                >
                  Financial Overview
                </Nav.Link>
              </Nav.Item>
            </Nav>
            {activeChart === "lineChart" && (
              <Col md={12} className="border-0 equal-height-column">
                <Card>
                  <Card.Body>
                    <Card.Title>Revenue Overview</Card.Title>
                    <LineChart />
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RevenueData.map((revenue, index) => (
                          <tr key={index}>
                            <td>
                              {
                                [
                                  "Sunday",
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                ][index]
                              }
                            </td>
                            <td>{revenue.toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr>
                          <td>Total</td>
                          <td>
                            {RevenueData.reduce((a, b) => a + b, 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Card.Body>
                </Card>
              </Col>
            )}

            {activeChart === "barChart" && (
              <Col md={12} className="border-0 equal-height-column">
                <Card>
                  <Card.Body>
                    <Card.Title>Sales Overview</Card.Title>
                    <BarChart />
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Sales</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SalesData.map((revenue, index) => (
                          <tr key={index}>
                            <td>
                              {
                                [
                                  "Sunday",
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                ][index]
                              }
                            </td>
                            <td>{revenue}</td>
                          </tr>
                        ))}
                        <tr>
                          <td>Total</td>
                          <td>{SalesData.reduce((a, b) => a + b, 0)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Card.Body>
                </Card>
              </Col>
            )}
            {activeChart === "doughnutChart" && (
              <Col md={12} className="border-0 equal-height-column">
                <Card>
                  <Card.Body>
                    <Card.Title>Financial Overview</Card.Title>
                    <Card.Text>
                      <DoughnutChart />
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Financial</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {FinancialData.map((revenue, index) => (
                            <tr key={index}>
                              <td>{["Profit", "Expenses", "Loses"][index]}</td>
                              <td>{revenue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>

          <Row className="mt-3">
            <Card>
              <Card.Body>
                <Card.Title>Weekly Orders History</Card.Title>
                <Card.Text>
                  {orders ? (
                    <Nav variant="tabs" className="mt-3">
                      <Nav.Link
                        className={`Sidebar-menu ${
                          orderStatus === 1 ? "active" : ""
                        }`}
                        onClick={() => {
                          setOrderStatus(1);
                        }}
                      >
                        Unconfirmed Orders{" "}
                        <Badge pill bg="danger">
                          {
                            orders
                              .filter((order) => order.status === 1)
                              .filter((order) => {
                                const orderDate = new Date(order.createdAt);
                                return orderDate >= startOfWeek;
                              }).length
                          }
                        </Badge>
                      </Nav.Link>
                      <Nav.Link
                        className={`Sidebar-menu ${
                          orderStatus === 2 ? "active" : ""
                        }`}
                        onClick={() => {
                          setOrderStatus(2);
                        }}
                      >
                        Confirmed Orders{" "}
                        <Badge pill bg="danger">
                          {
                            orders
                              .filter((order) => order.status === 2)
                              .filter((order) => {
                                const orderDate = new Date(order.createdAt);
                                return orderDate >= startOfWeek;
                              }).length
                          }
                        </Badge>
                      </Nav.Link>
                      <Nav.Link
                        className={`Sidebar-menu ${
                          orderStatus === 3 ? "active" : ""
                        }`}
                        onClick={() => {
                          setOrderStatus(3);
                        }}
                      >
                        Prepared Orders{" "}
                        <Badge pill bg="danger">
                          {
                            orders
                              .filter((order) => order.status === 3)
                              .filter((order) => {
                                const orderDate = new Date(order.createdAt);
                                return orderDate >= startOfWeek;
                              }).length
                          }
                        </Badge>
                      </Nav.Link>
                      <Nav.Link
                        className={`Sidebar-menu ${
                          orderStatus === 4 ? "active" : ""
                        }`}
                        onClick={() => {
                          setOrderStatus(4);
                        }}
                      >
                        Out for Delivery Orders{" "}
                        <Badge pill bg="danger">
                          {
                            orders
                              .filter((order) => order.status === 4)
                              .filter((order) => {
                                const orderDate = new Date(order.createdAt);
                                return orderDate >= startOfWeek;
                              }).length
                          }
                        </Badge>
                      </Nav.Link>
                      <Nav.Link
                        className={`Sidebar-menu ${
                          orderStatus === 5 ? "active" : ""
                        }`}
                        onClick={() => {
                          setOrderStatus(5);
                        }}
                      >
                        Completed Orders{" "}
                        <Badge pill bg="danger">
                          {
                            orders
                              .filter((order) => order.status === 5)
                              .filter((order) => {
                                const orderDate = new Date(order.createdAt);
                                return orderDate >= startOfWeek;
                              }).length
                          }
                        </Badge>
                      </Nav.Link>
                      <Nav.Link
                        className={`Sidebar-menu ${
                          orderStatus === -1 ? "active" : ""
                        }`}
                        onClick={() => {
                          setOrderStatus(-1);
                        }}
                      >
                        Cancelled Orders{" "}
                        <Badge pill bg="danger">
                          {
                            orders
                              .filter((order) => order.status === -1)
                              .filter((order) => {
                                const orderDate = new Date(order.createdAt);
                                return orderDate >= startOfWeek;
                              }).length
                          }
                        </Badge>
                      </Nav.Link>
                    </Nav>
                  ) : (
                    ""
                  )}

                  {isLoading ? (
                    <LoadingBox></LoadingBox>
                  ) : error ? (
                    <MessageBox variant="danger">
                      {getError(error as ApiError)}
                    </MessageBox>
                  ) : orders ? (
                    <OrdersCard
                      status={orderStatus}
                      orders={orders
                        .filter((order) => order.status === orderStatus)
                        .filter((order) => {
                          const orderDate = new Date(order.createdAt);
                          return orderDate >= startOfWeek;
                        })}
                    />
                  ) : (
                    ""
                  )}
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
                                <td>{order.user}</td>
                                <td>{order.status}</td>
                                <td>{order.paymentMethod}</td>
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
