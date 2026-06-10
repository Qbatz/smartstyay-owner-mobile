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
  const { getElectricity, updateElectricity, changeRoomHostelElectricity, loading, NewupdateElectricityRule } = UseSetting();
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
        noticeperiod: notice,
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

    if (hasError) return

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

        {/* {!activeHostelId && !loading && (
          <View style={styles.emptyContainer}>
            <Image source={EmptyElectricity} style={styles.emptyImg} />
            <Text style={styles.emptyTitle}>
              You do not have access to view Electricity
            </Text>
          </View>
        )} */}

        {canReadElectricity &&   (

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingBottom: 40,
                }}
              >

                <View style={styles.card}>

                  <Text style={styles.sectionTitle}>Electricity Calculation Type</Text>
                  <Text style={styles.sectionSub}>
                    Choose how electricity charges should be calculated for tenants
                  </Text>

                  {/* Monthly Recurring */}
                  <TouchableOpacity
                    style={[
                      styles.radioRow,
                      billingType === "hostel" && styles.radioRowSelected
                    ]}
                    onPress={() => setBillingType("hostel")}
                  >

                    <View
                      style={[
                        styles.radioOuter,
                        billingType === "hostel"
                          ? styles.radioOuterActive
                          : styles.radioOuterInactive
                      ]}
                    >
                      {billingType === "hostel" && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <View style={styles.radioTextContainer}>
                      <Text style={styles.radioTitle}>Hostel Based</Text>
                      <Text style={styles.radioSub}>
                        Electricity cost is shared across all tenants based on total usage
                      </Text>
                    </View>


                  </TouchableOpacity>

                  {/* Tenant Joining */}

                  <TouchableOpacity
                    style={[
                      styles.radioRow,
                      billingType === "room" && styles.radioRowSelected
                    ]}
                    onPress={() => setBillingType("room")}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        billingType === "room"
                          ? styles.radioOuterActive
                          : styles.radioOuterInactive
                      ]}
                    >
                      {billingType === "room" && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <View style={styles.radioTextContainer}>
                      <Text style={styles.radioTitle}>Room Based</Text>
                      <Text style={styles.radioSub}>
                        Electricity is calculated based on individual room usage
                      </Text>
                    </View>


                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.radioRow,
                      billingType === "flat" && styles.radioRowSelected
                    ]}
                    onPress={() => setBillingType("flat")}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        billingType === "flat"
                          ? styles.radioOuterActive
                          : styles.radioOuterInactive
                      ]}
                    >
                      {billingType === "flat" && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <View style={styles.radioTextContainer}>
                      <Text style={styles.radioTitle}>Flat Rate (Included in Rent)</Text>
                      <Text style={styles.radioSub}>
                        Fixed electricity pricing not based on actual usage
                      </Text>
                    </View>


                  </TouchableOpacity>


                </View>


                <View style={styles.card}>

                  <Text style={styles.sectionTitle}>Configuration</Text>
   {(billingType === "hostel" || billingType === "room") && (

                  <Text style={styles.sectionSub}>Defines the monthly rent period.</Text>

   )}

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
                          let cleaned = text.replace(/[^0-9.]/g, "");

                          const parts = cleaned.split(".");

                          if (parts.length > 2) {
                            cleaned = parts[0] + "." + parts[1];
                          }

                          if (parts[1]?.length > 2) {
                            cleaned = parts[0] + "." + parts[1].slice(0, 2);
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
                      <Text style={styles.sectionSub}>Rate charged per electricity unit</Text>

                      {unitErr && (
                        <ErrorMessage message={unitErr} type="error" />
                      )}
                    </>
                  )}


                  {billingType === "flat" && (
                     <View style={styles.flatConfigWrapper}>
                      <Text style={styles.sectionSub}>Set up flat rate electricity charges</Text>

                      {/* Included in Rent */}
                      <TouchableOpacity
                            style={[
                      styles.radioRow,
                      flatType === "included" && styles.radioRowSelected
                    ]}
                    onPress={() => setFlatType("included")}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            flatType === "included"
                              ? styles.radioOuterActive
                              : styles.radioOuterInactive
                          ]}
                        >
                          {flatType === "included" && (
                            <View style={styles.radioInner} />
                          )}
                        </View>

                        <View style={styles.radioTextContainer}>
                          <Text style={styles.radioTitle}>Included in Rent</Text>
                          <Text style={styles.radioSub}>
                            No separate electricity charge applied
                          </Text>
                        </View>
                        {/* <View style={styles.radioOuter}>
                          {flatType === "included" && <View style={styles.radioInner} />}
                        </View> */}


                      </TouchableOpacity>

                      {/* Fixed Monthly */}
                      <TouchableOpacity
                        // style={styles.radioRow}
                        // onPress={() => setFlatType("fixed")}
                                style={[
                      styles.radioRow,
                      flatType === "fixed" && styles.radioRowSelected
                    ]}
                    onPress={() => setFlatType("fixed")}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            flatType === "fixed"
                              ? styles.radioOuterActive
                              : styles.radioOuterInactive
                          ]}
                        >
                          {flatType === "fixed" && (
                            <View style={styles.radioInner} />
                          )}
                        </View>

                        <View style={styles.radioTextContainer}>
                          <Text style={styles.radioTitle}>Fixed Monthly Charge</Text>
                          <Text style={styles.radioSub}>
                            Apply a fixed electricity charge every month
                          </Text>
                        </View>

                        {/* <View style={styles.radioOuter}>
                          {flatType === "fixed" && <View style={styles.radioInner} />}
                        </View> */}


                      </TouchableOpacity>
                   
                    </View>
                    )
                    }



                  {flatType === "fixed" && billingType === "flat" && (
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

                          let cleaned = text.replace(/[^0-9.]/g, "");

                          const parts = cleaned.split(".");

                          if (parts.length > 2) {
                            cleaned = parts[0] + "." + parts[1];
                          }

                          if (parts[1]?.length > 2) {
                            cleaned = parts[0] + "." + parts[1].slice(0, 2);
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
                   <View style={{display:'flex', flexDirection:'row', alignItems:'center',marginTop: 8, }}>
                   <Image source={GracePeriodIcon} style={{height:12, width:12 , alignItems:'center', marginRight:8}}/>
                      <Text style={styles.helper}>
                  
                        Fixed amount charged monthly regardless of usage
                      </Text>
                      </View>
                    </>
                  )}

                  {flatType === "included" && billingType === "flat" && (
                     <View style={{display:'flex', flexDirection:'row', alignItems:'center',marginTop: 8, }}>
                   <Image source={GracePeriodIcon} style={{height:12, width:12 , alignItems:'center', marginRight:8}}/>
                      <Text style={styles.helper}>
                  
                    Electricity charges will not depend on usage. No separate charge will be applied
                      </Text>
                      </View>
                    // <Text style={styles.helper}>Electricity charges will not depend on usage. No separate charge will be applied</Text>

                  )}


                </View>








<View style={styles.previewCard}>

  <Image
    source={GracePeriodIcon}
    style={styles.previewIcon}
  />

  <Text style={styles.previewTitle}>
    Billing preview
  </Text>

  <Text style={styles.previewSub}>
    This is a sample invoice preview
  </Text>

  {/* HOSTEL */}
  {billingType === "hostel" && (
    <>
      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>
          Electricity Bill <Text style={styles.previewTag}>(Hostel)</Text>
        </Text>

        <Text style={styles.previewAmount}>
          ₹6,000
        </Text>
      </View>

      <View style={styles.previewDivider} />

      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>
          Tenants x 30
        </Text>

        <Text style={styles.previewAmount}>
          ₹200
        </Text>
      </View>
    </>
  )}

  {/* ROOM */}
  {billingType === "room" && (
    <>
      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>
          Electricity Bill <Text style={styles.previewTag}>(Room wise)</Text>
        </Text>

        <Text style={styles.previewAmount}>
          ₹900
        </Text>
      </View>

      <View style={styles.previewDivider} />

      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>
          Tenants x 3
        </Text>

        <Text style={styles.previewAmount}>
          ₹300
        </Text>
      </View>
    </>
  )}

  {/* FLAT INCLUDED */}
  {billingType === "flat" && flatType === "included" && (
    <>
      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>
          Room Rent
        </Text>

        <Text style={styles.previewAmount}>
          ₹5,000
        </Text>
      </View>

      <View style={styles.previewDivider} />

      <View style={styles.previewRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.previewLabel}>
            Electricity
          </Text>

          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>
              No Charge
            </Text>
          </View>
        </View>

        <Text style={styles.previewAmount}>
          ₹0
        </Text>
      </View>

      <View style={styles.previewDivider} />

      <View style={styles.previewRow}>
        <Text style={styles.totalLabel}>
          Total
        </Text>

        <Text style={styles.totalAmount}>
          ₹5,000
        </Text>
      </View>
    </>
  )}

  {/* FLAT FIXED */}
  {billingType === "flat" && flatType === "fixed" && (
    <>
      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>
          Room Rent
        </Text>

        <Text style={styles.previewAmount}>
          ₹5,000
        </Text>
      </View>

      <View style={styles.previewDivider} />

      <View style={styles.previewRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.previewLabel}>
            Electricity
          </Text>

          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>
              Fixed Charge
            </Text>
          </View>
        </View>

        <Text style={styles.previewAmount}>
          ₹{monthlyCharge || 350}
        </Text>
      </View>

      <View style={styles.previewDivider} />

      <View style={styles.previewRow}>
        <Text style={styles.totalLabel}>
          Total
        </Text>

        <Text style={styles.totalAmount}>
          ₹{5000 + Number(monthlyCharge || 350)}
        </Text>
      </View>
    </>
  )}

  <View style={styles.previewFooter}>
    <Text style={styles.previewFooterText}>
      Preview calculation based on current settings
    </Text>
  </View>

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
    backgroundColor: "#fff",
    // paddingHorizontal: 16
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 20,
    marginBottom: 20,
    paddingHorizontal: 16,
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
    // backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginBottom: 18,
    // borderWidth: 1,
    // borderColor: "#F1F5F9",
  },



  sectionTitle: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Gilroy-Semibold",
  },
  sectionSub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 26,
    marginBottom: 5,
    fontFamily: "Gilroy-Regular",
  },

  // radioRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginTop: 10
  // },
  radioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    marginTop: 14,
    backgroundColor: "#FFFFFF",
  },

  // radioRow: {
  //   flexDirection: "row",
  //   alignItems: "flex-start",
  //   justifyContent: "space-between",
  //   marginTop: 16
  // },

  radioRowSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },

  radioTextContainer: {
    flex: 1,
    // paddingRight: 12
  },

  radioTitle: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Gilroy-Semibold",
    marginBottom: 8,
  },

  radioSub: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
    fontFamily: "Gilroy-Regular",
  },

  radioActive: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: "#2F5BFF"
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  radioOuterActive: {
    borderColor: "#2563EB",
  },

  radioOuterInactive: {
    borderColor: "#D1D5DB",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },

  label: {
    marginTop: 14,
    fontSize: 14,
    fontFamily: "Gilroy-Medium"
  },

  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
    fontSize: 18,
    color: "#111827",
    backgroundColor: "#FFFFFF",
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
    // marginTop: 8,
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
  emptyTitle: { fontSize: 16, color: "#444", marginBottom: 15 ,   fontFamily: "Gilroy-Regular",},

flatConfigWrapper: {
  borderLeftWidth: 4,
  borderLeftColor: "#2563EB",
  paddingLeft: 18,
  marginTop: 12,
  marginLeft: 2,
  paddingVertical: 4,
},

previewCard: {
  marginTop: 24,
  marginBottom: 28,
  borderRadius: 28,
  padding: 24,
  overflow: "hidden",
  backgroundColor: "#0F0B8F",
},

previewIcon: {
  width: 28,
  height: 28,
  tintColor: "#C7D2FE",
  marginBottom: 20,
},

previewTitle: {
  fontSize: 22,
  color: "#FFFFFF",
  fontFamily: "Gilroy-Bold",
},

previewSub: {
  fontSize: 16,
  color: "#A5B4FC",
  marginTop: 10,
  marginBottom: 28,
  fontFamily: "Gilroy-Regular",
},

previewRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 10,
},

previewLabel: {
  fontSize: 18,
  color: "#FFFFFF",
  fontFamily: "Gilroy-Medium",
},

previewTag: {
  color: "#C7D2FE",
  fontStyle: "italic",
},

previewAmount: {
  fontSize: 18,
  color: "#FFFFFF",
  fontFamily: "Gilroy-Bold",
},

previewDivider: {
  height: 1,
  backgroundColor: "rgba(255,255,255,0.12)",
  marginVertical: 10,
},

previewBadge: {
  backgroundColor: "#FFFFFF",
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 10,
  marginLeft: 10,
},

previewBadgeText: {
  color: "#374151",
  fontSize: 14,
  fontFamily: "Gilroy-Medium",
},

totalLabel: {
  fontSize: 22,
  color: "#FFFFFF",
  fontFamily: "Gilroy-Semibold",
},

totalAmount: {
  fontSize: 24,
  color: "#FFFFFF",
  fontFamily: "Gilroy-Bold",
},

previewFooter: {
  marginTop: 28,
  backgroundColor: "rgba(255,255,255,0.22)",
  borderRadius: 14,
  paddingVertical: 16,
  paddingHorizontal: 18,
},

previewFooterText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontFamily: "Gilroy-Regular",
},
});