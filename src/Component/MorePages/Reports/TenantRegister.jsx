import React , {useState ,useEffect, useContext, } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,Image
} from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import Loader from "../../../Component/Loader/Loader"
import { NativeModules } from "react-native";
import {getAxios} from "../../../Config/AxiosConfig";
import { retriveData } from "../../../Utils/Storage";


const TenantRegister = ({navigation}) => {

  const { CommonModule } = NativeModules;

    // const {  Reportsdetails} = UseSetting();

         const {loading,  Reportsdetails , GetInvoiceReports  ,
           invoiceReports , getTenantRegisterReport}   = UseSetting();
        const { activeHostelId } = useContext(CommonContexts);

        const [tenantData, setTenantData] = useState(null);


          const {
            canWriteModule: canWriteReports,
            canReadModule: canReadReports,
            canUpdateModule: canUpdateReports,
            canDeleteModule: canDeleteReports,
          } = useHasPermission("Reports")

          useEffect(() => {
  if (!activeHostelId) return;

  const fetchTenantRegister = async () => {
    const response = await getTenantRegisterReport(activeHostelId, {
      page: 0,
      size: 10,
    });

    if (response.success) {
      setTenantData(response.data);  
    }
  };

  fetchTenantRegister();
}, [activeHostelId]);

console.log("tenantdata", tenantData);





const handleDownloadReport = async () => {
  try {
    const token = await retriveData("token")
    const axios = getAxios();

    const startDate = tenantData?.dateRange?.from
    const endDate = tenantData?.dateRange?.to

    const res = await axios.get(`/v2/reports/download/${activeHostelId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate,
          endDate,
        },
      }
    )

    console.log("DOWNLOAD API RESPONSE →", res.data);

    const fileUrl = res.data;

    if (!fileUrl) {
      console.log("No file URL received");
      return;
    }

    await CommonModule.downloadAndViewDocument(fileUrl);

  } catch (error) {
    console.log("Download error →", error);
  }
};


  return (
         <>
           {loading && <Loader />}
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
    <Text style={styles.totalValue}>{tenantData?.summary?.totalTenants}</Text>
  </View>
<View style={styles.divider} />   
  <View style={styles.row}>
    <Text style={styles.label}>Active Tenants</Text>
    <Text style={styles.value}>{tenantData?.summary?.activeTenants?.count}</Text>
  </View>

  <View style={styles.row}>
    <Text style={styles.label}>Notice Period</Text>
    <Text style={styles.value}>{tenantData?.summary?.noticePeriod?.count}</Text>
  </View>
   <View style={styles.row}>
    <Text style={styles.label}>Check out</Text>
    <Text style={styles.value}>{tenantData?.summary?.checkoutMTD?.count}</Text>
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
     
    {tenantData && tenantData?.tenants?.map((item, index) => (
  <View key={index} style={styles.listItem}>
    <View>
      <Text style={styles.name}>{item?.name}</Text>
      <Text style={styles.sub}>{item?.mobileNo}</Text>
    </View>

    <Text style={styles.amount}>₹ {item?.checkInAmount}</Text>
  </View>
))}

{tenantData?.tenants?.length === 0 && (
   <View style={styles.emptyContainer}>
           <Image source={EmptyState} style={styles.emptyImage} />
           <Text style={styles.emptyText}>No Expenses are there!</Text>
         </View>
)}

    
    </ScrollView>

    </View>

      <View style={styles.exportWrapper}>
    <TouchableOpacity style={styles.exportBtn} onPress={handleDownloadReport}>
      <Text style={styles.exportText}>Export PDF</Text>
    </TouchableOpacity>
  </View>

    </SafeAreaView>
      </>
  );
};

export default TenantRegister;


const styles = StyleSheet.create({
 container: {
  flex: 1,
  paddingHorizontal: 16,
  paddingTop: 60,
  backgroundColor: "#fff",
},


 headerRow: {
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



  summaryCard: {
  borderRadius: 14,
  padding: 16,
  marginBottom: 14,
},

divider: {
  height: 1,
  backgroundColor: "rgba(0,0,0,0.06)", 
  marginVertical: 2,
  marginBottom:4
},

totalValue: {
  fontSize: 20,      
  fontWeight: "700",
  color: "#111827",
},
sub: {
  fontSize: 12,
  color: "#9CA3AF",   
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

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,   
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

     emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyImage: {
    width: 250,
    height: 180,
    resizeMode: "contain",
    opacity: 0.9,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },


exportWrapper: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  paddingHorizontal: 16,
  paddingBottom: 45, 
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
