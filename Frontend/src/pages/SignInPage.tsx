import { useState, useContext, useEffect } from "react"
import { Container, Button, Form } from "react-bootstrap"
import { Helmet } from "react-helmet-async"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { Store } from "../Store"
import LoadingBox from "../components/LoadingBox"
import { useSigninMutation } from "../hooks/UserHooks"
import { ApiError } from "../types/ApiError"
import { getError } from "../types/Utils"

export default function SigninPage() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { state, dispatch } = useContext(Store)
    const { userInfo } = state

    const { mutateAsync: signin, isLoading } = useSigninMutation()

    const submitHandler = async (e: React.SyntheticEvent) => {
      e.preventDefault()
      try {
        const data = await signin({
          email,
          password,
        })
        dispatch({ type: 'USER_SIGNIN', payload: data })
        localStorage.setItem('userInfo', JSON.stringify(data))
        localStorage.setItem("cartItems", JSON.stringify(data.currentCart));
        localStorage.setItem("shippingAddress", JSON.stringify(data.shippingAddress || { address: "", city: "", country: "", fullName: "", postalCode: "" }));
        
      } catch (err) {
        toast.error(getError(err as ApiError))
      }
    }

    useEffect(() => {
      if (userInfo) {
        if(userInfo.isAdmin){
          navigate("/adminPage")
          return
        }else{
          navigate(redirect)
        }
      }
    }, [navigate, redirect, userInfo])

    return (
      <Container className="small-container">
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <h1 className="my-3">Sign In</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="mb-3">
            <Button className="NewUserButton" disabled={isLoading} type="submit">
              Sign In
            </Button>
            {isLoading && <LoadingBox />}
          </div>
        </Form>
          <div className="OthersigninButtons m-3">
            New customer?{' '}
            <Button variant="primary" className="m-3" onClick={() => navigate(`/signup?redirect=${redirect}`)}>Create your account</Button>  
            <Button variant="primary" onClick={() => navigate(`/resetPassword`)}>Forgot Password</Button> 
          </div>
      </Container>
    )
  }

