import React, { useState, useEffect } from "react";
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

const NetworkDrop = ({ network }) => {
  const [netwrk, setNetwrk] = useState("DKG Mainnet");

  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    async function fetchData() {
      try {
        network("DKG Mainnet");
        localStorage.setItem("network", "DKG Mainnet");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleNetworkChange = async (input) => {
    setNetwrk(input);
    network(input);
    localStorage.setItem("network", input);
  };

  return (
    <Menu>
      <MenuButton
        variant='darkBrand'
        color='white'
        bgColor={tracColor}
        fontSize='md'
        fontWeight='500'
        borderRadius='70px'
        marginRight='20px'
        px='24px'
        py='5px'
      >
        {netwrk}
      </MenuButton>
      <MenuList
        boxShadow={shadow}
        p="0px"
        mt="10px"
        borderRadius="20px"
        bg={menuBg}
        border="none"
      >
        <Flex flexDirection="column" p="10px">
          <MenuItem
            _hover={{ bg: "none", bgColor: tracColor, color: "#ffffff" }}
            _focus={{ bg: "none" }}
            borderRadius="8px"
            px="14px"
            onClick={(e) => handleNetworkChange(e.target.value)}
            value="DKG Mainnet"
            color={tracColor}
            fontSize="20px"
            fontWeight="bold"
          >
            DKG Mainnet
          </MenuItem>
        </Flex>
        <Flex flexDirection="column" p="10px">
          <MenuItem
            _hover={{ bg: "none", bgColor: tracColor, color: "#ffffff" }}
            _focus={{ bg: "none" }}
            borderRadius="8px"
            px="14px"
            onClick={(e) => handleNetworkChange(e.target.value)}
            value="DKG Testnet"
            color={tracColor}
            fontSize="20px"
            fontWeight="bold"
          >
            DKG Testnet
          </MenuItem>
        </Flex>
      </MenuList>
    </Menu>
  );
};

export default NetworkDrop;
