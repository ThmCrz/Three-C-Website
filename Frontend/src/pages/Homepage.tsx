import CategoryProductList from '../components/CategoryProductList';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Helmet } from 'react-helmet-async';
import { useGetProductsQuery } from '../hooks/ProductHooks';
import { getError } from '../types/Utils';
import { ApiError } from '../types/ApiError';
import { Product } from '../types/Products';
import Carousel from '../components/Carousel';
import { Container } from 'react-bootstrap';


export default function Homepage() {

  
 
  const { data: products, isLoading: IsLoadingHomePage, error } = useGetProductsQuery();


  const uniqueCategories = products
  ? Array.from(new Set(products.map(product => product.category)))
  : [];
  
  return IsLoadingHomePage ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : (
    <Container fluid className="Home-page-container">
      <Helmet>
        <title>Three C Enterprises</title> 
      </Helmet>
{products && <Carousel products={products}/>}
      {uniqueCategories.map(category => (
        <CategoryProductList key={category} products={products as Product[]} category={category} />
      ))}
    </Container>
    )
}
