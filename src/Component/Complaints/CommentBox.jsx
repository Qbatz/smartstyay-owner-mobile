import React, {useState, useEffect, useRef   , useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
  BackHandler,Keyboard
} from "react-native";
import { ComplaintContext } from "../../Context/ComplaintContext";
import { useHasPermission } from "../../Utils/useHasPermission";
import { CommonContexts } from "../../Context/CommonContext";
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";
import Profile from "../../Assets/Images/Avatar.png";
import Comments from "../../Assets/Images/send.png";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function CommentBottomSheet({ visible, onClose  , complaint}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    console.log("complaint", complaint);
    

  const { selectedComplaint, addComplaintComment, commentsLoading , getParticularComplaint} = useContext(ComplaintContext);
      const { activeHostelId } = useContext(CommonContexts);
  // Prefer parent complaint, fallback to context
    const complaintData = complaint || selectedComplaint;

            const {
                  canWriteModule: canWriteComplaints,
                  canReadModule: canReadComplaints,
                  canUpdateModule: canUpdateComplaints,
                  canDeleteModule: canDeleteComplaints, } = useHasPermission("Complaints");


      const [commentText, setCommentText] = useState("");
      const [commentError, setCommentError] = useState("");
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modalMessage, setModalMessage] = useState("");
      const [modalType, setModalType] = useState("success");
      const [isInputFocused, setIsInputFocused] = useState(false);

console.log("selectedComplaint", selectedComplaint);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) closeSheet();
        else openSheet();
      },
    })
  ).current;

  const openSheet = () => {
       setCommentText("")
       setCommentError("")
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start()
  }

  const closeSheet = () => {
    setCommentError("")
    setCommentText("")
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(onClose);
  };
      useEffect(() => {
          const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
            // if (!isInputFocused) return; 
        
            Animated.timing(translateY, {
              toValue: -e.endCoordinates.height + 5,
              duration: 180,
              useNativeDriver: true,
            }).start();
          });
        
          const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            Animated.timing(translateY, {
              toValue: 0,
              duration: 180,
              useNativeDriver: true,
            }).start();
        
            // setIsInputFocused(false);
          });
        
          return () => {
            showSub.remove();
            hideSub.remove();
          };
        }, []);

  useEffect(() => {
    if (visible) {
      openSheet();

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          closeSheet();
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [visible]);

  if (!visible) return null;


  
     


const handleSendComment = async () => {

  console.log("comment",commentText);
  
   if (!canWriteComplaints) {
    setCommentError("You do not have permission to add comments");
    return;
  }
  setCommentError("");

  if (!commentText.trim()) {
    setCommentError("Please Enter a Comment");
    return;
  }

  if (!selectedComplaint?.complaintId) return;

  const res = await addComplaintComment({
    complaintId: selectedComplaint.complaintId,
    message: commentText.trim(),
  })

    console.log("res",res);

  if (res.success) {
    getParticularComplaint(activeHostelId, selectedComplaint.complaintId);
    setModalType("success");
    setModalMessage(res?.message || "Comment added successfully");
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
    }, 800);

    setCommentText("")
    setCommentError("")
  } else {
    setCommentError(res.message || "Something went wrong");
  }
};


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

const renderAvatar = ({ profile, initials, name, size = 50 }) => {
  if (profile) {
    return (
      <Image
        source={{ uri: profile }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          marginRight: 6,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
      }}
    >
      <Text
        style={{
          fontSize: size / 3,
          fontFamily: "Gilroy-Bold",
          color: "#4B5563",
        }}
      >
        {initials || getInitialsFromName(name)}
      </Text>
    </View>
  );
};



  return (
    <>
           <SuccessModal
  visible={showSuccessModal}
  onClose={() => setShowSuccessModal(false)}
  message={modalMessage}
  type={modalType}
/>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeSheet}
      />

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.dragLine} />

      
          <Text style={styles.commentsTitle}>Comments</Text>
<View style={styles.mainUserRow}>
  {renderAvatar({
    profile: complaintData?.customerProfile,
    initials: complaintData?.initials,
    name: complaintData?.customerName,
  })}

  <View>
    <Text style={styles.mainUserName}>
      {complaintData?.customerName || "N/A"}
    </Text>
    <Text style={styles.mainUserDate}>
      {complaintData?.complaintDate || "-"}
    </Text>
  </View>
</View>
 <View style={styles.separator} />
  <ScrollView showsVerticalScrollIndicator={true} style={{maxHeight:180}}>
         
{selectedComplaint?.comments?.map((item) => (
  <View key={item.commentId} style={styles.msgRow}>
    {renderAvatar({
      profile: item.profilePic,
      initials: item.initials,
      name: item.commentedBy,
      size: 42,
    })}

    <View style={{ flex: 1 }}>
      <View style={styles.msgHeader}>
        <Text style={styles.msgUserName}>{item.commentedBy}</Text>
        <Text style={styles.msgTime}>{item.commentedAt}</Text>
      </View>

      <Text style={styles.msgText}>{item.commentText}</Text>
    </View>
  </View>
))}


{selectedComplaint?.comments?.length === 0 && (
  <Text style={{ textAlign: "center", color: "#999" }}>
    No comments yet
  </Text>
)}


       </ScrollView>
                 {commentError ? (
  <ErrorMessage message={commentError} type="error" />
) : null} 
          <View style={[styles.replyBox  , {marginBottom: commentError ? 5: 30 }, !canWriteComplaints && { opacity: 0.4 } ]}>
  <TextInput
  value={commentText}
  onChangeText={(text) => {
    setCommentText(text);
    if (commentError) setCommentError("");
  }}
  placeholder="Post your Reply Here"
  style={styles.input}
  editable={canWriteComplaints}
  // onFocus={() => {
  //   setIsInputFocused(true);
  // }}
  // onBlur={() => {
  //   setIsInputFocused(false);
  // }}
        // pointerEvents={canUpdateComplaints ? "auto" : "none"}
/>



            <TouchableOpacity 
            style={[
      styles.sendBtn,
      !canWriteComplaints && { opacity: 0.4 }
    ]}
      disabled={!canWriteComplaints}
            onPress={handleSendComment}>
              <Image source={Comments} style={styles.sendIcon} />
            </TouchableOpacity>
            
          </View>

 
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
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },

  dragLine: {
    width: 70,
    height: 4,
    backgroundColor: "#CFCFCF",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },

  commentsTitle: {
    fontSize: 17,
   fontFamily: "Gilroy-Semibold" ,
    marginBottom: 15,
    color: "#000",
  },

  mainUserRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  mainUserImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 12,
  },

  mainUserName: {
    fontSize: 16,
   fontFamily: "Gilroy-Semibold" ,
    color: "#000",
  },

  mainUserDate: {
    color: "#666",
    marginTop: 2,
    fontFamily: "Gilroy-Semibold" 
    // marginLeft:2
  },

  separator: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: 15,
  },

  msgRow: {
    flexDirection: "row",
    marginBottom: 18,
  },

  msgUserImg: {
    width: 42,
    height: 42,
    borderRadius: 50,
    marginRight: 10,
  },

  msgHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  msgUserName: {
    fontSize: 14,
    fontFamily: "Gilroy-Semibold" ,
    color: "#000",
  },

  msgTime: {
    fontSize: 11,
    color: "#999",
    marginLeft: 20,
    fontFamily: "Gilroy-Regular"
  },

  msgText: {
    marginTop: 5,
    fontSize: 14,
    color: "#000",
    fontFamily: "Gilroy-Regular"
  },

  replyBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 5,

  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Gilroy-Regular"
  },

  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  sendIcon: {
    width: 30,
    height: 30,
  },

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
});
