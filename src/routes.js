import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdStars,
  MdHome,
  MdComputer,
  MdDashboard,
  MdInventory,
  MdAnchor,
  MdApi,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import RTL from "views/admin/rtl";

// Auth Imports
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: "DKG Overview",
    layout: "",
    path: "/home",
    icon: <Icon as={MdDashboard} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
    secondary: {network_select: true, blockchain_select: false}
  },
  {
    name: "Knowledge Assets",
    layout: "",
    path: "/nft-marketplace",
    icon: (
      <Icon
        as={MdInventory}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: NFTMarketplace,
    secondary: {network_select: false, blockchain_select: false}
  },
  {
    name: "Publish",
    layout: "",
    path: "/nft-marketplace",
    icon: (
      <Icon
        as={MdInventory}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: NFTMarketplace,
    secondary: {network_select: false, blockchain_select: false}
  },
  {
    name: "Network Analytics",
    layout: "",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/data-tables",
    component: DataTables,
    secondary: {network_select: true, blockchain_select: true}
  },
  {
    name: "My OTHub",
    layout: "",
    path: "/profile",
    icon: <Icon as={MdStars} width='20px' height='20px' color='inherit' />,
    component: Profile,
    secondary: {network_select: false, blockchain_select: false}
  },
  {
    name: "Node Operators",
    layout: "",
    path: "/data-tables",
    icon: <Icon as={MdComputer} width='20px' height='20px' color='inherit' />,
    component: DataTables,
    secondary: {network_select: true, blockchain_select: true}
  },
  {
    name: "DeepDive",
    layout: "",
    path: "/data-tables",
    icon: <Icon as={MdAnchor} width='20px' height='20px' color='inherit' />,
    component: DataTables,
    secondary: {network_select: false, blockchain_select: false}
  },
  {
    name: "API Documentation",
    layout: "",
    path: "/data-tables",
    icon: <Icon as={MdApi} width='20px' height='20px' color='inherit' />,
    component: DataTables,
    secondary: {network_select: false, blockchain_select: false}
  },
];

export default routes;
