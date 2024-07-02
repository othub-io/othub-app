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

const FormatDrop = ({
  network,
  paranet,
  format,
  set_format,
  set_type,
  selected_file,
  display_content,
}) => {
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
        let format_array = [];
        set_format(format);
        set_type(null);
        selected_file(null);
        display_content(null);
        setSelectedFormat(format ? format.type : null);

        if (paranet.name === "No Paranet Selected") {
          format_array.push({ type: "File Upload" });
          format_array.push({ type: "Raw JSON" });
          format_array.push({ type: "Form" });
        }

        if (paranet.name === "DeSci Paranet") {
          format_array.push({ type: "File Upload" });
          format_array.push({ type: "Raw JSON" });
          format_array.push({ type: "Form" });
        }

        if (paranet.name === "DMaaST Paranet") {
          format_array.push({ type: "File Upload" });
          format_array.push({ type: "Raw JSON" });
          format_array.push({ type: "Form" });
        }

        if (paranet.name === "Knowledger Paranet") {
          format_array.push({ type: "File Upload" });
          format_array.push({ type: "Raw JSON" });
          format_array.push({ type: "Form" });
        }

        setFormats(format_array);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [network, paranet]);

  const handleFormatChange = async (input) => {
    set_format(null);
    set_type(null);
    selected_file(null);
    display_content(null);
    if (input === "No Format Selected") {
      setSelectedFormat(null);
    } else {
      set_format(input);
      setSelectedFormat(input);
    }
  };

  return (
    formats && (
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
          {selectedFormat ? selectedFormat : "No Format Selected"}
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex flexDirection="column" p="10px" >
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
          {formats &&
            formats.map((fmat) => (
              <Flex flexDirection="column" p="10px" key={fmat.type}>
                <MenuItem
                  _hover={{ bg: "none", bgColor: tracColor, color: "#ffffff" }}
                  _focus={{ bg: "none" }}
                  borderRadius="8px"
                  px="14px"
                  onClick={(e) => handleFormatChange(e.target.value)}
                  value={fmat.type}
                  color={tracColor}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  {fmat.type}
                </MenuItem>
              </Flex>
            ))}
        </MenuList>
      </Menu>
    )
  );
};

export default FormatDrop;
