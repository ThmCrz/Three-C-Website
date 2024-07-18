import React from 'react';
import { Product } from "../types/Products";
import EmployeeProductCardList from './EmployeeProductCardList';

type CategoryProductListProps = {
  products: Product[];
  category: string;
};

const EmployeeCategoryProductList: React.FC<CategoryProductListProps> = ({ products, category }) => {
  const filteredProducts = products.filter(product => product.category === category);

  return (
    <div>
      <h3 className="Category" id={category}>{category}</h3>
      <EmployeeProductCardList products={filteredProducts} />
    </div>
  );
};

export default EmployeeCategoryProductList;
