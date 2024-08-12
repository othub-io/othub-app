// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import routes from 'routes.js';

export default function Dashboard(props) {
  const { ...rest } = props;
  const location = useLocation();
  
  // states and functions
  const [ fixed ] = useState(false);
  const [ toggleSidebar, setToggleSidebar ] = useState(false);
  
  // functions for changing the states from components
  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps';
  };

  const getActiveRoute = (routes) => {
    let activeRoute = 'Default Brand Text';
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].subMenu) {
        let subRoute = getActiveRoute(routes[i].subMenu);
        if (subRoute !== 'Default Brand Text') {
          return subRoute;
        }
      } else {
        if (window.location.pathname === routes[i].layout + routes[i].path) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
  
    for (let i = 0; i < routes.length; i++) {
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
  
    // If no active route found, return the default activeNavbar
    return activeNavbar;
  };
  

  const getActiveNavbarText = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
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
        if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
          return routes[i].messageNavbar;
        }
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.flatMap((prop, key) => {
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
    });
  };

  const activeSecondary = getActiveNavbar(routes);

  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();
  document.documentElement.dir = 'ltr';

  return (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar
          }}>
          <Sidebar routes={routes} display='none' {...rest} />
          <Box
            float='right'
            minHeight='100vh'
            height='100%'
            overflow='auto'
            position='relative'
            maxHeight='100%'
            w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
            transitionDuration='.2s, .2s, .35s'
            transitionProperty='top, bottom, width'
            transitionTimingFunction='linear, linear, ease'
            marginTop="40px"
          >
            <Portal>
              <Box>
                <Navbar
                  onOpen={onOpen}
                  logoText={'Horizon UI Dashboard PRO'}
                  brandText={getActiveRoute(routes)}
                  secondary={activeSecondary}
                  message={getActiveNavbarText(routes)}
                  fixed={fixed}
                  {...rest}
                />
              </Box>
            </Portal>

            {getRoute() ? (
              <Box mx='auto' p={{ base: '20px', md: '30px' }} pe='20px' minH='100vh' pt='50px'>
                <Switch>
                  {getRoutes(routes)}
                  <Redirect from='/' to='/overview' />
                </Switch>
              </Box>
            ) : null}
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}
