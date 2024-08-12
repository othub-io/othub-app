// Chakra imports
import {
  SimpleGrid,
  Text,
  useColorModeValue,
  Spinner,
  Flex,
  Stack,
  Box,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import SwitchField from "components/fields/SwitchField";
import DelegateInformation from "views/admin/profile/components/Delegate_Information";
import axios from "axios";
import { AccountContext } from "../../../../AccountContext";
import { Pie } from "react-chartjs-2";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function generateRandomColor() {
  // Generate a random hexadecimal color code
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // Pad the color code with zeros if needed
  return "#" + "0".repeat(6 - randomColor.length) + randomColor;
}

// Assets
export default function Delegations(props) {
  const { publisher, pub_data, ...rest } = props;
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const {
    token,
    setToken,
    account,
    setAccount,
    connected_blockchain,
    setConnectedBlockchain,
  } = useContext(AccountContext);
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
  const [favorite_paranet, setFavoriteParanet] = useState(null);
  let data;
  let response;
  let favoriteParent;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");

  useEffect(() => {
    async function fetchData() {
      try {
        let groupedCounts = pub_data.reduce((acc, item) => {
          const parentName = item.parent_name || "No Parent";
    
          if (!acc[parentName]) {
            acc[parentName] = 0;
          }
          acc[parentName]++;
          return acc;
        }, {});

        const favoriteParent = Object.keys(groupedCounts).reduce((a, b) =>
          groupedCounts[a] > groupedCounts[b] ? a : b
        );
    
        // Set favorite parent to state
        setFavoriteParanet(favoriteParent);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [network, publisher, pub_data]);

  // Define a list of colors that go well together
  const colorPalette = [
    "#FF5733", // Example color 1
    "#33FF57", // Example color 2
    "#3357FF", // Example color 3
    "#F3FF33", // Example color 4
    "#FF33A6", // Example color 5
  ];

  // Function to generate a random color from the palette
  function generateColor() {
    const randomIndex = Math.floor(Math.random() * colorPalette.length);
    return colorPalette[randomIndex];
  }

  if (pub_data) {
    // Step 1: Group objects by `parent_name` and count the number of records in each group
    let groupedCounts = pub_data.reduce((acc, item) => {
      const parentName = item.parent_name || "No Parent";

      if (!acc[parentName]) {
        acc[parentName] = 0;
      }
      acc[parentName]++;
      return acc;
    }, {});

    const labels = Object.keys(groupedCounts);
    const dataCounts = Object.values(groupedCounts);

    data = {
      labels: labels,
      datasets: [
        {
          data: dataCounts,
          backgroundColor: labels.map(
            (name) => (name === "No Parent" ? "#E9EDF7" : generateColor())
          ),
        },
      ],
    };
  }

  const options = {
    plugins: {
      legend: {
        display: false, // hide legend
      }
    }
  };

  return pub_data ? (
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
        Preferred Paranets
      </Text>
      {pub_data.length > 0 && (
        <SimpleGrid columns="1" gap="20px">
          <Flex
            px={{ base: "0px", "2xl": "10px" }}
            h="200px"
            w="200px"
            mx="auto"
            mt="8px"
          >
            <Pie data={data} options={options} />
          </Flex>
          <Card
            bg={cardColor}
            flexDirection="row"
            boxShadow="md"
            w="100%"
            p="15px"
            px="20px"
            mt="-20px"
            mx="auto"
            minH="90px"
          >
            <Flex direction="column" py="5px" ml="30px">
              <Flex align="center">
                <Text
                  color={textColorSecondary} fontSize="md" fontWeight="500"
                >
                  Favorite Paranet
                </Text>
              </Flex>
              <Text fontSize="lg" color={tracColor} fontWeight="700">
              {favorite_paranet || 'Loading...'}
              </Text>
            </Flex>
          </Card>
        </SimpleGrid>
      )}
    </Card>
  ) : (
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
        Preferred Paranets
      </Text>
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
