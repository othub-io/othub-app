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
  Flex,
  Grid,
  Text,
  SimpleGrid,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import AssetFilter from "views/admin/inventory/components/AssetFilter";
import AssetCard from "views/admin/inventory/components/AssetCard";
import AssetImage from "../../../../src/assets/img/Knowledge-Asset.jpg";
import { AccountContext } from "../../../AccountContext";
import AssetPage from "views/admin/inventory/components/AssetPage";
import Loading from "components/effects/Loading";
import axios from "axios";

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
  const { blockchain } = useContext(AccountContext);
  const { network } = useContext(AccountContext);
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
  const [recent_assets, setRecentAssets] = useState(null);
  const [users, setUsers] = useState(null);
  const account = localStorage.getItem("account");
  const tracColor = useColorModeValue("brand.900", "white");
  let data;
  let response;
  let args;

  useEffect(() => {
    async function fetchData() {
      try {
        if (url_ual) {
          const segments = url_ual.split(":");
          const argsString =
            segments.length === 3 ? segments[2] : segments[2] + segments[3];
          args = argsString.split("/");
        }

        if (args && args.length === 3) {
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
                : args[0].replace(/\D/g, "") == 8453
                ? "Base Mainnet"
                : args[0].replace(/\D/g, "") == 84532
                ? "Base Testnet"
                : "",
            limit: 500,
            ual: url_ual,
            owner: account
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/assets/info`,
            data,
            config
          );

          setOpenAssetPage(response.data.result[0].data[0]);
        }

        data = {
          network: network,
          blockchain: blockchain,
          limit: 100,
          owner: account,
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

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          { },
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            },
          }
        );

        setUsers(response.data.result)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setRecentAssets(null);
    setOpenAssetPage(false);
    fetchData();
  }, [blockchain, network, account]);

  let explorer_url = "https://dkg.origintrail.io";

  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  if (!account) {
    return (
      <Box pt={{ base: "230px", md: "160px", lg: "160px", xl: "80px" }}>
        <Flex justify="center" align="center" height="100%">
          <Text
            textAlign="center"
            color="#11047A"
            fontSize="20px"
            fontWeight="500"
          >
            Please sign in to view your inventory!
          </Text>
        </Flex>
      </Box>
    );
  }

  if (open_asset_page) {
    return <AssetPage asset_data={open_asset_page} />;
  }

  return (
    !open_asset_page && (
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
            <Flex direction="column">
              {users && recent_assets && recent_assets.length > 0 ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2 , lg: 3 , xl: 3, "2xl": 4}}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  pb="20px"
                  overflow="auto"
                  maxH="800px"
                >
                  {recent_assets.map((asset, index) => {
                    return (
                      <AssetCard
                        key={index} // Assuming UAL is unique for each asset
                        img={AssetImage}
                        download="#"
                        asset={asset}
                        users={users}
                      />
                    );
                  })}
                </SimpleGrid>
              ) : recent_assets && recent_assets.length === 0 ? (
                <SimpleGrid
                  columns={{ base: 1, md: 1 }}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  overflow="auto"
                  h="800px"
                >
                  <Flex justifyContent="center">
                    <Text
                      color="#11047A"
                      fontSize={{
                        base: "xl",
                        md: "lg",
                        lg: "lg",
                        xl: "lg",
                        "2xl": "md",
                        "3xl": "lg",
                      }}
                      mb="5px"
                      fontWeight="bold"
                      me="14px"
                      pt="40px"
                    >
                      No assets found.
                    </Text>
                  </Flex>
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, md: 1 }}
                  gap="20px"
                  mb={{ base: "20px", xl: "0px" }}
                  overflow="auto"
                  h="800px"
                >
                  <Flex justifyContent="center">
                    <Stack
                    mb="auto"
                    mt="auto"
                    >
                      <Spinner
                        thickness="6px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color={tracColor}
                        size="xl"
                        ml="auto"
                        mr="auto"
                      />
                      <Text fontSize="md" color={tracColor}>
                        Loading Inventory...
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
            <AssetFilter setRecentAssets={setRecentAssets} />
          </Flex>
        </Grid>
      </Box>
    )
  );
}
