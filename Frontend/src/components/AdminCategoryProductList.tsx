import React from 'react';
import { Product } from "../types/Products";
import AdminProductCardList from './AdminProductCardList';

type CategoryProductListProps = {
  products: Product[];
  category: string;
};

const CategoryProductList: React.FC<CategoryProductListProps> = ({ products, category }) => {
  const filteredProducts = products.filter(product => product.category === category);

  return (
    <div>
      <h3 className="Category" id={category}>{category}</h3>
      <AdminProductCardList products={filteredProducts} />
    </div>
  );
};

export default CategoryProductList;
