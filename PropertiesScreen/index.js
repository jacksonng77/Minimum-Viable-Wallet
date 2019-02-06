import React from "react";
import { Alert  } from "react-native";
import { DrawerActions } from "react-navigation";
import {
  Button,
  Text,
  Container,
  Body,
  Content,
  Header,
  Left,
  Right,
  Icon,
  Title,
  Form
} from "native-base";
import { Formik } from 'formik';
import * as Yup from 'yup';
import NativeInput from '../components/nativeinput';
import Expo from 'expo';

export default class PropertiesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      loading: true, 
      status:'nothing',
      address:'', 
      wallet:'', 
    };
  }

  async componentWillMount() {

  }

  async componentDidMount(){
    this.props.navigation.addListener('didFocus', this._fetchData);
    this.props.navigation.addListener('didBlur', this._cancelFetch);
  }

  _fetchData = async () => {

    const keystore = await Expo.SecureStore.getItemAsync('key');
    if (keystore !== null) {
      this.setState({key: keystore});
      console.log(keystore);
    }

    const walletstore = await Expo.SecureStore.getItemAsync('wallet');
    if (walletstore !== null) {
      this.setState({wallet: walletstore});
      console.log(walletstore);
    }

    console.log(this.state.key);
    console.log(this.state.wallet);
  };

  _cancelFetch = () => {
    console.log("i am out");
  };

  _handleSubmit = async (values, bag) => {
    try {
      try {
        await Expo.SecureStore.setItemAsync('address', values.address);
        await Expo.SecureStore.setItemAsync('key', values.key);
        await Expo.SecureStore.setItemAsync('wallet', values.walletaddress);
        Alert.alert('Saved!');
      } catch (error) {
        // Error saving data
        console.log(error);
      }
    } catch (error) {
      bag.setSubmitting(false);
      bag.setErrors(error);
    }
  };

  render() {
    const { navigate } = this.props.navigation;
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
            <Title>Properties</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
                  <Formik
          enableReinitialize 
          initialValues={{ address: '0xa39b7738E8F709b3698690cF383061Aa94510ce5', key: this.state.key, walletaddress: this.state.wallet}}
          onSubmit={this._handleSubmit}
          validationSchema={Yup.object().shape({
            address: Yup.string()
              .required('Contract address is required'),
            walletaddress: Yup.string()
              .required('Wallet address is required'),
            key: Yup.string()
              .required('Wallet key required'),
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
              <Content padder>
              <Form>
              <NativeInput
                label="Contract Address"
                autoCapitalize="none"
                value={values.address}
                onChange={setFieldValue}
                onTouch={setFieldTouched}
                name="address"
                error={touched.address && errors.address}
              />
              <NativeInput
                label="Wallet Address"
                autoCapitalize="none"
                value={values.walletaddress}
                onChange={setFieldValue}
                onTouch={setFieldTouched}
                name="walletaddress"
                error={touched.walletaddress && errors.walletaddress}
              />
              <NativeInput
                label="Wallet Key"
                autoCapitalize="none"
                value={values.key}
                onChange={setFieldValue}
                onTouch={setFieldTouched}
                name="key"
                error={touched.key && errors.key}
              />
              <Button
                backgroundColor="blue"
                onPress={handleSubmit}
                loading={isSubmitting}
                block
              >
                <Text>Save</Text>
              </Button>
              </Form>
              </Content>
            </React.Fragment>
          )}
        />
        </Content>
      </Container>
    );
  }
}
