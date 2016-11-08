import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Animated,
    PanResponder,
    Easing,
    Text
} from 'react-native'
import Card from './common/Card.js'
import CardSection from './common/CardSection.js';
import { connect } from 'react-redux';
import Button from './common/Button.js';
import ParkListDetail from './ParkListDetail.js';


class ParkList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      pan: new Animated.ValueXY()
    };

    this.panResponder = PanResponder.create({    //Step 2
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },
      onPanResponderMove           : Animated.event([null,{ //Step 3
        dy : this.state.pan.y
      }]),
      onPanResponderRelease        : (e, gesture) => {
        this.state.pan.flattenOffset();
      } //Step 4
    });
  }


  renderParkListDetails(parks){
    let parkIndex = 0;
    return parks.map((park, i) => <ParkListDetail onPress={() => this.onDetailPress(park.title)} touchable={true} navigator={this.props.navigator} index={parkIndex++} key={i} title={park.title} address={park.address} address_display={park.address_display} distance={park.distance} amenities={park.amenities} />)
  };

  slideValue = new Animated.Value(0);

  slideIn = () => {
    this.props.dispatch({type:'MAP_HIDE', state: false})
    Animated.timing(
        this.slideValue,
        {
          toValue: 1,
          duration: 1500,
          easing: Easing.elastic(1)
        }
    ).start()
  }

  slideOut = () => {
    Animated.timing(
        this.slideValue,
        {
          toValue: 0,
          duration: 1500,
          easing: Easing.elastic(1)
        }
    ).start()
  }

  onNextPress = () => {
      this.props.dispatch({type: 'SET_PARK_SURVEY', state: 'Suggest a Park'});
      this.props.navigator.push({name: 'parkName'});
  }

  onDetailPress = (title) => {
    this.props.dispatch({type: 'UPDATE_SElECTED_PARK', state: title});
    this.props.navigator.push({name:'parkdetail'});
  }


  render() {

    if(this.props.hideState) {
      this.slideOut();
    }

    const bottom = this.slideValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-400, 0]
    });


    const height = this.state.scrollY.interpolate({
      inputRange: [0, 1],
      outputRange: [400,401],
      extrapolate: 'clamp',
    })

// Test View
  //       <Animated.View
  //   {...this.panResponder.panHandlers}
  //   style={[this.state.pan.getLayout(), {height: 200, backgroundColor: 'blue'}]}>
  // <Text>Hi!</Text>
  // </Animated.View>

// Scroll animation for height.
    // scrollEventThrottle={16}
    // onScroll={Animated.event(
    //     [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
    // )}


// <Button bgcolor={'#fff'} text={'Close'} onPress={this.slideOut}/>


    return (
        <View style={styles.scrollConainer}>
          <Animated.View
              {...this.panResponder.panHandlers}
                 style={[this.state.pan.getLayout(), {position: 'absolute', zIndex: 2, bottom, left: 0, right: 0, }]}
          >
            <ScrollView bounces={false} style={styles.scrollView}
              scrollEnabled={false}
            >
              <Button bgcolor={'#fff'} text={' See Parks List '} onPress={this.slideIn.bind(this)}/>
              {this.renderParkListDetails(this.props.parks)}
              <Button bgcolor={'#f0382c'} text={'Suggest a park'} onPress={this.onNextPress.bind(this)}/>
            </ScrollView>
          </Animated.View>
        </View>
    )
  }
};


const styles = {
  scrollViewTitle: {
    alignSelf: 'center',
    fontSize: 15
  },
  scrollView : {
    height: 300,
    backgroundColor: '#fff'
  },
  scrollConainer: {
    alignSelf: 'stretch',
    padding: 5
  }
};

const mapStateToProps = (state) => {
  return {
    parks: state.getIn(['map', 'location', 'parks']),
    hideState: state.getIn(['map', 'hide'])
  }
}

export default connect(mapStateToProps)(ParkList);
