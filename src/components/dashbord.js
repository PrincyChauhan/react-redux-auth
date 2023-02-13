import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Dashboard = () => {
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    // const token = localStorage.getItem("token");

    if (!isAuth) {
      navigate("/sign-in", { replace: true });
    }
  }, []);

  return (
    <div>
      <p>Welcome to your Dashboard</p>
    </div>
  );
};
export default Dashboard;
