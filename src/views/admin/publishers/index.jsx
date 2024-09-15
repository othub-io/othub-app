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
  Spinner,
  Stack
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
const url_publisher = queryParameters.get("publisher");

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const sort_array = [
  "All",
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
  const [filtered_publishers, setFilteredPublishers] = useState(null);
  const [ranked_publishers, setRankedPublishers] = useState(null);
  const [trending_assets, setTrendingAssets] = useState(null);
  const [popular_assets, setPopularAssets] = useState(null);
  const tracColor = useColorModeValue("brand.900", "white");
  const [click, setClick] = useState(0);
  const [error, setError] = useState(null);
  const [user_info, setUserInfo] = useState(null);
  let data;
  let setting;
  let response;
  let topic_list = [];
  let args;

  useEffect(() => {
    async function fetchData() {
      try {
        let data = {
          network: network,
          frequency: 'latest'
        };
        
        if(url_publisher){
          data.publisher = url_publisher
        }

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/publishers/stats`,
          data,
          config
        );

        let pubbers = response.data.result[0].data

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          { },
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            },
          }
        );

        let users = response.data.result
        
        for(const publisher of pubbers){
          const index = users.findIndex(user => user.account.toLowerCase() === publisher.publisher.toLowerCase());

          if (index >= 0) {
            if (users[index].img) {
              publisher.img = users[index].img;
            }
  
            if (users[index].alias) {
              publisher.alias = users[index].alias;
            }

            if (users[index].twitter) {
              publisher.twitter = users[index].twitter;
            }
          }
        }

        if(url_publisher){
          setOpenPublisherPage(pubbers[0]);
        }

        setPublishers(pubbers);
  
        let ranked_publishers = pubbers.filter(publisher => publisher.totalTracSpent !== "0").sort((a, b) => b.totalTracSpent - a.totalTracSpent);

        setRankedPublishers(ranked_publishers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    setFilteredPublishers(null)
    setPublishers(null)
    setRankedPublishers(null)
    setOpenPublisherPage(null);
    fetchData();
  }, [blockchain, network]);
  
  

  const searchPublisher = async (publisher_name) => {
    const filteredAndSortedAssets = publishers
        .filter(publisher => {
            const nameToCheck = publisher.alias || publisher.publisher;
            return nameToCheck.toLowerCase().includes(publisher_name.toLowerCase());
        })
        .sort((a, b) => b.totalTracSpent - a.totalTracSpent);

    setFilteredPublishers(filteredAndSortedAssets);
};

  const filterPublishers = async (letter) => {
    if(letter === "All"){
      setFilteredPublishers(publishers)
      return
    }
    
    const filteredAndSortedAssets = publishers
    .filter(publisher => publisher.alias ? publisher.alias.charAt(0).toLowerCase() === letter.toLowerCase() : publisher.publisher.charAt(0).toLowerCase() === letter.toLowerCase())
    .sort((a, b) => b.totalTracSpent - a.totalTracSpent);

    setFilteredPublishers(filteredAndSortedAssets);
  };

  // const changeTopic = async (topic, chain_name) => {
  //   try {
      
  //   } catch (e) {
  //     setError(e);
  //   }
  // };

  if (open_publisher_page) {
    return <PublisherPage publisher={open_publisher_page}/>;
  }

  return (
    (
      <Box pt={{ base: "230px", md: "160px", lg: "160px", xl: "80px" }}>
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
                        filterPublishers(item)
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
                      document.getElementById("publisherInput").value;
                    searchPublisher(inputValue);
                  }}
                />
                <Input
                  h="30px"
                  focusBorderColor={tracColor}
                  id="publisherInput"
                  mt="auto"
                  w="300px"
                  placeholder="Search for a publisher..."
                />
              </Flex>
              {filtered_publishers ? (
                <SimpleGrid
                  columns={{ base: 1, md: 4 }}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  overflow="auto"
                  maxH="1300px"
                >
                  {filtered_publishers.map((publisher, index) => {
                    return (
                      <PublisherCard
                        publisher={publisher}
                      />
                    );
                  })}
                </SimpleGrid>
              ) : publishers ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2 , lg: 4 , xl: 4}}
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
                </SimpleGrid>
              )}
            </Flex>
          </Flex>
          <Flex
            flexDirection="column"
            gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
          >
            <Card px="0px" mb="20px" minH="600px" maxH="1200px" boxShadow="md">
              {ranked_publishers ? (
                <PublisherRankings
                  columnsData={columnsDataComplex}
                  rankedPublishers={ranked_publishers.sort((a, b) => b.totalTracSpent - a.totalTracSpent)}
                />
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
          </Flex>
        </Grid>
        {/* Delete Product */}
      </Box>
    )
  );
}
