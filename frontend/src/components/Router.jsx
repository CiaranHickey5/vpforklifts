import React from "react";
import { useApp } from "../context/AppContext";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import ContactPage from "../pages/ContactPage";
import AdminPage from "../pages/AdminPage";
import AdminEditPage from "../pages/AdminEditPage";

const Router = () => {
  const { currentPage, isAuthenticated } = useApp();

  switch (currentPage) {
    case "home":
      return <HomePage />;
    case "shop":
      return <ShopPage />;
    case "contact":
      return <ContactPage />;
    case "admin":
      return isAuthenticated ? <AdminPage /> : <HomePage />;
    case "admin-edit":
      return isAuthenticated ? <AdminEditPage /> : <HomePage />;
    default:
      return <HomePage />;
  }
};

export default Router;
