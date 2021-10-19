import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ProtectAdminRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const GetAndSet = async () => {
    const token = await Cookies.get("token");
    const role = await Cookies.get("role");

    if (token && role === "admin") {
      setIsLoggedIn(true);
    } else {
      router.push('/admin/login');
    }
  };

  useEffect(() => {
    GetAndSet();
  }, []);

  return isLoggedIn ? children : null;
};

export default ProtectAdminRoute;
