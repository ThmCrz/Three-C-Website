import React from "react";
import { Row, Col } from "react-bootstrap";
// import ProductCard from './ProductCard';
import { Product } from "../types/Products";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";

type ProductListProps = {
  products: Product[];
};

const ProductCardList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div>
      <Row>
        <Col>
          <Carousel>
            {products.map((product) => (
              // ...

              <Carousel.Item key={product.slug}>
                <Link to={`/product/${product.slug}`}>
                  <img
                    title={product.slug}
                    src={product.image}
                    className="Product-carousel"
                  />
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </div>
  );
};

export default ProductCardList;
