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
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import React, { useMemo, useContext } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { AccountContext } from "../../../../AccountContext";
import { MdInfoOutline } from "react-icons/md";

function PublisherRankings(props) {
  const { columnsData, tableData, rankedPublishers } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => rankedPublishers, [rankedPublishers]);
  const { open_asset_page, setOpenAssetPage } = useContext(AccountContext);
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
  let menuBg = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );

  return (
    <>
      <Flex
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
        minH="500px"
        overflow="auto"
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
          <Flex align="center">
            <Text color={textColor} fontSize="xl" fontWeight="600">
              Publisher Rankings
            </Text>
          </Flex>
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
                    if (cell.column.Header === "PUBLISHER") {
                      const publisher = cell.row.original;
                      const avatarSrc = publisher.img
                        ? publisher.img
                        : cell.value[1];
                      const publisherName = publisher.alias
                        ? publisher.alias
                        : `${cell.value.slice(0, 15)}`;
                      data = (
                        <Flex align="center">
                          <Avatar src={`${process.env.REACT_APP_API_HOST}/images?src=${avatarSrc}`} w="30px" h="30px" me="8px" boxShadow="md"/>
                          <Text
                            color={tracColor}
                            fontSize="md"
                            fontWeight="600"
                          >
                            {publisherName}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "ASSETS") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="md"
                            fontWeight="600"
                          >
                            {cell.value >= 1000000
                              ? (cell.value / 1000000).toFixed(0) + " M"
                              : cell.value >= 1000
                              ? (cell.value / 1000).toFixed(0) + " K"
                              : cell.value.toFixed(0)}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "TRAC SPENT") {
                      data = (
                        <Flex align="center">
                          <Text
                            color="green.500"
                            fontSize="md"
                            fontWeight="600"
                          >
                            {cell.value >= 1000000
                              ? (cell.value / 1000000).toFixed(2) + " M"
                              : cell.value >= 1000
                              ? (cell.value / 1000).toFixed(2) + " K"
                              : cell.value.toFixed(2)}
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
    </>
  );
}

export default PublisherRankings;
