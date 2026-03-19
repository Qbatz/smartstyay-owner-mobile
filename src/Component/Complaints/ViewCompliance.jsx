import React, { useEffect, useState, useRef , useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  PanResponder,
  Dimensions,
  BackHandler,Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ComplaintContext } from "../../Context/ComplaintContext";
import { CommonContexts } from "../../Context/CommonContext";
import DeleteComplaint from "./DeleteComplaint";
import { useHasPermission } from "../../Utils/useHasPermission";
import Profile from "../../Assets/Images/Avatar.png";
import Edit from "../../Assets/Images/editIcon.png";
import Delete from "../../Assets/Images/trash.png";
import CommentIcon from "../../Assets/Images/message.png";
import userImg from "../../Assets/Images/userImg.png";
import Exchange from "../../Assets/Images/exchange.png";
import room from "../../Assets/Images/Room_Icon.png";
import Bed from "../../Assets/Images/bed.png";
import Complaint_InprogressIcon from "../../Assets/Images/Complaint_Inprogress.png";


const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function ComplaintDetails({
  visible,
  onClose,
  complaint,
  onOpenAssignSheet,
  onOpenCommentSheet,
  onOpenStatusSheet,
}) {
  const navigation = useNavigation();
  const [deleteshow, setDeleteShow] = useState(false);
   const [keyboardHeight, setKeyboardHeight] = useState(0);

              const {
                  canWriteModule: canWriteComplaints,
                  canReadModule: canReadComplaints,
                  canUpdateModule: canUpdateComplaints,
                  canDeleteModule: canDeleteComplaints,
              } = useHasPermission("Complaints");

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
 
  console.log("complaint", complaint);
  
    const { getParticularComplaint , selectedComplaint , complaintsViewUpdates } = useContext(ComplaintContext);
       const { activeHostelId } = useContext(CommonContexts);

       console.log("selectedComplaint", selectedComplaint);

        const getInitialsFromName = (name = "") => {
  if (!name) return "";

  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (
    words[0].charAt(0).toUpperCase() +
    words[words.length - 1].charAt(0).toUpperCase()
  );
};
       
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        gesture.dy > 6, // detect swipe down
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) handleCloseSheet(); // close if swipe enough
        else animateOpen(); // reset to open
      },
    })
  ).current;

  // open animation
  const animateOpen = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // close animation
  const handleCloseSheet = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onClose());
  };
   useEffect(() => {
      if (!visible) return;
  
      const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
        setKeyboardHeight(e.endCoordinates.height - 60);
      });
  
      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardHeight(0);
      });
  
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, [visible]);

  // open when visible changes
  useEffect(() => {
    if (visible) {
      animateOpen();

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handleCloseSheet();
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [visible]);

  if (!visible || !complaint) return null;


const openComments = async () => {
  const res = await getParticularComplaint(
    activeHostelId,
    complaint?.complaintId
  )

  if (res?.success) {
    handleCloseSheet();
    onOpenCommentSheet(complaint);
  }
};

const isAssigned = !!complaint?.assigneeName?.trim();


console.log("comments", complaint);


const openUpdates = async () => {

await  complaintsViewUpdates({
    hostelId: activeHostelId,
    complaintsId: complaint?.complaintId,
  });
  handleCloseSheet();
  navigation.navigate("ComplaintUpdates", {
    selectedComplaint,
  });
};




  return (
    <>
      {/* BACKDROP */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleCloseSheet}
      />

      {/* BOTTOM SHEET */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sheet,
            
          {marginBottom: keyboardHeight, transform: [{ translateY }] },
        ]}
      >
        {/* drag handle */}
        <View style={styles.headerLine} />

        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>{complaint?.complaintTypeName}</Text>
            <Text style={styles.time}>{complaint?.complaintDate}</Text>
          </View>

          <View style={styles.iconRow}>
            <TouchableOpacity   disabled={!canUpdateComplaints}
  style={!canUpdateComplaints && { opacity: 0.4 }} 
//    onPress={() => navigation.navigate("AddComplaint", {
//   mode: "edit",
//   data: complaint,   
// })}
  onPress={() => {
    if (!canUpdateComplaints) return;

    navigation.navigate("AddComplaint", {
      mode: "edit",
      data: complaint,
    });
  }}

>
              <Image source={Edit} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity  disabled={!canDeleteComplaints}
  style={[
    { marginLeft: 12 },
    !canDeleteComplaints && { opacity: 0.4 }
  ]}
  onPress={() => {
    if (!canDeleteComplaints) return;
    setDeleteShow(true);
  }}>
              <Image
                source={Delete}
                style={[styles.icon, { marginLeft: 12 }]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Complaint from */}
        <Text style={styles.sectionTitle}>Complaint from</Text>

        <View style={styles.userRow}>
          {/* <Image source={Profile} style={styles.avatar} /> */}

                  {complaint?.customerProfile ? (
            <Image
              source={{ uri: complaint.customerProfile }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.initialCircle}>
              <Text style={styles.initialText}>
                {complaint?.initials
                  ? complaint.initials
                  : getInitialsFromName(complaint?.customerName)}
              </Text>
            </View>
          )}

          <View>
            <Text style={styles.userName}>
              {complaint?.customerName}
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.floorTag}>{complaint?.floorName}</Text>

              <Image source={room} style={styles.roomIcon} />
              <Text style={styles.roomValue}>
                {complaint?.roomName}
              </Text>

              <Image source={Bed} style={styles.bedIcon} />
              <Text style={styles.bedValue}>
                  {complaint?.bedName}
              </Text>
            </View>
          </View>
        </View>

        {/* Row */}
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.labelSmall}>Request ID</Text>
            <Text style={styles.boldText}>{complaint?.complaintId} </Text>
          </View>

          <View>
            <Text style={styles.labelSmall}>Assigned to</Text>
            <Text style={styles.boldText}>{complaint?.assigneeName || "N/A"}</Text>
          </View>
        </View>

        {/* Status */}
        <Text style={styles.sectionTitle}>Status</Text>
        <Text style={styles.boldText}>{complaint?.status === null ? "Open" : complaint?.status}</Text>

        {/* Type */}
        <Text style={styles.sectionTitle}>Complaint type</Text>
        <Text style={styles.boldText}> {complaint?.complaintTypeName}</Text>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.boldText}>
          {complaint?.description}
        </Text>

        {isAssigned && (
  <View style={styles.assignedCard}>
    <View style={styles.assignedHeader}>
      <Text style={styles.assignedTitle}>Complaint Assigned</Text>

      <View style={styles.statusPill}>
        <Image source={Complaint_InprogressIcon} style={{height:13, width:13, marginTop:2}} />
        <Text style={styles.statustext}>
           In Progress
        </Text>
      </View>
    </View>

    <TouchableOpacity
       style={[
    styles.updateBtn,
    !canReadComplaints && { opacity: 0.5 }
  ]}
  disabled={!canReadComplaints}
  onPress={() => {
    if (!canReadComplaints) return;
    openUpdates();
  }}
    >
      <Text style={styles.updateBtnText}>See all updates</Text>
    </TouchableOpacity>
  </View>
)}


        {/* Comment */}
       <View style={styles.commentBox}>
  {/* FAKE INPUT – ONLY FOR DISPLAY */}
  <TouchableOpacity
   style={{ flex: 1, opacity: canReadComplaints ? 1 : 0.5 }}
  disabled={!canReadComplaints}
  activeOpacity={0.8}
  onPress={() => {
    if (!canReadComplaints) return;
    openComments();
  }}
  >
    <View pointerEvents="none">
      <TextInput
        placeholder="Add your Comment"
        placeholderTextColor="#A0A0A0"
        style={styles.commentInput}
        editable={false}   
      />
    </View>
  </TouchableOpacity>

  <TouchableOpacity   disabled={!canReadComplaints}
  onPress={openComments}>
    <Image source={CommentIcon}  style={[
      styles.commentIcon,
      !canReadComplaints && { opacity: 0.4 }
    ]} />
  </TouchableOpacity>

  <Text style={styles.commentCount}>
    {selectedComplaint?.comments?.length || 0}
  </Text>
</View>


        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
          

              style={[
    styles.assignBtn,
    !canWriteComplaints && { opacity: 0.5 }
  ]}
  disabled={!canWriteComplaints}
  onPress={() => {
    if (!canWriteComplaints) return;

    handleCloseSheet();
    setTimeout(onOpenAssignSheet, 200);
  }}
          >
            <Image source={userImg} style={styles.assignIcon} />
            <Text style={styles.assignText}>Assign</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
    styles.statusBtn,
    !canWriteComplaints && { opacity: 0.5 }
  ]}
  disabled={!canWriteComplaints}
  onPress={() => {
    if (!canWriteComplaints) return;

    handleCloseSheet();
    setTimeout(() => onOpenStatusSheet(complaint), 200);
  }}
          >
            <Image source={Exchange} style={styles.assignIcon} />
            <Text style={styles.statusText}>Change Status</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Delete Popup */}
      {deleteshow && (
        <DeleteComplaint
          visible={deleteshow}
           complaintId={complaint.complaintId}
    onClose={() => setDeleteShow(false)}
    onSuccess={(msg) => {
      setDeleteShow(false);
      handleCloseSheet(); 
      alert(msg);
    }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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

  title: { fontSize: 18, fontFamily: "Gilroy-Bold"  , color: "#000" },
  time: { fontSize: 12, color: "#777", marginBottom: 15 ,fontFamily: "Gilroy-Regular" },

  iconRow: { flexDirection: "row" },
  icon: { width: 20, height: 20 },

  sectionTitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 15,
    fontFamily: "Gilroy-Regular" 
  },

  userRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
   avatar: {
  width: 50,
  height: 50,
  borderRadius: 15,
  marginRight: 6,
},

initialCircle: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#E5E7EB",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 6,
},

initialText: {
  fontSize: 15,
  fontFamily: "Gilroy-Bold"  ,
  color: "#4B5563",
},

  userName: { fontSize: 16, fontFamily: "Gilroy-Semibold" },

  infoRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },

  floorTag: {
    backgroundColor: "#F9E8C8",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 10,
  },

  roomIcon: { width: 20, height: 20, marginRight: 5 },
  bedIcon: { width: 20, height: 20, marginRight: 5 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  labelSmall: { fontSize: 13, color: "#888" , fontFamily: "Gilroy-Regular" },
  boldText: { fontSize: 15,fontFamily: "Gilroy-Bold"  , marginTop: 4 },

  value: { fontSize: 15, fontFamily: "Gilroy-Medium" , color: "#000" },

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

  commentInput: { flex: 1, fontSize: 14 , fontFamily: "Gilroy-Regular" },
  commentIcon: { width: 18, height: 18, marginRight: 6 },
  commentCount: { fontSize: 14, color: "#555" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom:25
  },

  assignBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1D5DFF",
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    justifyContent: "center",
  },

  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1D5DFF",
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
  },

  assignIcon: { width: 18, height: 18, tintColor: "#fff", marginRight: 8 },
  assignText: { color: "#fff", fontSize: 16, fontFamily: "Gilroy-Semibold" },
  statusText: { color: "#fff", fontSize: 16, fontFamily: "Gilroy-Semibold"},
  assignedCard: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 14,
  padding: 14,
  marginTop: 16,
  backgroundColor: "#fff",
},

assignedHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
},

assignedTitle: {
  fontSize: 15,
  fontFamily: "Gilroy-Bold"  ,
  color: "#000",
},

statusPill: {
  display:'flex',
  flexDirection:'row',
  backgroundColor: "#FFF4E5",
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 20,
},

statustext: {
  marginLeft:5,
  fontSize: 12,
 fontFamily: "Gilroy-Semibold",
  color: "#FF8A00",
},

updateBtn: {
  backgroundColor: "#1D5DFF",
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: "center",
},

updateBtnText: {
  color: "#fff",
  fontSize: 15,
  fontFamily: "Gilroy-Bold"  ,
},

});
