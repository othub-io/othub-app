import React, { useState, useEffect, useContext } from "react";
import {
  SimpleGrid, Text, useColorModeValue, Button, Flex, Icon, Input
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import NodeInformation from "views/admin/profile/components/Node_Information";
import axios from "axios";
import { AccountContext } from "../../../../AccountContext";
import {
  MdArrowCircleLeft
} from "react-icons/md";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

export default function Nodes(props) {
  const { user_info, nodes, ...rest } = props;
  const { blockchain, setBlockchain, network, setNetwork, account} = useContext(AccountContext);
  const { open_edit_node, setOpenEditNode } = useContext(AccountContext);
  
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const tracColor = useColorModeValue("brand.900", "white");
  const [uploadedImage, setUploadedImage] = useState(null);

  let total_nodes = [];

  useEffect(() => {
    async function fetchData() {

      try {
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  if (nodes) {
    for (const chain of nodes) {
      for (const node of chain.data) {
        total_nodes.push(node);
      }
    }
  }

  if (open_edit_node) {
    return (
      <Card mb={{ base: "0px", "2xl": "10px" }} {...rest} h="400px" overflow="auto">
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
    <Card mb={{ base: "0px", "2xl": "10px" }} {...rest} h="400px" overflow="auto">
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="5px"
        mb="4px"
      >
        Nodes
      </Text>
      {total_nodes.length > 0 && (
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
  );
}
