import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';
import MapView from 'react-native-maps';
import VideoPlayer from 'react-native-video';
import getDirections from 'react-native-google-maps-directions';

import store from '../../store.js';
import mapStyle from './mapStyle';
import styles from './styles';
import PopupDialog, { SlideAnimation, DialogButton } from 'react-native-popup-dialog';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../../actions/appActions';

class TrailMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: null,
        longitude: null,
        latitudeDelta: null,
        longitudeDelta: null
      }
    }
  };

  calcDelta(lat, lon, accuracy) {
    this.setState({
      region: {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015
      },
    });
  }

  onReceivedPostPress(imageIndex) {
    console.log('image index is!!!!', this.props.receivedPosts)
    this.props.imageURLChanged(this.props.receivedPosts[imageIndex].imageurl);
    console.log("HIIIIIII imageURL changed to: ", this.props.receivedPosts[imageIndex].imageurl);
    this.props.latitudeChanged(this.props.receivedPosts[imageIndex].latitude);
    this.props.longitudeChanged(this.props.receivedPosts[imageIndex].longitude);
  }

  onImagePressed(){
    this.props.imageClosed();
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        this.calcDelta(lat, lon, accuracy);
      }
    );
  }

  render () {
    var that = this;

    function getDistanceFromLatLonInMeters(lat1,lon1,lat2,lon2) {
      var R = 6371000; // Radius of the earth in meters
      var dLat = deg2rad(lat2-lat1);
      var dLon = deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in meters
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    function checkPic () {
      if (that.props.renderLatitude && (getDistanceFromLatLonInMeters(that.state.region.latitude, that.state.region.longitude, that.props.renderLatitude, that.props.renderLongitude) <= 170)){
        if (that.props.renderImageURL.indexOf('.jpg') >= 0) {
          return (
              <View>
                <TouchableHighlight onPress={function() { that.onImagePressed(); }}>
                  <Image
                    style={styles.photo}
                    source={{uri: that.props.renderImageURL}}
                  />
                </TouchableHighlight>
              </View>
            );
        } else if (that.props.renderImageURL.indexOf('.mp4') >= 0) {
          return (
            <View>
              <TouchableHighlight onPress={function() { that.onImagePressed(); }}>
                <VideoPlayer source={{uri: that.props.renderImageURL}}
                  rate={1.0}
                  volume={1.0}
                  muted={false}
                  paused={false}
                  resizeMode="cover"
                  repeat={true}
                  style={styles.video}
                />
              </TouchableHighlight>
            </View>
          );
        }
      } else {
        return (
          <View style={styles.slide1}>
            {that.state.latitude ?
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: that.state.region.latitude,
                  longitude: that.state.region.longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.015}}
                showsUserLocation={true}
                followsUserLocation={true}
                scrollEnabled={false}
                provider={'google'}
                customMapStyle={mapStyle}
                showsScale={true}
                onPress={function() { that.onImagePressed(); }}
              >
                <MapView.Marker
                  coordinate={{        
                    latitude: that.state.region.latitude,
                      longitude: that.state.region.longitude,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.015
                    }}
                >
                  <MapView.Callout style={styles.calloutStyle}>
                    <View>
                      <Text>
                        You are here
                      </Text>
                    </View>
                  </MapView.Callout>
                </MapView.Marker>
                <MapView.Marker
                  coordinate={{        
                      latitude: Number(that.props.renderLatitude),
                      longitude: Number(that.props.renderLongitude),
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.015
                    }}
                    pinColor={'aqua'}
                >
                  <MapView.Callout style={styles.calloutStyle}>
                    <View>
                      <Text>
                        Message is here
                      </Text>
                    </View>
                  </MapView.Callout>
                </MapView.Marker>
                <TouchableHighlight 
                  style={styles.directions}
                  onPress={function(){
                    getDirections({
                     source: {
                      latitude: that.state.region.latitude,
                      longitude: that.state.region.longitude
                      },
                      destination: {
                        latitude: Number(that.props.renderLatitude),
                        longitude: Number(that.props.renderLongitude)
                      }
                    })}
                  }
                >
                  <Text> Get directions </Text>
                </TouchableHighlight>
              </MapView> : null}
          </View>
        );
      }
    }

    var receivedMessages = function() {
      return that.props.receivedPosts.map( function(marker, i) {
          return (
            <MapView.Marker
                coordinate={{
                  latitude: Number(marker.latitude),
                  longitude: Number(marker.longitude)
                }}
                key={i}
                pinColor={'aqua'}
              >
                <MapView.Callout onPress={that.onReceivedPostPress.bind(that, i)} style={styles.calloutStyle}>
                  <View>
                    <Text>
                      {marker.username}
                    </Text>
                  </View>
                </MapView.Callout>
              </MapView.Marker>
        )})
    }
    if (this.props.renderImageURL) {
      // console.log('this.props.renderImageURL!!!!!!', this.props.renderImageURL);
      return checkPic();
    } else {
      return (
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          horizontal={false}
        >
          <View style={styles.slide1}>
            {this.state.region.latitude ?
              <MapView
                style={styles.map}
                initialRegion={this.state.region}
                showsUserLocation={true}
                followsUserLocation={true}
                scrollEnabled={false}
                provider={'google'}
                customMapStyle={mapStyle}
                showsScale={true}
              >
              <MapView.Circle
                center={{
                  latitude: this.state.region.latitude,
                  longitude: this.state.region.longitude
                }}
                radius={170}
                strokeWidth={3}
                strokeColor={'#cc3399'}
                zIndex={2}
              />
                <MapView.Marker
                  coordinate={this.state.region}
                >
                  <MapView.Callout style={styles.calloutStyle}>
                    <View>
                      <Text>
                        Alfred
                      </Text>
                    </View>
                  </MapView.Callout>
                </MapView.Marker>
                { receivedMessages() }
              </MapView> : null}
          </View>
          <View style={styles.slide1}>

          </View>
        </Swiper>
      );
    }
  }
}

const mapStateToProps = ({app}) => {
  const { isLoggedIn, sentPosts, receivedPosts, renderImageURL, renderLatitude, renderLongitude } = app;
  return {
    isLoggedIn,
    sentPosts,
    receivedPosts,
    renderImageURL,
    renderLatitude,
    renderLongitude
  };
};

const bundledActionCreators = Object.assign({}, appActions);

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(bundledActionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TrailMap);
