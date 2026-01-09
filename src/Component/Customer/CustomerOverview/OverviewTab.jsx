import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,ScrollView
} from "react-native";

import Mail from "../../../Assets/Images/sms.png";
import Phone from "../../../Assets/Images/call.png";
import Home from "../../../Assets/Images/home-link.png";
import Location from "../../../Assets/Images/sms.png";
import BedIcon from "../../../Assets/Images/profile.png";
import RoomIcon from "../../../Assets/Images/PG_active.png";
import FloorIcon from "../../../Assets/Images/profile.png";
import CalendarIcon from "../../../Assets/Images/calendar.png";
import EditIcon from "../../../Assets/Images/edit.png";



export default function OverviewTab({ customerDetails,handleEditBasicDetails,handleEditAdressDetails }) {
const [addressTab, setAddressTab] = useState("KYC");
const handleEdit = ()=>{
  handleEditBasicDetails()
}
const handleAdressEdit=()=>{
  handleEditAdressDetails()
}
console.log("customerDetails1234",customerDetails)

  const [docTab, setDocTab] = useState("KYC");
  const [flat,setFlat] = useState("")
  const [area,setArea] = useState("")
  const [landmark,setLandmark] = useState("")
  const [city,setCity] = useState("")
  const [pincode,setPincode] = useState("")
  const [stateList,setStateList] = useState("")
 
 
useEffect(()=>{
  if(customerDetails){
setFlat(customerDetails?.address?.houseNo)
  }

},[customerDetails])


  return (
<>

      <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
    <View style={{ paddingBottom: 30,padding:5}}>


    <View style={styles.sectionBox}>
 
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionTitle}>Basic Details</Text>
    {/* <Image source={EditIcon} style={styles.editIcon} /> */}
   <TouchableOpacity onPress={handleEdit}>
          <Image source={EditIcon} style={styles.editIcon} />
        </TouchableOpacity>
  </View>
  {/* First Name */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>First Name</Text>
    <Text style={styles.detailValue}>
      {customerDetails?.firstName || "N/A"}
    </Text>
  </View>

  {/* Last Name */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Last Name</Text>
    <Text style={styles.detailValue}>
      {customerDetails?.lastName || "N/A"}
    </Text>
  </View>

  {/* Email */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Email</Text>
    <View style={styles.valueWithIcon}>
      <Image source={Mail} style={styles.detailIcon} />
      <Text style={styles.detailValue}>
        {customerDetails?.emailId || "N/A"}
      </Text>
    </View>
  </View>

  {/* Mobile */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Mobile no.</Text>
    <View style={styles.valueWithIcon}>
      <Image source={Phone} style={styles.detailIcon} />
      <Text style={styles.detailValue}>
      +{customerDetails?.countryCode} {customerDetails?.mobileNo || "N/A"}
      </Text>
    </View>
  </View>

</View>




<View style={styles.card}>


  <View style={styles.addressHeader}>
    <View style={styles.tabRow}>
      <TouchableOpacity onPress={() => setAddressTab("KYC")}>
        <Text style={[
          styles.tabText,
          addressTab === "KYC" && styles.activeTab
        ]}>
          KYC Address
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setAddressTab("MANUAL")}>
        <Text style={[
          styles.tabText,
          addressTab === "MANUAL" && styles.activeTab
        ]}>
          Manual Address
        </Text>
      </TouchableOpacity>
    </View>

   
    {addressTab === "MANUAL" && (
     <TouchableOpacity onPress={handleAdressEdit}>
    <Image source={EditIcon} style={styles.editIcon} />
  </TouchableOpacity>
    )}
  </View>

   {
    addressTab === "KYC" && (
      <View style={{paddingTop:18}}>
     <View style={styles.row}>
  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>House No / Apartment</Text>
    <View style={styles.valueRow}>
      <Image source={Home} style={styles.icon} />
      <Text style={styles.value}>
        {/* {customerDetails?.address?.houseNo || "N/A"} */}
      </Text>
    </View>
  </View>

  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>Street / Area</Text>
    <View style={styles.valueRow}>
      <Image source={Location} style={styles.icon} />
      <Text style={styles.value}>
        {/* {customerDetails?.address?.streetName || "N/A"} */}
      </Text>
    </View>
  </View>
</View>


 <View style={styles.row}>
  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>Landmark</Text>
    <View style={styles.valueRow}>
      <Image source={Location} style={styles.icon} />
      <Text style={styles.value}>
        {/* {customerDetails?.address?.landmark || "N/A"} */}
      </Text>
    </View>
  </View>

  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>Pincode</Text>
    <Text style={styles.value}>
      {/* {customerDetails?.address?.pincode || "N/A"} */}
    </Text>
  </View>
</View>


 <View style={styles.row}>
  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>City</Text>
    <Text style={styles.value}>
      {/* {customerDetails?.address?.city || "N/A"} */}
    </Text>
  </View>

  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>State</Text>
    <Text style={styles.value}>
      {/* {customerDetails?.address?.state || "N/A"} */}
    </Text>
  </View>
</View>

 
      </View>
  )}

  {
    addressTab === "MANUAL" && (
    
      <View>
     <View style={styles.row}>
  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>House No / Apartment</Text>
    <View style={styles.valueRow}>
      <Image source={Home} style={styles.icon} />
      <Text style={styles.value}>
        {customerDetails?.address?.houseNo || "N/A"}
      </Text>
    </View>
  </View>

  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>Street / Area</Text>
    <View style={styles.valueRow}>
      <Image source={Location} style={styles.icon} />
      <Text style={styles.value}>
        {customerDetails?.address?.streetName || "N/A"}
      </Text>
    </View>
  </View>
</View>


 <View style={styles.row}>
  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>Landmark</Text>
    <View style={styles.valueRow}>
      <Image source={Location} style={styles.icon} />
      <Text style={styles.value}>
        {customerDetails?.address?.landmark || "N/A"}
      </Text>
    </View>
  </View>

  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>Pincode</Text>
    <Text style={styles.value}>
      {customerDetails?.address?.pincode || "N/A"}
    </Text>
  </View>
</View>


 <View style={styles.row}>
  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>City</Text>
    <Text style={styles.value}>
      {customerDetails?.address?.city || "N/A"}
    </Text>
  </View>

  <View style={[styles.detailBlock, styles.halfBlock]}>
    <Text style={styles.label}>State</Text>
    <Text style={styles.value}>
      {customerDetails?.address?.state || "N/A"}
    </Text>
  </View>
</View>

 
      </View>
  )}
 

</View>


     
    <View style={styles.card}>

 
  <View style={styles.cardHeader}>
    <Text style={styles.cardTitle}>Stay Details</Text>
    <Image source={EditIcon} style={styles.editIcon} />
  </View>

  {/* Floor */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Floor</Text>
    <View style={styles.valueWithIcon}>
      <Image source={FloorIcon} style={styles.detailIcon} />
      <Text style={styles.detailValue}>
        {customerDetails?.floorName || "--"}
      </Text>
    </View>
  </View>

  {/* Room */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Room</Text>
    <View style={styles.valueWithIcon}>
      <Image source={RoomIcon} style={styles.detailIcon} />
      <Text style={styles.detailValue}>
        {customerDetails?.roomName || "--"}
      </Text>
    </View>
  </View>

  {/* Bed */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Bed</Text>
    <View style={styles.valueWithIcon}>
      <Image source={BedIcon} style={styles.detailIcon} />
      <Text style={styles.detailValue}>
        {customerDetails?.bedName || "--"}
      </Text>
    </View>
  </View>


  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Joined Date</Text>
    <View style={styles.valueWithIcon}>
      <Image source={CalendarIcon} style={styles.detailIcon} />
      <Text style={styles.detailValue}>
        {customerDetails?.joiningDate || "20 Sep 2024"}
      </Text>
    </View>
  </View>

 
  <View style={styles.divider} />


  <Text style={styles.sectionTitle}>Financial Details</Text>

  <View style={styles.amountRow}>
     <View style={styles.amountValueRow}>
    <Text style={styles.amountValue}>Monthly Rent</Text>
   <Image source={EditIcon} style={styles.editIconSmall} />
   </View>
      <Text style={styles.amountLabel}>₹ 7,500</Text>
      
    
  </View>

  <View style={styles.amountRow}>
     <View style={styles.amountValueRow}>
    <Text style={styles.amountLabel}>Advance amount</Text>
      <Image source={EditIcon} style={styles.editIconSmall} />
    </View>
      <Text style={styles.amountValue}>₹ 4,500</Text>
    
   
  </View>

  <View style={styles.amountRow}>
    <Text style={styles.amountLabel}>Booking amount</Text>
    <Text style={styles.amountValue}>₹ 4,500</Text>
  </View>

  <View style={styles.amountRow}>
    <Text style={styles.amountLabel}>Maintenance</Text>
    <Text style={styles.amountValue}>₹ 2,000</Text>
  </View>

  <View style={styles.amountRow}>
    <Text style={styles.amountLabel}>Document Fee</Text>
    <Text style={styles.amountValue}>₹ 800</Text>
  </View>

</View>


    
<View style={styles.docContainer}>

 
  <View style={styles.docTabRow}>
    <TouchableOpacity onPress={() => setDocTab("KYC")}>
      <Text
        style={[
          styles.docTabText,
          docTab === "KYC" && styles.docActiveTab,
        ]}
      >
        KYC Documents
      </Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => setDocTab("MANUAL")}>
      <Text
        style={[
          styles.docTabText,
          docTab === "MANUAL" && styles.docActiveTab,
        ]}
      >
        Manual Documents
      </Text>
    </TouchableOpacity>
  </View>

 
  {docTab === "KYC" && (
    <>
     
      <View style={styles.docRow}>
        <View style={styles.docLeft}>
          <Image
            source={require("../../../Assets/Images/profile.png")}
            style={styles.pdfIcon}
          />
          <View>
            <Text style={styles.docTitle}>Rental Agreement.pdf</Text>
            <Text style={styles.docMeta}>180 KB · PDF</Text>
          </View>
        </View>

        <View style={styles.docActions}>
          <Image
            source={require("../../../Assets/Images/Eye.png")}
            style={styles.actionIcon}
          />
          <Image
            source={require("../../../Assets/Images/download.png")}
            style={styles.actionIcon}
          />
        </View>
      </View>

      {/* Aadhar */}
      <View style={styles.docRow}>
        <View style={styles.docLeft}>
          <Image
            source={require("../../../Assets/Images/profile.png")}
            style={styles.pdfIcon}
          />
          <View>
            <Text style={styles.docTitle}>Aadhar.pdf</Text>
            <Text style={styles.docMeta}>180 KB · PDF</Text>
          </View>
        </View>

        <View style={styles.docActions}>
          <Image
            source={require("../../../Assets/Images/Eye.png")}
            style={styles.actionIcon}
          />
          <Image
            source={require("../../../Assets/Images/download.png")}
            style={styles.actionIcon}
          />
        </View>
      </View>
    </>
  )}

  
  {docTab === "MANUAL" && (
   
    <View style={styles.docRow}>
  <View style={styles.docLeft}>
    <Image
      source={require("../../../Assets/Images/profile.png")} // PDF icon
      style={styles.pdfIcon}
    />
    <View>
      <Text style={styles.docTitle}>Manual_Document.pdf</Text>
      <Text style={styles.docMeta}>180 KB · PDF</Text>
    </View>
  </View>

  <View style={styles.docActions}>
    <Image
      source={require("../../../Assets/Images/Eye.png")}
      style={styles.actionIcon}
    />
    <Image
      source={require("../../../Assets/Images/download.png")}
      style={styles.actionIcon}
    />
  </View>
</View>

  )}

</View>
<View style={styles.sectionBox}>

  {/* HEADER */}
  <View style={styles.sectionHeaderRowgur}>
    <Text style={styles.sectionTitle}>Parent / Guardian Details</Text>

    <TouchableOpacity>
      <Image source={EditIcon} style={styles.editIcon} />
    </TouchableOpacity>
  </View>

  {/* Guardian Full Name */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Guardian Full Name</Text>
    <Text style={styles.detailValue}>Sivanesan R</Text>
  </View>

  {/* Relationship */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Relationship to Tenant</Text>
    <Text style={styles.detailValue}>Parent</Text>
  </View>

  {/* Occupation */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Guardian Occupation</Text>
    <Text style={styles.detailValue}>Private Employee</Text>
  </View>

  {/* Mobile */}
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>Mobile no.</Text>
    <View style={styles.valueWithIcon}>
      <Image source={Phone} style={styles.phoneIcon} />
      <Text style={styles.detailValue}>+91 98765 43210</Text>
    </View>
  </View>

</View>


<View style={styles.sectionBox}>

  {/* HEADER */}
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionTitle}>Amenities provided</Text>

    <TouchableOpacity style={styles.assignBtn}>
      <Text style={styles.assignText}>＋ Assign</Text>
    </TouchableOpacity>
  </View>

  {/* PROVIDED AMENITIES */}
  <View style={styles.amenityItem}>
    <Text style={styles.amenityTitle}>Wi-Fi (5G)</Text>
    <Text style={styles.amenityPrice}>₹399 / month</Text>
  </View>

  <View style={styles.amenityItem}>
    <Text style={styles.amenityTitle}>Food</Text>
    <Text style={styles.amenityPrice}>₹1,299 / month</Text>
  </View>

  <View style={styles.amenityItem}>
    <Text style={styles.amenityTitle}>Laundry</Text>
    <Text style={styles.amenityPrice}>₹299 / month</Text>
  </View>

  {/* REQUESTED */}
  <Text style={styles.subTitle}>Requested Amenities</Text>

  <View style={styles.amenityItem}>
    <Text style={styles.amenityTitle}>Bicycle</Text>
    <Text style={styles.amenityPrice}>₹399 / month</Text>

    <View style={styles.actionRow}>
      <TouchableOpacity style={styles.approveBtn}>
        <Text style={styles.btnText}>✓ Approve</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.denyBtn}>
        <Text style={styles.btnText}>✕ Deny</Text>
      </TouchableOpacity>
    </View>
  </View>

</View>

     
     
    </View>
    </ScrollView>
     
    </>
  );
}











const Amenity = ({ title, price, children }) => (
  <View style={styles.amenityCard}>
    <Text style={styles.amenityTitle}>{title}</Text>
    <Text style={styles.amenityPrice}>{price}</Text>
    {children}
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
 card: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 14,
  marginTop: 14,
  elevation: 2,
},
cardHeader: {
  flexDirection: "row",
  alignItems: "center",
 
},
  cardTitle: { fontSize: 15, fontWeight: "600" },
editIcon: {
  width: 18,
  height: 18,
  tintColor: "grey",
  marginLeft: "auto",
},

 assignBtn: {
  marginLeft: "auto",
  backgroundColor: "#2563EB",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 10,
},

  assignText: { color: "#fff", fontSize: 12 },

  infoRow: { marginBottom: 12 },
  label: { fontSize: 12, color: "#6B7280" },
  valueRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  value: { fontSize: 14, fontWeight: "500" },
  icon: { width: 14, height: 14, marginRight: 6 },

  amount: { fontWeight: "600", color: "#2563EB" },
  editSmall: { width: 14, height: 14, marginLeft: 6 },

 tabRow: {
  flexDirection: "row",
},

tabText: {
  marginRight: 18,
  color: "#9CA3AF",
},

 activeTab: {
  color: "#2563EB",
  fontWeight: "600",
  borderBottomWidth: 2,
  borderColor: "#2563EB",
},

  docItem: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  docSub: { fontSize: 12, color: "#666", marginTop: 4 },

  amenityCard: {
    backgroundColor: "#F8FAFF",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  amenityTitle: { fontWeight: "600" },
  amenityPrice: { fontSize: 12, color: "#666", marginTop: 2 },

  subTitle: { marginTop: 14, fontWeight: "600" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  approveBtn: {
    backgroundColor: "#16A34A",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  denyBtn: {
    backgroundColor: "#DC2626",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
  detailRow: {
  marginBottom: 14,
},

detailLabel: {
  fontSize: 12,
  color: "#9CA3AF",
  marginBottom: 4,
},

detailValue: {
  fontSize: 14,
  fontWeight: "500",
  color: "#111827",
},
phoneIcon: {
  width: 16,
  height: 16,
  marginRight: 6,
  tintColor: "#2563EB",
},

valueWithIcon: {
  flexDirection: "row",
  alignItems: "center",
},

detailIcon: {
  width: 16,
  height: 16,
  marginRight: 6,
  tintColor: "#2563EB",
},
detailBlock: {
  marginBottom: 12,
},
sectionBox: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 14,
  marginTop: 14,
  elevation: 2,
},

sectionHeader: {
  marginBottom: 12,
},

sectionTitle: {
  fontSize: 15,
  fontWeight: "600",
  color: "#111827",
},
divider: {
  height: 1,
  backgroundColor: "#E5E7EB",
  marginVertical: 16,
},

amountRow: {
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "start",
  marginBottom: 15,
  paddingTop:10
},

amountLabel: {
  fontSize: 12,
  color: "#9CA3AF",
  marginBottom:0
},

amountValueRow: {
  flexDirection: "row",
  alignItems: "center",
},

amountValue: {
  fontSize: 14,
  fontWeight: "600",
  color: "#2563EB",
},

editIconSmall: {
  width: 14,
  height: 14,
  marginLeft: 6,
  tintColor: "grey",
},
docContainer: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 14,
  marginTop: 14,
  elevation: 2,
},

docTabRow: {
  flexDirection: "row",
  marginBottom: 14,
},

docTabText: {
  marginRight: 20,
  color: "#9CA3AF",
  fontSize: 14,
},

docActiveTab: {
  color: "#2563EB",
  fontWeight: "600",
  borderBottomWidth: 2,
  borderColor: "#2563EB",
  paddingBottom: 4,
},

docRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  paddingVertical: 15,
  paddingHorizontal: 14,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#E5E7EB",
},
docLeft: {
  flexDirection: "row",              // 🔥 icon + text row
  alignItems: "center",
  flex: 1,
},


pdfIcon: {
  width: 32,
  height: 32,
},

docTitle: {
  fontSize: 14,
  fontWeight: "500",
},

docMeta: {
  fontSize: 12,
  color: "#6B7280",
  marginTop: 2,
},

docActions: {
  flexDirection: "row",
},

actionIcon: {
  width: 18,
  height: 18,
  marginLeft: 14,
  tintColor: "#6B7280",
},
sectionHeaderRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 14,
},
sectionHeaderRowgur: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 14,
  justifyContent:"space-between"
},
amenityItem: {
  backgroundColor: "#F8FAFF",
  borderRadius: 12,
  padding: 12,
  marginBottom: 10,
},
row: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 12,
},

halfBlock: {
  width: "48%",
},



});
