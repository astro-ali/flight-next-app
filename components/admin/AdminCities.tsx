import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useEffect, useState } from "react";
import { apiAdminAddCity, apiGetAllCities } from "../../api/admin";
import MyTable from "./MyTable";
import { Formik } from "formik";
import InputField from "../public/InputField";
import cookies from "js-cookie";
import { toErrorMap } from "../../util/toErrorMap";

interface AdminCitiesProps {}

const AdminCities: React.FC<AdminCitiesProps> = ({}) => {
  const [cities, setCities] = useState();
  const [refresh, toggleRefresh] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const alertMessage = useToast();

  useEffect(() => {
    setTimeout(() => {
      console.log(refresh);
      const token = cookies.get("token");
      apiGetAllCities(token, (data: any, error: any) => {
        if (error) {
          console.log(error);
        } else {
          console.log(data);
          setCities(data);
        }
      });
    }, 500);
  }, [refresh]);
  return (
    <Box>
      {!!cities ? (
        <Box>
          <Flex mt="0px" justifyContent="center" alignItems="center">
            <MyTable
              data={cities}
              refresh={refresh}
              toggleRefresh={toggleRefresh}
              handleOpenAdd={onOpen}
            />
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create New City</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Formik
                  initialValues={{ name: "", code: "" }}
                  onSubmit={async (data, { setErrors, setSubmitting }) => {
                    setSubmitting(true);
                    if (!data.name && !data.code) {
                      setSubmitting(false);
                      return setErrors({
                        name: "Name is required",
                        code: "Code is required",
                      });
                    } else if (!data.name) {
                      setSubmitting(false);
                      return setErrors({
                        name: "Name is required",
                      });
                    } else if (!data.code) {
                      setSubmitting(false);
                      return setErrors({
                        code: "Code is required",
                      });
                    }
                    console.log(data);
                    const token = await cookies.get("token");
                    apiAdminAddCity(token, data, (res: any, error: any) => {
                      setSubmitting(false);
                      if (error) {
                        // handle errors
                        console.log(error);
                        if (error?.err) {
                          alertMessage({
                            title: "Failed to Save",
                            description: error.err[0],
                            status: "error",
                            duration: 3500,
                            isClosable: true,
                            position: "top",
                          });
                        } else {
                          setErrors(toErrorMap(error));
                        }
                      } else {
                        console.log(res);
                        onClose();
                        toggleRefresh(!refresh);
                        alertMessage({
                          title: "Success",
                          description: "City Has been saved successfully",
                          status: "success",
                          duration: 4000,
                          isClosable: true,
                          position: "top",
                        });
                      }
                    });
                  }}
                >
                  {({ handleSubmit, handleChange, errors, isSubmitting }) => (
                    <form onSubmit={handleSubmit} onChange={handleChange}>
                      <Box mb="30px" mt="20px">
                        <InputField
                          label="City Name"
                          name="name"
                          placeholder="Name"
                          type="text"
                        />
                      </Box>
                      <Box mb="40px">
                        <InputField
                          label="City Code"
                          name="code"
                          placeholder="Code"
                          type="text"
                        />
                      </Box>
                      <Box mb="25px" textAlign="center">
                        <Button
                          px="30px"
                          colorScheme="whatsapp"
                          type="submit"
                          isLoading={isSubmitting}
                        >
                          Save new city
                        </Button>
                      </Box>
                    </form>
                  )}
                </Formik>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      ) : (
        <Flex alignItems="center" justifyContent="center" h="85vh">
          <Spinner color="telegram.500" size="xl" />
        </Flex>
      )}
    </Box>
  );
};

export default AdminCities;
