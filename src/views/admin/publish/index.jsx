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
import axios from "axios";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};
const queryParameters = new URLSearchParams(window.location.search);
const url_ual = queryParameters.get("ual");

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Marketplace() {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const tracColor = useColorModeValue("brand.900", "white");
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const [ form_error, setFormError ] = useState(null);
  const [paranet, setParanet] = useState(null);
  const [format, setFormat] = useState(null);
  const [type, setType] = useState(null);
  const [pending_assets, setPendingAssets] = useState(null);
  const [displayContent, setDisplayContent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { open_view_asset, setOpenViewAsset } = useContext(AccountContext);
  const account = localStorage.getItem("account");

  useEffect(() => {
    async function fetchData() {
      try {
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
  }, [account, blockchain, network]);

  let explorer_url = "https://dkg.origintrail.io";

  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  if (open_view_asset) {
    return (
      <Preview data={open_view_asset} />  
    );
  }

  if (!account) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
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

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }} mt="-20px">
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
              <Card h="100px">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="100%"
                >
                  <Box>
                    <ParanetDrop
                      network={network}
                      paranet={setParanet}
                      display_content={setDisplayContent}
                      selected_file={setSelectedFile}
                    />
                    <FormatDrop
                      network={network}
                      paranet={paranet}
                      format={setFormat}
                      type={setType}
                      display_content={setDisplayContent}
                      selected_file={setSelectedFile}
                    />
                    {format === "Form" && (
                      <TypeDrop
                        network={network}
                        format={format}
                        type={setType}
                        display_content={setDisplayContent}
                        selected_file={setSelectedFile}
                      />
                    )}
                  </Box>
                  {!form_error && (displayContent || selectedFile) && (
                    <Button
                      bg="none"
                      border="solid"
                      borderColor={tracColor}
                      borderWidth="2px"
                      color={tracColor}
                      _hover={{ bg: "none" }}
                      _active={{ bg: "none" }}
                      _focus={{ bg: "none" }}
                      borderRadius="5px"
                      pl="10px"
                      pr="10px"
                      minW="36px"
                      h="36px"
                      ml="auto"
                      fontSize="lg"
                      onClick={() => setOpenViewAsset(displayContent)}
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
            <Card h="1080px">
              {format === "Raw JSON" && (
                <RawJSON displayContent={setDisplayContent} />
              )}
              {format === "File Upload" && (
                <FileUpload selectedFile={setSelectedFile} />
              )}
              {type === "Organization" && (
                <OrganizationForm displayContent={setDisplayContent} form_error={setFormError}/>
              )}
              {type === "Product" && (
                <ProductForm displayContent={setDisplayContent} form_error={setFormError}/>
              )}
              {type === "Person" && (
                <PersonForm displayContent={setDisplayContent} form_error={setFormError}/>
              )}
              {type === "Event" && (
                <EventForm displayContent={setDisplayContent} form_error={setFormError}/>
              )}
            </Card>
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
        >
          <Card px="0px" mb="20px" minH="600px" maxH="1200px" overflow="auto">
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
      {/* Delete Product */}
    </Box>
  );
}
