// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import Preview from "views/admin/publish/components/Preview.js";
import React, { useState, useEffect, useContext } from "react";
// Assets
import { MdEdit } from "react-icons/md";
import { AccountContext } from "../../../../AccountContext";
import {
  MdBarChart,
  MdStars,
  MdHome,
  MdComputer,
  MdDashboard,
  MdInventory,
  MdAnchor,
  MdArrowCircleLeft,
  MdOutlineCalendarToday,
  MdSearch
} from "react-icons/md";

export default function Project(props) {
  const { txn_id, ranking, link, image, epochs, app_name, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const bg = useColorModeValue("white", "navy.700");
  const tracColor = useColorModeValue("brand.900", "white");
  const { open_view_asset, setOpenViewAsset } = useContext(AccountContext);

  if (open_view_asset) {
    return (
      <Preview asset_data={open_view_asset}/>  
    );
  }

  return (
    <Card bg={bg} {...rest} p="14px">
      <Flex align="center" direction={{ base: "column", md: "row" }}>
        <Image h="40px" w="40px" src={image} borderRadius="8px" me="20px" />
        <Box mt={{ base: "10px", md: "0" }}>
          <Text
            color={textColorPrimary}
            fontWeight="500"
            fontSize="md"
            mb="4px"
          >
            {txn_id}
          </Text>
          <Flex w="100%" align="center">
            <Text
              fontWeight="500"
              color={textColorSecondary}
              fontSize="sm"
              me="4px"
            >
              From {app_name} for
            </Text>
            <Text fontWeight="500" color={tracColor} fontSize="sm" me="4px">
              {`${epochs} epochs`}
            </Text>
          </Flex>
        </Box>
        <Button
          variant="darkBrand"
          color="white"
          fontSize="sm"
          fontWeight="500"
          borderRadius="70px"
          px="16px"
          py="5px"
          ml="auto"
          onClick={() => setOpenViewAsset(txn_id)}
        >
          View
        </Button>
      </Flex>
    </Card>
  );
}
