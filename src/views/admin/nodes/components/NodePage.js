import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Box,
  Grid,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
} from "@chakra-ui/react";

import {
  MdBarChart,
  MdStars,
  MdHome,
  MdComputer,
  MdDashboard,
  MdInventory,
  MdAnchor,
  MdArrowCircleLeft,
  MdOutlineCalendarToday,
} from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";
import { AccountContext } from "../../../../AccountContext";
import axios from "axios";
import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import MiniStatistics from "components/card/MiniStatistics";
// Custom components
import Card from "components/card/Card";
//import Menu from "components/menu/MainMenu";
import Loading from "components/effects/Loading.js";
// Assets
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import NodeValueChart from "views/admin/nodes/components/NodeValueChart";
import DelegatorTable from "views/admin/nodes/components/DelegatorTable";
import PubsChart from "views/admin/nodes/components/PubsChart";
import EarningsChart from "views/admin/nodes/components/EarningsChart";
import NodeActivityTable from "views/admin/nodes/components/NodeActivityTable";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/nodes/variables/delegatorTableColumns";
import { act_columnsDataComplex } from "views/admin/nodes/variables/activityTableColumns";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function NodePage(props) {
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { node_name, price } = props;
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [inputValue, setInputValue] = useState("");
  const [latest_node, setLatestNode] = useState("");
  const [delegator_data, setDelegatorData] = useState("");
  const [delegator_activity, setDelegatorActivity] = useState("");
  const [daily_data, setDailyData] = useState("");
  const [activity_data, setActivityData] = useState("");
  const [rank, setRank] = useState("");
  const [monthly_node_stats, setMonthlyNodeStats] = useState("");
  const { open_node_page, setOpenNodePage } = useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");
  const [node_profile, setNodeProfile] = useState(null);
  const [node_apr, setAPR] = useState(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  let secondaryText = useColorModeValue("gray.700", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  let explorer_url = "https://dkg.origintrail.io";
  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  const calcAPR = (node_records) => {
    if (!node_records) return 0;

    if(node_records.length === 0){
      return 0;
    }

    let nStake = 0
    for(const record of node_records){
      nStake = nStake + record.nodeStake
    }

    nStake = nStake / node_records.length

    if (!nStake < 50000) return 0;

    const last30Objects = node_records.slice(-30);

    let estimatedEarnings = 0
    for(const record of last30Objects){
      estimatedEarnings = estimatedEarnings + record.estimatedEarnings
    }

    let apr = ((((estimatedEarnings / 30) / nStake) * 365) * 100).toFixed(2)

    return apr
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let settings = {
          network: network,
          blockchain: open_node_page[1] === 100 ? "Gnosis Mainnet" 
          : open_node_page[1] === 2043 ? "NeuroWeb Mainnet"
          : open_node_page[1] === 8453 ? "Base Mainnet"
          : open_node_page[1] === 10200 ? "Chiado Testnet"
          : open_node_page[1] === 84532 ? "Base Testnet"
          : open_node_page[1] === 20430 ? "NeuroWeb Testnet": "",
          nodeId: open_node_page[0],
          frequency: "latest",
        };

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          settings,
          config
        );

        setLatestNode(response.data.result[0].data[0]);

        let chain_id = response.data.result[0].data[0].chainId;
        let node_id = response.data.result[0].data[0].nodeId;

        let chain = response.data.result[0].data[0].chainName;
        settings = {
          network: network,
          blockchain: chain,
          nodeId: open_node_page[0],
          frequency: "latest",
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/delegators/stats`,
          settings,
          config
        );

        setDelegatorData(response.data.result[0].data);

        settings = {
          node_id: node_id,
          chain_id: chain_id,
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/profile`,
          settings,
          config
        );

        setNodeProfile(response.data.result[0]);

        settings = {
          network: network,
          blockchain: chain,
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/info`,
          settings,
          config
        );

        let node_list = [];

        for (const chain of response.data.result) {
          for (const node of chain.data) {
            node_list.push(node);
          }
        }

        let mcap_sort = node_list.sort((a, b) => b.nodeStake - a.nodeStake);
        let node_rank = mcap_sort.findIndex(
          (item) => item.chainId === chain_id && item.nodeId === node_id
        );
        setRank(node_rank + 1);

        settings = {
          network: network,
          blockchain: chain,
          frequency: "24h",
          nodeId: node_id
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/activity`,
          settings,
          config
        );

        setActivityData(response.data.result);

        settings = {
          network: network,
          blockchain: chain,
          nodeId: node_id,
          timeframe: "1000",
          frequency: "daily",
          limit: 100000
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          settings,
          config
        );

        setDailyData(response.data.result[0].data);

        const nodeAPR = calcAPR(response.data.result[0].data)
        setAPR(nodeAPR)

        settings = {
          network: network,
          blockchain: chain,
          nodeId: node_id,
          chain_id: chain_id
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/delegators/activity`,
          settings,
          config
        );

        setDelegatorActivity(response.data.result[0]);

        settings = {
          network: network,
          blockchain: chain,
          nodeId: node_id,
          timeframe: "1000",
          frequency: "monthly",
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          settings,
          config
        );

        setMonthlyNodeStats(response.data.result[0].data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setInputValue("All-Time");
    fetchData();
  }, []);

  const closeNodePage = () => {
    window.history.replaceState(
      {},
      document.title,
      window.location.origin + window.location.pathname
    );
    setOpenNodePage(false);
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link); // Replace with your desired link
      console.log("Link copied to clipboard!");
    } catch (error) {
      console.log("Failed to copy link to clipboard:", error);
    }
  };

  return (
    (
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        bg="none"
        mt="0px"
      >
        <Box mb={{ base: "20px", "2xl": "20px" }} ml="40px">
          <Button
            bg="none"
            border="solid"
            borderColor={tracColor}
            borderWidth="2px"
            color={tracColor}
            top="14px"
            right="14px"
            borderRadius="5px"
            pl="10px"
            pr="10px"
            minW="36px"
            h="36px"
            mb="10px"
            onClick={() => closeNodePage()}
          >
            <Icon
              transition="0.2s linear"
              w="20px"
              h="20px"
              mr="5px"
              as={MdArrowCircleLeft}
              color={tracColor}
            />
            Back
          </Button>
        </Box>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
          gap="20px"
          mb="20px"
        >
          {node_apr ? (
            <MiniStatistics
              name="30d APR"
              value={node_apr+'%'}
            />
          ) : (
            <MiniStatistics name="30d APR" value={""} />
          )}
          {latest_node ? (
            <MiniStatistics
              name="Total Assets Held"
              value={formatNumberWithSpaces(latest_node.pubsCommited)}
            />
          ) : (
            <MiniStatistics name="Total Assets Held" value={""} />
          )}
          {latest_node ? (
            <MiniStatistics
              name="Operator TRAC Rewards"
              value={formatNumberWithSpaces(
                latest_node.cumulativeOperatorRewards.toFixed(2)
              )}
            />
          ) : (
            <MiniStatistics name="Operator TRAC Rewards" value={""} />
          )}
          {latest_node ? (
            <MiniStatistics
              name="Total TRAC Rewards"
              value={formatNumberWithSpaces(
                latest_node.cumulativePayouts.toFixed(2)
              )}
            />
          ) : (
            <MiniStatistics name="Total TRAC Rewards" value={""} />
          )}
          {latest_node ? (
            <MiniStatistics
              name="Estimated TRAC Earnings"
              value={formatNumberWithSpaces(
                latest_node.estimatedEarnings.toFixed(2)
              )}
            />
          ) : (
            <MiniStatistics name="Total TRAC Earnings" value={""} />
          )}
          {delegator_data ? (
            <MiniStatistics name="Delegators" value={delegator_data.length} />
          ) : (
            <MiniStatistics name="Total TRAC Earnings" value={""} />
          )}
        </SimpleGrid>
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1.3fr 2.7fr",
          }}
          templateRows={{
            base: "repeat(3, 1fr)",
            lg: "1fr",
          }}
          gap={{ base: "20px", xl: "20px" }}
          h="500px"
          mb="20px"
        >
          <Card>
            <Flex flexDirection="row" alignItems="center" mb="10px">
              {node_profile && node_profile.node_logo && (
                <Avatar
                  boxShadow="md"
                  backgroundColor="#FFFFFF"
                  src={`${process.env.REACT_APP_API_HOST}/images?src=${node_profile.node_logo}`}
                  w="90px"
                  h="90px"
                />
              )}
              <Flex ml="20px" flexDirection="column">
                <Flex flexDirection="row" alignItems="baseline">
                  {latest_node && (
                    <>
                      <Text
                        color={tracColor}
                        fontSize="28px"
                        fontWeight="800"
                        me="6px"
                      >
                        {latest_node.tokenName}
                        <Button
                          bg="none"
                          _hover={{ bg: "whiteAlpha.900" }}
                          _active={{ bg: "white" }}
                          _focus={{ bg: "white" }}
                          p="0px !important"
                          borderRadius="50%"
                          minW="36px"
                          onClick={() =>
                            handleCopyLink(
                              `${process.env.REACT_APP_WEB_HOST}/nodes?node_id=${latest_node.nodeId}&chain_id=${latest_node.chainId}`
                            )
                          }
                          mt="auto"
                        >
                          <Icon
                            transition="0.2s linear"
                            w="20px"
                            h="20px"
                            as={IoCopyOutline}
                            color="#11047A"
                            alt="Copy Link"
                          />
                        </Button>
                      </Text>
                      <Text
                        color="gray.400"
                        fontSize="cm"
                        fontWeight="500"
                        me="6px"
                      >
                        {latest_node.tokenSymbol}
                        {` #${rank}`}
                      </Text>
                    </>
                  )}
                </Flex>
                <Flex
                  mb={{ base: "0px", "2xl": "0px" }}
                  flexDirection="row"
                  alignItems="baseline"
                >
                  {latest_node && (
                    <>
                      <Text
                        color={tracColor}
                        fontSize="40px"
                        fontWeight="800"
                        me="6px"
                      >
                        {`$${(latest_node.shareValueCurrent * price).toFixed(
                          4
                        )}`}
                      </Text>
                      {daily_data && (
                        <Text
                          color={
                            (
                              ((daily_data[daily_data.length - 1]
                                .shareValueCurrent -
                                daily_data[daily_data.length - 8]
                                  .shareValueCurrent) /
                                latest_node.shareValueCurrent) *
                              100
                            ).toFixed(4) < 0
                              ? "red.500"
                              : "green.500"
                          }
                          fontSize="lg"
                          fontWeight="700"
                          me="5px"
                        >
                          {`${(
                            ((daily_data[daily_data.length - 1]
                              .shareValueCurrent -
                              daily_data[daily_data.length - 8]
                                .shareValueCurrent) /
                              latest_node.shareValueCurrent) *
                            100
                          ).toFixed(4)}%`}
                        </Text>
                      )}
                      <Text
                        color="gray.400"
                        fontSize="xs"
                        fontWeight="500"
                        me="6px"
                      >
                        7d
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
            </Flex>
            <Box
              ml="10px"
              mb="20px"
              display="flex"
              flexDirection="row"
              alignItems="baseline" // Aligns items along the baseline
            >
              {delegator_activity && (
                <>
                  <Text
                    color="gray.400"
                    fontSize="lg"
                    fontWeight="500"
                    me="6px"
                  >
                    Contract Address:
                  </Text>

                  <a
                    target="_blank"
                    href={
                      delegator_activity.chainId === 100
                        ? `https://gnosisscan.io/token/${delegator_activity.sharesContractAddress}`
                        : delegator_activity.chainId === 10200
                        ? `https://gnosis-chiado.blockscout.com/token/${delegator_activity.sharesContractAddress}`
                        : delegator_activity.chainId === 2043
                        ? `https://origintrail.subscan.io/token/${delegator_activity.sharesContractAddress}`
                        : delegator_activity.chainId === 20430
                        ? `https:/origintrail-testnet.subscan.io/token/${delegator_activity.sharesContractAddress}`
                        : delegator_activity.chainId === 8453
                        ? `https://basescan.org/token/${delegator_activity.sharesContractAddress}`
                        : delegator_activity.chainId === 84532
                        ? `https://sepolia.basescan.org//token/${delegator_activity.sharesContractAddress}`
                        : ""
                    }
                    style={{
                      color: tracColor,
                      textDecoration: "none",
                      marginLeft: "auto",
                    }}
                  >
                    <Text
                      color={tracColor}
                      fontSize="lg"
                      fontWeight="800"
                      me="6px"
                      ml="auto"
                    >
                      {`${delegator_activity.sharesContractAddress.slice(
                        0,
                        10
                      )}...${delegator_activity.sharesContractAddress.slice(
                        -10
                      )}`}
                    </Text>
                  </a>
                </>
              )}
            </Box>
            <Box
              ml="10px"
              mb="20px"
              display="flex"
              flexDirection="row"
              alignItems="baseline" // Aligns items along the baseline
            >
              {latest_node && (
                <>
                  <Text
                    color="gray.400"
                    fontSize="lg"
                    fontWeight="500"
                    me="6px"
                  >
                    Market Cap:
                  </Text>
                  <Text
                    color={tracColor}
                    fontSize="lg"
                    fontWeight="800"
                    me="6px"
                    ml="auto"
                  >
                    {`$${formatNumberWithSpaces(
                      (latest_node.nodeSharesTotalSupply * price).toFixed(2)
                    )}`}
                  </Text>
                </>
              )}
            </Box>
            <Box
              ml="10px"
              mb="20px"
              display="flex"
              flexDirection="row"
              alignItems="baseline" // Aligns items along the baseline
            >
              {latest_node && (
                <>
                  <Text
                    color="gray.400"
                    fontSize="lg"
                    fontWeight="500"
                    me="6px"
                  >
                    Prospective Valuation:
                  </Text>
                  <Text
                    color={tracColor}
                    fontSize="lg"
                    fontWeight="800"
                    me="6px"
                    ml="auto"
                  >
                    {`$${(latest_node.shareValueFuture * price).toFixed(4)}`}
                  </Text>
                </>
              )}
            </Box>
            <Box
              ml="10px"
              mb="20px"
              display="flex"
              flexDirection="row"
              alignItems="baseline" // Aligns items along the baseline
            >
              {latest_node && (
                <>
                  <Text
                    color="gray.400"
                    fontSize="lg"
                    fontWeight="500"
                    me="6px"
                  >
                    24 Hour Trading Vol:
                  </Text>
                  <Text
                    color={tracColor}
                    fontSize="lg"
                    fontWeight="800"
                    me="6px"
                    ml="auto"
                  >
                    0$
                  </Text>
                </>
              )}
            </Box>
            <Box
              ml="10px"
              mb="20px"
              display="flex"
              flexDirection="row"
              alignItems="baseline" // Aligns items along the baseline
            >
              {latest_node && (
                <>
                  <Text
                    color="gray.400"
                    fontSize="lg"
                    fontWeight="500"
                    me="6px"
                  >
                    Circulating Supply:
                  </Text>
                  <Text
                    color={tracColor}
                    fontSize="lg"
                    fontWeight="800"
                    me="6px"
                    ml="auto"
                  >
                    {formatNumberWithSpaces(
                      Number(latest_node.nodeSharesTotalSupply).toFixed(2)
                    )}
                  </Text>
                </>
              )}
            </Box>
            <Box
              ml="10px"
              mb="20px"
              display="flex"
              flexDirection="row"
              alignItems="baseline" // Aligns items along the baseline
            >
              {latest_node && (
                <>
                  <Text
                    color="gray.400"
                    fontSize="lg"
                    fontWeight="500"
                    me="6px"
                  >
                    Max Supply:
                  </Text>
                  <Text
                    color={tracColor}
                    fontSize="lg"
                    fontWeight="800"
                    me="6px"
                    ml="auto"
                  >
                    2,000,000.00
                  </Text>
                </>
              )}
            </Box>
            <Box
              ml="10px"
              mb="20px"
              display="flex"
              flexDirection="row"
              alignItems="baseline" // Aligns items along the baseline
            >
              {latest_node && (
                <>
                  <Text
                    color="gray.400"
                    fontSize="lg"
                    fontWeight="500"
                    me="6px"
                  >
                    {`About ${latest_node.tokenName}:`}
                  </Text>
                  <Text
                    color={tracColor}
                    fontSize="lg"
                    fontWeight="800"
                    me="6px"
                    ml="20px"
                  >
                    {node_profile && node_profile.bio}
                  </Text>
                </>
              )}
            </Box>
          </Card>
          <Card w="100%" mb="0px" boxShadow="md">
            {daily_data && price ? (
              <NodeValueChart node_d={daily_data} price={price} />
            ) : (
              <Loading />
            )}
          </Card>
        </Grid>
        {/* level 2 */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "2fr 2fr",
          }}
          templateRows={{
            base: "repeat(3, 1fr)",
            lg: "1fr",
          }}
          gap={{ base: "20px", xl: "20px" }}
          h="400px"
          mb="20px"
          mt="45px"
        >
          <Card boxShadow="md">
            {monthly_node_stats && (
              <PubsChart
                monthly_nodes={monthly_node_stats}
                latest_nodes={latest_node}
                last_nodes={latest_node}
              />
            )}
          </Card>

          <Card w="100%" mb="0px" boxShadow="md">
            {monthly_node_stats && (
              <EarningsChart
                monthly_nodes={monthly_node_stats}
                latest_nodes={latest_node}
                last_nodes={latest_node}
              />
            )}
          </Card>
        </Grid>
        {/* level 2 */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1.5fr 2.5fr",
          }}
          templateRows={{
            base: "repeat(3, 1fr)",
            lg: "1fr",
          }}
          gap={{ base: "20px", xl: "20px" }}
          h="400px"
          mb="20px"
          mt="20px"
        >
          <Card overflow="auto" h="900px" boxShadow="md">
            {delegator_data ? (
              <DelegatorTable
                columnsData={columnsDataComplex}
                delegator_data={delegator_data}
              />
            ) : (
              <Loading />
            )}
          </Card>

          <Card overflow="auto" h="900px" boxShadow="md">
            {activity_data ? (
              <NodeActivityTable
                columnsData={act_columnsDataComplex}
                activity_data={activity_data}
              />
            ) : (
              <Loading />
            )}
          </Card>
        </Grid>
      </Card>
    )
  );
}
