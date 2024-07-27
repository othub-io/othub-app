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
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import SwitchField from "components/fields/SwitchField";
import DelegateInformation from "views/admin/profile/components/Delegate_Information";
import NodeInformation from "views/admin/profile/components/Node_Information";
import DelegatorSettings from "views/admin/profile/components/DelegatorSettings";
import DelegatorStats from "views/admin/profile/components/DelegatorStats";
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
  },
};

// Assets
export default function Delegations(props) {
  const { delegations, nodes, ...rest } = props;
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const [mode, setMode] = useState(null);
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

  const { open_edit_node, setOpenEditNode } = useContext(AccountContext);
  const [uploadedImage, setUploadedImage] = useState(null);
  let data;
  let response;
  let total_delegations = [];
  let total_nodes = [];

  useEffect(() => {
    async function fetchData() {
      try {
        // if (network && account) {
        //   data = {
        //     network: network,
        //     frequency: "latest",
        //     delegator: account,
        //   };
        //   response = await axios.post(
        //     `${process.env.REACT_APP_API_HOST}/delegators/stats`,
        //     data,
        //     config
        //   );
        //   setDelegations(response.data.result);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [network, account, delegations]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  if (delegations) {
    for (const chain of delegations) {
      for (const delegator of chain.data) {
        total_delegations.push(delegator);
      }
    }
  }

  if (nodes) {
    for (const chain of nodes) {
      for (const node of chain.data) {
        total_nodes.push(node);
      }
    }
  }

  if (open_delegator_settings) {
    return (
      <DelegatorSettings open_delegator_settings={open_delegator_settings}/> 
    );
  }

  if (open_delegator_stats) {
    return (
      <DelegatorStats open_delegator_stats={open_delegator_stats}/> 
    );
  }

  if (open_edit_node) {
    return (
      <Card
        mb={{ base: "0px", "2xl": "10px" }}
        {...rest}
        h="400px"
        overflow="auto"
        boxShadow="md"
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
        <Flex>
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mt="5px"
            mb="4px"
          >
            {open_edit_node}
          </Text>
        </Flex>
        <Flex w="100%" justifyContent="flex-start" mt="20px">
          <Input
            type="file"
            accept=".jpg, .jpeg"
            onChange={handleFileUpload}
            mb="10px"
          />
          <Flex w="50px" h="50px">
            {uploadedImage && <img src={uploadedImage} alt="Uploaded" />}
          </Flex>
        </Flex>
        <Flex w="100%" justifyContent="flex-start" mt="20px">
          <Input
            h="150px"
            focusBorderColor={tracColor}
            id="bio"
            // placeholder={node_info.bio ? node_info.bio : "Node Bio"}
            w="100%"
          ></Input>
        </Flex>
      </Card>
    );
  }

  return (
    !open_delegator_settings && (
      <Card
        mb={{ base: "0px", "2xl": "10px" }}
        {...rest}
        h="820px"
        overflow="auto"
        boxShadow="md"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            fontSize="2xl"
            mt="5px"
            mb="30px"
          >
            Positions
          </Text>
          <ToggleButtons set_mode={setMode} />
        </Flex>
        {mode === "D" && total_delegations.length > 0 && (
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
                node_id={delegate.nodeId}
              />
            ))}
          </SimpleGrid>
        )}
        {mode === "N" && total_nodes.length > 0 && (
          <SimpleGrid columns="1" gap="20px">
            {total_nodes.map((node, index) => (
              <NodeInformation
                key={index}
                tokenName={node.tokenName}
                chain_id={node.chainId}
                nodeSharesTotalSupply={node.nodeSharesTotalSupply}
                cumulativeOperatorRewards={node.cumulativeOperatorRewards}
              />
            ))}
          </SimpleGrid>
        )}
      </Card>
    )
  );
}
