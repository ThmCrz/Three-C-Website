import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ApiError } from '../types/ApiError';
import { useCreateProductMutation } from '../hooks/ProductHooks';
import useSaveImageData from '../hooks/CloudinaryHook';

export default function NewProductForm({ uniqueCategories }: { uniqueCategories: string[] }) {

const { mutateAsync: createProduct, isLoading} = useCreateProductMutation()
const { saveImage, loading } = useSaveImageData()
const [isProductFormEnabled, setisProductFormEnabled] = useState(false);
const [isCategoryFormEnabled, setisCategoryFormEnabled] = useState(false);
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);

const [product, setProduct] = useState({
  _id: '',
  name: '',
  image: '', // Initialize as an empty string
  category: '',
  brand: '',
  price: 0,
  countInStock: 0,
  description: '',
});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
  
    if (name === 'image' && files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
  
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setImagePreview(imageUrl); // Set the preview URL
        // Optionally update the product state with a temporary URL
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      let newValue = value;
  
      // Remove leading zeros for price and countInStock
      if (name === 'price' || name === 'countInStock') {
        newValue = value.replace(/^0+(?=\d)/, '');
      }
  
      // Update state for other fields
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: newValue,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageUrl = event.target?.result as string;
  
          // Prepare the data for Cloudinary
          const imageData = {
            img_URL: imageUrl,
            img_ID: `${product.name}-${product.brand}`,
          };
  
          try {
            // Upload image to Cloudinary
            const cloudinaryUrl = await saveImage(imageData);
            
            // Update product with Cloudinary URL
            setProduct((prevProduct) => ({
              ...prevProduct,
              image: cloudinaryUrl,
            }));
  
            // Create the product with the updated image URL
            await createProduct(product);
            toast.success(`Product ${product.name} successfully Created`);
            setisProductFormEnabled(false);
            setisCategoryFormEnabled(false);
            window.location.reload();
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            toast.error(`Error uploading image: ${uploadError}`);
          }
        };
        reader.readAsDataURL(imageFile);
      } else {
        // If no image is uploaded, just create the product
        await createProduct(product);
        toast.success(`Product ${product.name} successfully Created`);
        setisProductFormEnabled(false);
        setisCategoryFormEnabled(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error(`Error creating product: ${error as ApiError}`);
    }
  };
  
  

  return isProductFormEnabled ? (
    <Modal show={isProductFormEnabled} onHide={() => setisProductFormEnabled(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Product Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formProductName">
        <Form.Label>Product ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product ID, If Empty ID will be automatically generated"
          name="_id"
          value={product._id}
          onChange={handleChange}
        />
      </Form.Group>
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
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Selected preview"
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
      )}
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

      <div className='mt-3'>
        <Button
          variant="success"
          type="submit"
          disabled={isLoading || loading}
        >
          {loading ? "Uploading Image...": isLoading ? "Creating..." : "Submit"}
        </Button>
        {" | "}
        <Button
          variant="danger"
          disabled={isLoading || loading}
          onClick={() => {
            setisProductFormEnabled(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </Form>
    </Modal.Body>
    </Modal>
  ) : (
    <Button
      variant="success"
      onClick={() => {
        setisProductFormEnabled(true);
      }}
    >
      Create New Product
    </Button>
  );
    
 
}


