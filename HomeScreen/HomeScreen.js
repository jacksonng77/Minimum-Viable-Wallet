import React from "react";
import { View, StatusBar, AsyncStorage, Alert, StyleSheet, ActivityIndicator } from "react-native";
import {
  Form,
  Button,
  Text,
  Container,
  Body,
  Content,
  Header,
  Title,
  Left,
  Icon,
  Right,
  Spinner
} from "native-base";
import "../global";
import Expo from 'expo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DrawerActions } from 'react-navigation';
import crypto from "crypto";
import randomBytes from "randombytes";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      buttonstate:false,
      key: '', 
      address:'', 
    };
  }

  _handleSubmit = async (values, bag) => {
    var x = global.web3.eth.accounts.create(web3.utils.randomHex(32));
    await Expo.SecureStore.setItemAsync('key', x.privateKey.substring(2));
    await Expo.SecureStore.setItemAsync('wallet', x.address);
    this.setState({address: x.address});
    this.setState({key: x.privateKey.substring(2)});
    console.log("myaddress:" + x.address);
    console.log("mykey:" + x.privateKey.substring(2));
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Ethereum App</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
        <Text>Wallet: {this.state.address}</Text>
        <Text>Key: {this.state.key}</Text>
        <Formik
                    initialValues={{ mystring: 'ellie'}}
                    onSubmit={this._handleSubmit}
                    validationSchema={Yup.object().shape({
                      mystring: Yup.string()
                        .required('String is required'),
                    })}
                    render={({
                      values,
                      handleSubmit,
                      setFieldValue,
                      errors,
                      touched,
                      setFieldTouched,
                      isValid,
                      isSubmitting,
                    }) => (
                      <React.Fragment>
                        <Container>
                        <Content padder>
                          <Form>
                            <View style={styles.root}>
                              <Button
                                onPress={handleSubmit}
                                loading={isSubmitting}
                                block
                                disabled={this.state.buttonstate}
                                light={this.state.buttonstate}
                              > 
                              <Text>Create Account</Text>
                              </Button>
                            </View>
                          </Form>
                          <Spinner
                          color="red" 
                          style={
                            {
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: this.state.buttonstate?1:0
                            }}
                        />
                        </Content>
                        </Container>
                      </React.Fragment>
                    )}
            />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: '90%',
    alignSelf: 'center',
    margin:10,
  },
});