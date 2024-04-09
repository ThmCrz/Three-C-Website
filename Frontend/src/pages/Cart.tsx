import { useMemo, useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { cartItem } from "../types/Cart";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import MessageBox from "../components/MessageBox";
import { useCartDeleteItemMutation, useCartMutation } from "../hooks/UserHooks";
import { ApiError } from "../types/ApiError";
export default function CartPage() {
  const navigate = useNavigate();

  const {
    state: {
      userInfo,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  const { mutateAsync: updateCartQuantity, isLoading } = useCartMutation();
  const { mutateAsync: DeleteCartItems } = useCartDeleteItemMutation();


  const memoizedCartItems = useMemo(() => cartItems, [cartItems]);

  const [editedQuantities, setEditedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const updateCartHandler = async (item: cartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn("Sorry, Product is out of stock");
      return;
    }
    dispatch({
      type: "ADD_ITEM_TO_CART",
      payload: { ...item, quantity },
    });

    try {
      await updateCartQuantity({
        user: userInfo._id,
        cartItem: item,
        quantity: quantity,
      });
      toast.success(`Product ${item.name} Quantity updated.`);
    } catch (error) {
      toast.error(`${error as ApiError}`);
    }
  };

  const CheckoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  const removeItemHandler = async (item: cartItem) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });

    try {
      await DeleteCartItems({
        user: userInfo._id,
        cartItem: item,
      });
      toast.success(`Product ${item.name} was removed`);
    } catch (error) {
      toast.error(`${error as ApiError}`);
    }

  };

  return (
    <div>
      <Helmet>
        <title>Shopping cart</title>
      </Helmet>
      <h1>Cart</h1>
      <Row>
        <Col md={8}>
          {memoizedCartItems.length === 0 ? (
            <MessageBox>
              Your Cart Is Empty. <Link to="/">Go to Store</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {memoizedCartItems.map((item: cartItem) => (
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
                        id={item._id}
                        className="quantityInput"
                        title="quantityInput"
                        type="number"
                        min="1"
                        max={item.countInStock}
                        value={
                          editedQuantities[item._id] !== undefined
                            ? editedQuantities[item._id]
                            : item.quantity
                        }
                        disabled={isLoading}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          const clampedQuantity = Math.min(
                            Math.max(newQuantity, 1),
                            item.countInStock
                          );
                          setEditedQuantities(
                            (prev: { [key: string]: number }) =>
                              ({ ...prev, [item._id]: clampedQuantity } as {
                                [key: string]: number;
                              })
                          );
                        }}
                        onBlur={() => {
                          if (editedQuantities[item._id] !== undefined) {
                            updateCartHandler(item, editedQuantities[item._id]);
                            setEditedQuantities(
                              (prev: { [key: string]: number }) =>
                                ({ ...prev, [item._id]: undefined } as {
                                  [key: string]: number;
                                })
                            );
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            editedQuantities[item._id] !== undefined
                          ) {
                            updateCartHandler(item, editedQuantities[item._id]);
                            setEditedQuantities(
                              (prev: { [key: string]: number }) =>
                                ({ ...prev, [item._id]: undefined } as {
                                  [key: string]: number;
                                })
                            );
                          }
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
                    Subtotal (
                    {memoizedCartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items) : ₱
                    {Number(
                      memoizedCartItems.reduce(
                        (a, c) => a + c.quantity * c.price,
                        0
                      )
                    ).toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      className="NewUserButton"
                      type="button"
                      variant="primary"
                      onClick={CheckoutHandler}
                      disabled={memoizedCartItems.length === 0}
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
