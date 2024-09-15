import {
  Flex,
  Text,
  useColorModeValue,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import AssetCard from "views/admin/publishers/components/AssetCard";
import AssetImage from "../../../../../src/assets/img/Knowledge-Asset.jpg";
import Loading from "components/effects/Loading.js";
import axios from "axios";

export default function AssetHistory(props) {
  const { assets, chainName } = props;
  const [users, setUsers] = useState(null);
  const textColor = useColorModeValue("secondaryGray.900", "white");

  let explorer_url;

  if (chainName === "NeuroWeb Mainnet") {
    explorer_url = `https://neuroweb.subscan.io/extrinsic/`;
  } else if (chainName === "NeuroWeb Testnet") {
    explorer_url = `https://neuroweb-testnet.subscan.io/extrinsic/`;
  } else if (chainName === "Gnosis Mainnet") {
    explorer_url = `https://gnosis.blockscout.com/tx/`;
  } else if (chainName === "Chiado Testnet") {
    explorer_url = `https://gnosis-chiado.blockscout.com/tx/`;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/user/info`,
          { },
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
            },
          }
        );

        setUsers(response.data.result)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if(!assets){
    return(<Box overflow="auto" h="800px" mt="0px">
    <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%" mb="20px">
      Catalog
    </Text>
    <Loading />
    </Box>)
  }

  return (
    <Box py="20px" overflow="auto" h="800px" mt="20px">
      <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
      Catalog
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mt="20px">
        {users && assets &&
          assets.map((asset, index) => (
            <AssetCard
              key={index}
              img={AssetImage}
              download="#"
              index={index}
              asset={asset}
              users={users}
            />
          ))}
      </SimpleGrid>
    </Box>
  );
}
