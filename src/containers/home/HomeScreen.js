import { Container, Icon, Text, Title, View } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, BackHandler,
  Modal,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import WebView from 'react-native-webview';
import commonColor from '../../../native-base-theme/variables/commonColor';
import Joystick from '../../components/Joystick';
import Localization from '../../constants/i18/Localization';
import styles from './styles';

// eslint-disable-next-line react/prop-types
const HomeScreen = ({ navigation }) => {
  const webViewRef = useRef();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [exitApp, setExitApp] = useState(0);
  const [closeJoystick, setCloseJoystick] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [baseUrl, setBaseUrl] = useState('https://www.bj-deal.com/');

  useEffect(() => {
    stateChange();
    const backAction = () => {
      // setTimeout(() => {
      //   setExitApp(0);
      // }, 5000); // 2 seconds to tap second-time

      // if (exitApp === 0) {
      //   setExitApp(exitApp + 1);

      //   ToastAndroid.show("tap again to exit the app", ToastAndroid.SHORT);
      // } else if (exitApp === 1) {
      //   BackHandler.exitApp();
      // }

      Actions.currentScene === 'homeScreen'
        ? canGoBack === false
          ? setModalVisible(true)
          : handleBackPress()
        : Actions.homeScreen();
      // Alert.alert("Exit Bj-deal!", "Are you sure you want to exit the app?", [
      //   {
      //     text: "Cancel",
      //     onPress: () => null,
      //     style: "cancel"
      //   },
      //   { text: "YES", onPress: () => BackHandler.exitApp() }
      // ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  function stateChange() {
    console.log('WebViewRef: ', webViewRef);
    if (webViewRef.current?.state?.lastErrorEvent?.code == -2) {
      console.log('WebViewRef == -2 ', webViewRef.current.state?.lastErrorEvent?.code);
      setLoaded(false);
    } else {
      console.log('WebViewRef != -2 ', webViewRef.current.state?.lastErrorEvent?.code);
      setLoaded(true);
    }
    console.group(loaded);
  }

  async function handleBackPress() {
    await webViewRef.current.goBack();
  }

  async function handleForwardPress() {
    await webViewRef.current.goForward();
  }

  async function theme() {
    await webViewRef.current.reload();
    console.log('Theme: ', webViewRef.current.getCommands());
  }

  function refresh() {
    webViewRef.current?.reload();
  }
  async function getJsonData() {
    try {
      const res = await fetch('https://facebook.github.io/react-native/movies.json');
      const json = await res.json();
      console.group(json);
      return json.data;
    } catch (error) {
      console.error(error);
    }
  }

  const ActivityIndicatorElement = () => (
    <View style={styles.activityIndicator}>
      <ActivityIndicator color={commonColor.brandPrimary} size="large" />
    </View>
  );

  return (
    <Container style={styles.container}>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={async () => {
          // await Alert.alert('Modal has been closed.');
          ToastAndroid.show('Modal has been closed.', ToastAndroid.LONG);
          setModalVisible(false);
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={styles.modal}>
            <Title
              style={{
                color: commonColor.brandPrimary,
                fontWeight: 'bold',
                alignSelf: 'center',
                fontSize: 22,
              }}
            >
              Bj-deal !!
            </Title>
            <Text style={{ textAlign: 'center', fontSize: 18 }}>
              {Localization.exit}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginRight: 10,
              }}
            >
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => {
                  console.log('current page: ', Actions.currentScene);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modal.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  BackHandler.exitApp();
                }}
              >
                <Text style={{ fontWeight: '700' }}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.webViewContainer}>
        <WebView
          userAgent="MobileApp-Baneck-Android-Webview"
          ref={webViewRef}
          source={{ uri: baseUrl }}
          onNavigationStateChange={(state) => {
            const back = state.canGoBack;
            const forward = state.canGoForward;
            setCanGoBack(back);
            setCanGoForward(forward);
            stateChange();
            setCloseJoystick(true);
          }}
          onLoadStart={() => setVisible(true)}
          onLoad={() => setVisible(false)}
        />
        {visible ? <ActivityIndicatorElement /> : null}
      </View>

      <View style={styles.navigationContainer}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: commonColor.inverseTextColor,
            height: 50,
            flexDirection: 'row',
            elevation: 80,
            shadowColor: commonColor.textColor,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            flex: 1,
          }}
        >
          <Icon
            name="chevron-back"
            onPress={() => {
              handleBackPress();
            }}
            style={{
              color: canGoBack ? commonColor.textColor : commonColor.inactiveTab,
            }}
          />
          <View
            style={{
              backgroundColor: commonColor.inverseTextColor,
              borderRadius: 100,
              width: 120,
              height: 120,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              elevation: 20,
              shadowColor: commonColor.textColor,
              marginRight: 50,
              marginLeft: 50,
              marginBottom: -40,
            }}
          >
            <TouchableOpacity
              style={{
                // backgroundColor: commonColor.brandPrimary,
                borderRadius: 50,
                width: 45,
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
                // elevation: 2,
                shadowColor: commonColor.textColor,
                marginBottom: 40,
                // marginRight:60,
                // marginLeft: 60,
              }}
              onPress={() => {
                Actions.homeScreen();
              }}
              // onPress={() => {Actions.HomeScreen({navigation:navigation, bonjour:'hello word'}), console.log(bonjour)} }
            >
              <Icon name="home" style={{ color: commonColor.brandPrimary, fontSize: 20 }} />
            </TouchableOpacity>
          </View>
          <Icon
            name="chevron-forward"
            style={{
              color: canGoForward ? commonColor.textColor : commonColor.inactiveTab,
            }}
            onPress={() => {
              handleForwardPress();
            }}
          />
        </View>

        {/* {canGoBack && visible == false ? ( */}
        {/* <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleBackPress(); */}
        {/* }}
            >
              <Text style={styles.buttonTitle}>Back</Text> */}
        {/* <Icon name='arrow-back' /> */}
        {/* </TouchableOpacity>
          ) : null} */}
        {/* {canGoForward && visible == false ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleForwardPress();
                console.log('loaded: ', loaded);
              }}
            >
              <Text style={styles.buttonTitle}>Forward</Text>
            </TouchableOpacity>
          ) : null} */}
        {/* </View> */}
      </View>
      <Joystick navigation={navigation} reload={refresh} home closeJoystick={closeJoystick} />
    </Container>
  );
};
export default HomeScreen;
