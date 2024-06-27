import {
  Flex,
  Text,
  useColorModeValue,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import React from "react";
import AssetCard from "views/admin/publishers/components/AssetCard";
import AssetImage from "../../../../../src/assets/img/Knowledge-Asset.jpg";
import Loading from "components/effects/Loading.js";

export default function AssetHistory(props) {
  const { assets, chainName } = props;
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

  if(!assets){
    return(<Box overflow="auto" h="800px" mt="20px">
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
        {assets &&
          assets.map((asset, index) => (
            <AssetCard
              key={index}
              name={asset.token_id}
              author={asset.publisher}
              img={AssetImage}
              download="#"
              keyword={asset.keyword}
              UAL={asset.UAL}
              size={asset.size}
              triples_number={asset.triples_number}
              chunks_number={asset.chunks_number}
              epochs_number={asset.epochs_number}
              epoch_length_days={asset.epoch_length_days}
              cost={asset.token_amount}
              bid={asset.bid}
              block_ts={asset.block_ts}
              block_ts_hour={asset.block_ts_hour}
              state={asset.state}
              publisher={asset.publisher}
              owner={asset.owner}
              winners={asset.winners}
              index={index}
              chain_id={asset.chain_id}
              chainName={asset.chainName}
              sentiment={asset.sentiment}
            />
          ))}
      </SimpleGrid>
    </Box>
  );
}
