import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { FaBox, FaChartLine, FaDatabase, FaUsers, FaHome } from "react-icons/fa"; // Import FaBars for the hamburger icon

export default function AdminSidebar() {
  const {
    state: { userInfo },
  } = useContext(Store);

  const navigate = useNavigate();
  return (
    <>
   
      <div className="mb-2"><h3>Administrator: <br/> {userInfo.name}</h3></div>
      <ul className="list-group list-group-flush mb-5 mt-5 ">
        <li
          className="list-group-item Sidebar-menu sidebar-li"
          onClick={() => {
            navigate("/adminPage");
          }}
        >
          <FaHome  className="sidebar-icon"/>
          <span className="sidebar-text"> Admin Dashboard</span>
        </li>
        <li
          className="list-group-item Sidebar-menu sidebar-li"
          onClick={() => {
            navigate("/OrdersManagementPage");
          }}
        >
          <FaBox className="sidebar-icon"/>
         <span className="sidebar-text"> All Orders Management</span>
        </li>
        <li
          className="list-group-item Sidebar-menu sidebar-li"
          onClick={() => {
            navigate("/InventoryManagementPage");
          }}
        >
          <FaDatabase className="sidebar-icon"/>
         <span className="sidebar-text"> Inventory Management</span>
        </li>
        <li
          className="list-group-item Sidebar-menu sidebar-li"
          onClick={() => {
            navigate("/DailyReportsPage");
          }}
        >
          <FaChartLine className="sidebar-icon"/>
          <span className="sidebar-text"> Reports Management</span>
        </li>
        <li
          className="list-group-item Sidebar-menu sidebar-li"
          onClick={() => {
            navigate("/AccountsManagement");
          }}
        >
          <FaUsers className="sidebar-icon"/>
          <span className="sidebar-text"> Accounts Management</span>
        </li>
      </ul>
    </>
  );
}