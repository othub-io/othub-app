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

import React, { useState, useEffect, useContext } from "react";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Input,
  background,
} from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/marketplace/components/Banner";
import PublisherRankings from "views/admin/publishers/components/PublisherRankings";
import HistoryItem from "views/admin/marketplace/components/HistoryItem";
import PublisherCard from "views/admin/publishers/components/PublisherCard";
import Card from "components/card/Card.js";
import AssetImage from "../../../../src/assets/img/Knowledge-Asset.jpg";
// Assets
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Nft4 from "assets/img/nfts/Nft4.png";
import Nft5 from "assets/img/nfts/Nft5.png";
import Nft6 from "assets/img/nfts/Nft6.png";
import Avatar1 from "assets/img/avatars/avatar1.png";
import Avatar2 from "assets/img/avatars/avatar2.png";
import Avatar3 from "assets/img/avatars/avatar3.png";
import Avatar4 from "assets/img/avatars/avatar4.png";
import { columnsDataComplex } from "views/admin/publishers/variables/publisherRankingColumns";
import { AccountContext } from "../../../AccountContext";
import PublisherPage from "views/admin/publishers/components/PublisherPage";
import AssetPage from "views/admin/publishers/components/AssetPage";
import Loading from "components/effects/Loading";
import axios from "axios";
import { TransactionMissingReceiptOrBlockHashError } from "web3";
import {
  MdSearch
} from "react-icons/md";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};
const queryParameters = new URLSearchParams(window.location.search);
const url_ual = queryParameters.get("ual");

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const sort_array = [
  "All",
  "Popular",
  "Trending",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { open_publisher_page, setOpenPublisherPage } = useContext(AccountContext);
  const [price, setPrice] = useState(0);
  const [recent_assets, setRecentAssets] = useState(null);
  const [publishers, setPublishers] = useState(null);
  const [ranked_publishers, setRankedPublishers] = useState(null);
  const [trending_assets, setTrendingAssets] = useState(null);
  const [popular_assets, setPopularAssets] = useState(null);
  const tracColor = useColorModeValue("brand.900", "white");
  const [click, setClick] = useState(0);
  const [error, setError] = useState(null);
  const [user_info, setUserInfo] = useState(null);
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
  let data;
  let setting;
  let response;
  let topic_list = [];
  let args;

  useEffect(() => {
    async function fetchData() {
      try {
        if (!network) {
          return;
        }

        let data = {
          network: network,
          frequency: 'latest'
        };
        
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/publishers/stats`,
          data,
          config
        );
        
        let pubbers = response.data.result[0].data
        for(const publisher of pubbers){
          let userInfoResponse = await axios.post(
            `${process.env.REACT_APP_API_HOST}/user/info`,
            { account: publisher.publisher },
            {
              headers: {
                "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
              },
            }
          );
  
          if (userInfoResponse.data.result && userInfoResponse.data.result[0]) {
            if (userInfoResponse.data.result[0].img) {
              publisher.img = userInfoResponse.data.result[0].img;
            }
  
            if (userInfoResponse.data.result[0].alias) {
              publisher.alias = userInfoResponse.data.result[0].alias;
            }

            if (userInfoResponse.data.result[0].twitter) {
              publisher.twitter = userInfoResponse.data.result[0].twitter;
            }
          }

          publisher.rating = (publisher.assetsPublished * (publisher.avgAssetSize / 1000) * publisher.avgEpochsNumber * ((100 - publisher.percentagePrivatePubs) / 100)).toFixed(0);
        }
        setPublishers(pubbers);
  
        let ranked_publishers = pubbers.filter(publisher => publisher.rating !== "0").sort((a, b) => b.rating - a.rating);
        setRankedPublishers(ranked_publishers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    setPublishers(null)
    setRankedPublishers(null)
    setOpenPublisherPage(null);
    fetchData();
  }, [blockchain, network]);
  
  

  const searchPublisher = async (publisher) => {
    data = {
      publisher: publisher.publisher
    };
    response = await axios.post(
      `${process.env.REACT_APP_API_HOST}/publisher/info`,
      data,
      config
    );

    if (response.data.result) {
      setOpenPublisherPage(response.data.result[0]);
    }
  };

  // const setPopular = async () => {

   
  // };

  // const changeTopic = async (topic, chain_name) => {
  //   try {
      
  //   } catch (e) {
  //     setError(e);
  //   }
  // };

  if (open_publisher_page) {
    return <PublisherPage publisher={open_publisher_page}/>;
  }

  if (open_asset_page) {
    return <AssetPage asset_data={open_asset_page} />;
  }

  return (
    !open_publisher_page && (
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }} mt="-20px">
        {/* Main Fields */}
        <Grid
          mb="20px"
          gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
          gap={{ base: "20px", xl: "20px" }}
          display={{ base: "block", xl: "grid" }}
        >
          <Flex
            flexDirection="column"
            gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
          >
            {/* <Banner /> */}
            <Flex direction="column">
              <Flex
                mb="20px"
                justifyContent="space-between"
                direction={{ base: "column", md: "row" }}
                align={{ base: "start", md: "center" }}
              >
                <Text
                  mt="0px"
                  mb="0px"
                  color={textColor}
                  fontSize="2xl"
                  ms="0px"
                  fontWeight="700"
                ></Text>
                <Flex
                  px="16px"
                  justify="space-between"
                  align="center"
                  mb="10px"
                  maxW="100%"
                  mt="10px"
                >
                  {sort_array.map((item, index) => (
                    <Link
                      key={index} // Use a unique key
                      color={tracColor}
                      fontWeight="500"
                      me={{ base: "34px", md: "10px" }}
                      onClick={() => {
                        setClick(index);
                      }}
                      textDecoration={index === click ? "underline" : "none"}
                    >
                      {item}
                    </Link>
                  ))}
                </Flex>
              </Flex>
              <Flex align="center" mt="-20px" mb="20px" maxW="300px" ml="auto">
                <Icon
                  transition="0.2s linear"
                  w="30px"
                  h="30px"
                  mr="5px"
                  ml="5px"
                  mt="auto"
                  as={MdSearch}
                  color={tracColor}
                  _hover={{ cursor: "pointer" }}
                  _active={{ borderColor: tracColor }}
                  _focus={{ bg: "none" }}
                  onClick={() => {
                    const inputValue =
                      document.getElementById("assetInput").value;
                    searchPublisher(inputValue);
                  }}
                />
                <Input
                  h="30px"
                  focusBorderColor={tracColor}
                  id="assetInput"
                  mt="auto"
                  w="300px"
                  placeholder="Search for a publisher..."
                />
              </Flex>
              {publishers ? (
                <SimpleGrid
                  columns={{ base: 1, md: 4 }}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  overflow="auto"
                  maxH="1300px"
                >
                  {publishers.map((publisher, index) => {
                    return (
                      <PublisherCard
                        publisher={publisher}
                      />
                    );
                  })}
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, md: 1 }}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  overflow="auto"
                  h="800px"
                >
                  <Loading />
                </SimpleGrid>
              )}
            </Flex>
          </Flex>
          <Flex
            flexDirection="column"
            gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
          >
            <Card px="0px" mb="20px" minH="600px" maxH="1200px">
              {ranked_publishers ? (
                <PublisherRankings
                  columnsData={columnsDataComplex}
                  rankedPublishers={ranked_publishers.sort((a, b) => b.rating - a.rating)}
                />
              ) : (
                <Loading />
              )}
            </Card>
          </Flex>
        </Grid>
        {/* Delete Product */}
      </Box>
    )
  );
}
