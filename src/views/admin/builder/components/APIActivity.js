import {
  Flex,
  Table,
  Avatar,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  IconButton,
  Select,
  Box,
} from "@chakra-ui/react";
import { AccountContext } from "../../../../AccountContext";
import React, { useContext, useMemo } from "react";
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

export default function ColumnsTable(props) {
  const { network, setNetwork } = useContext(AccountContext);
  const { columnsData, tableData, txnInfo, users } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => txnInfo, [txnInfo]);

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
  const tracColor = useColorModeValue("brand.900", "white");

  let explorer_url = "https://dkg.origintrail.io";

  if (network === "DKG Testnet") {
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  return (
    data && (
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        position="relative"
        h="100%"
      >
        <Flex px="25px" justify="space-between" mb="10px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            API Activity
          </Text>
        </Flex>

        {/* Table container for scrolling */}
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
                        {column.Header !== "UAL" && column.render("Header")}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);

                let ual;
                let chain_id = row.cells
                  .filter((cell) => cell.column.Header === "BLOCKCHAIN")
                  .map((cell) => cell.value);
                ual = row.cells
                  .filter((cell) => cell.column.Header === "TOKEN ID")
                  .map((cell) => cell.value);

                  console.log(ual)
                if(ual[0]){
                  const segments = ual[0].split(":");
                  const argsString =
                    segments.length === 3
                      ? segments[2]
                      : segments[2] + segments[3];
                  const args = argsString.split("/");

                  ual = args[2]
                }

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
                              {cell.value === "otp:2043" ||
                              cell.value === "otp:20430" ? (
                                <img
                                  w="9px"
                                  h="14px"
                                  src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
                                />
                              ) : cell.value === "gnosis:100" ||
                                cell.value === "gnosis:10200" ? (
                                <img
                                  w="9px"
                                  h="14px"
                                  src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
                                />
                              ) : cell.value === "base:8453" ||
                                cell.value === "base:84532" ? (
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
                              {cell.value === "otp:2043"
                                ? "NeuroWeb Mainnet"
                                : cell.value === "otp:20430"
                                ? "NeuroWeb Testnet"
                                : cell.value === "gnosis:100"
                                ? "Gnosis Mainnet"
                                : cell.value === "gnosis:10200"
                                ? "Chiado Testnet"
                                : cell.value === "base:8453"
                                ? "Base Mainnet"
                                : cell.value === "base:84532"
                                ? "Base Testnet"
                                : null}
                            </Text>
                          </Flex>
                        );
                      } else if (cell.column.Header === "TIMESTAMP") {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        );
                      } else if (cell.column.Header === "PROGRESS") {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        );
                      } else if (cell.column.Header === "APPROVER") {
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
                              {pub_alias
                                ? pub_alias
                                : cell.value
                                ? `${cell.value.substring(0, 15)}...`
                                : "-"}
                            </Text>
                          </Flex>
                        );
                      } else if (cell.column.Header === "RECEIVER") {
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
                              {pub_alias
                                ? pub_alias
                                : cell.value
                                ? `${cell.value.substring(0, 15)}...`
                                : "-"}
                            </Text>
                          </Flex>
                        );
                      } else if (cell.column.Header === "REQUEST") {
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
                              chain_id[0] === "otp:2043" ||
                              chain_id[0] === "otp:20430" ||
                              chain_id[0] === "gnosis:100" ||
                              chain_id[0] === "gnosis:10200" ||
                              chain_id[0] === "base:8453" ||
                              chain_id[0] === "base:84532"
                                ? `${explorer_url}/explore?ual=${cell.value}`
                                : explorer_url
                            }
                            rel="noopener noreferrer"
                          >
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {ual ? ual : "-"}
                            </Text>
                          </a>
                        );
                      } else {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        );
                      }
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          borderColor={borderColor}
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
        </Box>

        {/* Fixed Pagination Controls */}
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
      </Card>
    )
  );
}
