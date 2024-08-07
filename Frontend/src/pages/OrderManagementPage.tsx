/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Row, Col, Card, ListGroup, Button, Table, Modal, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { ApiError } from "../types/ApiError";
import { getError } from "../types/Utils";
import {
  useOrderDeliveredMutation,
  useGetOrderDetailsQuery,
  useOrderStatusMutation,
  useCancelOrderStatusMutation,
  useOrderOfficialReceiptNumberMutation,
} from "../hooks/OrderHooks";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { useReAddQuantityFromOrderMutation } from "../hooks/ProductHooks";
import { Store } from "../Store";
import { useContext, useState } from "react";

export default function OrderManagementPage() {
  const {
    state: {
      userInfo,
    },
  } = useContext(Store);
  
  const params = useParams();
  const { id: orderId } = params;

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId!);

  const [ orderOfficialReceiptNumber, setOrderOfficialReceiptNumber] = useState(order?.officialReceiptNumber);
  const [ showPrintOfficialReceiptInputModal, setShowPrintOfficialReceiptInputModal] = useState(false);
  const [ showPrintOfficialReceiptCheckModal, setShowPrintOfficialReceiptCheckModal] = useState(false);

  const { mutateAsync: cancelOrderStatus, isLoading: cancellingOrder } = useCancelOrderStatusMutation();
  const { mutateAsync: updateStatus } = useOrderStatusMutation();
  const { mutateAsync: completeOrder } = useOrderDeliveredMutation();
  const { mutateAsync: updateProductCountInStock } = useReAddQuantityFromOrderMutation();
  const { mutateAsync: updateOrderOfficialReceiptNumber, isLoading: SavingOfficialRecieptNumber } = useOrderOfficialReceiptNumberMutation();

  const cancelOrderHandler = async () => {
    try {
      await cancelOrderStatus(orderId!);
      await updateProductCountInStock({ orderItems: order!.orderItems });
      refetch();
      toast.success("Order Cancelled");
    } catch (error) {
      toast.error(`${error as ApiError}`);
    }
  };

  const updateStatusHandler = async () => {
    try {
      await updateStatus(orderId!);
      refetch();
      toast.success("status updated");
    } catch (error) {
      toast.error(`${error as ApiError}`);
    }
  };

  const completeOrderHandler = async () => {
    try {
      await completeOrder(orderId!);
      refetch();
      toast.success("Order Completed");
    } catch (error) {
      toast.error(`${error as ApiError}`);
    }
  };

  const printOfficialReceipt = async () => {
    if (!orderId){ 
      toast.error("Order Id not found");
      return;
    }else if (!orderOfficialReceiptNumber){
      toast.error("Official receipt Code or Number Not Found");
      return;
    }else if(orderOfficialReceiptNumber === ''){      
      toast.error("Please Enter an Official receipt Code or Number");
      return;
    }else{
      try {
        await updateOrderOfficialReceiptNumber({id: orderId, officialReceiptNumber: orderOfficialReceiptNumber});
        toast.success('Update Official Receipt Number Successful');
        setShowPrintOfficialReceiptCheckModal(false);
        refetch();
        setTimeout(() => {
          print();
        }, 1000);
      } catch (error) {
        toast.error(`${error as ApiError}`);
      }
    }
    } 
  

  return isLoading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : !order ? (
    <MessageBox variant="danger">Order Not Found</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h2 className="mt-5">Order {orderId}</h2>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body className="0">
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong>
                <br />
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </Card.Text>
              <div className="mx-auto d-flex justify-content-center align-items-center">
                {userInfo.isAdmin ? (
                  <>
                    <Button
                      variant="danger"
                      onClick={cancelOrderHandler}
                      className="mx-2 display-flex-column hide-on-print" 
                      disabled={order.status !== 1 || cancellingOrder}
                    >
                      Cancel Order
                      {cancellingOrder ? <LoadingBox/>:null}
                    </Button>
                    <FaArrowLeft className="hide-on-print" />
                    <Button
                      onClick={updateStatusHandler}
                      variant="success"
                      className="mx-2 hide-on-print"
                      disabled={order.status !== 1}
                    >
                      Confirm Order
                    </Button>
                    <FaArrowRight className="hide-on-print" />
                    {order.paymentMethod === "Cash On Delivery" ? (
                      <Button
                        variant="primary"
                        onClick={updateStatusHandler}
                        className="mx-2 hide-on-print"
                        disabled={order.status !== 2}
                      >
                        Order Prepared
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={updateStatusHandler}
                        className="mx-2 hide-on-print"
                        disabled={order.status !== 2 || !order.isPaid}
                      >
                        {!order.isPaid ? (
                          <div>
                            Order Prepared <br /> (waiting for payment)
                          </div>
                        ) : (
                          "Order Prepared"
                        )}
                      </Button>
                    )}

                    <FaArrowRight className="hide-on-print" />
                    <Button
                      variant="warning"
                      onClick={updateStatusHandler}
                      className="mx-2 hide-on-print"
                      disabled={order.status !== 3}
                    >
                      Order out for Delivery
                    </Button>
                    <FaArrowRight className="hide-on-print" />
                  </>
                ) : null}

                {order.paymentMethod === "Cash On Delivery" ? (
                  <Button
                    variant="success"
                    onClick={completeOrderHandler}
                    className="mx-2 hide-on-print"
                    disabled={order.status !== 4}
                  >
                    Order Delivered And Paid
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={completeOrderHandler}
                    className="mx-2 hide-on-print"
                    disabled={order.status !== 4}
                  >
                    Order Delivered
                  </Button>
                )}
              </div>
              {order.status === -1 ? (
                <div className="mt-3 mb-0 hide-on-print">
                  <MessageBox variant="danger">
                    Order has been Canceled By [Manager] {userInfo.name}
                  </MessageBox>
                </div>
              ) : order.status === 5 ? (
                <div className="mt-3 mb-0 hide-on-print">
                  <MessageBox variant="success">
                    Order has been Delivered, Delivered At: {order.deliveredAt}
                  </MessageBox>
                </div>
              ) : (
                ""
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body className="pb-0">
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.status === -1 ? (
                <MessageBox className="hide-on-print" variant="danger">
                  Order has been Canceled By [Manager] {userInfo.name}
                </MessageBox>
              ) : order.isPaid ? (
                <MessageBox className="hide-on-print" variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox className="hide-on-print" variant="warning">
                  Not Paid
                </MessageBox>
              )}
            </Card.Body>
          </Card>

          <Table
            className="text-center show-on-print"
            striped
            bordered
            hover
            size="sm"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₱{item.price}</td>
                  <td>₱{item.quantity * item.price}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>Grand Total</td>
                <td>₱{order.totalPrice.toFixed(2)}</td>
              </tr>
            </tfoot>
          </Table>

          <Card className="mb-3 hide-on-print">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="mx-auto d-flex align-items-center order-image"
                        ></img>{" "}
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>₱{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 white-BG">
            <Card.Body>
              <Card.Title>
                <div className="hide-on-print">
                  {order.officialReceiptNumber !== "" ? (
                    <p>ORN: {order.officialReceiptNumber}</p>
                  ) : (
                    <p className="red">Official Receipt not Found</p>
                  )}
                </div>{" "}
                Order Summary
              </Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="white-BG">
                  <Row className="white-BG">
                    <Col className="white-BG">Items</Col>
                    <Col className="white-BG">
                      ₱{order.itemsPrice.toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="white-BG">
                  <Row className="white-BG">
                    <Col className="white-BG">Shipping</Col>
                    <Col className="white-BG">
                      ₱{order.shippingPrice.toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="white-BG">
                  <Row className="white-BG">
                    <Col className="white-BG">Tax</Col>
                    <Col className="white-BG">₱{order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="white-BG">
                  <Row className="white-BG">
                    <Col className="white-BG">
                      <strong> Order Total</strong>
                    </Col>
                    <Col className="white-BG">
                      <strong>₱{order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            {order.paymentMethod === "PayPal" ? (
              <div className="print-order-buttons">
              <Button
                className="hide-on-print"
                variant="primary"
                onClick={print}
                disabled={order.isPaid}
              >
                Print Invoice
              </Button>
              {order.status >= 2 ? (
                <Button
                  className="hide-on-print"
                  variant="primary"
                  onClick={() => {
                    setOrderOfficialReceiptNumber(
                      order.officialReceiptNumber
                    );
                    setShowPrintOfficialReceiptInputModal(true);
                  }}
                  disabled={!order.isPaid} 
                >
                  Print Official Receipt
                </Button>
              ) : null}
            </div>
            ):(
              <div className="print-order-buttons">
                <Button
                  className="hide-on-print"
                  variant="primary"
                  onClick={print}
                >
                  Print Invoice
                </Button>
                {order.status >= 5 ? (
                  <Button
                    className="hide-on-print"
                    variant="primary"
                    onClick={() => {
                      setOrderOfficialReceiptNumber(
                        order.officialReceiptNumber
                      );
                      setShowPrintOfficialReceiptInputModal(true);
                    }}
                  >
                    Print Official Receipt
                  </Button>
                ) : null}
              </div>
            )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showPrintOfficialReceiptInputModal}
        onHide={() => setShowPrintOfficialReceiptInputModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Input Official Receipt Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mt-2 mb-3" controlId="formUsername">
              <Form.Label>Official Reciept Number:</Form.Label>
              <Form.Control
                type="text"
                defaultValue={orderOfficialReceiptNumber}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  const target = e.target as HTMLInputElement;
                  setOrderOfficialReceiptNumber(target.value);
                }}
                required
                disabled={order.officialReceiptNumber !== ""}
              />
            </Form.Group>
            <Button
              variant="success"
              onClick={() => {
                setShowPrintOfficialReceiptCheckModal(true);
                setShowPrintOfficialReceiptInputModal(false);
              }}
            >
              Submit
            </Button>
            <span> || </span>
            <Button
              variant="danger"
              onClick={() => setShowPrintOfficialReceiptInputModal(false)}
            >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showPrintOfficialReceiptCheckModal}
        onHide={() => setShowPrintOfficialReceiptCheckModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Are you Sure with the Official Receipt Number
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mt-2 mb-3" controlId="formUsername">
              <Form.Label>Official Reciept Number:</Form.Label>
              <Form.Control
                type="text"
                value={orderOfficialReceiptNumber}
                disabled
              />
            </Form.Group>
            <Button variant="success" onClick={printOfficialReceipt}>
              {SavingOfficialRecieptNumber ? "Submitting..." : "submit"}
            </Button>
            <span> || </span>
            <Button
              variant="danger"
              onClick={() => {
                setShowPrintOfficialReceiptCheckModal(false);
                setOrderOfficialReceiptNumber(order.officialReceiptNumber);
              }}
            >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
