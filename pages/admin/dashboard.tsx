import React from "react";
import ProtectAdminRoute from "../../HOC/ProtectAdminRoute";

interface dashboardProps {}

const dashboard: React.FC<dashboardProps> = ({}) => {
  return (
    <div>
      <ProtectAdminRoute>
      <h2>Dashboard Page</h2>
      </ProtectAdminRoute>
    </div>
  );
};

export default dashboard;
