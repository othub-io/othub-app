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
  Stat,
  StatLabel,
  StatNumber,
  Stack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import MiniStatistics from "components/card/MiniStatistics";
import React, { useState, useEffect, useContext } from "react";
import NetworkActivityTable from "views/admin/overview/components/networkActivityTable";
import CumEarnings from "views/admin/overview/components/cumEarnings";
import CumRewards from "views/admin/overview/components/cumRewards";
import AssetPrivacy from "views/admin/overview/components/assetPrivacy";
import AssetsPublished from "views/admin/overview/components/assetsPublished";
import PublishersDominance from "views/admin/overview/components/publishersDominance";
import {
  columnsDataComplex,
} from "views/admin/overview/variables/activityColumns";
import axios from "axios";
import { AccountContext } from "../../../AccountContext";
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
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";
  const tracColor = useColorModeValue("brand.900", "white");
  const [record_pubs, setRecordPubs] = useState("");
  const { network, blockchain } = useContext(AccountContext);
  const [total_pubs, setTotalPubs] = useState(null);
  const [latest_nodes, setLatestNodes] = useState(null);
  const [latest_publishers, setLatestPublishers] = useState(null);
  const [latest_delegators, setLatestDelegators] = useState(null);
  const [monthly_pubs, setMonthlyPubs] = useState(null);
  const [monthly_nodes, setMonthlyNodes] = useState(null);
  const [last_pubs, setLastPubs] = useState(null);
  const [last_nodes, setLastNodes] = useState(null);
  const [activity_data, setActivityData] = useState(null);
  const [pubs] = useState(null);
  const [price, setPrice] = useState(0);
  let total_stake = 0;
  let total_rewards = 0;
  let last_stake = 0;
  let last_rewards = 0;
  let total_delegators = 0;
  let active_assets = 0;

  useEffect(() => {
    async function fetchData() {
      try {
        if (network) {
          const rsp = await axios.get(
            "https://api.coingecko.com/api/v3/coins/origintrail"
          );
          setPrice(rsp.data.market_data.current_price.usd);

          let data = {
            network: network,
            frequency: "total",
            blockchain: blockchain,
          };
          let response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/pubs/stats`,
            data,
            config
          );
          setTotalPubs(response.data.result);

          data = {
            network: network,
            frequency: "latest",
            blockchain: blockchain,
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/nodes/stats`,
            data,
            config
          );
          setLatestNodes(response.data.result);

          data = {
            network: network,
            frequency: "latest",
            blockchain: blockchain,
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/delegators/stats`,
            data,
            config
          );
          setLatestDelegators(response.data.result);

          data = {
            network: network,
            blockchain: blockchain,
            frequency: "monthly",
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/pubs/stats`,
            data,
            config
          );

          setMonthlyPubs(response.data.result);

          data = {
            network: network,
            frequency: "records",
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/pubs/stats`,
            data,
            config
          );

          setRecordPubs(response.data.result[0].data);

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
            `${process.env.REACT_APP_API_HOST}/pubs/stats`,
            data,
            config
          );

          setLastPubs(response.data.result);

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

          data = {
            network: network,
            blockchain: blockchain,
            frequency: "24h",
            limit: 10000
          };

          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/pubs/activity`,
            data,
            config
          );

          setActivityData(response.data.result);

          data = {
            network: network,
            frequency: "latest",
            blockchain: blockchain,
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/publishers/stats`,
            data,
            config
          );
          setLatestPublishers(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setLatestPublishers(null)
    setTotalPubs(null);
    setLatestNodes(null);
    setLastPubs(null);
    setLatestDelegators(null);
    fetchData();
  }, [network, blockchain]);

  if (latest_nodes) {
    for (const node of latest_nodes[0].data) {
      total_stake = total_stake + node.nodeStake;
      total_rewards = total_rewards + node.cumulativePayouts;
    }
  }

  if (last_nodes) {
    for (const node of last_nodes[0].data) {
      last_stake = last_stake + node.nodeStake;
      last_rewards = last_rewards + node.cumulativePayouts;
    }
  }

  if (latest_delegators) {
    for (const chain of latest_delegators) {
      total_delegators = chain.data.length + total_delegators;
    }
  }

  if (pubs) {
    for (const pub of pubs) {
      if (pub.winners) {
        if (pub.winners.length < pub.epochs_number) {
          active_assets = active_assets + 1;
        }
      }
    }
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
        {total_pubs && last_pubs ? (
          <MiniStatistics
            growth={`${
              ((
                1 -
                (last_pubs[0].data[0].totalTracSpent -
                  last_rewards +
                  last_stake) /
                  (total_pubs[0].data[0].totalTracSpent -
                    total_rewards +
                    total_stake)
              ) * 100).toFixed(2) 
            }%`}
            name="Total Value Locked"
            value={`$${formatNumberWithSpaces(
              (
                (total_pubs[0].data[0].totalTracSpent -
                  total_rewards +
                  total_stake) *
                price
              ).toFixed(0)
            )}`}
          />
        ) : (
          <Card py="15px" boxShadow="md">
            <Flex
              my="auto"
              h="100%"
              align={{ base: "center", xl: "start" }}
              justify={{ base: "center", xl: "center" }}
            >
              <Stat my="auto" ms={"0px"}>
                <StatLabel
                  lineHeight="100%"
                  color={textColorSecondary}
                  fontSize={{
                    base: "sm",
                  }}
                >
                  {"Total Value Locked"}
                </StatLabel>
                <StatNumber
                  color={textColor}
                  fontSize={{
                    base: "2xl",
                  }}
                >
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={tracColor}
                    size="md"
                  />
                </StatNumber>
              </Stat>
            </Flex>
          </Card>
        )}
        {record_pubs ? (
          <MiniStatistics name="Hourly TRAC Spend Record" value={`${formatNumberWithSpaces(record_pubs[1].value)}`} />
        ) : (
          <MiniStatistics name="Hourly TRAC Spend Record" value={""} />
        )}
        {record_pubs ? (
          <MiniStatistics name="Daily TRAC Spend Record" value={`${formatNumberWithSpaces(record_pubs[2].value)}`} />
        ) : (
          <MiniStatistics name="Daily TRAC Spend Record" value={""} />
        )}
        {latest_nodes ? (
          <MiniStatistics name="Nodes" value={latest_nodes[0].data.length} />
        ) : (
          <MiniStatistics name="Nodes" value={""} />
        )}
        {total_delegators ? (
          <MiniStatistics name="Delegators" value={total_delegators} />
        ) : (
          <MiniStatistics name="Delegators" value={""} />
        )}

        {latest_publishers ? (
          <MiniStatistics
            name="Publishers"
            value={latest_publishers[0].data.length}
          />
        ) : (
          <MiniStatistics name="Publishers" value={""} />
        )}
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
      {monthly_pubs && total_pubs ? (
          <AssetsPublished
            monthly_pubs={monthly_pubs}
            total_pubs={total_pubs[0].data[0]}
            last_pubs={total_pubs[0].data[0]}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
            h="100%"
            boxShadow="md"
          >
            <Flex
              justifyContent="center"
              mt="auto"
              mb="auto"
              mr="auto"
              ml="auto"
            >
              <Stack>
                <Spinner
                  thickness="5px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color={tracColor}
                  size="xl"
                  ml="auto"
                  mr="auto"
                />
                <Text fontSize="lg" color={tracColor} fontWeight="bold">
                  Loading...
                </Text>
              </Stack>
            </Flex>
          </Card>
        )}
        
        {monthly_pubs && total_pubs ? (
          <CumEarnings
            monthly_pubs={monthly_pubs}
            total_pubs={total_pubs[0].data[0]}
            last_pubs={total_pubs[0].data[0]}
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
            boxShadow="md"
            h="320px"
          >
            <Flex
              justifyContent="center"
              mt="auto"
              mb="auto"
              mr="auto"
              ml="auto"
            >
              <Stack>
                <Spinner
                  thickness="5px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color={tracColor}
                  size="xl"
                  ml="auto"
                  mr="auto"
                />
                <Text fontSize="lg" color={tracColor} fontWeight="bold">
                  Loading...
                </Text>
              </Stack>
            </Flex>
          </Card>
        )}

        {monthly_nodes && latest_nodes ? (
          <CumRewards
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
            boxShadow="md"
          >
            <Flex
              justifyContent="center"
              mt="auto"
              mb="auto"
              mr="auto"
              ml="auto"
            >
              <Stack>
                <Spinner
                  thickness="5px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color={tracColor}
                  size="xl"
                  ml="auto"
                  mr="auto"
                />
                <Text fontSize="lg" color={tracColor} fontWeight="bold">
                  Loading...
                </Text>
              </Stack>
            </Flex>
          </Card>
        )}

        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          {latest_publishers ? (
            <PublishersDominance
              latest_publishers={latest_publishers[0].data}
            />
          ) : (
            <Card
              justifyContent="center"
              align="center"
              direction="column"
              w="100%"
              mb="0px"
              boxShadow="md"
            >
              <Flex
                justifyContent="center"
                mt="auto"
                mb="auto"
                mr="auto"
                ml="auto"
              >
                <Stack>
                  <Spinner
                    thickness="5px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={tracColor}
                    size="xl"
                    ml="auto"
                    mr="auto"
                  />
                  <Text fontSize="lg" color={tracColor} fontWeight="bold">
                    Loading...
                  </Text>
                </Stack>
              </Flex>
            </Card>
          )}

          {total_pubs ? (
            <AssetPrivacy total_pubs={total_pubs[0].data[0]} />
          ) : (
            <Card
              justifyContent="center"
              align="center"
              direction="column"
              w="100%"
              mb="0px"
              boxShadow="md"
            >
              <Flex
                justifyContent="center"
                mt="auto"
                mb="auto"
                mr="auto"
                ml="auto"
              >
                <Stack>
                  <Spinner
                    thickness="5px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={tracColor}
                    size="xl"
                    ml="auto"
                    mr="auto"
                  />
                  <Text fontSize="lg" color={tracColor} fontWeight="bold">
                    Loading...
                  </Text>
                </Stack>
              </Flex>
            </Card>
          )}
        </SimpleGrid>
      </SimpleGrid>

      <SimpleGrid
        columns={{ base: 1, md: 1, xl: 1 }}
        gap="20px"
        mb="20px"
        h="800px"
      >
        {activity_data ? (
          <NetworkActivityTable
            columnsData={columnsDataComplex}
            activity_data={activity_data}
          />
        ) : (
          <Card
            direction="column"
            w="100%"
            px="0px"
            overflowX={{ sm: "scroll", lg: "hidden" }}
            boxShadow="md"
          >
            <Flex
              justifyContent="center"
              mt="auto"
              mb="auto"
              mr="auto"
              ml="auto"
            >
              <Stack>
                <Spinner
                  thickness="5px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color={tracColor}
                  size="xl"
                  ml="auto"
                  mr="auto"
                />
                <Text fontSize="lg" color={tracColor} fontWeight="bold">
                  Loading...
                </Text>
              </Stack>
            </Flex>
          </Card>
        )}
      </SimpleGrid>
    </Box>
  );
}
