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
  Button,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Account from "views/admin/publishers/components/Account";
import AssetRecords from "views/admin/profile/components/AssetRecords";
import Notifications from "views/admin/profile/components/Notifications";
import PendingAssets from "views/admin/profile/components/PendingAssets";
import Catalog from "views/admin/publishers/components/Catalog";
import History from "views/admin/publishers/components/History";
import Activity from "views/admin/publishers/components/Activity";
import PreferredParanets from "views/admin/publishers/components/PreferredParanets";
import { columnsDataComplex } from "views/admin/publishers/variables/AssetRecords";
import AssetPage from "views/admin/publishers/components/AssetPage";
import axios from "axios";
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React, { useState, useEffect, useContext } from "react";
import { AccountContext } from "../../../../AccountContext";
import Card from "components/card/Card.js";
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

const queryParameters = new URLSearchParams(window.location.search);
const provided_txn_id = queryParameters.get("txn_id");

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

export default function PublisherPage(props) {
  const [asset_records, setAssetRecords] = useState(null);
  const { publisher } = props;
  const [delegations, setDelegations] = useState(null);
  const { network, setNetwork } = useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");
  const { open_publisher_page, setOpenPublisherPage } =
    useContext(AccountContext);
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
  const [assets, setAssets] = useState(null);
  const [time_publisher_stats, setTimePublisherStats] = useState(null);
  const [latest_publisher_stats, setLatestPublisherStats] = useState(null);
  const [pub_data, setPubData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let request_data = {
          publisher: publisher.publisher,
          network: network,
          limit: 200
        };

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/info`,
          request_data,
          config
        );

        setAssetRecords(response.data.result[0].data);

        request_data = {
          network: network,
          frequency: "monthly",
          publisher: publisher.publisher,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/publishers/stats`,
          request_data,
          config
        );
        setTimePublisherStats(response.data.result);

        request_data = {
          network: network,
          frequency: "latest",
          publisher: publisher.publisher,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/publishers/stats`,
          request_data,
          config
        );
        setLatestPublisherStats(response.data.result[0].data[0]);

        request_data = {
          network: network,
          limit: 1000,
          owner: publisher.publisher,
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/info`,
          request_data,
          config
        );
        setPubData(response.data.result[0].data);

        let asset_sort = response.data.result[0].data.sort(
          (a, b) => b.block_timestamp - a.block_timestamp
        );
        setAssets(asset_sort);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setAssetRecords(null);
    setAssets(null);
    fetchData();
  }, [publisher]);

  if (open_asset_page) {
    return <AssetPage asset_data={open_asset_page} />;
  }

  return (
    publisher &&  (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
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
            onClick={() => setOpenPublisherPage(false)}
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
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1fr 1fr 1.5fr", // Adjusted column widths
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
            publisher={publisher}
            boxShadow="md"
          />
          <PreferredParanets
            gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
            used={25.6}
            total={50}
            boxShadow="md"
            publisher={publisher}
            pub_data={pub_data}
          />
          {time_publisher_stats && latest_publisher_stats ? (
            <Activity
              gridArea={{
                base: "3 / 1 / 4 / 2",
                lg: "1 / 3 / 2 / 4",
              }}
              pe="20px"
              pb={{ base: "100px", lg: "20px" }}
              time_publisher_stats={time_publisher_stats}
              latest_publisher_stats={latest_publisher_stats}
              boxShadow="md"
            />
          ) : (
            <Activity
              gridArea={{
                base: "3 / 1 / 4 / 2",
                lg: "1 / 3 / 2 / 4",
              }}
              pe="20px"
              pb={{ base: "100px", lg: "20px" }}
              boxShadow="md"
            />
          )}
        </Grid>
        <Grid
          mb="20px"
          templateColumns={{
            base: "1fr",
            lg: "repeat(2, 1fr)",
            "2xl": "2.31fr 1.69fr",
          }}
          templateRows={{
            base: "1fr",
            lg: "repeat(2, 1fr)",
            "2xl": "1fr",
          }}
          gap={{ base: "20px", xl: "20px" }}
        >
          {assets ? (
            <Catalog
              gridArea="1 / 2 / 2 / 2"
              banner={banner}
              avatar={avatar}
              name="Adela Parkson"
              job="Product Designer"
              posts="17"
              followers="9.7k"
              following="274"
              h="800px"
              assets={assets}
              boxShadow="md"
            />
          ) : (
            <Catalog
              gridArea="1 / 2 / 2 / 2"
              banner={banner}
              avatar={avatar}
              name="Adela Parkson"
              job="Product Designer"
              posts="17"
              followers="9.7k"
              following="274"
              h="800px"
              boxShadow="md"
            />
          )}
          {asset_records && (
            <History
              gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
              minH="365px"
              h="800px"
              pe="20px"
              columnsData={columnsDataComplex}
              asset_records={asset_records}
              overflow="auto"
              boxShadow="md"
            />
          )}
        </Grid>
      </Box>
    )
  );
}
