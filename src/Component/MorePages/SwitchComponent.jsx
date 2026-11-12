
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Platform,
} from 'react-native';

const SwitchComponent = ({
  label,
  description,
  value = false,
  onValueChange,
  disabled = false,
  containerStyle,
  labelStyle,
  descriptionStyle,
}) => {

  const handleToggle = () => {
    if (disabled) return;
    onValueChange?.(!value);
  };

  const renderSwitch = () => {
    // Native iOS Switch
    if (Platform.OS === 'ios') {
      return (
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: '#D4D4D8',
            true: '#0085FF',
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#D4D4D8"
          style={styles.iosSwitch}
        />
      );
    }

    // Custom Android Switch - Figma Design
    return (
      <Pressable
        onPress={handleToggle}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        style={[
          styles.androidTrack,
          {
            backgroundColor: value ? '#0085FF' : '#D4D4D8',
            opacity: disabled ? 0.55 : 1,
            alignItems: value ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        <View style={styles.androidThumb} />
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.textContainer}>
        {label ? (
          <Text style={[styles.label, labelStyle]}>
            {label}
          </Text>
        ) : null}

        {description ? (
          <Text style={[styles.description, descriptionStyle]}>
            {description}
          </Text>
        ) : null}
      </View>

      {renderSwitch()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  textContainer: {
    flex: 1,
    marginRight: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
  },

  description: {
    fontSize: 14,
    color: '#71717A',
    marginTop: 5,
  },

  // iOS native switch
  iosSwitch: {
    transform: [{ scale: 1 }],
  },

  // Android custom switch
  androidTrack: {
    width: 52,
    height: 32,
    borderRadius: 30,
    padding: 2,
    justifyContent: 'center',
  },

  androidThumb: {
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
});

export default SwitchComponent;



// lable and switch ==>
//   <View style={{ padding: 20 }}>
//       <SwitchComponent
//         label="Allow Notifications"
//         description="Receive push notifications on your device"
//         value={notificationEnabled}
//         onValueChange={setNotificationEnabled}
//       />
//     </View>



// switch only ==>
//  <SwitchComponent
//         // label="Allow Notifications"
//         // description="Receive push notifications on your device"
//         value={notificationEnabled}
//         onValueChange={setNotificationEnabled}
//         disabled
//       />
