import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image, ScrollView,TextInput ,
} from "react-native";
import { StatusBar, Platform } from "react-native";
import { Switch } from "react-native-switch";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";
import ArrowDown from "../../../Assets/Images/direction-downIcon.png";
import EditIcon from "../../../Assets/Images/Edit_Configure.png";
import GracePeriodIcon from "../../../Assets/Images/GraceperiodIocn.png";
import OverdueIcon from "../../../Assets/Images/DuedayIcon.png";
import CloseIcon from "../../../Assets/Images/Close_Icon.png";

export default function LongStay({ navigation }) {

    const [billingMethod, setBillingMethod] = useState("monthly");
    const [billingstartDate, setBillingStartDate] = useState(null);
    const [gracedate, setGraceDate] = useState(null);
    const [duedate, setDueDate] = useState(null);

    const [openPicker, setOpenPicker] = useState(false);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openGracePeriod, setOpenGracePeriod] = useState(false);
    const [openDueWithin, setOpenDueWithin] = useState(false);

    const [reminderDays, setReminderDays] = useState([]);
    const [openReminder, setOpenReminder] = useState(false);

    const [isConfigured, setIsConfigured] = useState(false);
    const [lateFeeEnabled, setLateFeeEnabled] = useState(false);

    const [lateFeeType, setLateFeeType] = useState("flat");
    const [slabs, setSlabs] = useState([
        { id: 1, from: "", to: "", amount: "" }
    ]);

    const [openFromPicker, setOpenFromPicker] = useState(null);
const [openToPicker, setOpenToPicker] = useState(null);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getEndDate = (date) => {
        if (!date) return "";

        if (date === 1) {
            return daysInMonth;
        }

        return date - 1;
    };

    const addSlab = () => {
  setSlabs([
    ...slabs,
    { id: Date.now(), from: "", to: "", amount: "" }
  ]);
};

const updateSlab = (id, field, value) => {
  setSlabs(prev =>
    prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
  );
};

const removeSlab = (id) => {
  setSlabs(slabs.filter((item) => item.id !== id));
};

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={ArrowLeft} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Longstay Recurring</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Billing Method */}
                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>Billing Method</Text>
                    <Text style={styles.sectionSub}>
                        Choose how rent invoices are generated for tenants.
                    </Text>

                    {/* Monthly Recurring */}
                    <TouchableOpacity
                        style={styles.radioRow}
                        onPress={() => setBillingMethod("monthly")}
                    >
                        <View style={styles.radioTextContainer}>
                            <Text style={styles.radioTitle}>Monthly Recurring</Text>
                            <Text style={styles.radioSub}>
                                It's automatically calculated based on bill start date
                            </Text>
                        </View>

                        <View style={styles.radioOuter}>
                            {billingMethod === "monthly" && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* Tenant Joining */}

                    <TouchableOpacity
                        style={styles.radioRow}
                        onPress={() => setBillingMethod("joining")}
                    >
                        <View style={styles.radioTextContainer}>
                            <Text style={styles.radioTitle}>Tenant Joining Based</Text>
                            <Text style={styles.radioSub}>
                                Invoices are generated based on each tenant's join date.
                            </Text>
                        </View>

                        <View style={styles.radioOuter}>
                            {billingMethod === "joining" && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>




                </View>

                {/* Billing Config */}
                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>Basic Billing Configuration</Text>
                    <Text style={styles.sectionSub}>Defines the monthly rent period.</Text>

                    {/* Start Date */}
                    <Text style={styles.label}>Billing Start Date (Day of Month)</Text>

                    <TouchableOpacity
                        // style={styles.dropdown}
                        style={[styles.dropdown, { opacity: billingMethod === "joining" ? 0.4 : 1 }]}
                        onPress={() => {
                            setOpenStartDate(!openStartDate);
                            setOpenGracePeriod(false);
                            setOpenDueWithin(false);
                        }}
                        disabled={billingMethod === "joining"}
                    >
                        <Text style={styles.dropdownText}>
                            {billingstartDate ? billingstartDate : "Select Date"}
                        </Text>

                        <Image source={ArrowDown} style={{ height: 18, width: 18, transform: [{ rotate: openStartDate ? "180deg" : "0deg" }] }} />
                    </TouchableOpacity>

                    <Text style={styles.helper}>Select a day between 1-30</Text>

                    {openStartDate && (
                        <View style={styles.dateGrid}>
                            {days.map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    style={[
                                        styles.dateItem,
                                        billingstartDate === d && styles.dateSelected
                                    ]}
                                    onPress={() => {
                                        setBillingStartDate(d);
                                        setOpenStartDate(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.dateText,
                                            billingstartDate === d && { color: "#fff" }
                                        ]}
                                    >
                                        {d < 10 ? `0${d}` : d}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* End Date */}
                    <Text style={styles.label}>Billing End Date (Auto-calculated)</Text>
                    <View style={styles.dropdownDisabled}>
                        <Text style={styles.dropdownText}>

                            {billingstartDate ? `${getEndDate(billingstartDate)} of next month` : "Auto calculated"}
                        </Text>
                    </View>

                    <Text style={styles.helper}>
                        Automatically calculated based on start date
                    </Text>

                    {/* Button */}
                    <View style={styles.BtnRow} >


                        {!isConfigured && (
                            <TouchableOpacity
                                // style={styles.saveBtn}
                                style={[styles.saveBtn, { opacity: billingMethod === "joining" ? 0.4 : 1 }]}
                                disabled={billingMethod === "joining"}
                                onPress={() => {
                                    if (billingstartDate) {
                                        setIsConfigured(true);
                                    }
                                }}
                            >
                                <Text style={styles.saveText}>Save Configuration</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {isConfigured && (
                        <View style={styles.configRow}>

                            <View style={styles.configBadge}>
                                <Text style={styles.configIcon}>✓</Text>
                                <Text style={styles.configText}>Configured</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.editBtn}
                                onPress={() => setIsConfigured(false)}
                            >
                                {/* <Text style={styles.editIcon}>✎</Text> */}
                                <Image source={EditIcon} style={styles.editIcon} />
                                <Text style={styles.editText}>Edit Configuration</Text>
                            </TouchableOpacity>

                        </View>
                    )}

                </View>

                {billingMethod === "joining" && (
                    <>
                        {/* Full Rent Grace Period */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Full Rent Grace Period</Text>
                            <Text style={styles.sectionSub}>
                                Tenants joining shortly after the billing cycle starts are often charged full rent
                            </Text>

                            <Text style={styles.label}>Grace Period (Days)</Text>

                            <TouchableOpacity style={styles.dropdown} onPress={() => {
                                setOpenGracePeriod(!openGracePeriod);
                                setOpenStartDate(false);
                                setOpenDueWithin(false);
                            }}>
                                <Text style={styles.dropdownText}>
                                    {gracedate ? gracedate : "Select Date"}</Text>
                                <Image source={ArrowDown} style={{ width: 18, height: 18, transform: [{ rotate: openGracePeriod ? "180deg" : "0deg" }] }} />
                            </TouchableOpacity>
                            {openGracePeriod && (
                                <View style={styles.dateGrid}>
                                    {days.map((d) => (
                                        <TouchableOpacity
                                            key={d}
                                            style={[
                                                styles.dateItem,
                                                gracedate === d && styles.dateSelected
                                            ]}
                                            onPress={() => {
                                                setGraceDate(d);
                                                setOpenGracePeriod(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dateText,
                                                    gracedate === d && { color: "#fff" }
                                                ]}
                                            >
                                                {d < 10 ? `0${d}` : d}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                   
                                               <View style={{display:'flex', flexDirection:'row',    marginTop: 8}}>
                                <Image source={GracePeriodIcon} style={{ height: 13, width: 13,   marginTop: 2, marginRight:4  }} />
                            <Text style={styles.infoText}>
                             
                                Full rent will apply if tenant joins from 4 to 11 of the month. Prorated rent applies from 12 onwards.
                            </Text>
                        </View>
                         </View>


                        {/* Payment Timeline */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Payment Timeline (Due days)</Text>
                            <Text style={styles.sectionSub}>
                                Configure payment due dates and reminder settings
                            </Text>

                            <Text style={styles.label}>Due Within (Days)</Text>

                            <TouchableOpacity style={styles.dropdown} onPress={() => {
                                setOpenDueWithin(!openDueWithin);
                                setOpenStartDate(false)
                                setOpenGracePeriod(false);
                            }}>
                                <Text style={styles.dropdownText}>{duedate ? duedate : "Select Date"}</Text>
                                <Image source={ArrowDown} style={{ width: 18, height: 18 }} />
                            </TouchableOpacity>

                            {openDueWithin && (
                                <View style={styles.dateGrid}>
                                    {days.map((d) => (
                                        <TouchableOpacity
                                            key={d}
                                            style={[
                                                styles.dateItem,
                                                duedate === d && styles.dateSelected
                                            ]}
                                            onPress={() => {
                                                setDueDate(d);
                                                setOpenDueWithin(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dateText,
                                                    duedate === d && { color: "#fff" }
                                                ]}
                                            >
                                                {d < 10 ? `0${d}` : d}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            <View style={{display:'flex', flexDirection:'row', alignItems:'center',    marginTop: 8}}>
                                <Image source={OverdueIcon} style={{ height: 13, width: 13,   marginTop: 2, marginRight:4  }} />
                            <Text style={styles.warningText}>
                                
                                Overdue starts from 10 of the month
                            </Text>
                            </View>

                            <Text style={styles.label}>Send Reminder (Days Before Due)</Text>

                            <TouchableOpacity
                                style={styles.dropdown}
                                onPress={() => setOpenReminder(!openReminder)}
                            >
                                <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
                                    {reminderDays.length === 0 ? (
                                        <Text style={styles.dropdownText}>Select Reminder Days</Text>
                                    ) : (
                                        reminderDays.map((d) => (
                                            <View key={d} style={styles.reminderChip}>
                                                <Text style={{ color: '#222222' }}>{d < 10 ? `0${d}` : d}</Text>

                                                <TouchableOpacity
                                                    onPress={() =>
                                                        setReminderDays(reminderDays.filter((item) => item !== d))
                                                    }
                                                >
                                                    <Image source={CloseIcon} style={{ marginLeft: 6, height: 15, width: 15 }} />
                                                    {/* <Text style={{marginLeft:6}}>✕</Text> */}
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    )}
                                </View>
                                <View style={{ width: "7%" }}>
                                    <Image source={ArrowDown} style={{ width: 18, height: 18, }} />
                                </View>
                            </TouchableOpacity>

                            {openReminder && duedate && (
                                <View style={styles.dateGrid}>
                                    {Array.from({ length: duedate }, (_, i) => i + 1).map((d) => (
                                        <TouchableOpacity
                                            key={d}
                                            style={[
                                                styles.dateItem,
                                                reminderDays.includes(d) && styles.dateSelected
                                            ]}
                                            onPress={() => {
                                                if (reminderDays.includes(d)) {
                                                    setReminderDays(reminderDays.filter((x) => x !== d));
                                                } else {
                                                    setReminderDays([...reminderDays, d]);
                                                }
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dateText,
                                                    reminderDays.includes(d) && { color: "#fff" }
                                                ]}
                                            >
                                                {d < 10 ? `0${d}` : d}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}


                            <Text style={styles.helper}>
                                Automatic payment reminder will be sent before due date
                            </Text>
                        </View>


                        {/* Late Fee */}
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>
                                Late Fee Configuration (Fine Amount)
                            </Text>

                            <Text style={styles.sectionSub}>
                                Set up late payment penalties and charges
                            </Text>

                            <View style={styles.lateRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionTitle}>Enable Late Fees</Text>
                                    <Text style={styles.helper}>
                                        Automatically charge late fees on overdue payments
                                    </Text>
                                </View>

                                {/* <Switch
    value={lateFeeEnabled}
    onValueChange={setLateFeeEnabled}
    trackColor={{ false: "#D9D9D9", true: "#2F5BFF" }}
    thumbColor="#fff"
  /> */}

                                <Switch
                                    value={lateFeeEnabled}
                                    onValueChange={setLateFeeEnabled}
                                    circleSize={20}
                                    barHeight={25}
                                    circleBorderWidth={0}
                                    backgroundActive={"#2F5BFF"}
                                    backgroundInactive={"#D9D9D9"}
                                    circleActiveColor={"#fff"}
                                    circleInActiveColor={"#fff"}
                                    changeValueImmediately={true}
                                    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
                                    renderActiveText={false}
                                    renderInActiveText={false}
                                />

                            </View>

                            {lateFeeEnabled && (
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{fontSize: 15,fontFamily: "Gilroy-Medium"}}>Late Fee Type</Text>
                                    <TouchableOpacity
                                        style={styles.radioRow}
                                        onPress={() => setLateFeeType("flat")}
                                    >
                                        <View style={styles.radioTextContainer}>
                                            <Text style={styles.radioTitle}>Flat Fee</Text>
                                            <Text style={styles.radioSub}>
                                                One-time charge when payment becomes overdue
                                            </Text>
                                        </View>

                                        <View style={styles.radioOuter}>
                                            {lateFeeType === "flat" && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>


                                    {/* Daily Fee */}
                                    <TouchableOpacity
                                        style={styles.radioRow}
                                        onPress={() => setLateFeeType("daily")}
                                    >
                                        <View style={styles.radioTextContainer}>
                                            <Text style={styles.radioTitle}>Daily Fee</Text>
                                            <Text style={styles.radioSub}>
                                                Fixed amount charged per day after due date
                                            </Text>
                                        </View>

                                        <View style={styles.radioOuter}>
                                            {lateFeeType === "daily" && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>


                                    {/* Tiered Daily Fee */}
                                    <TouchableOpacity
                                        style={styles.radioRow}
                                        onPress={() => setLateFeeType("tiered")}
                                    >
                                        <View style={styles.radioTextContainer}>
                                            <Text style={styles.radioTitle}>Tiered Daily Fee</Text>
                                            <Text style={styles.radioSub}>
                                                Variable daily charges based on overdue period
                                            </Text>
                                        </View>

                                        <View style={styles.radioOuter}>
                                            {lateFeeType === "tiered" && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>


                                    {/* <TouchableOpacity style={styles.radioRow}>
<View style={styles.radioTextContainer}>
<Text style={styles.radioTitle}>Daily Fee</Text>
<Text style={styles.radioSub}>
Fixed amount charged per day after due date
</Text>
</View>

<View style={styles.radioOuter}/>
</TouchableOpacity> */}


                                    {/* <TouchableOpacity style={styles.radioRow}>
<View style={styles.radioTextContainer}>
<Text style={styles.radioTitle}>Tiered Daily Fee</Text>
<Text style={styles.radioSub}>
Variable daily charges based on overdue period
</Text>
</View>

<View style={styles.radioOuter}/>
</TouchableOpacity> */}


                                    {lateFeeType === "flat" && (
                                        <>
                                            <Text style={styles.label}>Flat Fee Amount (₹)</Text>

                                            <View style={styles.dropdown}>
                                                <Text style={styles.dropdownText}>₹ 300</Text>
                                            </View>
                                        </>
                                    )}

                                    {lateFeeType === "daily" && (
                                        <>
                                            <Text style={styles.label}>Daily Fee Amount (₹)</Text>

                                            <View style={styles.dropdown}>
                                                <Text style={styles.dropdownText}>₹</Text>
                                            </View>


                                            <Text style={styles.label}>Maximum Late Fee Cap (₹)</Text>

                                            <View style={styles.dropdown}>
                                                <Text style={styles.dropdownText}>₹</Text>
                                            </View>

                                            <Text style={styles.helper}>
                                                Late fees will not exceed this amount regardless of delay duration
                                            </Text>
                                        </>
                                    )}

                                   {lateFeeType === "tiered" && (
<View style={{marginTop:15}}>

{slabs.map((slab,index)=>(
<View key={slab.id} style={{marginBottom:20}}>

<View style={{alignItems:"flex-end"}}>
<TouchableOpacity onPress={()=>removeSlab(slab.id)}>
<Image source={CloseIcon} style={{height:18,width:18}}/>
</TouchableOpacity>
</View>

{/* FROM / TO LABEL */}
<View style={{flexDirection:"row",justifyContent:"space-between"}}>
    <View style={{flex:1}}>
<Text style={styles.label}>From Day</Text>
</View>
 <View style={{flex:1 , marginLeft:15}}>
<Text style={styles.label}>To Day</Text>
</View>

</View>

<View style={styles.tierRow}>

{/* FROM DATE */}
<TouchableOpacity
style={styles.dropdownSmall}
onPress={()=>setOpenFromPicker(slab.id)}
>
<Text>{slab.from || "Select"}</Text>
</TouchableOpacity>

{/* TO DATE */}
<TouchableOpacity
style={styles.dropdownSmall}
onPress={()=>setOpenToPicker(slab.id)}
>
<Text>{slab.to || "Select"}</Text>
</TouchableOpacity>

</View>


{/* FROM DATE PICKER */}
{openFromPicker===slab.id && (
<View style={styles.dateGrid}>
{days.map((d)=>(
<TouchableOpacity
key={d}
style={[
styles.dateItem,
slab.from===d && styles.dateSelected
]}
onPress={()=>{
updateSlab(slab.id,"from",d);
setOpenFromPicker(null);
}}
>
<Text
style={[
styles.dateText,
slab.from===d && {color:"#fff"}
]}
>
{d}
</Text>
</TouchableOpacity>
))}
</View>
)}


{/* TO DATE PICKER */}
{openToPicker===slab.id && (
<View style={styles.dateGrid}>
{days.map((d)=>(
<TouchableOpacity
key={d}
style={[
styles.dateItem,
slab.to===d && styles.dateSelected
]}
onPress={()=>{
updateSlab(slab.id,"to",d);
setOpenToPicker(null);
}}
>
<Text
style={[
styles.dateText,
slab.to===d && {color:"#fff"}
]}
>
{d}
</Text>
</TouchableOpacity>
))}
</View>
)}


{/* AMOUNT */}
<Text style={styles.label}>Amount per day (₹)</Text>

<TextInput
style={styles.dropdown}
keyboardType="numeric"
placeholder="₹"
value={slab.amount}
onChangeText={(text)=>updateSlab(slab.id,"amount",text)}
/>

</View>
))}

          <Text style={styles.label}>Maximum Late Fee Amount (₹)</Text>

                                            <View style={styles.dropdown}>
                                                <Text style={styles.dropdownText}>₹</Text>
                                            </View>

                                            <Text style={styles.helper}>
                                                Late fees will not exceed this amount regardless of delay duration
                                            </Text>



   <View style={styles.bottomRow}>
                             

                           <TouchableOpacity style={styles.addSlab} onPress={addSlab}>
<Text style={{color:"#2F5BFF"}}>+ Add Slab</Text>
</TouchableOpacity>
                        </View>

</View>
)}

                                </View>
                            )}

                        </View>


                        {/* Bottom Buttons */}
                        <View style={styles.bottomRow}>
                            <TouchableOpacity style={styles.discardBtn}>
                                <Text style={styles.discardText}>Discard</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.saveChangesBtn}>
                                <Text style={styles.saveText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>

                    </>
                )}
            </ScrollView>
        </SafeAreaView>
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

  tierRow:{
flexDirection:"row",
justifyContent:"space-between",
marginTop:10
},
    dropdownSmall:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:8,
padding:12,
width:"48%",
alignItems:"center"
},

    addSlab: {
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#2F5BFF",
        padding: 10,
        borderRadius: 8,
        alignItems: "center"
    },


});