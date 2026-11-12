
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

const CheckboxComponent = ({
  title,
  description,
  value = false,
  onValueChange,
  error = false,
  errorMessage = '',
  disabled = false,
  focused = false,
  containerStyle,
  titleStyle,
  descriptionStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isActiveFocus = focused || isFocused;

  const getCheckboxColor = () => {
    if (disabled) return '#80BFFF';
    if (error) return '#FF3333';
    if (isHovered) return '#3392FF';
    return '#0085FF';
  };

  const checkboxColor = getCheckboxColor();

  const handlePress = () => {
    if (disabled) return;
    onValueChange?.(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      disabled={disabled}
      focusable={!disabled}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: value,
        disabled,
      }}
      style={[
        styles.container,
        containerStyle,
      ]}
    >
      {/* Checkbox */}
      <View style={styles.checkboxWrapper}>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: value
                ? checkboxColor
                : '#FFFFFF',
              borderColor: value
                ? checkboxColor
                : error
                  ? '#FF3333'
                  : disabled
                    ? '#F4F4F5'
                    : '#E4E4E7',
            },
          ]}
        >
          {value && (
            <View style={styles.checkIcon}>
              <View style={styles.checkLineOne} />
              <View style={styles.checkLineTwo} />
            </View>
          )}
        </View>

        {/* Focus Ring */}
        {isActiveFocus && (
          <View
            pointerEvents="none"
            style={[
              styles.focusRing,
              {
                borderColor: error
                  ? '#FF3333'
                  : '#DCEBFF',
              },
            ]}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {title ? (
          <Text
            style={[
              styles.title,
              error && styles.errorText,
              disabled && styles.disabledTitle,
              titleStyle,
            ]}
          >
            {title}
          </Text>
        ) : null}

        {description ? (
          <Text
            style={[
              styles.description,
              disabled && styles.disabledDescription,
              descriptionStyle,
            ]}
          >
            {description}
          </Text>
        ) : null}

        {error && errorMessage ? (
          <Text style={styles.errorMessage}>
            {errorMessage}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 8,
  },

  checkboxWrapper: {
    width: 40,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 2,
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  checkIcon: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkLineOne: {
    position: 'absolute',
    width: 5,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    transform: [
      { rotate: '45deg' },
      { translateX: -3 },
      { translateY: 2 },
    ],
  },

  checkLineTwo: {
    position: 'absolute',
    width: 9,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    transform: [
      { rotate: '-50deg' },
      { translateX: 2 },
      { translateY: 0 },
    ],
  },

  focusRing: {
    position: 'absolute',
    top: -1,
    left: -3,
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 3,
  },

  content: {
    flex: 1,
    paddingTop: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#18181B',
  },

  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#71717A',
    marginTop: 5,
  },

  errorText: {
    color: '#FF3333',
  },

  errorMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FF3333',
    marginTop: 5,
  },

  disabledTitle: {
    color: '#A1A1AA',
  },

  disabledDescription: {
    color: '#B4B4BA',
  },
});

export default CheckboxComponent;




// import React, { useState } from 'react';
// import { View } from 'react-native';
// import CheckboxComponent from '../../components/common/CheckboxComponent';

// const CheckInScreen = () => {
//   const [isAccepted, setIsAccepted] = useState(false);

//   return (
//     <View style={{ padding: 20 }}>
//       <CheckboxComponent
//         title="Accept Terms & Conditions"
//         description="I agree to the terms and conditions"
//         value={isAccepted}
//         onValueChange={setIsAccepted}
//       />
//     </View>
//   );
// };

// export default CheckInScreen;



// Error state



// <CheckboxComponent
//   title="Accept Terms & Conditions"
//   description="Please accept before continuing"
//   value={false}
//   onValueChange={setIsAccepted}
//   error={true}
//   errorMessage="This field is required"
// />



// Disabled state


{/* <CheckboxComponent
  title="Email Notifications"
  description="Receive updates through email"
  value={true}
  disabled={true}
/> */}

