import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useGetEmployeeAccountsQuery } from "../hooks/UserHooks";
import AdminSidebar from "../components/AdminSidebar";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../types/Utils";
import { ApiError } from "../types/ApiError";
import AccountCard from "../components/AccountCard";
import { UserInfo } from "../types/User";
import { useNewEmployeeMutation } from "../hooks/UserHooks";
import { toast } from "react-toastify";

const AccountManagement: React.FC = () => {
  const {
    data: AccountsInfo,
    isLoading: isAccountsLoading,
    error: AccountError,
    refetch
  } = useGetEmployeeAccountsQuery();

  const {
    mutateAsync: createAccountDetails,
    isLoading: isLoadingCreateAccount,
    error: AccountCreationError,
  } = useNewEmployeeMutation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')


  const toggleForm = () => setShowForm(!showForm);

  const handlePasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
  setPassword(e.target.value);
  // Clear the error message when the user starts typing again
  if (passwordError) setPasswordError('');
};

const handleConfirmPasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
  setConfirmPassword(e.target.value);
  // Clear the error message when the user starts typing again
  if (passwordError) setPasswordError('');
};

const validatePasswords = () => {
  if (password !== confirmPassword) {
    setPasswordError('Passwords do not match');
    return false;
  }
  return true;
};

const submitHandler = async (e: React.SyntheticEvent) => {
  e.preventDefault()
  
  try {
    await createAccountDetails({
      name,
      email,
      password,
      phone,
      role,
    })
  } catch (err) {
    toast.error(getError(err as ApiError))
  }
  toast.success("New User has successfully been created")
}

  return (
    <Container fluid className="admin-page-container">
      <Row>
        <Col md={2}>
          <AdminSidebar />
        </Col>
        <Col>
          <Row>
            <h1>Account Management</h1>
            {!showForm && (
              <Button variant="primary" onClick={toggleForm} className="NewUserButton">
                Create new User
              </Button>
            )}
            {showForm && (
              <Form onSubmit={submitHandler}>
                <Form.Group className="mt-2" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mt-2" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mt-2" controlId="formPassword">
                  <Form.Label>Password </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={validatePasswords} // Add this to validate when the field loses focus
                  />
                </Form.Group>

                <Form.Group className="mt-2" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={validatePasswords} // Add this to validate when the field loses focus
                  />
                </Form.Group>

                <Form.Group className="mt-2" controlId="formPhoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>

                <Form.Group className="mt-2 mb-2" controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    required
                    onChange={(e) => setRole(e.target.value)} 
                    value={role} 
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Employee">Employee</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Cashier">Cashier</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={passwordError !== ""}
                >
                  Submit
                </Button>
                <span> |{passwordError ? passwordError : null}| </span>
                <Button variant="primary" onClick={toggleForm}>
                  Cancel
                </Button>
              </Form>
            )}
            {/* Ensure AccountCard is updated to accept UserInfo if necessary */}
          </Row>
          <Row className="mt-5">
            {isAccountsLoading || isLoadingCreateAccount ? (
              <>
                <LoadingBox /> <div>Loading Accounts...</div>
              </>
            ) : AccountError || AccountCreationError ? (
              <>
                <MessageBox variant="danger">
                  {getError(AccountError as ApiError)}
                  {getError(AccountCreationError as ApiError)}
                </MessageBox>
              </>
            ) : AccountsInfo ? (
              <div className="flex-space-evenly">
                {AccountsInfo?.map((account: UserInfo) => (
                  <AccountCard key={account._id} accountData={account} onUpdateSuccess={refetch} />
                ))}
              </div>
            ) : null}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AccountManagement;
