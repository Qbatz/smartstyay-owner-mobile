import React ,{useContext , useState, useEffect} from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { ComplaintContext } from "../../Context/ComplaintContext";
import { CommonContexts } from "../../Context/CommonContext";
import CommentChatIcon from "../../Assets/Images/chat-notification.png";
import ArrowLeft from "../../Assets/Images/Arrow_left.png";

export default function ComplaintUpdates({ route , navigation}) {

        const { loading , complaintUpdates ,complaintsViewUpdates } = useContext(ComplaintContext);
        const { activeHostelId } = useContext(CommonContexts);

        console.log("complaintdetails",complaintUpdates );
        
  const { selectedComplaint } = route.params || {};

   console.log("selectedComplaint",selectedComplaint );
        
  const updates = [
    {
      type: "status",
      title: "Complaint In Progress",
      sub: 'Staff marked complaint as "In Progress"',
      time: "Added at 24 Oct 2025, 11:00 AM",
      icon: CommentChatIcon,
    },
    {
      type: "comment",
      title: "Nagarajan – Admin added a comment",
      comment: "Complaint will resolve by tomorrow",
      time: "Added at 24 Oct 2025, 10:30 AM",
      avatar: true,
    },
    {
      type: "assign",
      title: "Complaint Assigned",
      sub: "Assigned to Maintenance Staff – Winston R",
      time: "Added at 24 Oct 2025, 10:00 AM",
      icon: CommentChatIcon,
    },
    {
      type: "raised",
      title: "Complaint Raised by you – Plumbing",
      sub: "Water leaking continuously near bathroom tap.",
      time: "Added at 24 Oct 2025, 08:00 AM",
      icon: CommentChatIcon,
    },
  ];

  const ProfileAvatar = ({ profilePic, initials }) => {
  if (profilePic) {
    return (
      <Image source={{ uri: profilePic }} style={styles.avatarImg} />
    );
  }

  return (
    <View style={styles.initialCircle}>
      <Text style={styles.initialText}>
        {initials || "?"}
      </Text>
    </View>
  );
};


  return (
  <View style={{ flex: 1, backgroundColor: "#fff" }}>
  {/* FIXED HEADER */}
  <View style={styles.fixedHeader}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={ArrowLeft} style={styles.backIcon} />
              </TouchableOpacity>
    <Text style={styles.headerTitle}>
      {selectedComplaint?.complaintTypeName || "N/A"} - ({selectedComplaint?.complaintTypeId})
    </Text>
  </View>

  {/* SCROLLABLE CONTENT */}
 <ScrollView
  contentContainerStyle={styles.scrollContainer}
  showsVerticalScrollIndicator={false}
>
  {complaintUpdates?.map((item, index) => (
    <View key={index} style={styles.row}>
      
      {/* LEFT ICON + LINE */}
      <View style={styles.timeline}>
        <View style={styles.iconCircle}>
          <Image source={CommentChatIcon} style={styles.iconImg} />
        </View>

        {index !== complaintUpdates.length - 1 && (
          <View style={styles.line} />
        )}
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        
        {/* UPDATE TITLE */}
        <Text style={styles.title}>{item.update}</Text>

        {/* DESCRIPTION */}
        {item.description && (
          <Text style={styles.sub}>{item.description}</Text>
        )}
          <Text style={styles.time}>
          Added at {item.updatedAt}, {item.updatedTime}
        </Text>

        {/* ADMIN INFO */}
        {/* <View style={styles.adminRow}>
          <ProfileAvatar
            profilePic={item.profilePic}
            initials={item.initials}
          />
          <Text style={styles.adminName}>
            {item.updatedBy}
          </Text>
        </View> */}

        {/* COMMENTS */}
        {item.comments?.map((cmt, cIndex) => (
          <View key={cIndex} style={styles.commentRow}>
            <ProfileAvatar
              profilePic={cmt.profilePic}
              initials={cmt.initials}
            />
 <View style={styles.commentContainer}>
 <Text style={styles.commentAuthor}>
      {cmt.commentedBy}
    </Text>

            <View style={styles.commentBox}>
      <Text style={styles.commentText}>
        {cmt.comment}
      </Text>
    </View>
      </View>
          </View>
        ))}

        {/* TIME */}
      
      </View>
    </View>
  ))}
</ScrollView>

</View>

  );
}
const styles = StyleSheet.create({
 fixedHeader: {
  height: 90,         
  paddingTop: 60,  
//   justifyContent: "center",
  paddingHorizontal: 16, 
//   borderBottomWidth: 1,
//   borderBottomColor: "#E5E7EB", 
  backgroundColor: "#fff",
  display:'flex',
  flexDirection:'row',
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
},


  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  avatarImg: {
  width: 28,
  height: 28,
  borderRadius: 14,
},

initialCircle: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: "#E5E7EB",
  alignItems: "center",
  justifyContent: "center",
},

initialText: {
  fontSize: 12,
  fontWeight: "700",
  color: "#374151",
},

adminRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 8,
},

adminName: {
  marginLeft: 8,
  fontSize: 13,
  fontWeight: "600",
  color: "#111827",
},

commentRow: {
  flexDirection: "row",
  marginTop: 12,
  alignItems: "flex-start",
},

commentContainer: {
  flex: 1,              // ✅ THIS increases width
  marginLeft: 8,
},


commentBox: {
  width: "100%",        // ✅ full width
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 12,
//   backgroundColor: "#F9FAFB",
},


commentAuthor: {
  fontSize: 12,
  fontWeight: "700",
  color: "#111827",
  marginBottom: 4,     // space between name & input
},


  scrollContainer: {
    paddingTop: 120,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  row: {
    flexDirection: "row",
    marginBottom: 26,
  },

  timeline: {
    width: 36,
    alignItems: "center",
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  iconImg: {
    width: 18,
    height: 18,
    tintColor: "#2D6CDF",
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 6,
  },

  content: {
    flex: 1,
    paddingLeft: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  sub: {
    fontSize: 13,
    color: "#374151",
    marginTop: 4,
  },

  time: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 6,
  },

 

  commentText: {
    fontSize: 13,
    color: "#111827",
  },
   backIcon: { width: 22, height: 22, marginRight: 10 },
});

