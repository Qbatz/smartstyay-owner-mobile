import React, { useState, useEffect, useContext, } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity, Image
} from "react-native";
import { StatusBar, Platform } from "react-native";
import { useHasPermission } from "../../../Utils/useHasPermission";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import { PGContext } from "../../../Context/PGContext";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import Loader from "../../../Component/Loader/Loader"
import { NativeModules } from "react-native";
import { getAxios } from "../../../Config/AxiosConfig";
import { retriveData } from "../../../Utils/Storage";
import DownArrow from "../../../Assets/Images/direction-down.png";
import FilterBottomSheet from "./FilterBottomSheet";


const TenantRegister = ({ navigation }) => {

  const { CommonModule } = NativeModules;

  // const {  Reportsdetails} = UseSetting();

  const { loading, Reportsdetails, GetInvoiceReports,
    invoiceReports, getTenantRegisterReport } = UseSetting();
  const { getParticularHostelDetails, PGDetails } = useContext(PGContext);
  const { activeHostelId } = useContext(CommonContexts);

  const [tenantData, setTenantData] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [tempStatus, setTempStatus] = useState([]);

  const [selectedSharing, setSelectedSharing] = useState([]);
  const [tempSharing, setTempSharing] = useState([]);

  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [sharingSheetOpen, setSharingSheetOpen] = useState(false);
  const [monthSheetOpen, setMonthSheetOpen] = useState(false);

  const {
    canWriteModule: canWriteReports,
    canReadModule: canReadReports,
    canUpdateModule: canUpdateReports,
    canDeleteModule: canDeleteReports,
  } = useHasPermission("Reports")

  // useEffect(() => {
  //   if (!activeHostelId) return;

  //   const fetchTenantRegister = async () => {
  //     const response = await getTenantRegisterReport(activeHostelId, {
  //       page: 0,
  //       size: 10,
  //     });

  //     if (response.success) {
  //       setTenantData(response.data);
  //     }
  //   };

  //   fetchTenantRegister();
  // }, [activeHostelId]);


  useEffect(() => {
    if (!activeHostelId) return;
      console.log("useEffect running");
      console.log(activeHostelId)
  
  
    const fetchTenantRegister = async () => {
      const filters = {
      page: 1,
      size: 10,
    };
      const response = await getTenantRegisterReport(activeHostelId, filters
      );
  
      if (response.success) {
        setTenantData(response?.data);
      }
       else{
      setTenantData(null)
    }
    };
  
    fetchTenantRegister();
  }, [activeHostelId, ]);

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

  const filterOptions = tenantData?.filters;

  const monthOptions =
    filterOptions?.period?.map(i => ({
      label: i.label,
      value: i.id,
    })) || [];

  const statusOptions =
    filterOptions?.tenantStatus?.map(i => ({
      label: i.label,
      value: i.id,
    })) || [];

  const sharingOptions =
    filterOptions?.sharingType?.map(i => ({
      label: i.label,
      value: i.id,
    })) || [];


  const applyTenantFilters = (
    month = selectedMonth,
    status = selectedStatus,
    sharing = selectedSharing
  ) => {

 const filters = {
  period: month || undefined,
  status: status.length ? status : undefined,
  sharingType: sharing.length ? sharing : undefined,
  page: 1,
  size: 10,
};

    console.log("filtervalues", filters);
    

    getTenantRegisterReport(activeHostelId, filters)
      .then(res => {
        if (res.success) {
          console.log("filterres", res);
          
          setTenantData(res.data);
        }
      });

  };

  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isExportAllow = isValidSubscription && canReadReports;


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

            <TouchableOpacity
              style={styles.monthBtn}
              onPress={() => {
                setTempMonth(selectedMonth);
                setMonthSheetOpen(true);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.monthText}> {selectedMonth
                  ? monthOptions.find(m => m?.value === selectedMonth)?.label
                  : "Select Month"}</Text>
                <Image
                  source={DownArrow}
                  style={{ width: 14, height: 14, marginLeft: 5 }}
                />
              </View>
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

            {/* STATUS */}
            <TouchableOpacity
              style={[
                styles.filterBtn,
                selectedStatus.length > 0 && styles.activeFilter
              ]}
              onPress={() => {
                setTempStatus(selectedStatus);
                setStatusSheetOpen(true);
              }}
            >
              <Text style={selectedStatus.length ? styles.activeFilterText : styles.filterText}>
                {selectedStatus.length === 0
                  ? "All"
                  : `${statusOptions.find(s => s.value === selectedStatus[0])?.label}
     ${selectedStatus.length > 1 ? `+${selectedStatus.length - 1} more` : ""}`
                }
              </Text>

              <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} />
            </TouchableOpacity>


            {/* SHARING TYPE */}
            <TouchableOpacity
              style={[
                styles.filterBtn,
                selectedSharing.length > 0 && styles.activeFilter
              ]}
              onPress={() => {
                setTempSharing(selectedSharing);
                setSharingSheetOpen(true);
              }}
            >
              <Text style={selectedSharing.length ? styles.activeFilterText : styles.filterText}>
                {selectedSharing.length === 0
                  ? "Type"
                  : `${sharingOptions.find(s => s.value === selectedSharing[0])?.label}
     ${selectedSharing.length > 1 ? `+${selectedSharing.length - 1} more` : ""}`
                }
              </Text>

              <Image source={DownArrow} style={{ width: 16, height: 16, marginLeft: 6 }} />
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
                <Text style={styles.emptyText}>No Tenants  are there!</Text>
              </View>
            )}


          </ScrollView>

        </View>

        <View style={styles.exportWrapper}>
          <TouchableOpacity
            //  style={styles.exportBtn} 
            style={[styles.exportBtn, !isExportAllow && { opacity: 0.4 }]}
            disabled={!isExportAllow}
            onPress={handleDownloadReport}>
            <Text style={styles.exportText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>

      <FilterBottomSheet
        visible={monthSheetOpen}
        title="Select Period"
        options={monthOptions}
        selectedValues={tempMonth ? [tempMonth] : []}
        setSelectedValues={(val) => setTempMonth(val[0])}
        isSingleSelect={true}
        onReset={() => {
          setTempMonth("");
          setSelectedMonth("");
          setMonthSheetOpen(false);
          applyTenantFilters("", selectedStatus, selectedSharing);
        }}
        onApply={() => {
          setSelectedMonth(tempMonth);
          setMonthSheetOpen(false);
          applyTenantFilters(tempMonth, selectedStatus, selectedSharing);
        }}
        onClose={() => setMonthSheetOpen(false)}
      />


      <FilterBottomSheet
        visible={statusSheetOpen}
        title="Tenant Status"
        options={statusOptions}
        selectedValues={tempStatus}
        setSelectedValues={setTempStatus}
        onReset={() => {
          setTempStatus([]);
          setSelectedStatus([]);
          setStatusSheetOpen(false);
          applyTenantFilters(selectedMonth, [], selectedSharing);
        }}
        onApply={() => {
          setSelectedStatus(tempStatus);
          setStatusSheetOpen(false);
          applyTenantFilters(selectedMonth, tempStatus, selectedSharing);
        }}
        onClose={() => setStatusSheetOpen(false)}
      />


      <FilterBottomSheet
        visible={sharingSheetOpen}
        title="Sharing Type"
        options={sharingOptions}
        selectedValues={tempSharing}
        setSelectedValues={setTempSharing}
        onReset={() => {
          setTempSharing([]);
          setSelectedSharing([]);
          setSharingSheetOpen(false);
          applyTenantFilters(selectedMonth, selectedStatus, []);
        }}
        onApply={() => {
          setSelectedSharing(tempSharing);
          setSharingSheetOpen(false);
          applyTenantFilters(selectedMonth, selectedStatus, tempSharing);
        }}
        onClose={() => setSharingSheetOpen(false)}
      />


    </>
  );
};

export default TenantRegister;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android"
      ? StatusBar.currentHeight + 10
      : 20,
    backgroundColor: "#fff",
  },


  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 6
  },
  monthBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
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
    padding: Platform.OS === "android" ? 16 : 1,
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 2,
    marginBottom: 4
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
    flexDirection: "row", justifyContent: "center", alignItems: "center"
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
