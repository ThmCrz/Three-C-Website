import React, { useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { Product } from "../types/Products";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import { cartItem } from "../types/Cart";
import { convertProductToCartItem } from "../types/Utils";
import { toast } from "react-toastify";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = (item: cartItem) => {
    const existingItem = cartItems.find((x) => x._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      toast.warn(`Sorry, The Product ${product.name} is out of stock`);
      return;
    }
      dispatch({
      type: "ADD_ITEM_TO_CART",
      payload: { ...item, quantity },
    });
      toast.success(`Product ${product.name} was added to cart`);
  };

  return (
    <Card className="Card">
      <Link to={"/product/" + product.slug}>
        <div className="ImageBox rounded">
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className="mx-auto d-flex align-items-center"
            style={{ width: "200px", height: "200px", objectFit: "contain" }}
          />
        </div>
      </Link>
      <Card.Body>
        <Link to={"/product/" + product.slug}>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text className="ProductDesc">{product.description}</Card.Text>
          <Card.Text>Stock: {product.countInStock}</Card.Text>
          <Card.Text>Price: ₱{product.price}</Card.Text>
        </Link>
        {product.countInStock === 0 ? (
          <Button variant="primary" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => addToCartHandler(convertProductToCartItem(product))}
          >
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
