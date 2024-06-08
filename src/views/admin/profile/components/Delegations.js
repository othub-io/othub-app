// Chakra imports
import {
  SimpleGrid,
  Text,
  useColorModeValue,
  Button,
  Flex,
  Icon,
  Menu
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import SwitchField from 'components/fields/SwitchField';
import DelegateInformation from "views/admin/profile/components/Delegate_Information";
import axios from "axios";
import { AccountContext } from "../../../../AccountContext";
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
  },
};

// Assets
export default function Delegations(props) {
  const { ...rest } = props;
  const account = localStorage.getItem("account");
  const [delegations, setDelegations] = useState(null);
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { open_delegator_settings, setOpenDelegateSettings } =
    useContext(AccountContext);
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const tracColor = useColorModeValue("brand.900", "white");

  let data;
  let response;
  let total_delegations = [];

  useEffect(() => {
    async function fetchData() {
      try {
        if (network && account) {
          data = {
            network: network,
            frequency: "latest",
            delegator: account,
          };
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/delegators/stats`,
            data,
            config
          );
          setDelegations(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [network, account]);

  if (delegations) {
    for (const chain of delegations) {
      for (const delegator of chain.data) {
        total_delegations.push(delegator);
      }
    }
  }

  if (open_delegator_settings) {
    return (
      <Card
        mb={{ base: "0px", "2xl": "10px" }}
        {...rest}
        h="400px"
        overflow="auto"
      >
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
              setOpenDelegateSettings(false);
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
        <Flex>
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mt="5px"
            mb="4px"
          >
            {open_delegator_settings}
          </Text>
        </Flex>

        <Flex align="center" w="100%" justify="space-between" mb="30px">
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mb="4px"
          >
            Notifications
          </Text>
          <Menu />
        </Flex>
        <SwitchField
          isChecked={true}
          reversed={true}
          fontSize="sm"
          mb="20px"
          id="1"
          label="Item update notifications"
        />
        <SwitchField
          reversed={true}
          fontSize="sm"
          mb="20px"
          id="2"
          label="Item comment notifications"
        />
        <SwitchField
          isChecked={true}
          reversed={true}
          fontSize="sm"
          mb="20px"
          id="3"
          label="Buyer review notifications"
        />
        <SwitchField
          isChecked={true}
          reversed={true}
          fontSize="sm"
          mb="20px"
          id="4"
          label="Rating reminders notifications"
        />
        <SwitchField
          reversed={true}
          fontSize="sm"
          mb="20px"
          id="5"
          label="Meetups near you notifications"
        />
        <SwitchField
          reversed={true}
          fontSize="sm"
          mb="20px"
          id="6"
          label="Company news notifications"
        />
      </Card>
    );
  }

  return (
    !open_delegator_settings && (
      <Card
        mb={{ base: "0px", "2xl": "10px" }}
        {...rest}
        h="400px"
        overflow="auto"
      >
        <Text
          color={textColorPrimary}
          fontWeight="bold"
          fontSize="2xl"
          mt="5px"
          mb="4px"
        >
          Delegations
        </Text>
        {total_delegations.length > 0 && (
          <SimpleGrid columns="1" gap="20px">
            {total_delegations.map((delegate, index) => (
              <DelegateInformation
                key={index}
                boxShadow={cardShadow}
                tokenName={delegate.tokenName}
                shares={delegate.shares}
                delegatorStakeValueCurrent={delegate.delegatorStakeValueCurrent}
                delegatorStakeValueFuture={delegate.delegatorStakeValueFuture}
                delegatorCurrentEarnings={delegate.delegatorCurrentEarnings}
                delegatorFutureEarnings={delegate.delegatorFutureEarnings}
                nodeSharesTotalSupply={delegate.nodeSharesTotalSupply}
                chain_id={delegate.chainId}
              />
            ))}
          </SimpleGrid>
        )}
      </Card>
    )
  );
}
