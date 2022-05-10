import { Icon, View } from 'native-base';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import commonColor from '../../native-base-theme/variables/commonColor';
import styles from '../containers/home/styles';
import Buttons from './Buttons';

const Joystick = ({ navigation, reload, home }) => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <View
      style={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        alignSelf: 'flex-end',
      }}
    >
      {openMenu ? (
        <View style={styles.menu}>
          <Buttons
            style={{ borderTopLeftRadius: 50 }}
            navigation={navigation}
            reload={reload}
            home={home}
          />
        </View>
      ) : null}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          setOpenMenu(!openMenu);
          // navigation.navigate('buttons')
        }}
      >
        <Icon
          name={!openMenu ? 'chevron-back' : 'chevron-forward'}
          style={{ color: commonColor.brandPrimary }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Joystick;
