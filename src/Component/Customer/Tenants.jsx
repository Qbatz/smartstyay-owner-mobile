import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
TouchableWithoutFeedback,

  BackHandler
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";


import Profile from "../../Assets/Images/profile.png";
import EditPin from "../../Assets/Images/EditPin.png";
import SearchIcon from "../../Assets/Images/Asset_search.png";
import InProfile from "../../Assets/Images/inActiveuser.png";
import ActiveCheckout from "../../Assets/Images/ActiveCheckout.png";
import CheckoutIcon from "../../Assets/Images/checkout.png";
import ActiveWalkin from "../../Assets/Images/ActiveWalkin.png";
import WalkinIcon from "../../Assets/Images/walkin.png";
import TenAntAdd from "../../Assets/Images/TenantAdd.png";
import Dots from "../../Assets/Images/3dots.png";
import MoveNoticeModal from '../Customer/MoveToNoticePeriod';
import ReassignBedModal from '../Customer/ReAssignBed';


export default function TenantsScreen({ route }) {
  const { setShowTabBar } = route.params;
  const [activeTab, setActiveTab] = useState("Tenants");
  const navigation = useNavigation();
  const [showDetailModal, setShowDetailModal] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState(null);
const [showReAssignbed , setShowReAssignBed] = useState(false)
const [showNotice, setShowNotice] = useState(false);
const [reqDate, setReqDate] = useState("31/07/2025");
const [outDate, setOutDate] = useState("30/08/2025");
const [reason, setReason] = useState("");
const [showMenu, setShowMenu] = useState(false);
const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
const openMenu = (event) => {
  const { pageX, pageY } = event.nativeEvent;

  setPopupPosition({ x: pageX, y: pageY });
  setShowMenu(true);
};


useLayoutEffect(() => {
  setShowTabBar(!showDetailModal);
}, [showDetailModal]);


useLayoutEffect(() => {
  const backAction = () => {
    if (showDetailModal) {
      setShowDetailModal(false);   
      return true;                 
    }
    return false;
  };

  const handler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => handler.remove();
}, [showDetailModal]);

  
  const tabs = [
    { key: "Tenants", active: InProfile, inactive: Profile },
    { key: "Checkout", active: ActiveCheckout, inactive: CheckoutIcon },
    { key: "Walkin", active: ActiveWalkin, inactive: WalkinIcon },
  ];


const openCustomerDetails = (customer) => {
  setSelectedCustomer(customer);
  setShowDetailModal(true);
};

const handleShowReAssignBed = () => {
  setShowReAssignBed(true)
}

const handlecloseReAssignbed = () => {
   setShowReAssignBed(false)
}

const customerList = [
  {
    id: 1,
    name: "Rajkumar M",
    img: Profile,
    floor: "Ground Floor",
    room: "203",
    bed: "03",
    email: "rajkumar001@gmail.com",
    phone: "+91 98765 43210",
    joinDate: "10 July 2025",
  },
];

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <Image source={SearchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Customers"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      
      <View style={styles.tabContainer}>
  {tabs.map((tab) => (
    <TouchableOpacity
      key={tab.key}
      style={[styles.tab, activeTab === tab.key && styles.activeTab]}
      onPress={() => setActiveTab(tab.key)}
    >
      <View style={styles.tabContent}>
        <Image
          source={activeTab === tab.key ? tab.active : tab.inactive}
          style={styles.tabIcon}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === tab.key && styles.activeText,
          ]}
        >
          {tab.key}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
</View>

 {activeTab === "Tenants" && (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>This Month</Text>
<View style={styles.tenantRow}>
        <TouchableOpacity  onPress={() => openCustomerDetails(customerList[0])}>
          <Image source={Profile} style={styles.profileImg} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Rajkumar M</Text>
            <View style={styles.detailRow}>
              <View style={styles.floorBadge}>
                <Text style={styles.floorText}>Ground Floor</Text>
              </View>
              <Image source={EditPin} style={styles.iconSmall} />
              <Text style={styles.detailText}>203</Text>
              <Image source={EditPin} style={styles.iconSmall} />
              <Text style={styles.detailText}>03</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
          

      
 <TouchableOpacity onPress={openMenu}>
  <Image
    source={Dots}
    style={{ width: 30, height: 30, transform: [{ rotate: "90deg" }] }}
  />
</TouchableOpacity>


            <Text style={styles.dateText}>01/06</Text>
            
          </View>
        
        </View>
      </ScrollView>

     
      <TouchableOpacity style={styles.editButton}>
        <Image source={EditPin} style={{ width: 60, height: 60 }} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton}  onPress={() => navigation.navigate("AddTenant")}>
        <Image source={TenAntAdd} style={{ width: 60, height: 60 }} />
      </TouchableOpacity>
    </View>
  )}


 
{showDetailModal && (
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPress={() => setShowDetailModal(false)}   // 👉 tap outside closes modal
  >
    <TouchableWithoutFeedback>
      <View style={styles.bottomSheet}>
        <View style={styles.modalHandle} />

        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Customer Details</Text>
          <TouchableOpacity onPress={() => setShowDetailModal(false)}>
            <Image
              source={Dots}
              style={{ width: 24, height: 24, transform: [{ rotate: "90deg" }] }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.modalProfileRow}>
          <Image source={selectedCustomer?.img} style={styles.modalProfileImg} />

          <View style={{ marginLeft: 12 }}>
            <Text style={styles.modalName}>{selectedCustomer?.name}</Text>

            <View style={styles.detailRow}>
              <View style={styles.floorBadge}>
                <Text style={styles.floorText}>{selectedCustomer?.floor}</Text>
              </View>
              <Image source={EditPin} style={styles.iconSmall} />
              <Text style={styles.detailText}>{selectedCustomer?.room}</Text>
              <Image source={EditPin} style={styles.iconSmall} />
              <Text style={styles.detailText}>{selectedCustomer?.bed}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.infoLabel}>Email ID</Text>
        <Text style={styles.infoValue}>{selectedCustomer?.email}</Text>

        <Text style={styles.infoLabel}>Contact Number</Text>
        <Text style={styles.infoValue}>{selectedCustomer?.phone}</Text>

        <Text style={styles.infoLabel}>Joining Date</Text>
        <Text style={styles.infoValue}>{selectedCustomer?.joinDate}</Text>

        <TouchableOpacity style={styles.unassignBtn}>
          <Text style={styles.unassignText}>Un Assigned</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  </TouchableOpacity>
)}

    <ReassignBedModal visible={showReAssignbed}  onClose={handlecloseReAssignbed} />


{showMenu && (
  <TouchableOpacity
    activeOpacity={1}
    onPress={() => setShowMenu(false)}
    style={styles.popupOverlay}
  >
    <View
      style={[
        styles.popupBox,
        { top: popupPosition.y + 10, left: popupPosition.x - 180 },
      ]}
    >
    
      <TouchableOpacity style={styles.popupRow} onPress={handleShowReAssignBed} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Re-Assign Bed</Text>
      </TouchableOpacity>

      
      <TouchableOpacity
        style={styles.popupRow}
        onPress={() => {
          setShowMenu(false);
          setShowNotice(true); 
        }}
      >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Move to Notice Period</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
)}


<MoveNoticeModal
  visible={showNotice}
  onClose={() => setShowNotice(false)}
  tenant={selectedCustomer}
  requestDate={reqDate}
  checkoutDate={outDate}
  reason={reason}
  setRequestDate={setReqDate}
  setCheckoutDate={setOutDate}
  setReason={setReason}
  onMove={() => console.log("Move Clicked")}
/>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical:50
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderRadius: 40,
    paddingHorizontal: 12,
    marginTop: 10,
    height: 55,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
tabContainer: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 14,
  borderBottomWidth: 1,
  borderBottomColor: "#E5E7EB",
  paddingBottom: 6,
},

tab: {
  alignItems: "center",
  paddingBottom: 6,
},

activeTab: {
  borderBottomWidth: 2,
  borderBottomColor: "#2D6CDF",
},

tabContent: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6, 
},

tabIcon: {
  width: 25,
  height: 25,
  resizeMode: "contain",
},

tabText: {
  fontSize: 16,
  color: "#6B7280",
},

activeText: {
  color: "#2D6CDF",
  fontWeight: "600",
},

  sectionTitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginVertical: 10,
  },
  tenantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  profileImg: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  floorBadge: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
  },
  floorText: {
    fontSize: 11,
    color: "#2D6CDF",
    fontWeight: "500",
  },
  iconSmall: {
    width: 13,
    height: 13,
    marginHorizontal: 3,
  },
  detailText: {
    fontSize: 12,
    color: "#4B5563",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 3,
  },
  dots: {
    fontSize: 22,
    color: "#6B7280",
  },
  addButton: {
    position: "absolute",
    right: 10,
    bottom: 50,
  },
   editButton: {
    position: "absolute",
    right: 10,
    bottom:110,
  },
  modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "flex-end",
},

bottomSheet: {
  backgroundColor: "#fff",
  padding: 20,
  borderTopLeftRadius: 25,
  borderTopRightRadius: 25,
  height: "55%",
},

modalHandle: {
  width: 60,
  height: 4,
  backgroundColor: "#ccc",
  alignSelf: "center",
  borderRadius: 100,
  marginBottom: 15,
},

modalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#111",
},

modalProfileRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
},

modalProfileImg: {
  width: 55,
  height: 55,
  borderRadius: 30,
},

modalName: {
  fontSize: 17,
  fontWeight: "600",
  color: "#111",
},

infoLabel: {
  marginTop: 15,
  fontSize: 13,
  color: "#6B7280",
},

infoValue: {
  fontSize: 14,
  color: "#111",
  marginTop: 3,
},

unassignBtn: {
  borderWidth: 1,
  borderColor: "#111",
  borderRadius: 15,
  marginTop: 25,
  paddingVertical: 12,
  alignItems: "center",
},

unassignText: {
  fontSize: 15,
  fontWeight: "600",
},
popupOverlay: {
  position: "absolute",
  top: 10,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "transparent",
},

popupBox: {
  position: "absolute",
  backgroundColor: "#fff",
  paddingVertical: 10,
  width: 200,
  borderRadius: 12,
  elevation: 10,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 8,
},

popupRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 12,
},

popupIcon: {
  width: 20,
  height: 20,
  marginRight: 10,
},

popupText: {
  fontSize: 14,
  color: "#333",
},


});
