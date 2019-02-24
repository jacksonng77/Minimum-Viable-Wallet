import React from "react";
import { AppRegistry, View, StatusBar, AsyncStorage, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationActions, DrawerActions } from "react-navigation";
import "../global";
import Expo from 'expo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import NativeInput from '../components/nativeinput';
import {
  Form, Button, Text, Container, Card, CardItem, Body, Content, Header, Left, Right,
  Icon, Title, Spinner, Input, InputGroup, Item, Tab, Tabs, Footer, FooterTab, Label
} from "native-base";
import HomeScreen from "../HomeScreen";
const bytecode = "60806040526040516103dc3803806103dc8339810180604052810190808051820192919050505061003e81610044640100000000026401000000009004565b50610103565b806000908051906020019061005a92919061005e565b5050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061009f57805160ff19168380011785556100cd565b828001600101855582156100cd579182015b828111156100cc5782518255916020019190600101906100b1565b5b5090506100da91906100de565b5090565b61010091905b808211156100fc5760008160009055506001016100e4565b5090565b90565b6102ca806101126000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680634ed3885e146100515780636d4ce63c146100ad575b600080fd5b6100ab600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061013d565b005b3480156100b957600080fd5b506100c2610157565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101025780820151818401526020810190506100e7565b50505050905090810190601f16801561012f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b80600090805190602001906101539291906101f9565b5050565b606060008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156101ef5780601f106101c4576101008083540402835291602001916101ef565b820191906000526020600020905b8154815290600101906020018083116101d257829003601f168201915b5050505050905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061023a57805160ff1916838001178555610268565b82800160010185558215610268579182015b8281111561026757825182559160200191906001019061024c565b5b5090506102759190610279565b5090565b61029b91905b8082111561029757600081600090555060010161027f565b5090565b905600a165627a7a72305820acbd38924434f79e6eb8147d3bd84f6faa376aaf2f56040cf0ff6ce0449b3f2f0029";
const myinterface = [{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"set","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"x","type":"string"}],"payable":true,"stateMutability":"payable","type":"constructor"}];

export default class ContractScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      key: '', 
      address:'', 
      wallet:'',
      status:'',
      storevalue:'',
      buttonstate:false,
      ethbalance:0,
    };
  }

  getethbalance = () => {
    global.web3.eth.getBalance(this.state.wallet).then((balance) => {
      this.setState({ethbalance: global.web3.utils.fromWei(balance, 'ether')});
    });
  };

  _fetchData = async () => {
    const addressstore = await Expo.SecureStore.getItemAsync('address');
    if (addressstore !== null) {
      // We have data!!
      this.setState({address: addressstore});
      console.log(addressstore);
    }

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

    global.web3.eth.getBlock('latest').then((blockstatus) => {
      this.setState({status: blockstatus});
    });

    let contract = new global.web3.eth.Contract(myinterface, JSON.parse(JSON.stringify(this.state.address)));
    contract.methods.get().call((error, result) => {
      
    }).then((receipt) => {
      console.log(receipt);
      this.setState({storevalue: receipt});
    });

    this.getethbalance();
  };

  _cancelFetch = () => {

  };

  async componentDidMount() {
    this.props.navigation.addListener('didFocus', this._fetchData);
    this.props.navigation.addListener('didBlur', this._cancelFetch);
  }

  _handleSubmit = async (values, bag) => {
    const contract = new global.web3.eth.Contract(
      myinterface,
      this.state.address
    );
    const query = contract.methods.set(values.mystring);
    const encodedABI = query.encodeABI();
    console.log(encodedABI);
      
    global.web3.eth.getTransactionCount(this.state.wallet).then(txCount => {
      const txOptions = {
        from: this.state.wallet,
        to: this.state.address,
        nonce: global.web3.utils.toHex(txCount),
        gasLimit: global.web3.utils.toHex(800000),
        gasPrice: global.web3.utils.toHex(20000000000),
        gas: global.web3.utils.toHex(2000000),
        data: encodedABI
      }
      var tx = new global.Tx(txOptions);
      var privateKey = new Buffer(this.state.key, 'hex');
      tx.sign(privateKey);
      var serializedTx = tx.serialize();
      this.setState({buttonstate:true});
      global.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .on('confirmation', (confirmationNumber, receipt) => {
            console.log('=> confirmation: ' + confirmationNumber);
          })
          .on('transactionHash', hash => {
            console.log('=> hash');
            console.log(hash);
          })
          .on('receipt', receipt => {
            console.log('=> reciept');
            console.log(receipt);
            let contract = new global.web3.eth.Contract(myinterface, JSON.parse(JSON.stringify(this.state.address)));
            contract.methods.get().call((error, result) => {
              
            }).then((receipt) => {
              console.log(receipt);
              this.setState({storevalue: receipt});
              this.setState({buttonstate:false});
              this.getethbalance();
            });
            console.log(receipt);
          })
          .on('error', console.error);
      });
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
            <Title>Contract</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <Text>String in contract: {this.state.storevalue}</Text>
          <Text>Contract Address: {this.state.address}</Text>
          <Text>Wallet Balance: {this.state.ethbalance}</Text>
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
                          <NativeInput
                            label="My String"
                            autoCapitalize="none"
                            value={values.mystring}
                            onChange={setFieldValue}
                            onTouch={setFieldTouched}
                            name="mystring"
                            error={touched.mystring && errors.mystring}
                            disabled={this.state.buttonstate}
                          />
                          <View style={styles.root}>
                           <Button
                            onPress={handleSubmit}
                            loading={isSubmitting}
                            block
                            disabled={this.state.buttonstate}
                            light={this.state.buttonstate}
                          > 
                            <Text>Save</Text>
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
