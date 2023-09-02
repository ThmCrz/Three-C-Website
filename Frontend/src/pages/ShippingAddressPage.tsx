import { useContext, useState, useEffect } from "react"
import { Button, Form } from "react-bootstrap"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { Store } from "../Store"
import CheckoutGuide from "../components/CheckOutGuide"

export default function ShippingAddressPage() {
    const navigate = useNavigate()
    const { state, dispatch } = useContext(Store)
    const {
      userInfo,
      cart: { shippingaddress },
    } = state
    const [fullName, setFullName] = useState(shippingaddress.fullName || '')
    const [address, setAddress] = useState(shippingaddress.address || '')
    const [city, setCity] = useState(shippingaddress.city || '')
    const [postalCode, setPostalCode] = useState(
        shippingaddress.postalCode || ''
    )
    useEffect(() => {
      if (!userInfo) {
        navigate('/signin?redirect=/shipping')
      }
    }, [userInfo, navigate])
    const [country, setCountry] = useState(shippingaddress.country || '')
    const submitHandler = (e: React.SyntheticEvent) => {
      e.preventDefault()
      dispatch({
        type: 'SAVE_SHIPPING_ADDRESS',
        payload: {
          fullName,
          address,
          city,
          postalCode,
          country,
          
        },
      })
      localStorage.setItem(
        'shippingAddress',
        JSON.stringify({
          fullName,
          address,
          city,
          postalCode,
          country,
          
        })
      )
      navigate('/payment')
    }
  
    return (
      <div>
        <Helmet>
          <title>Shipping Address</title>
        </Helmet>
  
        <CheckoutGuide step1 step2></CheckoutGuide>
        <div className="container small-container">
          <h1 className="my-3">Shipping Address</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="postalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Form.Group>
  
            <div className="mb-3">
              <Button variant="primary" type="submit">
                Continue
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }