// Chakra imports
import {
  Box,
  Text,
  useColorModeValue,
  Button,
  Icon,
  Flex,
  Avatar
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import { AccountContext } from "../../../../AccountContext";
import { MdNotificationsNone, MdArrowUpward } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import axios from "axios";
import NodePage from "views/admin/nodes/components/NodePage";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function NodeInformation(props) {
  const {
    title,
    value,
    blockchain,
    chain_id,
    node_id,
    tokenName,
    shares,
    delegatorStakeValueCurrent,
    delegatorStakeValueFuture,
    delegatorCurrentEarnings,
    cumulativeOperatorRewards,
    nodeSharesTotalSupply,
    node_profiles,
    ...rest
  } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const bg = useColorModeValue("white", "navy.700");
  const { open_edit_node, setOpenEditNode } = useContext(AccountContext);
  const { open_node_stats, setOpenNodeStats } = useContext(AccountContext);
  const { open_node_page, setOpenNodePage } = useContext(AccountContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  const tracColor = useColorModeValue("brand.900", "white");

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }

  //   fetchData();
  // }, [node_id, chain_id]);

  const checkProfile = (node_id, chain_id) => {
    if (!node_profiles) return null;

    const foundObject = node_profiles.find(
      (obj) => obj.node_id === node_id && obj.chain_id === chain_id
    );

    return foundObject ? foundObject : null;
  };

  const nodeProfile = checkProfile(node_id, chain_id);

  return (
    <Card bg={bg} {...rest} boxShadow="md">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
      >
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          <Flex textAlign="center">
          <Avatar
              boxShadow="md"
              backgroundColor="#FFFFFF"
              src={
                nodeProfile && nodeProfile.node_logo ? (
                  `${process.env.REACT_APP_API_HOST}/images?src=${nodeProfile.node_logo}`
                ) : chain_id === 2043 || chain_id === 20430 ? (
                  `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
                ) : chain_id === 100 || chain_id === 10200 ? (
                  `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
                ) : chain_id === 8453 || chain_id === 84532 ? (
                  `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`
                ) : (
                  ""
                )
              }
              w="40px"
              h="40px"
            />
          </Flex>
           <Flex width="30%" textAlign="left">
            <Text fontWeight="bold" color={tracColor} fontSize={{sm: "sm", lg: "24px"}}>
              {tokenName}
            </Text>
          </Flex>
          
          <Flex width="30%"  textAlign="left">
            <Text color={textColorPrimary} fontWeight="500" fontSize={{sm: "sm", lg: "24px"}}>
              {`${formatNumberWithSpaces(Number(nodeSharesTotalSupply).toFixed(0))}`}
            </Text>
            <Text color={textColorPrimary}  fontWeight="500" fontSize="sm" mb="auto" mt="auto">
              supply
            </Text>
          </Flex>
          
          <Flex width="20%"  textAlign="left">
            <Text fontWeight="500" fontSize={{sm: "sm", lg: "lg"}} display={{sm: "none", lg: "block"}} color="green.500">
              <Icon as={MdArrowUpward} color="green.500" w="15px" h="15px" />
              {`${cumulativeOperatorRewards.toFixed(1)}`}
              <Text color="green.500" fontWeight="500" fontSize="sm" mb="auto" mt="auto">
              Operator fees
            </Text>
            </Text>
          </Flex>
        </Flex>
        <Button
          variant="darkBrand"
          color="white"
          fontSize="sm"
          fontWeight="500"
          borderRadius="70px"
          px="5px"
          py="5px"
          onClick={() => setOpenNodePage([node_id, chain_id])}
          mr="5px"
        >
          <Icon as={IoMdEye} color={"#ffffff"} w="18px" h="18px" />
        </Button>
        <Button
          variant="darkBrand"
          color="white"
          fontSize="sm"
          fontWeight="500"
          borderRadius="70px"
          px="5px"
          py="5px"
          onClick={() =>
            setOpenEditNode([tokenName, node_id, chain_id, nodeProfile])
          }
        >
          <Icon as={MdEdit} color={"#ffffff"} w="18px" h="18px" />
        </Button>
      </Box>
    </Card>
  );
}
