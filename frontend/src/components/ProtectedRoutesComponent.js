import { Outlet, Navigate } from "react-router-dom";
import UserChatComponent from "./user/UserChatComponent";

import axios from "axios";
import React, { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage";

const ProtectedRoutesComponent = ({ admin }) => {
  const [isAuth, setIsAuth] = useState();

  useEffect(() => {
    let cancelToken;
    const source = axios.CancelToken.source();
    const fetchData = async () => {
      try {
        // cancelToken = source.token;

        const response = await axios.get("/api/get-token", {
          cancelToken: source.token,
        });

        if (response.data.token) {
          setIsAuth(response.data.token);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          // Request was canceled, no action needed
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();

    return () => {
      // Cancel the Axios request when the component is unmounted
      if (cancelToken) {
        cancelToken.cancel("Request canceled");
      }
    };
  }, [isAuth]);

  if (isAuth === undefined) {
    return <LoginPage />;
  }

  return isAuth && admin && isAuth !== "admin" ? (
    <Navigate to="/" />
  ) : isAuth && admin ? (
    <Outlet />
  ) : isAuth && !admin ? (
    <>
      <UserChatComponent />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutesComponent;
