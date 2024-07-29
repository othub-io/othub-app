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
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  Input,
  Text,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect, useContext } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import NetworkActivityTable from "views/admin/default/components/networkActivityTable";
import CumEarnings from "views/admin/default/components/cumEarnings";
import CumRewards from "views/admin/default/components/cumRewards";
import AssetPrivacy from "views/admin/default/components/assetPrivacy";
import AssetsPublished from "views/admin/default/components/assetsPublished";
import PublishersDominance from "views/admin/default/components/publishersDominance";
import Test from "views/admin/default/components/test";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import NodeTable from "views/admin/nodes/components/NodeTable";
import MarketCapChart from "views/admin/nodes/components/MarketCapChart";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/activityColumns";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import axios from "axios";
import { AccountContext } from "../../../AccountContext";
import ReactApexChart from "react-apexcharts";
import Loading from "components/effects/Loading";
import Card from "components/card/Card.js";
import NodePage from "views/admin/nodes/components/NodePage";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Settings() {
  // Chakra Color Mode
  const { open_node_page, setOpenNodePage } = useContext(AccountContext);
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const [node_info, setNodeInfo] = useState(null);
  const [node_data, setNodeData] = useState(null);
  const [monthly_node, setMonthlyNode] = useState(null);
  const [latest_node, setLatestNode] = useState(null);
  const [delegator_data, setDelegatorData] = useState(null);
  const [total_stake, setTotalStake] = useState(null);
  const tracColor = useColorModeValue("brand.900", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [price, setPrice] = useState("");

  const queryParameters = new URLSearchParams(window.location.search);
  const node_id = queryParameters.get("node_id");
  const chain_id = queryParameters.get("chain_id");
  let stake = 0;
  let arr = ["st", "nd", "rd"];

  useEffect(() => {
    async function fetchData() {
      try {
        const rsp = await axios.get(
          "https://api.coingecko.com/api/v3/coins/origintrail"
        );
        setPrice(rsp.data.market_data.current_price.usd);

        setNodeData(null);
        let settings = {
          network: network,
          blockchain: blockchain,
        };

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/info`,
          settings,
          config
        );

        let node_list = [];

        for (const chain of response.data.result) {
          for (const node of chain.data) {
            stake = stake + node.nodeStake;
            // console.log(node)
            // settings = {
            //   network: network,
            //   blockchain: node.chainName,
            //   frequency: "last24h",
            //   nodeId: node.nodeId
            // };

            // response = await axios.post(
            //   `${process.env.REACT_APP_API_HOST}/nodes/stats`,
            //   settings,
            //   config
            // );

            // console.log(response.data.result[0].data[0])
            // node.pubs24h = response.data.result[0].data[0].pubsCommited
            // node.earnings24h = response.data.result[0].data[0].estimatedEarnings
            node_list.push(node);
          }
        }
        setTotalStake(stake);
        setNodeInfo(node_list);

        settings = {
          timeframe: "7",
          frequency: "monthly",
          network: network,
          blockchain: blockchain,
          grouped: "yes",
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          settings,
          config
        );

        setNodeData(response.data.result);

        settings = {
          network: network,
          blockchain: blockchain,
          frequency: "latest",
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/delegators/stats`,
          settings,
          config
        );

        let counts = {};

        response.data.result[0].data.forEach((obj) => {
          let tokenName = obj.tokenName;
          counts[tokenName] = (counts[tokenName] || 0) + 1;
        });

        // Step 2: Convert counts object to an array of objects with tokenName and delegators properties
        let countsArray = Object.keys(counts).map((tokenName) => {
          return { tokenName: tokenName, delegators: counts[tokenName] };
        });

        // Step 3: Sort the array by delegators in descending order
        countsArray.sort((a, b) => b.delegators - a.delegators);

        // Step 4: Extract the top 3 objects
        let top3TokenNames = countsArray.slice(0, 3);

        setDelegatorData(top3TokenNames);

        if(node_id && chain_id){
          setOpenNodePage([node_id, chain_id])
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [blockchain, network, chain_id, node_id]);

  if (open_node_page && network && price && node_data && delegator_data) {
    return <NodePage open_node_page={open_node_page} price={price} />;
  }

  return (
    <Box mt={{ base: "60px", md: "80px", xl: "80px" }}>
      {/* pt={{ base: "130px", md: "80px", xl: "80px" }} */}
      {!open_node_page && (
        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 2, xl: 4 }}
          gap="20px"
          mb="20px"
          minH={{ base: "auto", md: "200px" }} // Adjust min height for mobile view
        >
          <Card boxShadow="md">
            <Text
              color={tracColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Market Cap
            </Text>
            <Text
              color={textColor}
              fontSize="28px"
              fontWeight="700"
              lineHeight="100%"
              mt="10px"
            >
              {total_stake
                ? "$" + formatNumberWithSpaces((total_stake * price).toFixed(2))
                : ""}
            </Text>
            {node_data ? (
              <MarketCapChart node_data={node_data[0].data} />
            ) : (
              <Loading />
            )}
          </Card>
          <Card boxShadow="md">
            <Text
              color={tracColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
              mb="20px"
            >
              Most Assets Won
            </Text>
            <Box
              ml="10px"
              display="flex"
              flexDirection="column" // Arrange items in a column
              alignItems="baseline"
            >
              {node_info ? (
                node_info
                  .sort((a, b) => b.pubsCommited - a.pubsCommited)
                  .map((node, index) => {
                    if (index <= 2) {
                      return (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="baseline"
                          w="100%"
                        >
                          <Card
                            boxShadow="md"
                            h="50px"
                            w="100%"
                            mb="5px"
                          >
                            <Flex
                              justifyContent="space-between"
                              w="100%"
                              mt="-5px"
                            >
                              <Flex
                                flex="1"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                color={textColor}
                                fontWeight="bold"
                                fontSize="20px"
                              >
                                {`${index + 1}${arr[index]} `}
                              </Flex>
                              <Flex
                                flex="1"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                color={tracColor}
                                fontWeight="bold"
                                fontSize="20px"
                                mr="auto"
                              >
                                {`${node.tokenName}`}
                              </Flex>
                              <Flex
                                flex="1"
                                justifyContent="flex-end"
                                alignItems="flex-end"
                                color="gray.400"
                                fontWeight="bold"
                                fontSize="20px"
                              >
                                {node.pubsCommited >= 1000000
                                ? (node.pubsCommited  / 1000000).toFixed(0) + "M"
                                : node.pubsCommited >= 1000
                                ? (node.pubsCommited  / 1000).toFixed(0) + "K"
                                : node.pubsCommited.toFixed(0)}
                              </Flex>
                            </Flex>
                          </Card>
                        </Box>
                      );
                    }
                    return null;
                  })
              ) : (
                <Loading />
              )}
            </Box>
          </Card>
          <Card boxShadow="md">
            <Text
              color={tracColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
              mb="20px"
            >
              Most Rewarded
            </Text>
            <Box
              ml="10px"
              mb="20px"
              display="flex"
              flexDirection="column" // Arrange items in a column
              alignItems="baseline"
            >
              {node_info ? (
                node_info
                  .sort((a, b) => b.cumulativePayouts - a.cumulativePayouts)
                  .map((node, index) => {
                    if (index <= 2) {
                      return (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="baseline"
                          w="100%"
                        >
                          <Card
                            boxShadow="md"
                            h="50px"
                            w="100%"
                            mb="5px"
                          >
                            <Flex
                              justifyContent="space-between"
                              w="100%"
                              mt="-5px"
                            >
                              <Flex
                                flex="1"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                color={textColor}
                                fontWeight="bold"
                                fontSize="20px"
                              >
                                {`${index + 1}${arr[index]} `}
                              </Flex>
                              <Flex
                                flex="1"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                color={tracColor}
                                fontWeight="bold"
                                fontSize="20px"
                                mr="auto"
                              >
                                {`${node.tokenName.slice(0, 10)}`}
                              </Flex>
                              <Flex
                                flex="1"
                                justifyContent="flex-end"
                                alignItems="flex-end"
                                color="gray.400"
                                fontWeight="bold"
                                fontSize="20px"
                              >
                                {node.cumulativePayouts >= 1000000
                                ? (node.cumulativePayouts  / 1000000).toFixed(0) + "M"
                                : node.cumulativePayouts >= 1000
                                ? (node.cumulativePayouts  / 1000).toFixed(0) + "K"
                                : node.cumulativePayouts.toFixed(0)}
                              </Flex>
                            </Flex>
                          </Card>
                        </Box>
                      );
                    }
                    return null;
                  })
              ) : (
                <Loading />
              )}
            </Box>
          </Card>
          <Card boxShadow="md">
            <Text
              color={tracColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
              mb="20px"
            >
              Most Delegators
            </Text>
            {delegator_data ? (
              delegator_data.map((delegator, index) => (
                <Box
                key={index}
                display="flex"
                alignItems="baseline"
                w="100%"
              >
                <Card
                  boxShadow="md"
                  h="50px"
                  w="100%"
                  mb="5px"
                >
                  <Flex
                    justifyContent="space-between"
                    w="100%"
                    mt="-5px"
                  >
                    <Flex
                      flex="1"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      color={textColor}
                      fontWeight="bold"
                      fontSize="20px"
                    >
                      {`${index + 1}${arr[index]} `}
                    </Flex>
                    <Flex
                      flex="1"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      color={tracColor}
                      fontWeight="bold"
                      fontSize="20px"
                      mr="auto"
                    >
                      {`${delegator.tokenName.slice(0, 10)}`}
                    </Flex>
                    <Flex
                      flex="1"
                      justifyContent="flex-end"
                      alignItems="flex-end"
                      color="gray.400"
                      fontWeight="bold"
                      fontSize="20px"
                    >
                      {`${delegator.delegators}`}
                    </Flex>
                  </Flex>
                </Card>
              </Box>
              ))
            ) : (
              <Loading />
            )}
          </Card>
        </SimpleGrid>
      )}

      <SimpleGrid
        columns={{ base: 1, md: 1, xl: 1 }}
        gap="20px"
        mb="20px"
        minH="auto"
        overflow="visible" // Ensure content is visible without overlap
      >
        {node_info && !open_node_page ? (
          <NodeTable
            columnsData={columnsDataComplex}
            node_data={node_info}
            price={price}
          />
        ) : (
          <Loading />
        )}
      </SimpleGrid>
    </Box>
  );
}
