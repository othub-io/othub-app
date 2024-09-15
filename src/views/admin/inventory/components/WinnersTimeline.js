// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, { useState, useEffect, useContext } from "react";
import {
  IoHeart,
  IoHeartOutline,
  IoThumbsDown,
  IoThumbsDownOutline,
  IoThumbsUp,
  IoThumbsUpOutline,
} from "react-icons/io5";
import AssetPage from "views/admin/knowledge-assets/components/AssetPage";
import { AccountContext } from "../../../../AccountContext";
import axios from "axios";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function getTokenNameById(node_list, node_id) {
  if (!Array.isArray(node_list)) {
    return "Unknown"; // Fallback if node_list is not an array
  }
  const node = node_list.find((node) => node.nodeId === node_id);
  return node ? node.tokenName : "Unknown"; // Return "Unknown" if not found
}

export default function NFT(props) {
  const { winners, chainName } = props;
  const [node_list, setNodeList] = useState([]);
  const {
    blockchain,
    setBlockchain,
    network,
    setNetwork,
    open_asset_page,
    setOpenAssetPage,
  } = useContext(AccountContext);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBid = useColorModeValue("brand.500", "white");
  const [asset_data, setAssetData] = useState(null);
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const settings = {
          network: network,
          blockchain: chainName,
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/info`,
          settings,
          config
        );

        const nodeListData = response.data.result?.[0]?.data || [];
        setNodeList(nodeListData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [winners, chainName, network]);

  return (
    <SimpleGrid columns="1" mb="20px">
      <Card boxShadow="md" minH="150px">
        <Text color={textColor} fontSize="22px"
            fontWeight="700">
          Hosted by
        </Text>
        <SimpleGrid
          columns={{ sm: 2, md: 4, lg: 7 }}
          gap="20px"
          mt="10px"
          mb="10px"
        >
          {winners &&
            JSON.parse(winners).map((winner_group, index) => (
              <Card
                key={index}
                boxShadow="md"
                w="200px"
                minW="200px"
                maxH="120px"
              >
                <Flex direction="column" mt="-15px">
                  <Text
                    color="gray.400"
                    fontSize="18px"
                    fontWeight="800"
                    borderBottom="1px"
                    borderColor="#11047A"
                  >
                    {`Epoch ${index + 1}`}
                  </Text>
                  {winner_group.map((node_id, idx) => (
                    <Text
                      key={idx}
                      color="#11047A"
                      fontSize="18px"
                      fontWeight="600"
                    >
                      {getTokenNameById(node_list, node_id).slice(0, 18)}
                    </Text>
                  ))}
                </Flex>
              </Card>
            ))}
        </SimpleGrid>
      </Card>
    </SimpleGrid>
  );
}
