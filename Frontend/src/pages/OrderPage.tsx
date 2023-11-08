/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect } from "react"
import { Row, Col, Card, ListGroup, Button } from "react-bootstrap"
import { Helmet } from "react-helmet-async"
import { useParams, Link } from "react-router-dom"
import { Store } from "../Store"
import LoadingBox from "../components/LoadingBox"
import MessageBox from "../components/MessageBox"
import { ApiError } from "../types/ApiError"
import { getError } from "../types/Utils"
import { useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } from "../hooks/OrderHooks"
import { toast } from "react-toastify"
import { PayPalButtons, PayPalButtonsComponentProps, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from "@paypal/react-paypal-js"

export default function OrderPage() {
    const { state } = useContext(Store)
    const { userInfo } = state

    const params = useParams()
    const { id: orderId } = params

    const {
      data: order,
      isLoading,
      error,
      refetch,
    } = useGetOrderDetailsQuery(orderId!)

    const testPayHandler = async () => {
      await payOrder({ orderId: orderId! })
      refetch()
      toast.success('Order is paid')
    }
    const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
      style: { layout: 'vertical' },
      createOrder(data, actions) {
        return actions.order
          .create({
            purchase_units: [
              {
                amount: {
                  value: order!.totalPrice.toString(),
                },
              },
            ],
          })
          .then((orderID: string) => {
            return orderID
          })
      },
      onApprove(data, actions) {
        return actions.order!.capture().then(async (details) => {
          try {
            await payOrder({ orderId: orderId!, ...details })
            refetch()
            toast.success('Order is paid')
          } catch (err) {
            toast.error(getError(err as ApiError))
          }
        })
      },
      onError: (err) => {
        toast.error(getError(err as ApiError))
      },
    }
    const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer()
    const { data: paypalConfig } = useGetPaypalClientIdQuery()

    useEffect(() => {
      if (paypalConfig && paypalConfig.clientId) {
        const loadPaypalScript = async () => {
          paypalDispatch({
            type: 'resetOptions',
            value: {
              'clientId': paypalConfig!.clientId,
              currency: 'USD',
            },
          })
          paypalDispatch({
            type: 'setLoadingStatus',
            value: SCRIPT_LOADING_STATE.PENDING,
          })
        }
        loadPaypalScript()
      }
    }, [paypalConfig])
    const { mutateAsync: payOrder, isLoading: loadingPay } = usePayOrderMutation()


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
        <h1 className="my-3">Order {orderId}</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                <Card.Text>
                  <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                  <strong>Address: </strong> {order.shippingAddress.address},
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  ,{order.shippingAddress.country}
                  
                </Card.Text>
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="warning">Not Delivered</MessageBox>
                )}
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method:</strong> {order.paymentMethod}
                </Card.Text>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="warning">Not Paid</MessageBox>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {order.orderItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={4}>
                          <img
                            src={`../${item.image}`}
                            alt={item.name}
                            className="mx-auto d-flex align-items-center order-image"
                          ></img>{' '}
                        </Col>
                        <Col md={3}>
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                          </Col>
                        <Col md={2}>
                          <span>{item.quantity}</span>
                        </Col>
                        <Col md={3}>${item.price}</Col>
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
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item  className="white-BG">
                    <Row className="white-BG">
                      <Col className="white-BG">Items</Col>
                      <Col className="white-BG">${order.itemsPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="white-BG">
                    <Row className="white-BG">
                      <Col className="white-BG">Shipping</Col>
                      <Col className="white-BG">${order.shippingPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="white-BG">
                    <Row className="white-BG">
                      <Col className="white-BG">Tax</Col>
                      <Col className="white-BG">${order.taxPrice.toFixed(2)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item className="white-BG">
                    <Row className="white-BG">
                      <Col className="white-BG">
                        <strong> Order Total</strong>
                      </Col>
                      <Col className="white-BG">
                        <strong>${order.totalPrice.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {!order.isPaid && (
               <ListGroup.Item className="white-BG">
                 {isPending ? (
                   <LoadingBox />
                 ) : isRejected ? (
                   <MessageBox variant="danger">
                     Error in connecting to PayPal
                   </MessageBox>
                 ) : (
                   <div className="white-BG">
                     <PayPalButtons
                       {...paypalbuttonTransactionProps}
                     ></PayPalButtons>
                     <Button onClick={testPayHandler}>Test Pay</Button>
                   </div>
                 )}
                 {loadingPay && <LoadingBox></LoadingBox>}
               </ListGroup.Item>
             )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
