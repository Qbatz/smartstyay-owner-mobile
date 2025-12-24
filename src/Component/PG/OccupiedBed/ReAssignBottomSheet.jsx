import React, { useRef, useEffect, useState,useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,Keyboard,PanResponder,
} from "react-native";

import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

import FloorIcon from "../../../Assets/Images/FloorImg.png";
import RoomIcon from "../../../Assets/Images/RoomImg.png";
import BedIcon from "../../../Assets/Images/RoomImg.png";
import SwapIcon from "../../../Assets/Images/swap.png";
import Calendar from "../../../Assets/Images/calendar.png";
import Assign from "../../../Assets/Images/exchange.png";
import { useFloor } from "../../../Context/PayingGuestContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { useCustomer } from "../../../Context/CustomerContext";

export default function ConfirmReassignSheet({
  visible,
  onClose,
  current,
  next,
  selectedNewBed
}) {

  const translateY = useRef(new Animated.Value(500)).current;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const { activeHostelId } = useContext(CommonContexts);
    const { getAllFloorsByHostel, getAllRoomsByFloor } = useFloor();
    const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, changeBedCustomer, getCustomerDetails } = useCustomer();

  // 👉 1. FIRST HOOK – Open/Close Bottom Sheet
  console.log("selectedNewBedbottom",selectedNewBed)
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // 👉 2. SECOND HOOK – Keyboard Handling
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height + 40,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 👉 3. DEFINE panResponder (IMPORTANT: After hooks, before return!)
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 150) onClose();
      else
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
    },
  });

  // 👉 4. DO NOT put hooks after this line!
  if (!visible) return null;



  return (
    <>
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        <Text style={styles.title}>Confirm Reassign Bed</Text>

      
        <Text style={styles.sectionLabel}>Current Bed</Text>
        <View style={styles.row}>
            <View style={{display:'flex', flexDirection:'row',flex:1}}>
          <Image source={FloorIcon} style={styles.icon} />
          <Text style={styles.valueText}>Ground_Floor</Text>
</View>
  <View style={{display:'flex', flexDirection:'row',flex:1}}>
          <Image source={RoomIcon} style={styles.icon} />
          <Text style={styles.valueText}>{current.room}</Text>
</View>
  <View style={{display:'flex', flexDirection:'row',flex:1}}>
          <Image source={BedIcon} style={styles.icon} />
          <Text style={styles.valueText}>{current.bed}</Text>
          </View>
        </View>

        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Image source={SwapIcon} style={styles.swapIcon} />
        </View>

       
        <Text style={styles.sectionLabel}>New Bed</Text>
        <View style={styles.row}>
            <View style={{display:'flex', flexDirection:'row',flex:1}}>
          <Image source={FloorIcon} style={styles.icon} />
          <Text style={styles.valueText}>{next.floor}</Text>
          </View>

<View style={{display:'flex', flexDirection:'row',flex:1}}>
          <Image source={RoomIcon} style={styles.icon} />
          <Text style={styles.valueText}>{next.room}</Text></View>
  <View style={{display:'flex', flexDirection:'row',flex:1}}>
          <Image source={BedIcon} style={styles.icon} />
          <Text style={styles.valueText}>{next.bed}</Text></View>
        </View>

      
        <Text style={styles.sectionLabel}>Date</Text>
      <TouchableOpacity
  onPress={() => setShowDatePicker(true)}
  style={styles.inputBoxDate}
>
  <Text>{dayjs(selectedDate).format("DD/MM/YYYY")}</Text>
  <Image source={Calendar} style={styles.icon} />
</TouchableOpacity>

        
<View style={styles.rentHeaderRow}>
  <Text style={styles.sectionLabel}>New Rent Amount</Text>

  <TouchableOpacity 
    style={styles.checkboxRow} 
    onPress={() => setSameAsCurrent(!sameAsCurrent)}
  >
    <View style={[styles.checkbox, sameAsCurrent && styles.checkboxActive]}>
      {sameAsCurrent && <View style={styles.checkboxInner} />}
    </View>
    <Text style={styles.checkboxLabel}>Same as Current</Text>
  </TouchableOpacity>
</View>
        <Text style={styles.sectionLabel}>New Rent Amount</Text>
        <View style={styles.inputBox} >
         <TextInput
  style={styles.inputField}
  placeholder="Enter Amount"
  placeholderTextColor="#999"
  keyboardType="numeric"
/>

        </View>

    
        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.assignBtn}>
           <Image source={Assign} width={10} height={10}/> <Text style={styles.assignText}>Assign</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.assignBtn}>
  <View style={styles.assignRow}>
    <Image source={Assign} style={styles.assignIcon} />
    <Text style={styles.assignText}>Assign</Text>
  </View>
</TouchableOpacity>

        </View>
      </Animated.View>
    </View>
    {showDatePicker && (
          <View style={styles.datePickerOverlay}>
            <TouchableWithoutFeedback
              onPress={() => setShowDatePicker(false)}
            >
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>

            <View style={styles.datePickerBox}>
              <DatePicker
                mode="single"
                date={selectedDate}
               onChange={(d) => {
  setSelectedDate(dayjs(d.date));  
  setShowDatePicker(false);
}}
              />
            </View>
          </View>
        )}
    </>
  );
}



const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  handle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 18,
  },

  sectionLabel: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 14,
    color: "#555",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-around",
   flex:1,
    gap: 12,
    marginBottom: 10,
  },

  icon: {
    width: 20,
    height: 20,
    marginRight:5,
     tintColor: "#1E45E1",
   
  },

  valueText: {
    fontSize: 15,
    fontWeight: "600",
  },

  swapIcon: {
    width: 30,
    height: 30,
  
  },
 inputField: {
  fontSize: 15,
  color: "#000",
},
inputBoxDate:{
 borderWidth: 1,
    borderColor: "#ddd",
    
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
     height:50,paddingLeft:14
},

  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
   
   paddingLeft:14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height:50
  },
  

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 25,
   marginBottom:20
  },

  cancel: {
    fontSize: 16,
    color: "#777",
  },

  assignBtn: {
  backgroundColor: "#1E45E1",
  paddingVertical: 12,
  paddingHorizontal: 26,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
},

assignRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8, // spacing between icon & text (RN 0.71+)
},

assignIcon: {
  width: 16,
  height: 16,
  tintColor: "#fff",
  resizeMode: "contain",
},

assignText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},


  datePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 30,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding:40,
   
  },

  datePickerBox: {
    backgroundColor: "#fff",
    padding: 10,
   borderRadius:16
  },
  rentHeaderRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 14,
  marginBottom: 6,
},

checkboxRow: {
  flexDirection: "row",
  alignItems: "center",
},

checkbox: {
  width: 18,
  height: 18,
  borderWidth: 1.5,
  borderColor: "#555",
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 6,
},

checkboxActive: {
  borderColor: "#1E45E1",
  backgroundColor: "#1E45E1",
},

checkboxInner: {
  width: 10,
  height: 10,
  backgroundColor: "#fff",
  borderRadius: 2,
},

checkboxLabel: {
  fontSize: 13,
  color: "#444",
},

});
