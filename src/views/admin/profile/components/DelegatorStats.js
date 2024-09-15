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
  Spinner,
  Stack,
  Avatar,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import SwitchField from "components/fields/SwitchField";
import DelegateInformation from "views/admin/profile/components/Delegate_Information";
import NodeInformation from "views/admin/profile/components/Node_Information";
import axios from "axios";
import { AccountContext } from "../../../../AccountContext";
import Rewards from "views/admin/profile/components/Rewards";
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

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Assets
export default function Delegations(props) {
  const { node_id, chain_id, ...rest } = props;
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const {
    token,
    setToken,
    account,
    setAccount,
    connected_blockchain,
    setConnectedBlockchain,
  } = useContext(AccountContext);
  const { open_delegator_stats, setOpenDelegatorStats } =
    useContext(AccountContext);
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const tracColor = useColorModeValue("brand.900", "white");
  const [daily_activity, setDailyActivity] = useState(null);
  const [latest_activity, setLatestActivity] = useState(null);
  const [node_data, setNodeData] = useState(null);
  const [inputValue, setInputValue] = useState({
    telegram_id: "",
    bot_token: "",
    daily_report: 0,
    total_shares: 0,
    operator_fee: 0,
    node_ask: 0,
    active_status: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        let request_data = {
          network: network,
          frequency: "daily",
          delegator: "0x22b750c56A1E6e20799d470A8949896DC3f55C45",
          node_id: JSON.stringify(open_delegator_stats[1]),
          chain_id: JSON.stringify(open_delegator_stats[2]),
        };
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/delegators/stats`,
          request_data,
          config
        );
        setDailyActivity(response.data.result);

        request_data = {
          network: network,
          frequency: "latest",
          delegator: "0x22b750c56A1E6e20799d470A8949896DC3f55C45",
          node_id: JSON.stringify(open_delegator_stats[1]),
          chain_id: JSON.stringify(open_delegator_stats[2]),
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/delegators/stats`,
          request_data,
          config
        );
        setLatestActivity(response.data.result[0].data[0]);

        let settings = {
          network: network,
          blockchain:
            open_delegator_stats[2] === 2043
              ? "NeuroWeb Mainnet"
              : open_delegator_stats[2] === 20430
              ? "NeuroWeb Testnet"
              : open_delegator_stats[2] === 100
              ? "Gnosis Mainnet"
              : open_delegator_stats[2] === 10200
              ? "Chiado Testnet"
              : open_delegator_stats[2] === 8453
              ? "Base Mainnet"
              : open_delegator_stats[2] === 84532
              ? "Base Testnet"
              : "",
          nodeId: open_delegator_stats[1],
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/info`,
          settings,
          config
        );

        setNodeData(response.data.result[0].data[0].APR30d);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [open_delegator_stats]);

  return daily_activity && latest_activity && node_data ? (
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
            open_delegator_stats[3] && open_delegator_stats[3].node_logo
              ? `${process.env.REACT_APP_API_HOST}/images?src=${open_delegator_stats[3].node_logo}`
              : open_delegator_stats[2] === 2043 ||
                open_delegator_stats[2] === 20430
              ? `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
              : open_delegator_stats[2] === 100 ||
                open_delegator_stats[2] === 10200
              ? `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
              : open_delegator_stats[2] === 8453 ||
                open_delegator_stats[2] === 84532
              ? `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`
              : ""
          }
          w="50px"
          h="50px"
        />
        <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl">
          {open_delegator_stats[0]} Delegation Statistics
        </Text>
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
            setOpenDelegatorStats(false);
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

      <Rewards
        monthly_delegations={daily_activity}
        latest_delegations={latest_activity}
        last_delegations={daily_activity}
      />

      <Card boxShadow="md" h="350px" w="100%" mt="auto" mb="20px">
        <Flex justifyContent="space-between" mt="auto" mb="auto">
          <Flex flex="1" justifyContent="center" alignItems="center">
            <Stack spacing={0} align="center">
              <Text
                fontSize="26px"
                color={textColorPrimary}
                fontWeight="bold"
              >{`${formatNumberWithSpaces(latest_activity.shares)}`}</Text>
              <Text fontSize="16px" color={textColorPrimary}>{`${(
                (latest_activity.shares /
                  latest_activity.nodeSharesTotalSupply) *
                100
              ).toFixed(0)}% of total supply`}</Text>
              <Text
                fontSize="md"
                fontWeight="500"
                color={textColorSecondary}
              >{`Shares`}</Text>
            </Stack>
          </Flex>
          <Flex flex="1" justifyContent="center" alignItems="center">
            <Stack spacing={0} align="center">
              <Text
                fontSize="26px"
                color={textColorPrimary}
                fontWeight="bold"
              >{`${latest_activity.shareValueCurrent.toFixed(3)}`}</Text>
              <Text
                fontSize="16px"
                color={textColorPrimary}
              >{`prospective value: ${latest_activity.shareValueFuture.toFixed(
                3
              )}`}</Text>
              <Text
                fontSize="md"
                fontWeight="500"
                color={textColorSecondary}
              >{`Share Value`}</Text>
            </Stack>
          </Flex>
          <Flex flex="1" justifyContent="center" alignItems="center">
            <Stack spacing={0} align="center">
              <Text
                fontSize="26px"
                color={textColorPrimary}
                fontWeight="bold"
              >{`${formatNumberWithSpaces(latest_activity.delegatorCurrentEarnings.toFixed(2))}`}</Text>
              <Text
                fontSize="16px"
                color={textColorPrimary}
              >{`prospective earnings: ${formatNumberWithSpaces(latest_activity.delegatorFutureEarnings.toFixed(
                2
              ))}`}</Text>
              <Text
                fontSize="md"
                fontWeight="500"
                color={textColorSecondary}
              >{`Earnings`}</Text>
            </Stack>
          </Flex>
        </Flex>

        <Flex justifyContent="space-between" mt="auto" mb="auto">
          <Flex flex="1" justifyContent="center" alignItems="center">
            <Stack spacing={2} align="center">
              <Text
                fontSize="26px"
                color={textColorPrimary}
                fontWeight="bold"
              >{`${(node_data * 100).toFixed(2)}%`}</Text>
              <Text
                fontSize="md"
                fontWeight="500"
                color={textColorSecondary}
              >{`30d APR`}</Text>
            </Stack>
          </Flex>
          <Flex flex="1" justifyContent="center" alignItems="center">
            <Stack spacing={2} align="center">
              <Text
                fontSize="26px"
                color={textColorPrimary}
                fontWeight="bold"
              >{`${latest_activity.nodeOperatorFee}%`}</Text>
              <Text
                fontSize="md"
                fontWeight="500"
                color={textColorSecondary}
              >{`Operator Fee`}</Text>
            </Stack>
          </Flex>
          <Flex flex="1" justifyContent="center" alignItems="center">
            <Stack spacing={2} align="center">
              <Text
                fontSize="26px"
                color={textColorPrimary}
                fontWeight="bold"
              >{`${latest_activity.nodeAsk}`}</Text>
              <Text
                fontSize="md"
                fontWeight="500"
                color={textColorSecondary}
              >{`Node Ask`}</Text>
            </Stack>
          </Flex>
        </Flex>
      </Card>
    </Card>
  ) : (
    <Card
      mb={{ base: "0px", "2xl": "10px" }}
      {...rest}
      h="820px"
      overflow="auto"
      boxShadow="md"
    >
      <Flex justifyContent="center" mt="auto" mb="auto" mr="auto" ml="auto">
        <Stack>
          <Spinner
            thickness="5px"
            speed="0.65s"
            emptyColor="gray.200"
            color={tracColor}
            size="xl"
            ml="auto"
            mr="auto"
          />
          <Text fontSize="lg" color={tracColor} fontWeight="bold">
            Loading...
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
}
