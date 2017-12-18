import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import isEqual from 'lodash/isEqual';
import * as gameActions from '../../../modules/actions/gameActions';
import MapComponent from './MapComponent';
import Header from './Header';
import Panel from './Panel';
import { Container } from './style';

const getCurrentRoute = nav => {
  const findCurrentRoute = navState =>
  navState.index !== undefined
    ? findCurrentRoute(navState.routes[navState.index])
    : navState.routeName;

  return findCurrentRoute(nav);
};

class NavigatorScreen extends Component {
  constructor(props) {
    super(props);
    this.navigateBack = this.navigateBack.bind(this);
  }

  componentDidMount() {
    if (this.props.beacon.proximity === 'opencamera') {
      this.props.navigation.navigate('HotNotificationScreen');
    }
  }

  componentWillUpdate(nextProps) {
    if (getCurrentRoute(nextProps.nav) === 'NavigatorScreen' && !isEqual(this.props.beacon.proximity, nextProps.beacon.proximity)
      && nextProps.beacon.proximity === 'opencamera') {
      this.props.navigation.navigate('HotNotificationScreen');
    }
  }

  navigateBack() {
    this.props.unselectBeacon();
    this.props.navigation.navigate('ObjectivesScreen');
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle="dark-content" />
        <Header navigateBack={() => this.navigateBack()} />
        <MapComponent />
        <Panel />
      </Container>
  );
  }
}

NavigatorScreen.propTypes = {
  beacon: PropTypes.object.isRequired,
  unselectBeacon: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  beacon: state.game.selectedBeacon,
  nav: state.nav,
});

const mapDispatchToProps = (dispatch) =>
bindActionCreators({
  unselectBeacon: () => gameActions.unselectBeacon(),
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorScreen);
