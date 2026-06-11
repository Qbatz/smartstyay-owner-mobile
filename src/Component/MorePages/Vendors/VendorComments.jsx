import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,Image
} from "react-native"


import CommentIcon from "../../../Assets/Images/chat-notification.png"


const COMMENTS = [
  {
    id: "1",
    title: "Payment Follow-up",
    description:
      "Vendor informed that payment will be cleared next week.",
    date: "24 Oct 2025, 11:00 AM",
  },
  {
    id: "2",
    title: "Purchase Discussion",
    description:
      "Discussed electrical material requirements for next month.",
    date: "24 Oct 2025, 10:00 AM",
  },
  {
    id: "3",
    title: "Vendor Added",
    description:
      "Vendor profile created successfully.",
    date: "24 Oct 2025, 08:00 AM",
  },
];

export default function VendorComments() {
  const [comment, setComment] = useState("");

  const renderItem = ({ item, index }) => (
    <View style={styles.timelineRow}>
      <View style={styles.leftSection}>
        <View style={styles.iconCircle}>
        <Image
  source={CommentIcon}
  style={{ height: 20, width: 20 }}
  resizeMode="contain"
/>
        </View>

        {index !== COMMENTS.length - 1 && (
          <View style={styles.line} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.description}>
          {item.description}
        </Text>

        <Text style={styles.date}>
          Added at {item.date}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Comment Box */}

      <View style={styles.topContainer}>
        <Text style={styles.label}>
          Additional Comments
          <Text style={{ color: "red" }}> *</Text>
        </Text>

        <View style={styles.inputBox}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Comment here...."
            multiline
            textAlignVertical="top"
            style={styles.input}
          />

          <View style={styles.editorTools}>
            <Text style={styles.tool}>B</Text>
            <Text style={styles.tool}>I</Text>
            <Text style={styles.tool}>U</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addText}>
            ✈ Add
          </Text>
        </TouchableOpacity>
      </View>

      {/* Timeline */}

      <FlatList
        data={COMMENTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    padding: 16,
  },

  label: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
    fontFamily: "Gilroy-Medium",
  },

  inputBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
  },

  input: {
    minHeight: 120,
    padding: 12,
    fontSize: 14,
  },

  editorTools: {
    flexDirection: "row",
    alignSelf: "flex-end",
    backgroundColor: "#F3F4F6",
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  tool: {
    marginHorizontal: 12,
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
  },

  addBtn: {
    marginTop: 14,
    alignSelf: "flex-end",
    backgroundColor: "#2D5BFF",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  addText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Gilroy-Semibold",
  },

  timelineRow: {
    flexDirection: "row",
  },

  leftSection: {
    width: 60,
    alignItems: "center",
  },

 


  iconText: {
    fontSize: 22,
    color: "#2563EB",
  },

  line: {
    width: 1,
    flex: 1,
    backgroundColor: "#D1D5DB",
    marginTop: 8,
  },

  content: {
    flex: 1,
    paddingBottom: 30,
    paddingLeft: 8,
  },

  title: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Gilroy-Bold",
  },

  description: {
    marginTop: 8,
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
  },

  date: {
    marginTop: 12,
    fontSize: 13,
    color: "#9CA3AF",
  },
    iconCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#E7EDFF",
    alignItems: "center",
    justifyContent: "center",
  },
});