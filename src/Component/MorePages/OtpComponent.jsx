
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Platform,
} from 'react-native';

const OtpComponent = ({
    value,
    defaultValue = '',
    onChangeText,
    onComplete,

    length = 6,
    secureTextEntry = true,

    label,
    description,

    error = false,
    errorMessage = '',
    disabled = false,

    autoFocus = false,
    enableAutoFill = true,

    boxWidth = 48,
    boxHeight = 48,
    boxGap = 8,
    separatorAfter,

    containerStyle,
    boxStyle,
    textStyle,
}) => {
    const inputRef = useRef(null);

    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isControlled = value !== undefined;

    const inputValue = String(
        isControlled ? value : internalValue
    ).replace(/\D/g, '').slice(0, length);

    const activeIndex = inputValue.length;

    const handleChange = (text) => {
        if (disabled) return;

        // Allow only numeric values and support paste
        const numericValue = text
            .replace(/\D/g, '')
            .slice(0, length);

        if (!isControlled) {
            setInternalValue(numericValue);
        }

        onChangeText?.(numericValue);

        if (numericValue.length === length) {
            inputRef.current?.blur();
            onComplete?.(numericValue);
        }
    };

    const handleFocus = () => {
        if (!disabled) {
            setIsFocused(true);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleContainerPress = () => {
        if (!disabled) {
            inputRef.current?.focus();
        }
    };

    const getBoxBorderColor = (index) => {
        if (error) return '#FF3333';

        if (isFocused && index === activeIndex && activeIndex < length) {
            return '#0085FF';
        }
        if (isHovered && !disabled && !isFocused) {
            return '#D4D4D8';
        }

        if (disabled) return '#F4F4F5';

        return '#E4E4E7';
    };

    const getBoxBackground = () => {
        return disabled ? '#FAFAFA' : '#FFFFFF';
    };

    const renderBoxes = () => {
        return Array.from({ length }, (_, index) => {
            const digit = inputValue[index];
            const isActive =
                isFocused &&
                index === activeIndex &&
                activeIndex < length &&
                !error &&
                !disabled;

            return (
                <React.Fragment key={index}>
                    <View
                        style={[
                            styles.box,
                            {
                                width: boxWidth,
                                height: boxHeight,
                                backgroundColor: getBoxBackground(),
                                borderColor: getBoxBorderColor(index),
                                borderWidth: isActive || error ? 1.5 : 1,
                            },
                            isActive && styles.focusBox,
                            disabled && styles.disabledBox,
                            boxStyle,
                        ]}
                    >
                        {digit !== undefined ? (
                            <Text
                                style={[
                                    styles.digit,
                                    disabled && styles.disabledDigit,
                                    textStyle,
                                ]}
                            >
                                {secureTextEntry ? '●' : digit}
                            </Text>
                        ) : isActive ? (
                            <View style={styles.cursor} />
                        ) : null}
                    </View>

                    {separatorAfter === index + 1 &&
                        index !== length - 1 && (
                            <View style={styles.separatorContainer}>
                                <View style={styles.separator} />
                            </View>
                        )}
                </React.Fragment>
            );
        });
    };

    return (
        <View style={[styles.container, containerStyle]}>

            {label ? (
                <Text
                    style={[
                        styles.label,
                        error && styles.errorText,
                        disabled && styles.disabledText,
                    ]}
                >
                    {label}
                </Text>
            ) : null}

            {description ? (
                <Text
                    style={[
                        styles.description,
                        disabled && styles.disabledText,
                    ]}
                >
                    {description}
                </Text>
            ) : null}

            <Pressable
                onPress={handleContainerPress}
                onHoverIn={() => setIsHovered(true)}
                onHoverOut={() => setIsHovered(false)}
                disabled={disabled}
                style={[
                    styles.inputRow,
                    {
                        gap: boxGap,
                    },
                ]}
            >
                {renderBoxes()}

                <TextInput
                    ref={inputRef}
                    value={inputValue}
                    onChangeText={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    keyboardType="number-pad"
                    maxLength={length}
                    editable={!disabled}
                    autoFocus={autoFocus}
                    caretHidden={true}
                    contextMenuHidden={false}
                    selectTextOnFocus={false}
                    secureTextEntry={false}
                    textContentType={
                        Platform.OS === 'ios' && enableAutoFill
                            ? 'oneTimeCode'
                            : 'none'
                    }
                    autoComplete={
                        Platform.OS === 'android' && enableAutoFill
                            ? 'sms-otp'
                            : 'off'
                    }
                    importantForAutofill={
                        enableAutoFill ? 'yes' : 'no'
                    }
                    accessibilityLabel={label || 'Verification code'}
                    accessibilityHint={`Enter ${length} digit code`}
                    style={styles.hiddenInput}
                />
            </Pressable>

            {error && errorMessage ? (
                <Text style={styles.errorMessage}>
                    {errorMessage}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },

    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#18181B',
        marginBottom: 6,
    },

    description: {
        fontSize: 14,
        color: '#71717A',
        marginBottom: 12,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },

    box: {
        borderRadius: 12,
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

    focusBox: {
        borderColor: '#0085FF',
        borderWidth: 1.5,
        shadowColor: '#0085FF',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    digit: {
        fontSize: 22,
        fontWeight: '600',
        color: '#18181B',
        textAlign: 'center',
    },

    cursor: {
        width: 2,
        height: 22,
        backgroundColor: '#71717A',
        borderRadius: 2,
    },

    separatorContainer: {
        width: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    separator: {
        width: 6,
        height: 2,
        backgroundColor: '#D4D4D8',
        borderRadius: 2,
    },

    errorText: {
        color: '#FF3333',
    },

    errorMessage: {
        color: '#FF3333',
        fontSize: 13,
        marginTop: 10,
    },

    disabledBox: {
        shadowOpacity: 0,
        elevation: 0,
    },

    disabledDigit: {
        color: '#A1A1AA',
    },

    disabledText: {
        color: '#B4B4BA',
    },

    hiddenInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.01,
        color: 'transparent',
        backgroundColor: 'transparent',
        zIndex: 2,
        padding: 0,
        margin: 0,
    },
});

export default OtpComponent;



// MPIN – 4 Digit Usage ==> 


// import React, { useState } from 'react';
// import { View } from 'react-native';
// import OtpComponent from '../../components/common/OtpComponent';

// const MpinScreen = () => {
//   const [mpin, setMpin] = useState('');

//   return (
//     <View style={{ padding: 20 }}>
//       <OtpComponent
//         label="Enter MPIN"
//         description="Enter your 4 digit MPIN"
//         length={4}
//         value={mpin}
//         onChangeText={setMpin}
//         secureTextEntry={true}
//         enableAutoFill={false}
//         onComplete={(code) => {
//           console.log('MPIN:', code);
//         }}
//       />
//     </View>
//   );
// };

// export default MpinScreen;


// OTP – 6 Digit Usage ==> 


// const [otp, setOtp] = useState('');

{/* <OtpComponent
  label="Verify Account"
  description="We've sent a code to your email"
  length={6}
  separatorAfter={3}
  value={otp}
  onChangeText={setOtp}
  secureTextEntry={true}
  enableAutoFill={true}
  onComplete={(code) => {
    console.log('OTP Completed:', code);
    // Verify OTP API call
  }}
/> */}


// OTP – 4 Digit Usage ==> 


{/* <OtpComponent
  label="Verify Mobile Number"
  length={4}
  value={otp}
  onChangeText={setOtp}
  secureTextEntry={true}
/> */}


// Show actual numbers instead of dots ==> 
{/* <OtpComponent
  length={4}
  value={otp}
  onChangeText={setOtp}
  secureTextEntry={false}
/> */}



// Error & Disabled ==> 


{/* Error */ }
{/* <OtpComponent
  length={6}
  value={otp}
  onChangeText={setOtp}
  error={true}
  errorMessage="Invalid code, please try again"
/> */}

{/* Disabled */ }
{/* <OtpComponent
  length={4}
  value="1234"
  disabled={true}
/> */}





