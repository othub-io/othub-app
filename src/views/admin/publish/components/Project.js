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
import axios from "axios";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

export default function Project(props) {
  const { paranet_ual, txn_id, ranking, link, image, epochs, app_name, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const bg = useColorModeValue("white", "navy.700");
  const tracColor = useColorModeValue("brand.900", "white");
  const [paranets, setParanets] = useState(null);
  const { open_view_asset, setOpenViewAsset } = useContext(AccountContext);
  const {
    network,
  } = useContext(AccountContext);

  useEffect(() => {
    async function fetchData() {
      try {

        const data = {
          //network: network,
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
  }, []);

  if (open_view_asset) {
    return (
      <Preview asset_data={open_view_asset}/>  
    );
  }

  return (
    <Card bg={bg} {...rest} p="14px" h="100px">
      <Flex align="center" direction={{ base: "column", md: "row" }} mt="auto" mb="auto">
        <Image h="40px" w="40px" src={image} borderRadius="8px" me="20px" />
        <Box mt={{ base: "10px", md: "0" }}>
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="md"
            mb="4px"
          >
            {paranets && paranet_ual && paranets.some(paranet => paranet.ual === paranet_ual) ? 
            paranets.find(paranet => paranet.ual === paranet_ual).name : 
            txn_id}
          </Text>
          <Flex w="100%" align="center">
            <Text
              fontWeight="500"
              color={textColorSecondary}
              fontSize="sm"
              me="4px"
            >
              From <span color={tracColor}>{app_name}</span> for
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
