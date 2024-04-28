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
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect } from "react";
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
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import axios from "axios";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [inputValue, setInputValue] = useState("");
  const [button, setButtonSelect] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [assetData, setAssetData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        let data = {
          network: "DKG Mainnet",
          frequency: "total"
        };
        let response = await axios.post(
          // `${process.env.REACT_APP_API_HOST}/pubs/stats`,
          `${process.env.REACT_APP_API_HOST}/pubs/stats`,
          data,
          config
        );

        setAssetData(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setAssetData("");
    setInputValue("");
    fetchData();
  }, []);

  return (assetData &&
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics growth='+23%' name='TVL' value='$56,127,394.34' />
        <MiniStatistics
          // startContent={
          //   <IconBox
          //     w='56px'
          //     h='56px'
          //     bg={boxBg}
          //     icon={
          //       <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
          //     }
          //   />
          // }
          name='TRAC Spent'
          value={formatNumberWithSpaces(assetData[0].data[0].totalTracSpent.toFixed(2))}
          growth='+45%'
        />
        <MiniStatistics
          // startContent={
          //   <IconBox
          //     w='56px'
          //     h='56px'
          //     bg={boxBg}
          //     icon={
          //       <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
          //     }
          //   />
          // }
          name='Total Assets'
          value={formatNumberWithSpaces(assetData[0].data[0].totalPubs)}
          growth='-100%'
        />
        <MiniStatistics growth='+23%' name='Nodes' value='242' />
        <MiniStatistics growth='+23%' name='Date Stored' value='367G' />
        <MiniStatistics growth='+23%' name='Blockchains Integrated' value='2' />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <DailyTraffic />
          <PieCard />
        </SimpleGrid>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
