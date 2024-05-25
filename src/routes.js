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
  MdOutlineLibraryBooks
} from "react-icons/md";

// Admin Imports
import Api from "views/admin/api";
import DeepDive from "views/admin/deepdive";
import MainDashboard from "views/admin/default";
import KnowledgeAssets from "views/admin/knowledge-assets";
import NetworkAnalytics from "views/admin/network-analytics";
import Portal from "views/admin/my-othub/portal";
import Publish from "views/admin/my-othub/publish";
import Build from "views/admin/my-othub/build";
import Inventory from "views/admin/my-othub/inventory";
import Staking from "views/admin/my-othub/staking";
import Nodes from "views/admin/nodes";

const routes = [
  {
    name: "DKG Overview",
    layout: "",
    path: "/home",
    icon: <Icon as={MdDashboard} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
    secondary: {network_select: true, blockchain_select: true}
  },
  {
    name: "My OTHub",
    layout: "",
    path: "/portal",
    icon: <Icon as={MdStars} width='20px' height='20px' color='inherit' />,
    component: Portal,
    secondary: {network_select: false, blockchain_select: false}
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
    name: "Network Analytics",
    layout: "",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/network-analytics",
    component: NetworkAnalytics,
    secondary: {network_select: true, blockchain_select: true}
  },
  {
    name: "Nodes",
    layout: "",
    path: "/nodes",
    icon: <Icon as={MdComputer} width='20px' height='20px' color='inherit' />,
    component: Nodes,
    secondary: {network_select: true, blockchain_select: true}
  },
  {
    name: "DeepDive",
    layout: "",
    path: "/deepdive",
    icon: <Icon as={MdAnchor} width='20px' height='20px' color='inherit' />,
    component: DeepDive,
    secondary: {network_select: false, blockchain_select: false},
    link: "https://deepdive.othub.io/"
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
