import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import { useGetProductsQuery } from '../hooks/ProductHooks';
import { getError } from '../types/Utils';
import { ApiError } from '../types/ApiError';
import { Product } from '../types/Products';
import AdminCategoryProductList from '../components/AdminCategoryProductList';
import NewProductForm from '../components/AddNewProduct';
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";



export default function InventoryManagementPage() {
  const { data: products, isLoading, error } = useGetProductsQuery();
  const navigate = useNavigate();

  const uniqueCategories = products
  ? Array.from(new Set(products.map(product => product.category)))
  : [];

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Inventory Management</title>
      </Helmet>
      <h1>Product Management</h1>
      
          <NewProductForm uniqueCategories={uniqueCategories} />
          <div>  ||  </div>
          <Button onClick={() => {navigate("/SupplierOrderPage")}}>View Suggested Purchase Order</Button>
          {products && (
            <div>
              {uniqueCategories.map((category) => (
                <AdminCategoryProductList
                  key={category}
                  products={products as Product[]}
                  category={category}
                />
              ))}
            </div>
          )}
        
    </div>
  );
}