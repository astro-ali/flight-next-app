import React from "react";
import { Box } from "@chakra-ui/react";

interface IconsProps {
  icon: any;
  color?: string;
  mr?: string;
}

const Icons: React.FC<IconsProps> = ({ icon, color, mr }) => {
  return (
    <Box
      as={icon}
      display="inline-block"
      color={color ? color : "gray.800"}
      mr={mr ? mr : "5px"}
      mb="4px"
    />
  );
};

export default Icons;
