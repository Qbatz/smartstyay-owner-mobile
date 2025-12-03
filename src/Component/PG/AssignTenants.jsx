import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView
} from "react-native";
import Delete from "../../Assets/Images/remove.png";
import DownArrow from "../../Assets/Images/direction-down.png";
import DatePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";


export default function AssignTenant({ navigation, route }) {
  const { roomNo, bedId } = route.params || {};



  const [activeTab, setActiveTab] = useState("Booking");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(dayjs());

  const [openJoinDatePic, setOpenJoinDatePic] = useState("");
  const [joiningDate, setJoiningDate] = useState(dayjs());

  const [openCheckJoinDatePic, setOpenCheckJoinDatePic] = useState("");
  const [checkJoiningDate, setcheckJoiningDate] = useState(dayjs());
  const [tenant, setTenant] = useState("");
  const [stayType, setStayType] = useState("");

  const [bookingAmount, setBookingAmount] = useState("");
  const [rentalAmount, setRentalAmount] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");

  const [extraCharges, setExtraCharges] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [disabledTypes, setDisabledTypes] = useState([]);
  const BookingTenants = ["priya", "Allwin", "Mathu", "Arputha", "Hepzi"];
  const [BookingTenantsOpen, setBookingTenantsopen] = useState(false);
  const [BookingTenantsSelected, setBookTenantsSelected] = useState("Select Tenant");
  const CheckinTenants = ["priya", "Allwin", "Mathu", "Hepzi"];
  const [checkinTenantsOpen, setCheckinTenantsopen] = useState(false);
  const [CheckinTenantSelected, setCheckinTenantSelected] = useState("Select Tenant");


  const StayType = ["LongStay"];
  const [StayTypeOpen, setStayTypeOpen] = useState(false);
  const [StayTypeSelected, setStayTypeSelected] = useState("Stay Type");
  const maintenanceAlreadyUsed = extraCharges.some(c => c.type === "Maintenance");

  const TYPE_OPTIONS = ["Maintenance", "Others"];


  const addCharge = () => {
    setExtraCharges(prev => [
      ...prev,
      { id: Date.now(), type: "", title: "", amount: "" }
    ]);
  };

  const removeCharge = (id, type) => {
    setExtraCharges(prev => prev.filter(i => i.id !== id));

    if (type === "Maintenance") {
      setDisabledTypes([]);
    }
  };

  const selectType = (id, type) => {


    if (type === "Maintenance" && maintenanceAlreadyUsed) return;

    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, type, title: "", amount: "" } : i))
    );

    setOpenDropdownId(null);
  };





  const updateTitle = (id, title) => {
    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, title } : i))
    );
  };

  const updateAmount = (id, amount) => {
    setExtraCharges(prev =>
      prev.map(i => (i.id === id ? { ...i, amount } : i))
    );
  };



  return (
    <View style={styles.container}>


      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>← Assign Tenant</Text>
      </TouchableOpacity>

      <Text style={styles.roomText}>Room No {roomNo} | Bed {bedId}</Text>


      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Booking" && styles.tabActive]}
          onPress={() => setActiveTab("Booking")}
        >
          <Text style={[styles.tabText, activeTab === "Booking" && styles.tabTextActive]}>
            Booking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "CheckIn" && styles.tabActive]}
          onPress={() => setActiveTab("CheckIn")}
        >
          <Text style={[styles.tabText, activeTab === "CheckIn" && styles.tabTextActive]}>
            Check In
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>






          {activeTab === "Booking" && (
            <>
              <Text style={styles.label}>Select Tenant</Text>

              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  style={styles.select}
                  onPress={() => setBookingTenantsopen(!BookingTenantsOpen)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.selectText}>{BookingTenantsSelected}</Text>
                  <Image source={DownArrow} style={styles.arrow} />
                </TouchableOpacity>

                {BookingTenantsOpen && (
                  <View style={styles.dropdownMenuone}>
                    <ScrollView style={{ maxHeight: 160 }}>
                      {BookingTenants.map((v, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.option}
                          onPress={() => {
                            setBookTenantsSelected(v);
                            setBookingTenantsopen(false);
                          }}
                        >
                          <Text style={styles.optionText}>{v}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              <Text style={styles.label}>Booking Date</Text>
              <TouchableOpacity style={styles.dateBox} onPress={() => setOpenDatePicker(true)}>
                <Text style={styles.placeholder}>
                  {purchaseDate ? dayjs(purchaseDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                </Text>
                <Image
                  source={require("../../Assets/Images/calendar.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>

              <Text style={styles.label}>Booking Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={bookingAmount}
                onChangeText={setBookingAmount}
              />
              <Text style={styles.label}>Joining Date *</Text>
              <TouchableOpacity style={styles.dateBox} onPress={() => setOpenJoinDatePic(true)}>
                <Text style={styles.placeholder}>
                  {joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : "DD-MM-YYYY"}
                </Text>
                <Image
                  source={require("../../Assets/Images/calendar.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>


              {openDatePicker && (
                <View style={styles.sheetOverlay}>
                  <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
                    <View style={{ flex: 1 }} />
                  </TouchableWithoutFeedback>

                  <View style={styles.datePickerBox}>
                    <DatePicker
                      mode="single"
                      date={purchaseDate}
                      onChange={(p) => {
                        setPurchaseDate(p.date || dayjs());
                        setOpenDatePicker(false);
                      }}
                    />
                  </View>
                </View>
              )}

              {openJoinDatePic && (
                <View style={styles.sheetOverlay}>
                  <TouchableWithoutFeedback onPress={() => setOpenJoinDatePic(false)}>
                    <View style={{ flex: 1 }} />
                  </TouchableWithoutFeedback>

                  <View style={styles.datePickerBox}>
                    <DatePicker
                      mode="single"
                      date={joiningDate}
                      onChange={(p) => {
                        setJoiningDate(p.date || dayjs());
                        setOpenJoinDatePic(false);
                      }}
                    />
                  </View>
                </View>
              )}
            </>

          )}


          {activeTab === "CheckIn" && (
            <>
              <Text style={styles.label}>Select Tenant</Text>

              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  style={styles.select}
                  onPress={() => setCheckinTenantsopen(!checkinTenantsOpen)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.selectText}>{CheckinTenantSelected}</Text>
                  <Image source={DownArrow} style={styles.arrow} />
                </TouchableOpacity>

                {checkinTenantsOpen && (
                  <View style={styles.dropdownMenuone}>
                    <ScrollView style={{ maxHeight: 160 }}>
                      {CheckinTenants.map((v, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.option}
                          onPress={() => {
                            setCheckinTenantSelected(v);
                            setCheckinTenantsopen(false);
                          }}
                        >
                          <Text style={styles.optionText}>{v}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
              <Text style={styles.label}>Stay Type</Text>

              <View style={{ position: "relative" }}>
                <TouchableOpacity
                  style={styles.select}
                  onPress={() => setStayTypeOpen(!StayTypeOpen)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.selectText}>{StayTypeSelected}</Text>
                  <Image source={DownArrow} style={styles.arrow} />
                </TouchableOpacity>

                {StayTypeOpen && (
                  <View style={styles.dropdownMenuone}>
                    <ScrollView style={{ maxHeight: 160 }}>
                      {StayType.map((v, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.option}
                          onPress={() => {
                            setStayTypeSelected(v);
                            setStayTypeOpen(false);
                          }}
                        >
                          <Text style={styles.optionText}>{v}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <Text style={styles.label}>Rental Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={rentalAmount}
                onChangeText={setRentalAmount}
              />

              <Text style={styles.label}>Advance Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={advanceAmount}
                onChangeText={setAdvanceAmount}
              />
              <Text style={styles.label}>Joining Date *</Text>

              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setOpenCheckJoinDatePic(true)}
              >
                <Text style={styles.placeholder}>
                  {checkJoiningDate
                    ? dayjs(checkJoiningDate).format("DD-MM-YYYY")
                    : "DD-MM-YYYY"}
                </Text>

                <Image
                  source={require("../../Assets/Images/calendar.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>

              {openCheckJoinDatePic && (
                <View style={styles.sheetOverlay}>
                  <TouchableWithoutFeedback onPress={() => setOpenCheckJoinDatePic(false)}>
                    <View style={{ flex: 1 }} />
                  </TouchableWithoutFeedback>

                  <View style={styles.datePickerBox}>
                    <DatePicker
                      mode="single"
                      date={checkJoiningDate}
                      onChange={(p) => {
                        setcheckJoiningDate(p.date || dayjs());
                        setOpenCheckJoinDatePic(false);
                      }}
                    />
                  </View>
                </View>
              )}
            </>
          )}

          {activeTab === "CheckIn" && (
            <View style={styles.nonRefund}>
              <View style={styles.extraHeader}>
                <Text style={styles.label}>Non Refundable Amount</Text>

                <TouchableOpacity style={styles.addBtn} onPress={addCharge}>
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Add</Text>
                </TouchableOpacity>
              </View>

              {extraCharges.map((item) => (
                <View key={item.id} style={styles.figmaRowWrapper}>

                  {/* CLOSE BTN */}
                  <TouchableOpacity
                    onPress={() => removeCharge(item.id, item.type)}
                    style={styles.figmaCloseBtn}
                  >

                    <Image
                      source={Delete}
                      style={styles.figmaCloseText}
                    />
                  </TouchableOpacity>


                  <View style={styles.figmaRow}>


                    {item.type === "" ? (
                      <TouchableOpacity
                        style={styles.figmaLeftBox}
                        onPress={() =>
                          setOpenDropdownId(openDropdownId === item.id ? null : item.id)
                        }
                      >
                        <Text style={{ color: "#777" }}>Select...</Text>
                        <Image source={DownArrow} style={styles.arrow} />
                      </TouchableOpacity>
                    ) : item.type === "Others" ? (
                      <TextInput
                        style={styles.figmaLeftBox}
                        placeholder="Enter reason"
                        value={item.title}
                        onChangeText={(t) => updateTitle(item.id, t)}
                      />
                    ) : (
                      <View style={[styles.figmaLeftBox, { backgroundColor: "#EFEFEF" }]}>
                        <Text>Maintenance</Text>
                      </View>
                    )}

                    {/* RIGHT BOX ALWAYS VISIBLE (disabled until type selected) */}
                    {item.type === "" ? (
                      <View style={[styles.figmaRightBox, { opacity: 0.4 }]}>
                        <Text style={{ color: "#999" }}>Enter amount</Text>
                      </View>
                    ) : (
                      <TextInput
                        style={styles.figmaRightBox}
                        placeholder="Enter amount"
                        keyboardType="numeric"
                        value={item.amount}
                        onChangeText={(t) => updateAmount(item.id, t)}
                      />
                    )}

                  </View>


                  {openDropdownId === item.id && item.type === "" && (
                    <View style={styles.dropdownMenu}>
                      {TYPE_OPTIONS.map((t) => {

                        const disabled = t === "Maintenance" && maintenanceAlreadyUsed;

                        return (
                          <TouchableOpacity
                            key={t}
                            disabled={disabled}
                            onPress={() => !disabled && selectType(item.id, t)}
                            style={{ opacity: disabled ? 0.3 : 1 }}
                          >
                            <Text style={styles.dropdownItem}>{t}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                </View>
              ))}





            </View>
          )}


          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitText}>
                {activeTab === "Booking" ? "Book" : "Check In"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 30 },

  backArrow: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },

  roomText: {
    fontSize: 13,
    color: "#1E45E1",
    marginBottom: 15,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#E9ECF7",
    padding: 4,
    borderRadius: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#1D5DFF",
  },
  tabText: {
    textAlign: "center",
    fontSize: 14,
    color: "#000000",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  label: {
    marginTop: 18,
    marginBottom: 5,
    fontWeight: "600",
    color: "#444",
  },

  dateBox: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },

  icon: { width: 20, height: 20 },

  extraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  addBtn: {
    backgroundColor: "#2D6CDF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },


  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 25,
  },


  cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,


    width: "40%"
  },

  cancelText: {
    textAlign: "center",
    color: "#333",
  },

  submitBtn: {
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: "#1D5DFF",
    width: "35%"
  },

  submitText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
  },

  arrow: { width: 18, height: 18, tintColor: "#444" },

  dropdownMenu: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,

  },

  dropdownItem: {
    padding: 12,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },


  dropdownMenuone: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    zIndex: 999,
    elevation: 10,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  selectText: { color: "#555" },
  select: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholder: { color: "#555" },


  optionText: {
    fontSize: 15,
    color: "#000",
  },


  datePickerBox: {
    backgroundColor: "#fff",
    width: "80%",
    borderColor: "#DCDCDC",
    borderRadius: 30,
    padding: 5,
    marginBottom: 120,
    borderWidth: 0.5,
  },



  sheetOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "flex-end",

  },



  figmaRowWrapper: {
    marginTop: 20,
    position: "relative",
  },

  figmaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  figmaLeftBox: {
    width: "48%",
    height: 50,
backgroundColor:"#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  figmaRightBox: {
    width: "45%",
    height: 50,
backgroundColor:"#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    justifyContent: "center",
    marginRight: 20
  },

  figmaCloseBtn: {
    position: "absolute",
    right: 5,
    top: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E1E1E1",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  figmaCloseText: {
    width: 10,
    height: 10
  },
  nonRefund: {
    backgroundColor: "#F7F9FF",
    padding: 10,
    marginTop: 10,
    borderRadius: 20
  }


});

