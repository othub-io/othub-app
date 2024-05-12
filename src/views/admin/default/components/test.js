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
  import { Line, Bar } from "react-chartjs-2";
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
  
    const [button, setButtonSelect] = useState("168");
    const [assetData, setAssetData] = useState(null);
    const { blockchain, setBlockchain } = useContext(AccountContext);
    const { network, setNetwork } = useContext(AccountContext);
    let data;
    let response;
  
    useEffect(() => {
      async function fetchData() {
        try {

            data = {
                frequency: 'hourly',
                timeframe: 169,
                network: network,
                blockchain: blockchain,
              };
              response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/pubs/stats`,
                data,
                config
              );
        
              setAssetData([response.data.result[0]]);

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      fetchData();
    }, [network]);
  
    const formattedData = {
      datasets: [],
    };
  
    if (assetData) {
        console.log(assetData)
        //let format = "DD ddd HH:00";
        let format = "ddd HH:00";
        
  
      const uniqueDates = new Set();
      const formattedDates = [];
  
      for (const chain of assetData) {
        chain.data
          .filter((item) => {
            const formattedDate = moment(
              item.datetime
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
              item.datetime
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
          let pubCounts = []
    
          for (const obj of formattedData.labels) {
            let containsDate = chain.data.some((item) => moment(item.datetime).format(format) === obj);
            if(containsDate){
                let pubs = 0;
                for (const item of chain.data) {
                  if (
                    moment(
                      item.datetime
                    ).format(format) === obj
                  ) {
                      pubs =
                      pubs + item.totalPubs;
                  }
                }
                pubCounts.push(pubs);
            }else{
              pubCounts.push(null)
            }
          }

          if (
            chain.blockchain_name === "NeuroWeb Mainnet" ||
            chain.blockchain_name === "NeuroWeb Testnet"
          ) {
            border_color = "#fb5deb";
            chain_color = "rgba(251, 93, 235, 0.1)"
          }
    
          if (
            chain.blockchain_name === "Gnosis Mainnet" ||
            chain.blockchain_name === "Chiado Testnet"
          ) {
            border_color = "#133629";
                chain_color = "rgba(19, 54, 41, 0.1)"
          }

          if (chain.blockchain_name === "Total") {
            chain_color = "#11047A";
            border_color = "#11047A";
          }
    
          let pubCounts_obj = {
            label: chain.blockchain_name,
            data: pubCounts,
            fill: false,
            borderColor: border_color,
            backgroundColor: chain_color,
            borderWidth: 2
          };
          formattedData.datasets.push(pubCounts_obj);
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
      },
      scales: {
        y: {
          beginAtZero: false,
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
            display: true, 
          },
          grid: {
            display: false, // hide grid lines
            borderWidth: 0,
          },
          borderWidth: 0, // remove y axis border
          axis: {
            display: true, // hide y axis line
          },
        },
        x: {
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
            display: false, 
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
          mb="0px"
          h="300px"
          w="100%"
          {...rest}
        >
          <Flex w="100%" h="100%">
            <Box mt="auto" h="100%" w="100%" mr="40px">
            <Text
                color={textColor}
                fontSize="24px"
                pb="20px"
                textAlign="right"
                fontWeight="700"
                lineHeight="100%"
            >
                Asset Inflow
            </Text>
              <Bar data={formattedData} options={options} height="100%" width="650%" /> {/* Set width to 100% */}
            </Box>
          </Flex>
        </Card>
      );
      
  }
  