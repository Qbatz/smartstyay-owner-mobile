import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,Image
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native";
import { UseSetting } from "../../../Context/SettingContext";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
const TenantRegister = ({navigation}) => {

    const {  Reportsdetails} = UseSetting();

const tenantList = [
  {
    name: "Muthuraja M",
    sub: "+91 98765 43213",
    amount: "₹ 9,300",
  },
  {
    name: "Murugan N",
    sub: "+91 98765 43213",
    amount: "₹ 5,100",
  },
  {
    name: "Wilson Calzoni",
    sub: "INV-002",
    amount: "₹ 5,100",
  },
  {
    name: "Nolan Calzoni",
    sub: "+91 98765 43213",
    amount: "₹ 5,100",
  },
  {
    name: "Alfredo Press",
    sub: "+91 98765 43213",
    amount: "₹ 5,100",
  },
   {
    name: "Wilson Calzoni",
    sub: "INV-002",
    amount: "₹ 5,100",
  },
  {
    name: "Nolan Calzoni",
    sub: "+91 98765 43213",
    amount: "₹ 5,100",
  },
  {
    name: "Alfredo Press",
    sub: "+91 98765 43213",
    amount: "₹ 5,100",
  },
   {
    name: "Wilson Calzoni",
    sub: "INV-002",
    amount: "₹ 5,100",
  },
  {
    name: "Nolan Calzoni",
    sub: "+91 98765 43213",
    amount: "₹ 5,100",
  },
  {
    name: "Alfredo Press",
    sub: "+91 98765 43213",
    amount: "₹ 5,100",
  },
];


  return (
         <>
<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
         <View style={styles.container}>
             {/* <View style={styles.headerRow}>
                   <TouchableOpacity  onPress={() => {navigation.goBack()}}>
                     <Image source={ArrowLeft} style={styles.backIcon} />
                   </TouchableOpacity>
                   <Text style={styles.title}> Tenant Register
           </Text>
                 </View> */}

                 
                                          <View style={styles.headerRow}>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                      <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <Image source={ArrowLeft} style={styles.backIcon} />
                                      </TouchableOpacity>
                                      <Text style={styles.title}>Tenant Register</Text>
                                    </View>
                                  
                                    <TouchableOpacity style={styles.monthBtn}>
                                      <Text style={styles.monthText}>This Month ▼</Text>
                                    </TouchableOpacity>
                                  </View>
           <LinearGradient
  colors={["#E7F1FF", "#FFFFFF"]}
  start={{ x: 1, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={styles.summaryCard}
>
  <View style={styles.row}>
    <Text style={styles.label}>Total Tenants </Text>
    <Text style={styles.totalValue}>{Reportsdetails?.tenantInfo?.totalTenants}</Text>
  </View>
<View style={styles.divider} />
  <View style={styles.row}>
    <Text style={styles.label}>Active Tenants</Text>
    <Text style={styles.value}>32</Text>
  </View>

  <View style={styles.row}>
    <Text style={styles.label}>Notice Period</Text>
    <Text style={styles.value}>04</Text>
  </View>
   <View style={styles.row}>
    <Text style={styles.label}>Check out</Text>
    <Text style={styles.value}>02</Text>
  </View>
</LinearGradient>

 <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterBtn, styles.activeFilter]}>
          <Text style={styles.activeFilterText}>All ▼</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Type ▼</Text>
        </TouchableOpacity>
      </View>


    <ScrollView
  showsVerticalScrollIndicator={false}
   contentContainerStyle={{ paddingBottom: 140 }}
    >
      {/* SUMMARY CARD */}


      {/* FILTER */}
     

      {/* LIST */}
    {tenantList.map((item, index) => (
  <View key={index} style={styles.listItem}>
    <View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.sub}>{item.sub}</Text>
    </View>

    <Text style={styles.amount}>{item.amount}</Text>
  </View>
))}


      {/* EXPORT */}
    
    </ScrollView>
      {/* <TouchableOpacity style={styles.exportBtn}>
        <Text style={styles.exportText}>Export PDF</Text>
      </TouchableOpacity> */}
    </View>

      <View style={styles.exportWrapper}>
    <TouchableOpacity style={styles.exportBtn}>
      <Text style={styles.exportText}>Export PDF</Text>
    </TouchableOpacity>
  </View>

    </SafeAreaView>
      </>
  );
};

export default TenantRegister;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
 container: {
  flex: 1,
  paddingHorizontal: 16,
  paddingTop: 60,
  backgroundColor: "#fff",
},


 headerRow: {
    // height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    marginBottom:6
  },
  monthBtn: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
},

monthText: {
  fontSize: 13,
  color: "#374151",
  fontWeight: "500",
},
  backIcon: { width: 22, height: 22, marginRight: 10 },

  title: { fontSize: 18, fontWeight: "700" },

  /* SUMMARY */
//   summaryCard: {
//     backgroundColor: "#F8FAFC",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 14,
//   },

  summaryCard: {
  borderRadius: 14,
  padding: 16,
  marginBottom: 14,
//   shadowColor: "#000",
//   shadowOpacity: 0.04,
//   shadowRadius: 8,
//   elevation: 5,
},

divider: {
  height: 1,
  backgroundColor: "rgba(0,0,0,0.06)", // 🔥 figma subtle line
  marginVertical: 2,
  marginBottom:4
},

totalValue: {
  fontSize: 20,        // figma-la konjam perusa irukkum
  fontWeight: "700",
  color: "#111827",
},
sub: {
  fontSize: 12,
  color: "#9CA3AF",   // slightly lighter like figma
  marginTop: 4,
},


  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  /* FILTER */
  filterRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  filterBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: "#fff",
  },

  activeFilter: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },

  filterText: {
    fontSize: 13,
    color: "#374151",
  },

  activeFilterText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },

  /* LIST */
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,   // 🔥 compact like figma
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  sub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  amount: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* EXPORT */

exportWrapper: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  paddingHorizontal: 16,
  paddingBottom: 20, // 🔥 Android navigation bar safe
  backgroundColor: "#fff",
},

exportBtn: {
  backgroundColor: "#1D4ED8",
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: "center",
},



  exportText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
