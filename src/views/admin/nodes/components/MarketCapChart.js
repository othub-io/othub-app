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
  import moment from "moment";
  import axios from "axios";
  import { Line } from "react-chartjs-2";
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
  import NodeValueChart from "views/admin/nodes/components/NodeValueChart";
  const config = {
    headers: {
      "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    },
  };
  
  export default function NodeTable(props) {
    const { blockchain, setBlockchain } = useContext(AccountContext);
    const { network, setNetwork } = useContext(AccountContext);
    const { node_id, node_data, price } = props;
    const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setisLoading] = useState(false);
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
        
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      fetchData();
    }, [node_data]);
  
    const formattedData = {
      datasets: [],
    };
  
    if (node_data) {
      let format = "MMM YY";
      if (inputValue === "24h") {
        format = "HH:00";
      }
      if (inputValue === "7d") {
        format = "ddd HH:00";
      }
      if (inputValue === "30d") {
        format = "DD MMM YY";
      }
      if (inputValue === "6m") {
        format = "DD MMM YY";
      }
  
      const uniqueDates = new Set();
      const formattedDates = [];
      node_data
          .filter((item) => {
            const formattedDate = moment(item.date).format(format);
            // Check if the formatted date is unique
            if (!uniqueDates.has(formattedDate)) {
              uniqueDates.add(formattedDate);
              formattedDates.push(formattedDate);
              return true;
            }
            return false;
          })
          .map((item) => moment(item.date).format(format));
  
      formattedData.labels = formattedDates.sort((a, b) => moment(a, format).toDate() - moment(b, format).toDate())
  
      let border_color;
      let chain_color;
      for (const node of node_data) {
        let nodeStake = []
  
        for (const obj of formattedData.labels) {
          let containsDate = node_data.some((item) => moment(item.date).format(format) === obj);
          if(containsDate){
            for (const item of node_data) {
              if (moment(item.date).format(format) === obj) {
                nodeStake.push(item.combinedNodesStake)
              }
            }
          }else{
            nodeStake.push(null)
          }
        }
  
        let nodeStake_obj = {
          label: "Market Cap",
          data: nodeStake,
          fill: false,
          borderColor: "#11047A",
          backgroundColor: "#11047A",
          borderWidth: 1,
        };
  
        formattedData.datasets.push(nodeStake_obj);
      }
    }
  
    const options = {
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        x: {
          stacked: false,
          grid: {
            display: false, // hide grid lines on x axis
          },
          border: {
            display: false, // hide axis border
          },
          ticks: {
            display: false, // hide y axis ticks
          },
        },
        y: {
          stacked: false,
          grid: {
            display: false, // hide grid lines on y axis
          },
          border: {
            display: false, // hide axis border
          },
          ticks: {
            display: false, // hide y axis ticks
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  
    return (
      <Flex>
        <Box maxH="150px" minH="100%" minW="150%" mt="0px">
          <Line data={formattedData} options={options} />
        </Box>
      </Flex>
    );
  }
  