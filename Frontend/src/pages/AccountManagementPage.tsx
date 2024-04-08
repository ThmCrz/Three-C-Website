import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
// import { UserInfo } from '../types/User'; // Ensure this path is correct
import AdminSidebar from '../components/AdminSidebar';

const AccountManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  return (
    <Container fluid className="admin-page-container">
    <Row>
        <Col md={2}>
          <AdminSidebar />
        </Col>
    <Col>
      <h1>Account Management</h1>
      {!showForm && (
        <Button variant="primary" onClick={toggleForm}>
          Create new User
        </Button>
      )}
      {showForm && (
        <Form>
  <Form.Group controlId="formUsername">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" placeholder="Enter username" />
  </Form.Group>

  <Form.Group controlId="formEmail">
    <Form.Label>Email</Form.Label>
    <Form.Control type="email" placeholder="Enter email" />
  </Form.Group>

  <Form.Group controlId="formPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" placeholder="Password" />
  </Form.Group>

  <Form.Group controlId="formConfirmPassword">
    <Form.Label>Confirm Password</Form.Label>
    <Form.Control type="password" placeholder="Confirm Password" />
  </Form.Group>

  <Form.Group controlId="formRole" className='mb-2'>
    <Form.Label>Role</Form.Label>
    <Form.Select>
      <option>Select Role</option>
      <option value="admin">Admin</option>
      <option value="user">Employee</option>
      <option value="guest">Delivery</option>
      <option value="guest">Cashier</option>
    </Form.Select>
  </Form.Group>

  <Button variant="primary" type="submit">Submit</Button>
  <span> || </span>
  <Button variant="primary" onClick={toggleForm}>Cancel</Button>
</Form>
      )}
      {/* Ensure AccountCard is updated to accept UserInfo if necessary */}
    </Col>
    </Row>
    </Container>
  );
};

export default AccountManagement;