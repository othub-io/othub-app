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
  Input
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
import tableDataTopCreators from "views/admin/marketplace/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/marketplace/variables/tableColumnsTopCreators";
import { AccountContext } from "../../../AccountContext";
import AssetPage from "views/admin/knowledge-assets/components/AssetPage";
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

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
  const [price, setPrice] = useState(0);
  const [recent_assets, setRecentAssets] = useState(null);
  const tracColor = useColorModeValue("brand.900", "white");
  let data;
  let setting;
  let response;

  useEffect(() => {
    async function fetchData() {
      try {
        // if (url_ual) {
        //   const segments = data.url_ual.split(":");
        //   const argsString =
        //     segments.length === 3 ? segments[2] : segments[2] + segments[3];
        //   const args = argsString.split("/");

        //   if (args.length !== 3) {
        //     data = {
        //       network: network,
        //       blockchain: blockchain,
        //       limit: 500,
        //     };
        //     response = await axios.post(
        //       `${process.env.REACT_APP_API_HOST}/assets/info`,
        //       data,
        //       config
        //     );
        //     let asset_sort = response.data.result[0].data.sort(
        //       (a, b) => b.block_timestamp - a.block_timestamp
        //     );
        //     setRecentAssets(asset_sort);
        //   }else{
        //     data = {
        //       blockchain: args[0].replace(/\D/g, "") === 100 ? "Gnosis Mainnet" : args[0].replace(/\D/g, "") === 10200 ? "Chiado Mainnet" : args[0].replace(/\D/g, "") === 2043 ? "NeuroWeb Mainnet" : args[0].replace(/\D/g, "") === 20430 ? "NeuroWeb Testnet" : "",
        //       limit: 500,
        //       ual: url_ual
        //     };
        //     response = await axios.post(
        //       `${process.env.REACT_APP_API_HOST}/assets/info`,
        //       data,
        //       config
        //     );
        //     setOpenAssetPage(response.data.result[0])
        //   }

        // } else {
          data = {
            network: network,
            blockchain: blockchain,
            limit: 500,
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
        ///}
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setOpenAssetPage(false);
    fetchData();
  }, [blockchain, network]);

  let explorer_url = "https://dkg.origintrail.io";

  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  const searchAsset = async(ual) => {
    data = {
      network: network,
      blockchain: blockchain,
      limit: 500,
      ual: ual
    };
    response = await axios.post(
      `${process.env.REACT_APP_API_HOST}/assets/info`,
      data,
      config
    );
    setOpenAssetPage(response.data.result[0])
  };

  if (open_asset_page) {
    return <AssetPage asset_data={open_asset_page} />;
  }

  return (
    !open_asset_page && (
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
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
              {/* <Flex
              mb="20px"
              justifyContent="space-between"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                Trending Knowledge
              </Text>
              <Flex
                align="center"
                me="20px"
                ms={{ base: "24px", md: "0px" }}
                mt={{ base: "20px", md: "0px" }}
              >
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#top"
                >
                  Top
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#art"
                >
                  Art
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#music"
                >
                  Music
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#gaming"
                >
                  Gaming
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#science"
                >
                  Science
                </Link>
                <Link color={textColorBrand} fontWeight="500" to="#sports">
                  Sports
                </Link>
              </Flex>
            </Flex> */}
              {/* <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
              <AssetCard
                name="Abstract Colors"
                author="By Esthera Jackson"
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft1}
                currentbid="0.91 ETH"
                download="#"
              />
              <AssetCard
                name="ETH AI Brain"
                author="By Nick Wilson"
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft2}
                currentbid="0.91 ETH"
                download="#"
              />
              <AssetCard
                name="Mesh Gradients "
                author="By Will Smith"
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft3}
                currentbid="0.91 ETH"
                download="#"
              />
            </SimpleGrid> */}
              <Flex
                px="16px"
                justify="space-between"
                mb="10px"
                align="center"
                maxW="100%"
              >
                <Text
                  mt="0px"
                  mb="36px"
                  color={textColor}
                  fontSize="2xl"
                  ms="24px"
                  fontWeight="700"
                >
                  Recently Published
                </Text>
                <Flex align="center">
                  <Input
                    h="30px"
                    focusBorderColor={tracColor}
                    id="assetInput"
                    mt="auto"
                    placeholder="Search for a ual..."
                  />
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
                </Flex>
              </Flex>
              <SimpleGrid
                columns={{ base: 1, md: 4 }}
                gap="20px"
                mb={{ base: "20px", xl: "0px" }}
                overflow="auto"
                maxH="1300px"
              >
                {recent_assets &&
                  recent_assets.map((asset, index) => {
                    return (
                      <AssetCard
                        key={index} // Assuming UAL is unique for each asset
                        name={asset.token_id}
                        author={asset.publisher}
                        img={AssetImage}
                        download="#"
                        keyword={asset.keyword}
                        UAL={asset.UAL}
                        size={asset.size}
                        triples_number={asset.triples_number}
                        chunks_number={asset.chunks_number}
                        epochs_number={asset.epochs_number}
                        epoch_length_days={asset.epoch_length_days}
                        cost={asset.token_amount}
                        bid={asset.bid}
                        block_ts={asset.block_ts}
                        block_ts_hour={asset.block_ts_hour}
                        state={asset.state}
                        publisher={asset.publisher}
                        owner={asset.owner}
                        winners={asset.winners}
                        recent_assets={recent_assets}
                        index={index}
                        chain_id={asset.chain_id}
                        chainName={asset.chainName}
                        sentiment={asset.sentiment}
                      />
                    );
                  })}
              </SimpleGrid>
            </Flex>
          </Flex>
          <Flex
            flexDirection="column"
            gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
          >
            <Card px="0px" mb="20px">
              <TrendingKnowledge
                tableData={tableDataTopCreators}
                columnsData={tableColumnsTopCreators}
              />
            </Card>
            <Card p="0px">
              <Flex
                align={{ sm: "flex-start", lg: "center" }}
                justify="space-between"
                w="100%"
                px="22px"
                py="18px"
              >
                <Text color={textColor} fontSize="xl" fontWeight="600">
                  History
                </Text>
                <Button variant="action">See all</Button>
              </Flex>

              <HistoryItem
                name="Colorful Heaven"
                author="By Mark Benjamin"
                date="30s ago"
                image={Nft5}
                price="0.91 ETH"
              />
              <HistoryItem
                name="Abstract Colors"
                author="By Esthera Jackson"
                date="58s ago"
                image={Nft1}
                price="0.91 ETH"
              />
              <HistoryItem
                name="ETH AI Brain"
                author="By Nick Wilson"
                date="1m ago"
                image={Nft2}
                price="0.91 ETH"
              />
              <HistoryItem
                name="Swipe Circles"
                author="By Peter Will"
                date="1m ago"
                image={Nft4}
                price="0.91 ETH"
              />
              <HistoryItem
                name="Mesh Gradients "
                author="By Will Smith"
                date="2m ago"
                image={Nft3}
                price="0.91 ETH"
              />
              <HistoryItem
                name="3D Cubes Art"
                author="By Manny Gates"
                date="3m ago"
                image={Nft6}
                price="0.91 ETH"
              />
            </Card>
          </Flex>
        </Grid>
        {/* Delete Product */}
      </Box>
    )
  );
}
