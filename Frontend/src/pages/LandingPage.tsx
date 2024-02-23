import { Button } from 'react-bootstrap';

export default function LandingPage() {
  return (
    <div>
      
        <h1>Welcome to Our Hardware Store!</h1>
        <p>
          We offer a wide range of hardware tools and materials.
        </p>
        <p>
          <Button variant="primary" href="/shop">Shop Now</Button>
        </p>
      
    </div>
    );
}
