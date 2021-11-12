import {
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Table,
  Box,
  Flex,
  Button,
} from "@chakra-ui/react";
import moment from "moment";
import { AddIcon, EditIcon, DeleteIcon, RepeatIcon } from "@chakra-ui/icons";
import React from "react";
import { useRecoilState } from "recoil";
import { selected, selectedObject } from "../../atoms";

interface TableProps {
  data: any;
  refresh?: boolean;
  toggleRefresh?: any;
  handleOpenAdd?: any;
  handleOpenDelete?: any;
  handleOpenEdit?: any;
}

const MyTable: React.FC<TableProps> = ({
  data,
  refresh,
  toggleRefresh,
  handleOpenAdd,
  handleOpenDelete,
  handleOpenEdit,
}) => {
  const [selectedRow, setSelectedRow] = useRecoilState<number>(selected);
  const [selectedObj, setSelectedObj] = useRecoilState(selectedObject);

  // data formatting with momentjs
  const format = (date: string) => {
    return moment(date).format("YYYY/MM/D ddd h:m A");
  };

  // bubble sorting
  const bblSort = (arr: Array<any>) => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j].id > arr[j + 1].id) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  };

  const findobj = (array: Array<any>, id: number) => {
    let obj: any;
    array.forEach((element: any) => {
      if (element["id"] == id) {
        obj = element;
      }
    });

    return obj;
  };

  const select = (id: number) => {
    if (selectedRow === id){
      setSelectedRow(null);
      setSelectedObj(null);
    } 
    else{
      setSelectedRow(id);
      setSelectedObj(findobj(data.cities, id));    } 
  };

  const tableName = (data: object) => {
    let name = Object.keys(data)[0];
    let newName = name.charAt(0).toUpperCase() + name.slice(1);
    return newName;
  };

  const handleRefresh = () => {
    toggleRefresh(!refresh);
  };

  return (
    <Box width="90%">
      <Flex
        height="90px"
        mt="20px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box fontSize="22px" fontWeight="500" ml="10px">
          {`${tableName(data)} Table`}
        </Box>
        <Box>
          <Button
            className="nav-btn"
            colorScheme="whatsapp"
            onClick={handleOpenAdd}
          >
            <AddIcon mr="5px" /> Add
          </Button>
          <Button
            className="nav-btn"
            ml="24px"
            colorScheme="linkedin"
            onClick={() => handleRefresh()}
          >
            <RepeatIcon mr="5px" /> Refresh
          </Button>
          <Button
            className="nav-btn"
            ml="24px"
            colorScheme="orange"
            isDisabled={!selectedRow}
            onClick={handleOpenEdit}
          >
            <EditIcon mr="7px" /> Edit
          </Button>
          <Button
            className="nav-btn"
            ml="24px"
            mr="5px"
            colorScheme="red"
            isDisabled={!selectedRow}
            onClick={handleOpenDelete}
          >
            <DeleteIcon mr="7px" /> Delete
          </Button>
        </Box>
      </Flex>
      <Box
        height="690px"
        overflowY="auto"
        border="1px"
        borderColor="gray.400"
        rounded="5px"
      >
        <Table>
          <Thead>
            <Tr bg="telegram.400">
              {Object.keys(data.cities[0]).map((key, i) => (
                <Th key={i} color="white">{key}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {bblSort(data.cities).map((city, i) => (
              <Tr
                key={i}
                bg={city.id === selectedRow ? "telegram.200" : "white"}
                onClick={() => select(city.id)}
              >
                {Object.keys(city).map((key, i) => {
                  if (key === "airports") {
                    return <Td key={i}>{city[key].length}</Td>;
                  } else if (key === "createdAt" || key === "updatedAt") {
                    return <Td key={i}>{format(city[key])}</Td>;
                  } else {
                    return <Td key={i}>{city[key]}</Td>;
                  }
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default MyTable;
