// Chakra imports
import {
  Box,
  Flex,
  Stack,
  Icon,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
// Custom components
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import SidebarCard from "components/sidebar/components/SidebarCard";
import React from "react";
import { MdAnchor } from "react-icons/md";
import { FaTwitter, FaDiscord, FaTelegramPlane } from "react-icons/fa"; // Importing icons

// FUNCTIONS
function SidebarContent(props) {
  const { routes } = props;
  const tracColor = useColorModeValue("brand.900", "white");

  // SIDEBAR
  return (
    <Flex
      direction="column"
      height="100%"
      pt="25px"
      px="16px"
      borderRadius="30px"
    >
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box mt="60px" mb="40px" borderRadius="30px"></Box>
      {/* <SidebarCard /> */}
      <Flex justifyContent="space-between" mb="10px">
        <Link href="https://x.com/OTHub_io" isExternal>
          <Icon
            as={FaTwitter}
            w="30px"
            h="30px"
            color={tracColor}
            _hover={{ cursor: "pointer" }}
            _active={{ borderColor: tracColor }}
            _focus={{ bg: "none" }}
          />
        </Link>
        <Link href="https://t.me/othubio" isExternal>
          <Icon
            as={FaTelegramPlane}
            w="30px"
            h="30px"
            color={tracColor}
            _hover={{ cursor: "pointer" }}
            _active={{ borderColor: tracColor }}
            _focus={{ bg: "none" }}
          />
        </Link>
        <Link href="https://discord.gg/jJMRwFHZEX" isExternal>
          <Icon
            as={FaDiscord}
            w="30px"
            h="30px"
            color={tracColor}
            _hover={{ cursor: "pointer" }}
            _active={{ borderColor: tracColor }}
            _focus={{ bg: "none" }}
          />
        </Link>
        <Link href="https://deepdive.othub.io/" isExternal>
          <Icon
            as={MdAnchor}
            w="30px"
            h="30px"
            color={tracColor}
            _hover={{ cursor: "pointer" }}
            _active={{ borderColor: tracColor }}
            _focus={{ bg: "none" }}
          />
        </Link>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
