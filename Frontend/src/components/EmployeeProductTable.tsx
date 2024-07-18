import React, { useContext } from "react";
import { Product } from "../types/Products";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCartMutation } from "../hooks/UserHooks";
import { Store } from "../Store";
import { ApiError } from "../types/ApiError";
import { cartItem } from "../types/Cart";
import { Button } from "react-bootstrap";
import { convertProductToCartItem } from "../types/Utils";



type ProductCardProps = {
  product: Product;
};

const EmployeeProductTable: React.FC<ProductCardProps> = ({ product }) => {
    

  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems },
  } = state;

  const { mutateAsync: updateCart, isLoading } = useCartMutation();

  const addToCartHandler = async (item: cartItem) => {
    if (isLoading) {
      return;
    }

    const existingItem = cartItems.find((x) => x._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      toast.warn(`Sorry, The Product ${product.name} is out of stock`);
      return;
    }
    dispatch({
      type: "ADD_ITEM_TO_CART",
      payload: { ...item, quantity },
    });
    
    if(userInfo){
    try {
      // Update shipping address and handle loading state
      await updateCart({ user: userInfo._id, cartItem: item, quantity});

      toast.success(`Product ${product.name} was added to cart`);
    } catch (error) {
      // Handle error, e.g., show an error toast
      toast.error(`${error as ApiError}`);
    }
    }else{
      toast.success(`Product ${product.name} was added to cart`);
    }
  };


  return (
    <>
      <tr>
        <td className="td-description">{product._id}</td>
        <td><Link to={"/product/" + product.slug + "/AdminProductPage"}>
            <img
              src={product.image}
              alt={product.name}
              className="mx-auto d-flex align-items-center"
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
            </Link>
        </td>
        <td className="td-description">{product.name}</td>
        <td className="td-description">{product.brand}</td>
        <td className="td-description">₱{product.price}</td>
        <td className="td-description">{product.countInStock}</td>
        <td className="td-description">{product.description}</td>
        <td>{product.countInStock === 0 ? (
          <Button variant="danger" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={() => addToCartHandler(convertProductToCartItem(product))}
            disabled={isLoading}>
            {isLoading ? "Adding to cart..." : "Add to Cart"}
          </Button>
        )}</td>
        
      </tr>
    </>
  );
};

export default EmployeeProductTable;
