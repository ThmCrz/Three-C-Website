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

export default function AdminProductpage() {
  const navigate = useNavigate();
  const params = useParams();

  const { slug } = params;

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!);

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

  // ...

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
