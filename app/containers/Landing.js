import React, { Component } from 'react';
import { View, Image, StyleSheet , Text} from 'react-native';
import Button from '../components/common/Button.js';

export default React.createClass ({
  render:function() {
    return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Text style={styles.title}>Welcome to Park Bark</Text>
            <Image source={require('../img/parkBarkLogo.jpg')}/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} type="text">Find dog parks near you.</Text>
            <Text style={styles.text}>
              Looking for just the perfect place to let your dog run free? Fenced? Water available? We've got all of the
              details you're looking for.
            </Text>
            <Button bgcolor={'#E79C23'} text={' --> '} onPress={this.onNextPress}/>
          </View>
        </View>
    );
  },

  onNextPress: function() {
    this.props.navigator.push({name: 'features'});
},


})


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#008eff',
    backgroundColor: '#F1F1F1'
  },
  imageContainer: {
    flex: 1.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1,
    padding: 1
  },
  title: {
    color: '#E79C23',
    fontSize: 30,
    fontWeight: "200"

  },
  text: {
    color: "#8E8E8E"
  }
});
