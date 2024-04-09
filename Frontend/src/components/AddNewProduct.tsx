import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ApiError } from '../types/ApiError';
import { useCreateProductMutation } from '../hooks/ProductHooks';

export default function NewProductForm({ uniqueCategories }: { uniqueCategories: string[] }) {

const { mutateAsync: createProduct, isLoading} = useCreateProductMutation()

const [product, setProduct] = useState({
    name: '',
    image: '',
    category: '',
    brand: '',
    price: 0,
    countInStock: 0,
    description: '',
  });

  const [isProductFormEnabled, setisProductFormEnabled] = useState(false);
  const [isCategoryFormEnabled, setisCategoryFormEnabled] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files.length > 0) {
      const file = files[0];
      const fileName = file.name;
      const imageUrl = `/Images/${fileName}`;
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: imageUrl,
      }));
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (value === 'new') {
      setisCategoryFormEnabled(true);
    } else {
      setisCategoryFormEnabled(false);
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createProduct(product)
      toast.success(`Product ${name} successfully Created`)
      setisProductFormEnabled(false);
      setisCategoryFormEnabled(false);
      window.location.reload()
    } catch (error) {
        toast.error(`${error as ApiError}`);
    }

  };

  return isProductFormEnabled ? (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formProductName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Enter product name"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formProductImage">
        <Form.Label>Image (Optional)</Form.Label>
        <Form.Control
          // required
          type="file"
          name="image"
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formProductCategory">
        <Form.Label>Category (Optional)</Form.Label>
        <Form.Select
          aria-label="Select category"
          name="category"
          title="Select category"
          value={isCategoryFormEnabled ? "" : product.category}
          onChange={handleCategoryChange}
        >
          <option value="" disabled>
            Select category
          </option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option key="New Category" value="new">
            New Category...
          </option>
        </Form.Select>
        {isCategoryFormEnabled && (
          <Form.Control
            type="text"
            placeholder="Enter new category"
            name="category"
            value={product.category}
            onChange={handleChange}
          />
        )}
      </Form.Group>

      <Form.Group controlId="formProductBrand">
        <Form.Label>Brand</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Enter product brand"
          name="brand"
          value={product.brand}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formProductPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control
          required
          type="number"
          min={0}
          step={1}
          placeholder="Enter product price"
          name="price"
          value={product.price}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formProductStock">
        <Form.Label>Count in Stock</Form.Label>
        <Form.Control
          required
          type="number"
          min={0}
          step={1}
          placeholder="Enter count in stock"
          name="countInStock"
          value={product.countInStock}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formProductDescription">
        <Form.Label>Description (Optional)</Form.Label>
        <Form.Control
          // required
          as="textarea"
          rows={3}
          placeholder="Enter product description"
          name="description"
          value={product.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Button
        className="NewUserButton"
        variant="primary"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Submit"}
      </Button>
      {" | "}
      <Button
        className="NewUserButton"
        variant="primary"
        disabled={isLoading}
        onClick={() => {
          setisProductFormEnabled(false);
        }}
      >
        Cancel
      </Button>
    </Form>
  ) : (
    <Button
      className="NewUserButton"
      variant="primary"
      onClick={() => {
        setisProductFormEnabled(true);
      }}
    >
      Create New Product
    </Button>
  );
    
 
}


