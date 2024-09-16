// Chakra imports
import { Box, Text, useColorModeValue, Button, Icon } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import { MdNotificationsNone, MdInfoOutline } from "react-icons/md";
import { AccountContext } from "../../../../AccountContext";
import {
  IoCopyOutline
} from "react-icons/io5";

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const handleCopyLink = async (link) => {
  try {
    await navigator.clipboard.writeText(link); // Replace with your desired link
    console.log("Link copied to clipboard!");
  } catch (error) {
    console.log("Failed to copy link to clipboard:", error);
  }
};

export default function KeyRecord(props) {
  const { api_key, setIsDeleteKey, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const bg = useColorModeValue("white", "navy.700");
  const { open_delegator_settings, setOpenDelegateSettings } =
    useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");

  return (
    <Card bg={bg} {...rest} boxShadow="md" h="100px" w="100%">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="auto"
        mt="auto"
      >
        <Box textAlign="center" ml='20px'>
          <Text
            fontSize={{ sm: "md", lg: "xl" }}
            color={tracColor}
            fontWeight="bold"
          >
            {api_key}
            <Button
            bg="none"
            _hover={{ bg: "whiteAlpha.900" }}
            _active={{ bg: "white" }}
            _focus={{ bg: "white" }}
            p="0px !important"
            borderRadius="50%"
            minW="36px"
            onClick={() => handleCopyLink(api_key)}
            mt="auto"
          >
            <Icon
              transition="0.2s linear"
              w="20px"
              h="20px"
              as={IoCopyOutline}
              color="#11047A"
              alt="Copy Link"
            />
          </Button>
          </Text>
        </Box>
        <Button
          variant="darkBrand"
          color="white"
          fontSize="sm"
          fontWeight="500"
          borderRadius="70px"
          px="5px"
          py="5px"
          onClick={() => setIsDeleteKey(api_key)}
        >
          X
        </Button>
      </Box>
    </Card>
  );
}
