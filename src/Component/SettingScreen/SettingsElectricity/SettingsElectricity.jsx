import React, { useState , useEffect , useRef,useContext} from "react";
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
import { useElectricity } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import EmptyState from "../../../Assets/Images/Empty_state.png";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle"

export default function ElectricitySettings({ navigation }) {
const { hostelList,activeHostelId } = useContext(CommonContexts);
const { getElectricity,updateElectricity } = useElectricity();
const [ebunitList,setEbUnitList]= useState("")
const hostelId = hostelList?.length > 0 ? hostelList[0].hostelId : null;
 

console.log("activeHostelId",hostelList)
useEffect(() => {
  if (!hostelId) {
    console.log("Hostel ID not loaded yet");
    return;
  }

  console.log("Hostel ID →", hostelId);
  loadElectricity(hostelId);

}, [hostelId]);



const loadElectricity = async (id) => {
  const res = await getElectricity(id);
  console.log("EB Data = ", res);

  if (!res || res.success === false) {
    // no data or error
    setEbUnitList(null);
    return;
  }

  setEbUnitList(res.data); // res.data should be object (chargerPerUnit...)
  if (res.data) {
    setElectricityData({
      amount: res.data.chargerPerUnit,
      roomBased: !!res.data.isRoomBased,
      hostelBased: !!res.data.isHostelBased,
    });
  }
};


 console.log("ebunitList",ebunitList)


  const [electricityData, setElectricityData] = useState({
    roomBased: false,
    hostelBased: true,
  })

  const [showEditSheet, setShowEditSheet] = useState(false)
  const editY = useRef(new Animated.Value(700)).current;
  const [unitAmount,setUnitAmount] = useState("")
  const [unitAmountError,setUnitAmountError] = useState("")

const handleSave = async () => {
  if (!hostelId) {
    alert("Hostel ID Not Found");
    return;
  }

  if (!unitAmount) {
    setUnitAmountError("Please Enter Unit Amount");
    return;
  }

 
  const res = await updateElectricity(hostelId, Number(unitAmount));

  if (res.success) {
    alert("Updated Successfully");
    closeEditSheet();
    await loadElectricity(hostelId); 
  } else {
    alert(res.data?.message || "Update Failed");
  }
};





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
  const back = BackHandler.addEventListener("hardwareBackPress", () => {
    if (showEditSheet) {
      closeEditSheet();
      return true;
    }
    return false;
  });
  return () => back.remove();
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
  // prefill from ebunitList if present
  if (ebunitList?.chargerPerUnit != null) {
    setUnitAmount(String(ebunitList.chargerPerUnit));
  } else {
    setUnitAmount("");
  }

  setShowEditSheet(true);
  Animated.timing(editY, {
    toValue: 0,
    duration: 240,
    useNativeDriver: true,
  }).start();
};



const closeEditSheet = () => {
  Animated.timing(editY, {
    toValue: 700,
    duration: 220,
    useNativeDriver: true,
  }).start(() => {
    setShowEditSheet(false);
  });
};



const editPan = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) editY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) {
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
            {ebunitList ? "Edit" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

    
{!ebunitList ? (
  <View style={{ alignItems: "center", marginTop: 200 }}>
    <Image source={EmptyState} style={{ width: 180, height: 180 }} />
    <Text style={{ marginTop: 12, fontSize: 16, color: "#777" }}>
      No Electricity Settings Found
    </Text>
  </View>
) : (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Electricity Information</Text>

    <Text style={styles.cardSubtitle}>
      Configure per-unit EB rate for tenant consumption calculation.
    </Text>

    <View style={styles.cardborder} />

    <View style={styles.row}>
      <Text style={styles.label}>Per Unit Amount</Text>
      <Text style={styles.value}>₹ {ebunitList.chargerPerUnit}</Text>
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
  <View style={styles.sheetOverlay}>

    {/* Close on outside tap */}
    <TouchableWithoutFeedback onPress={closeEditSheet}>
      <View style={StyleSheet.absoluteFill} />
    </TouchableWithoutFeedback>

    {/* Bottom Sheet */}
    <Animated.View
      style={[
        styles.editSheet,
        { transform: [{ translateY: editY }] }
      ]}
      {...editPan.panHandlers}
    >
      <View style={styles.sheetHandle} />

      <Text style={styles.sheetTitle}>Recurring Enabling</Text>

      {/* Unit Dropdown */}
      <Text style={styles.label}>Unit</Text>
      <TouchableOpacity style={styles.dropdownBox}>
        <Text style={styles.dropdownText}>1 Kw Unit</Text>
        <Image source={DownArrow} style={styles.downIcon} />
      </TouchableOpacity>

      {/* Amount Input */}
      <Text style={styles.label}>Amount / Unit</Text>
      <TextInput
        style={styles.input}
        placeholder="Eg: ₹ 10"
        keyboardType="numeric"
         value={unitAmount}
 onChangeText={(v) => {
  setUnitAmount(v);
  setUnitAmountError("");
}}

      />
        {unitAmountError && (
                                    <ErrorMessage message={unitAmountError} type="error" />
                                )}


      {/* Buttons */}
      {/* <View style={styles.btnRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={closeEditSheet}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.btnRow}>
                     <TouchableOpacity style={styles.cancelBtn} onPress={closeEditSheet}>
                       <Text style={styles.cancelText}>Cancel</Text>
                     </TouchableOpacity>
           
                     <TouchableOpacity
                       style={styles.saveBtn}
                      onPress={handleSave}
                     >
                       <Text style={styles.saveText}> Save</Text>
                     </TouchableOpacity>
                   </View>

    </Animated.View>

  </View>
)}


    </View>
    </KeyboardAvoidingView>
  )
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
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
  zIndex: 9999,
},

editSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  minHeight: 330,
  maxHeight: "70%",
},

sheetHandle: {
  width: 55,
  height: 5,
  backgroundColor: "#ccc",
  borderRadius: 4,
  alignSelf: "center",
  marginBottom: 14,
},
cardborder: {
  width: 310,
  height: 0.3,
  backgroundColor: "#ccc",
  borderRadius: 4,
  alignSelf: "center",
  marginTop:15
//   marginBottom: 14,
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
  backgroundColor:'#D1DCFF',
  borderColor: "#D1DCFF",
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
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
    alignItems: "center",
  },

  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },

  cancelText: {
    color: "#6B7280",
    fontSize: 15,
  },

  saveBtn: {
    backgroundColor: "#2B6CF6",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
downIcon: {
  width: 18,
  height: 18,
  tintColor: "#6F6F6F"
},

});
