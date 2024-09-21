import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Card from "components/card/Card.js";
import { Pie } from "react-chartjs-2";
import Loading from "components/effects/Loading.js";
import { VSeparator } from "components/separator/Separator";
export default function Conversion(props) {
  const { ...rest } = props;
  const [assetData, setAssetData] = useState(null);

  useEffect(() => {
    // Fetch data here
    setAssetData(props.total_pubs);
  }, [props]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const tracColor = useColorModeValue("brand.900", "white");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  if (!assetData) {
    // Return loading or placeholder component
    return <Loading />;
  }

  const data = {
    labels: ["Private", "Public"],
    datasets: [
      {
        data: [
          assetData.privatePubsPercentage,
          100 - assetData.privatePubsPercentage,
        ],
        backgroundColor: [
          "#11047A", // Color for private
          "#E2E8F0", // Color for public
        ],
        type: "doughnut",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // hide legend
      },
    },
  };

  return (
    <Card p="20px" align="center" direction="column" w="100%" {...rest} boxShadow="md">
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent="space-between"
        alignItems="right"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
          Asset Privacy Ratio
        </Text>
      </Flex>

      <Flex px={{ base: "0px", "2xl": "10px" }}
        h="200px"
        w="200px"
        mb="8px"
        mx="auto">
        <Pie data={data} options={options} />
      </Flex>

      <Card
        bg={cardColor}
        flexDirection="row"
        boxShadow="md"
        w="100%"
        p="15px"
        px="20px"
        mt="15px"
        mx="auto"
      >
        <Flex direction="column" py="5px" ml="30px">
          <Flex align="center">
            <Box h="10px" w="10px" bg="#11047A" borderRadius="50%" me="4px" />
            <Text
              fontSize="xs"
              color="secondaryGray.600"
              fontWeight="700"
              mb="5px"
            >
              Private
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {assetData.privatePubsPercentage}%
          </Text>
        </Flex>
        <VSeparator mx={{ base: "60px", xl: "60px", "2xl": "60px" }} />
        <Flex direction="column" py="5px">
          <Flex align="center">
            <Box h="10px" w="10px" bg="#E2E8F0" borderRadius="50%" me="4px" />
            <Text
              fontSize="xs"
              color="secondaryGray.600"
              fontWeight="700"
              mb="5px"
            >
              Public
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {100 - assetData.privatePubsPercentage}%
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}
