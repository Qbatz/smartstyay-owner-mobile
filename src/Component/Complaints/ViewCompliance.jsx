import React,{useEffect,useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  BackHandler
} from "react-native";

import Profile from "../../Assets/Images/Avatar.png";
import Edit from "../../Assets/Images/editIcon.png";
import Delete from "../../Assets/Images/trash.png";
import CommentIcon from "../../Assets/Images/message.png";
import userImg from "../../Assets/Images/userImg.png";
import Exchange from "../../Assets/Images/exchange.png";
import room from "../../Assets/Images/Room_Icon.png";
import Bed from "../../Assets/Images/bed.png";
import AssignBottomSheet from "../../Component/Complaints/AssignCompliance";
import CommentBottomSheet from "../Complaints/CommentBox";
import ChangeStatus from "../Complaints/ComplianceStatus"


export default function ComplaintDetails({ visible,
  onClose,
  complaint,
  selectedUser,
  setSelectedUser,
  onOpenAssignSheet,
  onOpenCommentSheet,
  onOpenStatusSheet}) {
  if (!complaint) return null;
  const [showAssignSheet, setShowAssignSheet] = useState(false);
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
 




  useEffect(() => {
    if (visible) {
      const backAction = () => {
        onClose();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }
  }, [visible]);


  return (
    <>
   <Modal
  visible={visible}
  animationType="slide"
  transparent={true}
  onRequestClose={onClose}
>
      <View style={styles.overlay}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Drag Line */}
          <View style={styles.headerLine} />

          {/* Title + Icons */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>{complaint.title}</Text>
              <Text style={styles.time}>{complaint.time}</Text>
            </View>

            <View style={styles.iconRow}>
              <Image source={Edit} style={styles.icon} />
              <Image source={Delete} style={[styles.icon, { marginLeft: 12 }]} />
            </View>
          </View>

          {/* Complaint From */}
          <Text style={styles.sectionTitle}>Complaint from</Text>

          <View style={styles.userRow}>
            <Image source={Profile} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{complaint.user.split("-")[0]}</Text>

              {/* <View style={styles.infoRow}>
                <Text style={styles.floorTag}>Ground Floor</Text>
                <Text style={styles.roomValue}>{complaint.user.split("-")[1]}</Text>
                <Text style={styles.bedValue}>{complaint.user.split("-")[2]}</Text>
              </View> */}
              <View style={styles.infoRow}>
  <Text style={styles.floorTag}>Ground Floor</Text>

  <Image source={room} style={styles.roomIcon} />
  <Text style={styles.roomValue}>{complaint.user.split("-")[1]}</Text>

  <Image source={Bed} style={styles.bedIcon} />
  <Text style={styles.bedValue}>{complaint.user.split("-")[2]}</Text>
</View>

            </View>
          </View>

          {/* Request ID / Assigned */}
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.labelSmall}>Request ID</Text>
              <Text style={styles.boldText}>C00371</Text>
            </View>

            <View>
              <Text style={styles.labelSmall}>Assigned to</Text>
              <Text style={styles.boldText}>----</Text>
            </View>
          </View>

          {/* Status */}
          <Text style={styles.sectionTitle}>Status</Text>
          <Text style={styles.value}>Yet to assign</Text>

          {/* Complaint Type */}
          <Text style={styles.sectionTitle}>Complaint type</Text>
          <Text style={styles.value}>{complaint.title}</Text>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.value}>Ac was not working properly till morning</Text>

          {/* Comment Box */}
          <View style={styles.commentBox}>
            <TextInput
              placeholder="Add your Comment"
              placeholderTextColor="#A0A0A0"
              style={styles.commentInput}
            />

            <View style={styles.commentRight}>
              {/* <Image source={CommentIcon} style={styles.commentIcon} /> */}
            <TouchableOpacity
  onPress={() => {
    onClose();
    setTimeout(() => {
      onOpenCommentSheet();  
    }, 250);
  }}
>
  <Image source={CommentIcon} style={styles.commentIcon} />
</TouchableOpacity>


              <Text style={styles.commentCount}>3</Text>
            </View>
          </View>

          
          <View style={styles.buttonRow}>
           
       <TouchableOpacity
  style={styles.assignBtn}
  onPress={() => {
   onOpenAssignSheet()
    setTimeout(() => {
      onClose()
    }, 200);
  }}
>
  <Image source={userImg} style={styles.assignIcon} />
  <Text style={styles.assignText}>Assign</Text>
</TouchableOpacity>





         <TouchableOpacity
  style={styles.statusBtn}
   onPress={() => {
              onClose();
              setTimeout(onOpenStatusSheet, 200);
            }}

>
  <Image source={Exchange} style={styles.assignIcon} />
  <Text style={styles.statusText}>Change Status</Text>
</TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>

    <AssignBottomSheet
  visible={showAssignSheet}
  onClose={() => setShowAssignSheet(false)}
  selectedUser={selectedUser}
  setSelectedUser={setSelectedUser}
 


/>
<CommentBottomSheet
  visible={showCommentSheet}
  onClose={() => setShowCommentSheet(false)}
/>
<ChangeStatus
  visible={showStatusSheet}
  onClose={() => setShowStatusSheet(false)}
  selectedStatus={selectedStatus}
  setSelectedStatus={setSelectedStatus}
  onStatusUpdate={() => {
    console.log("Updated Status:", selectedStatus);
    setShowStatusSheet(false);
  }}
/>

    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 35,
  },

  headerLine: {
    width: 60,
    height: 5,
    backgroundColor: "#D5D5D5",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 15,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconRow: { flexDirection: "row" },
  icon: { width: 20, height: 20 },

  title: { fontSize: 18, fontWeight: "700", color: "#000" },
  time: { fontSize: 12, color: "#777", marginTop: 3, marginBottom: 20 },

  sectionTitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 15,
    marginBottom: 5,
  },

  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 45, height: 45, borderRadius: 30, marginRight: 12 },

  userName: { fontSize: 16, fontWeight: "600" },

 infoRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 5,
},

 floorTag: {
  backgroundColor: "#F9E8C8",
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 8,
  fontSize: 12,
  color: "#000",
  marginRight: 10,
},

roomIcon: {
  width: 18,
  height: 18,
  marginRight: 5,
  tintColor: "#1D5DFF",   // blue like screenshot
},

roomValue: {
  fontSize: 14,
  fontWeight: "500",
  marginRight: 15,
  color: "#000",
},
  bedIcon: {
  width: 20,
  height: 20,
  marginRight: 5,
  tintColor: "#1D5DFF",
},

bedValue: {
  fontSize: 14,
  fontWeight: "500",
  color: "#000",
},

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  labelSmall: { fontSize: 13, color: "#888" },
  boldText: { fontSize: 15, fontWeight: "700", marginTop: 4 },

  value: { fontSize: 15, fontWeight: "500", color: "#000" },

  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 15,
  },

  commentInput: { flex: 1, fontSize: 14 },

  commentRight: { flexDirection: "row", alignItems: "center" },
  commentIcon: { width: 18, height: 18, marginRight: 3 },
  commentCount: { fontSize: 14, color: "#555" },

  buttonRow: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "space-between",
  },

assignBtn: {
  flexDirection: "row",     // ⭐ makes icon + text in one row
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1D5DFF",
  paddingVertical: 12,
  borderRadius: 12,
  flex: 1,
  marginRight: 10,
},

assignIcon: {
  width: 18,
  height: 18,
  tintColor: "#fff",        // ⭐ white icon
  marginRight: 8,
},

assignText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},


  statusBtn: {
   flexDirection: "row",     // ⭐ makes icon + text in one row
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1D5DFF",
  paddingVertical: 12,
  borderRadius: 12,
  flex: 1,
  marginRight: 10,
  },

  statusText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
