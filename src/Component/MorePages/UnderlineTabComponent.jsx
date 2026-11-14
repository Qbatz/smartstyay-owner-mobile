
import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';

const UnderlineTabComponent = ({
  options = [],
  value,
  onChange,

  widthMode = 'fill',
  scrollable = false,

  disabled = false,

  height = 52,
  fontSize = 16,
  selectedFontSize,
  fontWeight = '500',
  selectedFontWeight = '500',

  indicatorColor = '#0085FF',
  indicatorHeight = 3,
  lineColor = '#E4E4E7',

  activeTextColor = '#18181B',
  inactiveTextColor = '#71717A',
  disabledTextColor = '#C4C4CC',

  minTabWidth = 100,
  horizontalPadding = 16,

  containerStyle,
  tabStyle,
  textStyle,
  selectedTextStyle,
}) => {
  const isFill = widthMode === 'fill';

  const renderTab = (item, index) => {
    const isSelected = value === item.value;
    const isDisabled = disabled || item.disabled;

    return (
      <Pressable
        key={String(item.value ?? index)}
        onPress={() => {
          if (!isSelected && !isDisabled) {
            onChange?.(item.value, item);
          }
        }}
        disabled={isDisabled}
        accessibilityRole="tab"
        accessibilityState={{
          selected: isSelected,
          disabled: isDisabled,
        }}
        style={[
          styles.tab,
          {
            height,
            paddingHorizontal: horizontalPadding,
          },
          isFill && !scrollable
            ? styles.fillTab
            : { minWidth: minTabWidth },
          tabStyle,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.tabText,
            {
              fontSize: isSelected
                ? selectedFontSize ?? fontSize
                : fontSize,
              fontWeight: isSelected
                ? selectedFontWeight
                : fontWeight,
              color: isDisabled
                ? disabledTextColor
                : isSelected
                  ? activeTextColor
                  : inactiveTextColor,
            },
            textStyle,
            isSelected && selectedTextStyle,
          ]}
        >
          {item.label}
        </Text>

        {isSelected && (
          <View
            style={[
              styles.indicator,
              {
                height: indicatorHeight,
                backgroundColor: indicatorColor,
              },
            ]}
          />
        )}
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: lineColor,
        },
        containerStyle,
      ]}
    >
      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
    width: '100%',
    borderBottomWidth: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  fillTab: {
    flex: 1,
  },

  tabText: {
    textAlign: 'center',
  },

  indicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

export default UnderlineTabComponent;



// Usage – Normal tabs (5 options) ==> 



// import React, { useState } from 'react';
// import { View } from 'react-native';
// import UnderlineTabComponent from
//   '../../components/common/UnderlineTabComponent';

// const MyScreen = () => {
//   const [activeTab, setActiveTab] = useState('all');

//   const tabOptions = [
//     { label: 'All', value: 'all' },
//     { label: 'Pending', value: 'pending' },
//     { label: 'Approved', value: 'approved' },
//     { label: 'Rejected', value: 'rejected' },
//     { label: 'Completed', value: 'completed' },
//   ];

//   return (
//     <View style={{ paddingHorizontal: 20 }}>
//       <UnderlineTabComponent
//         options={tabOptions}
//         value={activeTab}
//         onChange={setActiveTab}
//         widthMode="fill"
//         fontSize={16}
//         height={52}
//       />
//     </View>
//   );
// };

// export default MyScreen;


// Hug + Horizontal Scroll ==> 


{/* <UnderlineTabComponent
  options={tabOptions}
  value={activeTab}
  onChange={setActiveTab}
  widthMode="hug"
  scrollable
  minTabWidth={120}
  height={55}
/> */}

