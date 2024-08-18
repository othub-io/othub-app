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
  });
  const [paranet, setParanet] = useState(null);
  const [paranets, setParanets] = useState("");
  const [loading, setLoading] = useState("");
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
  
      let data = {
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
  
      let response = await axios
        .post(`${process.env.REACT_APP_API_HOST}/assets/info`, data, config)
        .then((response) => response)
        .catch((error) => {
          console.error(error);
        });
  
      if (response) {
        let assets = response.data.result[0].data;
  
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
  
        // Apply ordering based on token_amount, likes, dislikes, include_expired
        if (filterForm.token_amount) {
          assets.sort((a, b) => b.token_amount - a.token_amount);
        }
        if (filterForm.likes) {
          assets.sort((a, b) => b.sentiment[1] - a.sentiment[1]);
        }
        if (filterForm.dislikes) {
          assets.sort((a, b) => b.sentiment[0] - a.sentiment[0]);
        }
  
        setRecentAssets(assets);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };  

  return (
    <Card px="0px" mb="20px" minH="600px" maxH="1200px" boxShadow="md">
      <Flex
        align={{ sm: "flex-start", lg: "center" }}
        justify="space-between"
        w="100%"
        px="22px"
        pb="10px"
      >
        <Text color={textColor} fontSize="xl" fontWeight="600">
          Knowledge Filter
        </Text>
      </Flex>
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
