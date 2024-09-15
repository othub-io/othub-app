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
  IconButton,
  Select
} from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { AccountContext } from "../../../../AccountContext";
import Card from "components/card/Card.js";
import axios from "axios";
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function AssetRecords(props) {
  const { columnsData, tableData, asset_records } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => asset_records, [asset_records]);
  const [user_profiles, setUserProfiles] = useState(null);
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

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const tracColor = useColorModeValue("brand.900", "white");
  const bgItem = useColorModeValue(
    { bg: "white", boxShadow: "0px 40px 58px -20px rgba(112, 144, 176, 0.12)" },
    { bg: "navy.700", boxShadow: "unset" }
  );

  useEffect(() => {
    async function fetchData() {
      try {
        let data = {};

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          data,
          config
        );

        setUserProfiles(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const checkProfile = (address) => {
    if (!user_profiles) return null;

    const foundObject = user_profiles.find(
      (obj) => obj.account === address
    );

    return foundObject ? foundObject : null;
  };

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
        <Box overflowY="auto" maxHeight="100%">
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
                      {column.render("Header") !== "UAL" && column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody {...getTableBodyProps()}>
            {page.map((row, aindex) => {
              prepareRow(row);
              let ual = row.cells
                .filter((cell) => cell.column.Header === "UAL")
                .map((cell) => cell.value);

              let chain_name = row.cells
                .filter((cell) => cell.column.Header === "BLOCKCHAIN")
                .map((cell) => cell.value);

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
                            h="35px"
                            w="35px"
                            borderRadius="30px"
                            me="7px"
                          >
                            {cell.value && <Avatar
                              boxShadow="md"
                              backgroundColor="#FFFFFF"
                              src={cell.value === "NeuroWeb Mainnet" || cell.value === "NeuroWeb Testnet" ? (
                                `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
                              ) : cell.value === "Gnosis Mainnet" || cell.value === "Chiado Testnet" ? (
                                `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
                              ) : cell.value === "Base Mainnet" || cell.value === "NeuroWeb Testnet" ? (
                                `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`
                              ) : (
                                ""
                              )}
                              w="35px"
                              h="35px"
                            />}
                            
                          </Flex>
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                            ml="5px"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "TIMESTAMP") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "TOKEN ID") {
                      data = (
                        <a
                          target="_blank"
                          href={
                            chain_name[0] === "Gnosis Mainnet" || chain_name[0] === "NeuroWeb Mainnet" || chain_name[0] === "Base Mainnet" 
                              ? `https://dkg.origintrail.io/explore?ual=${ual[0]}`
                              : chain_name[0] === "Chiado Testnet" || chain_name[0] === "NeuroWeb Testnet" || chain_name[0] === "Base Testnet"
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
                    } else if (cell.column.Header === "COST") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize='md'
                            fontWeight='600'>
                            {`${Number(cell.value).toFixed(2)}`}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "EPOCHS") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize='md'
                            fontWeight='600'>
                            {`${(cell.value)}`}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "OWNER") {
                      let profile = checkProfile(cell.value);

                      data = (
                        <Flex>
                          <Flex h="35px" borderRadius="5px">
                            {profile && <Avatar
                              boxShadow="md"
                              backgroundColor="#FFFFFF"
                              src={profile.img && `${process.env.REACT_APP_API_HOST}/images?src=${profile.img}`}
                              w="35px"
                              h="35px"
                            />}
                          </Flex>
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                            mt="auto"
                            mb="auto"
                            ml="10px"
                          >
                            {profile ? profile.alias : cell.value.slice(0, 15)}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "TRANSACTION") {
                      data = (
                        <a
                          target="_blank"
                          href={
                            chain_name[0] === "Gnosis Mainnet"
                              ? `https://gnosisscan.io/token/${cell.value}`
                              : chain_name[0] === "Chiado Testnet"
                              ? `https://gnosis-chiado.blockscout.com/token/${cell.value}`
                              : chain_name[0] === "NeuroWeb Mainnet"
                              ? `https://origintrail.subscan.io/token/${cell.value}`
                              : chain_name[0] === "NeuroWeb Testnet"
                              ? `https:/origintrail-testnet.subscan.io/token/${cell.value}`
                              : chain_name[0] === "Base Mainnet"
                              ? `https://basescan.org/tx/${cell.value}`
                              : chain_name[0] === "ChiBaseado Testnet"
                              ? `https://sepolia.basescan.org/tx/${cell.value}`
                              : ""
                          }
                          style={{ color: "#cccccc", textDecoration: "none" }}
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
      </Flex>
    </Card>
  );
}

export default AssetRecords;
