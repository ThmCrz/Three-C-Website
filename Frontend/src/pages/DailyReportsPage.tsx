import { useState } from 'react';
import { Order } from '../types/Order';
import { useGetOrdersQuery } from "../hooks/OrderHooks";
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
// import LoadingBox from '../components/LoadingBox';
// import MessageBox from '../components/MessageBox';
// import { getError } from '../types/Utils';
// import { ApiError } from '../types/ApiError';
import { useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cartItem } from '../types/Cart';
import AdminSidebar from '../components/AdminSidebar';



export default function DailyReportsPage() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [uniqueItems, setUniqueItems] = useState<cartItem[]>([]);

 const handleDateChange = (dates: [Date | null, Date | null]) => {
  const [start, end] = dates;

  // Set the time of startDate to 00:00:00
  if (start) {
    start.setHours(0, 0, 0, 0);
  }

  // Set the time of endDate to 23:59:59
  if (end) {
    end.setHours(23, 59, 59, 999);
  }

  setStartDate(start);
  setEndDate(end);
};

  const uniqueOrderItems = (filteredOrders: Order[]): cartItem[] => {
  const allItems = filteredOrders.flatMap((filteredOrders) => filteredOrders.orderItems);
  const uniqueItems = allItems.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.name === item.name);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as cartItem[]);

  return uniqueItems;
};
  
  
  useEffect(() => {
  const filterOrders = (orders: Order[]) => {
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        startDate !== null &&
        endDate !== null &&
        orderDate >= startDate &&
        orderDate <= endDate
      );
    });
    return filteredOrders;
  };

  if (!isLoading && !error && orders) {
    const filtered = filterOrders(orders);
    setFilteredOrders(filtered); // Update filteredOrders state
  }

  if (filteredOrders.length !== 0) {
  const orderedItems = uniqueOrderItems(filteredOrders);
  setUniqueItems(orderedItems);
} else {
  setUniqueItems([]); // Clear the uniqueItems state
}
}, [isLoading, orders, error, startDate, endDate, filteredOrders, uniqueItems]);

  
  


  return (
    <Container fluid className="admin-page-container">
      <Helmet>
        <title>Reports Page</title>
      </Helmet>
      <Row>
          <AdminSidebar/>
        <Col>
        <h2 className="hide-on-print">Date to Reports</h2>
      <div className="hide-on-print">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
        />
      </div>
      <Table>
      <thead>
        <tr>
          <th>Date Range</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}</td>
        </tr>
      </tbody>
      <br />
      <h3>Items Ordered By Customers</h3>
    </Table>
    {/* ... */}
    {uniqueItems.length > 0 ? (
      <Table striped bordered>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Items Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {uniqueItems.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <p>No orders found.</p>
    )}
    {/* ... */}
        </Col>
      </Row>
      
  </Container>
  );
}