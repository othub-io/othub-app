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

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    Authorization: localStorage.getItem("token"),
  },
};

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
  const { open_delegator_settings, setOpenDelegatorSettings } =
    useContext(AccountContext);
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const tracColor = useColorModeValue("brand.900", "white");
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
        let data = {
          node_id: JSON.stringify(open_delegator_settings[1]),
          chain_id: JSON.stringify(open_delegator_settings[2]),
        };
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/notifications/telegram/info`,
          data,
          config
        );

        if (response.data.result[0]) {
          setInputValue(response.data.result[0]);
        }

        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [open_delegator_settings]);

  const updateInput = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle boolean values for switch fields
    const newChecked = checked === false ? 0 : 1;
    const newValue = type === "checkbox" ? newChecked : value;
    setInputValue((prevValue) => ({
      ...prevValue,
      [name]: newValue,
    }));
  };

  const saveInput = async () => {
    try {
      const request_data = {
        telegram_id: inputValue.telegram_id,
        bot_token: inputValue.bot_token,
        daily_report: inputValue.daily_report,
        total_shares: inputValue.total_shares,
        operator_fee: inputValue.operator_fee,
        node_ask: inputValue.node_ask,
        active_status: inputValue.active_status,
        node_id: JSON.stringify(open_delegator_settings[1]),
        chain_id: JSON.stringify(open_delegator_settings[2]),
      };

      try {
        await axios.post(
          `${process.env.REACT_APP_API_HOST}/notifications/telegram/edit`,
          request_data,
          config
        );
        setOpenDelegatorSettings(false);
      } catch (error) {
        setError("Invalid Telegram Credentials.");
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    inputValue && (
      <Card
        mb={{ base: "0px", "2xl": "10px" }}
        {...rest}
        h="820px"
        overflow="auto"
        boxShadow="md"
      >
        <Flex w="100%" justifyContent="space-between" mb="20px">
        {open_delegator_settings[2] === 2043 ||
          open_delegator_settings[2] === 20430 ? (
            <img
              src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
              style={{ maxWidth: "50px", maxHeight: "50px" }}
            />
          ) : open_delegator_settings[2] === 100 ||
          open_delegator_settings[2] === 10200 ? (
            <img
              src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
              style={{ maxWidth: "50px", maxHeight: "50px" }}
            />
          ) : (
            ""
          )}

          <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl">
            {open_delegator_settings[0]} Notifications
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
                setOpenDelegatorSettings(false);
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
        <Flex w="80%" justifyContent="flex-start" mt="20px" ml="5%">
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize={{ sm: "md", lg: "2xl" }}
            w="40%"
          >
            Telegram ID
          </Text>
          <Input
            focusBorderColor={tracColor}
            name="telegram_id"
            value={inputValue ? inputValue.telegram_id : ""}
            w="80%"
            onChange={updateInput}
          ></Input>
        </Flex>
        <Flex w="80%" justifyContent="flex-start" mt="20px" ml="5%">
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize={{ sm: "md", lg: "2xl" }}
            w="40%"
          >
            Bot Token
          </Text>
          <Input
            focusBorderColor={tracColor}
            name="bot_token"
            value={inputValue ? inputValue.bot_token : ""}
            onChange={updateInput}
            w="80%"
          ></Input>
        </Flex>
        <Flex justifyContent="center" color="red.500">
          {error}
        </Flex>
        <Flex mt="20px" justifyContent="center">
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
        <Box ml="5%" mt="30px">
          <Flex w="100%" mb="20px">
            <Switch
              isChecked={inputValue.daily_report === 1 ? true : false}
              name="daily_report"
              size="lg"
              fontSize="xl"
              id="1"
              w="60px"
              mb="auto"
              mt="auto"
              reversed={true}
              onChange={updateInput}
            />
            <Flex w="100%" direction="column">
              <Flex w="100%">
                <Text
                  color={textColorPrimary}
                  fontWeight="bold"
                  fontSize={{ sm: "md", lg: "2xl" }}
                >
                  Daily Report
                </Text>
              </Flex>
              <Flex>
                <Text fontSize={{ sm: "sm", lg: "lg" }}>
                  Receive a daily notification containing statistics on the node
                  performance, including delegation earnings.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex w="100%" mb="20px">
            <Switch
              isChecked={inputValue.total_shares === 1 ? true : false}
              name="total_shares"
              size="lg"
              fontSize="xl"
              id="1"
              w="60px"
              mb="auto"
              mt="auto"
              reversed={true}
              onChange={updateInput}
            />
            <Flex w="100%" direction="column">
              <Flex w="100%">
                <Text
                  color={textColorPrimary}
                  fontWeight="bold"
                  fontSize={{ sm: "md", lg: "2xl" }}
                >
                  Total Shares
                </Text>
              </Flex>
              <Flex>
                <Text fontSize={{ sm: "sm", lg: "lg" }}>
                  Notify when the total number of node shares changes. This
                  indicates if a delegator staked or unstaked from the node.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex w="100%" mb="20px">
            <Switch
              isChecked={inputValue.operator_fee === 1 ? true : false}
              name="operator_fee"
              size="lg"
              fontSize="xl"
              id="1"
              w="60px"
              mb="auto"
              mt="auto"
              reversed={true}
              onChange={updateInput}
            />
            <Flex w="100%" direction="column">
              <Flex w="100%">
                <Text
                  color={textColorPrimary}
                  fontWeight="bold"
                  fontSize={{ sm: "md", lg: "2xl" }}
                >
                  Operator Fee
                </Text>
              </Flex>
              <Flex>
                <Text fontSize={{ sm: "sm", lg: "lg" }}>
                  Notify when the operational fee changes. This is the percent
                  fee the node operator takes from all asset earnings.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex w="100%" mb="20px">
            <Switch
              isChecked={inputValue.node_ask === 1 ? true : false}
              name="node_ask"
              size="lg"
              fontSize="xl"
              id="1"
              w="60px"
              mb="auto"
              mt="auto"
              reversed={true}
              onChange={updateInput}
            />
            <Flex w="100%" direction="column">
              <Flex w="100%">
                <Text
                  color={textColorPrimary}
                  fontWeight="bold"
                  fontSize={{ sm: "md", lg: "2xl" }}
                >
                  Node Ask
                </Text>
              </Flex>
              <Flex>
                <Text fontSize={{ sm: "sm", lg: "lg" }}>
                  Notify when the node operator changes the asking price to hold
                  assets. This is the price a publisher must pay before the node
                  operator will hold the asset.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex w="100%" mb="20px">
            <Switch
              isChecked={inputValue.active_status === 1 ? true : false}
              name="active_status"
              size="lg"
              fontSize="xl"
              id="1"
              w="60px"
              mb="auto"
              mt="auto"
              reversed={true}
              onChange={updateInput}
            />
            <Flex w="100%" direction="column">
              <Flex w="100%">
                <Text
                  color={textColorPrimary}
                  fontWeight="bold"
                  fontSize={{ sm: "md", lg: "2xl" }}
                >
                  Active Status
                </Text>
              </Flex>
              <Flex>
                <Text fontSize={{ sm: "sm", lg: "lg" }}>
                  Notify when the node drops below 50k stake. Nodes no longer
                  earn Trac when below 50k stake.
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Card>
    )
  );
}
