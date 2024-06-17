// Chakra imports
import { Text, useColorModeValue } from "@chakra-ui/react";
// Assets
import Project1 from "assets/img/profile/Project1.png";
import Project2 from "assets/img/profile/Project2.png";
import Project3 from "assets/img/profile/Project3.png";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import Asset from "views/admin/profile/components/Asset";
import axios from "axios";
import { AccountContext } from "../../../../AccountContext";

const config = {
    headers: {
      "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
      Authorization: localStorage.getItem("token"),
    },
  };
  
export default function RecentAsset(props) {
  const { user_info, recent_assets, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const {
    token,
    setToken,
    account,
    setAccount,
    connected_blockchain,
    setConnectedBlockchain,
  } = useContext(AccountContext);
  const queryParameters = new URLSearchParams(window.location.search);
  const provided_txn_id = queryParameters.get("txn_id");
  const { network, setNetwork } = useContext(AccountContext);

  useEffect(() => {
    async function fetchData() {
      try {
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [user_info, network]);

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Catalog
      </Text>
      {/* {pending_assets && <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Assets are waiting for your approval!
      </Text>} */}
    
      {recent_assets && recent_assets.map((asset, index) => (
        <Asset
          boxShadow={cardShadow}
          mb="20px"
          image={`${process.env.REACT_APP_API_HOST}/images?src=Knowledge-Asset.jpg`}
          app_name={asset.app_name}
          epochs={asset.epochs}
          txn_id={asset.txn_id}
          asset_data={asset}
        />
      ))}
    </Card>
  );
}
