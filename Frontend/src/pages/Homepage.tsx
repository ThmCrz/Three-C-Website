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
import { Store } from '../Store';
import { useContext, useState } from 'react';
import EmployeeCategoryProductList from '../components/EmployeeCategoryProductList';


export default function Homepage() {

  
 
  const { data: products, isLoading: IsLoadingHomePage, error } = useGetProductsQuery();
  const { state: {userInfo } } = useContext(Store);
  const [SearchProductTerm, setSearchProductTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  if (products) {const filteredProducts = products?.filter((product) => {
    const SearchProductTermLower = SearchProductTerm.toLowerCase();
    const SelectedCategoryTermLower = selectedCategory.toLowerCase();
  
    // Check if at least one search term or category is provided
    const hasSearchTermOrCategory = SearchProductTermLower || SelectedCategoryTermLower;
  
    // If no search terms or category selected, show all products
    if (!hasSearchTermOrCategory) return true;
  
    return [
      // Search terms (include checks for product fields)
      product._id.toLowerCase().includes(SearchProductTermLower),
      product.brand.toLowerCase().includes(SearchProductTermLower),
      product.category.toLowerCase().includes(SearchProductTermLower),
      product.slug.toLowerCase().includes(SearchProductTermLower),
    ].some((match) => match) && ( // Combine search and category filtering (if category selected)
      !selectedCategory || // Show all categories if none selected
      product.category.toLowerCase() === SelectedCategoryTermLower
    );
  });
  const uniqueCategories = products
  ? Array.from(new Set(filteredProducts?.map(product => product.category)))
  : [];

  const uniqueCategoriesForDropDown = products
  ? Array.from(new Set(products?.map(product => product.category)))
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
      {userInfo?.role === 'Employee' ? (
        <div className='mt-5'>
        <div className="Product-Management-Buttons">
              <div className="select">
                <select
                  className="selected"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSearchProductTerm("");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                    className="arrow"
                  >
                    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                  </svg>{" "}
                  {/* Update state on change */}
                  <option className="option" value="">
                    All Categories
                  </option>{" "}
                  {/* Default option */}
                  {uniqueCategoriesForDropDown.map((category) => (
                    <option className="option" key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-container">
                <input
                  className="input"
                  id="SearchTableInput"
                  type="text"
                  placeholder="Search..."
                  value={SearchProductTerm}
                  onChange={(e) => setSearchProductTerm(e.target.value)}
                />
                <span className="icon2">
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        opacity="1"
                        d="M14 5H20"
                        stroke="#000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        opacity="1"
                        d="M14 8H17"
                        stroke="#000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                        stroke="#000"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <path
                        opacity="1"
                        d="M22 22L20 20"
                        stroke="#000"
                        stroke-width="3.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </span>
              </div>
            </div>
  {products && (
    <div>
      {uniqueCategories.map((category) => (
        <EmployeeCategoryProductList
        key={category}
        products={filteredProducts as Product[]}
        category={category}
        />
      ))}
    </div>
  )}
  </div>
) : (
  <>
    {products && <Carousel products={products} />}
    {uniqueCategories.map(category => (
    <CategoryProductList key={category} products={products || []} category={category} />
    ))}
  </>
)}

    </Container>
    )
}
else{
  return <MessageBox variant='danger'>No Products Available</MessageBox>
}}