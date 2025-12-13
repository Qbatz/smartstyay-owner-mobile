import React, { useState,useCallback,useEffect,useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TouchableWithoutFeedback,Modal,BackHandler
} from "react-native";
import AddCategorySheet from "./AddRole";
import { useFocusEffect } from '@react-navigation/native';
import BackArrow from "../../../Assets/Images/Arrow_left.png";
import RoleProfile from "../../../Assets/Images/Avatar.png";
import Dots from "../../../Assets/Images/3dots.png";
import editIcon from "../../../Assets/Images/editIcon.png";
import Trash from "../../../Assets/Images/trash.png";
import TenantAddBlue from "../../../Assets/Images/TenantAddBlue.png";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import Loader from "../../../Component/Loader/Loader"

export default function RolesScreen({ navigation }) {
   const {activeHostelId } = useContext(CommonContexts);
    const {getRoleByHostel,deleteRole,loading} = UseSetting();
      const [openMenuId, setOpenMenuId] = useState(null);
 const [showAddSheet, setShowAddSheet] = useState(false);
 const [editData, setEditData] = useState(null);
    const [deletePopup, setDeletePopup] = useState(false)
  const [roleList,setRolesList] = useState([])
 
const [selectedRoleId, setSelectedRoleId] = useState(null);


    useEffect(() => {
  if (!activeHostelId) return;

  loadRoles();
}, [activeHostelId]);

const loadRoles = async () => {
  const res = await getRoleByHostel(activeHostelId);

  if (res.success) {
    console.log("Roles →", res.data);
    setRolesList(res.data);
  } else {
    console.log("Role API error →", res.data);
  }
};


    useFocusEffect(
           useCallback(() => {
             const onBackPress = () => {
             
         
               if (navigation.canGoBack()) {
                 navigation.goBack();
                 return true;
               }
         
               return false;
             };
         
             const subscription = BackHandler.addEventListener(
               "hardwareBackPress",
               onBackPress
             );
         
             return () => subscription.remove();
           }, [ navigation])
         );

 
const handleDelete = (roleId) => {
  setSelectedRoleId(roleId);
    setDeletePopup(true)
    setOpenMenuId(null)
  }
 const confirmDeleteRole = async () => {
  if (!selectedRoleId) return;

  const res = await deleteRole(selectedRoleId);

  if (res.success) {
    setDeletePopup(false);
    setSelectedRoleId(null);

    // 🔁 refresh role list
    loadRoles();
  } else {
    alert(res.data?.message || "Failed to delete role");
  }
};

const getPermissionCount = (role) => {
  if (!role?.rolesPermissionDetails) return 0;

  return role.rolesPermissionDetails.filter(p =>
    p.canRead || p.canWrite || p.canUpdate || p.canDelete
  ).length;
};

  return (
    <>
    <View style={styles.container}>

   
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={BackArrow}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Roles</Text>
      </View>

  { loading && <Loader />}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
 {roleList.map((item, i) => (
  <View key={item.id} style={{ position: "relative" }}>


    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <View style={styles.roleRow}>
          <Image
            source={RoleProfile}
            style={styles.roleIcon}
          />
          <Text style={styles.roleName}>{item.name}</Text>
        </View>

        {/* <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setOpenMenuId(openMenuId === i ? null : i)}
        >
          <Image
            source={Dots}
            style={styles.dotsIcon}
          />
        </TouchableOpacity> */}
        {![3, 4].includes(item.id) && (
  <TouchableOpacity
    style={styles.menuBtn}
    onPress={() => setOpenMenuId(openMenuId === i ? null : i)}
  >
    <Image source={Dots} style={styles.dotsIcon} />
  </TouchableOpacity>
)}
      </View>

    <Text style={styles.permissionCount}>
  {getPermissionCount(item)} Permissions Selected
</Text>

      <Text style={styles.desc}>{item.desc}</Text>
    </View>

   
    {openMenuId === i && (
      <>
        <TouchableWithoutFeedback onPress={() => setOpenMenuId(null)}>
          <View style={styles.fullOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.dropdownBox}>
          <TouchableOpacity style={styles.optionRow} onPress={() => {
    setEditData(item);       
    setShowAddSheet(true); 
    setOpenMenuId(null);   
  }}>
            <Image
              source={editIcon}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Edit</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.optionRow} onPress={() => handleDelete(item.id)}>
            <Image
              source={Trash}
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </>
    )}

  </View>
))}


      </ScrollView>

    {!loading && (
      <TouchableOpacity style={styles.addButton} onPress={() => { 
  setShowAddSheet(true); 
  setEditData(null); 
}}
  >
  <Image source={TenantAddBlue} style={styles.addIcon} />
</TouchableOpacity>
    )}
    </View>


        <Modal
                transparent
                animationType="fade"
                visible={deletePopup}
                onRequestClose={() => setDeletePopup(false)}
              >
                <View style={styles.deleteOverlay}>
                  <View style={styles.deleteBox}>
        
                    <Text style={styles.deleteTitle}>Delete Role?</Text>
                    <Text style={styles.deleteSub}>
                      Are you sure you want to delete this Role?
                    </Text>
        
                    <View style={styles.deleteBtnRow}>
        
        
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => setDeletePopup(false)}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
        
                      {/* Delete Button */}
                      <TouchableOpacity
                        style={styles.deleteBtn}
                         onPress={confirmDeleteRole}
                      >
                        <Text style={styles.deleteBtnText}>Delete</Text>
                      </TouchableOpacity>
        
                    </View>
        
                  </View>
                </View>
              </Modal>
    {showAddSheet && <AddCategorySheet onClose={() => setShowAddSheet(false)} editData={editData} navigation={navigation}  onSuccess={loadRoles}/>}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",paddingTop:20
  },

  
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },
  backIcon: { width: 20, height: 20, marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "700" },

  /* CARD */
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    borderColor: "#E6E6E6",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  roleIcon: {
    width: 22,
    height: 22,
    
  },

  roleName: {
    fontSize: 16,
    fontWeight: "700",
  },

  permissionCount: {
    marginTop: 6,
    color: "#1AA447",
    fontWeight: "600",
    fontSize: 13,
  },

  desc: {
    marginTop: 4,
    fontSize: 13,
    color: "#555",
  },

  /* MENU */
  menuBtn: { padding: 6 },
  dotsIcon: { width: 22, height: 22 },





 
  addButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
   
    width: 56,
    height: 56,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    
  },
  addIcon: { width: 45, height: 45, },
    fullOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "transparent",
  zIndex: 1,
},
  dropdownBox: {
  position: "absolute",
  top: 60,
  right: 30,
  backgroundColor: "#fff",
  paddingVertical: 6,
  width: 200,
  borderRadius: 12,
  elevation: 6,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  zIndex: 999,
},

optionRow: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 12,
},

optionIcon: {
  width: 18,
  height: 18,
  marginRight: 10,
 
},

optionText: {
  fontSize: 14,
  color: "#000",
  fontWeight: "500",
},

divider: {
  height: 1,
  backgroundColor: "#eee",
  marginVertical: 4,
},


deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },

  deleteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  deleteSub: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },

  deleteBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
  },

  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#2D6CDF",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
