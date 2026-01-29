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

const timelineData = [
  {
    id: 1,
    status: "resolved",
    title: "Complaint Resolved",
    desc: "Tenant confirmed the complaint is resolved.",
    time: "Added at 25 Oct 2025, 1:00 PM",
  },
  {
    id: 2,
    status: "completed",
    title: "Work Completed",
    desc: 'Staff marked complaint as "Completed"',
    time: "Added at 25 Oct 2025, 12:30 PM",
  },
  {
    id: 3,
    status: "progress",
    title: "Complaint In Progress",
    desc: 'Staff marked complaint as "In Progress"',
    time: "Added at 24 Oct 2025, 11:00 AM",
    comment: "Complaint will resolve by tomorrow",
  },
  {
    id: 4,
    status: "assigned",
    title: "Complaint Assigned",
    desc: "Complaint assigned to Maintenance Staff – Rajesh",
    time: "Added at 24 Oct 2025, 10:30 AM",
  },
];

export default function HistoryAndComments({ navigation,route }) {
     const { notificationId, item } = route.params || {};
  const [comment, setComment] = useState("");
  const { getNotificationsByHostel,readNotificationsByHostel,getComplaintUpdates } = useContext(NotificationContext);
    const { activeHostelId } = useContext(CommonContexts);
    console.log('notificationId',notificationId)

     const [updates, setUpdates] = useState([]);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    const res = await getComplaintUpdates(activeHostelId, notificationId);
    if (res.success) {
      setUpdates(res.data);
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History & Comments</Text>
      </View>

      <Text style={styles.complaintId}>Complaint Id – #CMP674</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ADD COMMENT */}
        <View style={styles.addCommentRow}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Add new Comment"
              value={comment}
              onChangeText={setComment}
              multiline
              style={styles.input}
            />
            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>Add Comment</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TIMELINE */}
        {timelineData.map((item, index) => (
          <View key={item.id} style={styles.timelineRow}>
            {/* LEFT ICON + LINE */}
            <View style={styles.leftCol}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: getColor(item.status) },
                ]}
              >
                <Text style={styles.check}>✓</Text>
              </View>
              {index !== timelineData.length - 1 && (
                <View style={styles.verticalLine} />
              )}
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
              <Text style={styles.time}>{item.time}</Text>

              {item.comment && (
                <View style={styles.commentBox}>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
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
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
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
});
