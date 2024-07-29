// Chakra imports
import {
  SimpleGrid,
  Text,
  useColorModeValue,
  Button,
  Flex,
  Icon,
  Menu,
  Input,
  Box,
  Switch,
  Textarea,
  Avatar
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import SwitchField from "components/fields/SwitchField";
import DelegateInformation from "views/admin/profile/components/Delegate_Information";
import NodeInformation from "views/admin/profile/components/Node_Information";
import axios from "axios";
import { AccountContext } from "../../../../AccountContext";
import ToggleButtons from "views/admin/profile/components/ToggleButtons";
import Loading from "components/effects/Loading";
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
import * as nsfwjs from "nsfwjs";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

// Assets
export default function Delegations(props) {
  const { node_id, chain_id, node_profiles, ...rest } = props;
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [badImage, setBadImage] = useState(false);
  const [error, setError] = useState(null);
  const {
    token,
    setToken,
    account,
    setAccount,
    connected_blockchain,
    setConnectedBlockchain,
  } = useContext(AccountContext);
  const { open_edit_node, setOpenEditNode } = useContext(AccountContext);
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const tracColor = useColorModeValue("brand.900", "white");

  useEffect(() => {
    async function fetchData() {
      try {
        // let data = {
        //   node_id: open_edit_node[1],
        //   chain_id: open_edit_node[2],
        // };
        // let response = await axios.post(
        //   `${process.env.REACT_APP_API_HOST}/nodes/profile`,
        //   data,
        //   config
        // );
        // if (response.data.result[0]) {
        //   setNodeProfile(response.data.result[0]);
        // }
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [open_edit_node]);

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

  const saveInput = async () => {
    const bioElement = document.getElementById("bio");
    const bio = bioElement ? bioElement.value : open_edit_node[3]?.bio || "";

    const formData = new FormData();
    formData.append("bio", bio);
    if (uploadedImage) {
      formData.append("image", uploadedImage);
    }
    formData.append("node_id", JSON.stringify(open_edit_node[1]));
    formData.append("chain_id", JSON.stringify(open_edit_node[2]));

    try {
      await axios.post(
        `${process.env.REACT_APP_API_HOST}/nodes/edit`,
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
      setOpenEditNode(false);
    } catch (error) {
      console.error("Error editing profile:", error);
    }
  };

  return (
    <Card
      mb={{ base: "0px", "2xl": "10px" }}
      {...rest}
      h="820px"
      overflow="auto"
      boxShadow="md"
    >
      <Flex w="100%" justifyContent="space-between" mb="20px">
        <Avatar
          boxShadow="md"
          backgroundColor="#FFFFFF"
          src={
            open_edit_node[3] && open_edit_node[3].node_logo
              ? `${process.env.REACT_APP_API_HOST}/images?src=${open_edit_node[3].node_logo}`
              : open_edit_node[2] === 2043 || open_edit_node[2] === 20430
              ? `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
              : open_edit_node[2] === 100 || open_edit_node[2] === 10200
              ? `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
              : ""
          }
          w="50px"
          h="50px"
        />
        <Flex>
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mt="5px"
            mb="4px"
          >
            {open_edit_node[0]} Node Settings
          </Text>
        </Flex>
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
          onClick={() => setOpenEditNode(false)}
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
      <Flex w="100%" direction="column" h="300px">
        <Flex w="100%" mt="40px">
          <Flex w="100%" direction="column">
            <Flex w="100%" ml="5%">
              <Text
                color={textColorPrimary}
                fontWeight="bold"
                fontSize={{ sm: "md", lg: "2xl" }}
              >
                Node Logo
              </Text>
            </Flex>
            <Flex>
              <Text fontSize={{ sm: "sm", lg: "lg" }} ml="5%">
                Upload a custom image that OTHub visitors will see when
                interacting with your node.
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex h="250px" mt="30px">
          <Input
            type="file"
            accept=".jpg, .jpeg"
            onChange={handleFileUpload}
            mb="10px"
            w="40%"
            ml="5%"
          />
          <Flex w="250px" ml="auto" mr="auto">
            {uploadedImage && (
              <img src={URL.createObjectURL(uploadedImage)} alt="Node Logo" />
            )}
            {badImage && (
              <Text color={tracColor} fontSize="sm" fontWeight="bold" mr="auto">
                This image is not allowed.
              </Text>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Flex w="90%" mt="40px" ml="5%">
        <Flex w="100%" direction="column">
          <Flex w="100%">
            <Text
              color={textColorPrimary}
              fontWeight="bold"
              fontSize={{ sm: "md", lg: "2xl" }}
            >
              Node Bio
            </Text>
          </Flex>
          <Flex>
            <Text fontSize={{ sm: "sm", lg: "lg" }}>
              Upload additional information about your node that will display
              when visitors and delegators view your node.
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex mt="30px">
        <Textarea
          h="150px"
          focusBorderColor={tracColor}
          id="bio"
          placeholder={
            open_edit_node[3] && open_edit_node[3].bio
              ? open_edit_node[3].bio
              : "Node Bio"
          }
          w="90%"
          ml="5%"
          resize="none"
          maxLength={250}
        ></Textarea>
      </Flex>
      <Flex mt="40px" justifyContent="center">
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
            saveInput();
          }}
        >
          Save
        </Button>
      </Flex>
    </Card>
  );
}
