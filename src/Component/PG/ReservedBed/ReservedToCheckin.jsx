import React, { useState,useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView ,BackHandler} from "react-native";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import Calendar from "../../../Assets/Images/calendar.png";
import Delete from "../../../Assets/Images/remove.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { useFocusEffect } from '@react-navigation/native';

export default function ReserveToCheckin({ route, navigation }) {

  const { bed, room } = route.params || {};
  

  const [openJoinPicker, setOpenJoinPicker] = useState(false);
  const [joinDate, setJoinDate] = useState(dayjs());
   const [extraCharges, setExtraCharges] = useState([]);
   const [openDropdownId, setOpenDropdownId] = useState(null);
    const StayType = ["LongStay"];
     const [StayTypeOpen, setStayTypeOpen] = useState(false);
     const [StayTypeSelected, setStayTypeSelected] = useState("Stay Type");
    const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");

  const TYPE_OPTIONS = ["Maintenance", "Others"];
 useFocusEffect(
   useCallback(() => {
     const onBackPress = () => {
       
 
       if (navigation.canGoBack()) {
         navigation.goBack();
         return true;
       }
 
       return false;
     };
 
     const subscription = BackHandler.addEventListener(
       "hardwareBackPress",
       onBackPress
     );
 
     return () => subscription.remove();
   }, [navigation])
 );

  const addCharge = () => {
    setExtraCharges(prev => [
      ...prev,
      { id: Date.now(), type: "", title: "", amount: "" }
    ]);
  };

  const removeCharge = (id) => {
    setExtraCharges(prev => prev.filter(i => i.id !== id));

  
  };

  const selectType = (id, type) => {


    if (type === "Maintenance" && maintenanceAlreadyUsed) return;

    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
    );

    setOpenDropdownId(null);
  };





  const updateTitle = (id, title) => {
    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, title } : i))
    );
  };

  const updateAmount = (id, amount) => {
    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, amount } : i))
    );
  };

const convertToDeductions = (extraCharges) => {
  return extraCharges.map(item => ({
    type: item.type === "Others" ? item.title.toLowerCase() : "maintenance",
    amount: item.amount,
    showInput: item.type === "Others"
  }));
};
const onSave = () => {
  const deductions = convertToDeductions(extraCharges);
  console.log("Final Deductions:", deductions);
};

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>← Check-In Tenant</Text>
        </TouchableOpacity>

        <Text style={styles.roomInfo}>Room No {room?.room_no} | {bed?.label}</Text>

        {/* Tenant Name */}
        <Text style={styles.label}>Tenant</Text>
        <View style={styles.box}>
          <Text>Daniel Jebaraj</Text>
        </View>

        {/* Booking Date */}
        <Text style={styles.label}>Booking Date</Text>
        <View style={styles.box}>
          <Text>{dayjs().format("DD/MM/YYYY")}</Text>
        </View>

        {/* Booking Amount */}
        <Text style={styles.label}>Booking Amount</Text>
        <View style={styles.box}>
          <Text>₹500</Text>
        </View>

        <Text style={styles.label}>Stay Type</Text>
       
                     <View style={{ position: "relative" }}>
                       <TouchableOpacity
                         style={styles.select}
                         onPress={() => setStayTypeOpen(!StayTypeOpen)}
                         activeOpacity={0.9}
                       >
                         <Text style={styles.selectText}>{StayTypeSelected}</Text>
                         <Image source={DownArrow} style={styles.arrow} />
                       </TouchableOpacity>
       
                       {StayTypeOpen && (
                         <View style={styles.dropdownMenuone}>
                           <ScrollView style={{ maxHeight: 160 }}>
                             {StayType.map((v, index) => (
                               <TouchableOpacity
                                 key={index}
                                 style={styles.option}
                                 onPress={() => {
                                   setStayTypeSelected(v);
                                   setStayTypeOpen(false);
                                 }}
                               >
                                 <Text style={styles.optionText}>{v}</Text>
                               </TouchableOpacity>
                             ))}
                           </ScrollView>
                         </View>
                       )}
                     </View>

        {/* Rental Amount */}
        <Text style={styles.label}>Rental Amount</Text>
        <TextInput placeholder="Enter amount" style={styles.input} keyboardType="numeric" />

        {/* Advance Amount */}
        <Text style={styles.label}>Advance Amount</Text>
        <TextInput placeholder="Enter amount" style={styles.input} keyboardType="numeric" />

        {/* Joining Date */}
        <Text style={styles.label}>Joining Date *</Text>

        <TouchableOpacity style={styles.dateBox} onPress={() => setOpenJoinPicker(true)}>
       <Text>
  {joinDate ? dayjs(joinDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
</Text>

          <Image source={Calendar} style={{ width: 22, height: 22 }} />
        </TouchableOpacity>

        {/* Non Refundable Amount Title */}
        {/* <View style={styles.row}>
          <Text style={styles.label}>Non Refundable Amount</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View> */}
         <View style={styles.nonRefund}>
                      <View style={styles.extraHeader}>
                        <Text style={styles.label}>Non Refundable Amount</Text>
        
                        <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
                          <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
                        </TouchableOpacity>
                      </View>
        
                      {extraCharges.map((item) => (
                        <View key={item.id} style={styles.figmaRowWrapper}>
        
                          {/* CLOSE BTN */}
                          <TouchableOpacity
                            onPress={() => removeCharge(item.id, item.type)}
                            style={styles.figmaCloseBtn}
                          >
        
                            <Image
                              source={Delete}
                              style={styles.figmaCloseText}
                            />
                          </TouchableOpacity>
        
        
                          <View style={styles.figmaRow}>
        
        
                            {item.type === "" ? (
                              <TouchableOpacity
                                style={styles.figmaLeftBox}
                                onPress={() =>
                                  setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                                }
                              >
                                <Text style={{ color: "#777" }}>Select...</Text>
                                <Image source={DownArrow} style={styles.arrow} />
                              </TouchableOpacity>
                            ) : item.type === "Others" ? (
                              <TextInput
                                style={styles.figmaLeftBox}
                                placeholder="Enter reason"
                                value={item.title}
                                onChangeText={(t) => updateTitle(item.id, t)}
                              />
                            ) : (
                              <View style={[styles.figmaLeftBox, { backgroundColor: "#EFEFEF" }]}>
                                <Text>Maintenance</Text>
                              </View>
                            )}
        
                            {/* RIGHT BOX ALWAYS VISIBLE (disabled until type selected) */}
                            {item.type === "" ? (
                              <View style={[styles.figmaRightBox, { opacity: 0.4 }]}>
                                <Text style={{ color: "#999" }}>Enter amount</Text>
                              </View>
                            ) : (
                              <TextInput
                                style={styles.figmaRightBox}
                                placeholder="Enter amount"
                                keyboardType="numeric"
                                value={item.amount}
                                onChangeText={(t) => updateAmount(item.id, t)}
                              />
                            )}
        
                          </View>
        
        
                          {openDropdownId === item.id && item.type === "" && (
                            <View style={styles.dropdownMenu}>
                              {TYPE_OPTIONS.map((t) => {
        
                                const disabled = t === "Maintenance" && maintenanceAlreadyUsed;
        
                                return (
                                  <TouchableOpacity
                                    key={t}
                                    disabled={disabled}
                                    onPress={() => !disabled && selectType(item.id, t)}
                                    style={{ opacity: disabled ? 0.3 : 1 }}
                                  >
                                    <Text style={styles.dropdownItem}>{t}</Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          )}
        
                        </View>
                      ))}
        
        
        
        
        
                    </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkBtn} onPress={onSave}>
            <Text style={styles.checkText}>Check In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Date Picker Popup */}
      {openJoinPicker && (
        <View style={styles.overlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setOpenJoinPicker(false)} />

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
              date={joinDate}
              onChange={(v) => {
                setJoinDate(v.date);
                setOpenJoinPicker(false);
              }}
            />
          </View>
        </View>
      )}

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },

  backArrow: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  roomInfo: {
    color: "#1E45E1",
    marginBottom: 20,
    fontWeight: "600",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: "#333",
  },

  box: {
    backgroundColor: "#EEF2FF",
    padding: 14,
    borderRadius: 10,
  },

  selectBox: {
    borderWidth: 1,
    borderColor: "#DCDCDC",
    padding: 14,
    borderRadius: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#DCDCDC",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
  },

  dateBox: {
    backgroundColor: "#EEF2FF",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },

  addBtn: {
    backgroundColor: "#1E45E1",
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  addText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  buttonRow: {
     flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 25,
  },
  

//   cancelBtn: {
//     width: "48%",
//     borderWidth: 1,
//     borderColor: "#DCDCDC",
//     paddingVertical: 14,
//     borderRadius: 10,
//   },
 cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,


    width: "40%"
  },

  cancelText: {
    textAlign: "center",
    fontSize: 15,
    color: "#444",
    fontWeight: "600",
  },

  checkBtn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: "#1D5DFF",
    width: "35%"
  },

  checkText: {
    textAlign: "center",
    fontSize: 15,
    color: "#fff",
    fontWeight: "700",
  },

  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },

  datePickerBox: {
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    padding: 10,
    marginBottom: 60,
  },

   figmaRowWrapper: {
    marginTop: 20,
    position: "relative",
  },

  figmaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  figmaLeftBox: {
    width: "48%",
    height: 50,
backgroundColor:"#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  figmaRightBox: {
    width: "45%",
    height: 50,
backgroundColor:"#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    justifyContent: "center",
    marginRight: 20
  },

  figmaCloseBtn: {
    position: "absolute",
    right: 5,
    top: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E1E1E1",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  figmaCloseText: {
    width: 10,
    height: 10
  },
  nonRefund: {
    backgroundColor: "#F7F9FF",
    padding: 10,
    marginTop: 10,
    borderRadius: 20
  },
    extraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  addBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
    arrow: { width: 18, height: 18, tintColor: "#444" },

  dropdownMenu: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,

  },

  dropdownItem: {
    padding: 12,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },


  dropdownMenuone: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 999,
    elevation: 10,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  selectText: { color: "#555" },
 
  placeholder: { color: "#555" },


  optionText: {
    fontSize: 15,
    color: "#000",
  },
selectText: { color: "#555" },
 
   select: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
