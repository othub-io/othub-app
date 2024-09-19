import React, { useState, useEffect, useContext } from "react";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Input,
  background,
} from "@chakra-ui/react";

import { MdArrowCircleLeft, MdPreview } from "react-icons/md";

// Custom components
import PendingAssets from "views/admin/publish/components/PendingAssets";
import ParanetDrop from "views/admin/publish/components/ParanetDrop";
import FormatDrop from "views/admin/publish/components/FormatDrop";
import TypeDrop from "views/admin/publish/components/TypeDrop";
import EventForm from "views/admin/publish/components/EventForm";
import OrganizationForm from "views/admin/publish/components/OrganizationForm";
import ProductForm from "views/admin/publish/components/ProductForm";
import PersonForm from "views/admin/publish/components/PersonForm";
import FileUpload from "views/admin/publish/components/FileUpload";
import RawJSON from "views/admin/publish/components/RawJSON";
import Preview from "views/admin/publish/components/Preview.js";
import Card from "components/card/Card.js";
import { AccountContext } from "../../../AccountContext";
import Loading from "components/effects/Loading";
import detectEthereumProvider from "@metamask/detect-provider";
import axios from "axios";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};
const queryParameters = new URLSearchParams(window.location.search);
let txn_id = queryParameters.get("txn_id");

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const tracColor = useColorModeValue("brand.900", "white");
  const [form_error, setFormError] = useState(true);
  const [pending_assets, setPendingAssets] = useState(null);
  const account = localStorage.getItem("account");
  let readable_chain_id;
  const blockchain = localStorage.getItem("blockchain");

  const {
    connected_blockchain,
    network,
    open_view_asset,
    setOpenViewAsset,
    selectedFile,
    setSelectedFile,
    displayContent,
    setDisplayContent,
    paranet,
    setParanet,
    format,
    setFormat,
    type,
    setType,
  } = useContext(AccountContext);

  useEffect(() => {
    async function fetchData() {
      try {
        if (isValidUUID(txn_id)) {
          setOpenViewAsset(txn_id)
        }
        const request_data = {
          txn_type: "Create",
          progress: "PENDING",
          approver: account,
        };
        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/txns/info`,
          request_data,
          config
        );

        await setPendingAssets(response.data.result);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account, connected_blockchain, paranet,open_view_asset]);

  let explorer_url = "https://dkg.origintrail.io";

  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  if (open_view_asset) {
    txn_id = null;
    return <Preview asset_data={open_view_asset} paranet={paranet}/>;
  }

  if (!account) {
    return (
      <Box pt={{ base: "230px", md: "160px", lg: "160px", xl: "80px" }}>
        <Flex justify="center" align="center" height="100%">
          <Text
            textAlign="center"
            color="#11047A"
            fontSize="20px"
            fontWeight="500"
          >
            Please sign in to publish assets!
          </Text>
        </Flex>
      </Box>
    );
  }

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
    blockchain !== "NeuroWeb Testnet" &&
    blockchain !== "NeuroWeb Mainnet" &&
    blockchain !== "Chiado Testnet" &&
    blockchain !== "Gnosis Mainnet" &&
    blockchain !== "Base Testnet" &&
    blockchain !== "Base Mainnet"
  ) {
    return (
      <Box pt={{ base: "230px", md: "160px", lg: "160px", xl: "80px" }}>
        <Box>
          <Text
            textAlign="center"
            color="#11047A"
            fontSize="28px"
            fontWeight="500"
            mb="40px"
            mt="40px"
          >
            Connected with an unsupported blockchain.
          </Text>
        </Box>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap="20px"
          mb={{ base: "20px", xl: "0px" }}
          overflow="auto"
          pb="20px"
        >
          <Card boxShadow="md">
            <Flex alignItems="flex-end" mb="10px">
              <img
                src={`${process.env.REACT_APP_API_HOST}/images?src=node20430-logo.png`}
                style={{
                  maxWidth: "55px",
                  maxHeight: "55px",
                  marginTop: "10px",
                }}
              />
              <Text fontSize="26px" marginTop="auto" fontWeight="bold">
                euroWeb
              </Text>
            </Flex>

            <Box>
              <Button
                color={tracColor}
                border={"solid 1px"}
                mb="4"
                width="full"
                onClick={() => switchChain("0x7fb")}
              >
                NeuroWeb Mainnet
              </Button>
              <Button
                color={tracColor}
                border={"solid 1px"}
                mb="4"
                width="full"
                onClick={() => switchChain("0x4fce")}
              >
                NeuroWeb Testnet
              </Button>
            </Box>
          </Card>
          <Card boxShadow="md">
            <img
              src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_name_logo.svg`}
              style={{
                maxWidth: "200px",
                maxHeight: "100px",
                marginTop: "13px",
              }}
            />
            <Box mt="20px">
              <Button
                color={tracColor}
                border={"solid 1px"}
                mb="4"
                width="full"
                onClick={() => switchChain("0x64")}
              >
                Gnosis Mainnet
              </Button>
              <Button
                color={tracColor}
                border={"solid 1px"}
                mb="4"
                width="full"
                onClick={() => switchChain("0x27d8")}
              >
                Chiado Testnet
              </Button>
            </Box>
          </Card>
          <Card boxShadow="md">
            <img
              src={`${process.env.REACT_APP_API_HOST}/images?src=base_name_logo.svg`}
              style={{ maxWidth: "200px", maxHeight: "100px" }}
            />
            <Box mt="20px">
              <Button
                color={tracColor}
                border={"solid 1px"}
                mb="4"
                width="full"
                onClick={() => switchChain("0x2105")}
              >
                Base Mainnet
              </Button>
              <Button
                color={tracColor}
                border={"solid 1px"}
                mb="4"
                width="full"
                onClick={() => switchChain("0x14a34")}
              >
                Base Testnet
              </Button>
            </Box>
          </Card>
        </SimpleGrid>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "230px", md: "160px", lg: "160px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
        >
          <Flex direction="column">
            <Flex
              mb="20px"
              justifyContent="space-between"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Card h="100px" boxShadow="md">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="100%"
                >
                  <Box>
                    {network && (
                      <ParanetDrop
                        network={network}
                        set_paranet={setParanet}
                        set_format={setFormat}
                        set_type={setType}
                        paranet={paranet}
                        display_content={setDisplayContent}
                        selected_file={setSelectedFile}
                      />
                    )}
                    <FormatDrop
                      network={network}
                      paranet={paranet}
                      format={format}
                      set_format={setFormat}
                      set_type={setType}
                      display_content={setDisplayContent}
                      selected_file={setSelectedFile}
                    />
                    {format === "Form" && (
                      <TypeDrop
                        network={network}
                        format={format}
                        set_type={setType}
                        type={type}
                        display_content={setDisplayContent}
                        selected_file={setSelectedFile}
                      />
                    )}
                  </Box>
                  {(displayContent || selectedFile) && !form_error && (
                    <Button
                      bg="none"
                      border="solid"
                      borderColor={tracColor}
                      borderWidth="2px"
                      color={tracColor}
                      borderRadius="5px"
                      pl="10px"
                      pr="10px"
                      minW="36px"
                      h="36px"
                      ml="auto"
                      fontSize="lg"
                      onClick={() =>
                        setOpenViewAsset(
                          displayContent ? displayContent : selectedFile
                        )
                      }
                    >
                      <Icon
                        transition="0.2s linear"
                        w="20px"
                        h="20px"
                        mr="5px"
                        as={MdPreview}
                        color={tracColor}
                      />
                      Preview
                    </Button>
                  )}
                </Flex>
              </Card>
            </Flex>
            <Card h="1080px" boxShadow="md">
              {format === "Raw JSON" && (
                <RawJSON
                  displayContent={setDisplayContent}
                  form_error={setFormError}
                />
              )}
              {format === "File Upload" && (
                <FileUpload
                  selectedFile={setSelectedFile}
                  form_error={setFormError}
                />
              )}
              {type === "Organization" && (
                <OrganizationForm
                  displayContent={setDisplayContent}
                  form_error={setFormError}
                />
              )}
              {type === "Product" && (
                <ProductForm
                  displayContent={setDisplayContent}
                  form_error={setFormError}
                />
              )}
              {type === "Person" && (
                <PersonForm
                  displayContent={setDisplayContent}
                  form_error={setFormError}
                />
              )}
              {type === "Event" && (
                <EventForm
                  displayContent={setDisplayContent}
                  form_error={setFormError}
                />
              )}
            </Card>
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
        >
          <Card
            px="0px"
            mb="20px"
            minH="600px"
            maxH="1200px"
            overflow="auto"
            boxShadow="md"
          >
            {pending_assets ? (
              <PendingAssets
                pending_assets={pending_assets}
                paranet={setParanet}
              />
            ) : (
              <Loading />
            )}
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
