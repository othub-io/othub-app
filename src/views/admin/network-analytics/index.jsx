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
import AssetSize from "views/admin/network-analytics/components/AssetSize";
import TracSpent from "views/admin/network-analytics/components/TracSpent";
import Rewards from "views/admin/network-analytics/components/Rewards";
import Earnings from "views/admin/network-analytics/components/Earnings";
import Epochs from "views/admin/network-analytics/components/Epochs";
import NodeStakes from "views/admin/network-analytics/components/NodeStakes";
import axios from "axios";
import { AccountContext } from "../../../AccountContext";
import Loading from "components/effects/Loading";
import Card from "components/card/Card.js";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";
  const [inputValue, setInputValue] = useState("");
  const [button, setButtonSelect] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const [latest_pubs, setLatestPubs] = useState(null);
  const [latest_nodes, setLatestNodes] = useState(null);
  const [asset_data, setAssetData] = useState(null);
  const [latest_publishers, setLatestPublishers] = useState(null);
  const [latest_delegators, setLatestDelegators] = useState(null);
  const [total_pubs, setTotalPubs] = useState(null);
  const [monthly_pubs, setMonthlyPubs] = useState(null);
  const [monthly_nodes, setMonthlyNodes] = useState(null);
  const [last_pubs, setLastPubs] = useState(null);
  const [last_nodes, setLastNodes] = useState(null);
  const [activity_data, setActivityData] = useState(null);
  const [pubs, setPubs] = useState(null);
  const [price, setPrice] = useState("");
  let total_stake = 0;
  let total_rewards = 0;
  let last_stake = 0;
  let last_rewards = 0;
  let total_stored = 0;
  let total_delegators = 0;
  let active_assets = 0;

  useEffect(() => {
    async function fetchData() {
      try {
        if (network) {
          // const rsp = await axios.get(
          //   "https://api.coingecko.com/api/v3/coins/origintrail"
          // );
          // setPrice(rsp.data.market_data.current_price.usd);

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

          data = {
            network: network,
            frequency: "latest",
            blockchain: blockchain,
          };
          response = await axios.post(
            // `${process.env.REACT_APP_API_HOST}/pubs/stats`,
            `${process.env.REACT_APP_API_HOST}/nodes/stats`,
            data,
            config
          );
          setLatestNodes(response.data.result);

          // data = {
          //   network: network,
          //   frequency: "latest",
          //   blockchain: blockchain,
          // };
          // response = await axios.post(
          //   `${process.env.REACT_APP_API_HOST}/delegators/stats`,
          //   data,
          //   config
          // );
          // setLatestDelegators(response.data.result);

          data = {
            network: network,
            blockchain: blockchain,
            frequency: "total",
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/pubs/stats`,
            data,
            config
          );

          setTotalPubs(response.data.result[0].data[0]);

          data = {
            frequency: "monthly",
            timeframe: "1000",
            network: network,
            blockchain: blockchain,
            grouped: "yes",
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/nodes/stats`,
            data,
            config
          );
          setMonthlyNodes(response.data.result);

          data = {
            network: network,
            blockchain: blockchain,
            frequency: "last30d",
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/nodes/stats`,
            data,
            config
          );

          setLastNodes(response.data.result);

          // data = {
          //   network: network,
          //   blockchain: blockchain,
          // };

          // response = await axios.post(
          //   `${process.env.REACT_APP_API_HOST}/pubs/activity`,
          //   data,
          //   config
          // );

          // setActivityData(response.data.result);

          // data = {
          //   network: network,
          //   frequency: "latest",
          //   blockchain: blockchain,
          // };
          // response = await axios.post(
          //   `${process.env.REACT_APP_API_HOST}/publishers/stats`,
          //   data,
          //   config
          // );
          // setLatestPublishers(response.data.result);

          // data = {
          //   network: network,
          //   limit: '1000000000'
          // };
          // response = await axios.post(
          //   `${process.env.REACT_APP_API_HOST}/assets/info`,
          //   data,
          //   config
          // );
          // console.log(response.data.result[0].data)
          // setPubs(response.data.result[0].data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setLatestPubs("");
    setLastPubs("");
    setLatestNodes("");
    setLastNodes("");
    setLatestDelegators("");
    setInputValue("");
    fetchData();
  }, [network, blockchain]);

  // if (latest_nodes) {
  //   for (const node of latest_nodes[0].data) {
  //     total_stake = total_stake + node.nodeStake;
  //     total_rewards = total_rewards + node.cumulativePayouts;
  //   }
  // }

  // if (last_nodes) {
  //   for (const node of last_nodes[0].data) {
  //     last_stake = last_stake + node.nodeStake;
  //     last_rewards = last_rewards + node.cumulativePayouts;
  //   }
  // }

  // if (latest_delegators) {
  //   for (const chain of latest_delegators) {
  //     total_delegators = chain.data.length + total_delegators;
  //   }
  // }

  // if(pubs){
  //   for(const pub of pubs){
  //     if(pub.winners){
  //       //console.log(pub)
  //       if(pub.winners.length < pub.epochs_number){
  //         active_assets = active_assets + 1
  //       }
  //     }
  //   }
  // }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
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
