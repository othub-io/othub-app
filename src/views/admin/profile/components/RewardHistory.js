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
  const { columnsData, tableData, daily_activity } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => daily_activity, [daily_activity]);

  const tableInstance = useTable(
    {
      columns,
      data,
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
    initialState,
  } = tableInstance;
  initialState.pageSize = 500;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

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
        boxShadow="md"
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
                      {column.Header !== 'UAL' && column.render("Header")}
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
                .filter((cell) => cell.column.Header === "TOKEN")
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
                            h="29px"
                            w="29px"
                            borderRadius="30px"
                            me="7px"
                          >
                            {cell.value === "otp:2043" || cell.value === "otp:20430" ? (
                              <img
                                w="9px"
                                h="14px"
                                src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
                              />
                            ) : cell.value === "gnosis:100" || cell.value === "gnosis:10200" ? (
                              <img
                                w="9px"
                                h="14px"
                                src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
                              />
                            ) : cell.value === "base:8453" || cell.value === "base:84532" ? (
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
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "PROGRESS") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "APPROVER") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value ? `${cell.value.substring(0,15)}...` : "-"}
                        </Text>
                      );
                    } else if (cell.column.Header === "RECEIVER") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value ? `${cell.value.substring(0,15)}...` : "-"}
                        </Text>
                      );
                    } else if (cell.column.Header === "REQUEST") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "TOKEN" && cell.value) {
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
                            {cell.value.substring(cell.value.lastIndexOf('/') + 1)}
                          </Text>
                        </a>
                      );
                    } else if (cell.column.Header === "EPOCHS") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value ? cell.value : "-"}
                        </Text>
                      );
                    } else if (cell.column.Header === "TRAC FEE") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {`${Number(cell.value).toFixed(2)} TRAC`}
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
      </Card>
    )
  );
}
