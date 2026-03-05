import React from "react";
import { View, Text, StyleSheet ,TouchableOpacity,Image , ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useHasPermission } from "../../../Utils/useHasPermission"
import AddIcon from "../../../Assets/Images/add-circle.png";

export default function BillTab({ customerDetails }) {
  const invoiceList = customerDetails?.invoiceResponseList || [];
 const navigation = useNavigation();
  console.log("customerDetailsBillTab", invoiceList);

               const {
            canWriteModule: canWriteTenant,
            canReadModule: canReadTenant,
           canUpdateModule: canUpdateTenant,
            canDeleteModule: canDeleteTenant,
          } = useHasPermission("Customers");

              const {
                  canWriteModule: canWriteInvoice,
                  canReadModule: canReadInvoice,
                  canUpdateModule: canUpdateInvoice,
                  canDeleteModule: canDeleteInvoice,
                } = useHasPermission("Bills")

  const handleCreateBill = () => {
    if(!canWriteInvoice) return ;
navigation.navigate("CreateBills" , {mode: "add",customerDetails})
}

  return (
    <>
    
   
    <View style={{ flex: 1 }}>
      <ScrollView     showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 120 }} >
      {invoiceList.map((item, index) => (
        <View key={index} style={styles.row}>
          {/* LEFT */}
          <View>
            <Text style={styles.billId}>{item.invoiceNumber}</Text>

            <View style={styles.subRow}>
              <Text style={styles.billType}>{item.invoiceType}</Text>

              <View
                style={[
                  styles.statusBadge,
                  item.paymentStatus === "Paid"
                    ? styles.paidBadge
                    : styles.overdueBadge,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.paymentStatus === "Paid"
                      ? styles.paidText
                      : styles.overdueText,
                  ]}
                >
                  {item.paymentStatus}
                </Text>
              </View>
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.rightBox}>
            <Text style={styles.amount}>₹{item.totalAmount}</Text>
            <Text style={styles.date}>on {item.dueDate}</Text>
          </View>
        </View>
      ))}
      </ScrollView>
    
    </View>

       <TouchableOpacity 
           style={[ styles.addBtn, !canWriteInvoice && { opacity: 0.4 }]}
             disabled={!canWriteInvoice}
       onPress={handleCreateBill}>
            <Image source={AddIcon} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
           </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  billId: {
    fontSize: 14,
  fontFamily:"Gilroy-Semibold",
    color: "#111827",
    marginBottom: 6,
  },

  subRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  billType: {
    fontSize: 12,
    color: "#6B7280",
    marginRight: 8,
    fontFamily: "Gilroy-Medium" 
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  overdueBadge: {
    backgroundColor: "#FEF3C7",
  },

  paidBadge: {
    backgroundColor: "#DCFCE7",
  },

  statusText: {
    fontSize: 11,
    fontFamily: "Gilroy-Medium" ,
  },

  overdueText: {
    color: "#D97706",
  },

  paidText: {
    color: "#15803D",
  },

  rightBox: {
    alignItems: "flex-end",
    justifyContent: "center",
  },

  amount: {
    fontSize: 15,
   fontFamily:"Gilroy-Semibold",
    color: "#111827",
  },

  date: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 6,
    fontFamily:"Gilroy-Semibold"
  },
  addBtn: {
    // position: "absolute",
    // bottom: 0,
    // right: 10,
    // backgroundColor: "#1D5DFF",
    // width: 55,
    // height: 55,
    // borderRadius: 30,
    // justifyContent: "center",
    // alignItems: "center",
    // elevation: 6,

        position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#1D5DFF",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
