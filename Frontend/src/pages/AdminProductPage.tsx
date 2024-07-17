/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductDetailsBySlugQuery, useProductEditMutation } from "../hooks/ProductHooks";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../types/Utils";
import { ApiError } from "../types/ApiError";
import { Badge, Button, Card, Col, Form, ListGroup, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetOrdersQuery } from "../hooks/OrderHooks";
import { Product } from "../types/Products";
import { Order } from "../types/Order";

export default function AdminProductpage() {
  const navigate = useNavigate();
  const params = useParams();

  const { slug } = params;

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!);
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetOrdersQuery();


  const {
    mutateAsync: updateProductDetails,
    isLoading: isProductUpdateLoading,
  } = useProductEditMutation();

  const [isEditingProductDetails, setIsEditingProductDetails] = useState(false);

  const [_id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [procuctSlug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);

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
const stockLevels = suggestStockLevels(product || {} as Product, orders || [] as Order[]);

  useEffect(() => {
    if (product) {
      setId(product._id);
      setName(product.name);
      setDescription(product.description);
      setSlug(slug!);
      setCategory(product.category);
      setBrand(product.brand);
      setPrice(product.price);
      setCountInStock(product.countInStock);
    }
  }, [product, slug]);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await updateProductDetails({
        _id,
        name,
        slug: procuctSlug,
        // image,
        category,
        brand,
        price,
        countInStock,
        description,
      });
      toast.success("Product details updated");
      navigate(`/product/${procuctSlug}/AdminProductPage`);
    } catch (error) {
      toast.error(`${error as ApiError}`);
    }
  };

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : !product ? (
    <MessageBox variant="danger">Product Not Found</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{slug}</title>
      </Helmet>
      <div>
        <Row>
          <Col md={6}>
            <div className="ImageBox CenterImage">
              <img
                className="large"
                src={product.image}
                alt={product.name}
              ></img>
            </div>
          </Col>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>

                <h2>Brand: {product.brand}</h2>
              </ListGroup.Item>
              <ListGroup.Item>Price : ₱{product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description:
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>₱{product.price}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </Col>
                      
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
  <Row>
    
      {isLoading || ordersLoading ? (
  <LoadingBox />
) : error || ordersError ? (
  <MessageBox variant="danger">
    {getError(error as ApiError)}
  </MessageBox>
) : stockLevels.some(stockLevel => stockLevel.minimumStockLevel === 0) ? (
  null
) : (
  <>
    <ListGroup>
      <ListGroup.Item key={"Stock"}>
        Count in Stock: {product.countInStock}
      </ListGroup.Item>
    </ListGroup>
    <ListGroup>
      {stockLevels.map((stockLevel, index) => (
        <ListGroup.Item key={index}>
          Minimum Stock Level: {stockLevel.minimumStockLevel}
        </ListGroup.Item>
      ))}
    </ListGroup>
    <ListGroup>
      {stockLevels.map((stockLevel, index) => (
        <ListGroup.Item key={index}>
          Optimal Stock Level: {stockLevel.optimalStockLevel}
        </ListGroup.Item>
      ))}
    </ListGroup>
    <ListGroup>
      {stockLevels.map((stockLevel, index) => (
        <ListGroup.Item key={index}>
          Maximum Stock Level: {stockLevel.maximumStockLevel}
        </ListGroup.Item>
      ))}
    </ListGroup>
  </>
)}
  
  </Row>
</ListGroup.Item>

                  <ListGroup.Item>
                    <div className="d-grid">
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
                              value={procuctSlug}
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
                              onChange={(e) =>
                                setCountInStock(Number(e.target.value))
                              }
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
                              onClick={() => {
                                setIsEditingProductDetails(false);
                                if (product) {
                                  setId(product._id);
                                  setName(product.name);
                                  setDescription(product.description);
                                  setSlug(slug!);
                                  setCategory(product.category);
                                  setBrand(product.brand);
                                  setPrice(product.price);
                                  setCountInStock(product.countInStock);
                                }
                              }}
                              disabled={isProductUpdateLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Form>
                      ) : (
                        <Button
                          onClick={() => setIsEditingProductDetails(true)}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
