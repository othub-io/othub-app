// Chakra imports
import { Text, useColorModeValue } from "@chakra-ui/react";
// Assets
import Project1 from "assets/img/profile/Project1.png";
import Project2 from "assets/img/profile/Project2.png";
import Project3 from "assets/img/profile/Project3.png";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import Project from "views/admin/publish/components/Project";
import AssetImage from "../../../../../src/assets/img/Knowledge-Asset.jpg";
import { AccountContext } from "../../../../AccountContext";

const config = {
    headers: {
      "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
      Authorization: localStorage.getItem("token"),
    },
  };
  
export default function PendingAssets(props) {
  const { pending_assets, ...rest } = props;
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
 // const [pending_assets, setPendingAssets] = useState(null);
  const queryParameters = new URLSearchParams(window.location.search);
  const provided_txn_id = queryParameters.get("txn_id");

  useEffect(() => {
    async function fetchData() {
      try {
          // const request_data = {
          //   txn_type: "Create",
          //   progress: "PENDING",
          //   approver: user_info.account,
          // };
          // const response = await axios.post(
          //   `${process.env.REACT_APP_API_HOST}/txns/info`,
          //   request_data,
          //   config
          // );
          // await setPendingAssets(response.data.result);

        //   if (provided_txn_id) {
        //     const txn_id_response = await axios.post(
        //       `${process.env.REACT_APP_API_HOST}/txns/info`,
        //       {
        //         approver: account,
        //         txn_id: provided_txn_id,
        //         blockchain:
        //         connected_blockchain === "Neuroweb Testnet"
        //             ? "otp:20430"
        //             : connected_blockchain === "Neuroweb Mainnet"
        //             ? "otp:2043"
        //             : connected_blockchain === "Chiado Testnet"
        //             ? "gnosis:10200"
        //             : connected_blockchain === "Gnosis Mainnet"
        //             ? "gnosis:100"
        //             : "",
        //       },
        //       config
        //     );
        //   }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [pending_assets, connected_blockchain]);

  return (pending_assets &&
    <Card mb={{ base: "0px", "2xl": "20px" }}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mb="4px"
        mt="-20px"
      >
        Pending Assets
      </Text>
      {pending_assets.length > 0 && <Text color={textColorSecondary} fontSize="md" me="26px" mb="10px">
        Assets are waiting for your approval!
      </Text>}
    
      {pending_assets ? pending_assets.map((asset, index) => (
        <Project
          boxShadow="md"
          mb="20px"
          image={AssetImage}
          app_name={asset.app_name}
          epochs={asset.epochs}
          txn_id={asset.txn_id}
          paranet_name={asset.paranet_name}
          blockchain={asset.blockchain}
        />
      )) : ""}
    </Card>
  );
}
