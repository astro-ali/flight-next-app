import React from "react";
import ProtectAdminRoute from "../../HOC/ProtectAdminRoute";
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
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import cookies from "js-cookie";
import { ApiAdminGetMe } from "../../api/admin";
import { AdminData } from "../../types";
import AdminNavbar from "../../components/admin/AdminNavbar";

interface dashboardProps {}

const dashboard: React.FC<dashboardProps> = ({}) => {
  const [adminData, setAdminData] = useState<AdminData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let token = cookies.get("token");
    ApiAdminGetMe(token, (res: any, error: any) => {
      console.log(res);
      if (error) {
        console.log(error);
      } else {
        setAdminData(res?.adminObj);
      }
    });
  }, []);

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
                  <UnorderedList ml={0} listStyleType="none" textAlign="center">
                    <ListItem className="sidebar-item">Home</ListItem>
                    <ListItem className="sidebar-item ative-item">
                      Admin Profile
                    </ListItem>
                    <ListItem className="sidebar-item">Users info</ListItem>
                    <ListItem className="sidebar-item">Flights</ListItem>
                    <ListItem className="sidebar-item">Airports</ListItem>
                    <ListItem className="sidebar-item">Cities</ListItem>
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
            <AdminNavbar name="Home" />
            {/* <Flex h="90vh" alignItems="center" justifyContent="center">
              <Spinner color="telegram.500" size="xl" speed="0.65s" />
            </Flex> */}
          </GridItem>
        </Grid>
      </ProtectAdminRoute>
    </div>
  );
};

export default dashboard;
