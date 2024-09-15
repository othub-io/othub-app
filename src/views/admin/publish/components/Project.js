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
import { AccountContext } from "../../../../AccountContext";
import { IoMdEye } from "react-icons/io";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

export default function Project(props) {
  const {
    paranet_name,
    txn_id,
    ranking,
    link,
    image,
    epochs,
    app_name,
    blockchain,
    ...rest
  } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const bg = useColorModeValue("white", "navy.700");
  const tracColor = useColorModeValue("brand.900", "white");
  const { open_view_asset, setOpenViewAsset } = useContext(AccountContext);
  const { network } = useContext(AccountContext);

  useEffect(() => {
    async function fetchData() {
      try {
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (open_view_asset) {
    return <Preview asset_data={open_view_asset} />;
  }

  let chain_logo;
  if (blockchain === "otp:2043" || blockchain === "otp:20430") {
    chain_logo = `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`;
  }

  if (blockchain === "gnosis:100" || blockchain === "gnosis:10200") {
    chain_logo = `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`;
  }

  if (blockchain === "base:8453" || blockchain === "base:84532") {
    chain_logo = `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`;
  }

  return (
    chain_logo && (
      <Card bg={bg} {...rest} p="14px" h="80px" as={Link} onClick={() => setOpenViewAsset(txn_id)}>
        <Flex
          align="center"
          direction={{ base: "column", md: "row" }}
          mt="auto"
          mb="auto"
        >
          <Flex w="80px">
            <Image
              h="20px"
              w="20px"
              src={chain_logo}
              borderRadius="8px"
              me="0px"
              mb="auto"
            />
            <Image h="40px" w="40px" src={image} borderRadius="8px" me="20px" />
          </Flex>
          <Box mt={{ base: "10px", md: "0" }}>
            <Text color={tracColor} fontSize="md" me="4px" fontWeight="bold">
              {`Pending Asset for ${paranet_name ? paranet_name : app_name}`}
            </Text>
            <Text
              fontWeight="500"
              color={textColorSecondary}
              fontSize="sm"
              me="4px"
            >
              {`ID: ${txn_id}`}
            </Text>
          </Box>
        </Flex>
      </Card>
    )
  );
}
