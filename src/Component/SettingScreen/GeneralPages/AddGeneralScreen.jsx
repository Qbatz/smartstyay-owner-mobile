import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Keyboard } from "react-native";
import DownArrow from "../../../Assets/Images/direction-down.png";
import { launchImageLibrary } from 'react-native-image-picker';
import ProfilePlaceholder from "../../../Assets/Images/userAdd.png";
import LeftArrow from "../../../Assets/Images/Arrow_left.png";
import plusIcon from "../../../Assets/Images/plusIcon.png";
import Edit from "../../../Assets/Images/edit.png";


export default function AddGeneralScreen({ navigation,route}) {
     const editData = route?.params?.editData || null;
      useEffect(() => {
    if (editData) {
      console.log("Editing user:", editData);
    }
  }, []);
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [StateOpen, setStateOpen] = useState(false);
    const [StateSelected, setStateSelected] = useState("Select State");
    const [selectedImage, setSelectedImage] = useState(null);
    const pickImage = () => {
        let options = {
            mediaType: 'photo',
            maxWidth: 500,
            maxHeight: 500,
            quality: 0.7,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("Cancelled");
            } else if (response.errorMessage) {
                console.log("Error:", response.errorMessage);
            } else {
                setSelectedImage(response.assets[0]);
            }
        });
    };

    const StateName = [
        { label: "Andhra Pradesh", value: "Andhra Pradesh" },
        { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
        { label: "Assam", value: "Assam" },
        { label: "Bihar", value: "Bihar" },
        { label: "Chhattisgarh", value: "Chhattisgarh" },
        { label: "Goa", value: "Goa" },
        { label: "Gujarat", value: "Gujarat" },
        { label: "Haryana", value: "Haryana" },
        { label: "Himachal Pradesh", value: "Himachal Pradesh" },
        { label: "Jharkhand", value: "Jharkhand" },
        { label: "Karnataka", value: "Karnataka" },
        { label: "Kerala", value: "Kerala" },
        { label: "Madhya Pradesh", value: "Madhya Pradesh" },
        { label: "Maharashtra", value: "Maharashtra" },
        { label: "Manipur", value: "Manipur" },
        { label: "Meghalaya", value: "Meghalaya" },
        { label: "Mizoram", value: "Mizoram" },
        { label: "Nagaland", value: "Nagaland" },
        { label: "Odisha", value: "Odisha" },
        { label: "Punjab", value: "Punjab" },
        { label: "Rajasthan", value: "Rajasthan" },
        { label: "Sikkim", value: "Sikkim" },
        { label: "Tamil Nadu", value: "Tamil Nadu" },
        { label: "Telangana", value: "Telangana" },
        { label: "Tripura", value: "Tripura" },
        { label: "Uttar Pradesh", value: "Uttar Pradesh" },
        { label: "Uttarakhand", value: "Uttarakhand" },
        { label: "West Bengal", value: "West Bengal" },
    ];

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardOpen(true));
        const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardOpen(false));

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={!StateOpen}
                contentContainerStyle={{
                    paddingBottom: keyboardOpen ? 0 : 0,
                    flexGrow: keyboardOpen ? 0 : 1,
                }}
            >




                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={LeftArrow}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Add General</Text>
                </View>


                <TouchableOpacity
                    style={styles.profileSection}
                    onPress={pickImage}
                    activeOpacity={0.8}
                >
                    <View style={styles.profileCircle}>


                        <Image
                            source={selectedImage ? { uri: selectedImage.uri } : ProfilePlaceholder}
                            style={styles.profileImg}
                        />

                        {!selectedImage && (
                            <View style={styles.addBadge}>
                                <Image
                                    source={plusIcon}
                                    style={{ width: 16, height: 16, }}
                                />
                            </View>
                        )}


                        {selectedImage && (
                            <View style={styles.centerEditBadge}>
                                <Image
                                    source={Edit}
                                    style={{ width: 20, height: 20, }}
                                />
                            </View>
                        )}

                    </View>

                    <View style={{ marginLeft: 16 }}>
                        <Text style={styles.profileLabel}>Profile Photo</Text>
                        <Text style={styles.profileSub}>
                            Add Profile Image of Vendor/Business.{"\n"}Max size of image 2 MB
                        </Text>
                    </View>
                </TouchableOpacity>



                <Text style={styles.label}>First Name *</Text>
                <TextInput style={styles.input} placeholder="Enter First name" />

                <Text style={styles.label}>Last Name</Text>
                <TextInput style={styles.input} placeholder="Enter last Name" />

                <Text style={styles.label}>Mobile Number *</Text>
                <TextInput style={styles.input} placeholder="+91" keyboardType="numeric" />

                <Text style={styles.label}>Email ID</Text>
                <TextInput style={styles.input} placeholder="Enter Email" />

                <Text style={styles.label}>Flat, House no, Building...</Text>
                <TextInput style={styles.input} placeholder="Enter House No" />

                <Text style={styles.label}>Area, Street, Sector...</Text>
                <TextInput style={styles.input} placeholder="Enter Street" />

                <Text style={styles.label}>Landmark</Text>
                <TextInput style={styles.input} placeholder="Eg: Near SBI" />

                <Text style={styles.label}>Pincode *</Text>
                <TextInput style={styles.input} placeholder="Select Type" />

                <Text style={styles.label}>Town/City *</Text>
                <TextInput style={styles.input} placeholder="Select Type" />

                <Text style={styles.label}>State *</Text>

                <View style={{ position: "relative" }}>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => setStateOpen(!StateOpen)}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.selectText}>
                            {StateSelected || "Select a Vendor"}
                        </Text>
                        <Image source={DownArrow} style={styles.arrow} />
                    </TouchableOpacity>

                    {StateOpen && (
                        <View style={styles.dropdownMenu}>
                            <ScrollView style={{ maxHeight: 160 }}>
                                {StateName.map((v, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.option}
                                        onPress={() => {
                                            setStateSelected(v.label);
                                            setStateOpen(false);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{v.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>



                <TouchableOpacity style={styles.submitBtn}>
                    <Text style={styles.submitText}>Add General</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 50 },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    backIcon: { width: 22, height: 22, tintColor: "#000" },
    headerTitle: { fontSize: 20, fontWeight: "600", marginLeft: 10 },

    profileSection: { flexDirection: "row", alignItems: "center", marginBottom: 20 },

    profileCircle: {
        width: 75,
        height: 75,
        borderRadius: 40,
        backgroundColor: "#F4F4F4",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },

    addBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,

        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },

    centerEditBadge: {
        position: "absolute",
        width: 40,
        height: 40,
        borderRadius: 20,

        justifyContent: "center",
        alignItems: "center",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -20 }, { translateY: -20 }],

    },


    profileLabel: { fontSize: 14, fontWeight: "700" },
    profileSub: { fontSize: 12, color: "#888", lineHeight: 17 },

    label: { marginTop: 15, fontSize: 14, color: "#000" },

    input: {
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 10,
        height: 48,
        paddingHorizontal: 14,
        marginTop: 8,
    },

    submitBtn: {
        backgroundColor: "#7B8CFF",
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 25,
        alignItems: "center",
        marginBottom: 70
    },

    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
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
    dropdownMenu: {
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

    optionText: {
        fontSize: 15,
        color: "#000",
    },
    arrow: { width: 18, height: 18, tintColor: "#444" },
    profileImg: {
        width: "100%",
        height: "100%",
        borderRadius: 35,
    },
});
