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
  const [node_profiles, setNodeProfiles] = useState(null);

  const queryParameters = new URLSearchParams(window.location.search);
  const node_id = queryParameters.get("node_id");
  const chain_id = queryParameters.get("chain_id");

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
            node_list.push(...chain.data);
        }
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

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/profile`,
          {},
          config
        );

        setNodeProfiles(response.data.result);
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

  const checkLogo = (node_id, chain_id) => {
    if (!node_profiles) return null;

    const foundObject = node_profiles.find(
      (obj) => obj.node_id === node_id && obj.chain_id === chain_id
    );

    return foundObject ? foundObject.node_logo : null;
  };

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
            <Flex
              flexDirection="column" // Arrange items in a column
              h="100%"
              pt="10px"
            >
              {node_info ? (
                node_info
                  .sort((a, b) => b.pubsCommited - a.pubsCommited)
                  .map((node, index) => {
                    const logoSrc = checkLogo(node.nodeId, node.chainId);
                    if (index <= 2) {
                      return (
                        <Flex w="90%" h="33%">
                          <Flex mt="auto" mb="auto" w="20px">
                            <Text
                              color={textColor}
                              fontSize="md"
                              fontWeight="700"
                            >
                              {`${index + 1}`}
                            </Text>
                          </Flex>
                          <Flex>
                            <Avatar
                              boxShadow="md"
                              backgroundColor="#FFFFFF"
                              src={
                                logoSrc
                                  ? `${process.env.REACT_APP_API_HOST}/images?src=${logoSrc}`
                                  : node.chainId === 2043 ||
                                    node.chainId === 20430
                                  ? `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
                                  : node.chainId === 100 ||
                                    node.chainId === 10200
                                  ? `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
                                  : node.chainId === 8453 ||
                                    node.chainId === 84532
                                  ? `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`
                                  : ""
                              }
                              w="35px"
                              h="35px"
                              mr="10px"
                            />
                          </Flex>
                          <Flex mt="auto" mb="auto">
                            <Text
                              color={textColor}
                              fontSize="md"
                              fontWeight="700"
                            >
                              {`${node.tokenName}`}
                            </Text>
                          </Flex>
                          <Flex
                            mt="auto"
                            mb="auto"
                            justifyContent="flex-end"
                            ml="auto"
                          >
                            <Text
                              color={textColor}
                              fontSize="md"
                              fontWeight="700"
                            >
                              {node.pubsCommited >= 1000000
                                ? (node.pubsCommited / 1000000).toFixed(0) + "M"
                                : node.pubsCommited >= 1000
                                ? (node.pubsCommited / 1000).toFixed(0) + "K"
                                : node.pubsCommited.toFixed(0)}
                            </Text>
                          </Flex>
                        </Flex>
                      );
                    }
                    return null;
                  })
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
            </Flex>
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
            <Flex
              flexDirection="column" // Arrange items in a column
              h="100%"
              pt="10px"
            >
              {node_info ? (
                node_info
                  .sort((a, b) => b.cumulativePayouts - a.cumulativePayouts)
                  .map((node, index) => {
                    const logoSrc = checkLogo(node.nodeId, node.chainId);
                    if (index <= 2) {
                      return (
                        <Flex w="90%" h="33%">
                          <Flex mt="auto" mb="auto" w="20px">
                            <Text
                              color={textColor}
                              fontSize="md"
                              fontWeight="700"
                            >
                              {`${index + 1}`}
                            </Text>
                          </Flex>
                          <Flex>
                            <Avatar
                              boxShadow="md"
                              backgroundColor="#FFFFFF"
                              src={
                                logoSrc
                                  ? `${process.env.REACT_APP_API_HOST}/images?src=${logoSrc}`
                                  : node.chainId === 2043 ||
                                    node.chainId === 20430
                                  ? `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
                                  : node.chainId === 100 ||
                                    node.chainId === 10200
                                  ? `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
                                  : node.chainId === 8453 ||
                                    node.chainId === 84532
                                  ? `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`
                                  : ""
                              }
                              w="35px"
                              h="35px"
                              mr="10px"
                            />
                          </Flex>
                          <Flex mt="auto" mb="auto">
                            <Text
                              color={textColor}
                              fontSize="md"
                              fontWeight="700"
                            >
                              {`${node.tokenName}`}
                            </Text>
                          </Flex>
                          <Flex
                            mt="auto"
                            mb="auto"
                            justifyContent="flex-end"
                            ml="auto"
                          >
                            <Text
                              color={textColor}
                              fontSize="md"
                              fontWeight="700"
                            >
                              {node.cumulativePayouts >= 1000000
                                ? (node.cumulativePayouts / 1000000).toFixed(
                                    0
                                  ) + "M"
                                : node.cumulativePayouts >= 1000
                                ? (node.cumulativePayouts / 1000).toFixed(0) +
                                  "K"
                                : node.cumulativePayouts.toFixed(0)}
                            </Text>
                          </Flex>
                        </Flex>
                      );
                    }
                    return null;
                  })
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
            </Flex>
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
            <Flex
              flexDirection="column" // Arrange items in a column
              h="100%"
              pt="10px"
            >
            {delegator_data ? (
              delegator_data.map((delegator, index) => {
                const logoSrc = checkLogo(delegator.nodeId, delegator.chainId);
                return(
                <Flex w="95%" h="33%">
                  <Flex mt="auto" mb="auto" w="20px">
                    <Text color={textColor} fontSize="md" fontWeight="700">
                      {`${index + 1}`}
                    </Text>
                  </Flex>
                  <Flex>
                    <Avatar
                      boxShadow="md"
                      backgroundColor="#FFFFFF"
                      src={
                        logoSrc
                          ? `${process.env.REACT_APP_API_HOST}/images?src=${logoSrc}`
                          : delegator.chainId === 2043 || delegator.chainId === 20430
                          ? `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
                          : delegator.chainId === 100 || delegator.chainId === 10200
                          ? `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
                          : delegator.chainId === 8453 || delegator.chainId === 84532
                          ? `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`
                          : ""
                      }
                      w="35px"
                      h="35px"
                      mr="10px"
                    />
                  </Flex>
                  <Flex mt="auto" mb="auto">
                    <Text color={textColor} fontSize="md" fontWeight="700">
                      {`${delegator.tokenName}`}
                    </Text>
                  </Flex>
                  <Flex mt="auto" mb="auto" justifyContent="flex-end" ml="auto">
                    <Text color={textColor} fontSize="md" fontWeight="700">
                      {delegator.delegators}
                    </Text>
                  </Flex>
                </Flex>)
})
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
            </Flex>
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
            node_profiles={node_profiles}
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
