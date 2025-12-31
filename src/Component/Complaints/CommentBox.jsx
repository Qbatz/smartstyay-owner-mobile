import React, { useEffect, useRef , useState , useContext} from "react";
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
  BackHandler,
} from "react-native";
import { ComplaintContext } from "../../Context/ComplaintContext";
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../ToastFile/ToastPage";
import Profile from "../../Assets/Images/Avatar.png";
import Comments from "../../Assets/Images/send.png";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function CommentBottomSheet({ visible, onClose }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;


  const { selectedComplaint, addComplaintComment, commentsLoading } =
  useContext(ComplaintContext);

      const [commentText, setCommentText] = useState("");
      const [commentError, setCommentError] = useState("");
      const [showSuccessModal, setShowSuccessModal] = useState(false);
      const [modalMessage, setModalMessage] = useState("");
      const [modalType, setModalType] = useState("success");

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
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(onClose);
  };

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
  setCommentError("");

  if (!commentText.trim()) {
    setCommentError("Please Enter a Comment");
    return;
  }

  if (!selectedComplaint?.complaintId) return;

  const res = await addComplaintComment({
    complaintId: selectedComplaint.complaintId,
    message: commentText.trim(),
  });

  if (res.success) {
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

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.commentsTitle}>Comments</Text>

          <View style={styles.mainUserRow}>
            <Image source={Profile} style={styles.mainUserImg} />
            <View>
             <Text style={styles.mainUserName}>{selectedComplaint?.customerName}</Text>
             <Text style={styles.mainUserDate}>{selectedComplaint?.complaintDate}</Text>

            </View>
          </View>

          <View style={styles.separator} />
{selectedComplaint?.comments?.map((item) => (
  <View key={item.commentId} style={styles.msgRow}>
    <Image
      source={item.profilePic ? { uri: item.profilePic } : Profile}
      style={styles.msgUserImg}
    />

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



          <View style={styles.replyBox}>
  <TextInput
  value={commentText}
  onChangeText={(text) => {
    setCommentText(text);
    if (commentError) setCommentError("");
  }}
  placeholder="Post your Reply Here"
  style={styles.input}
/>



            <TouchableOpacity style={styles.sendBtn} onPress={handleSendComment}>
              <Image source={Comments} style={styles.sendIcon} />
            </TouchableOpacity>
            
          </View>
          {commentError ? (
  <ErrorMessage message={commentError} type="error" />
) : null} 
        </ScrollView>
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
    fontWeight: "600",
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
    fontWeight: "600",
    color: "#000",
  },

  mainUserDate: {
    color: "#666",
    marginTop: 2,
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
    fontWeight: "600",
    color: "#000",
  },

  msgTime: {
    fontSize: 11,
    color: "#999",
    marginLeft: 20,
  },

  msgText: {
    marginTop: 5,
    fontSize: 14,
    color: "#000",
  },

  replyBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 10,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
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
});
