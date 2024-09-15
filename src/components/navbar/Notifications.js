// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import AssetImage from "../../../src/assets/img/Knowledge-Asset.jpg";
import { MdNotificationsNone } from "react-icons/md";

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Notifications = ({ account, network }) => {
  const tracColor = useColorModeValue("brand.900", "white");
  const [notifications_info, setNotifInfo] = useState(null);
  let menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const textColorSecondary = "gray.400";
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.400");
  const navbarIcon = useColorModeValue("gray.400", "white");
  const [node_profiles, setNodeProfiles] = useState(null);
  const [users, setUsers] = useState(null);

  const config = {
    headers: {
      "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
      Authorization: localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let notifications_list = [];
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/txns/info`,
          {
            approver: localStorage.getItem("account"),
            progress: "PENDING",
          },
          config
        );

        notifications_list.push(...response.data.result);

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/info`,
          {
            network: network,
            owner: localStorage.getItem("account"),
          },
          config
        );

        for (const node of response.data.result[0].data) {
          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/delegators/activity`,
            {
              blockchain: node.chainName,
              nodeId: node.nodeId,
              limit: 5,
            },
            config
          );

          notifications_list.push(...response.data.result);
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        notifications_list = notifications_list
          .filter((notification) => {
            const date = new Date(
              notification.timestamp || notification.created_at
            );
            return date >= sevenDaysAgo;
          })
          .sort((a, b) => {
            const dateA = new Date(a.timestamp || a.created_at);
            const dateB = new Date(b.timestamp || b.created_at);
            return dateB - dateA; // Descending order
          });

        setNotifInfo(notifications_list);

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/profile`,
          {},
          config
        );

        setNodeProfiles(response.data.result);

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          {},
          config
        );

        setUsers(response.data.result);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    }

    fetchData();
  }, [account]);

  const checkLogo = (node_id, chain_id) => {
    if (!node_profiles) return null;

    const foundObject = node_profiles.find(
      (obj) => obj.node_id === node_id && obj.chain_id === chain_id
    );

    return foundObject ? foundObject.node_logo : null;
  };

  return (
    <Menu>
      <MenuButton p="0px" 
        ml={{ base: "10px", md: "10px" }}
        mr={{ base: "10px", md: "0px" }}
      >
        <Icon
          mt="6px"
          as={MdNotificationsNone}
          color={navbarIcon}
          w="25px"
          h="25px"
          me="10px"
        />
        {notifications_info && (
          <Box
            position="absolute"
            mt="-40px"
            bg={tracColor}
            borderRadius="10px"
            h="15px"
            w="15px"
            color="white"
          >
            <Text fontWeight="bold" mt="-5px" fontSize="sm">
              {notifications_info.length}
            </Text>
          </Box>
        )}
      </MenuButton>
      <MenuList
        boxShadow={shadow}
        p="20px"
        borderRadius="20px"
        bg={menuBg}
        border="none"
        mt="22px"
        me={{ base: "30px", md: "unset" }}
        minW={{ base: "unset", md: "400px", xl: "450px" }}
        maxW={{ base: "90%", md: "unset" }}
        ml="5%"
        h="500px"
        overflow="auto"
      >
        <Flex jusitfy="space-between" w="100%" mb="20px">
          <Text fontSize="md" fontWeight="600" color={textColor}>
            Notifications
          </Text>
        </Flex>
        <Flex flexDirection="column">
          {users && notifications_info ? (
            notifications_info.map((record, index) => {
              if (record.created_at) {
                const chain = record.blockchain;
                let chain_logo;
                if (chain === "otp:2043" || chain === "otp:20430") {
                  chain_logo = `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`;
                }

                if (chain === "gnosis:100" || chain === "gnosis:10200") {
                  chain_logo = `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`;
                }

                if (chain === "base:8453" || chain === "base:84532") {
                  chain_logo = `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`;
                }
                return (
                  <MenuItem
                    _hover={{ bg: "none", boxShadow:"md" }}
                    _focus={{ bg: "none", boxShadow:"md" }}
                    px="0"
                    borderRadius="8px"
                    mb="10px"
                    boxShadow="md"
                    h="70px"
                    pr="20px"
                    as={Link}  // Renders MenuItem as a link
                    href={`${process.env.REACT_APP_WEB_HOST}/my-othub/publish?txn_id=${record.txn_id}`}
                  >
                    <Flex w="80px">
                      <Image
                        src={chain_logo}
                        w="20px"
                        h="20px"
                        mb="auto"
                        ml={2}
                      ></Image>
                      <Image
                        src={AssetImage}
                        w="40px"
                        h="40px"
                        mr="20px"
                      ></Image>
                    </Flex>
                    <Box mt={{ base: "0px", md: "0px" }}>
                      <Text
                        color={tracColor}
                        fontSize={{ base: "12px", md: "md" }}
                        fontWeight="bold"
                        lineHeight={{ base: "15px", md: "unset" }}
                      >
                        {`Pending Asset for ${record.paranet_name ? record.paranet_name : record.app_name}`}
                      </Text>
                      <Text
                        fontWeight="500"
                        color={textColorSecondary}
                        fontSize={{ base: "10px", md: "sm" }}
                        me="4px"
                        lineHeight={{ base: "15px", md: "unset" }}
                      >
                        {`ID: ${record.txn_id}`}
                      </Text>
                    </Box>
                  </MenuItem>
                );
              }

              if (record.timestamp) {
                const logoSrc = checkLogo(record.nodeId, record.chainId);
                let pub_img;
                let delegator = record.delegator.substring(0, 15);
                const index = users.findIndex(
                  (user) => user.account === record.delegator
                );

                if (index >= 0) {
                  if (users[index].img) {
                    pub_img = users[index].img;
                  }

                  if (users[index].alias) {
                    delegator = users[index].alias;
                  }
                }

                return (
                  <MenuItem
                    _hover={{ bg: "none" }}
                    _focus={{ bg: "none" }}
                    px="0"
                    borderRadius="8px"
                    mb="10px"
                    boxShadow="md"
                    h="70px"
                    pointerEvents="none"
                  >
                    <Flex w="80px">
                      <Avatar
                        boxShadow="md"
                        backgroundColor="#FFFFFF"
                        src={
                          logoSrc
                            ? `${process.env.REACT_APP_API_HOST}/images?src=${logoSrc}`
                            : record.chainId === 2043 ||
                              record.chainId === 20430
                            ? `${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`
                            : record.chainId === 100 || record.chainId === 10200
                            ? `${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`
                            : record.chainId === 8453 ||
                              record.chainId === 84532
                            ? `${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`
                            : ""
                        }
                        w="40px"
                        h="40px"
                        mx="auto"
                      />
                    </Flex>
                    <Box mt={{ base: "10px", md: "0" }}>
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
                          />
                        ) : (
                          <></>
                        )}
                        <Text color={tracColor} fontSize="md" fontWeight="600">
                          {`${delegator} ${record.action}`}
                        </Text>
                      </Flex>
                      <Flex align="center">
                        <Text
                          fontWeight="500"
                          color={textColorSecondary}
                          fontSize="sm"
                          me="4px"
                        >
                          {`${
                            record.action === "Stake"
                              ? record.tracQuantity.toFixed(2)
                              : record.action === "Withdrawal"
                              ? record.sharesQuantity.toFixed(2)
                              : ""
                          } 
                          ${
                            record.action === "Stake"
                              ? "Trac"
                              : record.action === "Withdrawal"
                              ? record.tokenName
                              : ""
                          }`}
                        </Text>
                      </Flex>
                    </Box>
                  </MenuItem>
                );
              }
            })
          ) : (
            <Text>No Notifications</Text>
          )}
        </Flex>
      </MenuList>
    </Menu>
  );
};

export default Notifications;
