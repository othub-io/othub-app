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
  Spinner,
  Avatar
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
import MiniStatistics from "components/card/MiniStatistics";
// Custom components
import Card from "components/card/Card";
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
  const textColor = useColorModeValue("navy.700", "white");
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
          ual: asset_data.UAL,
          blockchain: asset_data.chainName,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/history`,
          settings,
          config
        );
        await setAssetHistory(response.data.result);

        settings = {
          ual: asset_data.UAL,
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
  }, [asset_data]);

  const updateSentiment = async (sentiment) => {
    try {
      settings = {
        ual: asset_data.UAL,
        sentiment: sentiment,
      };
      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/sentiment/edit`,
        settings,
        config
      );

      settings = {
        ual: asset_data.UAL,
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
          asset_data.chainName === "NeuroWeb Testnet"
            ? "otp:20430"
            : asset_data.chainName === "NeuroWeb Mainnet"
            ? "otp:2043"
            : asset_data.chainName === "Chiado Testnet"
            ? "gnosis:10200"
            : asset_data.chainName === "Gnosis Mainnet"
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
      setDownloading(false);
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
    asset_data &&
    asset_history && (
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        bg="none"
        mt={{ sm: "30%", lg: "0px" }}
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
          columns={{ base: 2, md: 2, lg: 3, "2xl": 6 }}
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
          <MiniStatistics
            name="Triples"
            value={`${asset_data.triples_number}`}
          />
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
          <Card boxShadow="md">
            <Box
              mb={{ base: "0px", "2xl": "0px" }}
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
                            `${process.env.REACT_APP_WEB_HOST}/knowledge?ual=${asset_data.UAL}`
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
                        {!downloading ? (
                          <Button
                            bg="none"
                            _hover={{ bg: "whiteAlpha.900" }}
                            _active={{ bg: "white" }}
                            _focus={{ bg: "white" }}
                            p="0px !important"
                            borderRadius="50%"
                            minW="36px"
                            onClick={() => downloadAsset(asset_data.UAL)}
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
                        ) : (
                          <Spinner
                            thickness="2px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color={tracColor}
                            size="lg"
                            ml="20px"
                          />
                        )}
                      </Flex>
                    </Flex>
                  )}
                </>
              }
            </Box>
            <Flex ml="20px">
              <Text
                color={textColor}
                fontSize={{
                  base: "md",
                }}
                fontWeight="bold"
                mr="5px"
              >
                Publisher:
              </Text>
              {asset_data.publisher_img && (
                <Avatar
                  boxShadow="md"
                  backgroundColor="#FFFFFF"
                  src={`${process.env.REACT_APP_API_HOST}/images?src=${asset_data.publisher_img}`}
                  w="25px"
                  h="25px"
                  ml="5px"
                  mr="5px"
                />
              )}
              <Text
                color={textColor}
                fontSize={{
                  base: "md",
                }}
                fontWeight="bold"
              >
                {asset_data.publisher_alias
                  ? asset_data.publisher_alias
                  : `${asset_data.publisher.slice(0, 15)}...`}
              </Text>
            </Flex>

            <Box
              mb={{ base: "20px", "2xl": "20px" }}
              position="relative"
              mt="0px"
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
                {`${asset_data.state.slice(0, 15)}...${asset_data.state.slice(
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
                {`${asset_data.keyword.slice(
                  0,
                  15
                )}...${asset_data.keyword.slice(-15)}`}
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
          <Card w="100%" mb="0px" boxShadow="md">
            {asset_history && asset_data && (
              <AssetHistory
                asset_history={asset_history}
                columnsData={columnsDataComplex}
                chainName={asset_data.chainName}
              />
            )}
          </Card>
        </Grid>
        <WinnersTimeline
          winners={asset_data.winners}
          chainName={asset_data.chainName}
        />
        <SimpleGrid columns="1" overflow="auto" h="900px" boxShadow="md">
          <iframe
            title="NFT Preview"
            src={`${explorer_url}/explore?ual=${asset_data.UAL}`}
            width="100%"
            height="100%"
            style={{ borderRadius: "20px" }}
          ></iframe>
        </SimpleGrid>
      </Card>
    )
  );
}
