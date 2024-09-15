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
  chain_name
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
        setSelectedParanet(paranet ? paranet.paranetName : null);

        const data = {
          network: network,
          blockchain: chain_name
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/paranets/info`,
          data,
          config
        );

        setParanets(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [network]);

  const handleParanetChange = async (pnet) => {
    set_paranet(null);
    if (pnet.paranetName === "No Paranet Selected") {
      setSelectedParanet(null);
    } else {
      set_paranet(pnet);
      setSelectedParanet(pnet.paranetName);
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
          mt="0px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          zIndex="500"
        >
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: "none", bgColor: `${tracColor} !important`, color: "#ffffff" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="4px"
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
            paranets.map((pnet, index) => (
              <Flex flexDirection="column" p="10px" key={index}>
                <MenuItem
                  _hover={{ bg: "none", bgColor: `${tracColor} !important`, color: "#ffffff" }}
                  _focus={{ bg: "none" }}
                  borderRadius="8px"
                  px="4px"
                  onClick={() => handleParanetChange(pnet)}
                  value={pnet.paranetName}
                  color={tracColor}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  <Avatar
                    boxShadow="md"
                    backgroundColor="#FFFFFF"
                    src={
                      pnet.chainId === 2043 || pnet.chainId === 20430
                        ? `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
                        : pnet.chainId === 100 || pnet.chainId === 10200
                        ? `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
                        : pnet.chainId === 8453 || pnet.chainId === 84532
                        ? `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`
                        : ""
                    }
                    w="35px"
                    h="35px"
                    mr="10px"
                  />
                  {pnet.paranetName}
                </MenuItem>
              </Flex>
            ))}
        </MenuList>
      </Menu>
    )
  );
};

export default ParanetDrop;
