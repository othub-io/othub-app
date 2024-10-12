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

// Chakra imports
import {
  Box,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import AssetsMinted from "views/admin/network-analytics/components/AssetsMinted";
import AssetCost from "views/admin/network-analytics/components/AssetCost";
import AssetBid from "views/admin/network-analytics/components/AssetBid";
import AssetSize from "views/admin/network-analytics/components/AssetSize";
import AssetPrivacy from "views/admin/network-analytics/components/AssetPrivacy";
import TracSpent from "views/admin/network-analytics/components/TracSpent";
import Rewards from "views/admin/network-analytics/components/Rewards";
import Earnings from "views/admin/network-analytics/components/Earnings";
import Epochs from "views/admin/network-analytics/components/Epochs";
import NodeStakes from "views/admin/network-analytics/components/NodeStakes";
import NodeCount from "views/admin/network-analytics/components/NodeCount";
import axios from "axios";
import { AccountContext } from "../../../AccountContext";
import Loading from "components/effects/Loading";
import Card from "components/card/Card.js";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

export default function UserReports() {
  const { network, blockchain } = useContext(AccountContext);
  const [latest_nodes, setLatestNodes] = useState(null);
  const [asset_data, setAssetData] = useState(null);
  const [total_pubs, setTotalPubs] = useState(null);
  const [monthly_nodes, setMonthlyNodes] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!network) {
          return;
        }

        let data = {
          network: network,
          frequency: "monthly",
          blockchain: blockchain,
          timeframe: "1000",
          grouped: "yes"
        };
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/pubs/stats`,
          data,
          config
        );
        setAssetData(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setAssetData(null);
    fetchData();
  }, [network, blockchain]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!network) {
          return;
        }

        let data = {
          network: network,
          blockchain: blockchain,
          frequency: "total",
        };
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/pubs/stats`,
          data,
          config
        );
        setTotalPubs(response.data.result[0].data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setTotalPubs(null);
    fetchData();
  }, [network, blockchain]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!network) {
          return;
        }

        let data = {
          frequency: "monthly",
          timeframe: "1000",
          network: network,
          blockchain: blockchain,
          grouped: "yes",
        };
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data,
          config
        );
        setMonthlyNodes(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setMonthlyNodes(null);
    fetchData();
  }, [network, blockchain]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!network) {
          return;
        }

        let data = {
          network: network,
          frequency: "latest",
          blockchain: blockchain,
        };
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data,
          config
        );
        setLatestNodes(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setLatestNodes(null);
    fetchData();
  }, [network, blockchain]);

  return (
    <Box pt={{ base: "250px", md: "180px", lg: "180px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        {total_pubs && asset_data ? (
          <AssetsMinted
            last_pubs={total_pubs}
            total_pubs={total_pubs}
            asset_data={asset_data}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}

        {monthly_nodes && latest_nodes ? (
          <Rewards
            monthly_nodes={monthly_nodes}
            latest_nodes={latest_nodes}
            last_nodes={latest_nodes}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}

        {monthly_nodes && latest_nodes ? (
          <Earnings
            monthly_nodes={monthly_nodes}
            latest_nodes={latest_nodes}
            last_nodes={latest_nodes}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}

        {total_pubs && asset_data ? (
          <TracSpent
            last_pubs={total_pubs}
            total_pubs={total_pubs}
            asset_data={asset_data}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}
        {monthly_nodes && latest_nodes ? (
          <NodeStakes
            monthly_nodes={monthly_nodes}
            latest_nodes={latest_nodes}
            last_nodes={latest_nodes}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}

{monthly_nodes && latest_nodes ? (
          <NodeCount
            monthly_nodes={monthly_nodes}
            latest_nodes={latest_nodes}
            last_nodes={latest_nodes}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}

        {total_pubs && asset_data ? (
          <AssetCost
            last_pubs={total_pubs}
            total_pubs={total_pubs}
            asset_data={asset_data}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}
        {/* {total_pubs && asset_data ? (
          <AssetBid
            last_pubs={total_pubs}
            total_pubs={total_pubs}
            asset_data={asset_data}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )} */}

        {total_pubs && asset_data ? (
          <AssetSize
            last_pubs={total_pubs}
            total_pubs={total_pubs}
            asset_data={asset_data}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}
        {total_pubs && asset_data ? (
          <AssetPrivacy
            last_pubs={total_pubs}
            total_pubs={total_pubs}
            asset_data={asset_data}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}

        {total_pubs && asset_data ? (
          <Epochs
            last_pubs={total_pubs}
            total_pubs={total_pubs}
            asset_data={asset_data}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
          >
            <Flex flexDirection="column" me="20px" mt="28px">
              <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
                <Box minH="260px" minW="75%" mx="auto">
                  <Loading />
                </Box>
              </Flex>
            </Flex>
          </Card>
        )}
      </SimpleGrid>
    </Box>
  );
}
