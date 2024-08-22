import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdStars,
  MdHome,
  MdDesktopWindows,
  MdDashboard,
  MdLocalLibrary,
  MdAnchor,
  MdApi,
  MdOutlineLibraryBooks,
  MdPerson3,
  MdPublish,
  MdOutlineInventory,
  MdOutlineConstruction,
  MdDataThresholding
} from "react-icons/md";

// Admin Imports
import Api from "views/admin/api";
import Overview from "views/admin/overview";
import Home from "views/admin/home";
import KnowledgeAssets from "views/admin/knowledge-assets";
import NetworkAnalytics from "views/admin/network-analytics";
import Profile from "views/admin/profile";
import Publish from "views/admin/publish";
import Build from "views/admin/build";
import Inventory from "views/admin/inventory";
import Nodes from "views/admin/nodes";
import Publishers from "views/admin/publishers";


const routes = [
  {
    name: "Home",
    layout: "",
    path: "/",
    icon: <Icon as={MdDashboard} width='20px' height='20px' color='inherit' />,
    component: Home,
    secondary: {network_select: false, blockchain_select: false}
  },
  {
    name: "Overview",
    layout: "",
    path: "/overview",
    icon: <Icon as={MdDashboard} width='20px' height='20px' color='inherit' />,
    component: Overview,
    secondary: {network_select: true, blockchain_select: true}
  },
  {
    name: "My OTHub",
    layout: "",
    path: "/my-othub",
    icon: <Icon as={MdStars} width='20px' height='20px' color='inherit' />,
    component: null,
    subMenu: [
      {
        name: "Account",
        layout: "",
        path: "/my-othub/account",
        icon: (
          <Icon
            as={MdPerson3}
            width='20px'
            height='20px'
            color='inherit'
          />
        ),
        component: Profile,
        secondary: {network_select: true, blockchain_select: false}
      },
      {
        name: "Inventory",
        layout: "",
        path: "/my-othub/inventory",
        icon: (
          <Icon
            as={MdOutlineInventory}
            width='20px'
            height='20px'
            color='inherit'
          />
        ),
        component: Inventory,
        secondary: {network_select: true, blockchain_select: true}
      },
      {
        name: "Publish",
        layout: "",
        path: "/my-othub/publish",
        icon: (
          <Icon
            as={MdPublish}
            width='20px'
            height='20px'
            color='inherit'
          />
        ),
        component: Publish,
        secondary: {network_select: true, blockchain_select: false}
      },
      {
        name: "Build",
        layout: "",
        path: "/my-othub/build",
        icon: (
          <Icon
            as={MdOutlineConstruction}
            width='20px'
            height='20px'
            color='inherit'
          />
        ),
        component: Build,
        secondary: {network_select: false, blockchain_select: false}
      }
    ]
  },
  {
    name: "Knowledge",
    layout: "",
    path: "/knowledge",
    icon: (
      <Icon
        as={MdOutlineLibraryBooks}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: KnowledgeAssets,
    secondary: {network_select: true, blockchain_select: true}
  },
  {
    name: "Publishers",
    layout: "",
    path: "/publishers",
    icon: <Icon as={MdLocalLibrary} width='20px' height='20px' color='inherit' />,
    component: Publishers,
    secondary: {network_select: true, blockchain_select: false}
  },
  {
    name: "Nodes",
    layout: "",
    path: "/nodes",
    icon: <Icon as={MdDataThresholding} width='20px' height='20px' color='inherit' />,
    component: Nodes,
    secondary: {network_select: true, blockchain_select: true}
  },
  {
    name: "Analytics",
    layout: "",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/analytics",
    component: NetworkAnalytics,
    secondary: {network_select: true, blockchain_select: true}
  },
  {
    name: "API Documentation",
    layout: "",
    path: "/api",
    icon: <Icon as={MdApi} width='20px' height='20px' color='inherit' />,
    component: Api,
    secondary: {network_select: false, blockchain_select: false},
    link: "https://app.swaggerhub.com/apis-docs/OTHUB/othub-api/1.0.0"
  },
];

export default routes;
