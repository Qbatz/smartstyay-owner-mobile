import React, { useState, useRef, useEffect } from "react";
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
Modal,

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
import CheckoutList from '../Customer/Checkout/CheckoutList';
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import WalkinScreen from '../Customer/WalkIn/WalkinList'
import Call from "../../Assets/Images/call.png";
import Sms from "../../Assets/Images/sms.png";
import dateImg from "../../Assets/Images/home-link.png";
import room from "../../Assets/Images/PG_active.png";
import Bed from "../../Assets/Images/bed.png";
import { Dimensions } from "react-native";





export default function TenantsScreen({ route }) {
  const { setShowTabBar } = route.params;
  const screenWidth = Dimensions.get("window").width;

  const detailDotsRef = useRef(null);

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
const [showFilter, setShowFilter] = useState(false);
const [status, setStatus] = useState("All");
const [showStatusDropdown, setShowStatusDropdown] = useState(false);
const [showDetailsMenu, setShowDetailsMenu] = useState(false);


const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

const dotsRef = useRef(null);

const openMenu = (item) => {
  dotsRef.current.measure((fx, fy, width, height, px, py) => {
    setPopupPosition({ x: px, y: py });
    setSelectedCustomer(item);
    setShowMenu(true);
  });
};

const [fromDate, setFromDate] = useState(dayjs());
const [toDate, setToDate] = useState(dayjs());

const [openFrom, setOpenFrom] = useState(false);
const [openTo, setOpenTo] = useState(false);

const formatDate = (d) => dayjs(d).format("DD-MM-YYYY");


useLayoutEffect(() => {
  setShowTabBar(!showDetailModal && !showFilter);
}, [showDetailModal, showFilter]);



useLayoutEffect(() => {
  const backAction = () => {
    if (showDetailModal) {
      setShowDetailModal(false);
      return true;
    }

    if (showFilter) {
      setShowFilter(false);
      return true;
    }

    

    return false;
  };

  const handler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

  return () => handler.remove();
}, [showDetailModal, showFilter]);


  
  const tabs = [
    { key: "Tenants", active: Profile, inactive: InProfile },
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

const handleShowFinalSettlement = () => {
navigation.navigate("FinalSettlement")
}

const handleShowTennantCheckin = () => {
navigation.navigate("TenantCheckin")
}
const handleShowAddBooking = () => {
navigation.navigate("AddBooking")
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
          <ScrollView
       showsVerticalScrollIndicator={false}
       contentContainerStyle={{ paddingBottom: 50 }} 
     >
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
              <Image source={room} style={styles.iconSmall} />
              <Text style={styles.detailText}>203</Text>
              <Image source={Bed} style={styles.iconSmall} />
              <Text style={styles.detailText}>03</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
          

      
<TouchableOpacity ref={dotsRef} onPress={() => openMenu(customerList[0])}>

  <Image
    source={Dots}
    style={{ width: 30, height: 30, transform: [{ rotate: "90deg" }] }}
  />
</TouchableOpacity>


            <Text style={styles.dateText}>01/06</Text>
            
          </View>
        
        </View>
        
      </ScrollView>

     
    
      <TouchableOpacity style={styles.editButton} onPress={() => setShowFilter(true)}>
    <Image source={EditPin} style={{ width: 60, height: 60 }} />
</TouchableOpacity>


      <TouchableOpacity style={styles.addButton}  onPress={() => navigation.navigate("AddTenant")}>
        <Image source={TenAntAdd} style={{ width: 60, height: 60 }} />
      </TouchableOpacity>
    </View>
  )}

{activeTab === "Checkout" && (
   <CheckoutList/>
  )}
  {activeTab === "Walkin" && (
   <WalkinScreen setShowTabBar = {setShowTabBar}/>
  )}
 
{showDetailModal && (
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPress={() => setShowDetailModal(false)} 
  >
    <TouchableWithoutFeedback>
      <View style={styles.bottomSheet}>
        <View style={styles.modalHandle} />

        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Customer Details</Text>
         {/* <TouchableOpacity onPress={() => setShowDetailsMenu(true)}>
            <Image
              source={Dots}
              style={{ width: 24, height: 24, transform: [{ rotate: "90deg" }] }}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
  ref={detailDotsRef}
  onPress={() => {
    detailDotsRef.current.measureInWindow((x, y, w, h) => {
      setPopupPosition({ x, y, w, h });
      setShowDetailsMenu(true);
    });
  }}
>
  <Image source={Dots} style={{ width: 24, height: 24, transform: [{ rotate: "90deg" }] }} />
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
              <Image source={room} style={{width:18,height:18}} />
              <Text style={styles.detailText}>{selectedCustomer?.room}</Text>
              <Image source={Bed} style={{width:18,height:18}} />
              <Text style={styles.detailText}>{selectedCustomer?.bed}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.infoLabel}>Email ID</Text>
        {/* <Text style={styles.infoValue}> <Image source={Call} style={{width:15,height:15,marginRight:5}} />{selectedCustomer?.email}</Text> */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
  <Image
    source={Sms}
    style={{ width: 15, height: 15, marginRight: 5 }}
    resizeMode="contain"
  />
  <Text style={styles.infoValue}>{selectedCustomer?.email}</Text>
</View>


        <Text style={styles.infoLabel}>Contact Number</Text>
   <View style={{ flexDirection: "row", alignItems: "center" }}>
  <Image
    source={Call}
    style={{ width: 15, height: 15, marginRight: 5 }}
    resizeMode="contain"
  />
  <Text style={styles.infoValue}>{selectedCustomer?.phone}</Text>
</View>
        <Text style={styles.infoLabel}>Joining Date</Text>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
  <Image
    source={dateImg}
    style={{ width: 15, height: 15, marginRight: 5 }}
    resizeMode="contain"
  />
  <Text style={styles.infoValue}>{selectedCustomer?.joinDate}</Text>
</View>
        <TouchableOpacity style={styles.unassignBtn}>
          <Text style={styles.unassignText}>Un Assigned</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  </TouchableOpacity>
)}

 {showDetailModal && showDetailsMenu && (
  <>
    <TouchableOpacity
      style={styles.menuBackdrop}
      onPress={() => setShowDetailsMenu(false)}
    />

    <View
      style={[
        styles.popupBox,
        {
          top: popupPosition.y + popupPosition.h + 8,
          left:
            popupPosition.x + 200 > screenWidth
              ? popupPosition.x - 200 + popupPosition.w
              : popupPosition.x,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.popupRow}
        onPress={() => {
          setShowDetailsMenu(false);
          setShowReAssignBed(true);
        }}
      >
        <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
        <Text style={styles.popupText}>Re-Assign Bed</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.popupRow}
        onPress={() => {
          setShowDetailsMenu(false);
          setShowNotice(true);
        }}
      >
        <Image source={require("../../Assets/Images/ReAssign.png")} style={styles.popupIcon} />
        <Text style={styles.popupText}>Move to Notice Period</Text>
      </TouchableOpacity>
    </View>
  </>
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

     <TouchableOpacity style={styles.popupRow} onPress={handleShowAddBooking} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Add Booking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.popupRow} onPress={handleShowTennantCheckin} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Tenant Check-in</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.popupRow} onPress={handleShowReAssignBed} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Re-Assign Bed</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.popupRow} onPress={handleShowFinalSettlement} >
        <Image
          source={require("../../Assets/Images/ReAssign.png")}
          style={styles.popupIcon}
        />
        <Text style={styles.popupText}>Final Settlemnent</Text>
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

{showFilter && (
  <TouchableOpacity
    style={styles.filterOverlay}
    activeOpacity={1}
    onPress={() => setShowFilter(false)}   // close when clicking outside
  >
    <TouchableWithoutFeedback>
      <View style={styles.filterSheet}>
        <View style={styles.filterHandle} />

        {/* Header */}
        <View style={styles.filterHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={EditPin}
              style={{ width: 35, height: 35, marginRight: 8 }}
            />
            <Text style={styles.filterTitle}>Filter by</Text>
          </View>
        </View>

        {/* STATUS DROPDOWN */}
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
                source={require("../../Assets/Images/calendar.png")}
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
                source={require("../../Assets/Images/calendar.png")}
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

<Modal
  transparent
  visible={openFrom}
  animationType="fade"
  onRequestClose={() => setOpenFrom(false)}
>
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


<Modal
  transparent
  visible={openTo}
  animationType="fade"
  onRequestClose={() => setOpenTo(false)}
>
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





{showNotice && (
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
)}


      
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
  outsideTouch: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
},
tabContainer: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: 14,
  borderBottomWidth: 1,
  borderBottomColor: "#E5E7EB",
  paddingBottom: 6,
},
// dropdownMenu: {
//   backgroundColor: "#fff",
//   borderRadius: 10,
//   marginTop: 5,
//   borderWidth: 1,
//   borderColor: "#E5E7EB",
//   overflow: "hidden",
//   elevation: 5,
// },
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
},
menuBackdrop: {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "transparent",
  zIndex: 9999
},

datePickerOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},

datePickerBox: {
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 12,
  elevation: 10,
  zIndex: 999,
},



calIcon: { width: 20, height: 20 },






dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 12,
},

dropdownItemText: {
  fontSize: 14,
  color: "#111",
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
    width: 18,
    height: 18,
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
  width: 200,
  backgroundColor: "#fff",
  borderRadius: 12,
  elevation: 20,
  paddingVertical: 10,
  zIndex: 10000,
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


filterOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
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

filterHeader: {
  flexDirection: "row",
  justifyContent: "flex-start",
  marginBottom: 20,
},

filterTitle: {
  fontSize: 18,
  fontWeight: "700",
},

label: {
  fontSize: 13,
  color: "#6B7280",
  marginBottom: 6,
  marginTop: 10,
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

dropdownText: {
  color: "#111",
  fontSize: 15,
},

arrow: { fontSize: 18, color: "#555" },

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



quickRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
},

quickBtn: {
  backgroundColor: "#F8F9FA",
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 10,
},

quickText: { color: "#111", fontWeight: "500" },

bottomButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 25,
},

resetBtn: {
  backgroundColor: "#F2F3FF",
  paddingVertical: 12,
  borderRadius: 10,
  width: "48%",
  alignItems: "center",
},

resetText: {
  color: "#2D6CDF",
  fontWeight: "600",
},

applyBtn: {
  backgroundColor: "#2D6CDF",
  paddingVertical: 12,
  borderRadius: 10,
  width: "48%",
  alignItems: "center",
},

applyText: {
  color: "#fff",
  fontWeight: "600",
},



});
