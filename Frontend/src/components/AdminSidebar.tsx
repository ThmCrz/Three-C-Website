import { useNavigate } from "react-router-dom";
import { FaBox, FaChartLine, FaDatabase, FaUsers, FaHome } from "react-icons/fa"; // Import FaBars for the hamburger icon
import { Row } from "react-bootstrap";

export default function AdminSidebar() {
  const navigate = useNavigate();
  
  return (
    <Row className="hide-on-print mt-3">
    <div className="sidebar-container">
      <ul className="sidebar-container">
      <li className="list-group-item"></li>
        <li
          className={`list-group-item Sidebar-menu sidebar-li ${
           location.pathname === "/adminPage" ? "active" : ""
          }`}
          onClick={() => {
            navigate("/adminPage");
          }}
        >
          <FaHome  className="sidebar-icon"/>
          <span className="sidebar-text"> Admin Dashboard</span>
        </li>
        <li
          className={`list-group-item Sidebar-menu sidebar-li ${
              location.pathname === "/OrdersManagementPage" ? "active" : ""
            }`}
          onClick={() => {
            navigate("/OrdersManagementPage");
          }}
        >
          <FaBox className="sidebar-icon"/>
         <span className="sidebar-text"> All Orders Management</span>
        </li>
        <li
          className={`list-group-item Sidebar-menu sidebar-li ${
              location.pathname === "/InventoryManagementPage" ? "active" : ""
            }`}
          onClick={() => {
            navigate("/InventoryManagementPage");
          }}
        >
          <FaDatabase className="sidebar-icon"/>
         <span className="sidebar-text"> Inventory Management</span>
        </li>
        <li
          className={`list-group-item Sidebar-menu sidebar-li ${
              location.pathname === "/DailyReportsPage" ? "active" : ""
            }`}
          onClick={() => {
            navigate("/DailyReportsPage");
          }}
        >
          <FaChartLine className="sidebar-icon"/>
          <span className="sidebar-text"> Reports Management</span>
        </li>
        <li
          className={`list-group-item Sidebar-menu sidebar-li ${
              location.pathname === "/AccountsManagement" ? "active" : ""
            }`}
          onClick={() => {
            navigate("/AccountsManagement");
          }}
        >
          <FaUsers className="sidebar-icon"/>
          <span className="sidebar-text"> Accounts Management</span>
        </li>
        <li className="list-group-item"></li>
      </ul>
    </div>
    </Row>
  );
}