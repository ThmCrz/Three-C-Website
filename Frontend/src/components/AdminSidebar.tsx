import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Store } from '../Store';
import { Card } from 'react-bootstrap';


export default function AdminSidebar() {

    const {
        state: {
          userInfo,
        },
      } = useContext(Store);

      const navigate = useNavigate();

    
  return (
    <Card className="border-0">
      <Card.Body>
        <Card.Title>
          <div className="mb-2">Administrator:</div>
          {userInfo.name}
        </Card.Title>
        {/* Add admin's info here */}
      </Card.Body>

      <ul className="list-group list-group-flush">
        {/* Sidebar menu items */}
        <li className=""></li>
        <li className="list-group-item Sidebar-menu" onClick={() => {navigate("/OrdersManagementPage")}}>All Orders Management</li>
        <li className="list-group-item Sidebar-menu"  onClick={() => {navigate("/InventoryManagementPage")}}>Inventory Management</li>
        <li className=""></li>
        {/* Add more menu items for other pages */}
      </ul>
    </Card>
  );
}
