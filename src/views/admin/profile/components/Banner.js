import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Button,
  Icon,
  Input,
  Textarea,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { MdArrowCircleLeft } from "react-icons/md";
import { AccountContext } from "../../../../AccountContext";
import * as nsfwjs from 'nsfwjs';

export default function Banner(props) {
  const { banner, avatar, name, job, posts, followers, following, delegations, user_info } = props;
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
  const borderColor = useColorModeValue("white !important", "#111C44 !important");
  const tracColor = useColorModeValue("brand.900", "white");
  let total_assets_published = 0
  let total_avgAssetCost = 0
  let total_delegation_rewards = 0

  useEffect(() => {
    async function fetchData() {
      setPublisherInfo(null)
      if (!network || !account) {
        console.log("Network or account is not set yet");
        return;
      }

      try {

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/publishers/stats`,
          { network: network, publisher: account, frequency: "latest" },
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            },
          }
        );

        setPublisherInfo(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [user_info, edit_profile, network]);

  if (publisher_info) {
    for (const pub_record of publisher_info) {
      total_assets_published = total_assets_published + pub_record.assetsPublished
      total_avgAssetCost = total_avgAssetCost + pub_record.avgAssetCost
    }

    total_avgAssetCost = total_avgAssetCost / publisher_info.length
  }

  if (delegations) {
    for (const chain of delegations) {
      for (const delegation of chain.data) {
        total_delegation_rewards = total_delegation_rewards + delegation.currentEarnings
      }
    }
  }

  const editProfile = async () => {
    const alias = document.getElementById("alias").value || user_info.alias;
    const twitter =
      document.getElementById("twitter").value || user_info.twitter;
    const bio = document.getElementById("bio").value || user_info.bio;

    const formData = new FormData();
    formData.append("alias", alias);
    formData.append("twitter", twitter);
    formData.append("bio", bio);
    if (uploadedImage) {
      formData.append("image", uploadedImage);
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_HOST}/user/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setBadImage(null);
      setUploadedImage(null);
      setEditProfile(false);
    } catch (error) {
      console.error("Error editing profile:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = async () => {
          try {
            const model = await nsfwjs.load();
            const predictions = await model.classify(img);
            const isNSFW = predictions.some(predictions =>
              (predictions.className === 'Porn' && predictions.probability > 0.7) || (predictions.className === 'Hentai' && predictions.probability > 0.7)
            );

            if (isNSFW) {
              setUploadedImage(false);
              setBadImage(true);
            } else {
              setBadImage(false);
              setUploadedImage(file);
            }
          } catch (error) {
            console.error("Error loading NSFWJS model or classifying image:", error);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  if (edit_profile) {
    return (
      <Card mb={{ base: "0px", lg: "20px" }} align="center" h="400px" boxShadow="md">
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
              setEditProfile(null);
              setUploadedImage(null);
              setBadImage(null);
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
        <Flex w="100%" justifyContent="flex-start">
          <Flex flexDirection="column" alignItems="center" w="50%">
            <Text color={tracColor} fontSize="sm" fontWeight="bold" mr="auto">
              Alias
            </Text>
            <Input
              h="30px"
              focusBorderColor={tracColor}
              id="alias"
              placeholder={
                user_info && user_info.alias !== "null"
                  ? user_info.alias
                  : "Alias"
              }
              w="95%"
            />
          </Flex>
          <Flex flexDirection="column" alignItems="center" w="50%">
            <Text
              color={tracColor}
              fontSize="sm"
              fontWeight="bold"
              w="80px"
              mr="auto"
            >
              X Handle
            </Text>
            <Input
              h="30px"
              focusBorderColor={tracColor}
              id="twitter"
              placeholder={
                user_info && user_info.twitter !== "null"
                  ? user_info.twitter
                  : "@X Handle"
              }
              w="93%"
              ml="10%"
            />
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="flex-start" mt="20px">
          <Input
            type="file"
            accept=".jpg, .jpeg"
            onChange={handleFileUpload}
            mb="10px"
            w="300px"
            border="none"
          />
          <Flex h="87px" w="87px" borderRadius="10px">
            {uploadedImage && (
              <img src={URL.createObjectURL(uploadedImage)} alt="Profile" />
            )}
            {badImage && <Text color={tracColor} fontSize="sm" fontWeight="bold" mr="auto">
              This image is not allowed.
            </Text>}
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="flex-start">
          <Flex w="100%" flexDirection="column">
            <Text color={tracColor} fontSize="sm" fontWeight="bold" mr="auto">
              Bio
            </Text>
            <Textarea
              h="80px"
              focusBorderColor={tracColor}
              id="bio"
              placeholder={
                user_info && user_info.bio !== "null" ? user_info.bio : "Bio"
              }
              w="100%"
              resize="none"
            />
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="center" pt="16px">
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={() => {
              editProfile();
              setSaved(true);
            }}
          >
            Save
          </Button>
        </Flex>
      </Card>
    );
  }

  return (
    user_info &&
    !edit_profile && (
      <Card mb={{ base: "0px", lg: "20px" }} align="center" h="400px">
        <Box
          bg={`url(${banner})`}
          bgSize="cover"
          borderRadius="16px"
          h="131px"
          w="100%"
        />
        <Avatar
          mx="auto"
          src={
            user_info.img ? (
              `${process.env.REACT_APP_API_HOST}/images?src=${user_info.img}`
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
        <Text color={textColorPrimary} fontSize="xl" fontWeight="bold" mt="10px">
        {user_info.alias ? user_info.alias : `${user_info.account.slice(0, 10)}...${user_info.account.slice(-10)}`}
        </Text>
        <Text color={textColorSecondary} fontSize="sm">
        {user_info.twitter}
        </Text>
        <Flex w="100%" mt="36px">
          <Flex
            flexDirection="column"
            align="center"
            justify="center"
            w="100%"
            py="15px"
            mx="8px"
            borderRadius="20px"
            border="1px solid"
            borderColor={borderColor}
          >
            {<Text color={textColorPrimary} fontSize="xl" fontWeight="bold">
              {total_assets_published ? total_assets_published : "Loading..."}
            </Text>}
            <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
              Assets Published
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            align="center"
            justify="center"
            w="100%"
            py="15px"
            mx="8px"
            borderRadius="20px"
            border="1px solid"
            borderColor={borderColor}
          >
            <Text color={textColorPrimary} fontSize="xl" fontWeight="bold">
             {total_avgAssetCost && total_assets_published ? (total_avgAssetCost * total_assets_published).toFixed(2) : "Loading..."}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
              Trac Spent
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            align="center"
            justify="center"
            w="100%"
            py="15px"
            mx="8px"
            borderRadius="20px"
            border="1px solid"
            borderColor={borderColor}
          >
            <Text color={textColorPrimary} fontSize="xl" fontWeight="bold">
              {total_delegation_rewards !== "" ? (total_delegation_rewards).toFixed(2) : "Loading..."}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
              Trac Rewards
            </Text>
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="flex-end" pt="16px">
          <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="24px"
            py="5px"
            onClick={() => setEditProfile(true)}
          >
            Edit Profile
          </Button>
        </Flex>
      </Card>
    )
  );
}
