import React, { useEffect, useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
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

const Mint = ({ epochs, data, blockchain, account, paranet, set_mint, visible, txn_id }) => {
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

        if (paranet) {
          dkgOptions.paranetUAL = paranet.paranetKnowledgeAssetUAL;
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

        let payload; 
        if(visible === 0){
          payload = {
            private: dkg_txn_data,
          }
        }else{
          payload = {
            public: dkg_txn_data,
          }
        }

        setProgress("AWAITING_ALLOWANCE_INCREASE");

        let dkg_result = await DkgClient.asset.create(
          payload,
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
        <MintProgressBar progress={progress} paranet={paranet} />
        {asset_info && (
          <MintFinished asset_info={asset_info} blockchain={blockchain} txn_id={txn_id}/>
        )}
        {progress === "ERROR" && (
          <Flex mt="40px">
            <Button
              onClick={() => set_mint(false)}
              variant="outline"
              colorScheme="red"
              width="full"
            >
              Exit
            </Button>
          </Flex>
        )}
      </Box>
    )
  );
};

export default Mint;
