import React from "react";
import { Formik } from "formik";
import { ApiAdminLogin } from "../../api/admin/index";
import { Box, Button, Flex } from "@chakra-ui/react";
import InputField from "../../components/public/InputField";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { toErrorMap } from "../../util/toErrorMap";
import cookies from "js-cookie";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const alertMessage = useToast();

  return (
    <div>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(data, { setErrors, setSubmitting }) => {
          setSubmitting(true);
          if (!data.username && !data.password) {
            setSubmitting(false);
            return setErrors({
              username: "Username is required",
              password: "Password is required",
            });
          } else if (!data.username) {
            setSubmitting(false);
            return setErrors({
              username: "Username is required",
            });
          } else if (!data.password) {
            setSubmitting(false);
            return setErrors({
              password: "Password is required",
            });
          }
          ApiAdminLogin(data, async (res: any, error: any) => {
            setSubmitting(false);
            if (error) {
              // handle errors
              console.log(error);
              if (error?.err) {
                alertMessage({
                  title: "Failed to Login",
                  description: error.err[0],
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                  position: "top",
                });
              } else {
                setErrors(toErrorMap(error));
              }
            } else {
              // handle success response
              console.log(res);
              await cookies.set("token", res.token);
              await cookies.set("role", res.role);
              router.push("/admin");
            }
          });
        }}
      >
        {({ isSubmitting, handleSubmit, errors }) => (
          <Flex
            height="100vh"
            alignItems="center"
            justifyContent="center"
            background="#f7f7f7"
          >
            <Flex
              direction="column"
              background="white"
              rounded="12"
              py="8"
              px="8"
              w={320}
            >
              <form onSubmit={handleSubmit}>
                <Box mb={6} fontSize="26px" fontWeight="500">
                  <h2>Log in</h2>
                </Box>
                <InputField
                  label="Firstname"
                  name="username"
                  placeholder="username"
                  type="text"
                  error={errors.username}
                />
                <Box mt={6}>
                  <InputField
                    label="Password"
                    name="password"
                    placeholder="password"
                    type="password"
                    error={errors.password}
                  />
                </Box>
                <Box textAlign="center">
                  <Button
                    isLoading={isSubmitting}
                    type="submit"
                    colorScheme="telegram"
                    mt={6}
                    fontSize="16px"
                    px="5"
                  >
                    Login
                  </Button>
                </Box>
              </form>
            </Flex>
          </Flex>
        )}
      </Formik>
    </div>
  );
};

export default login;
