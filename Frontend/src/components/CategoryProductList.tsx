import React from 'react';
import ProductCardList from './ProductCardList';
import { Product } from '../types/Products';

type CategoryProductListProps = {
  products: Product[];
  category: string;
};

const CategoryProductList: React.FC<CategoryProductListProps> = ({ products, category }) => {
  const filteredProducts = products.filter(product => product.category === category);

  return (
    <div>
      <h2 className="Category" id={category}>{category}</h2>
      <ProductCardList products={filteredProducts} />
    </div>
  );
};

export default CategoryProductList;
