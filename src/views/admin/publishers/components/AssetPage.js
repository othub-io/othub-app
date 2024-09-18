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
  IoCopyOutline,
  IoDownloadOutline,
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
    Authorization: localStorage.getItem("token"),
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AssetPage(props) {
  const { network, setNetwork } = useContext(AccountContext);
  const { node_id, asset_data } = props;
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [asset_history, setAssetHistory] = useState("");
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");
  const [price, setPrice] = useState("");
  const [downloading, setDownloading] = useState(false);
  const account = localStorage.getItem("account");
  let explorer_url = "https://dkg.origintrail.io";
  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  let settings;
  let response;

  useEffect(() => {
    async function fetchData() {
      try {
        settings = {
          ual: open_asset_page.UAL,
          blockchain: open_asset_page.chainName,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/history`,
          settings,
          config
        );
        await setAssetHistory(response.data.result);

        console.log("history: " + JSON.stringify(response.data.result));
        settings = {
          ual: open_asset_page.UAL,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/sentiment/info`,
          settings,
          config
        );

        if (
          response.data.result.some(
            (item) => item.account === account && item.sentiment.data[0] === 1
          )
        ) {
          setLike(true);
        }

        if (
          response.data.result.some(
            (item) => item.account === account && item.sentiment.data[0] === 0
          )
        ) {
          setDislike(true);
        }

        setDislikes(
          response.data.result.filter((item) => item.sentiment.data[0] === 0)
            .length
        );
        setLikes(
          response.data.result.filter((item) => item.sentiment.data[0] === 1)
            .length
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    //setInputValue("All-Time");
    fetchData();
  }, [open_asset_page]);

  const updateSentiment = async (sentiment) => {
    try {
      settings = {
        ual: open_asset_page.UAL,
        sentiment: sentiment,
      };
      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/sentiment/edit`,
        settings,
        config
      );

      settings = {
        ual: open_asset_page.UAL,
      };
      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/sentiment/info`,
        settings,
        config
      );

      setDislikes(
        response.data.result.filter((item) => item.sentiment.data[0] === 0)
          .length
      );
      setLikes(
        response.data.result.filter((item) => item.sentiment.data[0] === 1)
          .length
      );
    } catch (error) {
      console.log("Failed to copy link to clipboard:", error);
    }
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link); // Replace with your desired link
      console.log("Link copied to clipboard!");
    } catch (error) {
      console.log("Failed to copy link to clipboard:", error);
    }
  };

  const downloadAsset = async (ual) => {
    try {
      settings = {
        network: network,
        blockchain:
        open_asset_page.chainName === "NeuroWeb Testnet"
            ? "otp:20430"
            : open_asset_page.chainName === "NeuroWeb Mainnet"
            ? "otp:2043"
            : open_asset_page.chainName === "Chiado Testnet"
            ? "gnosis:10200"
            : open_asset_page.chainName === "Gnosis Mainnet"
            ? "gnosis:100"
            : "",
        ual: ual,
      };
      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/dkg/get`,
        settings,
        config
      );

      // Create a blob from the response data
      const blob = new Blob([JSON.stringify(response.data.assertion)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${ual}.json`;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
    } catch (error) {
      console.log("Failed to copy link to clipboard:", error);
    }
  };

  const closeAssetPage = () => {
    window.history.replaceState(
      {},
      document.title,
      window.location.origin + window.location.pathname
    );
    setOpenAssetPage(false);
  };

  return (
    open_asset_page &&
    asset_history && (
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        bg="none"
        mt="0px"
      >
        <Box mb={{ base: "20px", "2xl": "20px" }} ml="40px" mt={{ sm: "50px", md: "40px", lg: "140px", xl: "30px" }}>
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
            onClick={() => setOpenAssetPage(false)}
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
            value={`${open_asset_page.token_amount.toFixed(2)} TRAC`}
          />
          <MiniStatistics
            name="Size"
            value={`${(open_asset_page.size / 1000).toFixed(2)} mb`}
          />
          <MiniStatistics name="Epochs" value={`${open_asset_page.epochs_number}`} />
          <MiniStatistics
            name="Expires"
            value={`${Math.ceil(
              (new Date(open_asset_page.block_ts_hour).getTime() +
                Number(open_asset_page.epochs_number) *
                  (Number(open_asset_page.epoch_length_days) * 24 * 60 * 60 * 1000) -
                Math.abs(new Date())) /
                (1000 * 60 * 60 * 24)
            )} days`}
          />
          <MiniStatistics
            name="Triples"
            value={`${open_asset_page.triples_number}`}
          />
          <MiniStatistics name="Chunks" value={`${open_asset_page.chunks_number}`} />
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
                      Token {open_asset_page.token_id}
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
                            `${process.env.REACT_APP_WEB_HOST}/knowledge?ual=${open_asset_page.UAL}`
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
                      fontSize="12px"
                      fontWeight="800"
                      me="6px"
                    >
                      By {open_asset_page.publisher}
                    </Text>
                  </Flex>

                  {account && (
                    <Flex direction="column" ml="auto" mt="-20px" mr="40px">
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
                            !like && setLike(!like);
                            setDislike(false);
                            updateSentiment(1);
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
                          fontSize="lg"
                          color="green.500"
                          mr="20px"
                        >
                          {likes}
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
                            !dislike && setDislike(!dislike);
                            setLike(false);
                            updateSentiment(0);
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
                        <Text fontWeight="700" fontSize="lg" color="red.500">
                          {dislikes}
                        </Text>
                        {!downloading && (
                          <Button
                            bg="none"
                            _hover={{ bg: "whiteAlpha.900" }}
                            _active={{ bg: "white" }}
                            _focus={{ bg: "white" }}
                            p="0px !important"
                            borderRadius="50%"
                            minW="36px"
                            onClick={() => downloadAsset(open_asset_page.UAL)}
                            mt="auto"
                            ml="20px"
                          >
                            <Icon
                              transition="0.2s linear"
                              w="40px"
                              h="40px"
                              as={IoDownloadOutline}
                              color="#11047A"
                              alt="Download"
                              onClick={() => setDownloading(true)}
                            />
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                  )}
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
                {`${open_asset_page.UAL}`}
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
                {`${open_asset_page.owner}`}
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
                {`${open_asset_page.state.slice(0, 15)}...${asset_data.state.slice(
                  -15
                )}`}
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
                {`${open_asset_page.keyword.slice(
                  0,
                  15
                )}...${open_asset_page.keyword.slice(-15)}`}
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
                {`${open_asset_page.block_ts}`}
              </Text>
            </Box>
          </Card>
          <Card w="100%" mb="0px">
            {asset_history && open_asset_page && (
              <AssetHistory
                asset_history={asset_history}
                columnsData={columnsDataComplex}
                chainName={open_asset_page.chainName}
              />
            )}
          </Card>
        </Grid>
        <WinnersTimeline
          winners={open_asset_page.winners}
          chainName={open_asset_page.chainName}
        />
        <SimpleGrid columns="1" overflow="auto" h="900px">
          <iframe
            title="NFT Preview"
            src={`${explorer_url}/explore?ual=${open_asset_page.UAL}`}
            width="100%"
            height="100%"
            style={{ borderRadius: "20px" }}
          ></iframe>
        </SimpleGrid>
      </Card>
    )
  );
}
