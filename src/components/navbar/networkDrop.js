import React, { useState, useEffect, useContext } from "react";
import {
  Menu, MenuButton, MenuItem, MenuList, useColorModeValue, Flex
} from "@chakra-ui/react";
import { AccountContext } from "../../AccountContext";

const NetworkDrop = ({ network }) => {
  const [netwrk, setNetwrk] = useState("DKG Mainnet");
  const { setParanet, setFormat } = useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    network("DKG Mainnet");
    localStorage.setItem("network", "DKG Mainnet");
  }, []);

  const handleNetworkChange = async (input) => {
    setNetwrk(input);
    network(input);
    setParanet({name: "No Paranet Selected"})
    setFormat(null)
    localStorage.setItem("network", input);
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
        {netwrk}
      </MenuButton>
      <MenuList
        p="0px"
        mt="10px"
        borderRadius="20px"
        bg={useColorModeValue("white", "navy.800")}
        border="none"
      >
        <Flex flexDirection="column" p="10px">
          <MenuItem
            _hover={{ bg: "none", bgColor: `${tracColor} !important` , color: "#ffffff" }}
            _focus={{ bg: "none" }}
            borderRadius="8px"
            px="14px"
            onClick={() => handleNetworkChange("DKG Mainnet")}
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
            _hover={{ bg: "none", bgColor: `${tracColor} !important`, color: "#ffffff" }}
            _focus={{ bg: "none" }}
            borderRadius="8px"
            px="14px"
            onClick={() => handleNetworkChange("DKG Testnet")}
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
