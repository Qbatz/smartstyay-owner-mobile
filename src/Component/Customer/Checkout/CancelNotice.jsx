import React, { useState,useCallback ,useContext,useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,BackHandler
} from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import SampleAvatar from "../../../Assets/Images/Avatar.png";
import RoomIcon from "../../../Assets/Images/Room_Icon.png";
import BedIcon from "../../../Assets/Images/Bed_Icon.png";
import DatePicker from "react-native-ui-datepicker";
import DownArrow from "../../../Assets/Images/direction-down.png";
import dayjs from "dayjs";
import { useFocusEffect } from '@react-navigation/native';
import { useCustomer } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";

export default function CancelNotice({ navigation ,route }) {
    const { selectedItem,selectedBed } = route.params || {};
    const { activeHostelId } = useContext(CommonContexts);
      const { getCustomersByHostel, loading, moveToNoticePeriod,cancelCheckout } = useCustomer();
  const [openDate, setOpenDate] = useState(false);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const bedData = selectedBed || selectedItem;
const data = selectedItem || selectedBed;

const bedId =
  data?.bedId;

const tenantId =
  data?.customerId ||                 // from selectedItem
  data?.currentTenantInfo?.[0]?.tenetId; // from selectedBed


console.log("selectedItem",selectedItem)
console.log("selectedBed",selectedBed)
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
       }, [ navigation])
     );
const handleCancelNotice = async () => {
  const data = selectedItem || selectedBed;

  const bedId = data?.bedId;
  const tenantId =
    data?.customerId ||
    data?.currentTenantInfo?.[0]?.tenetId;

  if (!activeHostelId || !bedId || !tenantId) {
    console.log("DEBUG 👉", { activeHostelId, bedId, tenantId });
    alert("Invalid tenant or bed info");
    return;
  }

  const payload = {
    bedId: bedId,
    reCheckInDate: dayjs(checkInDate).format("DD-MM-YYYY"),
    reason: reason || "Cancelled from app",
  };

  console.log("CANCEL NOTICE PAYLOAD 👉", payload);

  const res = await cancelCheckout(
    activeHostelId,
    tenantId,
    payload
  );

  if (res?.success) {
    alert("Notice cancelled successfully");
    navigation.goBack();
  } else {
    alert(res?.message || "Cancel notice failed");
  }
};




  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 30 }}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cancel Notice Period</Text>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Tenant Details */}
        <View style={styles.tenantRow}>
          <Image source={SampleAvatar} style={styles.avatar} />

          <View style={{ marginLeft: 14 }}>
            <Text style={styles.tenantName}>Daniel Balaji M</Text>

              <View style={styles.smallRow}>
                           <View style={styles.badge}>
                             <Text style={styles.badgeText}>Ground Floor</Text>
                           </View>
           
                           <Image source={RoomIcon} style={styles.smallIcon} />
                           <Text style={styles.badgeLabel}>101</Text>
           
                           <Image source={BedIcon} style={styles.smallIcon} />
                           <Text style={styles.badgeLabel}>4</Text>
                         </View>
          </View>
        </View>

       
                     <Text style={styles.label}>Stay Type</Text>

<TouchableOpacity style={styles.dropBox}>
  <Text style={styles.dropText}>Long stay</Text>

  <Image source={DownArrow} style={styles.dropIcon} />
</TouchableOpacity>

        <Text style={styles.label}>Re Check-In Date <Text style={{color:"red"}}>*</Text></Text>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setOpenDate(!openDate)}
        >
          <Text style={styles.inputText}>
            {dayjs(checkInDate).format("DD/MM/YYYY")}
          </Text>
          <Image source={CalendarIcon} style={styles.calendarIcon} />
        </TouchableOpacity>

        {openDate && (
          <View style={styles.dropdownBox}>
            <DatePicker
              mode="single"
              date={checkInDate}
              onChange={(v) => {
                setCheckInDate(v.date || new Date());
                setOpenDate(false);
              }}
            />
          </View>
        )}

        {/* Reason */}
        <Text style={styles.label}>Reason (Comments)</Text>
        <TextInput
          style={styles.textarea}
          multiline
          placeholder="Add reason..."
          value={reason}
          onChangeText={setReason}
        />
      </ScrollView>

      {/* Bottom Buttons */}
     <View style={styles.btnRow}>
       <TouchableOpacity
         style={styles.cancelBtn}
         onPress={() => navigation.goBack()}
       >
         <Text style={styles.cancelText}>Cancel</Text>
       </TouchableOpacity>
     
       <TouchableOpacity style={styles.addBtn2} onPress={handleCancelNotice}>
         <Text style={styles.addBtnText}>Checkin</Text>
       </TouchableOpacity>
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop:20
  },
  backIcon: { width: 20, height: 20, tintColor: "#222", marginRight: 12 },
  headerText: { fontSize: 18, fontWeight: "700", color: "#000" },

  tenantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 35,
  },
  tenantName: { fontSize: 18, fontWeight: "700", color: "#111" },

  badgeRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  badge: {
    backgroundColor: "#FBE9C7",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  badgeText: { fontSize: 12, color: "#8F6B00" },
  roomText: { fontSize: 14, marginRight: 10, color: "#222" },
  bedText: { fontSize: 14, color: "#222" },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 16,
  },

  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: { fontSize: 15, color: "#111" },
  calendarIcon: { width: 22, height: 22, tintColor: "#676767" },

  dropdownBox: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 2,
  },

  textarea: {
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#111",
    backgroundColor: "#fff",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
   
  },

  cancelBtn: {
    fontSize: 16,
    color: "#666",
  },

  checkBtn: {
    backgroundColor: "#2B6CF6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  checkBtnText: { fontSize: 16, color: "#fff", fontWeight: "700" },
    smallRow: { flexDirection: "row", alignItems: "center" },
  badge: { backgroundColor: "#FFEFCF", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 8 },
  badgeText: { color: "black", fontSize: 12 },
  smallIcon: { width: 16, height: 16, marginHorizontal: 4 },
  badgeLabel: { fontSize: 13 },

    btnRow: {
    display:'flex',
  flexDirection: "row",
  justifyContent: "flex-end",
 paddingBottom:45,
  paddingHorizontal: 12,
},

cancelBtn: {
  paddingVertical: 12,
  paddingHorizontal: 32,
},

cancelText: {
  color: "#6B7280",
  fontSize: 15,
  fontWeight: "500",
},

addBtn2: {
  backgroundColor: "#2B6CF6",
  paddingVertical: 12,
  paddingHorizontal: 40,
  borderRadius: 10,
},

addBtnText: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
},

  dropBox: {
  height: 50,
  borderRadius: 10,
  backgroundColor: "#F5F7FF",  // screenshot mathiri light blue
  borderWidth: 1,
  borderColor: "#E6E9F5",
  paddingHorizontal: 14,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 6,
},

dropText: {
  fontSize: 15,
  color: "#000",
},

dropIcon: {
  width: 16,
  height: 16,
  tintColor: "#555",   // arrow light black
},

});
