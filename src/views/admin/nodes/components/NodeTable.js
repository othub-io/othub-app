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
} from "views/admin/nodes/variables/nodeTableColumns";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

export default function NodeTable(props) {
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { columnsData, tableData, node_data, price } = props;
  const columns = useMemo(() => columnsDataComplex, [columnsDataComplex]);
  let data = useMemo(() => node_data, [node_data]);
  const {open_node_page, setOpenNodePage } = useContext(AccountContext);
  let [rankCounter, setRankCounter] = useState(1);

  let tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'nodeStake', // ID of the column to sort by
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
        if(node_name){
          setOpenNodePage(node_name);
        }else{
          
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const openNodePage = (node) => {
    setOpenNodePage(node);
  };

  const searchNode = (nod) => {
    let filteredData = node_data.filter(node => node.tokenName === nod);
    
    if(filteredData.length > 0){
      setOpenNodePage(nod);
    }
  };

  if(open_node_page){
    return(<NodePage node_name={open_node_page} price={price}/>)
  }

  return (
    data && !open_node_page && (
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex px="16px" justify="space-between" mb="10px" ml="auto" maxW='300px'>
        <Icon
            transition="0.2s linear"
            w="30px"
            h="30px"
            mr="5px"
            as={MdSearch}
            color={tracColor}
            _hover={{ cursor: "pointer" }}
            _active={{ borderColor: tracColor }}
            _focus={{ bg: "none" }}
            onClick={() => {
              const inputValue = document.getElementById("nodeInput").value;
              searchNode(inputValue);
            }}
          />
          <Input
          h="30px"
          focusBorderColor={tracColor}
          id="nodeInput"
          placeholder="Seach for a node..."
          >
          </Input>
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
                .filter((cell) => cell.column.Header === "BLOCKCHAIN")
                .map((cell) => cell.value);
              let ual = row.cells
                .filter((cell) => cell.column.Header === "UAL")
                .map((cell) => cell.value);

              let node_id = row.cells
                .filter((cell) => cell.column.Header === "NODEID")
                .map((cell) => cell.value);

              let currentRank = rankCounter++;

              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";

                    if (cell.column.Header === "BLOCKCHAIN") {
                      data = (
                        <Flex align="center">
                          <Flex
                            align="center"
                            justify="center"
                            h="29px"
                            w="29px"
                            borderRadius="30px"
                            me="7px"
                          >
                            {cell.value === 2043 || cell.value === 20430 ? (
                              <img
                                w="9px"
                                h="14px"
                                src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
                              />
                            ) : cell.value === 100 || cell.value === 10200 ? (
                              <img
                                w="9px"
                                h="14px"
                                src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
                              />
                            ) : (
                              ""
                            )}
                          </Flex>

                          <Text
                            color={textColor}
                            fontSize="md"
                            fontWeight="700"
                          >
                          {currentRank}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "TIMESTAMP") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "NODE TOKEN") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700" onClick={() => openNodePage(cell.value)} _hover={{ cursor: 'pointer' }} maxW='200px'>
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "OPERATOR") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "VALUE") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700"  maxW='150px'>
                          {`$${(cell.value * price).toFixed(2)} (${Number(cell.value).toFixed(3)} TRAC)`}
                        </Text>
                      );
                    } else if (cell.column.Header === "PROSPECTIVE VALUE") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700">
                          {`$${(cell.value * price).toFixed(2)} (${Number(cell.value).toFixed(3)} TRAC)`}
                        </Text>
                      );
                    } else if (cell.column.Header === "FEE") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700">
                          {`${cell.value}%`}
                        </Text>
                      );
                    } else if (cell.column.Header === "ASK") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "AGE") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700">
                          {`${cell.value} days`}
                        </Text>
                      );
                    } else if (cell.column.Header === "MARKETCAP") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700">
                          {`$${formatNumberWithSpaces((cell.value * price).toFixed(2))}`}
                        </Text>
                      );
                    } else if (cell.column.Header === "LAST 7 DAYS") {
                      data = (
                        <Text color={textColor} fontSize="md" fontWeight="700">
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
