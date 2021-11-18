import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  apiAdminEditCity,
  apiCreateNewAirport,
  apiDeleteAirport,
  apiEditAirport,
  apiGetAllAirports,
  apiGetAllCities,
} from "../../api/admin";
import { useEffect, useState } from "react";
import cookies from "js-cookie";
import MyTable from "./MyTable";
import { Formik } from "formik";
import { toErrorMap } from "../../util/toErrorMap";
import InputField from "../public/InputField";
import { useRecoilState } from "recoil";
import { selected, selectedObject } from "../../atoms";

interface AdminAirportsProps {}

const AdminAirports: React.FC<AdminAirportsProps> = ({}) => {
  const alertMessage = useToast();
  const [airports, setAirports] = useState();
  const [cities, setCities] = useState([]);
  const [operation, chooseOperation] = useState<string>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refresh, toggleRefresh] = useState(false);
  const [selectedRow, setSelectedRow] = useRecoilState<number>(selected);
  const [selectedObj, _] = useRecoilState(selectedObject);

  // fetch airports data from API
  useEffect(() => {
    const token = cookies.get("token");
    setTimeout(() => {
      apiGetAllAirports(token, (data: any, error: any) => {
        if (error) {
          console.log(error);
        } else {
          setAirports(data);
          apiGetAllCities(token, (data: any, error: any) => {
            if (error) {
              console.log(error);
            } else {
              setCities(data.cities);
            }
          });
        }
      });
    }, 1000);
  }, [refresh]);

  const handleOpenAdd = () => {
    chooseOperation("add");
    onOpen();
  };

  const handleOpenEdit = () => {
    chooseOperation("edit");
    onOpen();
  };

  const handleOpenDelete = () => {
    chooseOperation("delete");
    onOpen();
  };

  const handleDelete = () => {
    const token = cookies.get("token");
    apiDeleteAirport(token, selectedRow, (data: object, error: any) => {
      if(error) {
        console.log(error);
        if(error?.err){
          onClose();
          alertMessage({
            title: "Failed",
            description: error.err[0],
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      } else {
        console.log(data);
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
    })
  };

  return (
    <Box>
      {!!airports ? (
        <Box>
          <Flex mt="0px" justifyContent="center" alignItems="center">
            <MyTable
              name="Airports"
              data={airports}
              refresh={refresh}
              toggleRefresh={toggleRefresh}
              handleOpenAdd={handleOpenAdd}
              handleOpenEdit={handleOpenEdit}
              handleOpenDelete={handleOpenDelete}
            />
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {
                  {
                    add: "Create New Airport",
                    edit: "Edit an existing Airport",
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
                        initialValues={{ name: "", code: "", city: 0 }}
                        onSubmit={async (
                          data,
                          { setErrors, setSubmitting }
                        ) => {
                          setSubmitting(true);
                          if (!data.name && !data.code && data.city === 0) {
                            setSubmitting(false);
                            return setErrors({
                              name: "Name is required",
                              code: "Code is required",
                              city: "You must choose a city",
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
                          } else if (!data.city) {
                            setSubmitting(false);
                            return setErrors({
                              city: "You must choose a city",
                            });
                          }
                          console.log(data);
                          const token = cookies.get("token");
                          apiCreateNewAirport(
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
                                    "Airport Has been saved successfully",
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
                                label="Airport Name"
                                name="name"
                                placeholder="Name"
                                type="text"
                                error={errors.name}
                              />
                            </Box>
                            <Box mb="40px">
                              <InputField
                                label="Airport Code"
                                name="code"
                                placeholder="Code"
                                type="text"
                                error={errors.code}
                              />
                            </Box>
                            <Box mb="40px">
                              <FormControl isInvalid={!!errors.city}>
                                <FormLabel as="legend">ChooseCity</FormLabel>
                                <Select
                                  placeholder="Choose City"
                                  name="city"
                                  id="choose_city"
                                >
                                  {cities.map((city, i) => (
                                    <option key={i} value={parseInt(city.id)}>
                                      {city.name}
                                    </option>
                                  ))}
                                </Select>
                                {errors.city ? (
                                  <FormErrorMessage>
                                    {errors.city}
                                  </FormErrorMessage>
                                ) : null}
                              </FormControl>
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
                          city: !!selectedObj ? selectedObj.city.id : 0,
                        }}
                        onSubmit={async (
                          data,
                          { setErrors, setSubmitting }
                        ) => {
                          setSubmitting(true);
                          if (!data.name && !data.code && data.city === 0) {
                            setSubmitting(false);
                            return setErrors({
                              name: "Name is required",
                              code: "Code is required",
                              city: "You must choose a city",
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
                          } else if (data.city === 0) {
                            setSubmitting(false);
                            return setErrors({
                              city: "You must choose a city",
                            });
                          }
                          console.log(data);
                          const token = cookies.get("token");
                          apiEditAirport(
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
                                    "Airport has been edited successfully",
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
                          isSubmitting,
                          errors,
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
                            <Box mb="40px">
                              <FormControl isInvalid={!!errors.city}>
                                <FormLabel as="legend">ChooseCity</FormLabel>
                                <Select
                                  defaultValue={selectedObj.city.id}
                                  placeholder="Choose City"
                                  name="city"
                                  id="choose_city"
                                >
                                  {cities.map((city, i) => (
                                    <option key={i} value={parseInt(city.id)}>
                                      {city.name}
                                    </option>
                                  ))}
                                </Select>
                                {errors.city ? (
                                  <FormErrorMessage>
                                    {errors.city}
                                  </FormErrorMessage>
                                ) : null}
                              </FormControl>
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

export default AdminAirports;
