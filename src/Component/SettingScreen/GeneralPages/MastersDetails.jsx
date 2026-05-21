import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, Image, Dimensions, Modal, Pressable, TextInput, Keyboard } from "react-native";
import Dots from "../../../Assets/Images/3dots.png";
import Phone from "../../../Assets/Images/call.png";
import EmailIcon from "../../../Assets/Images/gmail.png";
import ChangePasswordIcon from "../../../Assets/Images/password-check.png";
import { useHasPermission } from "../../../Utils/useHasPermission";
import Edit from "../../../Assets/Images/editIcon.png";
import Delete from "../../../Assets/Images/trash.png";
import { useNavigation } from "@react-navigation/native";
import SheildIcon from "../../../Assets/Images/SheildIcon.png"
import Eye from "../../../Assets/Images/Eye.png";
import EyeClose from "../../../Assets/Images/EyeIcon.png";




export default function MastersDetails({ visible, onClose, masterDetail, passwordSheetOpen,deletemaster }) {
    const sheetY = useRef(new Animated.Value(400)).current;
    const [activeMenu, setActiveMenu] = useState(null);
    const [popupPos, setPopupPos] = useState({ top: 0, right: 0 });
    const navigation =useNavigation();
    const [showPassword, setShowPassword] = useState(false);
     const [newPass, setNewPass] = useState("");

    const {
        canWriteModule: canWriteProfile,
        canReadModule: canReadProfile,
        canUpdateModule: canUpdateProfile,
        canDeleteModule: canDeleteProfile,
    } = useHasPermission("Profile");

    console.log(masterDetail)

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    
      useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
          setKeyboardHeight(e.endCoordinates.height);
        });
    
        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
          setKeyboardHeight(0);
        });
    
        return () => {
          showSub.remove();
          hideSub.remove();
        };
      }, []);
    

    useEffect(() => {
        if (visible) {
            Animated.timing(sheetY, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) sheetY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120 || g.vy > 1.5) onClose();
                else Animated.spring(sheetY, { toValue: 0, useNativeDriver: true }).start();
            },
        })
    ).current;

    if (!visible) return null;

    return (
        <>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.touchArea} onPress={onClose} />
                <Animated.View {...panResponder.panHandlers}
                    style={[styles.sheet, { height: '40%' }, {
              transform: [{ translateY: sheetY }],
              // ✅ keyboard opened -> increase padding
              paddingBottom:
                keyboardHeight > 0
                  ? keyboardHeight + 20
                  : 80,
            },]}>
                    <View style={styles.handle} />

                    <View style={styles.headerCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {masterDetail?.profilePic ? <Image source={{ uri: masterDetail?.profilePic }} style={{ width: 55, height: 55, borderRadius: 27.5 }} /> :
                                <View style={styles.initialdes}>
                                    <Text style={styles.initialText}>{masterDetail?.initials}</Text>
                                </View>}


                            <View style={styles.subHeader}>
                                <Text style={styles.masterName}>{masterDetail?.fullName}</Text>

                                <View style={styles.rolefield}>
                                <Image source={SheildIcon} style={{width:8.95,height:10.5,marginRight:5}}/>
                                <Text style={styles.roleNamefield}>{masterDetail?.roleName}</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={(event) => {
                                const { pageX, pageY } = event.nativeEvent;
                                const screenWidth = Dimensions.get("window").width;

                                setPopupPos({
                                    top: pageY + 5,
                                    right: screenWidth - pageX,
                                });

                                // setSelectedUser(u);
                                setActiveMenu(masterDetail?.userId);
                            }}>
                            <Image source={Dots} style={{ width: 21, height: 20 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center', flexDirection: 'row', paddingTop: 25 }}>
                        <Image source={Phone} style={{ width: 20, height: 20 }} />
                        <Text style={{ marginLeft: 8, fontSize: 16, fontFamily: 'Gilroy-Semibold' }}>+91 {masterDetail?.mobileNo}</Text>
                    </View>

                    <View style={{ alignItems: 'center', flexDirection: 'row', paddingTop: 18 }}>
                        <Image source={EmailIcon} style={{ width: 20, height: 20 }} />
                        <Text style={{ marginLeft: 8, fontSize: 16, fontFamily: 'Gilroy-Medium', textDecorationLine: 'underline', color: '#1E45E1' }}>
                            {masterDetail?.mailId}</Text>
                    </View>

                    <Text style={styles.pswrdheaderTxt}>Password</Text>

                    <View style={styles.pswrdTxtInput}>
                         <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter new password"
                            value={newPass}
                            secureTextEntry={!showPassword}
                          onChangeText={(t) => {
                          const cleaned = t.replace(/[^A-Za-z0-9@$!%*?&]/g, "");
                          setNewPass(cleaned);
                        //   setPassError("");
                        }}
                          />
                        
                          <TouchableOpacity
                            // style={styles.eyeIconBox}
                            onPress={() => setShowPassword(!showPassword)}
                          >
                            <Image
                              source={showPassword ? Eye : EyeClose}
                              style={styles.eyeIcon}
                            />
                          </TouchableOpacity>
                    </View>

                </Animated.View>
                <Modal
                    transparent
                    visible={activeMenu !== null}
                    animationType="fade"
                    onRequestClose={() => setActiveMenu(null)}
                >
                    {/* Outside touch */}
                    <Pressable
                        style={{ flex: 1 }}
                        onPress={() => setActiveMenu(null)}
                    />

                    {/* MENU */}
                    {masterDetail && (
                        <View
                            style={[
                                styles.menuBox,
                                {
                                    top: popupPos.top,
                                    right: popupPos.right,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={[styles.menuRow, !canWriteProfile && { opacity: 0.4 }]}
                                disabled={!canWriteProfile}
                                onPress={() => {
                                    // setSelectedUserId(selectedUser.userId);
                                    // setShowPasswordSheet(true);
                                    passwordSheetOpen();
                                    setActiveMenu(null);
                                    onClose();
                                }}
                            >
                                <Image source={ChangePasswordIcon} style={styles.menuIcon} />
                                <Text style={styles.menuText}>Change Password</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.menuRow, !canUpdateProfile && { opacity: 0.4 }]}
                                disabled={!canUpdateProfile}
                                onPress={() => {
                                    navigation.navigate("AddGeneralScreen", {
                                        editData: masterDetail,
                                    });
                                    setActiveMenu(null);
                                    onClose();
                                }}
                            >
                                <Image source={Edit} style={styles.menuIcon} />
                                <Text style={styles.menuText}>Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.menuRow, !canDeleteProfile && { opacity: 0.4 }]}
                                disabled={!canDeleteProfile}
                                onPress={() => {
                                    // handleDelete(selectedUser.userId);
                                    setActiveMenu(null);
                                    deletemaster();
                                }}
                            >
                                <Image
                                    source={Delete}
                                    style={[styles.menuIcon, { tintColor: "red" }]}
                                />
                                <Text style={[styles.menuText, { color: "red" }]}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Modal>


            </View>
        </>
    )

}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    touchArea: { flex: 1 },
    sheet: {
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
    },
    handle: {
        width: 45,
        height: 5,
        backgroundColor: "#ccc",
        borderRadius: 10,
        alignSelf: "center",
        marginBottom: 18,
    },
    headerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:10
    },
    initialdes: {
        width: 55, height: 55, borderRadius: 27.5, backgroundColor: "#EEF2FF", justifyContent: 'center', alignItems: 'center'
    },
    initialText: { fontSize: 18, fontFamily: 'Gilroy-Semibold' },
    subHeader: { marginLeft: 10 },
    masterName: { fontSize: 18, fontFamily: 'Gilroy-Semibold', color: 'black' },
    rolefield:{
        paddingVertical: 5, paddingHorizontal: 9.6,
        borderRadius: 5, marginTop: 5,
        backgroundColor: '#F0F7FF',flexDirection:'row',alignItems:'center'
    },
    roleNamefield: {
        color: '#3A90E5', fontSize: 13, fontFamily: 'Gilroy-Medium', 
    },
    menuBox: {
        position: "absolute",
        top: 50,
        right: 10,
        backgroundColor: "#fff",
        width: 170,
        padding: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        elevation: 8,
        zIndex: 999,
    },


    menuRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },

    menuIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
    },

    menuText: {
        fontSize: 14,
        fontFamily: "Gilroy-Semibold",
        color: "#000",
    },
    pswrdheaderTxt:{
        marginTop:25,
        fontSize:16,
        fontFamily:'Gilroy-Medium'
    },
    pswrdTxtInput:{
        borderWidth:1,
        borderRadius:8,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:12,
        marginTop:10,borderColor:'#ddd',paddingVertical:5
    },
    passwordInput: {
//   borderWidth: 1,
//   borderColor: "#ddd",
//   borderRadius: 10,
//   height: 48,
//   paddingHorizontal: 14,
//   paddingRight: 45, // ✅ space for eye
//   marginTop: 8,
  fontFamily: "Gilroy-Regular"
},
eyeIconBox: {
  position: "absolute",
  right: 12,
  top: 20,
},

eyeIcon: {
  width: 20,
  height: 20,
  tintColor: "#999",
},

})