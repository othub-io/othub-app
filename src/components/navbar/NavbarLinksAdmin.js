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
} from "@chakra-ui/react";
// Custom Components
import { ItemContent } from "components/menu/ItemContent";
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import { SidebarResponsive } from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import React, { useState, useContext, useEffect } from "react";
// Assets
import navImage from "assets/img/layout/Navbar.png";
import { MdNotificationsNone, MdInfoOutline } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import routes from "routes.js";
import { ThemeEditor } from "./ThemeEditor";
import MetamaskButton from "./MetamaskButton";
import axios from "axios";
import { AccountContext } from "../../AccountContext";
export default function HeaderLinks(props) {
  const { secondary } = props;
  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.400");
  const tracColor = useColorModeValue("brand.900", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const ethBg = useColorModeValue("secondaryGray.300", "navy.900");
  const ethBox = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const borderButton = useColorModeValue("secondaryGray.500", "whiteAlpha.200");
  const [user_info, setUserInfo] = useState(null);
  const {
    balance,
    setBalance,
    token,
    setToken,
    account,
    setAccount,
    connected_blockchain,
    setConnectedBlockchain,
    edit_profile,
    saved,
    setSaved,
  } = useContext(AccountContext);
  const config = {
    headers: {
      "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
    },
  };

  const blockchain = localStorage.getItem("blockchain");
  let url;
  let aurl;
  let burl;

  function formatNumberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          {},
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setUserInfo(response.data.result[0]);

        setBalance(null);
        if (blockchain === "NeuroWeb Testnet") {
          url =
            "https://neuroweb-testnet.api.subscan.io/api/scan/account/tokens";
        }

        if (blockchain === "NeuroWeb Mainnet") {
          url = "https://neuroweb.api.subscan.io/api/scan/account/tokens";
        }

        if (blockchain === "Gnosis Mainnet") {
          aurl = `https://gnosis.blockscout.com/api/v2/addresses/${localStorage.getItem(
            "account"
          )}/token-balances`;
          burl = `https://gnosis.blockscout.com/api/v2/addresses/${localStorage.getItem(
            "account"
          )}`;
        }

        if (blockchain === "Chiado Testnet") {
          aurl = `https://gnosis-chiado.blockscout.com/api/v2/addresses/${localStorage.getItem(
            "account"
          )}/token-balances`;
          burl = `https://gnosis-chiado.blockscout.com/api/v2/addresses/${localStorage.getItem(
            "account"
          )}`;
        }

        if (blockchain === "Base Mainnet") {
          url = `https://api.basescan.org/api`;
        }

        if (blockchain === "Base Testnet") {
          url = `https://api-sepolia.basescan.org/api`;
        }

		if (
			blockchain === "Base Testnet" ||
			blockchain === "Base Mainnet"
		  ) {
			let eth_balance = await axios
			  .get(`${url}?module=account&action=balance&address=${localStorage.getItem("account")}&tag=latest&apikey=${process.env.REACT_APP_BASESCAN_KEY}`)
			  .then(function (response) {
				// Handle the successful response here
				return response.data;
			  })
			  .catch(function (error) {
				// Handle errors here
				console.error(error);
			  });
  
			let token_balance = await axios
			  .get(`${url}?module=account&action=tokenbalance&contractaddress=${blockchain === "Base Testnet" ? "0x9b17032749aa066a2DeA40b746AA6aa09CdE67d9" : "0xA81a52B4dda010896cDd386C7fBdc5CDc835ba23"}&address=${localStorage.getItem("account")}&tag=latest&apikey=${process.env.REACT_APP_BASESCAN_KEY}`)
			  .then(function (response) {
				// Handle the successful response here
				return response.data;
			  })
			  .catch(function (error) {
				// Handle errors here
				console.error(error);
			  });
  
			let account_balance = {
			  eth: eth_balance.result,
			  trac: token_balance.result
			};
  
			setBalance(account_balance);
		  }

        if (
          blockchain === "NeuroWeb Testnet" ||
          blockchain === "NeuroWeb Mainnet"
        ) {
          const data = {
            address: localStorage.getItem("account"),
          };

          let account_balance = await axios
            .post(url, data, {
              headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.REACT_APP_SUBSCAN_KEY,
              },
            })
            .then(function (response) {
              // Handle the successful response here
              return response.data;
            })
            .catch(function (error) {
              // Handle errors here
              console.error(error);
            });

          setBalance(account_balance.data);
        }

        if (
          blockchain === "Chiado Testnet" ||
          blockchain === "Gnosis Mainnet"
        ) {
          let xdai_balance = await axios
            .get(burl)
            .then(function (response) {
              // Handle the successful response here
              return response.data;
            })
            .catch(function (error) {
              // Handle errors here
              console.error(error);
            });

          let token_balance = await axios
            .get(aurl)
            .then(function (response) {
              // Handle the successful response here
              return response.data;
            })
            .catch(function (error) {
              // Handle errors here
              console.error(error);
            });

          let trac_balance;
          for (const tkn of token_balance) {
            if (tkn.token.symbol === "TRAC" || tkn.token.symbol === "tgcTRAC") {
              trac_balance = tkn.value;
            }
          }

          let account_balance = {
            xdai: xdai_balance.coin_balance ? xdai_balance.coin_balance : 0,
            trac: trac_balance ? trac_balance : 0,
          };

          setBalance(account_balance);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setSaved(false);
    fetchData();
  }, [account, connected_blockchain, saved]);

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap="unset"
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <Button
        variant="darkBrand"
        color="white"
        fontSize="md"
        fontWeight="500"
        borderRadius="70px"
        marginRight="20px"
        px="24px"
        py="5px"
      >
        <MetamaskButton />
      </Button>
      {localStorage.getItem("account") && (
        <Flex
          bg={ethBg}
          display="flex"
          borderRadius="30px"
          ms="auto"
          p="6px"
          align="center"
          me="6px"
        >
          <Flex
            align="center"
            justify="center"
            bg={ethBox}
            h="29px"
            w="29px"
            borderRadius="30px"
            me="7px"
          >
            <img
              w="9px"
              h="14px"
              src={`${process.env.REACT_APP_API_HOST}/images?src=origintrail_logo_alt-dark_purple.svg`}
            />
          </Flex>
          <Text
            w="max-content"
            color={tracColor}
            fontSize="md"
            fontWeight="700"
            me="6px"
          >
            {(blockchain === "NeuroWeb Mainnet" ||
              blockchain === "NeuroWeb Testnet") &&
            balance &&
            balance.ERC20 &&
            Number(balance.ERC20[0].balance)
              ? (
                  (balance.ERC20[0].balance / 1000000000000000000).toFixed(4)
                )
              : (blockchain === "Gnosis Mainnet" ||
                  blockchain === "Chiado Testnet" || 
				  blockchain === "Base Mainnet" || 
				  blockchain === "Base Testnet") &&
                balance &&
                balance.trac
              ? (
                  (balance.trac / 1000000000000000000).toFixed(4)
                )
              : 0}
            <Text
              as="span"
              display={{ base: "none", md: "unset" }}
              fontSize="sm"
            >
              {" "}
              TRAC
            </Text>
          </Text>
        </Flex>
      )}
      {localStorage.getItem("account") && (
        <Flex
          bg={ethBg}
          display="flex"
          borderRadius="30px"
          ms="auto"
          p="6px"
          align="center"
          me="6px"
        >
          {blockchain && (
            <Flex
              align="center"
              justify="center"
              bg={ethBox}
              h="29px"
              w="29px"
              borderRadius="30px"
              me="7px"
            >
              {blockchain === "NeuroWeb Mainnet" ||
              blockchain === "NeuroWeb Testnet" ? (
                <img
                  w="9px"
                  h="14px"
                  src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
                />
              ) : blockchain === "Gnosis Mainnet" ||
                blockchain === "Chiado Testnet" ? (
                <img
                  w="9px"
                  h="14px"
                  src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
                />
              ) : blockchain === "Base Mainnet" ||
			  blockchain === "Base Testnet" ? (
			  <img
				w="9px"
				h="14px"
				src={`${process.env.REACT_APP_API_HOST}/images?src=base_logo.svg`}
			  />
			) : (
                "?"
              )}
            </Flex>
          )}
          <Text
            w="max-content"
            color={
              localStorage.getItem("blockchain") === "NeuroWeb Mainnet" ||
              localStorage.getItem("blockchain") === "NeuroWeb Testnet"
                ? "#fb5deb"
                : blockchain === "Gnosis Mainnet" ||
                  blockchain === "Chiado Testnet"
                ? "#133629"
				: blockchain === "Base Mainnet" ||
                  blockchain === "Base Testnet"
                ? "#0052FF"
                : ""
            }
            fontSize="md"
            fontWeight="700"
            me="6px"
          >
            {(blockchain === "NeuroWeb Mainnet" ||
              blockchain === "NeuroWeb Testnet") &&
            balance &&
            balance.native
              ? (
                  (balance.native[0].balance / 1000000000000).toFixed(4)
                )
              : (blockchain === "Gnosis Mainnet" ||
                  blockchain === "Chiado Testnet") &&
                balance
              ? (
                  (balance.xdai / 1000000000000000000).toFixed(4)
                ): (blockchain === "Base Mainnet" ||
				blockchain === "Base Testnet") &&
			  balance
			? (
				(balance.eth / 1000000000000000000).toFixed(4)
			  )
              : 0}
            <Text
              as="span"
              display={{ base: "none", md: "unset" }}
              fontSize="sm"
            >
              {" "}
              {blockchain === "NeuroWeb Mainnet" ||
              blockchain === "NeuroWeb Testnet"
                ? "Neuro"
                : blockchain === "Gnosis Mainnet" ||
                  blockchain === "Chiado Testnet"
                ? "xDai"
				: blockchain === "Base Mainnet" ||
                  blockchain === "Base Testnet"
                ? "Eth"
                : ""}
            </Text>
          </Text>
        </Flex>
      )}
      <SidebarResponsive routes={routes} />
      {localStorage.getItem("account") && (
        <Menu>
          <MenuButton p="0px">
            <Icon
              mt="6px"
              as={MdNotificationsNone}
              color={navbarIcon}
              w="18px"
              h="18px"
              me="10px"
            />
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
            maxW={{ base: "360px", md: "unset" }}
          >
            <Flex jusitfy="space-between" w="100%" mb="20px">
              <Text fontSize="md" fontWeight="600" color={textColor}>
                Notifications
              </Text>
              <Text
                fontSize="sm"
                fontWeight="500"
                color={textColorBrand}
                ms="auto"
                cursor="pointer"
              >
                Mark all read
              </Text>
            </Flex>
            <Flex flexDirection="column">
              <MenuItem
                _hover={{ bg: "none" }}
                _focus={{ bg: "none" }}
                px="0"
                borderRadius="8px"
                mb="10px"
              >
                <ItemContent info="Horizon UI Dashboard PRO" aName="Alicia" />
              </MenuItem>
              <MenuItem
                _hover={{ bg: "none" }}
                _focus={{ bg: "none" }}
                px="0"
                borderRadius="8px"
                mb="10px"
              >
                <ItemContent
                  info="Horizon Design System Free"
                  aName="Josh Henry"
                />
              </MenuItem>
            </Flex>
          </MenuList>
        </Menu>
      )}
      {/* <ThemeEditor navbarIcon={navbarIcon} /> */}
      {localStorage.getItem("account") && (
        <Menu>
          <MenuButton p="0px">
            <Avatar
              _hover={{ cursor: "pointer" }}
              color="white"
              name={user_info && user_info.alias ? user_info.alias : ""}
              size="sm"
              w="40px"
              h="40px"
              boxShadow="md"
              src={
                user_info && user_info.img ? (
                  `${process.env.REACT_APP_API_HOST}/images?src=${user_info.img}`
                ) : (
                  <svg
                    viewBox="0 0 128 128"
                    class="chakra-avatar__svg css-16ite8i"
                    role="img"
                    aria-label=" avatar"
                  >
                    <path
                      fill="currentColor"
                      d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.77 24.9156,101.7756 C31.574,88.622 45.9358,79 64.158,79 C82.3796,79 96.7418,88.622 103,102.1388 L103,102.1388 Z M64,10 C80.5685,10 94,23.4315 94,40 C94,56.5685 80.5685,70 64,70 C47.4315,70 34,56.5685 34,40 C34,23.4315 47.4315,10 64,10 Z"
                    ></path>
                  </svg>
                )
              }
            />
          </MenuButton>
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                {account && `${account.slice(0, 10)}...${account.slice(-10)}`}
              </Text>
            </Flex>
            <Flex flexDirection="column" p="10px">
              <MenuItem
                _hover={{ bg: "none" }}
                _focus={{ bg: "none" }}
                borderRadius="8px"
                px="14px"
              >
                <Text fontSize="sm">Profile Settings</Text>
              </MenuItem>
              <MenuItem
                _hover={{ bg: "none" }}
                _focus={{ bg: "none" }}
                borderRadius="8px"
                px="14px"
              >
                <Text fontSize="sm">Notification Settings</Text>
              </MenuItem>
            </Flex>
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
