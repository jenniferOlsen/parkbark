import React, { Component } from 'react';
import {fromJS} from 'immutable';
import { AdMobBanner } from 'react-native-admob';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    BackAndroid
} from 'react-native';
var ResponsiveImage = require('react-native-responsive-image');
import Share from 'react-native-share';
import Button from '../components/common/Button';
import Card from '../components/common/Card.js';
import CardSection from '../components/common/CardSection.js';
import Amenity from '../components/amenity_filter/Amenity.js';
import ParkListDetail from '../components/park_list/ParkListDetail.js'
import FilterDetail from '../components/amenity_filter/FilterDetail';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';



class ParkDetail extends Component {
  constructor(props){
    super(props);
    this.pushToadCTA = this.pushToadCTA.bind(this);
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.pushToadCTA);
  };

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.pushToadCTA);
  }

  shouldComponentUpdate() {
      return false;
  }

  pushToadCTA() {
    if (this.props.adsRemoved) {
      return Actions.pop();
    }
    Actions.adCTA();
    return true;
  }


  renderFilters() {
    currentParkAmenities = this.props.currentPark.amenities.split(',').map((amenity) => amenity.trim());
    const matchingAmenities = [];
    const nonMatchingAmenities = [];

    //push matching amenities not rendered as images into array for rendering.
    this.props.amenities.map(filter => {
      if(currentParkAmenities.indexOf(filter.name) > -1 && currentParkAmenities.indexOf(filter.name) > 2) {
        filter.checked = true;
        matchingAmenities.push(filter);
      }
    });

    const amenities = matchingAmenities;
    return amenities.map(filter => <FilterDetail checked={filter.checked} disabled={true} key={filter.name} filter={filter.name}/>)
  }


  componentDidMount() {
    const {currentPark} = this.props;
     if (__DEV__) {
         console.log(this.bannerError);
     }
  }

  renderAmenities({amenities}){
    let amenityIndex = 0;
    return amenities.split(', ').map(amenity => <Amenity index={amenityIndex++} key={amenity} amenity={amenity}/>)
  }

  onBackPress() {
    if (this.props.adsRemoved) {
      return Actions.pop();
    }
    Actions.adCTA();
  }

  onSharePress() {
    let shareOptions = {
      title: "Park Bark is Awesome",
      message: "Hello!",
      url: "http://parkbarkapp.site",
      subject: 'Check out ' + this.props.currentPark.title
    };
    Share.open(shareOptions);
  }

  surveyPress() {
    const title = this.props.currentPark.title;
    const updateValue = {};
    updateValue.title = 'type';
    updateValue.value = 1;
    this.props.dispatch({type: 'SET_PARK_SURVEY', state: title});
    this.props.dispatch({type: 'UPDATE_SURVEY', state: updateValue});
    Actions.surveyNumDogs();
}

  onDetailPress() {
    lat = parseInt(this.props.currentPark.address.split(',')[0]);
    long = parseInt(this.props.currentPark.address.split(',')[1]);

    //IOS
    // var url = 'http://maps.apple.com/?daddr=' + this.props.currentPark.address;

  //ANDROID
    Linking.openURL(`http://maps.google.com/maps?daddr=${this.props.currentPark.address}`);
  }

  render(){
    const {currentPark} = this.props;
    return (
    <View style={styles.container}>
        <ScrollView bounces={false} style={styles.scrollview}>
            {/* Start top image stack */}
            <View style={styles.parkImage}>
              <ResponsiveImage
                  source={ currentPark.image ? {uri: currentPark.image} : require('../img/park_placeholder.png')}
                  initHeight="225"
              />
            </View>

            <View style={{position: 'absolute', top: 0}}>
                <ResponsiveImage
                    source={require('../img/gradient.png')}
                    initHeight='108'
                    initWidth='621'
                />
            </View>
            <TouchableOpacity
                onPress={this.onBackPress.bind(this)}
                style={{position: 'absolute', top: 20, left: 20}}>
              <Image style={{width: 25, height: 25, padding: 10}} source={require('../img/back-arrow@3x.png')}/>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.onSharePress.bind(this)}
                style={{position: 'absolute', top: 20, right: 20}}>
              <Image style={{width: 25, height: 27, padding: 10}} source={require('../img/share@2x.png')}/>
            </TouchableOpacity>
            {/* End top image stack */}

          <ParkListDetail key={currentPark.title} onPress={this.onDetailPress.bind(this)} title={currentPark.title} address={currentPark.address} address_display={currentPark.address_display} distance={currentPark.distance}/>
          <Card>
              {this.renderAmenities(currentPark)}
          </Card>
                  { this.props.adsRemoved ? null :
                    <Card>
                      <CardSection>
                        <AdMobBanner
                            bannerSize="banner"
                            //   adUnitID="ca-app-pub-3940256099942544/6300978111" // test
                            adUnitID="ca-app-pub-7642882868968646/2620967210" //Park Bark test
                            testDeviceID="EMULATOR"
                            didFailToReceiveAdWithError={this.bannerError} />
                      </CardSection>
                    </Card>
                  }
                { currentPark.details.length ?
                <Card>
                  <CardSection>
                    <View style={styles.parkDetails}>
                      <Text style={styles.detailsTitle}>PARK DETAILS</Text>
                      <Text style={styles.detailsText}>{currentPark.details}</Text>
                    </View>
                  </CardSection>
              </Card>
            : null}
          {this.renderFilters()}
        </ScrollView>
        <Button
          bgimage={require('../img/orange-gradient.png')}
          icon={require('../img/check-in@3x.png')}
          text={'  CHECK IN '}
          textColor={'#fff'}
          alignSelf={'flex-end'}
          fontSize={14}
          font={'Source Sans Pro 700'}
          onPress={this.surveyPress.bind(this)}
        />
    </View>
    )
  }
};

const styles = {
  container: {
     flexDirection: 'column',
     backgroundColor: '#fff',
  },
  scrollview: {
  },
  imageWrapper: {
    alignItems: 'stretch'
  },
  image: {
    height: 20
  },
  parkImage: {
      justifyContent: 'center',
      alignItems: 'stretch',
      zIndex: 0
  },
  parkDetails: {
    borderColor: '#f0f0f0',
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  detailsTitle: {
    fontFamily: 'ArchivoNarrow-Bold',
    fontSize: 11,
    color: '#838383',
    lineHeight: 19,
    paddingTop: 10 //reduced by half
  },
  detailsText: {
    fontFamily: 'Source Sans Pro 200',
    fontSize: 14,
    color: '#5e5e5e',
    lineHeight: 20
  }
}

const mapStateToProps = (state) => {
  return {
    amenities: state.getIn(['filter','amenities']).toJS(),
    currentPark: state.getIn(['map', 'location', 'parks']).find((park) => park['title'] === state.getIn(['parkdetail','current_park'])),
    position: state.getIn(['map','position']),
    adsRemoved: state.getIn(['core', 'adsRemove'])
  }
};

export default connect(mapStateToProps)(ParkDetail);
