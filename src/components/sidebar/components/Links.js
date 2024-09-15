/* eslint-disable */
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";

export function SidebarLinks(props) {
  let location = useLocation();
  let activeColor = useColorModeValue("brand.900", "white");
  let inactiveColor = useColorModeValue("secondaryGray.600", "secondaryGray.600");
  let activeIcon = useColorModeValue("brand.900", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.900", "white");
  const [othubClicked, setOthubClicked] = useState(false);

  const { routes } = props;

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.path === "/api") {
        return (
          <a
            key={index}
            href={route.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {renderRouteContent(route)}
          </a>
        );
      } else if (route.path === "/my-othub") {
        return (
          <Box key={index}>
            <Box
              cursor="pointer"
              onClick={() => setOthubClicked(!othubClicked)}
            >
              {renderRouteContent(route)}
            </Box>
            {othubClicked && route.subMenu && route.subMenu.map((subRoute, subIndex) => (
              <NavLink key={`${index}-${subIndex}`} to={subRoute.layout + subRoute.path}>
                {renderRouteContent(subRoute, true)}
              </NavLink>
            ))}
          </Box>
        );
      } else {
        return (
          <NavLink key={index} to={route.layout + route.path}>
            {renderRouteContent(route)}
          </NavLink>
        );
      }
    });
  };

  const renderRouteContent = (route, isSubMenu = false) => {
    return (route.name !== "Home" &&
      <Box>
        <HStack
          spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
          py="5px"
          ps={isSubMenu ? "30px" : "10px"}
        >
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Box
              color={activeRoute(route.path.toLowerCase()) ? activeIcon : textColor}
              me="18px"
            >
              {route.icon}
            </Box>
            <Text
              me="auto"
              color={activeRoute(route.path.toLowerCase()) ? activeColor : textColor}
              fontWeight={activeRoute(route.path.toLowerCase()) ? "bold" : "normal"}
            >
              {route.name}
            </Text>
          </Flex>
          <Box
            h="36px"
            w="4px"
            bg={activeRoute(route.path.toLowerCase()) ? brandColor : "transparent"}
            borderRadius="5px"
          />
        </HStack>
      </Box>
    );
  };

  return createLinks(routes);
}

export default SidebarLinks;
