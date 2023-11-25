import { useContext, useState, useEffect } from "react"
import { Button, Form } from "react-bootstrap"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { Store } from "../Store"
import CheckoutGuide from "../components/CheckOutGuide"


export default function PaymentMethodPage() {
    const navigate = useNavigate()
    const { state, dispatch } = useContext(Store)
    const {
      cart: { shippingAddress, paymentMethod },
    } = state
  
    const [paymentMethodName, setPaymentMethod] = useState(
      paymentMethod || 'PayPal'
    )

    const [isRadioButtonSelected, setIsRadioButtonSelected] = useState(true);
  
    useEffect(() => {
      if (!shippingAddress.address) {
        navigate('/shipping')
      }
    }, [shippingAddress, navigate])
    const submitHandler = (e: React.SyntheticEvent) => {
      e.preventDefault()
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName })
      localStorage.setItem('paymentMethod', paymentMethodName)
      navigate('/placeorder')
    }
    return (
      <div>
        <CheckoutGuide step1 step2 step3></CheckoutGuide>
        <div className="mx-auto w-50">
          <Helmet>
            <title>Payment Method</title>
          </Helmet>
          <h1 className="my-3">Payment Method</h1>
          <Form onSubmit={submitHandler}>
            <div className="mb-4 mt-4">
              <Form.Check
                type="radio"
                id="PayPal"
                label="PayPal"
                value="PayPal"
                checked={paymentMethodName === 'PayPal'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setIsRadioButtonSelected(true);
                }}
              />
            </div>
            <div className="mb-4">
              <Form.Check
                type="radio"
                id="Stripe"
                label="Stripe (PlaceHolder)"
                value="Stripe (PlaceHolder)"
                checked={paymentMethodName === 'Stripe'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setIsRadioButtonSelected(true);
                }}
              />
            </div>
            <div className="mb-4">
              <Form.Check
                type="radio"
                id="E-Wallet"
                label="E-Wallet (PlaceHolder)"
                value="E-Wallet (PlaceHolder)"
                checked={paymentMethodName === 'E-Wallet'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setIsRadioButtonSelected(true);
                }}
              />
            </div>
            <div className="mb-4">
              <Form.Check
                type="radio"
                id="COD"
                label="Cash On Delivery"
                value="Cash On Delivery"
                checked={paymentMethodName === 'Cash On Delivery'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setIsRadioButtonSelected(true);
                }}
              />
            </div>
            <div className="mb-4">
              <Button className="mt-4" type="submit" disabled={!isRadioButtonSelected}>Continue</Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }