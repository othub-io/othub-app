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
  Stack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect, useContext } from "react";
import NodeTable from "views/admin/nodes/components/NodeTable";
import MarketCapChart from "views/admin/nodes/components/MarketCapChart";
import { columnsDataComplex } from "views/admin/overview/variables/activityColumns";
import axios from "axios";
import { AccountContext } from "../../../AccountContext";
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
  const { blockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const [node_info, setNodeInfo] = useState(null);
  const [node_data, setNodeData] = useState(null);
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

  const calcAPR = (node, daily_node_records) => {
    if (!daily_node_records) return 0;

    const node_records = daily_node_records.filter(
      (obj) => obj.nodeId === node.nodeId && obj.chainId === node.chainId
    );

    if (node_records.length === 0) {
      return 0;
    }

    let nStake = 0;
    for (const record of node_records) {
      nStake = nStake + record.nodeStake;
    }

    nStake = nStake / node_records.length;
    if (nStake < 50000) return 0;

    const last30Objects = node_records.slice(-30);

    let estimatedEarnings = 0;
    for (const record of last30Objects) {
      estimatedEarnings = estimatedEarnings + record.estimatedEarnings;
    }

    let apr = ((estimatedEarnings / 30 / nStake) * 365 * 100).toFixed(2);

    return apr;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const rsp = await axios.get(
          "https://api.coingecko.com/api/v3/coins/origintrail"
        );
        setPrice(rsp.data.market_data.current_price.usd);

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
          settings = {
            frequency: "daily",
            network: network,
            blockchain: chain.blockchain_name,
            limit: 10000,
          };

          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/nodes/stats`,
            settings,
            config
          );

          let daily_node_records = response.data.result[0].data;

          for (const node of chain.data) {
            stake = stake + node.nodeStake;

            const nodeAPR = calcAPR(node, daily_node_records);
            node.apr = nodeAPR;

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

        if (node_id && chain_id) {
          setOpenNodePage([node_id, chain_id]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setNodeData(null);
    setTotalStake(null);
    setNodeInfo(null);
    setDelegatorData(null);
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
          maxH={{ base: "auto", md: "200px" }} // Adjust min height for mobile view
        >
          <Card boxShadow="md" maxH="200px">
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
          <Card boxShadow="md" maxH="200px">
            <Text
              color={tracColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Most Assets Won
            </Text>
            <Box
              ml="10px"
              display="flex"
              flexDirection="column" // Arrange items in a column
              //alignItems="baseline"
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
                          mb="5px"
                        >
                          <Card boxShadow="md" h="40px" w="100%" mb="5px">
                            <Flex
                              justifyContent="space-between"
                              w="100%"
                              mt="-10px"
                            >
                              <Flex
                                flex="1"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                color={textColor}
                                fontWeight="bold"
                                fontSize="18px"
                              >
                                {`${index + 1}${arr[index]} `}
                              </Flex>
                              <Flex
                                flex="1"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                color={tracColor}
                                fontWeight="bold"
                                fontSize="18px"
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
                                fontSize="18px"
                              >
                                {node.pubsCommited >= 1000000
                                  ? (node.pubsCommited / 1000000).toFixed(0) +
                                    "M"
                                  : node.pubsCommited >= 1000
                                  ? (node.pubsCommited / 1000).toFixed(0) + "K"
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
                <Flex justify="center" align="center" h="100%" mt="30px">
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
            </Box>
          </Card>
          <Card boxShadow="md" maxH="200px">
            <Text
              color={tracColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Most Rewarded
            </Text>
            <Box
              ml="10px"
              mb="20px"
              display="flex"
              flexDirection="column" // Arrange items in a column
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
                          mb="5px"
                        >
                          <Card boxShadow="md" h="40px" w="100%" mb="5px">
                            <Flex
                              justifyContent="space-between"
                              w="100%"
                              mt="-10px"
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
                                  ? (node.cumulativePayouts / 1000000).toFixed(
                                      0
                                    ) + "M"
                                  : node.cumulativePayouts >= 1000
                                  ? (node.cumulativePayouts / 1000).toFixed(0) +
                                    "K"
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
                <Flex justify="center" align="center" h="100%" mt="30px">
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
            </Box>
          </Card>
          <Card boxShadow="md" maxH="200px">
            <Text
              color={tracColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Most Delegators
            </Text>
            {delegator_data ? (
              delegator_data.map((delegator, index) => (
                <Box key={index} display="flex" alignItems="baseline" w="100%">
                  <Card boxShadow="md" h="40px" w="100%" mb="10px">
                    <Flex justifyContent="space-between" w="100%" mt="-10px">
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
              <Flex justify="center" align="center" h="100%" mt="20px">
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
          <Card
              direction="column"
              w="100%"
              h="800px"
              px="0px"
              overflowX={{ sm: "scroll", lg: "hidden" }}
              boxShadow="md"
            >
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
                    Loading Nodes...
                  </Text>
                </Stack>
              </Flex>
            </Card>
        )}
      </SimpleGrid>
    </Box>
  );
}
