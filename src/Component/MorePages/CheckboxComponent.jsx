import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

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
    if (disabled) return '#93C5FD';
    if (error) return '#EF4444';
    if (isHovered) return '#2F78F0';
    return '#3B82F6';
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
      accessibilityState={{ checked: value, disabled }}
      style={[
        styles.container,
        { alignItems: description ? 'flex-start' : 'center' },
        containerStyle,
      ]}
    >
      <View style={styles.checkboxWrapper}>
        <View
          style={[
            styles.checkbox,
            value
              ? { backgroundColor: checkboxColor, borderColor: checkboxColor }
              : {
                  backgroundColor: disabled ? '#FAFAFA' : '#FFFFFF',
                  borderColor: error ? '#EF4444' : '#ECECEE',
                },
          ]}
        >
          {value && <View style={styles.checkMark} />}
        </View>

        {isActiveFocus && (
          <View
            pointerEvents="none"
            style={[
              styles.focusRing,
              { borderColor: error ? '#FECACA' : '#DBEAFE' },
            ]}
          />
        )}
      </View>

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
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 8,
  },

  checkboxWrapper: {
    width: 20,
    height: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },

  checkMark: {
    width: 5,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -2,
  },

  focusRing: {
    position: 'absolute',
    top: -3,
    left: -3,
    width: 26,
    height: 26,
    borderRadius: 9,
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
    marginTop: 4,
  },

  errorText: {
    color: '#EF4444',
  },

  errorMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: '#EF4444',
    marginTop: 4,
  },

  disabledTitle: {
    color: '#A1A1AA',
  },

  disabledDescription: {
    color: '#B4B4BA',
  },
});

export default CheckboxComponent;