/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useState, useEffect, useContext } from "react";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
  Stack,
  Spinner,
} from "@chakra-ui/react";

import TrendingKnowledge from "views/admin/knowledge-assets/components/TrendingKnowledge";
import AssetCard from "views/admin/knowledge-assets/components/AssetCard";
import Card from "components/card/Card.js";
import AssetImage from "../../../../src/assets/img/Knowledge-Asset.jpg";
import { columnsDataComplex } from "views/admin/knowledge-assets/variables/trendingKnowledgeColumns";
import { AccountContext } from "../../../AccountContext";
import AssetPage from "views/admin/knowledge-assets/components/AssetPage";
import AssetFilter from "views/admin/knowledge-assets/components/AssetFilter";
import Loading from "components/effects/Loading";
import axios from "axios";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};
const queryParameters = new URLSearchParams(window.location.search);
const url_ual = queryParameters.get("ual");

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const { blockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
  const [price, setPrice] = useState(0);
  const [recent_assets, setRecentAssets] = useState(null);
  const [trending_assets, setTrendingAssets] = useState(null);
  const [users, setUsers] = useState(null);
  const tracColor = useColorModeValue("brand.900", "white");
  const [click, setClick] = useState(1);
  const [error, setError] = useState(null);
  let data;
  let setting;
  let response;
  let topic_list = [];
  let args;

  useEffect(() => {
    async function fetchData() {
      try {
        topic_list = [];
        data = {
          network: network,
          blockchain: blockchain,
          limit: 100,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/info`,
          data,
          config
        );
        let asset_sort = response.data.result[0].data.sort(
          (a, b) => b.block_timestamp - a.block_timestamp
        );
        setRecentAssets(asset_sort);

        data = {
          network: network,
          frequency: "last7d",
          blockchain: blockchain,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/sentiment/info`,
          data,
          config
        );

        // Set to keep track of unique token_id and contract_address combinations
        let uniqueAssetCombinations = new Set();

        for (const asset of response.data.result) {
          // Construct a unique identifier for the combination
          const identifier = `${asset.token_id}-${asset.asset_contract}`;

          // Check if the combination is already in the set
          if (!uniqueAssetCombinations.has(identifier)) {
            // If not, add the object to the result array and the identifier to the set
            data = {
              network: network,
              token_id: asset.token_id,
              asset_contract: asset.asset_contract,
            };

            response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/assets/info`,
              data,
              config
            );

            topic_list.push(response.data.result[0].data[0]);

            uniqueAssetCombinations.add(identifier);
          }
        }

        let filtered_topics = topic_list.filter((topic) => {
          const diff =
            JSON.parse(topic.sentiment)[0] - JSON.parse(topic.sentiment)[1];
          return diff >= 0;
        });

        let topic_sort = filtered_topics.sort((a, b) => {
          const diffA = JSON.parse(a.sentiment)[0] - JSON.parse(a.sentiment)[1];
          const diffB = JSON.parse(b.sentiment)[0] - JSON.parse(b.sentiment)[1];
          return diffB - diffA; // For descending order
        });

        setTrendingAssets(topic_sort);

        if (url_ual) {
          const segments = url_ual.split(":");
          const argsString =
            segments.length === 3 ? segments[2] : segments[2] + segments[3];
          args = argsString.split("/");
        }

        if (args && args.length === 3) {
          data = {
            blockchain:
              args[0].replace(/\D/g, "") == 100
                ? "Gnosis Mainnet"
                : args[0].replace(/\D/g, "") == 10200
                ? "Chiado Testnet"
                : args[0].replace(/\D/g, "") == 2043
                ? "NeuroWeb Mainnet"
                : args[0].replace(/\D/g, "") == 20430
                ? "NeuroWeb Testnet"
                : args[0].replace(/\D/g, "") == 8453
                ? "Base Mainnet"
                : args[0].replace(/\D/g, "") == 84532
                ? "Base Testnet"
                : "",
            limit: 500,
            ual: url_ual,
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/assets/info`,
            data,
            config
          );

          setOpenAssetPage(response.data.result[0].data[0]);
        }

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          {},
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            },
          }
        );

        setUsers(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setRecentAssets(null);
    setTrendingAssets(null);
    setOpenAssetPage(false);
    fetchData();
  }, [blockchain, network]);

  let explorer_url = "https://dkg.origintrail.io";

  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  if (open_asset_page) {
    return <AssetPage asset_data={open_asset_page} />;
  }

  return (
    !open_asset_page && (
      <Box pt={{ base: "230px", md: "160px", lg: "160px", xl: "80px" }}>
        {/* Main Fields */}
        <Grid
          mb="20px"
          gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
          gap={{ base: "20px", xl: "20px" }}
          display={{ base: "block", xl: "grid" }}
        >
          <Flex
            flexDirection="column"
            gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
          >
            <Flex direction="column">
              {users && recent_assets && recent_assets.length > 0 ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2 , lg: 4 , xl: 4}}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  pb="20px"
                  overflow="auto"
                  maxH="1400px"
                >
                  {recent_assets.map((asset, index) => {
                    return (
                      <AssetCard
                        key={index} // Assuming UAL is unique for each asset
                        img={AssetImage}
                        download="#"
                        asset={asset}
                        users={users}
                      />
                    );
                  })}
                </SimpleGrid>
              ) : recent_assets && recent_assets.length === 0 ? (
                <SimpleGrid
                  columns={{ base: 1, md: 1 }}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  overflow="auto"
                  h="800px"
                >
                  <Flex justifyContent="center">
                    <Text
                      color="#11047A"
                      fontSize={{
                        base: "xl",
                        md: "lg",
                        lg: "lg",
                        xl: "lg",
                        "2xl": "md",
                        "3xl": "lg",
                      }}
                      mb="5px"
                      fontWeight="bold"
                      me="14px"
                      pt="40px"
                    >
                      No assets found.
                    </Text>
                  </Flex>
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, md: 1 }}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  overflow="auto"
                  h="800px"
                >
                  <Flex justifyContent="center">
                    <Stack mb="auto" mt="auto">
                      <Spinner
                        thickness="6px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color={tracColor}
                        size="xl"
                        ml="auto"
                        mr="auto"
                      />
                      <Text fontSize="md" color={tracColor}>
                        {`Searching ${blockchain} Assets...`}
                      </Text>
                    </Stack>
                  </Flex>
                </SimpleGrid>
              )}
            </Flex>
          </Flex>
          <Flex
            flexDirection="column"
            gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
          >
            <AssetFilter setRecentAssets={setRecentAssets} />
            <Card px="0px" mb="20px" minH="600px" maxH="600px" boxShadow="md">
              {users && trending_assets ? (
                <TrendingKnowledge
                  columnsData={columnsDataComplex}
                  trending_assets={trending_assets}
                  users={users}
                />
              ) : (
                <Flex justify="center" align="center" h="100%">
                <Stack spacing={4} align="center">
                  <Spinner
                    thickness="6px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={tracColor}
                    size="xl"
                  />
                  <Text fontSize="md" color={tracColor}>
                    Loading...
                  </Text>
                </Stack>
              </Flex>
              )}
            </Card>
          </Flex>
        </Grid>
        {/* Delete Product */}
      </Box>
    )
  );
}
