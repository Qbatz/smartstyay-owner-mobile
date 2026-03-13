import React, { useEffect, useState, useRef,useCallback, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions,BackHandler } from "react-native";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import { LoginContexts } from "../../Context/LoginContext";
import { ExpensesContext } from "../../Context/ExpensesContext";
import { CommonContexts } from "../../Context/CommonContext";
import SuccessModal from "../../ToastFile/ToastPage";
import { removeData, storeData } from "../../Utils/Storage";
import { ACCESS_TOKEN, LOGGEDIN, USER_ID } from "../../Utils/Constant";
import Setting from '../../Assets/Images/setting.png';
import Remove from '../../Assets/Images/remove.png';




const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width

export default function ProfileDrawer({ visible, onClose }) {


  const { logout } = useContext(LoginContexts)
    const { expensesList, GetExpenseList, rolePermission ,
  GetRoleBasedPermission ,profileDetails , GetProfileDetails ,loading } = useContext(ExpensesContext);
 const { updateHostelList, hostelList  , activeHostelId  , setActiveHostelId} = useContext(CommonContexts);
  const navigation = useNavigation();
  const slideX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const BOTTOM_TAB_HEIGHT = global.BOTTOM_TAB_HEIGHT || 70;
  const [tabHeight, setTabHeight] = useState(BOTTOM_TAB_HEIGHT);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
const [modalMessage, setModalMessage] = useState("");
const [modalType, setModalType] = useState("success");




  const [showEditPopup, setShowEditPopup] = useState(false);
  const arrowRef = useRef(null);
  const [popupPos, setPopupPos] = useState({ top: 0, right: 0 });

  const loginContext=useContext(LoginContexts)

  useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      if (showEditPopup) {
        setShowEditPopup(false); 
        return true; // IMPORTANT: prevent app exit
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [showEditPopup])
);

  
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (global.BOTTOM_TAB_HEIGHT && global.BOTTOM_TAB_HEIGHT !== tabHeight) {
        setTabHeight(global.BOTTOM_TAB_HEIGHT);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // SLIDE ANIMATION
  useEffect(() => {
    Animated.timing(slideX, {
      toValue: visible ? SCREEN_WIDTH * 0.40 : SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  // const handleLogout=(value)=>{
  //   console.log(value)
  //     loginContext.loggedin('false')
  //     storeData(LOGGEDIN, "false")
  // }

const handleLogout = async () => {
  const res = await logout();
  console.log(res)

  if (res?.status == 200) {
    await Promise.all([
        removeData(ACCESS_TOKEN),
    storeData(LOGGEDIN, "false"),
     removeData(USER_ID)
    ])

   
    loginContext.logoutf("false")
   
    loginContext.updateUserId("")

    setModalType("success");
    setModalMessage("Logout successfully");
    setShowSuccessModal(true);

   
    setTimeout(() => {
      setShowSuccessModal(false);

      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: "LoginDesign" }],
      // });
    }, 1500);

  } else {
    setModalType("error");
    setModalMessage(res?.message || "Logout failed");
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  }
};

const activeHostel =
  hostelList?.find(h => (h.hostelId ?? h.id) === activeHostelId) ??
  hostelList?.[0] ??
  {};

  console.log("activehostel", activeHostel);
  

const getFullName = (profile) => {
  if (!profile) return "";

  const first = profile.firstName?.trim() || "";
  const last = profile.lastName?.trim() || "";

  return `${first} ${last}`.trim(); // "Emima"
};

const getInitials = (profile) => {
  if (profile?.initial) return profile.initial;

  const first = profile?.firstName?.[0] || "";
  const last = profile?.lastName?.[0] || "";

  return (first + last).toUpperCase();
};


console.log("profileDetails", profileDetails);
  if (!visible) return null;

  return (

 <>
 
 <SuccessModal
  visible={showSuccessModal}
  message={modalMessage}
  type={modalType}
  onClose={() => setShowSuccessModal(false)}
/>


    <View style={styles.overlay}>


      <TouchableOpacity style={styles.background} onPress={onClose} />

      <Animated.View
        style={[
          styles.panel,
          {
            width: SCREEN_WIDTH * 0.60,
            height: SCREEN_HEIGHT - tabHeight,
            transform: [{ translateX: slideX }],
          },
        ]}
      >

        {/* HEADER */}
        <View style={styles.header}>
  <View style={styles.headerTitleWrapper}>
    <Text style={styles.title}>
      {activeHostel?.name || "Smartstay"}
    </Text>
  </View>

  <TouchableOpacity onPress={onClose}>
    <Image source={Remove} style={styles.close} />
  </TouchableOpacity>
</View>


        <TouchableOpacity style={styles.profileRow}    onPress={() => {
              onClose();
              setTimeout(() => navigation.navigate("GeneralDetailsScreen"), 150);
            }}> 
          <View
            style={{ flexDirection: "row", flex: 1 }}
         
          >
           <View style={styles.avatar}>
  {profileDetails?.profileImage ? (
    <Image
      source={{ uri: profileDetails.profileImage }}
      style={styles.profileImg}
    />
  ) : (
    <Text style={styles.avatarText}>
      {getInitials(profileDetails)}
    </Text>
  )}
</View>


            <View style={{ flex: 1, marginLeft: 2 }}>
              <Text style={styles.profileName}>  {getFullName(profileDetails)}</Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 , marginLeft: 8  }}>
                <Image
                  source={require("../../Assets/Images/Eye.png")}
                  style={styles.eyeIcon}
                />
                <Text style={styles.changePassword}>Change Password</Text>
              </View>
            </View>
          </View>

        
          {/* <TouchableOpacity
            ref={arrowRef}
            onPress={() => {
              arrowRef.current.measureInWindow((x, y, width, height) => {
                setPopupPos({
                  top: y + height + 5,
                  right: SCREEN_WIDTH - (x + width),
                });
              });
              setShowEditPopup(true);
            }}
          > */}
            <Image
              source={require("../../Assets/Images/right_direction.png")}
              style={styles.arrowIcon}
            />
          {/* </TouchableOpacity> */}

        </TouchableOpacity>

        {/* BOTTOM MENU */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate("SettingsScreen")}
          >
            <Image source={Setting} style={styles.menuIcon} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow}>
            <Image source={Setting} style={styles.menuIcon} />
            <Text style={styles.menuText}>Help & Information</Text>
          </TouchableOpacity>

          <TouchableOpacity
          //  onPress={()=>handleLogout('remot')} 
           onPress={handleLogout}
           style={styles.logoutRow}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>

      {showEditPopup && (
  <TouchableOpacity
    style={styles.popupOverlay}
    activeOpacity={1}
    onPress={() => setShowEditPopup(false)}
  />
)}


{/* {showEditPopup && (
  <View style={[styles.popup, { top: popupPos.top, right: popupPos.right }]}>
    <TouchableOpacity style={styles.popupRow}>
      <Image source={require("../../Assets/Images/editIcon.png")} style={styles.popupIcon} />
      <Text style={styles.popupText}>Edit</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.popupRow}>
      <Image source={require("../../Assets/Images/trash.png")} style={styles.popupIcon} />
      <Text style={[styles.popupText, { color: "red" }]}>Delete</Text>
    </TouchableOpacity>
  </View>
)} */}


    </View>
    </>
  );
}


const styles = StyleSheet.create({
overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  flexDirection: "row",
  zIndex: 9999,
  elevation: 9999,    
  pointerEvents: "box-none",
},


  background: { flex: 1 },

panel: {
  position: "absolute",
  top: 0,
  backgroundColor: "#fff",
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  overflow: "hidden",
  paddingTop: 40,
},




header: {
  paddingHorizontal: 20,
  flexDirection: "row",
  alignItems: "center",
},

headerTitleWrapper: {
  flex: 1,         
  paddingRight: 12, 
},

title: {
  fontSize: 20,
  fontWeight: "700",
  color: "#000",
  flexShrink: 1,    
  flexWrap: "wrap", 
},

  close: {width:15,height:15},

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  profileImg: { width: 50, height: 50, borderRadius: 25 },
  // profileName: { fontSize: 16, fontWeight: "600", color: "#000" },
  changePassword: { fontSize: 13, color: "#2F80ED", marginLeft: 6 },
  eyeIcon: { width: 14, height: 14, tintColor: "#2F80ED" },
  arrowIcon: { width: 18, height: 18, tintColor: "#000", marginLeft: 12 },

  bottomSection: { marginTop: "auto", paddingHorizontal: 20, paddingBottom: 35 },
  menuRow: { flexDirection: "row", alignItems: "center", paddingVertical: 18 },
  menuIcon: { width: 22, height: 22, marginRight: 12 },
  menuText: { fontSize: 16, color: "#333" },

  logoutRow: { backgroundColor: "#FFECEC", borderRadius: 10, marginTop: 20, padding: 16 },
  logoutText: { color: "#EF4444", fontSize: 16, fontWeight: "700" },

  popup: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    elevation: 5,
    marginTop:50
    
  },

  popupRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8,paddingHorizontal:10 },
  popupIcon: { width: 18, height: 18, marginRight: 10 },
  popupText: { fontSize: 16, color: "#333" },

  popupOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
  },

avatar: {
  width: 40,
  height: 40,
  borderRadius: 25,
  backgroundColor: "#E5E7EB",
  justifyContent: "center",
  alignItems: "center",
},

avatarText: {
  fontSize: 14,
  fontWeight: "700",
  color: "#374151",
},

profileImg: {
  width: 40,
  height: 40,
  borderRadius: 25,
},

profileName: {
  fontSize: 16,
  fontWeight: "600",
  color: "#000",
  flexShrink: 1,          
  flexWrap: "wrap",
},

});
