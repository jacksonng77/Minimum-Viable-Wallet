import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Text } from 'native-base'

class NativeInput extends Component {
  _handleChange = value => {
    this.props.onChange(this.props.name, value);
  };

  _handleTouch = () => {
    this.props.onTouch(this.props.name);
  };

  render() {
    const { label, error, ...rest } = this.props;
    return (
      <View style={styles.root}>
        <Item stackedLabel>
              <Label>{label}</Label>
              <Input  
                onChangeText={this._handleChange}
                onBlur={this._handleTouch}
                {...rest}             
              />
        </Item>
        {error && <Text>{error}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: '90%',
    alignSelf: 'center',
  },
});

export default NativeInput;