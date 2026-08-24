import React, { useState,useContext,useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { CommonContexts } from "../../Context/CommonContext";
import { NotificationContext } from "../../Context/NotificationContext";
import { ComplaintContext } from "../../Context/ComplaintContext";
import SuccessModal from "../../ToastFile/ToastPage";
import ErrorMessage from "../ErrorMessagr/Errormessagestyle";


export default function HistoryAndComments({ navigation,route }) {
     const { notificationId, item } = route.params || {};
  const [comment, setComment] = useState("");
  const [complaintId,setCompliantId] = useState("")
  const { getNotificationsByHostel,readNotificationsByHostel,getComplaintUpdates } = useContext(NotificationContext);
    const { activeHostelId } = useContext(CommonContexts);
     const { addComplaintComment } = useContext(ComplaintContext);
     const [modalType, setModalType] = useState("success");
       const [showSuccess, setShowSuccess] = useState(false);
       const [message, setMessage] = useState("");
       const [commentsList,setCommentsList] = useState([])
    console.log('notificationId',item)

     const [updates, setUpdates] = useState([]);

  useEffect(() => {
    if(notificationId){
 fetchUpdates();
    }
   
  }, []);

  const fetchUpdates = async () => {
    const res = await getComplaintUpdates(activeHostelId, notificationId);
    if (res.success) {
      setUpdates(res.data.complaintUpdates);
      setCompliantId(res.data.complaintId)
      console.log("priyarajesh",res.data)
      setCommentsList(res.data)
    }
  };
  console.log("complaintId",complaintId)

  const getColor = (status) => {
    switch (status) {
      case "resolved":
        return "#22C55E";
      case "completed":
        return "#4ADE80";
      case "progress":
        return "#F59E0B";
      default:
        return "#CBD5E1";
    }
  };
const [commentError,setCommentError] = useState("")
  const handleAddComment = async () => {
   if (!comment.trim()) {
    setCommentError("Please enter a comment");
    return;
  }


 

  const res = await addComplaintComment({
    complaintId: notificationId, 
    message: comment,
  });

  if (res.success) {
    
 setComment("")
       setModalType("success");
      setMessage(res.message);
      setShowSuccess(true);
        fetchUpdates();
      setTimeout(() => {
        setShowSuccess(false);
      }, 800);
   
  }
};


  return (
    <>
     <SuccessModal visible={showSuccess} message={message} type={modalType} />
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History & Comments</Text>
      </View>

     

     <ScrollView
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ paddingBottom: 120 }} // 👈 space for keyboard
>
        {/* ADD COMMENT */}
        <View style={styles.addCommentRow}>
          {/* <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          /> */}
          <View style={styles.avatarWrapper}>
  {item.profilePic ? (
    <Image
      source={{ uri: item.profilePic }}
      style={styles.avatar}
    />
  ) : (
    <View style={styles.initialCircle}>
      <Text style={styles.initialText}>
        {item.initials || "NA"}
      </Text>
    </View>
  )}
</View>

          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Add new Comment"
              value={comment}
              onChangeText={(text) => {
  setComment(text);
  setCommentError("");
}}

              multiline
              style={styles.input}
            />
              {commentError && <ErrorMessage message={commentError} type="error" />}
            <TouchableOpacity style={styles.addBtn} onPress={handleAddComment}>
              <Text style={styles.addBtnText}>Add Comment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TIMELINE */}
      {updates.map((item, index) => (
  <View key={index} style={styles.timelineRow}>
    {/* LEFT ICON + LINE */}
    <View style={styles.leftCol}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: "#2563EB" },
        ]}
      >
        <Text style={styles.check}>✓</Text>
      </View>

      {index !== updates.length - 1 && (
        <View style={styles.verticalLine} />
      )}
    </View>

    {/* CONTENT */}
    <View style={styles.content}>
      <Text style={styles.title}>
        {item.update}
      </Text>

      <Text style={styles.desc}>
        {item.description}
      </Text>

      <Text style={styles.time}>
        Added at {item.updateAt}, {item.updatedTime}
      </Text>

    {/* {item.comments?.length > 0 && (
  <View style={styles.commentBox}>
    <Text style={styles.commentText}>
      {item.comments[0].comment}
    </Text>
  </View>
)} */}
{/* {item.comments?.map((c, i) => (
  <View key={i} style={styles.commentBox}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      
      
      {c.profilePic ? (
        <Image
          source={{ uri: c.profilePic }}
          style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }}
        />
      ) : (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: "#E5E7EB",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "700" }}>
            {c.initials}
          </Text>
        </View>
      )}

    
      <Text style={{ fontWeight: "600", fontSize: 12 }}>
        {c.commentedBy}
      </Text>
    </View>

   
    <Text style={styles.commentText}>
      {c.comment}
    </Text>
  </View>
))} */}
{item.comments?.map((c, i) => (
  <View key={i} style={styles.commentWrapper}>

    {/* Header row */}
    <View style={styles.commentHeader}>
      {/* Avatar */}
      {c.profilePic ? (
        <Image
          source={{ uri: c.profilePic }}
          style={styles.commentAvatar}
        />
      ) : (
        <View style={styles.commentAvatarFallback}>
          <Text style={styles.commentAvatarText}>
            {c.initials}
          </Text>
        </View>
      )}

      {/* Name + action */}
      <Text style={styles.commentUser}>
        <Text style={{ fontWeight: "700" }}>{c.commentedBy}</Text>
        <Text style={{ color: "#6B7280" }}> added a comment</Text>
      </Text>
    </View>

    {/* Time */}
    <Text style={styles.commentTime}>
      Added at {c.date}, {c.time}
    </Text>

    {/* Comment bubble */}
    <View style={styles.commentBubble}>
      <Text style={styles.commentText}>{c.comment}</Text>
    </View>

  </View>
))}


    </View>
  </View>
))}

      </ScrollView>
    </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop:50 },

  header: {
    flexDirection: "row",
    alignItems: "center",
  
  },
  back: { fontSize: 22, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  complaintId: {
    color: "#2563EB",
    fontSize: 13,
    marginBottom: 12,
  },

  addCommentRow: {
    flexDirection: "row",
    marginTop: 20,
  },
 avatarWrapper: {
  width: 40,
  height: 40,
  marginRight: 10,
},

avatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
},

initialCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#E5E7EB",
  justifyContent: "center",
  alignItems: "center",
},

initialText: {
  fontWeight: "700",
  color: "#111827",
},

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    marginBottom: 8,
  },
  addBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addBtnText: { color: "#fff", fontWeight: "600" },

  timelineRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  leftCol: { alignItems: "center", width: 40 },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  check: { color: "#fff", fontWeight: "700" },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 4,
  },

  content: { flex: 1 },
  title: { fontWeight: "700", fontSize: 14 },
  desc: { fontSize: 13, color: "#374151", marginTop: 2 },
  time: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },

  commentBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  commentText: { fontSize: 13 },
  commentWrapper: {
  marginTop: 16,
},

commentHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 6,
},

commentAvatar: {
  width: 36,
  height: 36,
  borderRadius: 18,
  marginRight: 10,
},

commentAvatarFallback: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#E5E7EB",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},

commentAvatarText: {
  fontWeight: "700",
  fontSize: 13,
  color: "#374151",
},

commentUser: {
  fontSize: 14,
},

commentTime: {
  fontSize: 12,
  color: "#6B7280",
  marginLeft: 46, // aligns under name
  marginBottom: 8,
},

commentBubble: {
  marginLeft: 46,
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 12,
  padding: 12,
  backgroundColor: "#fff",
},

commentText: {
  fontSize: 14,
  color: "#111827",
},

});
