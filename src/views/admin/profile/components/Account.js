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
  Stack,
  Spinner,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { MdArrowCircleLeft } from "react-icons/md";
import { AccountContext } from "../../../../AccountContext";
import * as nsfwjs from "nsfwjs";
import { MdEdit } from "react-icons/md";

export default function Banner(props) {
  const {
    banner,
    avatar,
    name,
    job,
    posts,
    followers,
    following,
    delegations,
  } = props;
  const [publisher_info, setPublisherInfo] = useState(null);
  const { edit_profile, setEditProfile } = useContext(AccountContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [badImage, setBadImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user_info, setUserInfo] = useState(false);
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

  function formatNumberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    async function fetchData() {
      setPublisherInfo(null);
      try {
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          { account: localStorage.getItem("account") },
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            },
          }
        );

        setUserInfo(response.data.result[0]);

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/publishers/stats`,
          {
            network: network,
            publisher: localStorage.getItem("account"),
            frequency: "latest",
          },
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            },
          }
        );

        setPublisherInfo(response.data.result[0].data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [edit_profile, network]);

  if (delegations) {
    for (const chain of delegations) {
      for (const delegation of chain.data) {
        total_delegation_rewards =
          total_delegation_rewards + delegation.delegatorCurrentEarnings;
      }
    }
  }

  const editProfile = async () => {
    setLoading(true);
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
      setLoading(false);
      setEditProfile(false);
      setBadImage(null);
      setUploadedImage(null);
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
            const isNSFW = predictions.some(
              (predictions) =>
                (predictions.className === "Porn" &&
                  predictions.probability > 0.7) ||
                (predictions.className === "Hentai" &&
                  predictions.probability > 0.7)
            );

            if (isNSFW) {
              setUploadedImage(false);
              setBadImage(true);
            } else {
              setBadImage(false);
              setUploadedImage(file);
            }
          } catch (error) {
            console.error(
              "Error loading NSFWJS model or classifying image:",
              error
            );
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  if (edit_profile) {
    return (
      <Card
        mb={{ base: "0px", lg: "20px" }}
        align="center"
        h="400px"
        boxShadow="md"
      >
        <Flex justifyContent="flex-end">
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
            {badImage && (
              <Text color={tracColor} fontSize="sm" fontWeight="bold" mr="auto">
                This image is not allowed.
              </Text>
            )}
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
          {loading ? (
            <Flex justifyContent="center">
              <Stack>
                <Spinner
                  thickness="2px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color={tracColor}
                  size="md"
                  ml="auto"
                  mr="auto"
                />
                <Text fontSize="md" color={tracColor} >Saving...</Text>
              </Stack>
            </Flex>
          ) : (
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
          )}
        </Flex>
      </Card>
    );
  }

  return (
    user_info &&
    !edit_profile && (
      <Card
        mb={{ base: "0px", lg: "20px" }}
        align="center"
        h="400px"
        boxShadow="md"
      >
        <Box
          bg={`url(${banner})`}
          bgSize="cover"
          borderRadius="16px"
          h="131px"
          w="100%"
        />
        <Avatar
          mx="auto"
          boxShadow="md"
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
        <Text
          color={textColorPrimary}
          fontSize="xl"
          fontWeight="bold"
          mt="10px"
        >
          {user_info.alias}
          <Icon
            as={MdEdit}
            color={tracColor}
            w="18px"
            h="18px"
            onClick={() => setEditProfile(true)}
            ml="10px"
            _hover={{ cursor: "pointer" }}
          />
        </Text>
        <Text color={textColorSecondary} fontSize="sm">
          {user_info.twitter}
        </Text>
        <Card w="100%" mt="36px" boxShadow="md" justifyContent="space-between">
          <Flex justifyContent="space-between" w="80%" ml="10%">
            <Stack>
              <Text color={textColorPrimary} fontSize="20px" fontWeight="bold">
                {publisher_info && publisher_info.assetsPublished ? (
                  publisher_info.assetsPublished
                ) : (
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={tracColor}
                    size="md"
                  />
                )}
              </Text>
              <Text color={textColorSecondary} fontSize="md" fontWeight="500">
                Assets Published
              </Text>
            </Stack>
            <Stack>
              <Text color={textColorPrimary} fontSize="20px" fontWeight="bold">
                {publisher_info && publisher_info.totalTracSpent ? (
                  publisher_info.totalTracSpent.toFixed(2)
                ) : (
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={tracColor}
                    size="md"
                    label="Loading"
                  />
                )}
              </Text>
              <Text color={textColorSecondary} fontSize="md" fontWeight="500">
                Trac Spent
              </Text>
            </Stack>
            <Stack>
              <Text color={textColorPrimary} fontSize="20px" fontWeight="bold">
                {total_delegation_rewards !== "" ? (
                  formatNumberWithSpaces(total_delegation_rewards.toFixed(2))
                ) : (
                  <Spinner
                    thickness="2px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color={tracColor}
                    size="md"
                    label="Loading"
                  />
                )}
              </Text>
              <Text color={textColorSecondary} fontSize="md" fontWeight="500">
                Trac Rewards
              </Text>
            </Stack>
          </Flex>
        </Card>
        <Flex w="100%" justifyContent="flex-end" pt="16px"></Flex>
      </Card>
    )
  );
}
