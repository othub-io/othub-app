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

export default function Banner(props) {
  const { banner, avatar, name, job, posts, followers, following } = props;
  const account = localStorage.getItem("account");
  const [user_info, setUserInfo] = useState(null);
  const [asset_info, setAssetInfo] = useState(null);
  const [edit_profile, setEditProfile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          {},
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setUserInfo(response.data.result[0]);

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/info`,
          {network: network, owner: localStorage.getItem("account")},
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            },
          }
        );

        console.log('asasasas '+response.data.result)
        setAssetInfo(response.data.result[0].data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account, edit_profile]);

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
      setUploadedImage(null);
      setEditProfile(false);
    } catch (error) {
      console.error("Error editing profile:", error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  if (edit_profile) {
    return (
      <Card mb={{ base: "0px", lg: "20px" }} align="center" h="400px">
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
            onClick={editProfile}
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
                  d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"
                ></path>
                <path
                  fill="currentColor"
                  d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"
                ></path>
              </svg>
            )
          }
          h="87px"
          w="87px"
          mt="-43px"
          border="4px solid"
          borderColor={borderColor}
        />
        <Text
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="xl"
          mt="10px"
        >
          {user_info && user_info.alias !== "null"
            ? user_info.alias
            : `${account.slice(0, 10)}...${account.slice(-10)}`}
        </Text>
        <Text color={textColorSecondary} fontSize="sm">
          {user_info && user_info.twitter !== "null" ? user_info.twitter : ``}
        </Text>
        <Flex w="max-content" mx="auto" mt="26px">
          <Flex mx="auto" me="60px" align="center" direction="column">
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              { 0}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
              Assets
            </Text>
          </Flex>
          <Flex mx="auto" me="60px" align="center" direction="column">
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              {followers}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
              Likes
            </Text>
          </Flex>
          <Flex mx="auto" align="center" direction="column">
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              {following}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
              Rewards
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
