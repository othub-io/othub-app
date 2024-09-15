import React, { useEffect, useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import DKG from "dkg.js";
import axios from "axios";
import TransferProgressBar from "views/admin/inventory/components/TransferProgressBar";
import TransferFinished from "views/admin/inventory/components/TransferFinished";

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

const Mint = ({ epochs, data, blockchain, account, paranet, ual, receiver, openTransferPreview }) => {
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
          maxNumberOfRetries: 30,
          frequency: 2,
          contentType: "all",
          keywords: `${account}, Created with OTHub`,
          blockchain: bchain,
        };

        const stepHooks = {
          afterHook: (update) => {
            setProgress(update.status);
          },
        };

        const DkgClient = new DKG(node_options);
        setProgress("AWAITING_TRANSFER_APPROVAL");

        let dkg_result = await DkgClient.asset.transfer(
          ual,
          receiver,
          dkgOptions,
          stepHooks
        );

        // Assuming `dkg_result` contains information about the transaction
        setAssetInfo(dkg_result);
        setProgress("ASSET_TRANSFER_COMPLETE");
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
        <TransferProgressBar progress={progress} paranet={paranet}/>
        {asset_info && (
          <TransferFinished asset_info={asset_info} blockchain={blockchain} />
        )}
        {progress=== "ERROR" && <Flex mt="40px">
        <Button
          onClick={() => openTransferPreview(false)}
          variant="outline"
          colorScheme="red"
          width="full"
          >
            Exit
          </Button>
        </Flex>}
      </Box>
    )
  );
};

export default Mint;
