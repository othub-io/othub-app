import React from 'react';
import { Box, Progress, Text, useColorModeValue } from '@chakra-ui/react';

const stages = ["AWAITING_ALLOWANCE_INCREASE", "INCREASE_ALLOWANCE_COMPLETED", "CREATE_ASSET_COMPLETED"];

const ProgressBar = ({ progress }) => {
  const progressIndex = stages.indexOf(progress);
  const progressValue = ((progressIndex + 1) / stages.length) * 100;
  const tracColor = useColorModeValue("brand.900", "white");

  return (progress &&
    <Box width="100%" p={4} boxShadow="md" borderRadius="md">
      <Text fontWeight="bold" fontSize="lg" color={progress === 'ERROR' ? "red.500" : tracColor} textAlign="center" mb="20px">
        {progress === 'ERROR' ? "An error occurred during the minting process! Please try again later." : progress === 'AWAITING_ALLOWANCE_INCREASE' ? "Please approve the allowance needed to mint the asset." : progress === 'INCREASE_ALLOWANCE_COMPLETED' ? "Please approve the next transaction to mint your asset!" : "Congratulations! Your asset has been created!"}
      </Text>
      <Progress 
        value={progress === 'ERROR' ? "100" : progressValue} 
        size="lg" 
        w="90%" 
        hasStripe 
        isAnimated 
        sx={{
          transition: 'value 0.6s ease-in-out',
          '& > div:first-of-type': {
            backgroundColor: progress === 'ERROR' ? "red.500" : tracColor,
          }
        }}
        backgroundColor="gray.200"
        ml="5%"
      />
      <Box display="flex" justifyContent="space-between" mt={2} width="90%" ml="5%">
        {stages.map((stage, index) => (
          <Text key={index} fontSize="sm" color={index <= progressIndex ? tracColor : 'gray.100'} fontWeight="bold">
            {stage === "AWAITING_ALLOWANCE_INCREASE" ? "Inc. Allowance" : stage === "INCREASE_ALLOWANCE_COMPLETED" ? "Approve Creation" : "Creation Complete!"}
          </Text>
        ))}
      </Box>
    </Box>
  );
};

export default ProgressBar;
