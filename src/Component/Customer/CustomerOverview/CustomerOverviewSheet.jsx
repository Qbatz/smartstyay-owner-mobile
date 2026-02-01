import React, { useState,useEffect,useContext,useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,BackHandler 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCustomer } from "../../../Context/CustomerContext";
import { CommonContexts } from "../../../Context/CommonContext";
import EditBasicDetailsSheet from "./EditBasicDetails";
import EditManualAddressSheet from "./EditAdressDetails";
import EditJoiningDateSheet from "./EditJoiningDateSheet";
import EditRentalAmountSheet from "./EditMonthlyRentSheet";
import EditAdvanceAmountSheet from "./EditAdvanceSheet"
import OverviewTab from "./OverviewTab";
import EBReadingTab from "./EBReadingTab";
import BillTab from "./BillTab";
import ComplaintsTab from "./ComplaintsTab";
import AssignAmenitiesSheet from "./AssignAmenitiesSheet"
import ProfileImg from "../../../Assets/Images/profile.png";
import Dots from "../../../Assets/Images/3dots.png";
import RoomIcon from "../../../Assets/Images/profile.png";
import BedIcon from "../../../Assets/Images/profile.png";
import StayHistorySheet from "./StayHistory"

export default function CustomerOverviewScreen({ route, navigation }) {
  const { customer,customerId } = route.params || {};
const { activeHostelId } = useContext(CommonContexts);
 const { getBedsByHostelAndDate, checkInCustomer, getCustomersByHostel, changeBedCustomer, getCustomerDetails } = useCustomer();
  console.log("customer",customer)
  const [activeTab, setActiveTab] = useState("Overview");
  const [customerDetails,setCustomerDetails] = useState("")
   const [showEdit, setShowEdit] = useState(false);
    const [showEditSheet,setShowEditSheet] = useState(false)
    const [showEditJoiningDate,setShowEditJoiningDate]=useState(false)
    const [showEditRent, setShowEditRent] = useState(false);
    const [showEditAdvance,setShowEditAdvance] = useState(false)
    const [showAssignAmenities,setShowAssignAmenities] = useState(false)
    const [showStayHistory,setShowStayHistory] =useState(false)
 useEffect(() => {
    if (customer?.customerId || customerId) {
      fetchCustomerDetails();
    }
  }, [customer,customerId]);
  const handleEditBasicDetails = ()=>{
    setShowEdit(true)
  }
   const handleEditAdressDetails = ()=>{
    setShowEditSheet(true)
  }
  const handleEditJoining =()=>{
setShowEditJoiningDate(true)
  }
  const handleEditMonthlyRent = () => {
  setShowEditRent(true);
};
  const handleEditAdvance = () => {
  setShowEditAdvance(true);
};
  const handleShowAmenities = () => {
  setShowAssignAmenities(true);
};
const closeEditMonthlyRent = () => {
  setShowEditRent(false);
};

  const fetchCustomerDetails = async () => {
    const res = await getCustomerDetails(customer.customerId || customerId);
    console.log("fetchCustomerDetails", res)
    if (res.success) {
     setCustomerDetails(res.data)

    } else {
      alert(res.message);
    }
  };

 

useEffect(() => {
  const backAction = () => {

    // ✅ 1) First close bottom sheets if open
    if (showEdit) {
      setShowEdit(false);
      return true;
    }

    if (showEditSheet) {
      setShowEditSheet(false);
      return true;
    }

    if (showEditJoiningDate) {
      setShowEditJoiningDate(false);
      return true;
    }

    if (showEditRent) {
      setShowEditRent(false);
      return true;
    }

    if (showEditAdvance) {
      setShowEditAdvance(false);
      return true;
    }

    if (showAssignAmenities) {
      setShowAssignAmenities(false);
      return true;
    }

    // ✅ 2) Tab Back Order
    if (activeTab === "Complaints") {
      setActiveTab("Bill");
      return true;
    }

    if (activeTab === "Bill") {
      setActiveTab("EB Reading");
      return true;
    }

    if (activeTab === "EB Reading") {
      setActiveTab("Overview");
      return true;
    }
if (showStayHistory) {
  setShowStayHistory(false);
  return true;
}
    // ✅ 3) Overview வந்தா மட்டும் goBack()
    navigation.goBack();
    return true;
  };

  const handler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => handler.remove();
}, [
  activeTab,
  showEdit,
  showEditSheet,
  showEditJoiningDate,
  showEditRent,
  showEditAdvance,
  showAssignAmenities,showStayHistory
]);

  console.log("customerDetails",customerDetails)
  const renderTab = () => {
    switch (activeTab) {
      case "EB Reading":
        return <EBReadingTab  customerDetails={customerDetails}/>;
      case "Bill":
        return <BillTab customerDetails={customerDetails}/>;
      case "Complaints":
        return <ComplaintsTab customerDetails={customerDetails}/>;
      default:
        return <OverviewTab customerDetails={customerDetails} handleEditBasicDetails = {handleEditBasicDetails} handleEditAdressDetails={handleEditAdressDetails} handleEditJoining={handleEditJoining} handleEditMonthlyRent={handleEditMonthlyRent} handleEditAdvance={handleEditAdvance} handleShowAmenities={handleShowAmenities}/>;
    }
  };
const tabs = ["Overview", "EB Reading", "Bill", "Complaints", "Amenities"];

  return (
    <>
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Profile</Text>
        <View style={styles.notificationDot} />
      </View>

      {/* PROFILE CARD */}
      {/* <View style={styles.profileCard}>
        <Image source={ProfileImg} style={styles.avatar} />

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{customerDetails?.fullName}</Text>
            <Text style={styles.verified}>✔</Text>
            <TouchableOpacity onPress={() => setShowStayHistory(true)}>
  <Text style={[styles.verified, { color: "#2563EB" }]}>
    Stay
  </Text>
</TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.floorBadge}>
              <Text style={styles.floorText}>{customerDetails?.hostelInfo?.floorName}</Text>
            </View>

            <Image source={RoomIcon} style={styles.icon} />
            <Text style={styles.metaText}>{customerDetails?.hostelInfo?.roomName}</Text>

            <Image source={BedIcon} style={styles.icon} />
            <Text style={styles.metaText}>{customerDetails?.hostelInfo?.bedName}</Text>
          </View>
        </View>

        
      </View> */}
  <View style={styles.profileCard}>

  {/* PROFILE IMAGE */}
  <Image source={ProfileImg} style={styles.avatar} />

  {/* NAME */}
  <View style={styles.nameRowCenter}>
    <Text style={styles.name}>
      {customerDetails?.fullName}
    </Text>
    <Text style={styles.verified}>✔</Text>
  </View>

  {/* ROOM DETAILS */}
  <View style={styles.metaRowCenter}>
    <View style={styles.floorBadge}>
      <Text style={styles.floorText}>
        {customerDetails?.hostelInfo?.floorName}
      </Text>
    </View>

    <Image source={RoomIcon} style={styles.icon} />
    <Text style={styles.metaText}>
      {customerDetails?.hostelInfo?.roomName}
    </Text>

    <Image source={BedIcon} style={styles.icon} />
    <Text style={styles.metaText}>
      {customerDetails?.hostelInfo?.bedName}
    </Text>
  </View>

  {/* BUTTON ROW */}
  <View style={styles.actionRow}>
    <TouchableOpacity style={styles.walletBtn}>
      <Text style={styles.walletText}>Wallet</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.stayBtn}
      onPress={() => setShowStayHistory(true)}
    >
      <Text style={styles.stayText}>Stay History</Text>
    </TouchableOpacity>
  </View>

</View>



      {/* TABS */}
      <View style={styles.tabRow}>
        {["Overview", "EB Reading", "Bill", "Complaints"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabBtn}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
              {isActive && <View style={styles.activeLine} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1,}}>
  {renderTab()}
</View>




    </View>

    <EditBasicDetailsSheet
      visible={showEdit}
      onClose={() => setShowEdit(false)}
      customerDetails={customerDetails}
       onSuccess={fetchCustomerDetails} 
    />
    <EditManualAddressSheet
      visible={showEditSheet}
      onClose={() => setShowEditSheet(false)}
      customerDetails={customerDetails}
       onSuccess={fetchCustomerDetails} 
    />
    <EditJoiningDateSheet 
     visible={showEditJoiningDate}
     onClose={() => setShowEditJoiningDate(false)}
      customerDetails={customerDetails}
       onSuccess={fetchCustomerDetails} />
           <EditRentalAmountSheet
  visible={showEditRent}
  onClose={() => setShowEditRent(false)}
  customerDetails={customerDetails}
   onSuccess={fetchCustomerDetails}
/>
<EditAdvanceAmountSheet
 visible={showEditAdvance}
  onClose={() => setShowEditAdvance(false)}
  customerDetails={customerDetails}
   onSuccess={fetchCustomerDetails}
/>
<AssignAmenitiesSheet
 visible={showAssignAmenities}
  onClose={() => setShowAssignAmenities(false)}
  customerDetails={customerDetails}
   onSuccess={fetchCustomerDetails}
/>
<StayHistorySheet
  visible={showStayHistory}
  onClose={() => setShowStayHistory(false)}
  customerDetails={customerDetails}
/>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  back: { fontSize: 22, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "600", flex: 1 },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },

profileCard: {
  flexDirection: "column",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 16,
  marginBottom: 14,
  alignItems: "center",

  // ✅ Border
  borderWidth: 1,
  borderColor: "#E5E7EB",

  // ✅ Shadow (iOS)
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,

  // ✅ Shadow (Android)
  elevation: 3,
},


avatar: {
  width: 90,
  height: 90,
  borderRadius: 45,
  marginBottom: 12,
},
nameRowCenter: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  marginBottom: 10,
},
metaRowCenter: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  marginBottom: 18,
},


  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "600" },
  verified: { color: "green", marginLeft: 6 },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  floorBadge: {
    backgroundColor: "#F1F5FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  floorText: { fontSize: 12, color: "#2563EB" },

  icon: { width: 16, height: 16, marginHorizontal: 4 },
  metaText: { fontSize: 12, color: "#444" },

  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
    gap:10
  },

  tabBtn: {
    marginRight: 20,
    paddingBottom: 8,
  },

  tabText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  activeTabText: {
    color: "#2563EB",
    fontWeight: "600",
  },

  activeLine: {
    height: 2,
    backgroundColor: "#2563EB",
    marginTop: 6,
    borderRadius: 10,
  },
  actionRow: {
  flexDirection: "row",
  marginTop: 12,
  gap: 10,
},

walletBtn: {
 flex: 1,
  backgroundColor: "#E6F4EA",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
},

walletText: {
  color: "#1B873F",
  fontSize: 13,
  fontWeight: "600",
},

stayBtn: {
 flex: 1,
  backgroundColor: "#E6ECFF",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
},

stayText: {
  color: "#2563EB",
  fontSize: 13,
  fontWeight: "600",
},

});
