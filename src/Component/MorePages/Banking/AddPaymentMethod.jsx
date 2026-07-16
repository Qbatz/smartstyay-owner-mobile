import React, { useState , useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BankingContext } from "../../../Context/BankingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import SuccessModal from "../../../ToastFile/ToastPage";



export default function AddPaymentMethod() {

   const { activeHostelId } = useContext(CommonContexts);
    const { bankList, addBanking,  editBanking, errorMsg, getBankListByHostel } =
      useContext(BankingContext);
  
    
  const [type, setType] = useState("upi");
    const navigation = useNavigation()

  const Radio = ({ value, label }) => (
    <TouchableOpacity
      style={styles.radioRow}
      onPress={() => setType(value)}
    >
      <View
        style={[
          styles.radio,
          type === value && styles.radioActive,
        ]}
      />
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Add Payment Method</Text> */}

      <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ fontSize: 22 }}>←</Text>
              </TouchableOpacity>
      
              <Text style={styles.title}>Add Payment Method</Text>
            </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>
          Select Type *
        </Text>

        <Radio value="upi" label="UPI" />
        <Radio value="credit" label="Credit Card" />
        <Radio value="debit" label="Debit Card" />
        <Radio value="qr" label="QR Code" />

        {/* UPI */}

        {type === "upi" && (
          <>
            <Text style={styles.label}>Linked Bank *</Text>
            <TextInput
              placeholder="Select Bank"
              style={styles.input}
            />

            <Text style={styles.label}>UPI App *</Text>
            <TextInput
              placeholder="Google Pay"
              style={styles.input}
            />

            <Text style={styles.label}>UPI ID *</Text>
            <TextInput
              placeholder="smartstay@oksbi"
              style={styles.input}
            />

            <Text style={styles.label}>Display Name *</Text>
            <TextInput
              placeholder="Gpay UPI"
              style={styles.input}
            />

            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              placeholder="+91 9876543210"
              style={styles.input}
            />
          </>
        )}

        {/* Credit */}

        {type === "credit" && (
          <>
            <Text style={styles.label}>Linked Bank *</Text>
            <TextInput
              placeholder="Select Bank"
              style={styles.input}
            />

            <Text style={styles.label}>Card Network *</Text>
            <TextInput
              placeholder="Visa / Master"
              style={styles.input}
            />

            <Text style={styles.label}>Card Holder</Text>
            <TextInput
              placeholder="Holder Name"
              style={styles.input}
            />

            <Text style={styles.label}>
              Card Number (Last 4)
            </Text>
            <TextInput
              placeholder="1234"
              style={styles.input}
            />

            <Text style={styles.label}>
              Display Name
            </Text>
            <TextInput
              placeholder="Hostel Credit Card"
              style={styles.input}
            />

            <Text style={styles.label}>
              Credit Limit
            </Text>
            <TextInput
              placeholder="₹50000"
              style={styles.input}
            />
          </>
        )}

        {/* Debit */}

        {type === "debit" && (
          <>
            <Text style={styles.label}>Linked Bank *</Text>
            <TextInput
              placeholder="Select Bank"
              style={styles.input}
            />

            <Text style={styles.label}>Card Network *</Text>
            <TextInput
              placeholder="Visa / Master"
              style={styles.input}
            />

            <Text style={styles.label}>Card Holder</Text>
            <TextInput
              placeholder="Holder Name"
              style={styles.input}
            />

            <Text style={styles.label}>
              Card Number (Last 4)
            </Text>
            <TextInput
              placeholder="1234"
              style={styles.input}
            />

            <Text style={styles.label}>
              Display Name
            </Text>
            <TextInput
              placeholder="Hostel Debit Card"
              style={styles.input}
            />
          </>
        )}

        {/* QR */}

        {type === "qr" && (
          <>
            <Text style={styles.label}>QR Name *</Text>
            <TextInput
              placeholder="Owner QR"
              style={styles.input}
            />

            <Text style={styles.label}>
              Card Number (Last 4)
            </Text>
            <TextInput
              placeholder="1234"
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.upload}
            >
              <Text>Choose QR Image</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          multiline
          numberOfLines={5}
          style={styles.textArea}
          placeholder="Describe..."
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelBtn}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBtn}
          >
            <Text style={{ color: "#fff" }}>
              {type === "qr"
                ? "Save QR"
                : "Create Method"}
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
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop:15
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    // marginBottom: 20,
    marginLeft:15
  },

  label: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "500",
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#D6D6D6",
    marginRight: 10,
  },

  radioActive: {
    borderColor: "#2F54EB",
    backgroundColor: "#2F54EB",
  },

  radioText: {
    fontSize: 15,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  upload: {
    height: 80,
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  textArea: {
    height: 110,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
    marginBottom: 30,
  },

  cancelBtn: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 10,
  },

  saveBtn: {
    backgroundColor: "#2F54EB",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});