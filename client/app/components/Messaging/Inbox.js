import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  Alert
} from 'react-native';
import Swiper from 'react-native-swiper';
import VideoPlayer from 'react-native-video';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../../actions/appActions';

import styles from './styles';
import pinImg from './Pin.png';

import AddFriend from './AddFriend';

class Inbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
    }
  }

  onReceivedPostPress(imageurl, lat, long) {
    this.props.imageURLChanged(imageurl);
    // console.log('CHECK HERE!!!!!', this.props)
    this.props.latitudeChanged(lat);
    this.props.longitudeChanged(long);

  }

  onImagePressed() {
    this.props.imageClosed();
    console.log('IM IN HERE', this.props)
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      }
    );
  }

  render () {
    var that = this;
    // console.log('this.props', this.props);
    // console.log('this.state.latitude', this.state.latitude);
    // console.log('this.state.longitude', this.state.longitude);


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

    function check () {
      // console.log('SOIFJEIOSJFSIOEJFISE',that.state.latitude, that.state.longitude, that.props.renderLatitude, that.props.renderLongitude)
      console.log('USER IS THIS MANY METERS AWAY FROM MESSAGE', getDistanceFromLatLonInMeters(that.state.latitude, that.state.longitude, that.props.renderLatitude, that.props.renderLongitude))
      //if user is less than 200 meters away from message, he/she can view it (any less is too sensitive)
      if (that.props.renderLatitude && (getDistanceFromLatLonInMeters(that.state.latitude, that.state.longitude, that.props.renderLatitude, that.props.renderLongitude) <= 200)){
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
      } else {
        return (
          <View>
            <Text>TOO FAR, GET CLOSER</Text>
          </View>
        );
      }
    }
    var receivedMessages = function() {
      return (
        <View>
        { that.props.receivedPosts.map(function(post, i) {
          return (
            <TouchableHighlight
              onPress={that.onReceivedPostPress.bind(that, post.imageurl, post.latitude, post.longitude)}
              key={i}
            >
            <View>
              <View style={styles.postBody}>
                <Image source={pinImg}/>
                <Text style={styles.postName}>
                  {post.username}
                </Text>
                <Text style={styles.postDate}>
                  {post.timeposted}
                </Text>
              </View>
            </View>
            </TouchableHighlight>
          );
        })}
        </View>
      );
    };

    if (this.props.renderImageURL && this.props.renderLatitude) {
      // console.log('USER IS THIS MANY METERS AWAY FROM MESSAGE', getDistanceFromLatLonInMeters(this.state.latitude, this.state.longitude, that.props.renderLatitude, that.props.renderLongitude))
      // console.log('that.props.renderLatitude', that.props.renderLatitude)
      // console.log('HELLOOOO', this.state.latitude, this.state.longitude, that.props.renderLatitude, that.props.renderLongitude)
      if (this.props.renderImageURL.indexOf('.mp4') >= 0 && true) {
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
      } else if (this.props.renderImageURL.indexOf('.jpg') >= 0) {
        return check();
      }
    } else {
      return (
        <Swiper
          style={styles.wrapper}
          showsButtons={false}
          showsPagination={false}
          loop={false}
          index={1}
          horizontal={false}
        >
          <View>
            <AddFriend />
          </View>
          <View style={styles.heading}>
            <Text style={styles.text}>Inbox</Text>
            <ScrollView bounces={true}>
              { receivedMessages() }
            </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
