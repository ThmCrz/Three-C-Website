import React from "react";
import { Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";
import { Product } from "../types/Products";

type ProductListProps = {
  products: Product[];
};

const ProductCardList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div>
      <Row>
        {products.map((product) => (
          <Col key={product.slug} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductCardList;
