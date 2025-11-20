// AddAssetSheet.jsx
import React, { useRef,useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Image,
  Animated,
  PanResponder,
  ScrollView
} from "react-native";
import Calendar from "../../../Assets/Images/calendar.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

export default function AddAssetSheet({ onClose }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const vendors = ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4", "Vendor 5"];
const [vendorOpen, setVendorOpen] = useState(false);
const [vendorSelected, setVendorSelected] = useState("Select a Vendor");
const [openDatePicker, setOpenDatePicker] = useState(false);
const [purchaseDate, setPurchaseDate] = useState(dayjs());



  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          Animated.timing(translateY, {
            toValue: 600,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.overlay}>
      {/* Close on outside touch */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
 <Animated.View
  style={[styles.sheet, { transform: [{ translateY }] }]}
  {...panResponder.panHandlers}
>
  <View style={styles.handle} />

  {/* SCROLL CONTENT */}
  <ScrollView
  
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 20 }}
  >
    <Text style={styles.title}>Add an Asset</Text>

    <Text style={styles.label}>Asset Name</Text>
    <TextInput style={styles.input} placeholder="Asset 1" />

    <Text style={styles.label}>Product Name</Text>
    <TextInput style={styles.input} placeholder="Enter Product name" />

    {/* <Text style={styles.label}>Vendor name</Text>
    <TouchableOpacity style={styles.select}>
      <Text style={styles.selectText}>Select a Vendor</Text>
      <Image source={DownArrow} style={styles.arrow} />
    </TouchableOpacity> */}
    <Text style={styles.label}>Vendor name</Text>

<View style={{ position: "relative" }}>
  <TouchableOpacity
    style={styles.select}
    onPress={() => setVendorOpen(!vendorOpen)}
    activeOpacity={0.9}
  >
    <Text style={styles.selectText}>{vendorSelected}</Text>
    <Image source={DownArrow} style={styles.arrow} />
  </TouchableOpacity>

  {vendorOpen && (
    <View style={styles.dropdownMenu}>
      <ScrollView style={{ maxHeight: 160 }}>
        {vendors.map((v, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => {
              setVendorSelected(v);
              setVendorOpen(false);
            }}
          >
            <Text style={styles.optionText}>{v}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )}
</View>


    <Text style={styles.label}>Brand name</Text>
    <TextInput style={styles.input} placeholder="Vendor 1" />

    <Text style={styles.label}>Serial number</Text>
    <TextInput style={styles.input} placeholder="Vendor 1" />
    
    

  {/* Purchase Date */}
{/* DATE INPUT */}
<Text style={styles.label}>Purchase Date</Text>

<TouchableOpacity 
  style={styles.dateBox}
  onPress={() => setOpenDatePicker(true)}
>
  <Text style={styles.placeholder}>
    {purchaseDate ? dayjs(purchaseDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
  </Text>
  <Image source={Calendar} style={styles.calendarIcon} />
</TouchableOpacity>

{/* DATE PICKER POPUP (comes above sheet) */}
{/* {openDatePicker && (
  <View style={styles.fullDateOverlay}>
    <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
      <View style={{ flex: 1 }} />
    </TouchableWithoutFeedback>

    <View style={styles.datePickerPopup}>
      <DatePicker
        mode="single"
        date={purchaseDate}
        onChange={(p) => {
          setPurchaseDate(p.date || dayjs());
          setOpenDatePicker(false);
        }}
      />
    </View>
  </View>
)} */}





    <Text style={styles.label}>Price</Text>
    <TextInput style={styles.input} placeholder="Vendor 1" />
  

  {/* FIXED BOTTOM BUTTONS (no gap issue now) */}
  <View style={styles.footerBtnRow}>
    <TouchableOpacity onPress={onClose}>
      <Text style={styles.cancel}>Cancel</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.addBtn}>
      <Text style={styles.addBtnText}>Add Asset</Text>
    </TouchableOpacity>
  </View>
 </ScrollView>
 
</Animated.View>

{openDatePicker && (
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.datePickerBox}>
            <DatePicker
              mode="single"
             date={purchaseDate}
               onChange={(p) => {
          setPurchaseDate(p.date || dayjs());
          setOpenDatePicker(false);
        }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "88%",
  },
  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#d1d1d1",
    alignSelf: "center",
    borderRadius: 20,
    marginBottom: 15,
    marginTop: 8
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 18 },

  label: { fontSize: 14, color: "#444", marginBottom: 6, marginTop: 12 },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
  },

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

  selectText: { color: "#555" },
  arrow: { width: 18, height: 18, tintColor: "#777" },

  dateBox: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholder: { color: "#555" },
  calendarIcon: { width: 20, height: 20, tintColor: "#444" },

  footerBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
   marginTop:15,
   marginBottom:10
  },

  cancel: {
    fontSize: 16,
    color: "#777",
  },

  addBtn: {
    backgroundColor: "#1E45E1",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dropdownMenu: {
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

optionText: {
  fontSize: 15,
  color: "#000",
},


datePickerBox: {
  backgroundColor: "#fff",
  width: "80%",
 
  borderRadius:20,
  padding: 10,
  marginBottom:90
},

fullDateOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 10,
 
  justifyContent: "flex-end",
  zIndex: 9999,
  elevation: 20,
},

datePickerPopup: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 10,
  width: "100%",
},
 sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },



});
