import React, { useEffect, useState, useRef, useContext } from "react";
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
    BackHandler, Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ComplaintContext } from "../../../Context/ComplaintContext";
import { CommonContexts } from "../../../Context/CommonContext";
// import DeleteComplaint from "./DeleteComplaint";
import { useHasPermission } from "../../../Utils/useHasPermission";
import Profile from "../../../Assets/Images/Avatar.png";
import Edit from "../../../Assets/Images/editIcon.png";
import Delete from "../../../Assets/Images/trash.png";
import CommentIcon from "../../../Assets/Images/message.png";
import userImg from "../../../Assets/Images/userImg.png";
import Exchange from "../../../Assets/Images/exchange.png";
import room from "../../../Assets/Images/Room_Icon.png";
import Bed from "../../../Assets/Images/bed.png";
import DotsIcon from "../../../Assets/Images/3dots.png";
import Complaint_InprogressIcon from "../../../Assets/Images/Complaint_Inprogress.png";


const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function AmenityRejectDetails({
    visible,
    onClose,
    complaint,
    onSuccess,
    onOpenAssignSheet,
    onOpenCommentSheet,
    onOpenStatusSheet,

}) {

   const { getParticularComplaint, selectedComplaint, complaintsViewUpdates } = useContext(ComplaintContext);
    const { activeHostelId } = useContext(CommonContexts);

    const navigation = useNavigation();
    const [deleteshow, setDeleteShow] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [status, setStatus] = useState("Availability Concern");
const [remarks, setRemarks] = useState(
  "Currently, no beds are available in the requested sharing type. Your request is kept on hold and will be reviewed once availability opens."
);

    const {
        canWriteModule: canWriteComplaints,
        canReadModule: canReadComplaints,
        canUpdateModule: canUpdateComplaints,
        canDeleteModule: canDeleteComplaints,
    } = useHasPermission("Complaints");

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    console.log("complaint", complaint);

 

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

    if (!visible) return null;


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

        await complaintsViewUpdates({
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

                    { marginBottom: keyboardHeight, transform: [{ translateY }] },
                ]}
            >
                {/* drag handle */}
                <View style={styles.headerLine} />

                {/* Header */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>Reject Amenity Request</Text>
                    </View>

                   
                </View>

               
              




<Text style={styles.label}>
  Status<Text style={{ color: "#EF4444" }}>*</Text>
</Text>

<TouchableOpacity style={styles.dropdownBox}>
    <Text style={styles.dropdownText}>{status}</Text>

  <Image
    source={require("../../../Assets/Images/direction-down.png")}
    style={styles.arrowIcon}
  />
</TouchableOpacity>


<Text style={[styles.label, { marginTop: 24 }]}>
    Remarks/Comments
  </Text>

  <TextInput
    value={remarks}
    onChangeText={setRemarks}
    multiline
    textAlignVertical="top"
    style={styles.remarkInput}
    placeholder="Enter Remarks"
    placeholderTextColor="#999"
  />



<View style={styles.footer}>

  <TouchableOpacity
    style={styles.cancelBtn}
    onPress={onClose}
  >
    <Text style={styles.cancelText}>
      Cancel
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.notifyBtn}
    onPress={onSuccess}
  >
    <Image
      source={require("../../../Assets/Images/Frame.png")}
      style={styles.notifyIcon}
    />


    <Text style={styles.notifyText}>
      Notify
    </Text>
  </TouchableOpacity>
       </View>         

                {/* <View style={styles.buttonRow}>
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
                        <Text style={{color: "#fff", fontSize: 16, fontFamily: "Gilroy-Semibold" }}>Approve</Text>
                    </TouchableOpacity>
                </View> */}
            </Animated.View>

        
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

    title: { fontSize: 18, fontFamily: "Gilroy-Bold", color: "#000" },
    time: { fontSize: 12, color: "#777", marginBottom: 15, fontFamily: "Gilroy-Regular", marginTop: 12 },

    iconRow: { flexDirection: "row" },
    icon: { width: 20, height: 20 },

    sectionTitle: {
        fontSize: 13,
        color: "#777",
        // marginTop: 5,
        fontFamily: "Gilroy-Regular"
    },

    userRow: { flexDirection: "row", alignItems: "center", marginTop: 5, marginBottom: 16 },
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
        fontFamily: "Gilroy-Bold",
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
        marginTop: 10,
    },

    labelSmall: { fontSize: 13, color: "#888", fontFamily: "Gilroy-Regular" },
    boldText: { fontSize: 15, fontFamily: "Gilroy-Bold", marginTop: 4 },

    value: { fontSize: 15, fontFamily: "Gilroy-Medium", color: "#000" },

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

    commentInput: { flex: 1, fontSize: 14, fontFamily: "Gilroy-Regular" },
    commentIcon: { width: 18, height: 18, marginRight: 6 },
    commentCount: { fontSize: 14, color: "#555" },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25,
        marginBottom: 25
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
    statusText: { color: "#fff", fontSize: 16, fontFamily: "Gilroy-Semibold" },
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
        fontFamily: "Gilroy-Bold",
        color: "#000",
    },

    statusPill: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: "#FFF4E5",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },

    statustext: {
        marginLeft: 5,
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
        fontFamily: "Gilroy-Bold",
    },
    infoCard: {
        marginTop: 18,
        backgroundColor: "#F7F9FF",
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 40
    },

    cardLabel: {
        fontSize: 14,
        color: "#6B7280",
        fontFamily: "Gilroy-Medium",
    },

    cardValue: {
        marginTop: 10,
        fontSize: 17,
        color: "#1F2937",
        fontFamily: "Gilroy-Semibold",
        lineHeight: 24,
    },

    notifyCard: {
        marginTop: 18,
        backgroundColor: "#FAFAFA",
        borderRadius: 18,
        padding: 18,
    },

    notifyTitle: {
        fontSize: 18,
        color: "#1F2937",
        fontFamily: "Gilroy-Semibold",
    },

    notifySubTitle: {
        marginTop: 8,
        fontSize: 14,
        color: "#6B7280",
        fontFamily: "Gilroy-Regular",
        lineHeight: 20,
    },

    // notifyBtn: {
    //     marginTop: 22,
    //     alignSelf: "flex-end",
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "center",

    //     backgroundColor: "#2F49E7",
    //     borderRadius: 10,

    //     paddingHorizontal: 16,
    //     height: 34,
    // },

    notifyIcon: {
        width: 15,
        height: 15,
        tintColor: "#FFFFFF",
        marginRight: 10,
    },

    notifyBtnText: {
        fontSize: 14,
        color: "#FFFFFF",
        fontFamily: "Gilroy-Semibold",
    },
     statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },

    statusText: {
        fontSize: 13,
        color: "#333",
        fontFamily: "Gilroy-Medium",
    },
    label: {
  fontSize: 15,
  color: "#6B7280",
  fontFamily: "Gilroy-Medium",
  marginTop: 22,
  marginBottom: 10,
},

amenityCard: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

amenityLeft: {
  flexDirection: "row",
  alignItems: "center",
},

amenityIcon: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "#1E45E11A",
  justifyContent: "center",
  alignItems: "center",
},

wifiIcon: {
  width: 30,
  height: 30,
  resizeMode: "contain",
},

amenityName: {
  fontSize: 20,
  color: "#202020",
  fontFamily: "Gilroy-Semibold",
},

amenityPrice: {
  marginTop: 6,
  fontSize: 16,
  color: "#4B5563",
  fontFamily: "Gilroy-Medium",
},

rejectBadge: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF1F2",
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 20,
},

rejectIcon: {
  color: "#EF4444",
  fontSize: 13,
  marginRight: 6,
  fontWeight: "700",
},

rejectText: {
  color: "#EF4444",
  fontSize: 14,
  fontFamily: "Gilroy-Semibold",
},

dropdownBox: {
  height: 56,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  paddingHorizontal: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

dropdownValue: {
  fontSize: 17,
  color: "#202020",
  fontFamily: "Gilroy-Medium",
},

arrowIcon: {
  width: 18,
  height: 18,
  tintColor: "#6B7280",
},
remarkInput: {
  minHeight: 160,
  borderWidth: 1,
  borderColor: "#E4E4E7",
  borderRadius: 14,
  padding: 18,
  fontSize: 15,
  color: "#222",
  fontFamily: "Gilroy-Regular",
  lineHeight: 26,
},

footer: {
  flexDirection: "row",
  paddingHorizontal: 20,
  paddingVertical: 18,
  borderTopWidth: 1,
  borderTopColor: "#ECECEC",
  marginTop: 30,
},

cancelBtn: {
  flex: 1,
  height: 44,
  borderWidth: 1,
  borderColor: "#E4E4E7",
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 14,
},

cancelText: {
  fontSize: 16,
  color: "#444",
  fontFamily: "Gilroy-Medium",
},

notifyBtn: {
  flex: 1.45,
  height: 44,
  borderRadius: 10,
  backgroundColor: "#2F49E7",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
},

notifyIcon: {
  width: 20,
  height: 20,
  tintColor: "#FFF",
  marginRight: 10,
},

notifyText: {
  fontSize: 16,
  color: "#FFF",
  fontFamily: "Gilroy-Semibold",
},
dropdownText: {
  fontSize: 16,
  color: "#1C1C1E",
  fontFamily: "Gilroy-Medium",
},
});
