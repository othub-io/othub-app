import React, { useState, useEffect, useRef } from "react";
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

const ParanetDrop = ({
  network,
  set_paranet,
  paranet,
  selected_file,
  display_content,
  set_format,
  set_type,
}) => {
  const [selectedParanet, setSelectedParanet] = useState(null);
  const [paranets, setParanets] = useState(null);
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    async function fetchData() {
      try {
        set_format(null);
        set_type(null);
        selected_file(null);
        display_content(null);
        setSelectedParanet(paranet ? paranet.name : null);

        const data = {
          network: network,
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/misc/paranets`,
          data,
          config
        );

        setParanets(response.data.paranets);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [network]);

  const handleParanetChange = async (pnet) => {
    set_paranet(null);
    set_format(null);
    set_type(null);
    selected_file(null);
    display_content(null);
    if (pnet.name === "No Paranet Selected") {
      setSelectedParanet(null);
    } else {
      set_paranet(pnet);
      setSelectedParanet(pnet.name);
    }
  };

  return (
    paranets && (
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
          {selectedParanet ? selectedParanet : "No Paranet Selected"}
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex flexDirection="column" p="10px" key={paranet.name}>
            <MenuItem
              _hover={{ bg: "none", bgColor: tracColor, color: "#ffffff" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={(e) => handleParanetChange(e.target.value)}
              value={{ name: "No Paranet Selected" }}
              color={tracColor}
              fontSize="lg"
              fontWeight="bold"
            >
              No Paranet Selected
            </MenuItem>
          </Flex>
          {paranets &&
            paranets.map((pnet) => (
              <Flex flexDirection="column" p="10px" key={pnet.name}>
                <MenuItem
                  _hover={{ bg: "none", bgColor: tracColor, color: "#ffffff" }}
                  _focus={{ bg: "none" }}
                  borderRadius="8px"
                  px="14px"
                  onClick={() => handleParanetChange(pnet)}
                  value={pnet.name}
                  color={tracColor}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  {pnet.name}
                </MenuItem>
              </Flex>
            ))}
        </MenuList>
      </Menu>
    )
  );
};

export default ParanetDrop;
