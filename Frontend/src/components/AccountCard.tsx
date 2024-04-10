import React, { useState } from 'react';
import { UserInfo } from '../types/User';
import Card from 'react-bootstrap/Card'; // Import Card from react-bootstrap
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ApiError } from '../types/ApiError';
import { getError } from '../types/Utils';
import { useEmployeeAccountDetailsMutation } from '../hooks/UserHooks';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';

type AccountDisplayProps = {
  accountData: UserInfo;
  onUpdateSuccess: () => void; 
};


const AccountCard: React.FC<AccountDisplayProps> = ({ accountData, onUpdateSuccess }) => {
  
  const [isEditingEmployeeDetails, setisEditingEmployeeDetails] = useState(false);
  const [name, setName] = useState(accountData.name);
  const [email, setEmail] = useState(accountData.email);
  const [phone, setPhone] = useState(accountData.phone);
  const [role, setRole] = useState(accountData.role);
  const _id = accountData._id;

  const {
    mutateAsync: UpdateAccountDetails,
    isLoading: isAccountDetailsLoading,
    error: updateAccountDetailsError,
  } = useEmployeeAccountDetailsMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
  e.preventDefault();
  
  try {
    await UpdateAccountDetails({
      _id,
      name,
      email,
      phone,
      role,
    });
    toast.success("User Details Updated");
    setisEditingEmployeeDetails(false);
    onUpdateSuccess(); // Call the function passed from the parent component
  } catch (err) {
    toast.error(getError(err as ApiError));
  }
};
  
  return (
    <>
    {isAccountDetailsLoading ? (
      <LoadingBox />
    ) : updateAccountDetailsError ? (
      <MessageBox variant="danger">{getError(updateAccountDetailsError as ApiError)}</MessageBox>
    ):(
<Card className="Card AccountCard">
        <Card.Body>
          <Card.Title>{accountData.name}</Card.Title>
          <Card.Text>
            Email: <br /> {accountData.email}
          </Card.Text>
          <Card.Text>
            Phone: <br /> {accountData.phone}
          </Card.Text>
          <Card.Text>
            Role: <br />
            {accountData.role}
          </Card.Text>
          {!isEditingEmployeeDetails ? (
            <Button
              className="NewUserButton"
              onClick={() => setisEditingEmployeeDetails(true)}
            >
              Edit
            </Button>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group className="mt-2" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  
                />
              </Form.Group>

              <Form.Group className="mt-2" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  
                />
              </Form.Group>

              <Form.Group className="mt-2" controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  
                />
              </Form.Group>

              <Form.Group className="mt-2 mb-2" controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  
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

              <Button  className="NewUserButton" variant="primary" type="submit">
                Submit
              </Button>
              <Button
               className="NewUserButton"
                variant="primary"
                onClick={() => setisEditingEmployeeDetails(false)}
              >
                Cancel
              </Button>
            </Form>
          )}
          {/* <Button className="NewUserButton" onClick={deleteHandler} disabled={isDeleting}>{isDeleting? ("Removing..."):("Remove Product")}</Button> */}
        </Card.Body>
      </Card>
    )
    }
      
    </>
  );
};

export default AccountCard;