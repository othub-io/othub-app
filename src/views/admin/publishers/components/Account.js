import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Stack,
  Icon
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { MdArrowCircleLeft } from "react-icons/md";
import { AccountContext } from "../../../../AccountContext";
import * as nsfwjs from "nsfwjs";
import { MdFlag } from "react-icons/md";

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Account(props) {
  const {
    banner,
    avatar,
    name,
    job,
    posts,
    followers,
    following,
    delegations,
    publisher,
  } = props;
  const [publisher_info, setPublisherInfo] = useState(null);
  const { edit_profile, setEditProfile } = useContext(AccountContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [badImage, setBadImage] = useState(false);
  const { saved, setSaved } = useContext(AccountContext);
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { account, setAccount } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  const tracColor = useColorModeValue("brand.900", "white");
  let total_assets_published = 0;
  let total_avgAssetCost = 0;
  let total_delegation_rewards = 0;

  return (
    <Card
      mb={{ base: "0px", "2xl": "10px" }} 
      align="center"
      w="100%"
      boxShadow="md"
    >
      {/* <Icon
      as={MdFlag}
      color="red"
      w="20px"
      h="20px"
      //onClick={() => setEditProfile(true)}
      ml="auto"
      _hover={{ cursor: "pointer" }}
      mt="-10px"
      mb="10px"
    /> */}
      <Box
        bg={`url(${banner})`}
        bgSize="cover"
        borderRadius="16px"
        h="111px"
        w="100%"
      />
      <Avatar
        boxShadow="md"
        mx="auto"
        src={
          publisher.img ? (
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
        w="87px"
        h="87px"
        border="4px solid"
        borderColor={borderColor}
        mt="-43px"
      />
      <Text color={textColorPrimary} fontSize="xl" fontWeight="bold">
        {publisher.alias
          ? publisher.alias
          : `${publisher.publisher.slice(0, 10)}...${publisher.publisher.slice(
              -10
            )}`}
      </Text>
      <Text color={textColorSecondary} fontSize="sm">
        {publisher.twitter}
      </Text>
      <Card w="100%" mt="36px" boxShadow="md" justifyContent="space-between">
        <Flex justifyContent="space-between" w="80%" ml="10%">
          <Stack>
            <Text color={tracColor} fontSize="20px" fontWeight="bold">
              {formatNumberWithSpaces(publisher.assetsPublished)}
            </Text>
            <Text color={textColorSecondary} fontSize="md" fontWeight="500">
              Assets Published
            </Text>
          </Stack>
          <Stack>
            <Text color={tracColor} fontSize="20px" fontWeight="bold">
              {formatNumberWithSpaces((publisher.assetsPublished * publisher.avgAssetCost).toFixed(2))}
            </Text>
            <Text color={textColorSecondary} fontSize="md" fontWeight="500">
              Trac Spent
            </Text>
          </Stack>
        </Flex>
      </Card>
    </Card>
  );
}
