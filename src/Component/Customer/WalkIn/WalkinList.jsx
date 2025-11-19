import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  BackHandler,
  TouchableWithoutFeedback
} from "react-native";

import PhoneIcon from "../../../Assets/Images/call.png";
import MenuDots from "../../../Assets/Images/3dots.png";
import UserIcon from "../../../Assets/Images/profile.png";
import FilterIcon from "../../../Assets/Images/EditPin.png";
import PlusIcon from "../../../Assets/Images/TenantAdd.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";

import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useLayoutEffect } from "react";

export default function WalkinScreen({ setShowTabBar }) {
 
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState("All");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");
  useLayoutEffect(() => {
    setShowTabBar(!showFilter);
  }, [showFilter]);





  useLayoutEffect(() => {
    const backAction = () => {
      if (showFilter) {
        setShowFilter(false);
        setShowStatusDropdown(false)  
        return true;                 
      }
      return false;
    };
  
    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
  
    return () => handler.remove();
  }, [showFilter]);
  
  const customerList = [
  {
    id: 1,
    name: "Rajkumar M",
    phone: "+91 98765 43210",
    date: "01/06",
  },
  {
    id: 2,
    name: "Ram Kumar S",
    phone: "+91 98765 12345",
    date: "01/06",
  },
  {
    id: 3,
    name: "Karthick V",
    phone: "+91 90031 45678",
    date: "02/06",
  },
  {
    id: 4,
    name: "Dinesh P",
    phone: "+91 98012 88765",
    date: "02/06",
  },
  {
    id: 5,
    name: "Ajay Kannan R",
    phone: "+91 94561 11223",
    date: "03/06",
  },
  {
    id: 6,
    name: "Murali M",
    phone: "+91 95512 99887",
    date: "03/06",
  },
  {
    id: 7,
    name: "Sathish R",
    phone: "+91 90234 66778",
    date: "04/06",
  },
  {
    id: 8,
    name: "Vimal Kumar",
    phone: "+91 98761 44321",
    date: "04/06",
  },
  {
    id: 9,
    name: "Manikandan S",
    phone: "+91 99554 77661",
    date: "05/06",
  },
  {
    id: 10,
    name: "Suresh K",
    phone: "+91 99881 33221",
    date: "05/06",
  },
  {
    id: 11,
    name: "Suresh K",
    phone: "+91 99881 33221",
    date: "05/06",
  },
  {
    id: 12,
    name: "Suresh K",
    phone: "+91 99881 33221",
    date: "05/06",
  },
];


  return (
    <View style={styles.container}>
      
      <Text style={styles.monthHeading}>This Month</Text>

      <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 50 }} 
>

        
        {/* ITEM */}
       {customerList.map((item) => (
  <View key={item.id} style={styles.row}>
    <View style={styles.avatarBox}>
      <Image source={UserIcon} style={styles.avatar} />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.name}>{item.name}</Text>

      <View style={styles.phoneRow}>
        <Image source={PhoneIcon} style={styles.phoneIcon} />
        <Text style={styles.phoneText}>{item.phone}</Text>
      </View>
    </View>

    <View style={styles.right}>
      <TouchableOpacity>
        <Image source={MenuDots} style={styles.dotIcon} />
      </TouchableOpacity>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  </View>
))}


      </ScrollView>

  
      <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
        <Image source={FilterIcon} style={{ width: 50, height: 50 }} />
      </TouchableOpacity>

 
      <TouchableOpacity style={styles.addBtn}>
        <Image source={PlusIcon} style={{ width: 50, height: 50 }} />
      </TouchableOpacity>

    

      {showFilter && (
        <TouchableOpacity
          style={styles.filterOverlay}
          activeOpacity={1}
        onPress={() => {
  setShowFilter(false);
  setShowStatusDropdown(false);
}}

        >
          <TouchableWithoutFeedback>
            <View style={styles.filterSheet}>
              <View style={styles.filterHandle} />
      
            
              <View style={styles.filterHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={FilterIcon}
                    style={{ width: 35, height: 35, marginRight: 8 }}
                  />
                  <Text style={styles.filterTitle}>Filter by</Text>
                </View>
              </View>
      
             
              <Text style={styles.label}>Status</Text>
      
              <Text style={styles.label}>Status</Text>

<View style={{ position: "relative" }}>

  <TouchableOpacity
    style={styles.dropdownBox}
    onPress={() => setShowStatusDropdown(!showStatusDropdown)}
  >
    <Text style={styles.dropdownText}>{status}</Text>
    <Text style={styles.arrow}>⌄</Text>
  </TouchableOpacity>

{showStatusDropdown && (
  <View style={styles.dropdownMenu}>
    <ScrollView nestedScrollEnabled={true}>
      {["All", "Active", "In-Active", "Checked Out", "Notice"].map((v) => (
        <TouchableOpacity
          key={v}
          style={styles.dropdownItem}
          onPress={() => {
            setStatus(v);
            setShowStatusDropdown(false);
          }}
        >
          <Text style={styles.dropdownItemText}>{v}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}

</View>

      
            
      
             
              <View style={styles.dateRow}>
      
          
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>From</Text>
      
                  <TouchableOpacity
                    style={styles.dateBox}
                    onPress={() => setOpenFrom(true)}
                  >
                    <Text>{formatDate(fromDate)}</Text>
                    <Image
                      source={require("../../../Assets/Images/calendar.png")}
                      style={styles.calIcon}
                    />
                  </TouchableOpacity>
                </View>
      
                <View style={{ width: 15 }} />
      
                {/* TO DATE */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>To</Text>
      
                  <TouchableOpacity
                    style={styles.dateBox}
                    onPress={() => setOpenTo(true)}
                  >
                    <Text>{formatDate(toDate)}</Text>
                    <Image
                      source={require("../../../Assets/Images/calendar.png")}
                      style={styles.calIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
      
           
              <View style={styles.quickRow}>
                <TouchableOpacity style={styles.quickBtn}>
                  <Text style={styles.quickText}>Today</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={styles.quickBtn}>
                  <Text style={styles.quickText}>This Week</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={styles.quickBtn}>
                  <Text style={styles.quickText}>This Month</Text>
                </TouchableOpacity>
              </View>
      
             
              <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.resetBtn}>
                  <Text style={styles.resetText}>Reset All</Text>
                </TouchableOpacity>
      
                <TouchableOpacity style={styles.applyBtn}>
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      )}
      {/* FROM DATE PICKER */}
<Modal transparent visible={openFrom} animationType="fade">
  <View style={styles.datePickerOverlay}>
    <TouchableOpacity
      style={styles.outsideTouch}
      activeOpacity={1}
      onPress={() => setOpenFrom(false)}
    />
    <View style={styles.datePickerBox}>
      <TouchableWithoutFeedback>
        <View>
          <DatePicker
            mode="single"
            date={fromDate}
            onChange={(d) => {
              setFromDate(d.date);
              setOpenFrom(false);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  </View>
</Modal>

{/* TO DATE PICKER */}
<Modal transparent visible={openTo} animationType="fade">
  <View style={styles.datePickerOverlay}>
    <TouchableOpacity
      style={styles.outsideTouch}
      activeOpacity={1}
      onPress={() => setOpenTo(false)}
    />
    <View style={styles.datePickerBox}>
      <TouchableWithoutFeedback>
        <View>
          <DatePicker
            mode="single"
            date={toDate}
            onChange={(d) => {
              setToDate(d.date);
              setOpenTo(false);
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  </View>
</Modal>


    </View>
  );
}



const styles = StyleSheet.create({
    filterOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},
dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 12,
},

datePickerOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},
dropdownItemText: {
  fontSize: 14,
  color: "#111",
},
dropdownMenu: {
  position: "absolute",
  top: 52,
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  elevation: 7,
  zIndex: 9999,
  maxHeight: 150,    
  overflow: "hidden", 
}

,

datePickerBox: {
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 12,
},

outsideTouch: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},

filterSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
},
filterHandle: {
  width: 60,
  height: 4,
  backgroundColor: "#ccc",
  alignSelf: "center",
  borderRadius: 50,
  marginBottom: 20,
},

  container: {
  flex: 1,
  backgroundColor: "#fff",
  paddingHorizontal: 16,
  paddingTop: 10,
},


  monthHeading: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatar: { width: 28, height: 28,  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  phoneIcon: { width: 16, height: 16 },

  phoneText: {
    marginLeft: 6,
    color: "#6B7280",
    fontSize: 13,
  },

  right: { alignItems: "flex-end" },

  dotIcon: { width: 26, height: 26, transform: [{ rotate: "90deg" }] },

  date: { fontSize: 11, color: "#6B7280", marginTop: 4 },

  filterBtn: {
    width: 55,
    height: 55,
    borderRadius: 40,
    position: "absolute",
    right: 15,
    bottom: 80,
    alignItems: "center",
    justifyContent: "center",
    
  },

  addBtn: {
    width: 55,
    height: 55,
   
    borderRadius: 60,
    position: "absolute",
    right: 15,
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
  
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  filterCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  handle: {
    width: 60,
    height: 5,
    borderRadius: 50,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 18,
  },

  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  filterSmallIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
    tintColor: "#2563EB",
  },

  filterTitle: { fontSize: 18, fontWeight: "700" },

  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    color: "#444",
  },

 dropdownBox: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  padding: 12,
  borderRadius: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},


  dropdownText: { fontSize: 15, color: "#111" },

  arrow: { fontSize: 18, color: "#111" },

  dateRow: { flexDirection: "row", marginTop: 10 },

  dateBox: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  padding: 14,
  borderRadius: 10,
  marginTop: 6,
  backgroundColor: "#fff",
},

  calIcon: { width: 18, height: 18 },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  quickBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  quickText: { fontSize: 14, color: "#111" },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  resetBtn: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    paddingVertical: 14,
    alignItems: "center",
  },

  resetText: { color: "#2563EB", fontSize: 15, fontWeight: "600" },

  applyBtn: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    alignItems: "center",
  },

  applyText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
