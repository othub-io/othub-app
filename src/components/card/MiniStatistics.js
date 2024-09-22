// Chakra imports
// Chakra imports
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
  Spinner,
  Avatar,
  Icon,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Custom icons
import React from "react";
import Loading from "components/effects/Loading.js";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Default(props) {
  const { startContent, endContent, name, growth, value, total_stake } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";
  const tracColor = useColorModeValue("brand.900", "white");

  return (
    <Card py="15px" boxShadow="md">
      <Flex
        my="auto"
        h="65px"
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}
      >
        {startContent}

        <Stat my="auto" ms={startContent ? "18px" : "0px"}>
          <StatLabel
            lineHeight="100%"
            color={textColorSecondary}
            fontSize={{
              base: "sm",
            }}
          >
            {name}
          </StatLabel>
          <StatNumber
            color={textColor}
            fontSize={{
              base: "2xl",
            }}
          >
            {value ? (
              value
            ) : (
              <Spinner
                thickness="2px"
                speed="0.65s"
                emptyColor="gray.200"
                color={tracColor}
                size="md"
              />
            )}
          </StatNumber>
          {growth ? (
            <Flex align="center">
              <Text
                color={textColor}
                fontSize={{sm: "12px", md: "15px"}}
                fontWeight="700"
                lineHeight="100%"
                mt="-5px"
              >
                {total_stake ? (
                  <>
                    {"("}
                    <Avatar
                      src={`${process.env.REACT_APP_API_HOST}/images?src=origintrail_logo_alt-dark_purple.svg`}
                      w="15px"
                      h="15px"
                      me="4px"
                      boxShadow="md"
                    />
                    {formatNumberWithSpaces(total_stake.toFixed(0))}
                    {")"}
                  </>
                ) : (
                  ""
                )}
              </Text>
              <Text
                color={growth.charAt(0) === "-" ? "red.500" : "green.500"}
                fontSize="xs"
                fontWeight="700"
                mt="-5px"
                me="5px"
              >
                {growth.charAt(0) === "-" ? (
                  <Icon
                    as={MdArrowDownward}
                    color="red.500"
                    w="15px"
                    h="15px"
                  />
                ) : (
                  <Icon
                    as={MdArrowUpward}
                    color="green.500"
                    w="15px"
                    h="15px"
                  />
                )}
                {growth}
              </Text>
              <Text color="secondaryGray.600" fontSize="xs" fontWeight="400" mt="-5px" display={{sm: "none",md: "block"}}>
                this month
              </Text>
            </Flex>
          ) : null}
        </Stat>
        <Flex ms="auto" w="max-content">
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
