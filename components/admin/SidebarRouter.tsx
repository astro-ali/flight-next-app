import React from "react";
import AdminAirports from "./AdminAirports";
import AdminCities from "./AdminCities";
import AdminFlights from "./AdminFlights";
import AdminHome from "./AdminHome";
import AdminProfile from "./AdminProfile";
import UserList from "./UserList";

interface SidebarRouterProps {
  current:
    | string
    | "home"
    | "admin"
    | "users"
    | "flights"
    | "airports"
    | "cities";
}

const SidebarRouter: React.FC<SidebarRouterProps> = ({ current }) => {
  return <div>{
      {
        'home': <AdminHome />,
        'admin': <AdminProfile />,
        'users': <UserList />,
        'flights': <AdminFlights />,
        'airports': <AdminAirports />,
        'cities': <AdminCities />
      }[current]
      }</div>;
};

export default SidebarRouter;
