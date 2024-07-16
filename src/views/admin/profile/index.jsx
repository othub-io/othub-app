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
import { Box, Grid, Text, Flex, Button } from "@chakra-ui/react";

// Custom components
import Account from "views/admin/profile/components/Account";
import AssetRecords from "views/admin/profile/components/AssetRecords";
import Notifications from "views/admin/profile/components/Notifications";
import PendingAssets from "views/admin/profile/components/PendingAssets";
import RecentAssets from "views/admin/profile/components/RecentAssets";
import Nodes from "views/admin/profile/components/Nodes";
import Delegations from "views/admin/profile/components/Delegations";
import { columnsDataComplex } from "views/admin/profile/variables/AssetRecords";
import axios from "axios";
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React, { useState, useEffect, useContext } from "react";
import { AccountContext } from "../../../AccountContext";
import Card from "components/card/Card.js";

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
  const [nodes, setNodes] = useState(null);
  const [user_info, setUserInfo] = useState(null);
  const account = localStorage.getItem("account");
  const { network, setNetwork } = useContext(AccountContext);
  const [recent_assets, setRecentAssets] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!account || !network) {
          return;
        }

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          {account: account},
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
          limit: 10
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
    setRecentAssets(null)
    setNodes(null)
    setDelegations(null)
    setAssetRecords(null)
    setUserInfo(null)
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

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.2fr 1.17fr 1.17fr", // Adjusted column widths
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Account
          gridArea="1 / 1 / 2 / 2"
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
        <Delegations
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          used={25.6}
          total={50}
          delegations={delegations ? delegations : ""}
          user_info={user_info ? user_info : ""}
        />
        <Nodes
            gridArea={{
              base: "3 / 1 / 4 / 2",
              lg: "1 / 3 / 2 / 4",
            }}
            minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
            pe="20px"
            pb={{ base: "100px", lg: "20px" }}
            nodes={nodes ? nodes : ""}
            user_info={user_info ? user_info : ""}
          />
      </Grid>
      <Grid
        mb="20px"
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1.34fr 2.62fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <RecentAssets
          gridArea="1 / 2 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name="Adela Parkson"
          job="Product Designer"
          posts="17"
          followers="9.7k"
          following="274"
          h="800px"
          user_info={user_info ? user_info : ""}
          recent_assets={recent_assets ? recent_assets : ""}
        />
        {asset_records && <AssetRecords
            gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
            minH="365px"
            h="800px"
            pe="20px"
            columnsData={columnsDataComplex}
            asset_records={asset_records}
          />}
      </Grid>
    </Box>
  );
}
