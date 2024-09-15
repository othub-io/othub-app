import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, useColorModeValue } from '@chakra-ui/react';

const ToggleButtons = ({set_mode}) => {
  const [leftButtonActive, setLeftButtonActive] = useState(true);
  const [rightButtonActive, setRightButtonActive] = useState(false);

  const tracColor = useColorModeValue("brand.900", "white"); // Adjust tracColor based on theme

  useEffect(() => {
    async function fetchData() {
      try {
        //set_mode('D')
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleLeftButtonClick = () => {
    set_mode('D')
    setLeftButtonActive(true);
    setRightButtonActive(false);
  };

  const handleRightButtonClick = () => {
    set_mode('N')
    setLeftButtonActive(false);
    setRightButtonActive(true);
  };

  return (
    <Flex>
      <Button
        onClick={handleLeftButtonClick}
        bg={leftButtonActive ? 'gray.200' : 'transparent' }
        color={leftButtonActive ? '#ffffff' : tracColor}
        borderColor={leftButtonActive ? 'none' : tracColor}
        borderWidth="1px"
        // _active={{ 
        //   bg: 'gray.500',
        //   color: 'darkGray'
        // }}
        boxShadow="md"
        borderRadius="md"
        borderRightRadius="none"
      >
        Delegations
      </Button>
      <Button
        onClick={handleRightButtonClick}
        bg={rightButtonActive ? 'gray.200' : 'transparent' }
        color={rightButtonActive ? '#ffffff' : tracColor}
        borderColor={rightButtonActive ? 'none' : tracColor}
        boxShadow={rightButtonActive ? 'none' : 'md'}
        borderWidth="1px"
        // _active={{ 
        //   bg: 'gray.500',
        //   color: 'darkGray'
        // }}
        borderRadius="md"
        borderLeftRadius="none"
      >
        Nodes
      </Button>
    </Flex>
  );
};

export default ToggleButtons;
