
import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';

const TabComponent = ({
  options = [],
  value,
  onChange,

  variant = 'pill',
  widthMode = 'hug',

  scrollable = false,
  disabled = false,

  containerStyle,
  tabStyle,
  textStyle,
  selectedTabStyle,
  selectedTextStyle,

  activeColor = '#FFFFFF',
  backgroundColor = '#F4F4F5',
  activeTextColor = '#18181B',
  inactiveTextColor = '#71717A',
  disabledTextColor = '#C4C4CC',
  indicatorColor = '#0085FF',

  height = 48,
  borderRadius = 30,
}) => {

  const isUnderline = variant === 'underline';
  const isFill = widthMode === 'fill';

  const renderTab = (item, index) => {
    const selected = value === item.value;
    const isDisabled = disabled || item.disabled;

    return (
      <Pressable
        key={String(item.value ?? index)}
        disabled={isDisabled}
        onPress={() => {
          if (!selected && !isDisabled) {
            onChange?.(item.value, item);
          }
        }}
        accessibilityRole="tab"
        accessibilityState={{
          selected,
          disabled: isDisabled,
        }}
        style={[
          styles.tab,
          {
            height,
            borderRadius: isUnderline ? 0 : borderRadius,
          },
          isFill && !scrollable && styles.fillTab,
          selected && !isUnderline && {
            backgroundColor: activeColor,
            ...styles.selectedShadow,
          },
          selected && isUnderline && {
            borderBottomWidth: 2,
            borderBottomColor: indicatorColor,
          },
          isDisabled && styles.disabledTab,
          tabStyle,
          selected && selectedTabStyle,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.tabText,
            {
              color: isDisabled
                ? disabledTextColor
                : selected
                  ? activeTextColor
                  : inactiveTextColor,
            },
            selected && styles.selectedText,
            textStyle,
            selected && selectedTextStyle,
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isUnderline
            ? 'transparent'
            : backgroundColor,
          borderRadius: isUnderline ? 0 : borderRadius,
          padding: isUnderline ? 0 : 5,
        },
        isFill && styles.fillContainer,
        containerStyle,
      ]}
    >
      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            isFill && styles.fillContent,
          ]}
        >
          {options.map(renderTab)}
        </ScrollView>
      ) : (
        <View style={styles.row}>
          {options.map(renderTab)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  fillContainer: {
    alignSelf: 'stretch',
  },

  fillContent: {
    flexGrow: 1,
  },

  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  fillTab: {
    flex: 1,
  },

  tabText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },

  selectedText: {
    fontWeight: '500',
  },

  selectedShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  disabledTab: {
    opacity: 0.7,
  },
});

export default TabComponent;



//  2 tab values ==> 

// import React, { useState } from 'react';
// import { View } from 'react-native';
// import TabComponent from './TabComponent';

// const CheckinScreen = () => {
//   const [activeTab, setActiveTab] = useState('Booking');

//   const tabs = [
//     { label: 'Booking', value: 'Booking' },
//     { label: 'Checkin', value: 'Checkin' },
//   ];

//   return (
//     <View style={{ paddingHorizontal: 20 }}>
//       <TabComponent
//         options={tabs}
//         value={activeTab}
//         onChange={setActiveTab}
//         variant="pill"
//         widthMode="fill"
//       />
//     </View>
//   );
// };

// export default CheckinScreen;



// Multiple tabs ==>

// const [activeTab, setActiveTab] = useState('all');

// const tabs = [
//   { label: 'All', value: 'all' },
//   { label: 'Pending', value: 'pending' },
//   { label: 'Approved', value: 'approved' },
//   { label: 'Rejected', value: 'rejected' },
//   { label: 'Completed', value: 'completed' },
// ];

// <TabComponent
//   options={tabs}
//   value={activeTab}
//   onChange={setActiveTab}
//   variant="pill"
//   widthMode="hug"
//   scrollable
// />


// Underline variant tab ==> 


{/* <TabComponent
  options={[
    { label: 'Details', value: 'details' },
    { label: 'Payments', value: 'payments' },
    { label: 'History', value: 'history' },
  ]}
  value={activeTab}
  onChange={setActiveTab}
  variant="underline"
  widthMode="fill"
  indicatorColor="#0085FF"
/> */}


// Individual tab disabled ==> 



// const tabs = [
//   { label: 'All', value: 'all' },
//   { label: 'Pending', value: 'pending' },
//   { label: 'Completed', value: 'completed', disabled: true },
// ];

