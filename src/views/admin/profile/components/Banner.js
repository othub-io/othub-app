// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Button,
  Icon,
  Input,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
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
} from "react-icons/md";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

export default function Banner(props) {
  const { banner, avatar, name, job, posts, followers, following } = props;
  const account = localStorage.getItem("account");
  const [user_info, setUserInfo] = useState(null);
  const [edit_profile, setEditProfile] = useState(false);
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  const tracColor = useColorModeValue("brand.900", "white");
  const [uploadedImage, setUploadedImage] = useState(null);
const [isNSFW, setIsNSFW] = useState(false);

  let settings;
  let response;

  useEffect(() => {
    async function fetchData() {
      try {
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          settings,
          config
        );

        setUserInfo(response.data.result[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account]);

  const editProfile = async () => {
    const alias = document.getElementById('alias').value;
    const twitter = document.getElementById('twitter').value;
    const bio = document.getElementById('bio').value;

    try {
      settings = {
        alias: alias,
        twitter: twitter,
        img: uploadedImage,
        bio: bio
      };
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/user/edit`,
        settings,
        config
      );
  
      setUserInfo(response.data.result[0]);
      setEditProfile(false);
    } catch (error) {
      console.error("Error classifying image:", error);
    }

    // try {
    //   const model = await nsfwjs.load("../../../../node_modules/nsfwjs/dist/models/mobilenet_v2");
    //   const imageElement = document.createElement("img");
    //   imageElement.src = uploadedImage;
  
    //   // Wait for the image to load
    //   await new Promise((resolve, reject) => {
    //     imageElement.onload = resolve;
    //     imageElement.onerror = reject;
    //   });
  
    //   const predictions = await model.classify(imageElement);
    //   console.log("Predictions: ", predictions);
  
    //   // Check if any prediction has a high NSFW probability
    //   const isNSFW = predictions.some(prediction => prediction.className === "Porn" && prediction.probability > 0.7);
  
    //   setIsNSFW(isNSFW);
  
    //   if (!isNSFW) {
    //     // Proceed with profile update
    //     // Your code to update the profile here
    //   }
    // } catch (error) {
    //   console.error("Error classifying image:", error);
    // }
  };
  
  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Read the uploaded file as a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
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
            onClick={() =>{
              setEditProfile(false)
              setUploadedImage(null)
            }
          }
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
        <Flex w="100%" justifyContent="flex-start" mt="10px">
          <Input
            h="30px"
            focusBorderColor={tracColor}
            id="alias"
            placeholder={user_info.alias ? user_info.alias : "Alias"}
            w="50%"
          ></Input>
          <Input
            h="30px"
            focusBorderColor={tracColor}
            id="twitter"
            placeholder={user_info.twitter ? user_info.twitter : "@X Handle"}
            w="45%"
            ml="5%"
          ></Input>
        </Flex>
        <Flex w="100%" justifyContent="flex-start" mt="20px">
          <Input
            type="file"
            accept=".jpg, .jpeg"
            onChange={handleFileUpload}
            mb="10px"
          />
          <Flex w="50px" h="50px">
          {uploadedImage && <img src={uploadedImage}
          ></img>}
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="flex-start" mt="20px">
          <Input
            h="150px"
            focusBorderColor={tracColor}
            id="bio"
            placeholder={user_info.bio ? user_info.bio : "Profile Bio"}
            w="100%"
          ></Input>
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
            onClick={() => editProfile("inputs sent here")}
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
          src={avatar}
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
          {user_info.alias ? user_info.alias : account.slice(0, 10)}...
          {account.slice(-10)}
        </Text>
        <Text color={textColorSecondary} fontSize="sm">
          {user_info.twitter}
        </Text>
        <Flex w="max-content" mx="auto" mt="26px">
          <Flex mx="auto" me="60px" align="center" direction="column">
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              {posts}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
              Posts
            </Text>
          </Flex>
          <Flex mx="auto" me="60px" align="center" direction="column">
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              {followers}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
              Followers
            </Text>
          </Flex>
          <Flex mx="auto" align="center" direction="column">
            <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
              {following}
            </Text>
            <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
              Following
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
