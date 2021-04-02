import React from "react";
import mapProps from "recompose/mapProps";
import withSecured from "~/helpers/withSecured";
import { Route, Switch } from "react-router-dom";
import * as pages from "./pages";

const mergeProps = props => ownerProps => ({ ...props, ...ownerProps });
const All = props =>
  Object.entries(pages)
    .map(([_, e]) => e)
    .reduce((acc, val) => acc.concat(val), [])
    .map(({ component, render, protectedRoute, ...rest }) => (
      <Route
        key={rest.path}
        component={
          component &&
          (protectedRoute
            ? withSecured(mapProps(mergeProps(props))(component))
            : mapProps(mergeProps(props))(component))
        }
        render={
          render &&
          (protectedRoute
            ? withSecured(mapProps(mergeProps(props))(render))
            : mapProps(mergeProps(props))(render))
        }
        {...rest}
      />
    ));

const Routes = props => (
  <Switch>
    <All {...props} />
  </Switch>
);
export default Routes;
