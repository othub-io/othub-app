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
import TrendingKnowledge from "views/admin/knowledge-assets/components/TrendingKnowledge";
import HistoryItem from "views/admin/marketplace/components/HistoryItem";
import AssetCard from "views/admin/knowledge-assets/components/AssetCard";
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
import { columnsDataComplex } from "views/admin/knowledge-assets/variables/trendingKnowledgeColumns";
import { AccountContext } from "../../../AccountContext";
import AssetPage from "views/admin/knowledge-assets/components/AssetPage";
import Loading from "components/effects/Loading";
import axios from "axios";
import { TransactionMissingReceiptOrBlockHashError } from "web3";
import { MdSearch } from "react-icons/md";
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

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
  const [price, setPrice] = useState(0);
  const [recent_assets, setRecentAssets] = useState(null);
  const [trending_assets, setTrendingAssets] = useState(null);
  const [popular_assets, setPopularAssets] = useState(null);
  const tracColor = useColorModeValue("brand.900", "white");
  const [click, setClick] = useState(1);
  const [error, setError] = useState(null);
  let data;
  let setting;
  let response;
  let topic_list = [];
  let args;

  useEffect(() => {
    async function fetchData() {
      try {
        topic_list = [];
        data = {
          network: network,
          blockchain: blockchain,
          limit: 100,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/info`,
          data,
          config
        );
        let asset_sort = response.data.result[0].data.sort(
          (a, b) => b.block_timestamp - a.block_timestamp
        );
        setRecentAssets(asset_sort);

        data = {
          network: network,
          frequency: "last7d",
          blockchain: blockchain,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/sentiment/info`,
          data,
          config
        );

        // Set to keep track of unique token_id and contract_address combinations
        let uniqueAssetCombinations = new Set();

        for (const asset of response.data.result) {
          // Construct a unique identifier for the combination
          const identifier = `${asset.token_id}-${asset.asset_contract}`;

          // Check if the combination is already in the set
          if (!uniqueAssetCombinations.has(identifier)) {
            // If not, add the object to the result array and the identifier to the set
            data = {
              network: network,
              token_id: asset.token_id,
              asset_contract: asset.asset_contract,
            };

            response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/assets/info`,
              data,
              config
            );

            topic_list.push(response.data.result[0].data[0]);

            uniqueAssetCombinations.add(identifier);
          }
        }

        let filtered_topics = topic_list.filter((topic) => {
          const diff =
            JSON.parse(topic.sentiment)[0] - JSON.parse(topic.sentiment)[1];
          return diff >= 0;
        });

        let topic_sort = filtered_topics.sort((a, b) => {
          const diffA = JSON.parse(a.sentiment)[0] - JSON.parse(a.sentiment)[1];
          const diffB = JSON.parse(b.sentiment)[0] - JSON.parse(b.sentiment)[1];
          return diffB - diffA; // For descending order
        });

        setTrendingAssets(topic_sort);

        if (url_ual) {
          const segments = url_ual.split(":");
          const argsString =
            segments.length === 3 ? segments[2] : segments[2] + segments[3];
          args = argsString.split("/");
        }

        if (args.length === 3) {
          data = {
            blockchain:
              args[0].replace(/\D/g, "") == 100
                ? "Gnosis Mainnet"
                : args[0].replace(/\D/g, "") == 10200
                ? "Chiado Testnet"
                : args[0].replace(/\D/g, "") == 2043
                ? "NeuroWeb Mainnet"
                : args[0].replace(/\D/g, "") == 20430
                ? "NeuroWeb Testnet"
                : "",
            limit: 500,
            ual: url_ual,
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/assets/info`,
            data,
            config
          );

          setOpenAssetPage(response.data.result[0].data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setRecentAssets(null);
    setTrendingAssets(null);
    setOpenAssetPage(false);
    fetchData();
  }, [blockchain, network]);

  let explorer_url = "https://dkg.origintrail.io";

  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  const searchAsset = async (ual) => {
    data = {
      network: network,
      blockchain: blockchain,
      ual: ual,
    };
    response = await axios.post(
      `${process.env.REACT_APP_API_HOST}/assets/info`,
      data,
      config
    );

    if (response.data.result) {
      setOpenAssetPage(response.data.result[0].data[0]);
    }
  };

  const setPopular = async () => {
    setRecentAssets(null);
    let topic_list = [];
    data = {
      network: network,
      frequency: "last7d",
      blockchain: blockchain,
    };
    response = await axios.post(
      `${process.env.REACT_APP_API_HOST}/sentiment/info`,
      data,
      config
    );

    // Set to keep track of unique token_id and contract_address combinations
    let uniqueAssetCombinations = new Set();

    for (const asset of response.data.result) {
      // Construct a unique identifier for the combination
      const identifier = asset.token_id && asset.asset_contract ? `${asset.token_id}-${asset.asset_contract}` : null

      // Check if the combination is already in the set
      if (!uniqueAssetCombinations.has(identifier)) {
        // If not, add the object to the result array and the identifier to the set
        data = {
          network: network,
          limit: 10000,
          token_id: asset.token_id,
          asset_contract: asset.asset_contract,
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/info`,
          data,
          config
        );

        topic_list.push(response.data.result[0].data[0]);

        uniqueAssetCombinations.add(identifier);
      }
    }

    let filtered_topics = topic_list.filter((topic) => {
      const diff =
        JSON.parse(topic.sentiment)[0] - JSON.parse(topic.sentiment)[1];
      return diff >= 0;
    });

    let topic_sort = filtered_topics.sort((a, b) => {
      const diffA = JSON.parse(a.sentiment)[0] - JSON.parse(a.sentiment)[1];
      const diffB = JSON.parse(b.sentiment)[0] - JSON.parse(b.sentiment)[1];
      return diffB - diffA; // For descending order
    });

    setRecentAssets(topic_sort);
  };

  const setRecent = async () => {
    setRecentAssets(null);
    let data = {
      network: network,
      blockchain: blockchain,
      limit: 500,
    };
    let response = await axios.post(
      `${process.env.REACT_APP_API_HOST}/assets/info`,
      data,
      config
    );
    let asset_sort = response.data.result[0].data.sort(
      (a, b) => b.block_timestamp - a.block_timestamp
    );
    setRecentAssets(asset_sort);
  };

  const changeTopic = async (topic, chain_name) => {
    try {
      setRecentAssets(null);
      topic_list = [];
      data = {
        network: network,
      };

      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/misc/blockchains`,
        data,
        config
      );

      if (!chain_name) {
        for (const bchain of response.data.blockchains) {
          if (
            bchain.chain_name !== "NeuroWeb Testnet" ||
            bchain.chain_name !== "NeuroWeb Mainnet"
          ) {
            data = {
              blockchain:
                bchain.chain_name === "NeuroWeb Testnet"
                  ? "otp:20430"
                  : bchain.chain_name === "NeuroWeb Mainnet"
                  ? "otp:2043"
                  : bchain.chain_name === "Chiado Testnet"
                  ? "gnosis:10200"
                  : bchain.chain_name === "Gnosis Mainnet"
                  ? "gnosis:100"
                  : "",
              query: `PREFIX schema: <http://schema.org/>
          
              SELECT ?subject (SAMPLE(?name) AS ?name) (SAMPLE(?description) AS ?description) (SAMPLE(?category) AS ?category) (REPLACE(STR(?g), "^assertion:", "") AS ?assertion)
              WHERE {
                GRAPH ?g {
                  ?subject ?p1 ?name .
                  ?subject ?p2 ?description .
                  OPTIONAL { ?subject ?p3 ?category . }
              
                  FILTER(
                    (isLiteral(?name) && CONTAINS(LCASE(str(?name)), "${topic}")) ||
                    (isLiteral(?description) && CONTAINS(LCASE(str(?description)), "${topic}")) ||
                    (isLiteral(?category) && CONTAINS(LCASE(str(?category)), "${topic}"))
                  )
                }
                ?ual schema:assertion ?g .
                FILTER(CONTAINS(str(?ual), "${bchain.chain_id}"))
              }
              GROUP BY ?subject ?g
              LIMIT 200
              `,
            };

            response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/dkg/query`,
              data,
              config
            );

            for (const asset of response.data.data) {
              data = {
                blockchain: bchain.chain_name,
                limit: 1000,
                state: JSON.parse(asset.assertion),
              };

              response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/assets/info`,
                data,
                config
              );

              topic_list.push(response.data.result[0].data[0]);
            }
          }

          let topic_sort = topic_list.sort((a, b) => {
            const diffA = JSON.parse(a.sentiment)[0] - JSON.parse(a.sentiment)[1];
            const diffB = JSON.parse(b.sentiment)[0] - JSON.parse(b.sentiment)[1];
            return diffB - diffA; // For descending order
          });

          setRecentAssets(topic_sort);
        }
      } else {
        let index = response.data.blockchains.findIndex(
          (item) => item.chain_name === chain_name
        );
        data = {
          blockchain: response.data.blockchains[index].chain_name,
          query: `PREFIX schema: <http://schema.org/>
      
          SELECT ?subject (SAMPLE(?name) AS ?name) (SAMPLE(?description) AS ?description) (SAMPLE(?category) AS ?category) (REPLACE(STR(?g), "^assertion:", "") AS ?assertion)
          WHERE {
            GRAPH ?g {
              ?subject ?p1 ?name .
              ?subject ?p2 ?description .
              OPTIONAL { ?subject ?p3 ?category . }
          
              FILTER(
                (isLiteral(?name) && CONTAINS(LCASE(str(?name)), "${topic}")) ||
                (isLiteral(?description) && CONTAINS(LCASE(str(?description)), "${topic}")) ||
                (isLiteral(?category) && CONTAINS(LCASE(str(?category)), "${topic}"))
              )
            }
            ?ual schema:assertion ?g .
            FILTER(CONTAINS(str(?ual), "${response.data.blockchains[index].chain_id}"))
          }
          GROUP BY ?subject ?g
          LIMIT 100
          `,
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/dkg/query`,
          data,
          config
        );

        for (const asset of response.data.data) {
          data = {
            blockchain: chain_name,
            limit: 1000,
            state: JSON.parse(asset.assertion),
          };

          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/assets/info`,
            data,
            config
          );

          topic_list.push(response.data.result[0].data[0]);
        }
      }

      let topic_sort = topic_list.sort((a, b) => {
        const diffA = JSON.parse(a.sentiment)[0] - JSON.parse(a.sentiment)[1];
        const diffB = JSON.parse(b.sentiment)[0] - JSON.parse(b.sentiment)[1];
        return diffB - diffA; // For descending order
      });

      setRecentAssets(topic_sort);
    } catch (e) {
      setError(e);
    }
  };

  if (open_asset_page) {
    return <AssetPage asset_data={open_asset_page} />;
  }

  // if (error) {
  //   <Box pt={{ base: "180px", md: "80px", xl: "80px" }} mt="-20px">
  //     {error}
  //     <Button onClick={""}>Reload</Button>
  //   </Box>;
  // }

  return (
    !open_asset_page && (
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
                  <Link
                    color={tracColor}
                    fontWeight="500"
                    me={{ base: "34px", md: "44px" }}
                    onClick={() => {
                      setPopular();
                      setClick(0);
                    }}
                    textDecoration={click === 0 ? "underline" : "none"}
                  >
                    Popular
                  </Link>
                  <Link
                    color={tracColor}
                    fontWeight="500"
                    me={{ base: "34px", md: "44px" }}
                    onClick={() => {
                      setRecent();
                      setClick(1);
                    }}
                    textDecoration={click === 1 ? "underline" : "none"}
                  >
                    New
                  </Link>
                  <Link
                    color={tracColor}
                    fontWeight="500"
                    me={{ base: "34px", md: "44px" }}
                    textDecoration={click === 2 ? "underline" : "none"}
                    onClick={() => {
                      changeTopic("art", blockchain);
                      setClick(2);
                    }}
                  >
                    Art
                  </Link>
                  <Link
                    color={tracColor}
                    fontWeight="500"
                    me={{ base: "34px", md: "44px" }}
                    textDecoration={click === 3 ? "underline" : "none"}
                    onClick={() => {
                      changeTopic("music", blockchain);
                      setClick(3);
                    }}
                  >
                    Music
                  </Link>
                  <Link
                    color={tracColor}
                    fontWeight="500"
                    me={{ base: "34px", md: "44px" }}
                    textDecoration={click === 4 ? "underline" : "none"}
                    onClick={() => {
                      changeTopic("gam", blockchain);
                      setClick(4);
                    }}
                  >
                    Gaming
                  </Link>
                  <Link
                    color={tracColor}
                    fontWeight="500"
                    me={{ base: "34px", md: "44px" }}
                    textDecoration={click === 5 ? "underline" : "none"}
                    onClick={() => {
                      changeTopic("science", blockchain);
                      setClick(5);
                    }}
                  >
                    Science
                  </Link>
                  <Link
                    color={tracColor}
                    fontWeight="500"
                    onClick={() => {
                      changeTopic("sport", blockchain);
                      setClick(6);
                    }}
                    textDecoration={click === 6 ? "underline" : "none"}
                  >
                    Sports
                  </Link>
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
                    searchAsset(inputValue);
                  }}
                />
                <Input
                  h="30px"
                  focusBorderColor={tracColor}
                  id="assetInput"
                  mt="auto"
                  w="300px"
                  placeholder="Search for a ual..."
                />
              </Flex>
              {recent_assets ? (
                <SimpleGrid
                  columns={{ base: 1, md: 4 }}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  overflow="auto"
                  maxH="1300px"
                >
                  {recent_assets.map((asset, index) => {
                    return (
                      <AssetCard
                        key={index} // Assuming UAL is unique for each asset
                        img={AssetImage}
                        download="#"
                        asset={asset}
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
                  boxShadow="md"
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
            <Card px="0px" mb="20px" minH="600px" maxH="1200px" boxShadow="md">
              {trending_assets ? (
                <TrendingKnowledge
                  columnsData={columnsDataComplex}
                  trending_assets={trending_assets}
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
