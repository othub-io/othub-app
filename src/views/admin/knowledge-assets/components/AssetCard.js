// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, { useState, useEffect, useContext } from "react";
import {
  IoHeart,
  IoHeartOutline,
  IoThumbsDown,
  IoThumbsDownOutline,
  IoThumbsUp,
  IoThumbsUpOutline,
} from "react-icons/io5";
import AssetPage from "views/admin/knowledge-assets/components/AssetPage";
import { AccountContext } from "../../../../AccountContext";

function scrollIframe() {
  const iframe = document.getElementById("myIframe");
  if (iframe) {
    const scrollAmount = 1000; // Change this value to adjust the scroll amount
    iframe.contentWindow.scrollTo(0, scrollAmount);
  }
}

export default function NFT(props) {
  const { img, name, author, bidders, download, likes, dislikes, chain_id, block_ts_hour, epochs_number, epoch_length_days, index, recent_assets, block_ts, chainName } =
    props;
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [asset_page, openAssetPage] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.500", "white");
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
  const [asset_data, setAssetData] = useState(null);

  useEffect(() => {
    // Function to scroll the iframe
    
    //setAssetData(recent_assets[index])
    // Call scrollIframe after component has mounted
    scrollIframe();
  }, []);

  // const closeNodePage = () => {
  //   window.history.replaceState(
  //     {},
  //     document.title,
  //     window.location.origin + window.location.pathname
  //   );
  //   setOpenNodePage(false);
  // };

  return (!open_asset_page &&
    <Card p="20px">
      <Flex direction={{ base: "column" }} justify="center">
        <Box display="flex" justifyContent="flex-end">
          {chain_id === 2043 || chain_id === 20430 ? (
            <img
              src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
              style={{ maxWidth: "25px", maxHeight: "25px" }}
            />
          ) : chain_id === 100 || chain_id === 10200 ? (
            <img
              src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
              style={{ maxWidth: "25px", maxHeight: "25px" }}
            />
          ) : (
            ""
          )}
        </Box>
        <Box
          mb={{ base: "20px", "2xl": "20px" }}
          position="relative"
          mt="-20px"
        >
          <Flex
            justify="center"
            align="center"
            h="150px"
            mt="0px"
            mb="-20px"
            style={{ borderRadius: "20px" }}
          >
            <img
              title="NFT Preview"
              src={img}
              width="120px"
              height="120px"
            ></img>
          </Flex>
        </Box>
        <Flex flexDirection="column" justify="space-between" h="100%">
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
          >
            <Flex direction="column">
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
              >
                Token {name}
              </Text>
              <Text
                color={textColor}
                fontSize={{
                  base: "sm",
                }}
                fontWeight="400"
                me="14px"
              >
                By {author.slice(0, 15)}...
              </Text>
              <Text
                color="secondaryGray.600"
                fontSize={{
                  base: "sm",
                }}
                fontWeight="400"
                me="14px"
              >
                At {block_ts}
              </Text>
            </Flex>
          </Flex>
          <Flex
            align="start"
            justify="space-between"
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mt="25px"
          >
            <Flex direction="column" ml="10px" mt="10px">
              <Flex align="center">
              <Icon
                    transition="0.2s linear"
                    w="20px"
                    h="20px"
                    as={like ? IoThumbsUp : IoThumbsUpOutline}
                    color="#11047A"
                  />
                <Text fontWeight="700" fontSize="sm" color="#11047A" mr="20px">
                  {likes}
                </Text>
                <Icon
                    transition="0.2s linear"
                    w="20px"
                    h="20px"
                    as={dislike ? IoThumbsDown : IoThumbsDownOutline}
                    color="#11047A"
                  />
                <Text fontWeight="700" fontSize="sm" color="#11047A">
                  {dislikes}
                </Text>
              </Flex>
            </Flex>
            <Button
                variant="darkBrand"
                color="white"
                fontSize="sm"
                fontWeight="500"
                borderRadius="70px"
                px="24px"
                py="5px"
                onClick={() => setOpenAssetPage(recent_assets[index])}
              >
                Details
              </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
