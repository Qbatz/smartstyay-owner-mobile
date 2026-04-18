import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image, ScrollView, TextInput,
} from "react-native";
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { StatusBar, Platform } from "react-native";
import { Switch } from "react-native-switch";
import { useHasPermission } from "../../../Utils/useHasPermission";
import { CommonContexts } from "../../../Context/CommonContext";
import { UseSetting } from "../../../Context/SettingContext";
import { PGContext } from "../../../Context/PGContext";
import { useFocusEffect } from "@react-navigation/native";
import EmptyState from "../../../Assets/Images/Empty_state.png"
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import ArrowDown from "../../../Assets/Images/direction-downIcon.png";
import EditIcon from "../../../Assets/Images/Edit_Configure.png";
import GracePeriodIcon from "../../../Assets/Images/GraceperiodIocn.png";
import OverdueIcon from "../../../Assets/Images/DuedayIcon.png";
import CloseIcon from "../../../Assets/Images/Close_Icon.png";
import Loader from "../../../Component/Loader/Loader"
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";
import EmptyElectricity from "../../../Assets/Images/Empty_complaint.png"




export default function SettingsElecticity({ navigation }) {

    const { activeHostelId } = useContext(CommonContexts);
      const { getElectricity, updateElectricity, changeRoomHostelElectricity, loading , NewupdateElectricityRule } = UseSetting();
      const { getParticularHostelDetails, PGDetails } = useContext(PGContext);

       const [ebunitList, setEbUnitList] = useState("")

       const [billingType, setBillingType] = useState("hostel"); 
// hostel | room | flat

const [flatType, setFlatType] = useState("included"); 
// included | fixed

const [costPerUnit, setCostPerUnit] = useState("");
const [monthlyCharge, setMonthlyCharge] = useState("");
 const [unitErr, setUnitErr] = useState("")
 const [monthlyChargeErr, setMonthlyChargeErr] = useState("")

       console.log("ebunit", ebunitList);
       


    const [billingMethod, setBillingMethod] = useState("fixed");
    const [billingstartDate, setBillingStartDate] = useState(null);
    const [gracedate, setGraceDate] = useState(null);
    const [duedate, setDueDate] = useState(null);
    const [noticePeriod, setNoticePeriod] = useState(null);
    const [billingData, setBillingData] = useState(null)
    

    const [openPicker, setOpenPicker] = useState(false);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openGracePeriod, setOpenGracePeriod] = useState(false);
    const [openDueWithin, setOpenDueWithin] = useState(false);
    const [openNoticeDays, setOpenNoticeDays] = useState(false);

    const [reminderDays, setReminderDays] = useState([]);
    const [openReminder, setOpenReminder] = useState(false);


    const [billingSchedule, setBillingSchedule] = useState("PREPAID");

    const [isConfigured, setIsConfigured] = useState(false);
    const [lateFeeEnabled, setLateFeeEnabled] = useState(false);

    const [lateFeeType, setLateFeeType] = useState("flat");
    const [slabs, setSlabs] = useState([
        { id: 1, from: "", to: "", amount: "" }
    ]);

    const [openFromPicker, setOpenFromPicker] = useState(null);
    const [openToPicker, setOpenToPicker] = useState(null);

    const [errors, setErrors] = useState({});
    const [initialValues, setInitialValues] = useState({});

    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [modalType, setModalType] = useState("success");


    
  useEffect(() => {
    if (!activeHostelId) return;
    loadElectricity(activeHostelId);
  }, [activeHostelId]);


  const loadElectricity = async (id) => {
    const res = await getElectricity(id);

    console.log("response", res);


    if (!res || res.success === false || !res.data) {
      setEbUnitList(null);
      return;
    }

    setEbUnitList(res.data);
  };



    

  useEffect(() => {
    if (activeHostelId) {
      getParticularHostelDetails(activeHostelId);
    }
  }, [activeHostelId])

  useEffect(() => {
  if (!ebunitList) return;

  const {
    typeOfReading,
    chargerPerUnit,
    shouldIncludeInRent,
    flatCharge,
  } = ebunitList;

  // 🔹 Billing Type
  if (typeOfReading === "HOSTEL_READING") {
    setBillingType("hostel");
  } else if (typeOfReading === "ROOM_READING") {
    setBillingType("room");
  } else if (typeOfReading === "FLAT_RATE") {
    setBillingType("flat");
  }

  // 🔹 Cost per unit
  if (chargerPerUnit) {
    setCostPerUnit(String(chargerPerUnit));
  }

  // 🔹 Flat Type
  if (typeOfReading === "FLAT_RATE") {
    if (shouldIncludeInRent) {
      setFlatType("included");
    } else {
      setFlatType("fixed");
    }
  }

  // 🔹 Monthly charge
  if (flatCharge) {
    setMonthlyCharge(String(flatCharge));
  }

}, [ebunitList]);

    const {
        canWriteModule: canWriteBills,
        canReadModule: canReadRecurring,
    } = useHasPermission("Bills");

      const {
    canWriteModule: canWriteElectricity,
    canReadModule: canReadElectricity,
    canUpdateModule: canUpdateElectricity,
  } = useHasPermission("Electricity");





    useEffect(() => {

        if (billingData) {
            console.log("billingdata", billingData);
            

            const billingStart = billingData?.billStartDate
            const dueDate = billingData?.billDueDate
            const grace = billingData?.gracePeriod
            const reminders = billingData?.reminderDays || []
            const notice = billingData?.noticePeriod
            const billingschedule = billingData?.billingModel

            setBillingStartDate(billingStart)
            setDueDate(dueDate)
            setGraceDate(grace)
            setReminderDays(reminders)
            setNoticePeriod(notice)
            setBillingSchedule(billingschedule)

            setInitialValues({
                billingstartDate: billingStart,
                duedate: dueDate,
                gracedate: grace,
                reminderDays: reminders, 
                noticeperiod :notice,
                billingschedule: billingschedule
            })

        }

    }, [billingData])

    const [initialEB, setInitialEB] = useState({});

useEffect(() => {
  if (!ebunitList) return;

  setInitialEB({
    billingType:
      ebunitList.typeOfReading === "HOSTEL_READING"
        ? "hostel"
        : ebunitList.typeOfReading === "ROOM_READING"
        ? "room"
        : "flat",

    costPerUnit: ebunitList.chargerPerUnit || "",
    flatType: ebunitList.shouldIncludeInRent ? "included" : "fixed",
    monthlyCharge: ebunitList.flatCharge || "",
  });

}, [ebunitList]);


 
const isChanged =
  initialEB.billingType !== billingType ||
  String(initialEB.costPerUnit) !== String(costPerUnit) ||
  initialEB.flatType !== flatType ||
  String(initialEB.monthlyCharge) !== String(monthlyCharge);

 



 const handleClose = () => {
  navigation.goBack()

  setUnitErr("")
  setMonthlyChargeErr("")
  setCostPerUnit("")
  setMonthlyCharge("")

 }

    

const handleSaveEB = async () => {

  setUnitErr("");            
  setMonthlyChargeErr("");
    let hasError = false

  const unitValue = Number(costPerUnit);

if (
  (billingType === "hostel" || billingType === "room") &&
  (!costPerUnit || isNaN(unitValue) || unitValue <= 0)
) {
  setUnitErr("Enter valid amount");
  hasError = true;
}

  const monthlyValue = Number(monthlyCharge);

if (
  billingType === "flat" &&
  flatType === "fixed" &&
  (!monthlyCharge || isNaN(monthlyValue) || monthlyValue <= 0)
) {
  setMonthlyChargeErr("Enter valid amount");
  hasError = true;
}

  if(hasError)return

  let payload = {};

  if (billingType === "hostel") {
    payload = {
      typeOfReading: "hostel",
      charge: Number(costPerUnit),
      shouldIncludeInRent: false,
      frequent: "MONTHLY", 
    };
  }

  if (billingType === "room") {
    payload = {
      typeOfReading: "room",
      charge: Number(costPerUnit),
      shouldIncludeInRent: false,
      frequent: "MONTHLY",
    };
  }

  if (billingType === "flat") {
    payload = {
      typeOfReading: "flat",
      charge:
        flatType === "fixed"
          ? Number(monthlyCharge)   // ✅ IMPORTANT
          : 0,
      shouldIncludeInRent: flatType === "included",
       frequent: "MONTHLY",
    };
  }

  console.log("FINAL PAYLOAD →", payload);

  const isChanged =
  initialEB.billingType !== billingType ||
  String(initialEB.costPerUnit) !== String(costPerUnit) ||
  initialEB.flatType !== flatType ||
  String(initialEB.monthlyCharge) !== String(monthlyCharge);

if (!isChanged) {
  setModalType("warning");
  setMessage("No changes detected");
  setShowSuccess(true);

  setTimeout(() => {
    setShowSuccess(false);
  }, 1200);

  return;
}


  const res = await NewupdateElectricityRule(activeHostelId, payload);

  if (res?.success) {
    setModalType("success");
    setMessage("Electricity Updated Successfully");
    setShowSuccess(true);

    loadElectricity(activeHostelId);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1200);
  } else {
    setModalType("warning");
    setMessage(res?.data || "Something went wrong");
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1200);
  }
};


   
   console.log("duedate", duedate);

   
  const isValidSubscription = PGDetails?.isSubscriptionActive;
  const isSubscriptionAllow = isValidSubscription && canWriteElectricity;
   
   

    return (

        <>
            {loading && <Loader />}
            <SuccessModal
                visible={showSuccess}
                message={message}
                type={modalType}
            />
            <SafeAreaView style={styles.container}>

               
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={ArrowLeft} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Electricity Rule</Text>
                </View>
         
                 {!canReadElectricity && !loading && (
           <View style={styles.emptyContainer}>
             <Image source={EmptyElectricity} style={styles.emptyImg} />
             <Text style={styles.emptyTitle}>
               You do not have access to view Electricity
             </Text>
           </View>
         )}

         {canReadElectricity && (

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"  
    >
                   
                    <View style={styles.card}>

                        <Text style={styles.sectionTitle}>Electricity Calculation Type</Text>
                        <Text style={styles.sectionSub}>
                           Choose how electricity charges should be calculated for tenants
                        </Text>

                        {/* Monthly Recurring */}
                        <TouchableOpacity
                            style={styles.radioRow}
                            onPress={() => setBillingType("hostel")}
                        >
                            <View style={styles.radioTextContainer}>
                                <Text style={styles.radioTitle}>Hostel Based</Text>
                                <Text style={styles.radioSub}>
                                   Electricity cost is shared across all tenants based on total usage
                                </Text>
                            </View>

                            <View style={styles.radioOuter}>
                                {billingType === "hostel" && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

                        {/* Tenant Joining */}

                        <TouchableOpacity
                            style={styles.radioRow}
                            onPress={() => setBillingType("room")}
                            // onPress={() => setBillingMethod("joining")}
                        >
                            <View style={styles.radioTextContainer}>
                                <Text style={styles.radioTitle}>Room Based</Text>
                                <Text style={styles.radioSub}>
                                    Electricity is calculated based on individual room usage
                                </Text>
                            </View>

                            <View style={styles.radioOuter}>
                                {billingType === "room" && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

 <TouchableOpacity
                            style={styles.radioRow}
                            onPress={() => setBillingType("flat")}
                            // onPress={() => setBillingMethod("joining")}
                        >
                            <View style={styles.radioTextContainer}>
                                <Text style={styles.radioTitle}>Flat Rate (Included in Rent)</Text>
                                <Text style={styles.radioSub}>
                                   Fixed electricity pricing not based on actual usage
                                </Text>
                            </View>

                            <View style={styles.radioOuter}>
                                {billingType === "flat" && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>


                    </View>

                  
                    <View style={styles.card}>

                        <Text style={styles.sectionTitle}>Configuration</Text>
                        <Text style={styles.sectionSub}>Defines the monthly rent period.</Text>

                       

                 {(billingType === "hostel" || billingType === "room") && (
  <>
    <Text style={styles.label}>Cost per Unit (₹)</Text>
    <TextInput
      style={styles.dropdown}
      keyboardType="numeric"
      placeholder="₹"
      value={costPerUnit}
      // onChangeText={(t)=> {
      //   setCostPerUnit(t)
      //   setUnitErr("")
      // }}

                onChangeText={(text) => {
  let cleaned = text.replace(/[^0-9]/g, "");

  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts[1];
  }
  

  setCostPerUnit(cleaned);

  const num = Number(cleaned);

  if (cleaned && !isNaN(num) && num > 0) {
    setUnitErr("");
  }

   if (cleaned && (isNaN(num) || num <= 0)) {
    setUnitErr("Enter valid Amount");
  }

 
}}
    />
    
  {unitErr && (
                <ErrorMessage message={unitErr} type="error" />
              )}
  </>
)}
                        

{billingType === "flat" && (
  <>
    <Text style={styles.sectionSub}>Set up flat rate electricity charges</Text>

    {/* Included in Rent */}
    <TouchableOpacity
      style={styles.radioRow}
      onPress={() => setFlatType("included")}
    >
      <View style={styles.radioTextContainer}>
                                <Text style={styles.radioTitle}>Included in Rent</Text>
                                <Text style={styles.radioSub}>
                                  No separate electricity charge applied
                                </Text>
                            </View>
      <View style={styles.radioOuter}>
        {flatType === "included" && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>

    {/* Fixed Monthly */}
    <TouchableOpacity
      style={styles.radioRow}
      onPress={() => setFlatType("fixed")}
    >
            <View style={styles.radioTextContainer}>
                                <Text style={styles.radioTitle}>Fixed Monthly Charge</Text>
                                <Text style={styles.radioSub}>
                                 Apply a fixed electricity charge every month
                                </Text>
                            </View>
     
      <View style={styles.radioOuter}>
        {flatType === "fixed" && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
    </>)}
                       


{flatType === "fixed" && billingType === "flat"   && (
  <>
    <Text style={styles.label}>Monthly Electricity Charge (₹)</Text>
    <TextInput
      style={styles.dropdown}
      keyboardType="numeric"
      placeholder="Enter Amount"
      value={monthlyCharge}
      // onChangeText={(t)=> {
      //   setMonthlyCharge(t)
      //   setMonthlyChargeErr("")
      // }}

          onChangeText={(text) => {
  let cleaned = text.replace(/[^0-9]/g, "");

  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts[1];
  }
  

  setMonthlyCharge(cleaned);

  const num = Number(cleaned);

  if (cleaned && !isNaN(num) && num > 0) {
    setMonthlyChargeErr("");
  }

   if (cleaned && (isNaN(num) || num <= 0)) {
    setMonthlyChargeErr("Enter valid Amount");

  }
 
}}
    />
      {monthlyChargeErr && (
                <ErrorMessage message={monthlyChargeErr} type="error" />
              )}

    <Text style={styles.helper}>
      Fixed amount charged monthly regardless of usage
    </Text>
  </>
)}

{flatType === "included" && billingType === "flat"   && (
         <Text style={styles.helper}>Electricity charges will not depend on usage. No separate charge will be applied</Text>              

)}


                    </View>


                   


                  

              
                 
                   


                    <View style={styles.bottomRow}>
                        <TouchableOpacity style={styles.discardBtn} onPress={handleClose}>
                            <Text style={styles.discardText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                         style={[styles.saveChangesBtn, !isSubscriptionAllow && { opacity: 0.4 }]}
                         disabled={!isSubscriptionAllow}
                            onPress={handleSaveEB}

                        >
                            <Text style={styles.saveText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>


                </ScrollView>
                  </TouchableWithoutFeedback>
</KeyboardAvoidingView>
         )}

            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F4F6F8",
        paddingHorizontal: 16
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 20,
        marginBottom: 20
    },

    backIcon: {
        width: 20,
        height: 20,
        marginRight: 10
    },

    headerTitle: {
        fontSize: 20,
        fontFamily: "Gilroy-Medium"
    },

    card: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 10,
        marginBottom: 18,
        elevation: 2,
        shadowColor: "#0000000D",
    },

    sectionTitle: {
        fontSize: 18,
        fontFamily: "Gilroy-Medium"
    },

    sectionSub: {
        fontSize: 14,
        color: "#4B4B4B",
        marginTop: 4,
        marginBottom: 12,
        fontFamily: "Gilroy-Regular"
    },

    radioRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10
    },

    radioRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: 16
    },

    radioTextContainer: {
        flex: 1,
        paddingRight: 12
    },

    radioTitle: {
        fontSize: 16,
        fontFamily: "Gilroy-Semibold",
        marginBottom: 4
    },

    radioSub: {
        fontSize: 13,
        color: "#777",
        lineHeight: 23,
        fontFamily: "Gilroy-Regular"
    },

    radioActive: {
        width: 18,
        height: 18,
        borderRadius: 10,
        backgroundColor: "#2F5BFF"
    },

    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#2F5BFF",
        alignItems: "center",
        justifyContent: "center"
    },

    radioInner: {
        width: 11,
        height: 11,
        borderRadius: 6,
        backgroundColor: "#2F5BFF"
    },

    label: {
        marginTop: 14,
        fontSize: 14,
        fontFamily: "Gilroy-Medium"
    },

    dropdown: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between'
    },

    dropdownDisabled: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#F2F2F2"
    },

    dropdownText: {
        color: "#555",
        fontFamily: "Gilroy-Regular"
    },

    helper: {
        fontSize: 12,
        color: "#616161",
        marginTop: 8,
        fontFamily: "Gilroy-Medium"
    },

    dateGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        borderWidth: 0.9,
        borderColor: "#0000000D",
        borderRadius: 10,
        padding: 10
    },

    dateItem: {
        width: "20%",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 4,
        // margin:5
        // padding:4
    },

    dateSelected: {
        backgroundColor: "#2F5BFF",
        borderRadius: 20,
        padding: 4,
        fontFamily: "Gilroy-Medium"
    },

    dateText: {
        fontSize: 14,
        fontFamily: "Gilroy-Medium"
    },

    BtnRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
    ,
    saveBtn: {
        backgroundColor: "#2F5BFF",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 18,

    },

    saveText: {
        color: "#fff",
        fontFamily: "Gilroy-Semibold"
    },

    configRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20
    },


    configBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0FDF4",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8
    },

    configIcon: {
        color: "#2E7D32",
        fontSize: 12,
        marginRight: 5
    },

    configText: {
        color: "#008236",
        fontSize: 12,
        fontFamily: "Gilroy-Medium"
    },

    editBtn: {
        flexDirection: "row",
        alignItems: "center"
    },

    editIcon: {
        // color:"#2F5BFF",
        height: 18, width: 18,
        marginRight: 6
    },

    editText: {
        color: "#2F5BFF",
        fontFamily: "Gilroy-Medium"
    },
    infoText: {
        color: "#1E45E1",
        fontSize: 13,
        fontFamily: "Gilroy-Medium"
    },

    warningText: {
        color: "#E27625",
        fontSize: 13,
        fontFamily: "Gilroy-Medium"

    },

    reminderRow: {
        flexDirection: "row",
        marginTop: 10
    },

    reminderChip: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#E6E6E6",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
        margin: 5
    },

    lateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    bottomRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 70,
        gap: 10,
    },

    discardBtn: {
        borderWidth: 1,
        borderColor: "#ddd",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8
    },

    discardText: {
        fontFamily: "Gilroy-Medium"
    },

    saveChangesBtn: {
        backgroundColor: "#2F5BFF",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8
    },
    tierHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15
    },

    tierTitle: {
        fontSize: 12,
        color: "#777",
        fontFamily: "Gilroy-Medium"
    },

    tierRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    dropdownSmall: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        width: "48%",
        alignItems: "center"
    },

    addSlab: {
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#2F5BFF",
        padding: 10,
        borderRadius: 8,
        alignItems: "center"
    },
      emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyImg: { width: 200, height: 160, marginBottom: 10 },
  emptyTitle: { fontSize: 16, color: "#444", marginBottom: 15 },


});