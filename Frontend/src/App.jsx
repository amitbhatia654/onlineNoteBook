import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./pages/PrivateRoute";
import MyProfile from "./pages/MyProfile";
import ErrorPage from "./pages/ErrorPage";
import UpdateProfile from "./pages/UpdateProfile";
import HomePageLayout from "./pages/HomePage/HomePageLayout";
import HomePage from "./pages/HomePage/HomePage";
import LoginRegister from "./pages/Users/LoginRegister";
import UsersDetails from "./pages/Users/UsersDetails";

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
      <Routes>
        {" "}
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
            <Route path="topic/:name" element={<TopicLayout />}></Route>
            <Route path="profile" element={<MyProfile />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="users" element={<UsersDetails />} />
          </Route>
        </Route>
        <Route path="/*" element={<ErrorPage />}></Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
