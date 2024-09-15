import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AccountContext } from "../../../../AccountContext";
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

const TypeDrop = ({
  network,
  format,
  set_type,
  type,
  selected_file,
  display_content,
}) => {
  const [selectedType, setSelectedType] = useState(null);
  const [types, setTypes] = useState(null);
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    async function fetchData() {
      try {
        let type_array = [];
        set_type(type);
        selected_file(null);
        display_content(null);
        setSelectedType(type);

        if (format === "Form") {
          type_array.push({ name: "Event" });
          type_array.push({ name: "Organization" });
          type_array.push({ name: "Person" });
          type_array.push({ name: "Product" });
        }

        setTypes(type_array);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [format, network]);

  const handleTypeChange = async (input) => {
    set_type(null);
    selected_file(null);
    display_content(null);
    if (input === "No Type Selected") {
      setSelectedType(null);
    } else {
      set_type(input);
      setSelectedType(input);
    }
  };

  return (
    format && (
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
          {selectedType ? selectedType : "No Type Selected"}
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex flexDirection="column" p="10px" key={format}>
            <MenuItem
              _hover={{ bg: "none", bgColor: `${tracColor} !important`, color: "#ffffff" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={(e) => handleTypeChange(e.target.value)}
              value={"No Type Selected"}
              color={tracColor}
              fontSize="lg"
              fontWeight="bold"
            >
              No Type Selected
            </MenuItem>
          </Flex>
          {types &&
            types.map((type) => (
              <Flex flexDirection="column" p="10px" key={type.name}>
                <MenuItem
                  _hover={{ bg: "none", bgColor: `${tracColor} !important`, color: "#ffffff" }}
                  _focus={{ bg: "none" }}
                  borderRadius="8px"
                  px="14px"
                  onClick={(e) => handleTypeChange(e.target.value)}
                  value={type.name}
                  color={tracColor}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  {type.name}
                </MenuItem>
              </Flex>
            ))}
        </MenuList>
      </Menu>
    )
  );
};

export default TypeDrop;
