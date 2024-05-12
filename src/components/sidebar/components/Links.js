/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("brand.900", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.900", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.900", "white");

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      return (
        <NavLink key={index} to={route.layout + route.path}>
          <Box>
            <HStack
              spacing={activeRoute(route.path.toLowerCase()) ? "22px" : "26px"}
              py="5px"
              ps="10px"
            >
              <Flex w="100%" alignItems="center" justifyContent="center">
                <Box
                  color={
                    activeRoute(route.path.toLowerCase()) ? activeIcon : textColor
                  }
                  me="18px"
                >
                  {route.icon}
                </Box>
                <Text
                  me="auto"
                  color={
                    activeRoute(route.path.toLowerCase()) ? activeColor : textColor
                  }
                  fontWeight={activeRoute(route.path.toLowerCase()) ? "bold" : "normal"}
                >
                  {route.name}
                </Text>
              </Flex>
              <Box
                h="36px"
                w="4px"
                bg={
                  activeRoute(route.path.toLowerCase()) ? brandColor : "transparent"
                }
                borderRadius="5px"
              />
            </HStack>
            {route.secondary.subMenu && (
              <Box pl="4">
                {route.secondary.subMenu.map((subRoute, subIndex) => (
                  <NavLink key={subIndex} to={subRoute.layout + subRoute.path}>
                    <Flex
                      alignItems="center"
                      py="5px"
                      ps="10px"
                      ml="20px"
                    >
                      <Box
                        color={
                          activeRoute(subRoute.path.toLowerCase())
                            ? activeIcon
                            : textColor
                        }
                        me="18px"
                      >
                        {subRoute.icon}
                      </Box>
                      <Text
                        me="auto"
                        color={
                          activeRoute(subRoute.path.toLowerCase())
                            ? activeColor
                            : textColor
                        }
                        fontWeight={
                          activeRoute(subRoute.path.toLowerCase())
                            ? "bold"
                            : "normal"
                        }
                      >
                        {subRoute.name}
                      </Text>
                    </Flex>
                  </NavLink>
                ))}
              </Box>
            )}
          </Box>
        </NavLink>
      );
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
