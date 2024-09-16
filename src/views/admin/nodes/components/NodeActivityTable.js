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
  IconButton,
  Select,
  Box
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

// Custom components
import Card from "components/card/Card";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

export default function NodeActivityTable(props) {
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { columnsData, tableData, activity_data } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => activity_data, [activity_data]);
  const tracColor = useColorModeValue("brand.900", "white");

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 }, // Default page size
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  let explorer_url = "https://dkg.origintrail.io";

  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  return (
    data && (
      <>
        <Flex px="25px" justify="space-between" mb="10px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Network Activity
          </Text>
        </Flex>
        <Box overflowY="auto" maxHeight="100%">
          <Table
            {...getTableProps()}
            variant="simple"
            color="gray.500"
            mb="24px"
          >
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <>
                      {column.Header !== "BLOCKCHAIN" &&
                        column.Header !== "SIGNER" &&
                        column.Header !== "UAL" && (
                          <Th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
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
                              {column.render("Header")}
                            </Flex>
                          </Th>
                        )}
                    </>
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

                return (
                  <Tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => {
                      let data = "";

                      if (cell.column.Header === "TIMESTAMP") {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        );
                      } else if (cell.column.Header === "TOKEN ID") {
                        data = (
                          <a
                            target="_blank"
                            href={
                              chain_id[0] === 100 || chain_id[0] === 2043
                                ? `https://dkg.origintrail.io/explore?ual=${ual[0]}`
                                : chain_id[0] === 10200 || chain_id[0] === 20430
                                ? `https://dkg-testnet.origintrail.io/explore?ual=${ual[0]}`
                                : ""
                            }
                            style={{ color: "#cccccc", textDecoration: "none" }}
                          >
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell.value}
                            </Text>
                          </a>
                        );
                      } else if (cell.column.Header === "EVENT") {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        );
                      } else if (cell.column.Header === "RESULT") {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {`${Number(cell.value).toFixed(4)} TRAC`}
                          </Text>
                        );
                      } else if (cell.column.Header === "TRANSACTION") {
                        data = (
                          <a
                            target="_blank"
                            href={
                              chain_id[0] === 100
                                ? `https://gnosisscan.io/tx/${cell.value}`
                                : chain_id[0] === 10200
                                ? `https://gnosis-chiado.blockscout.com/tx/${cell.value}`
                                : chain_id[0] === 2043
                                ? `https://origintrail.subscan.io/tx/${cell.value}`
                                : chain_id[0] === 20430
                                ? `https:/origintrail-testnet.subscan.io/tx/${cell.value}`
                                : ""
                            }
                            style={{ color: "#cccccc", textDecoration: "none" }}
                          >
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell.value.substring(0, 10) +
                                "..." +
                                cell.value.slice(-10)}
                            </Text>
                          </a>
                        );
                      }
                      return (
                        <>
                          {data && (
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
                          )}
                        </>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
        <Flex
          justify="space-between"
          align="center"
          mt="8"
          px="4"
          w="90%"
          mr="auto"
          ml="auto"
          position="sticky"
          bottom="0"
          bg="white" // Use a solid background color to ensure it stands out
          zIndex="10" // Ensure it is on top of other content
        >
          <IconButton
            aria-label="First page"
            onClick={() => gotoPage(0)}
            isDisabled={!canPreviousPage}
            icon={<FaAngleDoubleLeft />}
            bg={tracColor}
            color="white"
            _hover={{ bg: tracColor }}
            _active={{ bg: tracColor }}
          />
          <IconButton
            aria-label="Previous page"
            onClick={() => previousPage()}
            isDisabled={!canPreviousPage}
            icon={<FaAngleLeft />}
            bg={tracColor}
            color="white"
            _hover={{ bg: tracColor }}
            _active={{ bg: tracColor }}
          />
          <Text>
            Page {pageIndex + 1} of {pageOptions.length}
          </Text>
          <IconButton
            aria-label="Next page"
            onClick={() => nextPage()}
            isDisabled={!canNextPage}
            icon={<FaAngleRight />}
            bg={tracColor}
            color="white"
            _hover={{ bg: tracColor }}
            _active={{ bg: tracColor }}
          />
          <IconButton
            aria-label="Last page"
            onClick={() => gotoPage(pageCount - 1)}
            isDisabled={!canNextPage}
            icon={<FaAngleDoubleRight />}
            bg={tracColor}
            color="white"
            _hover={{ bg: tracColor }}
            _active={{ bg: tracColor }}
          />
          <Select
            w="75px"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </Flex>
      </>
    )
  );
}
