import React, { useState } from "react";
import { UserInfo } from "../types/User";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import { useEmployeeAccountDetailsMutation } from "../hooks/UserHooks";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";

type AccountDisplayProps = {
  accountData: UserInfo;
  onUpdateSuccess: () => void;
};

const AccountCard: React.FC<AccountDisplayProps> = ({
  accountData,
  onUpdateSuccess,
}) => {
  const [isEditingEmployeeDetails, setIsEditingEmployeeDetails] = useState(false);
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
      setIsEditingEmployeeDetails(false);
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
        <MessageBox variant="danger">
          {getError(updateAccountDetailsError as ApiError)}
        </MessageBox>
      ) : (
        <tr>
        <td>{accountData._id}</td>
        <td>{accountData.name}</td>
        <td>{accountData.email}</td>
        <td>{accountData.phone}</td>
        <td>{accountData.role}</td>
        <td>{!isEditingEmployeeDetails ? (
          <>
          <Button
          className=""
          variant="success"
          onClick={() => setIsEditingEmployeeDetails(true)}
          >
              Edit
            </Button>
            <span> || </span>
          <Button
          className=""
          variant="danger"
          onClick={() => setIsEditingEmployeeDetails(true)}
          >
              Delete
            </Button>
            </>
          ) : (
            <Modal show={isEditingEmployeeDetails} onHide={() => setIsEditingEmployeeDetails(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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

              <Button variant="success" type="submit">
                Submit
              </Button>
              <span> || </span>
              <Button variant="danger" onClick={() => setIsEditingEmployeeDetails(false)}>
                Cancel
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
          )}</td>
          </tr>
      )}
    </>
  );
};

export default AccountCard;
