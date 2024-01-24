import { Order } from '../types/Order';
import { Product } from '../types/Products';
import { useGetProductsQuery } from "../hooks/ProductHooks";
import { useGetOrdersQuery } from "../hooks/OrderHooks";
import { Table } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../types/Utils';
import { ApiError } from '../types/ApiError';

export default function SupplierOrderPage() {
    const { data: products, isLoading, error } = useGetProductsQuery();
    const { data: orders, isLoading: ordersLoading, error: orderError} = useGetOrdersQuery();

function suggestStockLevels(products: Product[], orders: Order[]): { name: string, minimumStockLevel: number, optimalStockLevel: number, maximumStockLevel: number, supplier: string, countInStock: number }[] {
  const stockLevels: { name: string, minimumStockLevel: number, optimalStockLevel: number, maximumStockLevel: number, supplier: string, countInStock: number }[] = [];

  products.forEach((product) => {
    // Calculate the total quantity sold for the single product
    const soldQuantities: { [productId: string]: number } = {};
    orders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        const productId = orderItem._id;
        const quantity = orderItem.quantity;
        if (productId === product._id) {
          if (soldQuantities[productId]) {
            soldQuantities[productId] += quantity;
          } else {
            soldQuantities[productId] = quantity;
          }
        }
      });
    });

    // Calculate the minimum, optimal, and maximum stock levels for the single product
    const soldQuantity = soldQuantities[product._id];
    const minimumStockLevel = soldQuantity || 0;
    const optimalStockLevel = soldQuantity ? Math.ceil(soldQuantity * 1.2) : 0;
    const maximumStockLevel = optimalStockLevel * 2; // Example: maximum stock level is twice the optimal stock level

    stockLevels.push({
      name: product.name,
      minimumStockLevel,
      optimalStockLevel,
      maximumStockLevel,
      supplier: product.brand,
      countInStock: product.countInStock,
    });
  });

  return stockLevels;
}

  const stockLevels = suggestStockLevels(products ?? [], orders ?? []);

const filteredStockLevels = stockLevels.filter((product) => {
  return (
    product.minimumStockLevel !== 0 &&
    product.optimalStockLevel !== 0 &&
    product.maximumStockLevel !== 0 &&
    product.countInStock < product.minimumStockLevel || 
    product.countInStock === 0 
  );
});



  return (
    <>
    <Helmet>
        <title>Purchase Order Page</title>
      </Helmet>
      <h1>Purchase Order to Supplier</h1>
    <Table striped bordered hover>
      <thead>
  <tr>
    <th>Name</th>
    <th>Supplier</th>
    <th>Minimum Stock Level</th>
    <th>Optimal Stock Level</th>
    <th>Count In Stock</th>
    <th>To Order</th>
  </tr>
</thead>
      <tbody>
      {isLoading || ordersLoading ? (
  <LoadingBox />
) : error || orderError ? (
  <MessageBox variant="danger">
    {getError(error as ApiError)}
  </MessageBox>
) :
   filteredStockLevels.map((filteredStockLevel, index) => (
      <tr key={index}>
      <td>{filteredStockLevel.name}</td>
      <td>{filteredStockLevel.supplier}</td>
      <td>{filteredStockLevel.minimumStockLevel}</td>
      <td>{filteredStockLevel.optimalStockLevel}</td>
      <td>{filteredStockLevel.countInStock}</td>
      <td>{filteredStockLevel.countInStock !== 0 ? (filteredStockLevel.minimumStockLevel + filteredStockLevel.optimalStockLevel) / 2 - filteredStockLevel.countInStock : 3}</td>
    </tr>

))}
</tbody>
    </Table>
</>
  );
}