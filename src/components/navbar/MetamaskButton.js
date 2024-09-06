import React, { useEffect, useContext } from "react";
import {
  IconButton,
  Button,
  Icon,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import detectEthereumProvider from "@metamask/detect-provider";
//import "../../css/navigation/metamaskButton.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Web3 from "web3";
import { AccountContext } from "../../AccountContext";
import { MdLink, MdLinkOff } from "react-icons/md";
let readable_chain_id;

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

const handleSignMessage = async (publicAddress, nonce) => {
  try {
    var web3 = new Web3(window.ethereum);
    return new Promise((resolve, reject) => {
      const signature = web3.eth.personal.sign(
        web3.utils.fromUtf8(
          `Please sign nonce ${nonce} to authenticate account ownership.`
        ),
        publicAddress,
        ""
      );
      resolve(signature);
      return signature;
    });
  } catch (e) {
    console.error(e);
  }
};

const MetamaskButton = () => {
  const { setAccount, setConnectedBlockchain } = useContext(AccountContext);
  const tracColor = useColorModeValue("brand.900", "white");

  const buttonContent = useBreakpointValue({
    base: <IconButton as={MdLinkOff} pl="8px" bg="none" _hover="none" color="white" />, // Show the icon on mobile sizes
    md: "Disconnect", // Show text on medium sizes and above
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token", "");
        localStorage.removeItem("blockchain", "");
        localStorage.removeItem("account", "");
        setAccount(null);
        setConnectedBlockchain(null);
        return;
      }
    }

    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const provider = await detectEthereumProvider();
      // Metamask is connected.
      if (provider) {
        // Subscribe to account change events
        provider.on("accountsChanged", async (newAccounts) => {
          if (newAccounts.length > 0) {
            await changeAccounts(newAccounts[0]);
          }
        });

        // Subscribe to chain change events
        provider.on("chainChanged", async (newChain) => {
          await changeChain(newChain);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changeAccounts = async (account) => {
    try {
      const user_record = await axios.post(
        `${process.env.REACT_APP_API_HOST}/auth/register`,
        { account: account },
        config
      );

      // Sign message
      const signedMessage = await handleSignMessage(
        account,
        user_record.data.user_record[0].nonce
      );
      // Send signature to backend
      const responseSign = await axios.post(
        `${process.env.REACT_APP_API_HOST}/auth/sign`,
        { account: account, signature: signedMessage },
        config
      );

      //set token in localstorage
      localStorage.setItem("token", responseSign.data.token);
      localStorage.setItem("account", account); // Update account state in the parent component
      await setAccount(account);

      //window.location.reload();
    } catch (error) {
      // Handle the error when signing is rejected or encounters other issues
      console.error("Error signing the message:", error);
      // Respond to the rejection or error appropriately
    }
  };

  const changeChain = async (newChain) => {
    try {
      if (newChain === "0x4fce") {
        readable_chain_id = `NeuroWeb Testnet`;
      } else if (newChain === "0x7fb") {
        readable_chain_id = "NeuroWeb Mainnet";
      } else if (newChain === "0x64") {
        readable_chain_id = "Gnosis Mainnet";
      } else if (newChain === "0x27d8") {
        readable_chain_id = "Chiado Testnet";
      } else if (newChain === "0x2105") {
        readable_chain_id = "Base Mainnet";
      } else if (newChain === "0x14a34") {
        readable_chain_id = "Base Testnet";
      } else {
        readable_chain_id = "Unsupported Chain";
      }

      localStorage.setItem("blockchain", readable_chain_id);
      await setConnectedBlockchain(readable_chain_id);
      //window.location.reload();
    } catch (error) {
      // Handle the error when signing is rejected or encounters other issues
      console.error("Error signing the message:", error);
      // Respond to the rejection or error appropriately
    }
  };

  const handleConnect = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider && provider.request) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });

        const activeChainId = await provider.request({
          method: "eth_chainId",
        });

        if (accounts.length > 0) {
          await changeAccounts(accounts[0]);
          await changeChain(activeChainId);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = () => {
    // Add code to handle disconnection or reset any necessary state
    localStorage.removeItem("token", "");
    localStorage.removeItem("blockchain", "");
    localStorage.removeItem("account", "");
    setAccount(null);
    setConnectedBlockchain(null);
    //window.location.reload();
  };

  return (
    <div>
      {localStorage.getItem("account") ? (
        <Button
        aria-label="MetaMask Button"
        onClick={handleDisconnect}
        variant="darkBrand"
        color="white"
        fontSize="md"
        fontWeight="500"
        borderRadius="70px"
        px="24px"
        py="5px"
        mt={{ base: "5px", md: "0px" }}
      >
        Disconnect
      </Button>
        // <Button
        //   aria-label="Responsive Button"
        //   leftIcon={
        //     typeof buttonContent === "string"
        //       ? null
        //       : buttonContent
        //   } // Only set leftIcon if it's an icon
        //   onClick={handleDisconnect}
        //   variant="darkBrand"
        //   color="white"
        //   fontSize="md"
        //   fontWeight="500"
        //   borderRadius="70px"
        //   mr="10px"
        //   py={{sm:"0px",md:"5px"}}
        //   px={{sm:"0px",md:"24px"}}
        // >
        //   {typeof buttonContent === "string"
        //     ? buttonContent
        //     : null}{" "}
        //   {/* Render text only if buttonContent is a string */}
        // </Button>
      ) : (
        <Button
          aria-label="MetaMask Button"
          onClick={handleConnect}
          variant="darkBrand"
          color="white"
          fontSize="md"
          fontWeight="500"
          borderRadius="70px"
          mr="10px"
          px="24px"
          py="5px"
        >
          Connect
        </Button>
      )}
    </div>
  );
};

export default MetamaskButton;
