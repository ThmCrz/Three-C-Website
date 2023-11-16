import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { cartItem } from "../types/Cart";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import MessageBox from "../components/MessageBox";
export default function CartPage() {
  const navigate = useNavigate();

  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  const updateCartHandler = async (item: cartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn("Sorry, Product is out of stock");
      return;
    }
    dispatch({
      type: "ADD_ITEM_TO_CART",
      payload: { ...item, quantity },
    });
  };

  const CheckoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  const removeItemHandler = (item: cartItem) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  return (
    <div>
      <Helmet>
        <title>Shopping cart</title>
      </Helmet>
      <h1>Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Your Cart Is Empty. <Link to="/">Go to Store</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item: cartItem) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded img-thumbnail order-image"
                      ></img>
                    </Col>
                    <Col md={2}>
                      <Link to={`/Product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        variant="light"
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>
                      <input
                        className="quantityInput"
                        title="quantityInput"
                        type="number"
                        min="1"
                        max={item.countInStock}
                        value={item.quantity}
                        onChange={(e) => {
                          let newQuantity = parseInt(e.target.value);
                          if (isNaN(newQuantity) || newQuantity < 1) {
                            newQuantity = 1;
                          }
                          if (newQuantity > item.countInStock) {
                            newQuantity = item.countInStock;
                          }
                          updateCartHandler(item, newQuantity);
                        }}
                      />

                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        variant="light"
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col>₱{item.price}</Col>
                    <Col>
                      <Button
                        variant="light"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items) : ₱
                    {Number(
                      cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
                    ).toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={CheckoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to CheckOut
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
