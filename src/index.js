import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import RtlLayout from "layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { AccountProvider } from "./AccountContext";
import { Buffer } from 'buffer';
global.Buffer = Buffer;

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <AccountProvider>
        <ThemeEditorProvider>
          <Router>
            <Switch>
              <Route path="/auth" component={AuthLayout} />
              <Route path="/admin" component={AdminLayout} />
              <Route path="/rtl" component={RtlLayout} />
              <Route path="/" component={AdminLayout} />
              <Redirect from="*" to="/home" />
            </Switch>
          </Router>
        </ThemeEditorProvider>
      </AccountProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
