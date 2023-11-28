import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { Product } from "../types/Products";
import { Link } from "react-router-dom";
import { useDeleteProductMutation, useProductEditMutation } from "../hooks/ProductHooks";
import { toast } from "react-toastify";
import { ApiError } from "../types/ApiError";

type ProductCardProps = {
  product: Product;
};

const AdminProductCard: React.FC<ProductCardProps> = ({ product }) => {

  const { mutateAsync: updateProductDetails, isLoading: isProductUpdateLoading , } = useProductEditMutation();
  const { mutateAsync: removeProduct, isLoading: isDeleting} = useDeleteProductMutation();

  
  
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
    
  return (
    
    
    <Card className="Card">
      <Link to={"/product/" + product.slug + "/AdminProductPage"}>
        <div className="ImageBox rounded">
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className="mx-auto d-flex align-items-center"
            style={{ width: "200px", height: "200px", objectFit: "contain" }}
          />
        </div>
      </Link>
      <Card.Body>
        <Link to={"/product/" + product.slug + "/AdminProductPage"}>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text className="ProductDesc">{product.description}</Card.Text>
          <Card.Text>Stock: {product.countInStock}</Card.Text>
          <Card.Text>Price: ₱{product.price}</Card.Text>
        </Link>
        
        {isEditingProductDetails ? (
          // Render the form here
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
                variant="primary"
                type="submit"
                disabled={isProductUpdateLoading}
              >
                {isProductUpdateLoading ? "saving..." : "Save"}
              </Button>
              {" | "}
              <Button
                onClick={() => setIsEditingProductDetails(false)}
                disabled={isProductUpdateLoading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
            <Button onClick={() => setIsEditingProductDetails(true)}>Edit</Button>)} {"  |  "}
            <Button onClick={deleteHandler} disabled={isDeleting}>{isDeleting? ("Removing..."):("Remove Product")}</Button>
      </Card.Body>
    </Card>
  

  );
};

export default AdminProductCard;
