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
    Input
  } from "@chakra-ui/react";
  import { AccountContext } from "../../../../AccountContext";
  import axios from "axios";
  import React, { useState, useEffect, useContext, useMemo } from "react";
  import {
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable,
  } from "react-table";
  
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
    MdSearch
  } from "react-icons/md";
  
  // Custom components
  import Card from "components/card/Card";
  import Menu from "components/menu/MainMenu";
  import Loading from "components/effects/Loading.js";
  // Assets
  import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
  import NodePage from "views/admin/nodes/components/NodePage";
  import {
    columnsDataCheck,
    columnsDataComplex,
  } from "views/admin/nodes/variables/delegatorTableColumns";
  const config = {
    headers: {
      "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    },
  };
  
  export default function AssetHistory(props) {
    const { blockchain, setBlockchain } = useContext(AccountContext);
    const { network, setNetwork } = useContext(AccountContext);
    const { columnsData, tableData, asset_history } = props;
    const columns = useMemo(() => columnsDataComplex, [columnsDataComplex]);
    let data = useMemo(() => asset_history, [asset_history]);
    const {open_node_page, setOpenNodePage } = useContext(AccountContext);
    const [price, setPrice] = useState("");
    let [rankCounter, setRankCounter] = useState(1);
  
    let tableInstance = useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [
            {
              id: 'shares', // ID of the column to sort by
              desc: true, // Sort in descending order to display the highest number first
            }
          ],
          pageSize: 500, // Set the desired page size
        }
      },
      useGlobalFilter,
      useSortBy,
      usePagination
    );
  
    let {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      initialState,
    } = tableInstance;
    initialState.pageSize = 500;
  
    const tracColor = useColorModeValue("brand.900", "white");
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  
    let explorer_url = "https://dkg.origintrail.io";
  
    if (network === "DKG Testnet") {
      explorer_url = "https://dkg-testnet.origintrail.io";
    }
  
    const queryParameters = new URLSearchParams(window.location.search);
    const node_name = queryParameters.get("node");
  
    function formatNumberWithSpaces(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  
    useEffect(() => {
      async function fetchData() {
        try {
         
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      fetchData();
    }, []);
  
    return (
      data && (
        <Card
          direction="column"
          w="100%"
          px="0px"
          overflowX={{ sm: "scroll", lg: "hidden" }}
        >
          <Flex px="25px" justify="space-between" mb="10px" align="center">
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Asset History
            </Text>
          </Flex>
          <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
                    >
                      <Flex
                        justify="space-between"
                        align="center"
                        fontSize={{ sm: "10px", lg: "12px" }}
                        color="gray.400"
                      >
                        {column.Header !== 'UAL' && column.Header !== 'BLOCKCHAIN' && column.render("Header")}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);

                return (
                  <Tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => {
                      let data = "";
  
                     if (cell.column.Header === "TOKEN ID") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="700" maxW="30px">
                            {cell.value}
                          </Text>
                        );
                      }
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          maxH="30px !important"
                          py="8px"
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          {data}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Card>
      )
    );
  }
  