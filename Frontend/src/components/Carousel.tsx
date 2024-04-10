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
        <h2 className="Category" >Our Featured Products</h2>
          <Carousel className="Carousel">
            {products.map((product) => (
              // ...

              <Carousel.Item key={product.slug} className="mb-5">
                <Link to={`/product/${product.slug}`}>
                  <img
                    title={product.slug}
                    src={product.image}
                    className="Product-carousel"
                  />
                  <h4 className="ProductDescCarousel m-lg-3">{product.name}</h4>
                  <p className="ProductDescCarousel m-lg-3">{product.description}</p>
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
