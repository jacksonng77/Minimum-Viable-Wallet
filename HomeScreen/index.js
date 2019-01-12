import React, { Component } from "react";
import HomeScreen from "./HomeScreen";
import ContractScreen from "../ContractScreen/index";
import PropertiesScreen from "../PropertiesScreen/index";
import SideBar from "../SideBar/SideBar";
import { createDrawerNavigator, createAppContainer } from "react-navigation";

global.Web3 = require("web3");
global.Tx = require("ethereumjs-tx");
global.web3 = new Web3(
  new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/<add your api key here>'),
);

const x = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Contract: { screen: ContractScreen },
    Properties: { screen: PropertiesScreen }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

const HomeScreenRouter = createAppContainer(x);

export default HomeScreenRouter;
