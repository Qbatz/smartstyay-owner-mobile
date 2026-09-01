import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList, Image
} from "react-native"

import { VendorContext } from "../../../Context/VendorContext";
import CommentIcon from "../../../Assets/Images/chat-notification.png"
import EmptyState from "../../../Assets/Images/Empty_state.png"
import { useHasPermission } from "../../../Utils/useHasPermission"
import { CustomerContext } from "../../../Context/CustomerContext"
import { CommonContexts } from "../../../Context/CommonContext";
import AddCommentIcon from "../../../Assets/Images/CommentAddIcon.png"
import SuccessModal from "../../../ToastFile/ToastPage";


export default function VendorComments({ vendor }) {


  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([]);
  const { getVendorDetails, vendorDetails, getVendorSettlementInitialize,
    vendorComments, getVendorComments, updateVendorComment,
    addVendorComment, deleteVendorComment } = useContext(VendorContext);


  const [editingCommentId, setEditingCommentId] = useState(null)

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");


  useEffect(() => {
    if (vendor?.id) {
      loadComments();
    }
  }, [vendor?.id]);

  const loadComments = async () => {
    const res = await getVendorComments(vendor?.id)
    console.log(res);


    if (res?.success) {
      console.log("comments loaded");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const res = await deleteVendorComment(commentId);

    if (res?.success) {
      if (editingCommentId === commentId) {
        setComment("");
        setEditingCommentId(null);
      }

      await loadComments();
    }
  };

  // const handleSubmit = async () => {
  //   if (!comment?.trim()) return;

  //   let res;

  //   if (editingCommentId) {
  //     res = await updateVendorComment(
  //       editingCommentId,
  //       {
  //         comment,
  //       }
  //     );
  //   } else {
  //     res = await addVendorComment({
  //       vendorId: vendor?.id,
  //       comment,
  //     });
  //   }

  //   if (res?.success) {
  //     setComment("");
  //     setEditingCommentId(null);

  //     await loadComments();
  //   }
  // };

  const handleSubmit = async () => {
    const trimmedComment = comment.trim();

    // Empty validation
    if (!trimmedComment) {
      setModalType("error");
      setModalMessage("Please Enter a Comment");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);

      return;
    }

    let res;

    if (editingCommentId) {
      // Find existing comment
      const existingComment = vendorComments?.find(
        (item) => item.id === editingCommentId
      );

      // No changes validation
      if (
        existingComment &&
        existingComment.comment.trim() === trimmedComment
      ) {
        setModalType("warning");
        setModalMessage("No Changes Detected");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);

        return;
      }

      res = await updateVendorComment(editingCommentId, {
        comment: trimmedComment,
      });
    } else {
      res = await addVendorComment({
        vendorId: vendor?.id,
        comment: trimmedComment,
      });
    }

    if (res?.success) {
      setComment("");
      setEditingCommentId(null);

      setModalType("success");
      setModalMessage(
        editingCommentId
          ? "Comment updated successfully"
          : "Comment added successfully"
      );
      setShowSuccessModal(true);

      await loadComments();

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } else {
      setModalType("error");
      setModalMessage(res?.message || "Something went wrong");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.timelineRow}>
      <View style={styles.leftSection}>
        <View style={styles.iconCircle}>
          <Image
            source={CommentIcon}
            style={{
              height: 20,
              width: 20,
            }}
          />
        </View>

        {index !== vendorComments?.length - 1 && (
          <View style={styles.line} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          {item.comment}
        </Text>

        <Text style={styles.date}>
          Added at {item.createdAt}
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setComment(item.comment);
              setEditingCommentId(item.id);
            }}
          >
            <Image
              source={require("../../../Assets/Images/editIcon.png")}
              style={styles.menuIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              handleDeleteComment(item.id)
            }
          >
            <Image
              source={require("../../../Assets/Images/trash.png")}
              style={styles.menuIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (

    <>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={modalMessage}
        type={modalType} />

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
              onChangeText={(text) => {
                setComment(text);

                if (editingCommentId && text.trim().length === 0) {
                  setEditingCommentId(null);
                }
              }}
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

          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleSubmit}
          >
            <Image source={AddCommentIcon} style={{ height: 16, width: 16, marginRight: 10, marginTop: 2 }}
              resizeMode="contain" />
            <Text style={styles.addText}>
              {editingCommentId ? "Update" : "Add"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timeline */}
        {vendorComments?.length > 0 ? (
          <FlatList
            data={vendorComments || []}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 80,
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={EmptyState}
              style={styles.emptyIcon}
              resizeMode="contain"
            />

            <Text style={styles.emptyTitle}>
              No Comments
            </Text>

            <Text style={styles.emptySubTitle}>
              No comments have been added yet.
            </Text>
          </View>
        )}
      </View>
    </>
  )
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
    minHeight: 100,
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
    flexDirection: 'row',
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
    paddingBottom: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },

  emptyIcon: {
    width: 200,
    height: 100,
    // opacity: 0.5,
  },

  emptyTitle: {
    marginTop: 4,
    fontSize: 18,
    color: "#111827",
    fontFamily: "Gilroy-Bold",
  },

  emptySubTitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  menuIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
});