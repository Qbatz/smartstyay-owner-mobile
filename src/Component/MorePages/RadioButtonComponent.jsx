
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

const RadioButtonComponent = ({
  title,
  description,
  value,
  selectedValue,
  onValueChange,
  selected,
  onPress,
  error = false,
  errorMessage = '',
  disabled = false,
  focused = false,
  containerStyle,
  titleStyle,
  descriptionStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const isSelected =
    selected !== undefined
      ? selected
      : selectedValue !== undefined
        ? selectedValue === value
        : false;

  const isActiveFocus = focused || isFocused;

  const handlePress = () => {
    if (disabled) return;

    onValueChange?.(value);
    onPress?.();
  };

  const radioColor = disabled
    ? '#80BFFF'
    : error
      ? '#FF3333'
      : '#0085FF';

  return (
    <Pressable
      onPress={handlePress}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      disabled={disabled}
      focusable={!disabled}
      accessibilityRole="radio"
      accessibilityState={{
        checked: isSelected,
        disabled,
      }}
      style={[styles.container, containerStyle]}
    >
      {/* Radio Icon */}
      <View style={styles.radioWrapper}>
        <View
          style={[
            styles.radioOuter,
            isSelected && {
              backgroundColor: radioColor,
              borderColor: radioColor,
            },
            !isSelected && {
              borderColor: error
                ? '#FF3333'
                : disabled
                  ? '#F4F4F5'
                  : '#E4E4E7',
            },
            isActiveFocus && !disabled && {
              borderColor: error ? '#FF3333' : '#0085FF',
            },
            isActiveFocus && {
              shadowColor: error ? '#FF3333' : '#0085FF',
              shadowOpacity: 0.15,
              shadowRadius: 5,
              elevation: 2,
            },
          ]}
        >
          {isSelected && (
            <View style={styles.radioInner} />
          )}
        </View>

        {/* Focus Ring */}
        {isActiveFocus && (
          <View
            pointerEvents="none"
            style={[
              styles.focusRing,
              {
                borderColor: disabled
                  ? 'transparent'
                  : error
                    ? '#FF3333'
                    : '#DCEBFF',
              },
            ]}
          />
        )}
      </View>

      {/* Title and Description */}
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
    paddingVertical: 10,
    width: '100%',
  },

  radioWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },

  focusRing: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
  },

  content: {
    flex: 1,
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

export default RadioButtonComponent;



// import React, { useState } from 'react';
// import { View } from 'react-native';
// import RadioButtonComponent from '../../components/common/RadioButtonComponent';

// const PaymentScreen = () => {
//   const [paymentType, setPaymentType] = useState('cash');

//   return (
//     <View style={{ padding: 20 }}>

//       <RadioButtonComponent
//         title="Cash"
//         description="Pay through cash"
//         value="cash"
//         selectedValue={paymentType}
//         onValueChange={setPaymentType}
//       />

//       <RadioButtonComponent
//         title="Bank Transfer"
//         description="Pay through bank account"
//         value="bank"
//         selectedValue={paymentType}
//         onValueChange={setPaymentType}
//       />

//       <RadioButtonComponent
//         title="UPI"
//         description="Pay through UPI"
//         value="upi"
//         selectedValue={paymentType}
//         onValueChange={setPaymentType}
//       />

//     </View>
//   );
// };

// export default PaymentScreen;


// Error show pana ==> 


{/* <RadioButtonComponent
  title="Monthly"
  description="Monthly payment"
  value="monthly"
  selectedValue={paymentType}
  onValueChange={setPaymentType}
  error={true}
  errorMessage="Please select a payment type"
/> */}


// Disabled state 

{/* <RadioButtonComponent
  title="Yearly"
  description="Yearly payment"
  value="yearly"
  selectedValue={paymentType}
  onValueChange={setPaymentType}
  disabled={true}
/> */}



