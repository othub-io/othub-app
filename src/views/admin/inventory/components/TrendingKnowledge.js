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

function TrendingKnowledge(props) {
  const { columnsData, tableData, trending_assets } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => trending_assets, [trending_assets]);
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
  
  return (
    <>
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
          <Text color={textColor} fontSize="xl" fontWeight="600">
            Trending Knowledge
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
                    if (cell.column.Header === "PUBLISHER") {
                      data = (
                        <Flex align="center">
                          <Avatar
                            src={cell.value[1]}
                            w='30px'
                            h='30px'
                            me='8px'
                          />
                          <Text
                            color={textColor}
                            fontSize='md'
                            fontWeight='600'>
                            {/* {checkAlias(cell.value)} */}
                            {`${(cell.value).slice(0,15)}...`}
                          </Text>
                        </Flex>
                      );
                    }else if (cell.column.Header === "TOKEN") {
                      data = (
                        <Text
                          color={tracColor}
                          fontSize='md'
                          fontWeight='600'
                          onClick={() => setOpenAssetPage(trending_assets[aindex])}
                          _hover={{ cursor: "pointer" }}
                          >
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "SENTIMENT" && JSON.parse(cell.value)[0] - JSON.parse(cell.value)[1] > 0) {
                      data = (
                        <Text
                        color="green.500"
                        fontSize='md'
                        fontWeight='500'
                        >
                          {`+${JSON.parse(cell.value)[0] - JSON.parse(cell.value)[1]}`}
                      </Text>
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

export default TrendingKnowledge;
