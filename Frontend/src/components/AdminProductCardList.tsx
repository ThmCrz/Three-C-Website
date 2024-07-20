import React from "react";
import { Row, Table } from "react-bootstrap";
import { Product } from "../types/Products";
import AdminProductTableRows from "./AdminProductTable";

type ProductListProps = {
  products: Product[];
};

const AdminProductCardList: React.FC<ProductListProps> = ({ products }) => {
  return (
    
      <Row className='m-5'>
            <Table className="text-center" striped bordered hover size="sm">
        <thead>
          <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Description</th>
          <th>Status</th>
          <th>Suggestions</th>
          <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {products.map((product) => (
          
            <AdminProductTableRows product={product} key={product._id}/>
        ))}
        </tbody>
      </Table>
      </Row>
   
  );
};

export default AdminProductCardList;
