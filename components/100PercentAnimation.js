import React from 'react';
import LottieView from 'lottie-react-native';

export default class RateAnimation extends React.Component {
  render() {
    return (
      <LottieView
      source={require('../assets/152-100-percent.json')}
      style={{width:"20%"}}
      autoPlay loop />
    )
  }
}
