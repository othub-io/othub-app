// Chakra imports
import {
    Box,
    Button,
    Flex,
    Icon,
    Text,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useColorModeValue,
  } from "@chakra-ui/react";
  // Custom components
  import Card from "components/card/Card.js";
  import React, { useState, useEffect, useContext } from "react";
  import { IoCheckmarkCircle } from "react-icons/io5";
  import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
  // Assets
  import { RiArrowUpSFill } from "react-icons/ri";
  import { AccountContext } from "../../../../AccountContext";
  import moment from "moment";
  import axios from "axios";
  import { Line } from "react-chartjs-2";
  import { Chart, registerables } from "chart.js";
  import "chartjs-adapter-date-fns";
  import "chartjs-plugin-annotation";
  import Loading from "components/effects/Loading.js";
  
  Chart.register(...registerables);
  
  const config = {
    headers: {
      "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    },
  };
  
  export default function CumEarnings(props) {
    const { ...rest } = props;
    // Chakra Color Mode
  
    let menuBg = useColorModeValue("white", "navy.800");
    const shadow = useColorModeValue(
      "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
      "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
    );
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const iconColor = useColorModeValue("brand.500", "white");
    const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const bgHover = useColorModeValue(
      { bg: "secondaryGray.400" },
      { bg: "whiteAlpha.50" }
    );
    const bgFocus = useColorModeValue(
      { bg: "secondaryGray.300" },
      { bg: "whiteAlpha.100" }
    );
  
    const [inputValue, setInputValue] = useState("");
    const [button, setButtonSelect] = useState("");
    const [isLoading, setisLoading] = useState(false);
    const [assetData, setAssetData] = useState(null);
    const [last_nodes, setLastNodes] = useState(null);
    const [latest_nodes, setLatestNodes] = useState(null);
    const { blockchain, setBlockchain } = useContext(AccountContext);
    const { network, setNetwork } = useContext(AccountContext);
    const ethBox = useColorModeValue("white", "navy.800");
    let data;
    let response;
    let latest_stake = 0;
    let latest_rewards = 0;
    let latest_earnings = 0;
    let last_stake = 0;
    let last_rewards = 0;
    let last_earnings = 0;
  
    useEffect(() => {
      async function fetchData() {
        try {
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      setAssetData(props.monthly_nodes);
      setLastNodes(props.last_nodes);
      setLatestNodes(props.latest_nodes);
      setInputValue("All-Time");
      fetchData();
    }, [props]);
  
    const formattedData = {
      datasets: [],
    };
  
    const changeFrequency = async (frequency, button_select, button_text) => {
      try {
        setAssetData(null);
        setInputValue(button_text);
        setButtonSelect(button_select);
        data = {
          frequency: frequency,
          timeframe: button_select,
          network: network,
          blockchain: blockchain,
          grouped: "yes"
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data,
          config
        );
  
        setAssetData(response.data.result);
  
        data = {
          network: network,
          blockchain: blockchain,
          frequency: button_select === "24" ? ("last24h") : button_select === "168" ? ("last7d") : button_select === "30" ? ("last30d") : button_select === "160" ? ("last6m") : button_select === "12" ? ("last1y") : "latest",
        };
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data,
          config
        );
  
        setLastNodes(response.data.result);
      } catch (e) {
        console.log(e);
      }
    };
  
    if (latest_nodes) {
      for (const node of latest_nodes[0].data) {
        latest_stake = latest_stake + node.nodeStake;
        latest_rewards = latest_rewards + node.cumulativePayouts;
        latest_earnings = latest_earnings + node.estimatedEarnings;
      }
    }
  
    if (last_nodes) {
      for (const node of last_nodes[0].data) {
        last_stake = last_stake + node.nodeStake;
        last_rewards = last_rewards + node.cumulativePayouts;
        last_earnings = last_earnings + node.estimatedEarnings;
      }
    }
  
    if (assetData) {
      let format = "MMM YY";
      if (button === "24") {
        format = "HH:00";
      }
      if (button === "168") {
        format = "ddd HH:00";
      }
      if (button === "30") {
        format = "DD MMM YY";
      }
      if (button === "160") {
        format = "DD MMM YY";
      }
  
      const uniqueDates = new Set();
      const formattedDates = [];
  
      for (const chain of assetData) {
        chain.data
          .filter((item) => {
            const formattedDate = moment(
              button === "24" || button === "168" ? item.datetime : item.date
            ).format(format);
            // Check if the formatted date is unique
            if (!uniqueDates.has(formattedDate)) {
              uniqueDates.add(formattedDate);
              formattedDates.push(formattedDate);
              return true;
            }
            return false;
          })
          .map((item) =>
            moment(
              button === "24" || button === "168" ? item.datetime : item.date
            ).format(format)
          );
      }
  
      formattedData.labels =
        button === "24" || button === "168"
          ? formattedDates
          : formattedDates.sort(
              (a, b) => moment(a, format).toDate() - moment(b, format).toDate()
            );
  
      let chain_color;
      let border_color;
      
      for (const chain of assetData) {
        let nodeStake = [];
        let nodesWithMoreThan50kStake = [];
        if (chain.blockchain_name === "Total") {
          continue;
        }
  
        for (const obj of formattedData.labels) {
          let containsDate = chain.data.some(
            (item) =>
              moment(
                button === "24" || button === "168" ? item.datetime : item.date
              ).format(format) === obj
          );
          if (containsDate) {
            let cum_earnings = 0
            for (const item of chain.data) {
              if (
                moment(
                  button === "24" || button === "168" ? item.datetime : item.date
                ).format(format) === obj
              ) {
                nodeStake.push(item.combinedNodesStake)
                nodesWithMoreThan50kStake.push(item.nodesWithMoreThan50kStake)
              }
            }
          } else {
            nodeStake.push(null)
            nodesWithMoreThan50kStake.push(null)
          }
        }
  
        if (
          chain.blockchain_name === "NeuroWeb Mainnet" ||
          chain.blockchain_name === "NeuroWeb Testnet"
        ) {
          chain_color = "#000000";
          border_color = "rgba(0, 0, 0, 0.1)"
        }
  
        if (
          chain.blockchain_name === "Gnosis Mainnet" ||
          chain.blockchain_name === "Chiado Testnet"
        ) {
          chain_color = "#133629";
          border_color = "rgba(19, 54, 41, 0.1)"
        }
  
        let nodeStake_obj = {
          label: `${chain.blockchain_name} Est. Earnings 1st Epoch`,
          data: nodeStake,
          fill: false,
          borderColor: chain_color,
          backgroundColor: border_color,
          tension: 0.4,
          borderWidth: 3,
          type: chain.blockchain_name !== "Total" ? "bar" : "line",
          stacked: chain.blockchain_name !== "Total" ? false : true,
        };
        formattedData.datasets.push(nodeStake_obj);

        let nodesWithMoreThan50kStake_obj = {
            label: "All Total Estimated Earnings",
            data: nodesWithMoreThan50kStake,
            fill: false,
            borderColor: chain_color,
            backgroundColor: border_color,
            tension: 0.4,
            borderWidth: 3,
            type: "line"
          };
          formattedData.datasets.push(nodesWithMoreThan50kStake_obj);
      }
    } else {
      return (
        <Card
          justifyContent="center"
          align="center"
          direction="column"
          w="100%"
          mb="0px"
          {...rest}
          boxShadow="md"
        >
          <Flex flexDirection="column" me="20px" mt="28px">
            <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
              <Box minH="260px" minW="75%" mx="auto">
                <Loading />
              </Box>
            </Flex>
          </Flex>
        </Card>
      );
    }
  
    const options = {
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6, // Increase the radius on hover
          hoverBackgroundColor: "white",
          hoverBorderWidth: 3,
          cursor: "crosshair",
        },
        bar: {
          borderRadius: 5, // Adjust the value for the desired roundness
          hoverBorderColor: "gray",
          hoverBackgroundColor: "white"
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          stacked: true,
          title: {
            display: false,
            text: "TRAC",
            color: "#6344df",
            font: {
              size: 12,
            },
          },
          ticks: {
            callback: function (value, index, values) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + "M";
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + "K";
              } else {
                return value;
              }
            },
            color: "#A3AED0",
          },
          grid: {
            display: false, // hide grid lines
            borderWidth: 0,
          },
          borderWidth: 0, // remove y axis border
          axis: {
            display: false, // hide y axis line
          },
        },
        y: {
          beginAtZero: false,
          stacked: true,
          title: {
            display: false,
            text: "TRAC",
            color: "#6344df",
            font: {
              size: 12,
            },
          },
          ticks: {
            callback: function (value, index, values) {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + "M";
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + "K";
              } else {
                return value;
              }
            },
            color: "#A3AED0",
          },
          grid: {
            display: false, // hide grid lines
            borderWidth: 0,
          },
          borderWidth: 0, // remove y axis border
          axis: {
            display: false, // hide y axis line
          },
        },
        x: {
          beginAtZero: false,
          stacked: true,
          title: {
            display: false,
            text: "Date (UTC)",
            color: "#6344df",
            font: {
              size: 12,
            },
          },
          grid: {
            display: false, // hide grid lines
            borderWidth: 0,
          },
          axis: {
            display: false, // hide x axis line
          },
          ticks: {
            color: "#A3AED0",
          },
        },
      },
      plugins: {
        legend: {
          display: false, // hide legend
        },
        tooltip: {
          mode: "nearest",
          intersect: false,
          callbacks: {
            label: function (context) {
              let label = "";
              const datasets = context.chart.data.datasets;
              const tooltipData = context.chart.tooltip;
              if (tooltipData) {
                const index = tooltipData.dataPoints[0].dataIndex;
                datasets.forEach((dataset, i) => {
                  if (dataset.data[index]) {
                    return (label += `${dataset.label}: ${dataset.data[
                      index
                    ].toFixed(2)} `);
                  }
                });
              }
            },
          },
        },
      },
      // Custom cursor styling
      hover: {
        mode: "nearest", // Set hover mode to nearest
        intersect: false,
        axis: "x",
        animationDuration: 0,
        onHover: function (_, chartElement) {
          // Log to check if the onHover function is triggered
          console.log("Hover event:", chartElement);
  
          // Change cursor to crosshair when hovering over the chart
          const chart = chartElement.chart;
          if (chart) {
            chart.canvas.style.cursor = chartElement ? "crosshair" : "default";
          }
        },
        // Additional hover configuration if needed
      },
    };
  
    return (
      <Card
        justifyContent="center"
        align="center"
        direction="column"
        w="100%"
        mb="0px"
        {...rest}
        boxShadow="md"
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
                    onClick={(e) => changeFrequency("hourly", "24", "Last Day")}
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
                    onClick={(e) => changeFrequency("hourly", "168", "Last Week")}
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
                    onClick={(e) => changeFrequency("daily", "30", "Last Month")}
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
                    onClick={(e) => changeFrequency("monthly", "12", "Last Year")}
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
        </Flex>
        <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
          <Flex flexDirection="column" me="20px" mt="28px">
            <Text
              color="#11047A"
              fontSize="34px"
              textAlign="start"
              fontWeight="700"
              lineHeight="100%"
            >
              {button === ""
                ? (latest_stake / latest_nodes[0].data.length) >= 1000000
                  ? ((latest_stake / latest_nodes[0].data.length) / 1000000).toFixed(0) + "M"
                  : (latest_stake / latest_nodes[0].data.length) >= 1000
                  ? ((latest_stake / latest_nodes[0].data.length) / 1000).toFixed(0) + "K"
                  : (latest_stake / latest_nodes[0].data.length).toFixed(2)
                : (last_stake / latest_nodes[0].data.length) >= 1000000
                ? ((last_stake / latest_nodes[0].data.length) / 1000000).toFixed(0) + "M"
                : (last_stake / latest_nodes[0].data.length) >= 1000
                ? ((last_stake / latest_nodes[0].data.length) / 1000).toFixed(0) + "K"
                : (last_stake / latest_nodes[0].data.length).toFixed(2)}
            </Text>
            <Flex align="center" mb="20px">
              <Text
                color="secondaryGray.600"
                fontSize="lg"
                fontWeight="500"
                mt="4px"
                me="12px"
              >
                Avg Stake
                <Icon as={RiArrowUpSFill} color="green.500" me="2px" mt="2px" />
                <Text color="green.500" fontSize="lg" fontWeight="700">
                  {`%${((last_stake / latest_stake) * 100).toFixed(1)}`}
                </Text>
              </Text>
            </Flex>
          </Flex>
          <Box minH="260px" minW="75%" mt="auto">
            <Text
              color={textColor}
              fontSize="24px"
              mt="-40px"
              pb="20px"
              textAlign="right"
              fontWeight="700"
              lineHeight="100%"
            >
              Node Stakes
            </Text>
            <Line data={formattedData} options={options} />
          </Box>
        </Flex>
      </Card>
    );
  }
  