import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { OTHubLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");
  let tracColor = useColorModeValue("brand.900", "white")

  return (
    <Flex align="left" direction="column" position="relative">
      <Flex align="left" direction="row" position="relative" color={tracColor}>
        <a href={`${process.env.REACT_APP_WEB_HOST}/`} style={{ display: "inline-flex", alignItems: "center" }}>
          <img
            width="75px"
            my="32px"
            color={logoColor}
            src={`${process.env.REACT_APP_API_HOST}/images?src=OTHub-Logo.png`}
            style={{ display: "inline-block" }}
            alt="OTHub Logo"
          />
          <span
            style={{
              display: window.matchMedia("(max-width: 1200px)").matches ? "none" : "inline-block",
              fontSize: "34px",
              fontWeight: "bold",
              marginTop: "10px",
              marginLeft: "10px", // Add some space between the logo and text
            }}
          >
            othub.io
          </span>
        </a>
      </Flex>
      <HSeparator mb="10px" mt="10px" />
    </Flex>
  );  
}

export default SidebarBrand;
