import { Portal, Box, useDisclosure } from "@chakra-ui/react";
import Footer from "components/footer/FooterAdmin.js";
import Navbar from "components/navbar/NavbarAdmin.js";
import Sidebar from "components/sidebar/Sidebar.js";
import Home from "views/admin/home";
import { SidebarContext } from "contexts/SidebarContext";
import React, { useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import routes from "routes.js";

export default function Dashboard(props) {
  const { ...rest } = props;
  const location = useLocation();

  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].name === "Home" && window.location.pathname === routes[i].layout + routes[i].path) {
        return "Home";
      }
      if (routes[i].subMenu) {
        let subRoute = getActiveRoute(routes[i].subMenu);
        if (subRoute) {
          return subRoute;
        }
      } else {
        if (window.location.pathname === routes[i].layout + routes[i].path) {
          return routes[i].name;
        }
      }
    }
    return null;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].name !== "Home") {
        if (routes[i].collapse) {
          let collapseActiveNavbar = getActiveNavbar(routes[i].items);
          if (collapseActiveNavbar) {
            return collapseActiveNavbar;
          }
        } else if (routes[i].category) {
          let categoryActiveNavbar = getActiveNavbar(routes[i].items);
          if (categoryActiveNavbar) {
            return categoryActiveNavbar;
          }
        } else {
          // Check for submenu
          if (routes[i].subMenu) {
            let subRoute = getActiveNavbar(routes[i].subMenu);
            if (subRoute) {
              return subRoute;
            }
          }

          // Check if the current path matches
          if (window.location.pathname === routes[i].layout + routes[i].path) {
            return routes[i].secondary;
          }
        }
      }
    }
    return activeNavbar;
  };

  const getActiveNavbarText = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].name !== "Home") {
        if (routes[i].collapse) {
          let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
          if (collapseActiveNavbar !== activeNavbar) {
            return collapseActiveNavbar;
          }
        } else if (routes[i].category) {
          let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
          if (categoryActiveNavbar !== activeNavbar) {
            return categoryActiveNavbar;
          }
        } else {
          if (
            window.location.href.indexOf(routes[i].layout + routes[i].path) !==
            -1
          ) {
            return routes[i].messageNavbar;
          }
        }
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.flatMap((prop, key) => {
      if (prop.name !== "Home") {
        if (prop.subMenu) {
          return prop.subMenu.map((subProp, subKey) => (
            <Route
              path={subProp.layout + subProp.path}
              component={subProp.component}
              key={`${key}-${subKey}`}
            />
          ));
        }
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    });
  };

  const activeRoute = getActiveRoute(routes);
  const activeSecondary = activeRoute !== "Home" && getActiveNavbar(routes);

  document.documentElement.dir = "ltr";
  const { onOpen } = useDisclosure();

  // if (activeRoute === "Home") {
  //   return <Home />;
  // }

  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={routes} display="none" {...rest} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: "100%", xl: "calc( 100% - 290px )" }}
          maxWidth={{ base: "100%", xl: "calc( 100% - 290px )" }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
          marginTop="40px"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={"Horizon UI Dashboard PRO"}
                brandText={activeRoute}
                secondary={activeSecondary}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>
          <Box
            mx="auto"
            p={{ base: "20px", md: "30px" }}
            pe="20px"
            minH="100vh"
            pt="50px"
          >
            <Switch>
              {getRoutes(routes)}
              <Redirect from="/" to="/overview" />
            </Switch>
          </Box>
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
