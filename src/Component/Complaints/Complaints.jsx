
import React , {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import Profile from "../../Assets/Images/Avatar.png";
import FilterIcon from "../../Assets/Images/filter.png";
import AddComplaint from "../../Assets/Images/add-circle.png";
import ComplaintDetails from "../Complaints/ViewCompliance";
import AssignBottomSheet from "../Complaints/AssignCompliance";
import CommentBottomSheet from "../Complaints/CommentBox";
import ChangeStatus from "../Complaints/ComplianceStatus";

export default function Complaints({ route }) {
  const navigation = useNavigation();

  // ---------- STATES ----------
  const [showSheet, setShowSheet] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [selectedUser, setSelectedUser] = useState("Select");
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  const [showAssignSheet, setShowAssignSheet] = useState(false);
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [showStatusSheet, setShowStatusSheet] = useState(false);


  const { setShowTabBar } = route.params
   const navigation = useNavigation();
   const [showFilter, setShowFilter] = useState(false);
   const [status, setStatus] = useState("All");
   const [showStatusDropdown, setShowStatusDropdown] = useState(false);


  const complaintsData = [
    {
      id: "1",
      title: "AC Problem",
      user: "Rajeshkumar-204-A",
      time: "02 Hours ago",
      status: "+ Assign",
      statusColor: "#1D5DFF",
    },
    {
      id: "2",
      title: "Water Leakage, Power Issue",
      user: "Parthiban-203-C",
      time: "Yesterday",
      status: "+ Assign",
      statusColor: "#1D5DFF",
    },
    {
      id: "3",
      title: "Washing machine Problem",
      user: "Meeran-103-C",
      time: "03 Jun 2025",
      status: "+ Assign",
      statusColor: "#1D5DFF",
    },
    {
      id: "4",
      title: "Washing machine Problem",
      user: "Meeran-103-C",
      time: "04 Jun 2025",
      status: "Pending",
      statusColor: "#D17800",
    },
    {
      id: "5",
      title: "Power Issue",
      user: "Meeran-103-C",
      time: "04 Jun 2025",
      status: "Resolved",
      statusColor: "#2BAE66",
    },

     {
      id: "6",
      title: "Washing machine Problem",
      user: "Meeran-103-C",
      time: "04 Jun 2025",
      status: "Pending",
      statusColor: "#D17800",
    },
    {
      id: "7",
      title: "AC Issue",
      user: "Ruban-103-4",
      time: "04 Jun 2025",
      status: "Resolved",
      statusColor: "#2BAE66",
    },
       {
      id: "8",
      title: "TV Issue",
      user: "Clindon-103-C",
      time: "04 Jun 2025",
      status: "Resolved",
      statusColor: "#2BAE66",
    },

       {
      id: "9",
      title: "Power Issue",
      user: "Meeran-103-C",
      time: "04 Jun 2025",
      status: "Resolved",
      statusColor: "#2BAE66",
    },
       {
      id: "10",
      title: "Power Issue",
      user: "Meeran-103-C",
      time: "04 Jun 2025",
      status: "Resolved",
      statusColor: "#2BAE66",
    },
  ]

 const handleReset = () => {
    setStatus("All")
 }

  const handleAddComplaint = () => {
     navigation.navigate("AddComplaint")
  }

  useLayoutEffect(() => {
  setShowTabBar( !showFilter);
}, [ showFilter]);

//   useLayoutEffect(() => {
//   const backAction = () => {
 
//     if (showFilter) {
//       setShowFilter(false);
//       return true;
//     }

//     return false;
//   };

//   const handler = BackHandler.addEventListener(
//     "hardwareBackPress",
//     backAction
//   );

//   return () => handler.remove();
// }, [ showFilter]);



//   ];


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => {
              setSelectedComplaint(item);
              setShowSheet(true);
            }}
          >
            <Image source={Profile} style={styles.userIcon} />
          </TouchableOpacity>

          <Text style={styles.user}>{item.user}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <Text style={styles.time}>{item.time}</Text>

        <TouchableOpacity>
          <Text style={[styles.status, { color: item.statusColor }]}>
            {item.status}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* Search Box */}
      <View style={styles.searchBox}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png",
          }}
          style={styles.searchIcon}
        />

        <TextInput
          placeholder="Search Complaints"
          placeholderTextColor="#A1A1A1"
          style={styles.searchInput}
        />
      </View>

      {/* Listing */}
      <FlatList
        data={complaintsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />


      <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
        <Image
          source={FilterIcon}
          style={{ width: 25, height: 25 }}
        />

      </TouchableOpacity>

      {/* ADD BTN */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddComplaint")}
      >
        <Image source={AddComplaint} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>


      {/* <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity> */}

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
                    source={FilterIcon}
                    style={{ width: 25, height: 25, marginRight: 8 }}
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
             
         <View style={{height:100}}>
          <Text></Text>
         </View>
           
             
      
             
              <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
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

      {/* --- VIEW COMPLIANCE SHEET (Child Component) --- */}
      <ComplaintDetails
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        complaint={selectedComplaint}
        onOpenAssignSheet={() => setShowAssignSheet(true)}
        onOpenCommentSheet={() => setShowCommentSheet(true)}
        onOpenStatusSheet={() => setShowStatusSheet(true)}
      />

      {/* Assign Sheet */}
      <AssignBottomSheet
        visible={showAssignSheet}
        onClose={() => setShowAssignSheet(false)}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        onAssignDone={() => {
          setShowAssignSheet(false);
          setTimeout(() => {
            setShowSheet(true);
          }, 150);
        }}
      />

      {/* Comment Sheet */}
      <CommentBottomSheet
        visible={showCommentSheet}
        onClose={() => setShowCommentSheet(false)}
      />

      {/* Status Sheet */}
      <ChangeStatus
        visible={showStatusSheet}
        onClose={() => setShowStatusSheet(false)}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onStatusUpdate={() => setShowStatusSheet(false)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 40 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },

  searchIcon: { width: 20, height: 20, tintColor: "#9B9B9B", marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: "#000" },

  card: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: { fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  userIcon: { width: 20, height: 20, marginRight: 6 },
  user: { color: "#555" },

  rightSection: { alignItems: "flex-end", justifyContent: "space-between" },
  time: { fontSize: 12, color: "#999" },
  status: { marginTop: 6, fontSize: 14, fontWeight: "600" },

  filterBtn: {
    position: "absolute",
    bottom: 150,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },

  addBtn: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  plus: { fontSize: 30, color: "#fff", marginTop: -3 },

  
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
dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 12,
},

dropdownItemText: {
  fontSize: 14,
  color: "#111",
},


});
