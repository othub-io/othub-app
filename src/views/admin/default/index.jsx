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
  Stack,
  Spinner,
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
  const tracColor = useColorModeValue("brand.900", "white");
  const [inputValue, setInputValue] = useState("");
  const [record_pubs, setRecordPubs] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const [total_pubs, setTotalPubs] = useState(null);
  const [latest_nodes, setLatestNodes] = useState(null);
  const [latest_publishers, setLatestPublishers] = useState(null);
  const [latest_delegators, setLatestDelegators] = useState(null);
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
            // `${process.env.REACT_APP_API_HOST}/pubs/stats`,
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

    setTotalPubs("");
    setLatestNodes("");
    setLastPubs("");
    setLatestDelegators("");
    setInputValue("");
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
        //console.log(pub)
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
            //growth={`${((((last_pubs[0].data[0].totalTracSpent - last_rewards)) + last_stake) / ((total_pubs[0].data[0].totalTracSpent - total_rewards) + total_stake)) * 100}`}
            growth={`${
              (
                1 -
                (last_pubs[0].data[0].totalTracSpent -
                  last_rewards +
                  last_stake) /
                  (total_pubs[0].data[0].totalTracSpent -
                    total_rewards +
                    total_stake)
              ).toFixed(2) * 100
            }%`}
            name="Total Value Locked"
            value={`$${formatNumberWithSpaces(
              (
                (total_pubs[0].data[0].totalTracSpent -
                  total_rewards +
                  total_stake) *
                price
              ).toFixed(2)
            )}`}
          />
        ) : (
          <Card py="15px">
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
                  {"Loading..."}
                </StatNumber>
              </Stat>
            </Flex>
          </Card>
        )}
        {record_pubs ? (
          <MiniStatistics name="Hour Spend Record" value={`${record_pubs ? `${formatNumberWithSpaces(record_pubs[1].value)} ($${formatNumberWithSpaces(record_pubs[0].value.toFixed(0))}` : ""})`} />
        ) : (
          <MiniStatistics name="Hour Spend Record" value={""} />
        )}
        {record_pubs ? (
          <MiniStatistics name="Trac Spent Daily Record" value={`${formatNumberWithSpaces(record_pubs[2].value)} ($${formatNumberWithSpaces(record_pubs[3].value.toFixed(0))})`} />
        ) : (
          <MiniStatistics name="Trac Spent Daily Record" value={""} />
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
      {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 1 }} gap="20px" mb="20px">
        {monthly_pubs && total_pubs ? (
          <Test
          />
        ) : (
          <Card
            justifyContent="center"
            align="center"
            direction="column"
            w="100%"
            mb="0px"
            h="300px"
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
      </SimpleGrid> */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
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
          {/* <AssetPrivacy total_pubs={total_pubs[0].data[0]} /> */}
        </SimpleGrid>
      </SimpleGrid>
      {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid> */}

      <SimpleGrid
        columns={{ base: 1, md: 1, xl: 1 }}
        gap="20px"
        mb="20px"
        h="700px"
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
        {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid> */}
      </SimpleGrid>
    </Box>
  );
}
