import {
  Box,
  Flex,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import { useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";

interface AdminNavbarProps {
  name: string;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ name }) => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const AdminLogOut = () => {
    setDisabled(true);
    cookies.remove("token");
    cookies.remove("role");
    router.push("/admin/login");
  };

  return (
    <Box bg="white" px="30px" className="drop-shadow">
      <Flex
        width="100%"
        height="70px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box fontSize="xl">
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <Box>Dashboard</Box>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Box>{name}</Box>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Box fontSize="medium">
          <Button
            colorScheme="twitter"
            fontWeight="semibold"
            disabled={disabled}
            onClick={AdminLogOut}
            className="nav-btn"
          >
            Log Out
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default AdminNavbar;
