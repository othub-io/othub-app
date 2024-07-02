import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import axios from "axios";
import FreeMintProgressBar from "views/admin/publish/components/FreeMintProgressBar";
import FreeMintFinished from "views/admin/publish/components/FreeMintFinished";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

const FreeMint = ({ epochs, data, blockchain, account }) => {
  const [progress, setProgress] = useState(null);
  const [txn_info, setTxnInfo] = useState(null);

  useEffect(() => {
    const mintAndCheckProgress = async () => {
      try {
        // Initial settings for create_n_transfer
        const settings = {
          blockchain: blockchain,
          epochs: epochs,
          receiver: account,
          asset: data,
        };

        // Call the create_n_transfer endpoint
        const createResponse = await axios.post(
          `${process.env.REACT_APP_API_HOST}/dkg/create_n_transfer`,
          settings,
          config
        );

        const txnId = createResponse.data.txn_id;

        // Check progress by calling the txn/info endpoint
        const checkProgress = async () => {
          const progressSettings = { txn_id: txnId };
          const response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/txns/info`,
            progressSettings,
            config
          );

          setProgress(response.data.result[0].progress);

          if (response.data.result[0].progress === "COMPLETE") {
            setTxnInfo(response.data.result[0]);
          }else{
            setTimeout(checkProgress, 2000);
          }
        };

        // Start checking the progress
        checkProgress();
      } catch (error) {
        console.log(error);
      }
    };

    mintAndCheckProgress();
  }, [blockchain, epochs, account, data]);

  return (
    <Box justifyContent="center" mt="20px">
      <FreeMintProgressBar progress={progress}/>
      {txn_info && <FreeMintFinished txn_info={txn_info}/>}
    </Box>
  );
};

export default FreeMint;
