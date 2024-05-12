/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  Input
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect, useContext } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import NetworkActivityTable from "views/admin/default/components/networkActivityTable";
import CumEarnings from "views/admin/default/components/cumEarnings";
import CumRewards from "views/admin/default/components/cumRewards";
import AssetPrivacy from "views/admin/default/components/assetPrivacy";
import AssetsPublished from "views/admin/default/components/assetsPublished";
import PublishersDominance from "views/admin/default/components/publishersDominance";
import Test from "views/admin/default/components/test";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import NodeTable from "views/admin/nodes/components/NodeTable";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/activityColumns";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import axios from "axios";
import { AccountContext } from "../../../AccountContext";
import ReactApexChart from "react-apexcharts";
import Loading from "components/effects/Loading";
import Card from "components/card/Card.js";
import NodePage from "views/admin/nodes/components/NodePage";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Settings() {
  // Chakra Color Mode
  const { open_node_page, setOpenNodePage } = useContext(AccountContext);
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const [node_data, setNodeData] = useState(null);

  const queryParameters = new URLSearchParams(window.location.search);
  const node_name = queryParameters.get("node");
  
  useEffect(() => {
    async function fetchData() {
      try {
        if(node_name){
          setOpenNodePage(node_name)
        }else{
          setNodeData(null)
          let settings = {
            network: network,
            blockchain: blockchain
          };
  
          let response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/nodes/info`,
            settings,
            config
          );
  
          let node_list = []
          for(const blockchain of response.data.result){
            for(const node of blockchain.data){
              settings = {
                blockchain: node.chainName,
                frequency: 'latest',
                nodeId: node.nodeId
              };
      
              response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/nodes/stats`,
                settings,
                config
              );
  
              node.shareValueCurrent = response.data.result[0].data[0].shareValueCurrent
              node.shareValueFuture = response.data.result[0].data[0].shareValueFuture
              
              node_list.push(node)
            }
          }
  
          setNodeData(node_list);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setOpenNodePage(false);
    fetchData();
  }, [blockchain, network]);
  
  if(open_node_page){
    return(<NodePage node_name={open_node_page} />)
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {!open_node_page && <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }}
        gap="20px"
        mb="20px"
        h="200px"
      >

        {/* <MiniStatistics growth='+23%' name='Publishers' value={latest_publishers ? latest_publishers[0].data.length : ''} /> */}
        <Card />
        <Card />
        <Card />
        {/* <MiniStatistics growth='+23%' name='Delegators' value={total_delegators ? total_delegators : ''} /> */}
        
      </SimpleGrid>}
      
      <SimpleGrid
        columns={{ base: 1, md: 1, xl: 1 }}
        gap="20px"
        mb="20px"
        h="700px"
      >
        {node_data ? (
          <NodeTable
            columnsData={columnsDataComplex}
            node_data={node_data}
          />
        ) : (
          <Loading />
        )}
        {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid> */}
      </SimpleGrid>
    </Box>
  );
}
