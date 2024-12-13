import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  FormHelperText,
  InputRightElement,
} from "@chakra-ui/react";
import { FaUserAlt } from "react-icons/fa";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { add } from "../../reduxStore/UserSlice";
import { loginSchema, registerSchema } from "../../assets/FormSchema";

const CFaUserAlt = chakra(FaUserAlt);

const LoginRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.pathname.split("/")[1];
  const dispatch = useDispatch();

  const handleShowClick = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, resetForm) => {
    setLoading(true);
    const res =
      type == "login"
        ? await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            values
          )
        : await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/register`,
            values
          );

    if (res.status == 200) {
      if (type == "login") {
        const user = {
          id: res.data?.user?._id,
          name: res.data?.user?.name,
          isAdmin: res.data?.user?.isAdmin,
        };
        localStorage.setItem("token", res.data?.token);
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(add(user));

        setError("");
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.success(res.data);
        resetForm({
          values: { name: "", email: "", phone: "", password: "" },
        });
      }
    } else setError(res.data);
    setLoading(false);
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="blue">
          {type == "login" ? "Welcome To Notebook " : "Sign Up for NoteBook"}
        </Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <Formik
            initialValues={
              type == "register"
                ? {
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                  }
                : {
                    email: "admin@gmail.com",
                    password: "admin1234",
                  }
            }
            validationSchema={type == "login" ? loginSchema : registerSchema}
            enableReinitialize={true}
            onSubmit={(values, { resetForm }) =>
              handleSubmit(values, resetForm)
            }
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Stack
                  spacing={4}
                  p="1rem"
                  backgroundColor="whiteAlpha.900"
                  boxShadow="md"
                >
                  {type == "register" && (
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <CFaUserAlt color="gray.300" />
                        </InputLeftElement>
                        <Input
                          type="text"
                          placeholder="Enter Your Name "
                          value={props.values.name}
                          onChange={(e) => {
                            props.handleChange(e);
                            setError("");
                          }}
                          name="name"
                        />
                      </InputGroup>
                      <FormHelperText textAlign="" color={"red"}>
                        {props.errors.name}
                      </FormHelperText>
                    </FormControl>
                  )}

                  <FormControl>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <CFaUserAlt color="gray.300" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="Email "
                        value={props.values.email}
                        onChange={(e) => {
                          props.handleChange(e);
                          setError("");
                        }}
                        name="email"
                      />
                    </InputGroup>
                    <FormHelperText textAlign="" color={"red"}>
                      {props.errors.email}
                    </FormHelperText>
                  </FormControl>

                  {type == "register" && (
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <CFaUserAlt color="gray.300" />
                        </InputLeftElement>
                        <Input
                          placeholder="Phone Number"
                          value={props.values.phone}
                          onChange={(e) => {
                            if (e.target.value.length <= 10) {
                              props.handleChange(e);
                              setError("");
                            }
                          }}
                          name="phone"
                        />
                      </InputGroup>
                      <FormHelperText textAlign="" color={"red"}>
                        {props.errors.phone}
                      </FormHelperText>
                    </FormControl>
                  )}

                  <FormControl>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <CFaUserAlt color="gray.300" />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        name="password"
                        value={props.values.password}
                        onChange={(e) => {
                          props.handleChange(e);
                          setError("");
                        }}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText textAlign="" color={"red"}>
                      {error || props.errors.password}
                    </FormHelperText>
                  </FormControl>
                  <Button
                    borderRadius={0}
                    type="submit"
                    variant="solid"
                    colorScheme="blue"
                    width="full"
                  >
                    {loading
                      ? "please Wait..."
                      : type == "login"
                      ? "Sign In"
                      : "Sign Up"}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Stack>
      {type == "register" ? (
        <Box>
          Already Register With Us?{" "}
          <Button
            color="teal.500"
            onClick={() => {
              navigate("/login"), setError("");
            }}
          >
            Sign In
          </Button>
        </Box>
      ) : (
        <Box>
          New to Cloud Notebook?{" "}
          <Button
            color="teal.500"
            onClick={() => {
              navigate("/register"), setError("");
            }}
          >
            Sign Up
          </Button>
        </Box>
      )}
    </Flex>
  );
};

export default LoginRegister;
