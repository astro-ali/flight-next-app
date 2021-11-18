import React from "react";
import {
  Avatar,
  Flex,
  Grid,
  GridItem,
  Text,
  Box,
  ListItem,
  UnorderedList,
  Container,
} from "@chakra-ui/react";
import {
  FaHome,
  FaUserTie,
  FaUsers,
  FaPlane,
  FaPlaneDeparture,
  FaCity,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import cookies from "js-cookie";
import { ApiAdminGetMe } from "../../api/admin";
import { AdminData } from "../../types";
import AdminNavbar from "../../components/admin/AdminNavbar";
import Icons from "../../components/public/Icons";
import ProtectAdminRoute from "../../HOC/ProtectAdminRoute";
import SidebarRouter from "../../components/admin/SidebarRouter";
import { useRecoilState } from "recoil";
import { navState, selected, selectedObject } from "../../atoms";

interface dashboardProps {}

const dashboard: React.FC<dashboardProps> = ({}) => {
  const [nav] = useRecoilState(navState);
  const [adminData, setAdminData] = useState<AdminData>({});
  const [currentWindow, setCurrentWindow] = useState<string>("home");
  const [selectedRow, setSelectedRow] = useRecoilState<number>(selected);
  const [selectedObj, setSelectedObj] = useRecoilState(selectedObject);

  // fetching admin data using token
  useEffect(() => {
    let token = cookies.get("token");
    ApiAdminGetMe(token, (res: any, error: any) => {
      if (error) {
        console.log(error);
      } else {
        setAdminData(res?.adminObj);
      }
    });
  }, []);

  const selectCurrentWindow = (window: string) => {
    setSelectedRow(null);
    setSelectedObj(null);
    setCurrentWindow(window);
  }

  return (
    <div>
      <ProtectAdminRoute>
        <Grid
          h="100vh"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
        >
          <GridItem rowSpan={2} colSpan={1} background="telegram.500">
            <Flex
              height="290px"
              direction="column"
              alignItems="center"
              justifyContent="center"
              textColor="white"
            >
              <div>
                <Avatar size="2xl" bg="gray.300" />
                <Box textAlign="center">
                  <Text
                    mt="18px"
                    fontSize="26px"
                    fontWeight="medium"
                  >{`${adminData.first_name} ${adminData.last_name}`}</Text>
                  <Text fontSize="20px">system admin</Text>
                </Box>
              </div>
            </Flex>
            <Container>
              <Flex
                alignItems="center"
                justifyContent="center"
                h="550px"
                w="345px"
                rounded="20px"
              >
                <Box color="white" className="hello" w="320px">
                  <UnorderedList ml={0} listStyleType="none" textAlign="left">
                    <ListItem
                      className={
                        nav == "home"
                          ? "sidebar-item ative-item"
                          : "sidebar-item"
                      }
                      onClick={() => selectCurrentWindow("home")}
                    >
                      <Icons
                        icon={FaHome}
                        color={nav == "home" ? "white" : ""}
                      />{" "}
                      Home
                    </ListItem>
                    <ListItem
                      className={
                        nav == "admin"
                          ? "sidebar-item ative-item"
                          : "sidebar-item"
                      }
                      onClick={() => selectCurrentWindow("admin")}
                    >
                      <Icons
                        icon={FaUserTie}
                        color={nav == "admin" ? "white" : ""}
                      />{" "}
                      Admin Profile
                    </ListItem>
                    <ListItem
                      className={
                        nav == "users"
                          ? "sidebar-item ative-item"
                          : "sidebar-item"
                      }
                      onClick={() => selectCurrentWindow("users")}
                    >
                      <Icons
                        icon={FaUsers}
                        color={nav == "users" ? "white" : ""}
                      />{" "}
                      Users info
                    </ListItem>
                    <ListItem
                      className={
                        nav == "flights"
                          ? "sidebar-item ative-item"
                          : "sidebar-item"
                      }
                      onClick={() => selectCurrentWindow("flights")}
                    >
                      <Icons
                        icon={FaPlane}
                        mr="7px"
                        color={nav == "flights" ? "white" : ""}
                      />
                      Flights
                    </ListItem>
                    <ListItem
                      className={
                        nav == "airports"
                          ? "sidebar-item ative-item"
                          : "sidebar-item"
                      }
                      onClick={() => selectCurrentWindow("airports")}
                    >
                      <Icons
                        icon={FaPlaneDeparture}
                        color={nav == "airports" ? "white" : ""}
                      />{" "}
                      Airports
                    </ListItem>
                    <ListItem
                      className={
                        nav == "cities"
                          ? "sidebar-item ative-item"
                          : "sidebar-item"
                      }
                      onClick={() => selectCurrentWindow("cities")}
                    >
                      <Icons
                        icon={FaCity}
                        color={nav == "cities" ? "white" : ""}
                      />{" "}
                      Cities
                    </ListItem>
                  </UnorderedList>
                </Box>
              </Flex>
              <Box color="white" textAlign="center" mt="30px">
                <Text fontSize="18px">All Right Reseved</Text>
                <Text>
                  Astro Dev{" "}
                  <Text fontSize="20px" d="inline-block">
                    &copy;
                  </Text>{" "}
                  2021
                </Text>
              </Box>
            </Container>
          </GridItem>
          <GridItem colSpan={4} rowSpan={2} bg="white">
            <AdminNavbar name={currentWindow} />
            <SidebarRouter current={currentWindow} />
          </GridItem>
        </Grid>
      </ProtectAdminRoute>
    </div>
  );
};

export default dashboard;
