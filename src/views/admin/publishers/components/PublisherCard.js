// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, { useState, useEffect, useContext } from "react";
import {
  IoThumbsDown,
  IoThumbsDownOutline,
  IoThumbsUp,
  IoThumbsUpOutline,
  IoCopyOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import AssetImage from "../../../../../src/assets/img/Knowledge-Asset.jpg";
import { AccountContext } from "../../../../AccountContext";
import axios from "axios";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function NFT(props) {
  const { publisher } = props;
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [asset_page, openAssetPage] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.500", "white");
  const { open_publisher_page, setOpenPublisherPage } =
    useContext(AccountContext);
  const [downloading, setDownloading] = useState(false);
  const { network, setNetwork } = useContext(AccountContext);
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    async function fetchData() {
      try {
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    }
    fetchData();
  }, []);

  // const closeNodePage = () => {
  //   window.history.replaceState(
  //     {},
  //     document.title,
  //     window.location.origin + window.location.pathname
  //   );
  //   setOpenNodePage(false);
  // };

  return (
    <Card p={4} boxShadow="md" pt="20px">
      <Flex direction={{ base: "column" }} justify="center">
        <Box
          mb={{ base: "20px", "2xl": "20px" }}
          position="relative"
          mt="-20px"
          w="100%"
        >
          <Flex
            justify="center"
            align="center"
            h="150px"
            mt="0px"
            mb="-20px"
            style={{ borderRadius: "20px" }}
          >
            <Avatar
              src={
                publisher && publisher.img ? (
                  `${process.env.REACT_APP_API_HOST}/images?src=${publisher.img}`
                ) : (
                  <svg
                    viewBox="0 0 128 128"
                    class="chakra-avatar__svg css-16ite8i"
                    role="img"
                    aria-label=" avatar"
                  >
                    <path
                      fill="currentColor"
                      d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.77 24.9156,101.7756 C31.574,88.622 45.9358,79 64.158,79 C82.3796,79 96.7418,88.622 103,102.1388 L103,102.1388 Z M64,10 C80.5685,10 94,23.4315 94,40 C94,56.5685 80.5685,70 64,70 C47.4315,70 34,56.5685 34,40 C34,23.4315 47.4315,10 64,10 Z"
                    ></path>
                  </svg>
                )
              }
              w="120px"
              h="120px"
              me="8px"
              boxShadow="md"
            />
          </Flex>
        </Box>
        <Flex flexDirection="column" h="100%">
          <Text
            color="#11047A"
            fontSize={{
              base: "xl",
              md: "lg",
              lg: "lg",
              xl: "lg",
              "2xl": "md",
              "3xl": "lg",
            }}
            mb="5px"
            fontWeight="bold"
            me="14px"
            textAlign="center"
          >
            {publisher && publisher.alias
              ? publisher.alias
              : publisher.publisher.slice(0, 15)}
          </Text>
          <Flex
            justify="space-between"
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mb="auto"
            borderTop="1px solid #11047A"
          >
              <Flex justifyContent="space-between" w="100%" mt="10px" ml="10px">
                <Stack>
                  <Flex>
                  <Avatar src={AssetImage} w="30px" h="30px" me="8px"/>
                    <Text
                      color={textColorPrimary}
                      fontSize="20px"
                      fontWeight="bold"
                      mb="-10px"
                      w="100%"
                    >
                      {formatNumberWithSpaces(publisher.assetsPublished.toFixed(0))}
                    </Text>
                  </Flex>
                  <Flex>
                  <Avatar src={`${process.env.REACT_APP_API_HOST}/images?src=origintrail_logo_alt-dark_purple.svg`} w="30px" h="30px" me="8px"/>
                    <Text
                      color={textColorPrimary}
                      fontSize="20px"
                      fontWeight="bold"
                      mb="-10px"
                    >
                      {formatNumberWithSpaces(publisher.totalTracSpent
                          .toFixed(2))}
                    </Text>
                  </Flex>
                </Stack>
              </Flex>
          </Flex>
          <Flex
            align="start"
            justify="flex-end"
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mt="25px"
          >
            <Button
              variant="darkBrand"
              color="white"
              fontSize="sm"
              fontWeight="500"
              borderRadius="70px"
              px="24px"
              py="5px"
              onClick={() => setOpenPublisherPage(publisher)}
              boxShadow="md"
            >
              Explore
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
