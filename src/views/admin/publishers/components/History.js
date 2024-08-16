import {
  Avatar,
  Box,
  Button,
  Flex,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo, useContext } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { AccountContext } from "../../../../AccountContext";
import Card from "components/card/Card.js";
function AssetRecords(props) {
  const { columnsData, tableData, asset_records } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => asset_records, [asset_records]);
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const tracColor = useColorModeValue("brand.900", "white");
  const bgItem = useColorModeValue(
    { bg: "white", boxShadow: "0px 40px 58px -20px rgba(112, 144, 176, 0.12)" },
    { bg: "navy.700", boxShadow: "unset" }
  );

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} overflow="auto" overflowX="auto" boxShadow="md" h="800px">
      <Flex
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        minH="500px"
      >
        <Flex
          align={{ sm: "flex-start", lg: "center" }}
          justify="space-between"
          w="100%"
          px="22px"
          pb="20px"
          mb="10px"
          boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
        >
          <Text color={textColor} fontSize="22px" fontWeight="600">
            History
          </Text>
        </Flex>
        <Table {...getTableProps()} variant="simple" color="gray.500">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor="transparent"
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody {...getTableBodyProps()}>
            {page.map((row, aindex) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={aindex} _hover={bgItem}>
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
                            {cell.value === "NeuroWeb Mainnet" || cell.value === "NeuroWeb Testnet" ? (
                              <img
                                w="9px"
                                h="14px"
                                src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
                              />
                            ) : cell.value === "Gnosis Mainnet" || cell.value === "Gnosis Testnet" ? (
                              <img
                                w="9px"
                                h="14px"
                                src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
                              />
                            ) : cell.value === "Base Mainnet" || cell.value === "Base Testnet" ? (
                              <img
                                w="9px"
                                h="14px"
                                src={`${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`}
                              />
                            ) : (
                              ""
                            )}
                          </Flex>

                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value === 2043
                              ? "NeuroWeb Mainnet"
                              : cell.value === 20430
                              ? "NeuroWeb Testnet"
                              : cell.value === 100
                              ? "Gnosis Mainnet"
                              : cell.value === 10200
                              ? "Chiado Testnet"
                              : null}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "TIMESTAMP") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize='md'
                            fontWeight='600'>
                            {/* {checkAlias(cell.value)} */}
                            {`${(cell.value)}`}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "UAL") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize='md'
                            fontWeight='600'>
                            {/* {checkAlias(cell.value)} */}
                            {`${(cell.value)}`}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "TRANSACTION") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize='md'
                            fontWeight='600'>
                            {/* {checkAlias(cell.value)} */}
                            {`${(cell.value)}`}
                          </Text>
                        </Flex>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
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
      </Flex>
    </Card>
  );
}

export default AssetRecords;
