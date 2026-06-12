import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";

import ArrowLeft from "../../../Assets/Images/directionleft.png";
import * as ImagePicker from "react-native-image-picker";



export default function VendorSettlePayment({
  navigation,
  route,
}) {
  const { vendor } = route.params;

  const dueAmount = 2000;

  const [paidAmount, setPaidAmount] =
    useState("");
  const [description, setDescription] =
    useState("");

    const [attachments, setAttachments] = useState([]);
const [selectedImage, setSelectedImage] = useState(null);

  const balance =
    dueAmount -
    (Number(paidAmount) || 0);

    const pickImage = () => {
  ImagePicker.launchImageLibrary(
    {
      mediaType: "photo",
      selectionLimit: 0, // multiple images
    },
    (response) => {
      if (response.didCancel) return;

      if (response.assets?.length) {
        const newFiles = response.assets;

        setAttachments((prev) => [
          ...prev,
          ...newFiles,
        ]);

        if (!selectedImage) {
          setSelectedImage(newFiles[0]);
        }
      }
    }
  );
};

const removeImage = (index) => {
  const updated = attachments.filter(
    (_, i) => i !== index
  );

  setAttachments(updated);

  if (selectedImage?.uri === attachments[index]?.uri) {
    setSelectedImage(updated[0] || null);
  }
};

  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >
          <Image
            source={ArrowLeft}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Settle Payment
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Vendor */}

        <Text style={styles.label}>
          Vendor / Business Name *
        </Text>

        <View style={styles.inputBox}>
          <Text>
            {vendor?.firstName}
            {/* Please Enter Name */}
          </Text>
        </View>

        {/* Paid Amount */}

        <Text style={styles.label}>
          Paid Amount (INR) *
        </Text>

        <View style={styles.amountRow}>
          <TextInput
            placeholder="Enter Amount"
            keyboardType="numeric"
            value={paidAmount}
            onChangeText={setPaidAmount}
            style={styles.amountInput}
          />

          <TouchableOpacity
            style={styles.setBtn}
            onPress={() =>
              setPaidAmount(
                String(dueAmount)
              )
            }
          >
            <Text
              style={styles.setBtnText}
            >
              Set
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.dueText}>
          Due Amount is ₹
          {dueAmount.toFixed(2)}
        </Text>

        {/* Balance */}

        <Text style={styles.label}>
          Balance Payable If
        </Text>

        <View style={styles.inputBox}>
          <Text>
            ₹
            {balance > 0
              ? balance.toFixed(2)
              : "0.00"}
          </Text>
        </View>

        {/* Paid Date */}

        <Text style={styles.label}>
          Paid Date *
        </Text>

        <View style={styles.inputBox}>
          <Text>
            12 June 2026
          </Text>
        </View>

        {/* Account */}

        <Text style={styles.label}>
          Paid From Account *
        </Text>

        <View style={styles.inputBox}>
          <Text>
            SBI Bank
          </Text>
        </View>

        <Text style={styles.label}>
          Transferring Account *
        </Text>

        <View style={styles.inputBox}>
          <Text>
            GPay UPI
          </Text>
        </View>

        {/* Transaction */}

        <Text style={styles.label}>
          Transaction ID
        </Text>

        <TextInput
          placeholder="Enter ID"
          style={styles.inputBox}
        />

        {/* Upload */}

        <Text style={styles.label}>
  Attachments / Proofs
</Text>

{attachments.length === 0 ? (
  <TouchableOpacity
    style={styles.uploadBox}
    onPress={pickImage}
  >
    <Text style={styles.uploadText}>
      Choose Image to Upload
    </Text>
  </TouchableOpacity>
) : (
  <>
    {/* Main Preview */}

    <View style={styles.previewCard}>
      <Image
        source={{ uri: selectedImage?.uri }}
        style={styles.previewImage}
      />

      <View style={styles.fileInfoRow}>
        <View>
          <Text style={styles.fileName}>
            {selectedImage?.fileName}
          </Text>

          <Text style={styles.fileSize}>
            {(
              (selectedImage?.fileSize || 0) /
              1024
            ).toFixed(0)}{" "}
            KB
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            const index =
              attachments.findIndex(
                (item) =>
                  item.uri ===
                  selectedImage.uri
              );

            removeImage(index);
          }}
          style={styles.deleteBtn}
        >
          <Text
            style={{
              color: "#FF4D4F",
              fontSize: 20,
            }}
          >
            ✕
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Thumbnail List */}

    <View style={styles.thumbnailRow}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={
          false
        }
      >
        {attachments.map(
          (item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                setSelectedImage(item)
              }
            >
              <Image
                source={{
                  uri: item.uri,
                }}
                style={[
                  styles.thumbImage,
                  selectedImage?.uri ===
                    item.uri && {
                    borderColor:
                      "#2D5BFF",
                    borderWidth: 2,
                  },
                ]}
              />
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={pickImage}
      >
        <Text style={styles.addMore}>
          + Add more Files
        </Text>
      </TouchableOpacity>
    </View>
  </>
)}

        {/* Description */}

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          multiline
          value={description}
          onChangeText={
            setDescription
          }
          placeholder="Ex : Wifi Bill Paid for May"
          style={
            styles.descriptionInput
          }
        />

        {/* Summary */}

        <View style={styles.summaryCard}>
          <Text
            style={styles.summaryTitle}
          >
            SUMMARY
          </Text>

          <Text
            style={styles.summaryAmount}
          >
            ₹
            {(
              Number(paidAmount) ||
              0
            ).toFixed(2)}
          </Text>

          <View
            style={styles.divider}
          />

          <View
            style={styles.summaryRow}
          >
            <Text
              style={styles.summaryText}
            >
              Paid Amount
            </Text>

            <Text
              style={styles.summaryText}
            >
              ₹
              {(
                Number(
                  paidAmount
                ) || 0
              ).toFixed(2)}
            </Text>
          </View>

          <View
            style={styles.summaryRow}
          >
            <Text
              style={styles.summaryText}
            >
              Balance Amount
            </Text>

            <Text
              style={styles.summaryText}
            >
              ₹
              {balance > 0
                ? balance.toFixed(
                    2
                  )
                : "0.00"}
            </Text>
          </View>
        </View>

        {/* Footer */}

        <View
          style={styles.footer}
        >
          <TouchableOpacity
            style={styles.cancelBtn}
          >
            <Text style={{fontFamily: "Gilroy-Semibold"}}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitBtn}
          >
            <Text
              style={{
                color: "#fff",
               fontFamily: "Gilroy-Semibold"
              }}
            >
              Settle ₹
              {(
                Number(
                  paidAmount
                ) || 0
              ).toFixed(0)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 50,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  title: {
    flex: 1,
    fontSize: 24,
    fontFamily: "Gilroy-Bold",
    marginLeft: 12,
  },

  backIcon: {
    width: 25,
    height: 25,
  },

  label: {
    fontSize: 14,
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
    color: "#111827",
    fontFamily: "Gilroy-Semibold"
  },

  inputBox: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
    fontFamily: "Gilroy-Regular"
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
  },

  amountInput: {
    flex: 1,
    height: 56,
  },

  setBtn: {
    backgroundColor: "#E8EEFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  dueText: {
    textAlign: "right",
    marginRight: 18,
    marginTop: 10,
    fontSize: 16,
   fontFamily: "Gilroy-Semibold"
  },

  uploadBox: {
    height: 90,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  uploadText: {
    color: "#2D5BFF",fontFamily: "Gilroy-Semibold"
  },

  descriptionInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    textAlignVertical: "top",
  },

  summaryCard: {
    margin: 16,
    backgroundColor: "#1F2BA8",
    borderRadius: 16,
    padding: 20,
  },

  summaryTitle: {
    color: "#BFC9FF",
    fontSize: 12,
    fontFamily: "Gilroy-Semibold"
  },

  summaryAmount: {
    color: "#fff",
    fontSize: 34,
    fontFamily: "Gilroy-Bold",
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#4A57D6",
    marginVertical: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  summaryText: {
    color: "#fff",
    fontFamily: "Gilroy-Semibold"
  },

  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },

  cancelBtn: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  submitBtn: {
    flex: 1.5,
    height: 52,
    backgroundColor: "#2D5BFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  previewCard: {
  marginHorizontal: 16,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 14,
  overflow: "hidden",
  backgroundColor: "#FFF",
},

previewImage: {
  width: "100%",
  height: 220,
  resizeMode: "cover",
},

fileInfoRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 12,
},

fileName: {
  fontSize: 15,
  fontFamily: "Gilroy-Semibold",
},

fileSize: {
  color: "#6B7280",
  marginTop: 4,
},

deleteBtn: {
  width: 36,
  height: 36,
  borderRadius: 8,
  backgroundColor: "#FFF1F0",
  justifyContent: "center",
  alignItems: "center",
},

thumbnailRow: {
  marginTop: 12,
  marginHorizontal: 16,
},

thumbImage: {
  width: 90,
  height: 70,
  borderRadius: 8,
  marginRight: 10,
},

addMore: {
  color: "#2D5BFF",
  marginTop: 10,
  textAlign: "right",
  fontFamily: "Gilroy-Semibold",
},

});