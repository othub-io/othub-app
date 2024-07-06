import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import DKG from "dkg.js";
import axios from "axios";
import MintProgressBar from "views/admin/publish/components/MintProgressBar";
import MintFinished from "views/admin/publish/components/MintFinished";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

const testnet_node_options = {
  endpoint: process.env.REACT_APP_OTNODE_TESTNET_HOSTNAME,
  port: process.env.REACT_APP_OTNODE_TESTNET_PORT,
  useSSL: true,
  maxNumberOfRetries: 100,
};

const mainnet_node_options = {
  endpoint: process.env.REACT_APP_OTNODE_MAINNET_HOSTNAME,
  port: process.env.REACT_APP_OTNODE_MAINNET_PORT,
  useSSL: true,
  maxNumberOfRetries: 100,
};

const Mint = ({ epochs, data, blockchain, account, paranet, bid }) => {
  const [progress, setProgress] = useState(null);
  const [asset_info, setAssetInfo] = useState(null);

  let node_options = mainnet_node_options;
  let explorer_url = "https://dkg.origintrail.io";
  let env = "mainnet";

  if (
    blockchain === "otp:20430" ||
    blockchain === "gnosis:10200" ||
    blockchain === "base:84532"
  ) {
    node_options = testnet_node_options;
    explorer_url = "https://dkg-testnet.origintrail.io";
    env = "testnet";
  }

  useEffect(() => {
    const mintAndCheckProgress = async () => {
      try {
        let bchain = {
          name: blockchain,
          publicKey: account,
        };

        let dkgOptions = {
          environment: env,
          epochsNum: epochs,
          maxNumberOfRetries: 30,
          frequency: 2,
          contentType: "all",
          keywords: `${account}, Created with OTHub`,
          blockchain: bchain,
        };

        if (paranet.ual) {
            dkgOptions.blockchain.paranetUAL = paranet.ual;
          }
          
        //   if (bid) {
        //     dkgOptions.tokenAmount = bid;
        //   }

        const stepHooks = {
          afterHook: (update) => {
            setProgress(update.status);
          },
        };

        const DkgClient = new DKG(node_options);
        let dkg_txn_data = JSON.parse(data);

        setProgress("AWAITING_ALLOWANCE_INCREASE");

        let dkg_result = await DkgClient.asset.create(
          {
            public: dkg_txn_data,
          },
          dkgOptions,
          stepHooks
        );

        // Assuming `dkg_result` contains information about the transaction
        setAssetInfo(dkg_result);
      } catch (error) {
        console.error(error);
        setProgress("ERROR");
      }
    };

    mintAndCheckProgress();
  }, [blockchain, epochs, account, data, paranet]);

  return (
    progress && (
      <Box justifyContent="center" mt="20px">
        <MintProgressBar progress={progress} />
        {asset_info && (
          <MintFinished asset_info={asset_info} blockchain={blockchain} />
        )}
      </Box>
    )
  );
};

export default Mint;
