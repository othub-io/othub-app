import {
  Flex,
  Table,
  Select,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Avatar,
  Box,
  IconButton
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
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

export default function ColumnsTable(props) {
  const { blockchain, setBlockchain } = useContext(AccountContext);
  const { network, setNetwork } = useContext(AccountContext);
  const { columnsData, tableData, activity_data } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => activity_data, [activity_data]);
  const [node_profiles, setNodeProfiles] = useState(null);
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

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const tracColor = useColorModeValue("brand.900", "white");

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

        response = await axios.post(
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

  const checkLogo = (node_id, chain_id) => {
    if (!node_profiles) return null;

    const foundObject = node_profiles.find(
      (obj) => obj.node_id === node_id && obj.chain_id === chain_id
    );

    return foundObject ? foundObject.node_logo : null;
  };

  const checkProfile = (address) => {
    if (!user_profiles) return null;

    const foundObject = user_profiles.find(
      (obj) => obj.account === address
    );

    return foundObject ? foundObject : null;
  };

  return (
    data && (
      <Card
        direction="column"
        w="100%"
        px="0px"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        boxShadow="md"
      >
        <Flex px="25px" justify="space-between" mb="10px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            24H Network Activity
          </Text>
        </Flex>
        <Box overflowY="auto" maxHeight="100%" maxWidth="100vw">
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
                      {column.Header !== "UAL" &&
                        column.Header !== "NODE ID" &&
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

              let chain_id = row.cells
                .filter((cell) => cell.column.Header === "BLOCKCHAIN")
                .map((cell) => cell.value);

              let node_id = row.cells
                .filter((cell) => cell.column.Header === "NODE ID")
                .map((cell) => cell.value);

              let ual = row.cells
                .filter((cell) => cell.column.Header === "UAL")
                .map((cell) => cell.value);

              let event = row.cells
                .filter((cell) => cell.column.Header === "EVENT")
                .map((cell) => cell.value);

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
                            h="35px"
                            w="35px"
                            borderRadius="30px"
                            me="7px"
                          >
                            {cell.value && <Avatar
                              boxShadow="md"
                              backgroundColor="#FFFFFF"
                              src={cell.value === 2043 || cell.value === 20430 ? (
                                `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
                              ) : cell.value === 100 || cell.value === 10200 ? (
                                `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
                              ) : cell.value === 8453 || cell.value === 84532 ? (
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
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "SIGNER") {
                      let logoSrc;
                      let profile;
                      if(event === "AssetCreated"){
                        profile = checkProfile(cell.value);
                      }else{
                        logoSrc = checkLogo(node_id[0], chain_id[0]);
                      }
                      data = (
                        <Flex>
                          <Flex h="35px" borderRadius="5px">
                            {profile || logoSrc && <Avatar
                              boxShadow="md"
                              backgroundColor="#FFFFFF"
                              src={profile ? `${process.env.REACT_APP_API_HOST}/images?src=${profile.img}` : `${process.env.REACT_APP_API_HOST}/images?src=${logoSrc}`}
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
                            {profile ? profile.alias : cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "TOKEN ID") {
                      data = (
                        <a
                          target="_blank"
                          href={
                            chain_id[0] === 100 || chain_id[0] === 2043 || chain_id[0] === 8453
                              ? `https://dkg.origintrail.io/explore?ual=${ual[0]}`
                              : chain_id[0] === 10200 || chain_id[0] === 20430 || chain_id[0] === 84532
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
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "RESULT") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {`${Number(cell.value).toFixed(4)} TRAC`}
                        </Text>
                      );
                    } else if (cell.column.Header === "TRANSACTION") {
                      data = (
                        <a
                          target="_blank"
                          href={
                            chain_id[0] === 100
                              ? `https://gnosisscan.io/token/${cell.value}`
                              : chain_id[0] === 10200
                              ? `https://gnosis-chiado.blockscout.com/token/${cell.value}`
                              : chain_id[0] === 2043
                              ? `https://origintrail.subscan.io/token/${cell.value}`
                              : chain_id[0] === 20430
                              ? `https:/origintrail-testnet.subscan.io/token/${cell.value}`
                              : chain_id[0] === 8453
                              ? `https://basescan.org/tx/${cell.value}`
                              : chain_id[0] === 84532
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
          mt="4"
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
            mr="10%"
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
