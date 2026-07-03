import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AddBankAccount() {
  const [accountType, setAccountType] = useState("bank");

    const navigation = useNavigation()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Add New Account</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Text style={{    fontSize: 15,
    marginBottom: 20,
    marginTop: 15,
    color: "#222",  fontFamily: "Gilroy-Semibold"}}>
          Select Type <Text style={{ color: "red" }}>*</Text>
        </Text>

        <View style={styles.radioRow}>
          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => setAccountType("bank")}
          >
            <View
              style={[
                styles.radio,
                accountType === "bank" && styles.radioActive,
              ]}
            />
            <Text style={styles.radioText}>Bank Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioItem}
            onPress={() => setAccountType("cash")}
          >
            <View
              style={[
                styles.radio,
                accountType === "cash" && styles.radioActive,
              ]}
            />
            <Text style={styles.radioText}>Cash Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Account Name / Display Name <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput
          placeholder="Enter Account Name"
          style={styles.input}
        />

        {accountType === "bank" ? (
          <>
            <Text style={styles.label}>Bank Name <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput
              placeholder="Enter Bank Name"
              style={styles.input}
            />

            <Text style={styles.label}>Account Holder Name <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput
              placeholder="Enter Holder Name"
              style={styles.input}
            />

            <Text style={styles.label}>Account Number <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput
              placeholder="Enter Account Number"
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.label}>Bank Branch <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput
              placeholder="Enter Branch"
              style={styles.input}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>IFSC Code</Text>
                <TextInput
                  placeholder="SBIN000000"
                  style={styles.input}
                />
              </View>

              <View style={styles.half}>
                <Text style={styles.label}>Account Type</Text>
                <TextInput
                  placeholder="Current"
                  style={styles.input}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.label}>Cash Account Type <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput
              placeholder="Petty Cash"
              style={styles.input}
            />

            <Text style={styles.label}>Responsible Person <Text style={{ color: "red" }}>*</Text></Text>
            <TextInput
              placeholder="Select User"
              style={styles.input}
            />
          </>
        )}

        <Text style={styles.label}>Current Opening Balance <Text style={{ color: "red" }}>*</Text></Text>
        <TextInput
          placeholder="₹"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.note}>
          Important: This amount sets your current opening balance. Double-check this figure, as an incorrect balance will miscalculate the final total.
        </Text>

        <Text style={styles.label}>Description</Text>

        <TextInput
          multiline
          numberOfLines={5}
          placeholder="Describe the notes..."
          style={styles.textArea}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitText}>
              Create Account
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
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop:15
  },

  title: {
    fontSize: 22,
      fontFamily: "Gilroy-Bold" ,
    marginLeft: 15,
  },

  label: {
    fontSize: 15,
    marginBottom: 8,
    marginTop: 18,
    color: "#222",
      fontFamily: "Gilroy-Semibold"
  },

  radioRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 35,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CFCFCF",
    marginRight: 8,
  },

  radioActive: {
    borderColor: "#2F49E7",
    backgroundColor: "#2F49E7",
  },

  radioText: {
    fontSize: 15,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
     fontFamily: "Gilroy-Regular" 
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  half: {
    width: "48%",
  },

  textArea: {
    height: 110,
    borderWidth: 1,
    borderColor: "#E4E4E4",
    borderRadius: 12,
    padding: 14,
    textAlignVertical: "top",
  },

  note: {
    color: "#64748B",
    marginTop: 10,
    lineHeight: 20,
    fontSize: 13,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
  },

  cancelBtn: {
    width: 110,
    height: 48,
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cancelText: {
    fontSize: 16,
     fontFamily: "Gilroy-Semibold"
  },

  submitBtn: {
    width: 170,
    height: 48,
    backgroundColor: "#2F49E7",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
     fontFamily: "Gilroy-Semibold"
  },
});