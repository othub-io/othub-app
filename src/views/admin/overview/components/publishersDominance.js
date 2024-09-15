import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Card from "components/card/Card.js";
import { Pie } from "react-chartjs-2";
import Loading from "components/effects/Loading.js";
import { VSeparator } from "components/separator/Separator";
function generateRandomColor() {
  // Generate a random hexadecimal color code
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // Pad the color code with zeros if needed
  return "#" + "0".repeat(6 - randomColor.length) + randomColor;
}

export default function Conversion(props) {
  const { ...rest } = props;
  let data;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const tracColor = useColorModeValue("brand.900", "white");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const newData = [...props.latest_publishers];

  const latest_publishers = newData.sort((a, b) => {
    let result = 0;
    let data;

    // Implement your sorting logic based on the 'sortBy' parameter
    if (a["assetsPublished"] < b["assetsPublished"]) {
      result = -1;
    } else if (a["assetsPublished"] > b["assetsPublished"]) {
      result = 1;
    }

    // Toggle the result based on the sort order
    return -result;
  });

  data = {
    labels: latest_publishers.map((publisher) => publisher.publisher),
    datasets: [
      {
        data: latest_publishers.map((publisher) => publisher.assetsPublished),
        backgroundColor: latest_publishers.map((publisher) =>
          generateRandomColor()
        ),
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

  if (data) {
    return (
      <Card
        p="20px"
        align="center"
        direction="column"
        w="100%"
        {...rest}
        boxShadow="md"
      >
        <Flex
          px={{ base: "0px", "2xl": "10px" }}
          justifyContent="space-between"
          alignItems="right"
          w="100%"
          mb="8px"
        >
          <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
            Publisher Dominance
          </Text>
        </Flex>

        <Flex
          px={{ base: "0px", "2xl": "10px" }}
          h={{ base: "200px", md: "150px", lg: "200px" }}
          w="200px"
          ml="auto"
          mr="auto"
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
          mt="15px"
          mx="auto"
        >
          <Flex direction="column" py="5px" ml="5%">
            <Flex align="center">
              <Box h="10px" w="10px" bg="#11047A" borderRadius="50%" me="4px" />
              <Text
                fontSize="xs"
                color="secondaryGray.600"
                fontWeight="700"
                mb="5px"
              >
                Top Publisher
              </Text>
            </Flex>
            <Text fontSize="lg" color={textColor} fontWeight="700">
              {latest_publishers[0].publisher.substring(0, 10)}
            </Text>
          </Flex>
        </Card>
      </Card>
    );
  }
}
