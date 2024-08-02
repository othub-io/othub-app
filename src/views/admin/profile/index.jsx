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
  Box,
  Grid,
  Text,
  Flex,
  GridItem,
  Button,
  SimpleGrid,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Account from "views/admin/profile/components/Account";
import RewardHistory from "views/admin/profile/components/RewardHistory";
import AssetRecords from "views/admin/profile/components/AssetRecords";
import Notifications from "views/admin/profile/components/Notifications";
import PendingAssets from "views/admin/profile/components/PendingAssets";
import RecentAssets from "views/admin/profile/components/RecentAssets";
import AccountActivity from "views/admin/profile/components/AccountActivity";
import Delegations from "views/admin/profile/components/Delegations";
import Positions from "views/admin/profile/components/Positions";
import axios from "axios";
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React, { useState, useEffect, useContext } from "react";
import { AccountContext } from "../../../AccountContext";
import Card from "components/card/Card.js";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/profile/variables/activityColumns";
import NodePage from "views/admin/nodes/components/NodePage";

const queryParameters = new URLSearchParams(window.location.search);
const provided_txn_id = queryParameters.get("txn_id");

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

export default function Dashboard() {
  const [asset_records, setAssetRecords] = useState(null);
  const {
    token,
    setToken,
    setAccount,
    connected_blockchain,
    setConnectedBlockchain,
  } = useContext(AccountContext);
  const [delegations, setDelegations] = useState(null);
  const [delegator_activity, setDelegatorActivity] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [user_info, setUserInfo] = useState(null);
  const account = localStorage.getItem("account");
  const { network, setNetwork } = useContext(AccountContext);
  const [recent_assets, setRecentAssets] = useState(null);
  const [node_profiles, setNodeProfiles] = useState(null);
  const tracColor = useColorModeValue("brand.900", "white");
  const { open_node_page, setOpenNodePage } = useContext(AccountContext);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!account || !network) {
          return;
        }

        const rsp = await axios.get(
          "https://api.coingecko.com/api/v3/coins/origintrail"
        );
        setPrice(rsp.data.market_data.current_price.usd);

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          { account: account },
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            },
          }
        );

        setUserInfo(response.data.result[0]);

        let request_data = {
          approver: account,
          progress: "COMPLETE",
          blockchain:
            connected_blockchain === "Neuroweb Testnet"
              ? "otp:20430"
              : connected_blockchain === "Neuroweb Mainnet"
              ? "otp:2043"
              : connected_blockchain === "Chiado Testnet"
              ? "gnosis:10200"
              : connected_blockchain === "Gnosis Mainnet"
              ? "gnosis:100"
              : "",
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/txns/info`,
          request_data,
          config
        );
        setAssetRecords(response.data.result);

        if (provided_txn_id) {
          const txn_id_response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/txns/info`,
            {
              approver: account,
              txn_id: provided_txn_id,
              blockchain:
                connected_blockchain === "Neuroweb Testnet"
                  ? "otp:20430"
                  : connected_blockchain === "Neuroweb Mainnet"
                  ? "otp:2043"
                  : connected_blockchain === "Chiado Testnet"
                  ? "gnosis:10200"
                  : connected_blockchain === "Gnosis Mainnet"
                  ? "gnosis:100"
                  : "",
            },
            config
          );
        }

        request_data = {
          network: network,
          frequency: "latest",
          //delegator: account,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/delegators/stats`,
          request_data,
          config
        );
        setDelegations(response.data.result);

        request_data = {
          network: network,
          //delegator: account,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/delegators/activity`,
          request_data,
          config
        );
        setDelegatorActivity(response.data.result);

        let data = {
          network: network,
          frequency: "latest",
          //owner: account,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data,
          config
        );

        setNodes(response.data.result);

        request_data = {
          network: network,
          owner: account,
          limit: 10,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/info`,
          request_data,
          config
        );

        await setRecentAssets(response.data.result[0].data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setRecentAssets(null);
    setNodes(null);
    setDelegations(null);
    setAssetRecords(null);
    setUserInfo(null);
    fetchData();
  }, [account, connected_blockchain, network]);

  if (!account) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex justify="center" align="center" height="100%">
          <Text
            textAlign="center"
            color="#11047A"
            fontSize="20px"
            fontWeight="500"
          >
            Please sign in to view your profile.
          </Text>
        </Flex>
      </Box>
    );
  }

  if (open_node_page) {
    return <NodePage node_name={open_node_page} price={price} />;
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={6}
      >
        <SimpleGrid colSpan={1}>
          {delegations && user_info ? (
            <Account
              banner={banner}
              avatar={avatar}
              name="Adela Parkson"
              job="Product Designer"
              posts="17"
              followers="9.7k"
              following="274"
              delegations={delegations ? delegations : ""}
              user_info={user_info ? user_info : ""}
            />
          ) : (
            <Card
              mb={{ base: "0px", lg: "20px" }}
              align="center"
              h="400px"
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

          {delegator_activity && columnsDataComplex ? (
            <AccountActivity
              delegator_activity={delegator_activity}
              columnsData={columnsDataComplex}
            />
          ) : (
            <Card
              direction="column"
              px={{ sm: "20px", lg: "0px" }}
              overflowX={{ sm: "scroll", lg: "scroll" }}
              boxShadow="md"
              h="400px"
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
        </SimpleGrid>
        <SimpleGrid colSpan={1}>
          {user_info && nodes && delegations ? (
            <Positions
              used={25.6}
              total={50}
              delegations={delegations ? delegations : ""}
              user_info={user_info ? user_info : ""}
              nodes={nodes ? nodes : ""}
            />
          ) : (
            <Card
              mb={{ base: "0px", "2xl": "10px" }}
              h="820px"
              overflow="auto"
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
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
