import React from "react";
import { Card, Button } from "react-bootstrap";
import { Product } from "../types/Products";
import { Link } from "react-router-dom";

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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
        <Card.Text>Price: {product.price}</Card.Text>
      </Link>
        {product.countInStock === 0 ? (
          <Button variant="primary" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button variant="primary">Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
