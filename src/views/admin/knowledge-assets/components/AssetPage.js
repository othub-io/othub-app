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

import {
  IoThumbsDown,
  IoThumbsDownOutline,
  IoThumbsUp,
  IoThumbsUpOutline,
} from "react-icons/io5";

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
import Information from "views/admin/profile/components/Information";
//import Menu from "components/menu/MainMenu";
import Loading from "components/effects/Loading.js";
// Assets
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import NodeValueChart from "views/admin/nodes/components/NodeValueChart";
import DelegatorTable from "views/admin/nodes/components/DelegatorTable";
import PubsChart from "views/admin/nodes/components/PubsChart";
import EarningsChart from "views/admin/nodes/components/EarningsChart";
import NodeActivityTable from "views/admin/nodes/components/NodeActivityTable";
import { act_columnsDataComplex } from "views/admin/nodes/variables/activityTableColumns";
import WinnersTimeline from "views/admin/knowledge-assets/components/WinnersTimeline";
import AssetHistory from "views/admin/knowledge-assets/components/AssetHistory";
import {
    columnsDataCheck,
    columnsDataComplex,
  } from "views/admin/knowledge-assets/variables/assetHistoryColumns";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AssetPage(props) {
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { node_id, asset_data } = props;
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [inputValue, setInputValue] = useState("");
  const [latest_node, setLatestNode] = useState("");
  const [asset_history, setAssetHistory] = useState("");
  const [daily_data, setDailyData] = useState("");
  const [activity_data, setActivityData] = useState("");
  const [rank, setRank] = useState("");
  const [monthly_node_stats, setMonthlyNodeStats] = useState("");
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [price, setPrice] = useState("");
  let secondaryText = useColorModeValue("gray.700", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  let explorer_url = "https://dkg.origintrail.io";
  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const rsp = await axios.get(
          "https://api.coingecko.com/api/v3/coins/origintrail"
        );
        setPrice(rsp.data.market_data.current_price.usd);

        let settings = {
            ual: asset_data.UAL,
            blockchain: asset_data.chainName
          }
          let response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/assets/history`,
            settings,
            config
          )
          await setAssetHistory(response.data.result)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    //setInputValue("All-Time");
    fetchData();
  }, []);

  const closeAssetPage = () => {
    window.history.replaceState(
      {},
      document.title,
      window.location.origin + window.location.pathname
    );
    setOpenAssetPage(false);
  };

  return (
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
          _hover={{ bg: "none" }}
          _active={{ bg: "none" }}
          _focus={{ bg: "none" }}
          top="14px"
          right="14px"
          borderRadius="5px"
          pl="10px"
          pr="10px"
          minW="36px"
          h="36px"
          mb="10px"
          onClick={() => closeAssetPage()}
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
        <MiniStatistics
          name="Cost"
          value={`${asset_data.token_amount.toFixed(2)} TRAC`}
        />
        <MiniStatistics
          name="Size"
          value={`${(asset_data.size / 1000).toFixed(2)} mb`}
        />
        <MiniStatistics name="Epochs" value={`${asset_data.epochs_number}`} />
        <MiniStatistics
          name="Expires"
          value={`${Math.ceil(
            (new Date(asset_data.block_ts_hour).getTime() +
              Number(asset_data.epochs_number) *
                (Number(asset_data.epoch_length_days) * 24 * 60 * 60 * 1000) -
              Math.abs(new Date())) /
              (1000 * 60 * 60 * 24)
          )} days`}
        />
        <MiniStatistics name="Triples" value={`${asset_data.triples_number}`} />
        <MiniStatistics name="Chunks" value={`${asset_data.chunks_number}`} />
      </SimpleGrid>
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
        h="500px"
        mb="20px"
      >
        <Card>
          <Box
            mb={{ base: "20px", "2xl": "20px" }}
            ml="10px"
            display="flex"
            flexDirection="row"
            alignItems="baseline" // Aligns items along the baseline
          >
            {
              <>
                <Flex direction="column">
                  <Text
                    color={"#11047A"}
                    fontSize="40px"
                    fontWeight="800"
                    me="6px"
                  >
                    Token {asset_data.token_id}
                  </Text>
                  <Text
                    color="gray.400"
                    fontSize="12px"
                    fontWeight="800"
                    me="6px"
                  >
                    By {asset_data.publisher}
                  </Text>
                </Flex>

                <Flex direction="column" ml="auto" mt="-20px">
                  <Flex align="center">
                    <Button
                      bg="none"
                      _hover={{ bg: "whiteAlpha.900" }}
                      _active={{ bg: "white" }}
                      _focus={{ bg: "white" }}
                      p="0px !important"
                      borderRadius="50%"
                      minW="36px"
                      onClick={() => {
                        setLike(!like);
                        setDislike(false);
                      }}
                    >
                      <Icon
                        transition="0.2s linear"
                        w="30px"
                        h="30px"
                        as={like ? IoThumbsUp : IoThumbsUpOutline}
                        color="#11047A"
                      />
                    </Button>
                    <Text
                      fontWeight="700"
                      fontSize="sm"
                      color="#11047A"
                      mr="20px"
                    >
                      {asset_data.likes}
                    </Text>
                    <Button
                      bg="none"
                      _hover={{ bg: "whiteAlpha.900" }}
                      _active={{ bg: "white" }}
                      _focus={{ bg: "white" }}
                      p="0px !important"
                      borderRadius="50%"
                      minW="36px"
                      onClick={() => {
                        setDislike(!dislike);
                        setLike(false);
                      }}
                    >
                      <Icon
                        transition="0.2s linear"
                        w="30px"
                        h="30px"
                        as={dislike ? IoThumbsDown : IoThumbsDownOutline}
                        color="#11047A"
                      />
                    </Button>
                    <Text fontWeight="700" fontSize="sm" color="#11047A">
                      {asset_data.dislikes}
                    </Text>
                  </Flex>
                </Flex>
              </>
            }
          </Box>
          <Box
            mb={{ base: "20px", "2xl": "20px" }}
            position="relative"
            mt="-20px"
          >
            <Flex
              justify="center"
              align="center"
              h="150px"
              mt="0px"
              mb="0px"
              style={{ borderRadius: "20px" }}
            >
              <img
                title="NFT Preview"
                src={`${process.env.REACT_APP_API_HOST}/images?src=Knowledge-Asset.jpg`}
                width="120px"
                height="120px"
              ></img>
            </Flex>
          </Box>
          <Box
            ml="10px"
            mb="20px"
            display="flex"
            flexDirection="row"
            alignItems="baseline" // Aligns items along the baseline
          >
            <Text color="gray.400" fontSize="lg" fontWeight="500" me="6px">
              UAL:
            </Text>
            <Text
              color={tracColor}
              fontSize="lg"
              fontWeight="800"
              me="6px"
              ml="auto"
            >
              {`${asset_data.UAL}`}
            </Text>
          </Box>
          <Box
            ml="10px"
            mb="20px"
            display="flex"
            flexDirection="row"
            alignItems="baseline" // Aligns items along the baseline
          >
            <Text color="gray.400" fontSize="lg" fontWeight="500" me="6px">
              Owner:
            </Text>
            <Text
              color={tracColor}
              fontSize="lg"
              fontWeight="800"
              me="6px"
              ml="auto"
            >
              {`${asset_data.owner}`}
            </Text>
          </Box>
          <Box
            ml="10px"
            mb="20px"
            display="flex"
            flexDirection="row"
            alignItems="baseline" // Aligns items along the baseline
          >
            <Text color="gray.400" fontSize="lg" fontWeight="500" me="6px">
              State:
            </Text>
            <Text
              color={tracColor}
              fontSize="lg"
              fontWeight="800"
              me="6px"
              ml="auto"
            >
              {`${asset_data.state.slice(0, 15)}...${asset_data.state.slice(-15)}`}
            </Text>
          </Box>
          <Box
            ml="10px"
            mb="20px"
            display="flex"
            flexDirection="row"
            alignItems="baseline" // Aligns items along the baseline
          >
            <Text color="gray.400" fontSize="lg" fontWeight="500" me="6px">
              Keyword:
            </Text>
            <Text
              color={tracColor}
              fontSize="lg"
              fontWeight="800"
              me="6px"
              ml="auto"
            >
              {`${asset_data.keyword.slice(0, 15)}...${asset_data.keyword.slice(-15)}`}
            </Text>
          </Box>
          <Box
            ml="10px"
            mb="20px"
            display="flex"
            flexDirection="row"
            alignItems="baseline" // Aligns items along the baseline
          >
            <Text color="gray.400" fontSize="lg" fontWeight="500" me="6px">
              Created:
            </Text>
            <Text
              color={tracColor}
              fontSize="lg"
              fontWeight="800"
              me="6px"
              ml="auto"
            >
              {`${asset_data.block_ts}`}
            </Text>
          </Box>
        </Card>
        <Card w="100%" mb="0px">
            {asset_history && <AssetHistory asset_history={asset_history} columnsData={columnsDataComplex}/>}
        </Card>
      </Grid>
      <WinnersTimeline winners={asset_data.winners} chain_id={asset_data.chainName} />
    {/* level 2 */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "4fr 0fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
        h="400px"
        mb="20px"
      >
        <SimpleGrid columns="1" overflow="auto" h="900px">
          <iframe
            title="NFT Preview"
            src={`${explorer_url}/explore?ual=${asset_data.UAL}`}
            width="100%"
            height="100%"
            style={{ borderRadius: "20px" }}
          ></iframe>
        </SimpleGrid>
      </Grid>
    </Card>
  );
}
