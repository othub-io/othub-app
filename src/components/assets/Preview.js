// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { MdEdit } from "react-icons/md";
import { AccountContext } from "../../AccountContext";
import Hammer from "components/effects/Hammer.js";
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
  MdSearch,
} from "react-icons/md";

let readable_chain_id;

export default function Preview(props) {
  const { txn_id } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const bg = useColorModeValue("white", "navy.700");
  const tracColor = useColorModeValue("brand.900", "white");
  const { open_view_asset, setOpenViewAsset } = useContext(AccountContext);
  const [isMinted, setIsMinted] = useState(false);
  const [txn_info, setTxnInfo] = useState(null);
  const [txn_data, setTxnData] = useState(null);
  const {
    token,
    setToken,
    account,
    setAccount,
    connected_blockchain,
    setConnectedBlockchain,
  } = useContext(AccountContext);

  const config = {
    headers: {
      "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
      Authorization: localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let request_data = {
          txn_id: txn_id,
          approver: account,
        };
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/txns/info`,
          request_data,
          config
        );

        await setTxnInfo(response.data.result[0]);

        request_data = {
          data_id: response.data.result[0].data_id,
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/txns/data`,
          request_data,
          config
        );

        await setTxnData(response.data.result[0].asset_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [account, connected_blockchain]);

  const switchChain = async (chainId) => {
    try {
      const provider = await detectEthereumProvider();

      if (provider) {
        const chainData = {
          chainId: chainId,
        };

        try {
          // Attempt to switch network
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [chainData],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            const chainParams = {
              "0x4fce": {
                chainId: "0x4fce",
                chainName: "NeuroWeb Testnet",
                rpcUrls: ["https://lofar-testnet.origin-trail.network"], // replace with actual RPC URL
                nativeCurrency: {
                  name: "MNEURO",
                  symbol: "Neuro",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://neuroweb-testnet.subscan.io/"], // replace with actual block explorer URL
              },
              "0x7fb": {
                chainId: "0x7fb",
                chainName: "NeuroWeb Mainnet",
                rpcUrls: [
                  "https://astrosat-parachain-rpc.origin-trail.network/",
                ], // replace with actual RPC URL
                nativeCurrency: {
                  name: "MNEURO",
                  symbol: "Neuro",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://neuroweb.subscan.io/"], // replace with actual block explorer URL
              },
              "0x64": {
                chainId: "0x64",
                chainName: "Gnosis Mainnet",
                rpcUrls: ["https://rpc.gnosischain.com"], // replace with actual RPC URL
                nativeCurrency: {
                  name: "xDAI",
                  symbol: "xDAI",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://gnosisscan.io/"], // replace with actual block explorer URL
              },
              "0x27d8": {
                chainId: "0x27d8",
                chainName: "Chiado Testnet",
                rpcUrls: ["https://rpc.chiadochain.net"], // replace with actual RPC URL
                nativeCurrency: {
                  name: "xDai",
                  symbol: "xDAI",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://gnosis-chiado.blockscout.com/"], // replace with actual block explorer URL
              },
            };

            // Add the chain to MetaMask
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [chainParams[chainId]],
            });

            // Retry the switch after adding the chain
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [chainData],
            });
          } else {
            console.error("Error switching chain:", switchError);
          }
        }

        // Set the readable chain ID
        if (chainId === "0x4fce") {
          readable_chain_id = `NeuroWeb Testnet`;
        } else if (chainId === "0x7fb") {
          readable_chain_id = "NeuroWeb Mainnet";
        } else if (chainId === "0x64") {
          readable_chain_id = "Gnosis Mainnet";
        } else if (chainId === "0x27d8") {
          readable_chain_id = "Chiado Testnet";
        } else {
          readable_chain_id = "Unsupported Chain";
        }

        setConnectedBlockchain(readable_chain_id);
        //localStorage.setItem("blockchain", readable_chain_id);
      } else {
        console.error("MetaMask provider not detected.");
      }
    } catch (error) {
      console.error("Error switching chain:", error);
    }
  };

  if (
    (txn_info &&
      txn_info.blockchain === "otp:2043" &&
      connected_blockchain !== "NeuroWeb Mainnet") ||
    (txn_info &&
      txn_info.blockchain === "otp:20430" &&
      connected_blockchain !== "NeuroWeb Testnet") ||
    (txn_info &&
      txn_info.blockchain === "gnosis:100" &&
      connected_blockchain !== "Gnosis Mainnet") ||
    (txn_info &&
      txn_info.blockchain === "gnosis:10200" &&
      connected_blockchain !== "Chiado Testnet")
  ) {
    return (
      <Flex
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(226,232,240, 0.5)"
        justifyContent="center"
        alignItems="center"
        zIndex="1000"
      >
        <Card
          bg="white"
          p="6"
          boxShadow="lg"
          borderRadius="md"
          width={{ base: "90%", md: "60%", lg: "40%" }}
          maxWidth="500px"
          height="600px" // Adjusted height for taller card
        >
          <Flex w="100%" justifyContent="flex-end">
            <Button
              bg="none"
              border="solid"
              borderColor={tracColor}
              borderWidth="2px"
              color={tracColor}
              _hover={{ bg: "none" }}
              _active={{ bg: "none" }}
              _focus={{ bg: "none" }}
              right="14px"
              borderRadius="5px"
              pl="10px"
              pr="10px"
              w="90px"
              h="36px"
              mb="10px"
              onClick={() => {
                setOpenViewAsset(false);
              }}
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
          </Flex>
          <Text>
            Your asset is currently on a different blockchain. Do you want to
            switch to the correct chain?
          </Text>
          <Button
            onClick={() =>
              switchChain(
                txn_info.blockchain === "otp:20430"
                  ? "0x4fce"
                  : txn_info.blockchain === "otp:2043"
                  ? "0x7fb"
                  : txn_info.blockchain === "gnosis:100"
                  ? "0x64"
                  : txn_info.blockchain === "gnosis:10200"
                  ? "0x27d8"
                  : ""
              )
            }
          >
            Switch Chain
          </Button>
        </Card>
      </Flex>
    );
  }

  return (
    txn_info && (
      <Flex
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(226,232,240, 0.5)"
        justifyContent="center"
        alignItems="center"
        zIndex="1000"
      >
        <Card
          bg="white"
          p="6"
          boxShadow="lg"
          borderRadius="md"
          width={{ base: "90%", md: "60%", lg: "40%" }}
          maxWidth="500px"
          height="700px" // Adjusted height for taller card
        >
          <Flex w="100%" justifyContent="flex-end">
            <Button
              bg="none"
              border="solid"
              borderColor={tracColor}
              borderWidth="2px"
              color={tracColor}
              _hover={{ bg: "none" }}
              _active={{ bg: "none" }}
              _focus={{ bg: "none" }}
              right="14px"
              borderRadius="5px"
              pl="10px"
              pr="10px"
              w="90px"
              h="36px"
              mb="10px"
              onClick={() => {
                setOpenViewAsset(false);
              }}
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
          </Flex>
          <Box mb="4">
            <Text fontSize="22px" fontWeight="bold">
              {txn_info.txn_id}
            </Text>
            <Box height="200px" bg="gray.200" borderRadius="md" mb="4">
              {isMinted ? (
                // Placeholder for animation component
                <Text textAlign="center" pt="6">
                  Animation Component Placeholder
                </Text>
              ) : (
                <Text textAlign="center" pt="6">
                  {txn_data}
                </Text>
              )}
            </Box>
            <Text>
              Here you can view the transaction data and decide whether to mint
              or reject the asset.
            </Text>
          </Box>
          {isMinted ? (
            // Placeholder for animation component
            <Hammer />
          ) : (
            <>
              <Button
                color={tracColor}
                border={"solid 1px"}
                mb="4"
                width="full"
                onClick={() => setIsMinted(true)}
              >
                Mint
              </Button>
              <Button
                color={tracColor}
                border={"solid 1px"}
                mb="4"
                width="full"
                onClick={() => setIsMinted(true)}
              >
                Free Mint
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                width="full"
                onClick={() => setOpenViewAsset(false)}
              >
                Reject
              </Button>
            </>
          )}
        </Card>
      </Flex>
    )
  );
}
