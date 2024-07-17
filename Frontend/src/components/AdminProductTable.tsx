import React, { useState } from "react";
import { Form, Button, ListGroup, Modal } from "react-bootstrap";
import { Product } from "../types/Products";
import { Link } from "react-router-dom";
import { useDeleteProductMutation, useProductEditMutation } from "../hooks/ProductHooks";
import { toast } from "react-toastify";
import { ApiError } from "../types/ApiError";
import { useGetOrdersQuery } from "../hooks/OrderHooks";
import { Order } from "../types/Order";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";


type ProductCardProps = {
  product: Product;
};

const AdminProductTableRows: React.FC<ProductCardProps> = ({ product }) => {

  const { mutateAsync: updateProductDetails, isLoading: isProductUpdateLoading , } = useProductEditMutation();
  const { mutateAsync: removeProduct, isLoading: isDeleting} = useDeleteProductMutation();
  const { data: orders, isLoading: ordersLoading} = useGetOrdersQuery();
    const [isEditingProductDetails, setIsEditingProductDetails] = useState(false);
    const [_id, setId] = useState(product._id);
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [slug, setSlug] = useState(product.slug);
    // const [image, setImage] = useState(product.image);
    const [category, setCategory] = useState(product.category);
    const [brand, setBrand] = useState(product.brand);
    const [price, setPrice] = useState(product.price);
    const [countInStock, setCountInStock] = useState(product.countInStock);


    const deleteHandler = async () => {
    
    try {
      await removeProduct({id: _id});
      toast.success("Product deleted");
      window.location.reload()
    } catch (error) {
      toast.error(`${error as ApiError}`);
    }
    
    }

    const submitHandler = async () =>{
        console.log("submit")
        
        try {
            await updateProductDetails({
                _id,
                name,
                slug,
                // image,
                category,
                brand,
                price,
                countInStock,
                description,
              });
            toast.success("Product details updated");
        } catch (error) {
            toast.error(`${error as ApiError}`);
        }
    }

    function suggestStockLevels(product: Product, orders: Order[]): { name: string, minimumStockLevel: number, optimalStockLevel: number, maximumStockLevel: number }[] {
      const stockLevels: { name: string, minimumStockLevel: number, optimalStockLevel: number, maximumStockLevel: number }[] = [];
    
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
      });
    
      return stockLevels;
    }

    const stockLevels = suggestStockLevels(product ?? [], orders ?? []);
    
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
        <td className="td-description"><Link to={"/product/" + product.slug + "/AdminProductPage"}>{product.name}</Link></td>
        <td className="td-description"><Link to={"/product/" + product.slug + "/AdminProductPage"}>{product.brand}</Link></td>
        <td className="td-description"><Link to={"/product/" + product.slug + "/AdminProductPage"}>₱{product.price}</Link></td>
        <td className="td-description"><Link to={"/product/" + product.slug + "/AdminProductPage"}>{product.countInStock}</Link></td>
        <td className="td-description"><Link to={"/product/" + product.slug + "/AdminProductPage"}>{product.description}</Link></td>
        <td>
          {ordersLoading ? (
            <LoadingBox />
          ) : countInStock === 0 ? (
            <MessageBox variant="danger">Out of Stock</MessageBox>
          ) : stockLevels.some(
              (stockLevel) => stockLevel.minimumStockLevel === 0
            ) ? (
            <MessageBox>Unavailable</MessageBox>
          ) : stockLevels.some(
              (stockLevel) => stockLevel.minimumStockLevel === countInStock
            ) ? (
            <MessageBox variant="warning">Minimum Stock Reached</MessageBox>
          ) : stockLevels.some(
              (stockLevel) => stockLevel.minimumStockLevel > countInStock
            ) ? (
            <MessageBox variant="danger">Under Stocked</MessageBox>
          ) : stockLevels.some(
              (stockLevel) => stockLevel.maximumStockLevel < countInStock
            ) ? (
            <MessageBox variant="danger">Over Stocked</MessageBox>
          ) : stockLevels.some(
              (stockLevel) => stockLevel.maximumStockLevel === countInStock
            ) ? (
            <MessageBox variant="warning">Maximum Stock Reached</MessageBox>
          ) : stockLevels.some(
              (stockLevel) =>
                stockLevel.optimalStockLevel > countInStock ||
                countInStock < stockLevel.maximumStockLevel
            ) ? (
            <MessageBox variant="success">Optimal Stock Level</MessageBox>
          ) : (
            ""
          )}
        </td>
        <td>
        {ordersLoading ? (
          <LoadingBox />
        ) : stockLevels.some(
            (stockLevel) => stockLevel.minimumStockLevel === 0
          ) ? (
          ""
        ) : (
          <>
            <ListGroup>
              {stockLevels.map((stockLevel, index) => (
                <ListGroup.Item className="td-description2" key={index}>
                  Minimum Stock Level: {stockLevel.minimumStockLevel}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <ListGroup>
              {stockLevels.map((stockLevel, index) => (
                <ListGroup.Item className="td-description2" key={index}>
                  Optimal Stock Level: {stockLevel.optimalStockLevel}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <ListGroup>
              {stockLevels.map((stockLevel, index) => (
                <ListGroup.Item className="td-description2" key={index}>
                  Maximum Stock Level: {stockLevel.maximumStockLevel}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
        </td>
        <td>
          {!isEditingProductDetails ? (
            <div className="actionButtonContainer">
            <Button
            variant="primary"
            onClick={() => setIsEditingProductDetails(true)}
            >
            Edit
          </Button>
          <span className="m-2">{" || "}</span>
        <Button
          variant="danger"
          onClick={deleteHandler}
          disabled={isDeleting}
          >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
            </div>
          ) : (
            <Modal show={isEditingProductDetails} onHide={() => setIsEditingProductDetails(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  className="white-BG"
                  key={product._id}
                  value={_id}
                  disabled={true}
                  onChange={(e) => setId(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  className="white-BG"
                  key={product.name}
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Slug</Form.Label>
                <Form.Control
                  className="white-BG"
                  value={slug}
                  required
                  key={product.slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  className="white-BG"
                  value={description}
                  required
                  key={product.description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  className="white-BG"
                  value={brand}
                  required
                  key={product.brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  className="white-BG"
                  value={category}
                  required
                  key={product.category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Count In stock</Form.Label>
                <Form.Control
                  className="white-BG"
                  value={countInStock}
                  required
                  key={product.countInStock}
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  className="white-BG"
                  value={price}
                  required
                  key={product.price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </Form.Group>

              <div className="mb-3">
                <Button
                  variant="success"
                  type="submit"
                  disabled={isProductUpdateLoading}
                >
                  {isProductUpdateLoading ? "saving..." : "Save"}
                </Button>
                {" | "}
                <Button
                  variant="danger"
                  onClick={() => setIsEditingProductDetails(false)}
                  disabled={isProductUpdateLoading}
                >
                  Cancel
                </Button>
              </div>
            </Form>
            </Modal.Body>
        </Modal>
          )}
            
        </td>
        
      </tr>
    </>
  );
};

export default AdminProductTableRows;
