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
import { AccountContext } from "../../AccountContext";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const BlockchainDrop = ({network, blockchain}) => {
  const [selectedBlockchain, setSelectedBlockchain] = useState(null);
  const [chains, setChains] = useState(null);

  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    async function fetchData() {
      try {
        blockchain("");
        setSelectedBlockchain(null)

        const data = {
          network: network,
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/misc/blockchains`,
          data,
          config
        );

        setChains(response.data.blockchains)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [network]);

  const handleBlockchainChange = async (input) => {
    if(input === "All Blockchains"){
      blockchain("");
      setSelectedBlockchain(null)
    }else{
      blockchain(input);
      setSelectedBlockchain(input)
    }
  };

  return (
    <Menu>
      <MenuButton
        variant="darkBrand"
        color="white"
        bgColor={tracColor}
        fontSize="md"
        fontWeight="500"
        borderRadius="70px"
        marginRight="20px"
        px="24px"
        py="5px"
      >
        {selectedBlockchain ? selectedBlockchain : "All Blockchains"}
      </MenuButton>
      <MenuList
        boxShadow={shadow}
        p="0px"
        mt="10px"
        borderRadius="20px"
        bg={menuBg}
        border="none"
      >
        <Flex flexDirection="column" p="10px" key={blockchain.chain_name}>
            <MenuItem
              _hover={{ bg: "none", bgColor: `${tracColor} !important`, color: "#ffffff" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={(e) => handleBlockchainChange(e.target.value)}
              value={"All Blockchains"}
              color={tracColor}
              fontSize="20px"
              fontWeight="bold"
            >
              All Blockchains
            </MenuItem>
          </Flex>
        {chains && chains.map((blockchain) => (
          <Flex flexDirection="column" p="10px" key={blockchain.chain_name}>
            <MenuItem
              _hover={{ bg: "none", bgColor: `${tracColor} !important`, color: "#ffffff" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              onClick={(e) => handleBlockchainChange(e.target.value)}
              value={blockchain.chain_name}
              color={tracColor}
              fontSize="20px"
              fontWeight="bold"
            >
              {blockchain.chain_name}
            </MenuItem>
          </Flex>
        ))}
      </MenuList>
    </Menu>
  );
};

export default BlockchainDrop;
