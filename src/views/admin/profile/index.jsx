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
import { Box, Grid, Text, Flex } from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import AssetRecords from "views/admin/profile/components/AssetRecords";
import Notifications from "views/admin/profile/components/Notifications";
import PendingAssets from "views/admin/profile/components/PendingAssets";
import Nodes from "views/admin/profile/components/Nodes";
import Delegations from "views/admin/profile/components/Delegations";
import { columnsDataComplex } from "views/admin/profile/variables/AssetRecords";
import axios from "axios";
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React, { useState, useEffect, useContext } from "react";
const account = localStorage.getItem("account");
const blockchain = localStorage.getItem("blockchain")
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

  useEffect(() => {
    async function fetchData() {
      try {
        if (account) {
          const request_data = {
            approver: account,
            blockchain:
              blockchain === "Neuroweb Testnet"
                ? "otp:20430"
                : blockchain === "Neuroweb Mainnet"
                ? "otp:2043"
                : blockchain === "Chiado Testnet"
                ? "gnosis:10200"
                : blockchain === "Gnosis Mainnet"
                ? "gnosis:100"
                : "",
          };
          const response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/txns/info`,
            request_data,
            config
          );
          await setAssetRecords(response.data.result);

          if (provided_txn_id) {
            const txn_id_response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/txns/info`,
              {
                approver: account,
                txn_id: provided_txn_id,
                blockchain:
                  blockchain === "Neuroweb Testnet"
                    ? "otp:20430"
                    : blockchain === "Neuroweb Mainnet"
                    ? "otp:2043"
                    : blockchain === "Chiado Testnet"
                    ? "gnosis:10200"
                    : blockchain === "Gnosis Mainnet"
                    ? "gnosis:100"
                    : "",
              },
              config
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [account, blockchain]);

  if(!account){
    return(
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
    )
  }

  // if(blockchain !== "NeuroWeb Mainnet" && blockchain !== "NeuroWeb Testnet" && blockchain !== "Gnosis Mainnet" && blockchain !== "Chiado Testnet"){
  //   return(
  //     <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
  //       Please switch to a support blockchain to publish assets.
  //     </Box>
  //   )
  // }

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
      gap={{ base: "20px", xl: "20px" }}>
      <Banner
        gridArea='1 / 1 / 2 / 2'
        banner={banner}
        avatar={avatar}
        name='Adela Parkson'
        job='Product Designer'
        posts='17'
        followers='9.7k'
        following='274'
      />
      <Delegations
        gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
        used={25.6}
        total={50}
      />
      <Nodes
        gridArea={{
          base: "3 / 1 / 4 / 2",
          lg: "1 / 3 / 2 / 4",
        }}
        minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
        pe='20px'
        pb={{ base: "100px", lg: "20px" }}
      />
    </Grid>
      <Grid
        mb='20px'
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
        gap={{ base: "20px", xl: "20px" }}>
        <PendingAssets
          gridArea='1 / 2 / 2 / 2'
          banner={banner}
          avatar={avatar}
          name='Adela Parkson'
          job='Product Designer'
          posts='17'
          followers='9.7k'
          following='274'
          h="800px"
        />
        {asset_records && <AssetRecords
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          minH='365px'
          h="800px"
          pe='20px'
          columnsData={columnsDataComplex}
          asset_records={asset_records}
        />}

      </Grid>
    </Box>
  );
}
