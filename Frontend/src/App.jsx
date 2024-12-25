import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import React, { Suspense, lazy } from "react";
import PrivateRoute from "./pages/PrivateRoute";
import ErrorPage from "./pages/ErrorPage";
import LoadingComponent from "./Components/LoadingComponent";

const MyProfile = lazy(() => import("./pages/MyProfile"));
const UpdateProfile = lazy(() => import("./pages/UpdateProfile"));
const HomePageLayout = lazy(() => import("./pages/HomePage/HomePageLayout"));
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const LoginRegister = lazy(() => import("./pages/Users/LoginRegister"));
const UsersDetails = lazy(() => import("./pages/Users/UsersDetails"));

function App() {
  const isUserLogin = () => {
    return Boolean(localStorage.getItem("token"));
  };

  // eslint-disable-next-line react/prop-types
  const ProtectedLoginRoute = ({ children }) => {
    if (isUserLogin()) {
      return <Navigate to="/" replace></Navigate>;
    }
    return children;
  };

  return (
    <>
      <Suspense fallback={<LoadingComponent />}>
        <Routes>
          <Route
            path="/login"
            element={
              <ChakraProvider>
                <ProtectedLoginRoute>
                  <LoginRegister />
                </ProtectedLoginRoute>
              </ChakraProvider>
            }
          ></Route>
          <Route
            path="/register"
            element={
              <ChakraProvider>
                <ProtectedLoginRoute>
                  <LoginRegister />
                </ProtectedLoginRoute>
              </ChakraProvider>
            }
          ></Route>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<HomePageLayout />}>
              <Route index element={<HomePage />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="update-profile" element={<UpdateProfile />} />
              <Route path="users" element={<UsersDetails />} />
            </Route>
          </Route>
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
