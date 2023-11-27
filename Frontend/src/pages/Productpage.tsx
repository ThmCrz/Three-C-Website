/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useGetProductDetailsBySlugQuery } from "../hooks/ProductHooks";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { convertProductToCartItem, getError } from "../types/Utils";
import { ApiError } from "../types/ApiError";
import { Badge, Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Store } from "../Store";
import { useContext } from "react";
import { toast } from "react-toastify";
import { useCartMutation } from "../hooks/UserHooks";

export default function Productpage() {
  const params = useParams();

  const { slug } = params;

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!);

  const { state, dispatch } = useContext(Store);
  const { userInfo, cart } = state;

  const { mutateAsync: updateCart } = useCartMutation();

  const addToCartHandler = async () => {
    const existingItem = cart.cartItems.find((x) => x._id === product!._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    if (product!.countInStock < quantity) {
      toast.warn(`Sorry, The Product ${product!.name} is out of stock`);
      return;
    }
    dispatch({
      type: "ADD_ITEM_TO_CART",
      payload: { ...convertProductToCartItem(product!), quantity },
    });
    try {
      // Update shipping address and handle loading state
      await updateCart({
        user: userInfo._id, cartItem: convertProductToCartItem(product!),
        quantity: quantity,
      });

      toast.success(`Product ${product!.name} was added to cart`);
    } catch (error) {
      // Handle error, e.g., show an error toast
      toast.error(`${error as ApiError}`);
    }
  };

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : !product ? (
    <MessageBox variant="danger">Product Not Found</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{slug}</title>
      </Helmet>
      <div>
        <Row>
          <Col md={6}>
            <div className="ImageBox CenterImage">
              <img
                className="large"
                src={product.image}
                alt={product.name}
              ></img>
            </div>
          </Col>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>

                <h2>Brand: {product.brand}</h2>
              </ListGroup.Item>
              <ListGroup.Item>Price : ₱{product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description:
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>₱{product.price}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          onClick={addToCartHandler}
                          variant="primary"
                          disabled={isLoading}
                        >
                          {isLoading ? "Adding to cart..." : "Add to Cart"}
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
