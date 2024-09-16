import {
  Flex,
  Table,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Avatar,
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
import Menu from "components/menu/MainMenu";
import Loading from "components/effects/Loading.js";
// Assets
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

export default function ColumnsTable(props) {
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { columnsData, tableData, delegator_activity } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => delegator_activity, [delegator_activity]);
  const { open_edit_node, setOpenEditNode } = useContext(AccountContext);
  const [node_profiles, setNodeProfiles] = useState(null);
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

  useEffect(() => {
    async function fetchData() {
      try {
        let data = {};

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/profile`,
          data,
          config
        );

        setNodeProfiles(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [open_edit_node]);

  const checkProfile = (node_id, chain_id) => {
    if (!node_profiles) return null;

    const foundObject = node_profiles.find(
      (obj) => obj.node_id === node_id && obj.chain_id === chain_id
    );

    return foundObject ? foundObject : null;
  };

  return (
    data && (
      <Card
        direction="column"
        px={{ sm: "20px", lg: "0px" }}
        overflowX={{ sm: "scroll", lg: "scroll" }}
        boxShadow="md"
        h="400px"
        mt="20px"
      >
        <Flex px="25px" justify="space-between" mb="10px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Delegation Activity
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
                        {column.Header !== "NODE ID" &&
                          column.Header !== "BLOCKCHAIN" &&
                          column.Header !== "UAL" &&
                          column.render("Header")}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row);

                const chain_id = row.cells.find(
                  (cell) => cell.column.Header === "BLOCKCHAIN"
                )?.value;

                const node_id = row.cells.find(
                  (cell) => cell.column.Header === "NODE ID"
                )?.value;

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
                              <Avatar
                                boxShadow="md"
                                backgroundColor="#FFFFFF"
                                src={
                                  cell.value === 2043 || cell.value === 20430
                                    ? `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
                                    : cell.value === 100 || cell.value === 10200
                                    ? `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
                                    : cell.value === 8453 ||
                                      cell.value === 84532
                                    ? `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`
                                    : ""
                                }
                                w="35px"
                                h="35px"
                              />
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
                                : cell.value === 8453
                                ? "Base Mainnet"
                                : cell.value === 84532
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
                      } else if (cell.column.Header === "NODE") {
                        const node_profile = checkProfile(node_id, chain_id);
                        data = (
                          <Flex>
                            <Flex h="35px" borderRadius="5px">
                              {node_profile && node_profile.node_logo && (
                                <Avatar
                                  boxShadow="md"
                                  backgroundColor="#FFFFFF"
                                  src={`${process.env.REACT_APP_API_HOST}/images?src=${node_profile.node_logo}`}
                                  w="35px"
                                  h="35px"
                                />
                              )}
                            </Flex>
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                              mt="auto"
                              mb="auto"
                              ml="10px"
                            >
                              {cell.value}
                            </Text>
                          </Flex>
                        );
                      } else if (cell.column.Header === "ACTION") {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        );
                      } else if (cell.column.Header === "TRAC") {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value.toFixed(2)}
                          </Text>
                        );
                      } else if (cell.column.Header === "SHARES") {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value.toFixed(2)}
                          </Text>
                        );
                      } else if (cell.column.Header === "TRANSACTION") {
                        data = (
                          <a
                            target="_blank"
                            href={
                              chain_id === 100
                                ? `https://gnosisscan.io/tx/${cell.value}`
                                : chain_id === 10200
                                ? `https://gnosis-chiado.blockscout.com/tx/${cell.value}`
                                : chain_id === 2043
                                ? `https://origintrail.subscan.io/tx/${cell.value}`
                                : chain_id === 20430
                                ? `https:/origintrail-testnet.subscan.io/tx/${cell.value}`
                                : ""
                            }
                            style={{ color: "#cccccc", textDecoration: "none" }}
                            rel="noopener noreferrer"
                          >
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell.value.substring(0, 20) +
                                "..." +
                                cell.value.slice(-20)}
                            </Text>
                          </a>
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
      </Card>
    )
  );
}
