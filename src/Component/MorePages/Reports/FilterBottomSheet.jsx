import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";


const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function FilterBottomSheet({
  visible,
  title,
  options = [],
  selectedValues = [],
  setSelectedValues,
  onApply,
  onReset,
  onClose,
   isSingleSelect = false 
}) {

    const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const [error, setError] = React.useState("");

  const openSheet = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(onClose);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSheet();
        else openSheet();
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setError("");
      openSheet();

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          closeSheet();
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeSheet}
      />

      <Animated.View
        {...panResponder.panHandlers}
         style={[
    styles.sheet,
    { 
      transform: [{ translateY }],
      paddingBottom: 20 + insets.bottom  
    }
  ]}
      >
        <View style={styles.dragIndicator} />

        <Text style={styles.title}>{title}</Text>

        <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}>
          {options.map((item) => {
            const checked = selectedValues.includes(item.value);
            return (
              <TouchableOpacity
                key={item.value}
                style={styles.row}
                // onPress={() => {
                //   if (checked) {
                //     setSelectedValues(
                //       selectedValues.filter(v => v !== item.value)
                //     );
                //   } else {
                //     setSelectedValues([...selectedValues, item.value]);
                //   }
                // }}
                onPress={() => {
                     setError("");
  if (isSingleSelect) {
    setSelectedValues([item.value]);
  } else {
    const exists = selectedValues.includes(item.value);
    if (exists) {
      setSelectedValues(
        selectedValues.filter((v) => v !== item.value)
      );
    } else {
      setSelectedValues([...selectedValues, item.value]);
    }
  }
}}
              >
                <Text style={styles.label}>{item.label}</Text>
                <View style={[styles.radio, checked && styles.radioActive]} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
{/* 
        {error !== "" && (
  <Text style={styles.errorText}>
    {error}
  </Text>
)} */}

   {error ? (
            <ErrorMessage message={error} type="error" />
          ) : null}

        <View style={styles.buttons}>
         <TouchableOpacity
  style={[
    styles.resetBtn,
    (!selectedValues || selectedValues.length === 0) && styles.resetDisabled
  ]}
  disabled={!selectedValues || selectedValues.length === 0}
  onPress={onReset}
>
            <Text style={{ color: "#1D4ED8" }}>Reset</Text>
          </TouchableOpacity>

       <TouchableOpacity
  style={styles.applyBtn}
  onPress={() => {
    if (!selectedValues || selectedValues.length === 0) {
      setError("Please select at least one option");
      return;
    }

    setError("");
    onApply();
  }}
>
  <Text style={{ color: "#fff" }}>Apply</Text>
</TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = {
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

sheet: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingHorizontal: 20,
  paddingTop: 20,
  maxHeight: "80%",
},
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  label: {
    fontSize: 16,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },

  radioActive: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },

  buttons: {
    flexDirection: "row",
    marginTop: 20,
  },

  resetBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    marginRight: 10,
    alignItems: "center",
  },

  applyBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1D4ED8",
    alignItems: "center",
  },
  errorText: {
  color: "#DC2626",
  fontSize: 13,
  marginTop: 10,
  marginBottom: 5
},

resetDisabled: {
  backgroundColor: "#E5E7EB"
},
};