import React, { useContext, useState, useEffect } from "react";
import ReactJson from "react-json-view";
import DKG from "dkg.js";
import axios from "axios";
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { MdEdit } from "react-icons/md";
import { AccountContext } from "../../../../AccountContext";
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
import Mint from "views/admin/publish/components/Mint";
import FreeMint from "views/admin/publish/components/FreeMint";

const labelStyles = {
  mt: "2",
  ml: "-2.5",
  fontSize: "sm",
};

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

let readable_chain_id;

function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default function Preview(props) {
  const { asset_data, paranet } = props;
  // Chakra Color Mode
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const bg = useColorModeValue("white", "navy.700");
  const tracColor = useColorModeValue("brand.900", "white");
  const [inputValue, setInputValue] = useState(1);
  const { open_view_asset, setOpenViewAsset } = useContext(AccountContext);
  const [mint, setMint] = useState(null);
  const [freeMint, setFreeMint] = useState(null);
  const [txn_info, setTxnInfo] = useState(null);
  const [txn_data, setTxnData] = useState(null);
  const [cost, setCost] = useState(null);
  const [price, setPrice] = useState(null);
  const [bid, setBid] = useState(null);
  const {
    token,
    setToken,
    setAccount,
    connected_blockchain,
    setConnectedBlockchain,
  } = useContext(AccountContext);
  const account = localStorage.getItem("account");
  const blockchain = localStorage.getItem("blockchain");

  useEffect(() => {
    async function fetchData() {
      try {
        if (isValidUUID(asset_data)) {
          let request_data = {
            txn_id: asset_data,
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

          const settings = {
            asset: response.data.result[0].asset_data,
            blockchain:
              blockchain === "Chiado Testnet"
                ? "gnosis:10200"
                : blockchain === "Gnosis Mainnet"
                ? "gnosis:100"
                : blockchain === "NeuroWeb Testnet"
                ? "otp:20430"
                : blockchain === "NeuroWeb Mainnet"
                ? "otp:2043"
                : blockchain === "Base Testnet"
                ? "base:84532"
                : blockchain === "Base Mainnet"
                ? "base:8453"
                : "",
            epochs: inputValue,
            range: blockchain.includes("NeuroWeb") ? "high" : "med",
          };

          const dkg_bid_result = await axios
            .post(
              `${process.env.REACT_APP_API_HOST}/dkg/getBidSuggestion`,
              settings,
              config
            )
            .then((response) => {
              // Handle the successful response here
              return response;
            })
            .catch((error) => {
              // Handle errors here
              console.error(error);
            });

          setBid(dkg_bid_result.data);
          setCost(Number(dkg_bid_result.data) / 1e18);
        } else {
          await setTxnData(asset_data);

          const settings = {
            asset: asset_data,
            blockchain:
              blockchain === "Chiado Testnet"
                ? "gnosis:10200"
                : blockchain === "Gnosis Mainnet"
                ? "gnosis:100"
                : blockchain === "NeuroWeb Testnet"
                ? "otp:20430"
                : blockchain === "NeuroWeb Mainnet"
                ? "otp:2043"
                : blockchain === "Base Testnet"
                ? "base:84532"
                : blockchain === "Base Mainnet"
                ? "base:8453"
                : "",
            epochs: inputValue,
            range: blockchain.includes("NeuroWeb") ? "high" : "med",
          };

          const dkg_bid_result = await axios
            .post(
              `${process.env.REACT_APP_API_HOST}/dkg/getBidSuggestion`,
              settings,
              config
            )
            .then((response) => {
              // Handle the successful response here
              return response;
            })
            .catch((error) => {
              // Handle errors here
              console.error(error);
            });

          setBid(dkg_bid_result.data);
          setCost(Number(dkg_bid_result.data) / 1e18);
        }

        let rsp = await axios.get(
          "https://api.coingecko.com/api/v3/coins/origintrail"
        );
        setPrice(rsp.data.market_data.current_price.usd);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account, connected_blockchain, paranet, inputValue]); //changed from connected_blockchain

  const rejectTxn = async (txn_id) => {
    const request_data = {
      txn_id: txn_id
    };

    await axios.post(
      `${process.env.REACT_APP_API_HOST}/txns/reject`,
      request_data,
      config
    );

    setOpenViewAsset(false)
  };

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
              "0x2105": {
                chainId: "0x2105",
                chainName: "Base Mainnet",
                rpcUrls: ["https://mainnet.base.org"], // replace with actual RPC URL
                nativeCurrency: {
                  name: "Eth",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://basescan.org/"], // replace with actual block explorer URL
              },
              "0x14a34": {
                chainId: "0x14a34",
                chainName: "Base Testnet",
                rpcUrls: ["https://sepolia.base.org"], // replace with actual RPC URL
                nativeCurrency: {
                  name: "eth",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.basescan.org/"], // replace with actual block explorer URL
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

            // Set the readable chain ID
            if (chainId === "0x4fce") {
              readable_chain_id = `NeuroWeb Testnet`;
            } else if (chainId === "0x7fb") {
              readable_chain_id = "NeuroWeb Mainnet";
            } else if (chainId === "0x64") {
              readable_chain_id = "Gnosis Mainnet";
            } else if (chainId === "0x27d8") {
              readable_chain_id = "Chiado Testnet";
            } else if (chainId === "0x2105") {
              readable_chain_id = "Base Mainnet";
            } else if (chainId === "0x14a34") {
              readable_chain_id = "Base Testnet";
            } else {
              readable_chain_id = "Unsupported Chain";
            }
          } else {
            setOpenViewAsset(false);
            console.error("Error switching chain:", switchError);
          }
        }
      } else {
        console.error("MetaMask provider not detected.");
      }
    } catch (error) {
      console.error("Error switching chain:", error);
    }
  };

  if (
    (paranet.blockchain && paranet.blockchain !== blockchain) ||
    (txn_info &&
      txn_info.blockchain === "otp:2043" &&
      blockchain !== "NeuroWeb Mainnet") ||
    (txn_info &&
      txn_info.blockchain === "otp:20430" &&
      blockchain !== "NeuroWeb Testnet") ||
    (txn_info &&
      txn_info.blockchain === "gnosis:100" &&
      blockchain !== "Gnosis Mainnet") ||
    (txn_info &&
      txn_info.blockchain === "gnosis:10200" &&
      blockchain !== "Chiado Testnet") ||
    (txn_info &&
      txn_info.blockchain === "base:8453" &&
      blockchain !== "Base Mainnet") ||
    (txn_info &&
      txn_info.blockchain === "base:84532" &&
      blockchain !== "Base Testnet")
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
          <Text
            color={tracColor}
            fontSize={"lg"}
            textAlign="center"
            fontWeight="bold"
            mt="40px"
          >
            {`The asset or paranet requires you to switch to ${
              txn_info && txn_info.blockchain === "gnosis:10200"
                ? "Chiado Testnet"
                : txn_info && txn_info.blockchain === "gnosis:100"
                ? "Gnosis Mainnet"
                : txn_info && txn_info.blockchain === "otp:20430"
                ? "NeuroWeb Testnet"
                : txn_info && txn_info.blockchain === "otp:2043"
                ? "NeuroWeb Mainnet"
                : paranet
                ? paranet.blockchain
                : ""
            } in order to publish.`}
          </Text>
          <Text
            color={tracColor}
            fontSize={"lg"}
            textAlign="center"
            fontWeight="bold"
            mt="40px"
          >
            {`Do you want to switch to the correct chain?`}
          </Text>
          <Button
            borderColor={tracColor}
            borderWidth="1px"
            color={tracColor}
            mt="80px"
            onClick={() =>
              switchChain(
                (txn_info && txn_info.blockchain === "otp:20430") ||
                  (paranet && paranet.blockchain === "NeuroWeb Testnet")
                  ? "0x4fce"
                  : (txn_info && txn_info.blockchain === "otp:2043") ||
                    (paranet && paranet.blockchain === "NeuroWeb Mainnet")
                  ? "0x7fb"
                  : (txn_info && txn_info.blockchain === "gnosis:100") ||
                    (paranet && paranet.blockchain === "Gnosis Mainnet")
                  ? "0x64"
                  : (txn_info && txn_info.blockchain === "gnosis:10200") ||
                    (paranet && paranet.blockchain === "Chiado Testnet")
                  ? "0x27d8"
                  : (txn_info && txn_info.blockchain === "base:8453") ||
                    (paranet && paranet.blockchain === "Base Mainnet")
                  ? "0x2105"
                  : (txn_info && txn_info.blockchain === "base:84532") ||
                    (paranet && paranet.blockchain === "Base Testnet")
                  ? "0x14a34"
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
        height="740px" // Adjusted height for taller card
      >
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Flex justifyContent="flex-start">
            {blockchain === "NeuroWeb Mainnet" ||
            blockchain === "NeuroWeb Testnet" ? (
              <img
                src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
                style={{ maxWidth: "40px", maxHeight: "40px" }}
              />
            ) : blockchain === "Gnosis Mainnet" ||
              blockchain === "Chiado Testnet" ? (
              <img
                src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
                style={{ maxWidth: "40px", maxHeight: "40px" }}
              />
            ) : blockchain === "Base Mainnet" ||
              blockchain === "Base Testnet" ? (
              <img
                src={`${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`}
                style={{ maxWidth: "40px", maxHeight: "40px" }}
              />
            ) : (
              ""
            )}
          </Flex>
          {!mint && !freeMint && (
            <Button
              bg="none"
              border="solid"
              borderColor={tracColor}
              borderWidth="2px"
              color={tracColor}
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
          )}
        </Flex>
        <Box mb="4">
          <Text fontSize="22px" fontWeight="bold" color={tracColor}>
            {txn_info && txn_info.paranet ? txn_info.txn_id : txn_info && txn_info.txn_id ? txn_info.txn_id : paranet.paranetName ? `${paranet.paranetName}` : "No Paranet Selected"}
          </Text>
          <Text fontSize="12px" color="gray.400" mb="10px">
            {paranet.ual ? `${paranet.ual}` : ""}
          </Text>
          {!mint && !freeMint && (
            <Box
              height="200px"
              bg="gray.100"
              borderRadius="md"
              mb="4"
              overflow="auto"
            >
              <Text textAlign="left">
                <ReactJson src={txn_data ? JSON.parse(txn_data) : {}} />
              </Text>
            </Box>
          )}
          {mint ? (
            <Mint
              epochs={inputValue}
              data={txn_data}
              account={account}
              paranet={paranet}
              bid={bid}
              set_mint={setMint}
              blockchain={
                blockchain === "Chiado Testnet"
                  ? "gnosis:10200"
                  : blockchain === "Gnosis Mainnet"
                  ? "gnosis:100"
                  : blockchain === "NeuroWeb Testnet"
                  ? "otp:20430"
                  : blockchain === "NeuroWeb Mainnet"
                  ? "otp:2043"
                  : blockchain === "Base Testnet"
                  ? "base:84532"
                  : blockchain === "Base Mainnet"
                  ? "base:8453"
                  : ""
              }
            />
          ) : freeMint ? (
            <FreeMint
              epochs={inputValue}
              data={txn_data}
              txn_info={txn_info ? txn_info : ""}
              account={account}
              paranet={paranet}
              bid={bid}
              txn_id={txn_info && txn_info.txn_id}
              set_free_mint={setFreeMint}
              blockchain={
                blockchain === "Chiado Testnet"
                  ? "gnosis:10200"
                  : blockchain === "Gnosis Mainnet"
                  ? "gnosis:100"
                  : blockchain === "NeuroWeb Testnet"
                  ? "otp:20430"
                  : blockchain === "NeuroWeb Mainnet"
                  ? "otp:2043"
                  : blockchain === "Base Testnet"
                  ? "base:84532"
                  : blockchain === "Base Mainnet"
                  ? "base:8453"
                  : ""
              }
            />
          ) : (
            <Box>
              <Text fontSize="20px" fontWeight="bold" color={tracColor}>
                {`Epochs: ${inputValue}`}
              </Text>
              <Slider
                aria-label="slider-ex-6"
                onChange={(value) => setInputValue(value)}
                min={1}
                max={10}
                w="80%"
                ml="10%"
                value={inputValue}
              >
                <SliderMark value={1} {...labelStyles}>
                  1
                </SliderMark>
                <SliderMark value={2} {...labelStyles}>
                  2
                </SliderMark>
                <SliderMark value={3} {...labelStyles}>
                  3
                </SliderMark>
                <SliderMark value={4} {...labelStyles}>
                  4
                </SliderMark>
                <SliderMark value={5} {...labelStyles}>
                  5
                </SliderMark>
                <SliderMark value={6} {...labelStyles}>
                  6
                </SliderMark>
                <SliderMark value={7} {...labelStyles}>
                  7
                </SliderMark>
                <SliderMark value={8} {...labelStyles}>
                  8
                </SliderMark>
                <SliderMark value={9} {...labelStyles}>
                  9
                </SliderMark>
                <SliderMark value={10} {...labelStyles}>
                  10
                </SliderMark>
                <SliderTrack>
                  <SliderFilledTrack
                    backgroundColor={tracColor}
                    shadow="none"
                  />
                </SliderTrack>
                <SliderThumb borderColor={tracColor} />
              </Slider>
              <Flex justifyContent="right" w="80%" ml="20%">
                <Text
                  fontSize="20px"
                  fontWeight="bold"
                  color={tracColor}
                  mr="20px"
                  mt="30px"
                >
                  {`${inputValue * 90} days`}
                </Text>
              </Flex>
              <Flex
                justifyContent="right"
                borderWidth="1px"
                borderColor={tracColor}
                borderTop="none"
                borderRight="none"
                borderLeft="none"
                w="80%"
                ml="20%"
              >
                <Text
                  fontSize="20px"
                  fontWeight="bold"
                  color={tracColor}
                  mr="20px"
                >
                  {`${Number(new Blob([txn_data]).size) / 1000}kb`}
                </Text>
              </Flex>
              <Flex justifyContent="right" w="80%" ml="20%">
                {price && cost ? (
                  <Text
                    fontSize="20px"
                    fontWeight="bold"
                    color={tracColor}
                    ml="20px"
                    mr="20px"
                  >
                    {`${cost.toFixed(3)} TRAC ($${(cost * price).toFixed(2)})`}
                  </Text>
                ) : (
                  <Text
                    fontSize="16px"
                    fontWeight="bold"
                    color={tracColor}
                    ml="20px"
                    mr="20px"
                  >
                    Calculating...
                  </Text>
                )}
              </Flex>
            </Box>
          )}
        </Box>
        {!mint && !freeMint && price && cost && (
          <>
            <Button
              color={tracColor}
              border={"solid 1px"}
              mb="4"
              width="full"
              onClick={() => setMint(true)}
            >
              Mint
            </Button>
            {blockchain &&
              (blockchain === "NeuroWeb Testnet" ||
                blockchain === "Chiado Testnet" ||
                blockchain === "Base Testnet") && (
                <Button
                  color={tracColor}
                  border={"solid 1px"}
                  mb="4"
                  width="full"
                  onClick={() => setFreeMint(true)}
                >
                  Free Mint
                </Button>
              )}
              {txn_info && <Button
              variant="outline"
              colorScheme="red"
              width="full"
              onClick={() => rejectTxn(txn_info.txn_id)}
            >
              Reject
            </Button>}
          </>
        )}
      </Card>
    </Flex>
  );
}
