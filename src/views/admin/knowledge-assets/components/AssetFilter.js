import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import ParanetDrop from "views/admin/inventory/components/ParanetDrop";
import { AccountContext } from "../../../../AccountContext";
import RecentAsset from "views/admin/profile/components/RecentAssets";
const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function AssetFilter({ setRecentAssets }) {
  const [filterForm, setFilterForm] = useState({
    limit: 100,
    ual: null,
    owner: null,
    paranet: null,
    publisher: null,
    token_amount: false,
    likes: false,
    dislikes: false,
    include_expired: true,
    search: ""
  });
  const [paranet, setParanet] = useState(null);
  const [paranets, setParanets] = useState("");
  const [loading, setLoading] = useState(false);
  const { network, blockchain } = useContext(AccountContext);
  const textColor = useColorModeValue("navy.700", "white");
  const tracColor = useColorModeValue("brand.900", "white");
  const account = localStorage.getItem("account");

  const handleFilterInput = (e) => {
    const { name, value } = e.target;
    setFilterForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFilterChange = (name, value) => {
    setFilterForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFilterSubmit = async () => {
    try {
      setRecentAssets(null);
      setLoading(true);
      let data;
      let assets;

      if(filterForm.search.length > 0){
        assets = await changeTopic(filterForm.search, blockchain)
      }else{
        data = {
          network: network,
          blockchain: blockchain,
          limit: filterForm.limit,
          ual: filterForm.ual,
          publisher: filterForm.publisher,
          owner: filterForm.owner,
        };
  
        if(paranet){
          data.paranet_ual = paranet.paranetKnowledgeAssetUAL
        }

        assets = await axios
        .post(`${process.env.REACT_APP_API_HOST}/assets/info`, data, config)
        .then((response) => response.data.result[0].data)
        .catch((error) => {
          console.error(error);
        });
      }
  
      if (assets) {
        const isExpired = (asset) => {
          const blockDate = new Date(asset.block_ts);
          const totalDays = asset.epochs_number * asset.epoch_length_days;
          const expirationDate = new Date(blockDate);
          expirationDate.setDate(expirationDate.getDate() + totalDays);
  
          return new Date() > expirationDate;
        };
  
        // Filter out expired assets only if include_expired is false
        if (!filterForm.include_expired) {
          assets = assets.filter((asset) => !isExpired(asset));
        }
        if(paranet){
          assets.filter((asset) => asset.UAL === paranet.paranetKnowledgeAssetUAL);
        }
        if (filterForm.owner) {
          assets.filter((asset) => asset.owner === filterForm.owner);
        }
        if (filterForm.publisher) {
          assets.filter((asset) => asset.publisher === filterForm.publisher);
        }
        if (filterForm.token_amount) {
          assets.sort((a, b) => b.token_amount - a.token_amount);
        }
        if (filterForm.likes) {
          assets.sort((a, b) => b.sentiment[1] - a.sentiment[1]);
        }
        if (filterForm.dislikes) {
          assets.sort((a, b) => b.sentiment[0] - a.sentiment[0]);
        }
      }

      setRecentAssets(assets);
        setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };  

  const changeTopic = async (topic, chain_name) => {
    try {
      setRecentAssets(null);
      let topic_list = [];
      let query;
      let data = {
        network: network,
      };

      let response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/misc/blockchains`,
        data,
        config
      );

      if (!chain_name) {
        for (const bchain of response.data.blockchains) {
          data = {
            blockchain:
              bchain.chain_name === "NeuroWeb Testnet"
                ? "otp:20430"
                : bchain.chain_name === "NeuroWeb Mainnet"
                ? "otp:2043"
                : bchain.chain_name === "Chiado Testnet"
                ? "gnosis:10200"
                : bchain.chain_name === "Gnosis Mainnet"
                ? "gnosis:100"
                : bchain.chain_name === "Base Testnet"
                ? "base:84532"
                : bchain.chain_name === "Base Mainnet"
                ? "base:8453"
                : "",
            query: `PREFIX schema: <http://schema.org/>

            SELECT ?subject (SAMPLE(?name) AS ?name) (SAMPLE(?description) AS ?description) 
                   (REPLACE(STR(?g), "^assertion:", "") AS ?assertion)
            WHERE {
              GRAPH ?g {
                ?subject schema:name ?name .
                ?subject schema:description ?description .
                
                FILTER(
                  (isLiteral(?name) && CONTAINS(str(?name), "${topic}")) || (isLiteral(?name) && CONTAINS(LCASE(str(?name)), "${topic}")) ||
                  (isLiteral(?description) && CONTAINS(str(?description), "${topic}")) || (isLiteral(?description) && CONTAINS(LCASE(str(?description)), "${topic}"))
                )
              }
              ?ual schema:assertion ?g .
              FILTER(CONTAINS(str(?ual), "${bchain.chain_id}"))
            }
            GROUP BY ?subject ?g
            LIMIT 100  
            `,
          };

          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/dkg/query`,
            data,
            config
          );

          console.log(response.data.data)
          for (const asset of response.data.data) {
            data = {
              blockchain: bchain.chain_name,
              limit: 1000,
              state: JSON.parse(asset.assertion),
            };

            response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/assets/info`,
              data,
              config
            );
            topic_list.push(response.data.result[0].data[0]);
          }
        }

          let topic_sort = topic_list.sort((a, b) => {
            const diffA =
              JSON.parse(a.sentiment)[0] - JSON.parse(a.sentiment)[1];
            const diffB =
              JSON.parse(b.sentiment)[0] - JSON.parse(b.sentiment)[1];
            return diffB - diffA; // For descending order
          });

          return(topic_sort);
      } else {
        let index = response.data.blockchains.findIndex(
          (item) => item.chain_name === chain_name
        );
        data = {
          blockchain: chain_name === "NeuroWeb Testnet"
          ? "otp:20430"
          : chain_name === "NeuroWeb Mainnet"
          ? "otp:2043"
          : chain_name === "Chiado Testnet"
          ? "gnosis:10200"
          : chain_name === "Gnosis Mainnet"
          ? "gnosis:100"
          : chain_name === "Base Testnet"
          ? "base:84532"
          : chain_name === "Base Mainnet"
          ? "base:8453"
          : "",
          query: `PREFIX schema: <http://schema.org/>

          SELECT ?subject (SAMPLE(?name) AS ?name) (SAMPLE(?description) AS ?description) 
                 (REPLACE(STR(?g), "^assertion:", "") AS ?assertion)
          WHERE {
            GRAPH ?g {
              ?subject schema:name ?name .
              ?subject schema:description ?description .
              
              FILTER(
                (isLiteral(?name) && CONTAINS(str(?name), "${topic}")) || (isLiteral(?name) && CONTAINS(LCASE(str(?name)), "${topic}")) ||
                (isLiteral(?description) && CONTAINS(str(?description), "${topic}")) || (isLiteral(?description) && CONTAINS(LCASE(str(?description)), "${topic}"))
              )
            }
            ?ual schema:assertion ?g .
            FILTER(CONTAINS(str(?ual), "${response.data.blockchains[index].chain_id}"))
          }
          GROUP BY ?subject ?g
          LIMIT 100  
          `
        };

        console.log(data)
        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/dkg/query`,
          data,
          config
        );

        for (const asset of response.data.data) {
          data = {
            blockchain: chain_name,
            limit: 1000,
            state: JSON.parse(asset.assertion),
          };

          response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/assets/info`,
            data,
            config
          );

          topic_list.push(response.data.result[0].data[0]);
        }
      }

      let topic_sort = topic_list.sort((a, b) => {
        const diffA = JSON.parse(a.sentiment)[0] - JSON.parse(a.sentiment)[1];
        const diffB = JSON.parse(b.sentiment)[0] - JSON.parse(b.sentiment)[1];
        return diffB - diffA; // For descending order
      });
      setLoading(false);
      return(topic_sort);
    } catch (e) {
      //setError(e);
    }
  };

  return (
    <Card px="0px" mb="20px" minH="600px" maxH="1200px" boxShadow="md">
      <Box px="22px" pb="20px">
      <FormControl mb={4}>
          <FormLabel>
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              Search
            </Text>
          </FormLabel>
          <Input
            name="search"
            value={filterForm.ual}
            onChange={handleFilterInput}
            placeholder="Search the DKG"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              UAL
            </Text>
          </FormLabel>
          <Input
            name="ual"
            value={filterForm.ual}
            onChange={handleFilterInput}
            placeholder="Enter UAL"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              Publisher
            </Text>
          </FormLabel>
          <Input
            name="publisher"
            value={filterForm.publisher}
            onChange={handleFilterInput}
            placeholder="Enter Publisher"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              Owner
            </Text>
          </FormLabel>
          <Input
            name="owner"
            value={filterForm.owner}
            onChange={handleFilterInput}
            placeholder="Enter Owner"
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              Paranet
            </Text>
          </FormLabel>
          <Flex w="100%">
            <ParanetDrop
              network={network}
              set_paranet={setParanet}
              paranet={filterForm.paranet}
            />
          </Flex>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              Limit: {filterForm.limit}
            </Text>
          </FormLabel>
          <Slider
            defaultValue={filterForm.limit}
            min={1}
            max={50000}
            step={1}
            onChange={(value) => handleFilterChange("limit", value)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel htmlFor="token_amount" mb="0">
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              Token Amount
            </Text>
          </FormLabel>
          <Switch
            id="token_amount"
            isChecked={filterForm.token_amount}
            onChange={(e) =>
              handleFilterChange("token_amount", e.target.checked)
            }
          />
        </FormControl>

        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel htmlFor="likes" mb="0">
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              Likes
            </Text>
          </FormLabel>
          <Switch
            id="likes"
            isChecked={filterForm.likes}
            onChange={(e) => handleFilterChange("likes", e.target.checked)}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel htmlFor="dislikes" mb="0">
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              Dislikes
            </Text>
          </FormLabel>
          <Switch
            id="dislikes"
            isChecked={filterForm.dislikes}
            onChange={(e) => handleFilterChange("dislikes", e.target.checked)}
          />
        </FormControl>

        <FormControl display="flex" alignItems="center" mb={4}>
          <FormLabel htmlFor="include_expired" mb="0">
            <Text
              color="#11047A"
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg",
              }}
              fontWeight="bold"
              me="14px"
            >
              Include Expired
            </Text>
          </FormLabel>
          <Switch
            id="include_expired"
            isChecked={filterForm.include_expired}
            onChange={(e) =>
              handleFilterChange("include_expired", e.target.checked)
            }
          />
        </FormControl>
        <Flex h="40px">
          {!loading && (
            <Button
              color={tracColor}
              border={"solid 1px"}
              mb="4"
              width="full"
              onClick={() => handleFilterSubmit()}
              h="40px"
            >
              Apply
            </Button>
          )}
        </Flex>
      </Box>
    </Card>
  );
}

export default AssetFilter;
