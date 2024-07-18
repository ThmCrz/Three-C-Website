import React from "react";
import { Row, Table } from "react-bootstrap";
import { Product } from "../types/Products";
import EmployeeProductTable from "./EmployeeProductTable";

type ProductListProps = {
  products: Product[];
};

const EmployeeProductCardList: React.FC<ProductListProps> = ({ products }) => {
  return (
    
      <Row className='m-5'>
            <Table className="text-center" striped bordered hover size="sm">
        <thead>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Description</th>
          <th>Action</th>
        </thead>
        <tbody>
        {products.map((product) => (
          
            <EmployeeProductTable product={product}/>
        ))}
        </tbody>
      </Table>
      </Row>
   
  );
};

export default EmployeeProductCardList;
