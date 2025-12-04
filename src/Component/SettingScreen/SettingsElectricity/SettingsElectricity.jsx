import React, { useState , useEffect , useRef} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image, BackHandler ,PanResponder , TouchableWithoutFeedback , TextInput
} from "react-native";
import { KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DownArrow from "../../../Assets/Images/direction-down.png";

export default function ElectricitySettings({ navigation }) {
  const [electricityData, setElectricityData] = useState({
    amount: 80,
    roomBased: false,
    hostelBased: true,
  })

  const [showEditSheet, setShowEditSheet] = useState(false);

const editY = useRef(new Animated.Value(500)).current;



   useEffect(() => {
                const backHandler = BackHandler.addEventListener(
                  "hardwareBackPress",
                  () => {
                    navigation.goBack();  
                    return true;
                  }
                );
              
                return () => backHandler.remove();
              }, [])

              useEffect(() => {
  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      if (showEditSheet) {
        closeEditSheet();
        return true;
      }
      return false;
    }
  );
  return () => backHandler.remove();
}, [showEditSheet]);

useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", () => {
    Animated.timing(editY, {
      toValue: -120,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    Animated.timing(editY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);





const openEditSheet = () => {
  setShowEditSheet(true);
  editY.setValue(300); 
  Animated.timing(editY, {
    toValue: 0,
    duration: 250,
    useNativeDriver: true,
  }).start();
};

const closeEditSheet = () => {
  Animated.timing(editY, {
    toValue: 500,
    duration: 220,
    useNativeDriver: true,
  }).start(() => setShowEditSheet(false));
};


const editPan = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) {
        editY.setValue(g.dy);
      }
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 140) {
        closeEditSheet();
      } else {
        Animated.spring(editY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  })
).current;



  const CustomSwitch = ({ value, onToggle }) => {
    return (
      <TouchableOpacity onPress={() => onToggle(!value)}>
        <View
          style={[
            styles.switch,
            { backgroundColor: value ? "#3562FF" : "#A68DE3" },
          ]}
        >
          <Animated.View
            style={[
              styles.knob,
              { transform: [{ translateX: value ? 18 : 0 }] },
            ]}
          >
            <Text style={styles.knobText}>{value ? "✓" : "✕"}</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };

  const toggleRoomBased = () => {
    setElectricityData((prev) => ({
      ...prev,
      roomBased: !prev.roomBased,
    }));
  };

  const toggleHostelBased = () => {
    setElectricityData((prev) => ({
      ...prev,
      hostelBased: !prev.hostelBased,
    }));
  };

  return (
     <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Electricity</Text>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={openEditSheet}>
          <Text style={styles.editBtnText}>
            {electricityData ? "Edit" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DATA CARD */}
      {electricityData && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Electricity Information</Text>

          <Text style={styles.cardSubtitle}>
            Configure per-unit EB rate for tenant consumption calculation.
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Per Unit Amount</Text>
            <Text style={styles.value}>₹ {electricityData.amount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Room Based Calculation</Text>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {electricityData.roomBased ? "On" : "Off"}
              </Text>
              <CustomSwitch
                value={electricityData.roomBased}
                onToggle={toggleRoomBased}
              />
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Hostel Based Calculation</Text>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {electricityData.hostelBased ? "On" : "Off"}
              </Text>
              <CustomSwitch
                value={electricityData.hostelBased}
                onToggle={toggleHostelBased}
              />
            </View>
          </View>
        </View>
      )}

      {showEditSheet && (
  <TouchableWithoutFeedback onPress={closeEditSheet}>
    <View style={styles.sheetOverlay}>
      
      <Animated.View
        style={[styles.editSheet, { transform: [{ translateY: editY }] }]}
        {...editPan.panHandlers}
      >
        <View style={styles.sheetHandle} />

        <Text style={styles.sheetTitle}>Recurring Enabling</Text>

        {/* UNIT DROPDOWN */}
        <Text style={styles.label}>Unit</Text>

        <TouchableOpacity style={styles.dropdownBox}>
          <Text style={styles.dropdownText}>1 Kw Unit</Text>
          <Image source={DownArrow} style={{width: 18, height: 18, tintColor: "#6F6F6F" }} />
        </TouchableOpacity>

        {/* AMOUNT INPUT */}
        <Text style={styles.label}>Amount / Unit</Text>
        <TextInput
          style={styles.input}
          placeholder="Eg: ₹ 10"
          keyboardType="numeric"
        />

        {/* BUTTONS */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={closeEditSheet}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  </TouchableWithoutFeedback>
)}

    </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7FA", padding: 20 , paddingTop:30},

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  backIcon: { width: 20, height: 20, marginRight: 10 },

  headerTitle: { fontSize: 20, fontWeight: "700", color: "#000" },

  editBtn: {
    backgroundColor: "#2D6CDF",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  editBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cardTitle: { fontSize: 16, fontWeight: "700", color: "#222" },
  cardSubtitle: { fontSize: 13, color: "#666", marginVertical: 6 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 14,
    alignItems: "center",
  },

  label: { fontSize: 14, color: "#444" },
  value: { fontSize: 15, fontWeight: "700" },

  switchRow: { flexDirection: "row", alignItems: "center", gap: 12 },

  switchText: { fontSize: 14, fontWeight: "600", color: "#3562FF" },

  switch: {
    width: 42,
    height: 24,
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
  },

  knob: {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  knobText: { fontSize: 10, fontWeight: "700" },

  sheetOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
  zIndex: 9999,
},

editSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
  minHeight: 330,
  paddingBottom: 40,
},

sheetHandle: {
  width: 50,
  height: 5,
  backgroundColor: "#D1D5DB",
  alignSelf: "center",
  borderRadius: 10,
  marginBottom: 14,
},

sheetTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 16,
},

label: {
  fontSize: 14,
  fontWeight: "600",
  marginTop: 12,
  marginBottom: 6,
},

dropdownBox: {
  borderWidth: 1,
  borderColor: "#E2E2E2",
  borderRadius: 12,
  paddingHorizontal: 14,
  height: 50,
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
  marginBottom: 12,
},

dropdownText: { fontSize: 15, color: "#333" },

input: {
  borderWidth: 1,
  borderColor: "#E2E2E2",
  borderRadius: 12,
  paddingHorizontal: 14,
  height: 48,
  marginBottom: 20,
},

btnRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
},

cancelBtn: {
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 12,
},

cancelText: {
  fontSize: 15,
  color: "#444",
},

saveBtn: {
  backgroundColor: "#2D6CDF",
  paddingVertical: 12,
  paddingHorizontal: 26,
  borderRadius: 12,
},

saveText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 15,
},

});
