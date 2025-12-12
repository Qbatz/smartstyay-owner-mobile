import React, { useState, useContext, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView } from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";

export default function LongStayRecurring({ navigation }) {
  const { addBillingRecurring, getBillingConfig } = UseSetting();
  const { activeHostelId } = useContext(CommonContexts);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const billingDays = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const [billingOpen, setBillingOpen] = useState(false);
  const [selectedBillingDay, setSelectedBillingDay] = useState("");
  const dueDays = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const [dueOpen, setDueOpen] = useState(false);
  const [selectedDueDay, setSelectedDueDay] = useState("");

  const noticeDays = Array.from({ length: 30 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState("");
  const [BillingDateError, setBillingDateError] = useState("")
  const [dueDateError, setDueDateError] = useState("")
  const [noticeError, setNoticeError] = useState("")


  const handleSave = async () => {
  let hasError = false;

    if (!selectedBillingDay) {
      setBillingDateError("Please select billing date");
   hasError = true;
    }

    if (!selectedDueDay) {
      setDueDateError("Please select due date");
hasError = true;
    }

    if (!selectedNotice) {
      setNoticeError("Please select notice period");
hasError = true;
    }
      if (hasError) return;


    const payload = {
      hostelId: activeHostelId,
      startDate: Number(selectedBillingDay),
      dueDate: Number(selectedDueDay),
      noticeDays: Number(selectedNotice),
    };

    console.log("📤 Sending Payload →", payload);

    const res = await addBillingRecurring(payload);

    if (res.success) {
      setModalType("success");
      setMessage("Saved Successfully");
      setShowSuccess(true);

      await getBillingConfig(activeHostelId);

      setTimeout(() => {
        setShowSuccess(false);
        navigation.goBack();
      }, 1200);

    } else {
      setModalType("error");
      setMessage(res.data?.message || "Save Failed");
      setShowSuccess(true);
    }
  };


  // const handleSave = async () => {

  //   if (!selectedBillingDay) {
  //     setMessage("Please select billing date");
  //     setModalType("error");
  //     setShowSuccess(true);
  //     return;
  //   }

  //   if (!selectedDueDay) {
  //     setMessage("Please select due date");
  //     setModalType("error");
  //     setShowSuccess(true);
  //     return;
  //   }

  //   if (!selectedNotice) {
  //     setMessage("Please select notice period");
  //     setModalType("error");
  //     setShowSuccess(true);
  //     return;
  //   }

  //   const payload = {
  //     hostelId: activeHostelId,
  //     startDate: Number(selectedBillingDay),
  //     dueDate: Number(selectedDueDay),
  //     noticeDays: Number(selectedNotice),
  //   };

  //   console.log("📤 Sending Payload →", payload);

  //   const res = await addBillingRecurring(payload);

  //   if (res.success) {
  //     setModalType("success");
  //     setMessage("Saved Successfully");
  //     setShowSuccess(true);

  //     setTimeout(() => {
  //       setShowSuccess(false);
  //       navigation.goBack();
  //     }, 1500);

  //   } else {
  //     setModalType("error");
  //     setMessage(res.data?.message || "Save Failed");
  //     setShowSuccess(true);
  //   }
  // };

  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}
      />

      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={ArrowLeft} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Long stay Recurring</Text>
        </View>


        <Text style={styles.label}>Billing Date Of Month *</Text>

        <TouchableOpacity
          style={styles.dropdownBox}
          onPress={() => setBillingOpen(!billingOpen)}
        >
          <Text style={{ color: selectedBillingDay ? "#000" : "#9CA3AF" }}>
            {selectedBillingDay || "Select Billing Date"}
          </Text>

          <Image
            source={DownArrow}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        {billingOpen && (
          <View style={styles.billingDropdownMenu}>
            <ScrollView style={{ maxHeight: 180 }}>
              {billingDays.map((d, index) => {
                const isSelected = d === selectedBillingDay;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.billingOption,
                      isSelected && styles.billingOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedBillingDay(d);
                      setBillingOpen(false);
                      setBillingDateError("")
                    }}
                  >
                    <Text
                      style={[
                        styles.billingOptionText,
                        isSelected && styles.billingOptionTextSelected,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        {BillingDateError && (
          <ErrorMessage message={BillingDateError} type="error" />
        )}

        {/* Due Date */}
        <Text style={styles.label}>Due Date of Month</Text>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setDueOpen(!dueOpen)}
        >
          <Text style={{ color: selectedDueDay ? "#000" : "#9CA3AF" }}>
            {selectedDueDay || "Select Due Date of Month"}
          </Text>

          <Image
            source={DownArrow}
            style={styles.icon}
          />
        </TouchableOpacity>

        {dueOpen && (
          <View style={styles.dueDropdownMenu}>
            <ScrollView style={{ maxHeight: 180 }}>
              {dueDays.map((d, index) => {
                const isSelected = d === selectedDueDay;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dueOption,
                      isSelected && styles.dueOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedDueDay(d);
                      setDueOpen(false);
                      setDueDateError("")
                    }}
                  >
                    <Text
                      style={[
                        styles.dueOptionText,
                        isSelected && styles.dueOptionTextSelected,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        {dueDateError && (
          <ErrorMessage message={dueDateError} type="error" />
        )}

        <Text style={styles.label}>Notice Period</Text>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setNoticeOpen(!noticeOpen)}
        >
          <Text style={{ color: selectedNotice ? "#000" : "#9CA3AF" }}>
            {selectedNotice || "Select Notice Period"}
          </Text>

          <Image source={DownArrow} style={styles.icon} />
        </TouchableOpacity>

        {noticeOpen && (
          <View style={styles.noticeDropdownMenu}>
            <ScrollView style={{ maxHeight: 180 }}>
              {noticeDays.map((day, index) => {
                const isSelected = selectedNotice === day;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.noticeOption,
                      isSelected && styles.noticeOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedNotice(day);
                      setNoticeOpen(false);
                      setNoticeError("")
                    }}
                  >
                    <Text
                      style={[
                        styles.noticeOptionText,
                        isSelected && styles.noticeOptionTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        {noticeError && (
          <ErrorMessage message={noticeError} type="error" />
        )}

        {/* Button Row */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 40 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backIcon: { width: 20, height: 20, marginRight: 10 },

  headerTitle: { fontSize: 20, fontWeight: "700" },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },

  inputBox: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "space-between",
    marginBottom: 12,
  },

  placeholder: {
    color: "#A0A0A0",
    fontSize: 14,
  },

  icon: { width: 20, height: 20, tintColor: "#8C8C8C" },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  cancelBtn: {
    backgroundColor: "#F3F3F3",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },

  cancelText: {
    color: "#555",
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: "#1D5BEE",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },


  dropdownBox: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  arrowIcon: {
    width: 18,
    height: 18,
    tintColor: "#6A6A6A",
  },

  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  dropdownText: {
    fontSize: 15,
  },

  textarea: {
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    height: 110,
    textAlignVertical: "top",
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 30,
  },

  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },

  cancelText: {
    fontSize: 16,
    color: "#656565",
  },

  addBtn: {
    backgroundColor: "#1D5BEE",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  addText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dropdownMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "20%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    zIndex: 999,
    elevation: 10,
  },




  billingDropdownMenu: {
    position: "absolute",
    top: 190,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 999,
    elevation: 8,
  },


  billingOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  billingOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  billingOptionText: {
    fontSize: 15,
    color: "#111827",
  },

  billingOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  dueDropdownMenu: {
    position: "absolute",
    top: 280,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 999,
    elevation: 8,
  },


  dueOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  dueOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  dueOptionText: {
    fontSize: 15,
    color: "#111827",
  },

  dueOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  noticeDropdownMenu: {
    position: "absolute",
    top: 380,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 999,
    elevation: 8,
  },


  noticeOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  noticeOptionSelected: {
    backgroundColor: "#1D5BEE",
  },

  noticeOptionText: {
    fontSize: 15,
    color: "#111",
  },

  noticeOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },



});
