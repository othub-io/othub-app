import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Box,
  Grid,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

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
} from "react-icons/md";

import { AccountContext } from "../../../../AccountContext";
import axios from "axios";
import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
//import Menu from "components/menu/MainMenu";
import Loading from "components/effects/Loading.js";
// Assets
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import NodePage from "views/admin/nodes/components/NodePage";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

export default function NodeTable(props) {
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { node_id, node_name } = props;
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [inputValue, setInputValue] = useState("");
  const { open_node_page, setOpenNodePage } = useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  let secondaryText = useColorModeValue("gray.700", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  let explorer_url = "https://dkg.origintrail.io";

  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  useEffect(() => {
    async function fetchData() {
      try {
        //node_id
        console.log('ID: '+node_id)
        console.log('NAME: '+node_name)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    
    setInputValue("All-Time");
    fetchData();
  }, []);

  const closeNodePage = () => {
    window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    setOpenNodePage(false);
  };

  // if (!open_node_page) {
  //   return <NodeTable />;
  // }

  const changeFrequency = async (frequency, button_select, button_text) => {
    // try {
    //   setAssetData(null);
    //   setInputValue(button_text);
    //   setButtonSelect(button_select);
    //   data = {
    //     frequency: frequency,
    //     timeframe: button_select,
    //     network: network,
    //     blockchain: blockchain,
    //   };
    //   response = await axios.post(
    //     `${process.env.REACT_APP_API_HOST}/pubs/stats`,
    //     data,
    //     config
    //   );
    //   setAssetData(response.data.result);
    //   data = {
    //     network: network,
    //     blockchain: blockchain,
    //     frequency:
    //       button_select === "24"
    //         ? "last24h"
    //         : button_select === "168"
    //         ? "last7d"
    //         : button_select === "30"
    //         ? "last30d"
    //         : button_select === "160"
    //         ? "last6m"
    //         : button_select === "12"
    //         ? "last1y"
    //         : "total",
    //   };
    //   response = await axios.post(
    //     `${process.env.REACT_APP_API_HOST}/pubs/stats`,
    //     data,
    //     config
    //   );
    //   setLastPubs(response.data.result[0].data[0]);
    // } catch (e) {
    //   console.log(e);
    // }
  };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
      bg="none"
    >
      <Box mb={{ base: "20px", "2xl": "20px" }} ml="40px">
        <Button
          bg="none"
          border="solid"
          borderColor={tracColor}
          borderWidth="2px"
          color={tracColor}
          _hover={{ bg: "none" }}
          _active={{ bg: "none" }}
          _focus={{ bg: "none" }}
          top="14px"
          right="14px"
          borderRadius="5px"
          pl="10px"
          pr="10px"
          minW="36px"
          h="36px"
          mb="10px"
          onClick={() => closeNodePage()}
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
      </Box>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.3fr 2.7fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
        h="280px"
        mb='20px'
      >
        <Card></Card>
        <Card
        justifyContent="center"
        align="center"
        direction="column"
        w="100%"
        mb="0px"
        >
          <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        <Flex align="center" w="100%">
              <Menu>
                <MenuButton
                  fontSize="md"
                  fontWeight="500"
                  borderRadius="7px"
                  marginRight="20px"
                  px="24px"
                  py="7px"
                  bg={boxBg}
                  color={textColorSecondary}
                >
                  <Icon as={MdOutlineCalendarToday} color={"#fffff"} me="4px" />
                  {inputValue}
                </MenuButton>
                <MenuList
                  boxShadow={shadow}
                  p="0px"
                  mt="-10px"
                  borderRadius="5px"
                  bg={menuBg}
                  border="none"
                >
                  <Flex flexDirection="column" p="3px" key={1}>
                    <MenuItem
                      _hover={{
                        bg: "none",
                        bgColor: textColorSecondary,
                        color: "#ffffff",
                      }}
                      _focus={{ bg: "none" }}
                      borderRadius="5px"
                      px="14px"
                      onClick={(e) =>
                        changeFrequency("monthly", "1000", "All-Time")
                      }
                      color={textColorSecondary}
                      fontSize="16px"
                      fontWeight="bold"
                    >
                      All-Time
                    </MenuItem>
                    <MenuItem
                      _hover={{
                        bg: "none",
                        bgColor: textColorSecondary,
                        color: "#ffffff",
                      }}
                      _focus={{ bg: "none" }}
                      borderRadius="5px"
                      px="14px"
                      onClick={(e) =>
                        changeFrequency("hourly", "24", "Last Day")
                      }
                      color={textColorSecondary}
                      fontSize="16px"
                      fontWeight="bold"
                    >
                      Last Day
                    </MenuItem>
                    <MenuItem
                      _hover={{
                        bg: "none",
                        bgColor: textColorSecondary,
                        color: "#ffffff",
                      }}
                      _focus={{ bg: "none" }}
                      borderRadius="5px"
                      px="14px"
                      onClick={(e) =>
                        changeFrequency("hourly", "168", "Last Week")
                      }
                      color={textColorSecondary}
                      fontSize="16px"
                      fontWeight="bold"
                    >
                      Last Week
                    </MenuItem>
                    <MenuItem
                      _hover={{
                        bg: "none",
                        bgColor: textColorSecondary,
                        color: "#ffffff",
                      }}
                      _focus={{ bg: "none" }}
                      borderRadius="5px"
                      px="14px"
                      onClick={(e) =>
                        changeFrequency("daily", "30", "Last Month")
                      }
                      color={textColorSecondary}
                      fontSize="16px"
                      fontWeight="bold"
                    >
                      Last Month
                    </MenuItem>
                    <MenuItem
                      _hover={{
                        bg: "none",
                        bgColor: textColorSecondary,
                        color: "#ffffff",
                      }}
                      _focus={{ bg: "none" }}
                      borderRadius="5px"
                      px="14px"
                      onClick={(e) =>
                        changeFrequency("daily", "160", "Last 6 Months")
                      }
                      color={textColorSecondary}
                      fontSize="16px"
                      fontWeight="bold"
                    >
                      Last 6 Months
                    </MenuItem>
                    <MenuItem
                      _hover={{
                        bg: "none",
                        bgColor: textColorSecondary,
                        color: "#ffffff",
                      }}
                      _focus={{ bg: "none" }}
                      borderRadius="5px"
                      px="14px"
                      onClick={(e) =>
                        changeFrequency("monthly", "12", "Last Year")
                      }
                      color={textColorSecondary}
                      fontSize="16px"
                      fontWeight="bold"
                    >
                      Last Year
                    </MenuItem>
                  </Flex>
                </MenuList>
              </Menu>
            </Flex>
            <Box minH="260px" minW="75%" mt="auto">
              {/* <Line data={formattedData} options={options} /> */}
            </Box>
          </Flex>
        </Card>
      </Grid>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "4fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
        h="280px"
        mt="20px"
      >
        <Card />
      </Grid>
    </Card>
  );
}
