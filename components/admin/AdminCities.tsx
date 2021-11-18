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
  Text,
} from "@chakra-ui/react";
import {
  apiAdminAddCity,
  apiAdminDeleteCity,
  apiAdminEditCity,
  apiGetAllCities,
} from "../../api/admin";
import React from "react";
import { useEffect, useState } from "react";
import MyTable from "./MyTable";
import { Formik } from "formik";
import InputField from "../public/InputField";
import cookies from "js-cookie";
import { toErrorMap } from "../../util/toErrorMap";
import { useRecoilState } from "recoil";
import { selected, selectedObject } from "../../atoms";

interface AdminCitiesProps {};

const AdminCities: React.FC<AdminCitiesProps> = ({}) => {
  const alertMessage = useToast();
  const [cities, setCities] = useState();
  const [refresh, toggleRefresh] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [operation, chooseOperation] = useState<string>(null);
  const [selectedRow, setSelectedRow] = useRecoilState<number>(selected);
  const [selectedObj,_] = useRecoilState(selectedObject);

  useEffect(() => {
    setTimeout(() => {
      const token = cookies.get("token");
      apiGetAllCities(token, (data: any, error: any) => {
        if (error) {
          console.log(error);
        } else {
          setCities(data);
        }
      });
    },1000);
  }, [refresh]);

  const handleDelete = () => {
    const token = cookies.get("token");
    apiAdminDeleteCity(token, selectedRow, (res: any, error: any) => {
      if (error) {
        console.log(error);
        if(error?.err){
          onClose();
          alertMessage({
            title: "Failed",
            description: error.err[0],
            status: "error",
            duration: 6000,
            isClosable: true,
            position: "top",
          });
        }
      } else {
        console.log(res);
        onClose();
        toggleRefresh(!refresh);
        alertMessage({
          title: "Success",
          description: "City Has been deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setSelectedRow(null);
      }
    });
  };

  const handleOpenAdd = () => {
    chooseOperation("add");
    onOpen();
  };

  const handleOpenDelete = () => {
    chooseOperation("delete");
    onOpen();
  };

  const handleOpenEdit = () => {
    chooseOperation("edit");
    onOpen();
  };

  return (
    <Box>
      {cities ? (
        <Box>
          <Flex mt="0px" justifyContent="center" alignItems="center">
            <MyTable
              name="Cities"
              data={cities}
              refresh={refresh}
              handleOpenAdd={handleOpenAdd}
              handleOpenDelete={handleOpenDelete}
              handleOpenEdit={handleOpenEdit}
              toggleRefresh={toggleRefresh}
            />
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {
                  {
                    add: "Create New City",
                    edit: "Edit the existing city",
                    delete: "Confirm Delete",
                  }[operation]
                }
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {
                  {
                    add: (
                      <Formik
                        initialValues={{ name: "", code: "" }}
                        onSubmit={async (
                          data,
                          { setErrors, setSubmitting }
                        ) => {
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
                          const token = cookies.get("token");
                          apiAdminAddCity(
                            token,
                            data,
                            (res: any, error: any) => {
                              setSubmitting(false);
                              if (error) {
                                // handle errors
                                console.log(error);
                                if (error?.err) {
                                  alertMessage({
                                    title: "Failed to Save",
                                    description: error.err[0],
                                    status: "error",
                                    duration: 3000,
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
                                  description:
                                    "City Has been saved successfully",
                                  status: "success",
                                  duration: 3000,
                                  isClosable: true,
                                  position: "top",
                                });
                              }
                            }
                          );
                        }}
                      >
                        {({
                          handleSubmit,
                          handleChange,
                          errors,
                          isSubmitting,
                        }) => (
                          <form onSubmit={handleSubmit} onChange={handleChange}>
                            <Box mb="30px" mt="20px">
                              <InputField
                                label="City Name"
                                name="name"
                                placeholder="Name"
                                type="text"
                                error={errors.name}
                              />
                            </Box>
                            <Box mb="40px">
                              <InputField
                                label="City Code"
                                name="code"
                                placeholder="Code"
                                type="text"
                                error={errors.code}
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
                    ),
                    edit: (
                      <Formik
                        initialValues={{
                          name: !!selectedObj ? selectedObj.name : "",
                          code: !!selectedObj ? selectedObj.code : "",
                        }}
                        onSubmit={async (
                          data,
                          { setErrors, setSubmitting }
                        ) => {
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
                          const token = cookies.get("token");
                          apiAdminEditCity(
                            token,
                            data,
                            selectedRow,
                            (res: any, error: any) => {
                              setSubmitting(false);
                              if (error) {
                                console.log(error);
                                if (error?.err) {
                                  alertMessage({
                                    title: "Failed to Save edit",
                                    description: error.err[0],
                                    status: "error",
                                    duration: 3000,
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
                                  description:
                                    "city has been edited successfully",
                                  status: "success",
                                  duration: 3000,
                                  isClosable: true,
                                  position: "top",
                                })
                              }
                            }
                          );
                        }}
                      >
                        {({
                          handleSubmit,
                          handleChange,
                          isSubmitting,
                          errors
                        }) => (
                          <form onSubmit={handleSubmit} onChange={handleChange}>
                            <Box mb="30px" mt="20px">
                              <InputField
                                label="City Name"
                                name="name"
                                placeholder="Name"
                                type="text"
                                error={errors.name}
                              />
                            </Box>
                            <Box mb="40px">
                              <InputField
                                label="City Code"
                                name="code"
                                placeholder="Code"
                                type="text"
                                error={errors.code}
                              />
                            </Box>
                            <Box mb="25px" textAlign="center">
                              <Button
                                px="30px"
                                colorScheme="whatsapp"
                                type="submit"
                                isLoading={isSubmitting}
                              >
                                Save
                              </Button>
                            </Box>
                          </form>
                        )}
                      </Formik>
                    ),
                    delete: (
                      <Box>
                        <Text fontSize="16px">
                          Are you sure you want to delete this row ?
                        </Text>
                        <Box mt="20px" mb="10px">
                          <Button
                            colorScheme="red"
                            mr="10px"
                            onClick={handleDelete}
                          >
                            Delete
                          </Button>
                          <Button variant="solid" onClick={onClose}>
                            No
                          </Button>
                        </Box>
                      </Box>
                    ),
                  }[operation]
                }
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
