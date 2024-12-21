import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import React, { Suspense, lazy } from "react";
import LoadingComponent from "./Components/LoadingComponent";

// Lazy-loaded components
const PrivateRoute = lazy(() => import("./pages/PrivateRoute"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const UpdateProfile = lazy(() => import("./pages/UpdateProfile"));
const HomePageLayout = lazy(() => import("./pages/HomePage/HomePageLayout"));
const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const LoginRegister = lazy(() => import("./pages/Users/LoginRegister"));
const UsersDetails = lazy(() => import("./pages/Users/UsersDetails"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const TopicList = lazy(() => import("./Components/Topics/TopicList"));

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
      {/* Wrap Routes with Suspense */}
      <Suspense fallback={<LoadingComponent />}>
        <Routes>
          {/* Login and Register */}
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

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<HomePageLayout />}>
              <Route index element={<HomePage />} />
              <Route path="topics" element={<TopicList />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="update-profile" element={<UpdateProfile />} />
              <Route path="users" element={<UsersDetails />} />
            </Route>
          </Route>

          {/* Error Page */}
          <Route path="/*" element={<ErrorPage />}></Route>
        </Routes>
      </Suspense>

      {/* Toast Notifications */}
      <Toaster />
    </>
  );
}

export default App;
