// Chakra imports
import {
  Box,
  Text,
  useColorModeValue,
  Button,
  Icon,
  Flex,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import {
  MdNotificationsNone,
  MdInfoOutline,
  MdArrowUpward,
  MdAnalytics,
} from "react-icons/md";
import { AccountContext } from "../../../../AccountContext";
import { IoMdEye } from "react-icons/io";
import axios from "axios";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function DelegateInformation(props) {
  const {
    title,
    value,
    chain_id,
    node_id,
    tokenName,
    shares,
    delegatorStakeValueCurrent,
    delegatorStakeValueFuture,
    delegatorCurrentEarnings,
    delegatorFutureEarnings,
    nodeSharesTotalSupply,
    ...rest
  } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const bg = useColorModeValue("white", "navy.700");
  const { open_delegator_settings, setOpenDelegatorSettings } =
    useContext(AccountContext);
  const { open_delegator_stats, setOpenDelegatorStats } =
    useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");
  const [node_profile, setNodeProfile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let data = {
          node_id: node_id,
          chain_id: chain_id,
        };

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/profile`,
          data,
          config
        );

        setNodeProfile(response.data.result[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

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
            {node_profile && node_profile.node_logo ? (
              <img
                width="40px"
                src={`${process.env.REACT_APP_API_HOST}/images?src=${node_profile.node_logo}`}
              />
            ) : chain_id === 2043 || chain_id === 20430 ? (
              <img
                width="40px"
                src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
              />
            ) : chain_id === 100 || chain_id === 10200 ? (
              <img
                width="40px"
                src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
              />
            ) : chain_id === 8453 || chain_id === 84532 ? (
              <img
                width="40px"
                src={`${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`}
              />
            ) : (
              ""
            )}
          </Flex>
          <Flex width="30%" textAlign="left">
            <Text
              fontWeight="bold"
              color={tracColor}
              fontSize={{ sm: "sm", lg: "24px" }}
            >
              {tokenName}
            </Text>
          </Flex>
          <Flex width="30%" textAlign="left">
            <Text
              color={textColorPrimary}
              fontWeight="500"
              fontSize={{ sm: "sm", lg: "24px" }}
            >
              {`${formatNumberWithSpaces(Number(shares).toFixed(0))}`}
            </Text>
            <Text
              color={textColorPrimary}
              fontWeight="500"
              fontSize="sm"
              mb="auto"
              mt="auto"
            >
              shares
            </Text>
          </Flex>
          <Flex width="20%" textAlign="left" justifyContent="flex-start">
            <Text
              fontWeight="500"
              fontSize={{ sm: "sm", lg: "18px" }}
              display={{ sm: "none", lg: "block" }}
              color="green.500"
            >
              <Icon as={MdArrowUpward} color="green.500" w="15px" h="15px" />
              {`${delegatorCurrentEarnings.toFixed(1)} Trac`}
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
          onClick={() => setOpenDelegatorStats([tokenName, node_id, chain_id])}
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
            setOpenDelegatorSettings([tokenName, node_id, chain_id])
          }
        >
          <Icon as={MdNotificationsNone} color={"#ffffff"} w="18px" h="18px" />
        </Button>
      </Box>
    </Card>
  );
}
