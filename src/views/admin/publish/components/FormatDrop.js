import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from "@chakra-ui/react";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const FormatDrop = ({network, paranet, format, type}) => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formats, setFormats] = useState(null);

  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    async function fetchData() {
      try {
        let format_array = []
        format("");
        type("");
        setSelectedFormat(null)

        if(!paranet){
          format_array.push({"type" : "File Upload"})
          format_array.push({"type" : "Copy & Paste"})
          format_array.push({"type" : "Form"})
        }

        if(paranet === 'DeSci Paranet'){
          format_array.push({"type" : "File Upload"})
          format_array.push({"type" : "Copy & Paste"})
          format_array.push({"type" : "Form"})
        }

        if(paranet === 'DMaaST Paranet'){
          format_array.push({"type" : "File Upload"})
          format_array.push({"type" : "Copy & Paste"})
          format_array.push({"type" : "Form"})
        }

        if(paranet === 'Knowledger Paranet'){
          format_array.push({"type" : "File Upload"})
          format_array.push({"type" : "Copy & Paste"})
          format_array.push({"type" : "Form"})
        }

        setFormats(format_array)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [network, paranet]);

  const handleFormatChange = async (input) => {
    if(input === "No Format Selected"){
      type("");
      format("");
      setSelectedFormat(null)
    }else{
      type("");
      format(input);
      setSelectedFormat(input)
    }
  };

  return (formats &&
    <Menu>
      <MenuButton
        variant="darkBrand"
        color="white"
        bgColor={tracColor}
        fontSize="lg"
        fontWeight="500"
        borderRadius="70px"
        marginRight="20px"
        px="24px"
        py="5px"
      >
        {selectedFormat ? selectedFormat: "No Format Selected"}
      </MenuButton>
      <MenuList
        boxShadow={shadow}
        p="0px"
        mt="10px"
        borderRadius="20px"
        bg={menuBg}
        border="none"
      >
        <Flex flexDirection="column" p="10px" key={format.type}>
            <MenuItem
              _hover={{ bg: "none", bgColor: tracColor, color: "#ffffff" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={(e) => handleFormatChange(e.target.value)}
              value={"No Format Selected"}
              color={tracColor}
              fontSize="lg"
              fontWeight="bold"
            >
              No Format Selected
            </MenuItem>
          </Flex>
        {formats && formats.map((format) => (
          <Flex flexDirection="column" p="10px" key={format.type}>
            <MenuItem
              _hover={{ bg: "none", bgColor: tracColor, color: "#ffffff" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={(e) => handleFormatChange(e.target.value)}
              value={format.type}
              color={tracColor}
              fontSize="lg"
              fontWeight="bold"
            >
              {format.type}
            </MenuItem>
          </Flex>
        ))}
      </MenuList>
    </Menu>
  );
};

export default FormatDrop;
