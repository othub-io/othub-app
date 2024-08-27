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
    Avatar
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
  
  export default function DelegatorTable(props) {
    const { blockchain, setBlockchain } = useContext(AccountContext);
    const { network, setNetwork } = useContext(AccountContext);
    const { columnsData, tableData, delegator_data } = props;
    const [users, setUsers] = useState(null);
    const columns = useMemo(() => columnsDataComplex, [columnsDataComplex]);
    let data = useMemo(() => delegator_data, [delegator_data]);
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
            let response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/user/info`,
              { },
              {
                headers: {
                  "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
                },
              }
            );
    
            setUsers(response.data.result)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      fetchData();
    }, []);
  
    return (
      data && users && (
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
              Delegators
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

                let chain_id = row.cells
                .filter((cell) => cell.column.Header === "RANK")
                .map((cell) => cell.value);

                let currentRank = rankCounter++;

                return (
                  <Tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => {
                      let data = "";
  
                     if (cell.column.Header === "RANK") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="700" maxW="30px">
                            {currentRank}
                          </Text>
                        );
                      } else if (cell.column.Header === "DELEGATOR") {
                        let pub_img;
                      let pub_alias;
                      const index = users.findIndex(
                        (user) => user.account === cell.value
                      );

                      if (index >= 0) {
                        if (users[index].img) {
                          pub_img = users[index].img;
                        }

                        if (users[index].alias) {
                          pub_alias = users[index].alias;
                        }
                      }

                      data = (
                        <Flex align="center">
                          {pub_img ? (
                            <Avatar
                              src={
                                pub_img
                                  ? `${process.env.REACT_APP_API_HOST}/images?src=${pub_img}`
                                  : null
                              }
                              w="30px"
                              h="30px"
                              me="8px"
                            />
                          ) : (
                            <></>
                          )}
                          <Text
                            color={textColor}
                            fontSize="md"
                            fontWeight="600"
                          >
                            {/* {checkAlias(cell.value)} */}
                            {pub_alias
                              ? pub_alias
                              : cell.value
                              ? `${cell.value.substring(0, 15)}`
                              : "-"}
                          </Text>
                        </Flex>
                      );
                      } else if (cell.column.Header === "SHARES") {
                        data = (
                          <Text color={textColor} fontSize="sm" fontWeight="700">
                            {cell.value.toFixed(2)}
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
  