// Chakra imports
import { Box, Text, useColorModeValue, Button, Icon } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect, useContext } from "react";
import { MdNotificationsNone, MdInfoOutline } from 'react-icons/md';
import { AccountContext } from "../../../../AccountContext";

function formatNumberWithSpaces(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

export default function DelegateInformation(props) {
  const { title, value, chain_id, tokenName, shares, delegatorStakeValueCurrent, delegatorStakeValueFuture, delegatorCurrentEarnings, delegatorFutureEarnings, nodeSharesTotalSupply, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const bg = useColorModeValue("white", "navy.700");
  const {open_delegator_settings, setOpenDelegateSettings } = useContext(AccountContext);

  return (
    <Card bg={bg} {...rest}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          {chain_id === '2043' || chain_id === '20430' ? (
            <img
              src={`${process.env.REACT_APP_API_HOST}/images?src=neuro_logo.svg`}
              style={{ maxWidth: "25px", maxHeight: "25px" }}
            />
          ) : chain_id === '100' || chain_id === '10200' ? (
            <img
              src={`${process.env.REACT_APP_API_HOST}/images?src=gnosis_logo.svg`}
              style={{ maxWidth: "25px", maxHeight: "25px" }}
            />
          ) : (
            ""
          )}
          <Text fontWeight='500' color={textColorSecondary} fontSize='sm'>
            {tokenName}
          </Text>
          <Text color={textColorPrimary} fontWeight='500' fontSize='md'>
            {`${formatNumberWithSpaces(Number(shares).toFixed(2))}`}
          </Text>
        </Box>
        <Text fontWeight='500' fontSize='md' color='green.500'>
          {`+${delegatorCurrentEarnings.toFixed(1)} Trac`}
        </Text>
        <Button
            variant="darkBrand"
            color="white"
            fontSize="sm"
            fontWeight="500"
            borderRadius="70px"
            px="5px"
            py="5px"
            onClick={() => setOpenDelegateSettings(tokenName)}
          >
            <Icon as={MdNotificationsNone} color={'#ffffff'} w="18px" h="18px" />
          </Button>
      </Box>
    </Card>
  );
}
