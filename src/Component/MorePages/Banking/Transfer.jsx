import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";

export default function Transfer({navigation}) {

  const [selectedFrom, setSelectedFrom] = useState(null);
const [selectedTo, setSelectedTo] = useState(null);

const [showFromList, setShowFromList] = useState(true);
const [showToList, setShowToList] = useState(true);

  const fromAccounts = [
    {
      id: 1,
      bank: "Canara Bank",
      type: "Bank Account",
      balance: "₹ 40,000.00",
    },
    {
      id: 2,
      bank: "State Bank of India",
      type: "Bank Account",
      balance: "₹ 2,000.00",
    },
    {
      id: 3,
      bank: "Petty Cash",
      type: "Cash Account",
      balance: "₹ 2,000.00",
    },
  ];

  const toAccounts = [
    {
      id: 4,
      bank: "State Bank of India",
      type: "Bank Account",
      balance: "₹ 2,000.00",
    },
    {
      id: 5,
      bank: "Imman Credit Card",
      type: "Credit Card",
      balance: "₹ 17,000.00",
    },
    {
      id: 6,
      bank: "Owner Cash",
      type: "Cash Account",
      balance: "₹ 2,000.00",
    },
  ];

  const AccountCard = ({ item, selected, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Image
            source={require("../../../Assets/Images/bankBlue.png")}
            style={styles.icon}
          />
        </View>

        <View>
          <Text style={styles.bank}>{item.bank}</Text>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.balance}>
            Avl Bal : {item.balance}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.radio,
          selected && styles.radioActive,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

        <View style={styles.headerRow}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Image source={ArrowLeft} style={styles.backIcon} />
  </TouchableOpacity>

  <Text style={styles.header}>
    Self Transfer
  </Text>
</View>

      <ScrollView showsVerticalScrollIndicator={false}>
<View style={styles.sectionRow}>
  <Text style={styles.section}>From</Text>

  <TouchableOpacity
    onPress={() => setShowFromList(!showFromList)}
  >
    <Image
      source={
        showFromList
          ? require("../../../Assets/Images/direction-down.png")
          : require("../../../Assets/Images/direction-down.png")
      }
      style={styles.arrow}
    />
  </TouchableOpacity>
</View>

  {showFromList ? (
  fromAccounts.map((item) => (
    <AccountCard
      key={item.id}
      item={item}
      selected={selectedFrom === item.id}
      onPress={() => {
        setSelectedFrom(item.id);
        setShowFromList(false);
      }}
    />
  ))
) : (
  selectedFrom && (
    <AccountCard
      item={fromAccounts.find(x => x.id === selectedFrom)}
      selected={true}
      onPress={() => {}}
    />
  )
)}

        <View style={styles.sectionRow}>
  <Text style={styles.section}>To</Text>

  <TouchableOpacity
    onPress={() => setShowToList(!showToList)}
  >
    <Image
      source={
        showToList
          ? require("../../../Assets/Images/direction-down.png")
          : require("../../../Assets/Images/direction-down.png")
      }
      style={styles.arrow}
    />
  </TouchableOpacity>
</View>
{showToList ? (
  toAccounts.map((item) => (
    <AccountCard
      key={item.id}
      item={item}
      selected={selectedTo === item.id}
      onPress={() => {
        setSelectedTo(item.id);
        setShowToList(false);
      }}
    />
  ))
) : (
  selectedTo && (
    <AccountCard
      item={toAccounts.find(x => x.id === selectedTo)}
      selected={true}
      onPress={() => {}}
    />
  )
)}

        <Text style={styles.label}>
          Enter Amount to transfer <Text style={{ color: "red" }}>*</Text>
        </Text>

        <TextInput
          placeholder="₹ 0.00"
          style={styles.input}
        />

        <Text style={styles.label}>
          Date <Text style={{ color: "red" }}>*</Text>
        </Text>

        <TextInput
          value="14/11/2025"
          style={styles.input}
        />

        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Describe the notes..."
          style={styles.textArea}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.transferBtn}>
            <Text style={styles.transferText}>
              Transfer
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
     paddingHorizontal: 20,
    paddingTop:60
  },

  headerRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 14,
},

backIcon: {
  width: 22,
  height: 22,
  resizeMode: "contain",
  marginRight: 16,
},

header: {
  fontSize: 24,
  fontFamily: "Gilroy-Bold",
  color: "#202020",
},

  section: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 15,
},

arrow: {
  width: 18,
  height: 18,
  resizeMode: "contain",
},

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  bank: {
    fontSize: 16,
    fontWeight: "600",
  },

  type: {
    color: "#666",
    marginTop: 2,
  },

  balance: {
    color: "#2952E8",
    marginTop: 4,
    fontSize: 13,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CFCFCF",
  },

  radioActive: {
    borderColor: "#2952E8",
    backgroundColor: "#2952E8",
  },

  label: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "500",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 10,
    paddingHorizontal: 14,
  },

  textArea: {
    height: 110,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 10,
    padding: 14,
    textAlignVertical: "top",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
    marginBottom: 40,
  },

  cancelBtn: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginRight: 12,
  },

  cancelText: {
    fontSize: 16,
  },

  transferBtn: {
    backgroundColor: "#2952E8",
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },

  transferText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
 
});