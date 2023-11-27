import React from "react";
import { Row, Col } from "react-bootstrap";
import { Product } from "../types/Products";
import AdminProductCard from "./AdminProductCard";

type ProductListProps = {
  products: Product[];
};

const AdminProductCardList: React.FC<ProductListProps> = ({ products }) => {
  return (
    
      <Row>
        {products.map((product) => (
          <Col key={product.slug} sm={6} md={4} lg={3}>
            <AdminProductCard product={product} />
          </Col>
        ))}
      </Row>
   
  );
};

export default AdminProductCardList;
