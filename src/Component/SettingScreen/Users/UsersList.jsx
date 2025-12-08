import React,{useCallback,useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,BackHandler,TouchableWithoutFeedback,Modal
} from "react-native";

import MenuIcon from "../../../Assets/Images/3dots.png";
import PlusIcon from "../../../Assets/Images/TenantAddBlue.png";
import { useFocusEffect } from '@react-navigation/native';
import BackArrow from "../../../Assets/Images/Arrow_left.png";
import EditIcon from "../../../Assets/Images/editIcon.png";
import Trash from "../../../Assets/Images/trash.png";
import AddUserBottomSheet from "./AddUser";

export default function UsersScreen({navigation}) {
  const users = [
    { name: "Kavitha", role: "Accounts Manager", email: "kavitha@gmail.com", phone: "+91 98765 43210" },
    { name: "Vishwa", role: "Accounts Manager", email: "vishwa@gmail.com", phone: "+91 98765 43210" },
    { name: "Mukesh", role: "Accounts Manager", email: "mukesh@gmail.com", phone: "+91 98765 43210" },
    { name: "Sri Dharan", role: "Office Admin", email: "mukesh@gmail.com", phone: "+91 98765 43210" },
    
  ];
  const [showAddSheet, setShowAddSheet] = React.useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editData, setEditData] = useState(null);
   const [deletePopup, setDeletePopup] = useState(false)

  const handleDelete = () => {
    setDeletePopup(true)
    setOpenMenuId(null)
  }

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

  return (
    <>
    <View style={styles.container}>
      
 
      <View style={styles.header}>
       <TouchableOpacity onPress={() => navigation.goBack()}>

  <Image source={BackArrow} style={styles.backArrow}/>
</TouchableOpacity>
        <Text style={styles.headerTitle}>Users</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {users.map((u, i) => (
          <View key={i} style={styles.card}>
            
            {/* Top row */}
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.name}>{u.name}</Text>
                <Text style={styles.role}>{u.role}</Text>
              </View>

              <TouchableOpacity style={styles.menuIconWrap}  onPress={() => setOpenMenuId(openMenuId === i ? null : i)}>
                <Image source={MenuIcon} style={styles.menuIcon} />
              </TouchableOpacity>

 

            </View>
                         {openMenuId === i && (
                          <>
                          <TouchableWithoutFeedback onPress={() => setOpenMenuId(null)}>
      <View style={styles.fullOverlay} />
    </TouchableWithoutFeedback>
  <View style={styles.dropdownBox}>
    <TouchableOpacity style={styles.optionRow} onPress={() => {
    setEditData(u);       
    setShowAddSheet(true); 
    setOpenMenuId(null);   
  }}>
      <Image 
        source={EditIcon} 
        style={styles.optionIcon} 
      />
      <Text style={styles.optionText}>Edit</Text>
    </TouchableOpacity>

    <View style={styles.divider} />

    <TouchableOpacity style={styles.optionRow} onPress={handleDelete}>
      <Image 
        source={Trash} 
        style={styles.optionIcon} 
      />
      <Text style={styles.optionText}>Delete</Text>
    </TouchableOpacity>
  </View>
  </>
)}

            {/* info rows */}
            <View style={styles.rowBetween}>
              <View style={{ width: "50%" }}>
                <Text style={styles.label}>Email ID</Text>
                <Text style={styles.value}>{u.email}</Text>
              </View>

              <View>
                <Text style={styles.label}>Contact Number</Text>
                <Text style={styles.value}>{u.phone}</Text>
              </View>
            </View>

          </View>
          
        ))}
      </ScrollView>

    
      <TouchableOpacity
  style={styles.fab}

   onPress={() => {
       setEditData(null)
    setShowAddSheet(true); 
    setOpenMenuId(null);   
  }}
>
  <Image source={PlusIcon} style={styles.fabIcon} />
</TouchableOpacity>



    </View>



    <Modal
            transparent
            animationType="fade"
            visible={deletePopup}
            onRequestClose={() => setDeletePopup(false)}
          >
            <View style={styles.deleteOverlay}>
              <View style={styles.deleteBox}>
    
                <Text style={styles.deleteTitle}>Delete User?</Text>
                <Text style={styles.deleteSub}>
                  Are you sure you want to delete this User?
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
                    onPress={() => {
                      console.log("DELETE CONFIRMED");
                      setDeletePopup(false);
                    }}
                  >
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
    
                </View>
    
              </View>
            </View>
          </Modal>
    <AddUserBottomSheet
  visible={showAddSheet}
  onClose={() => setShowAddSheet(false)}
    editData={editData}
/>

    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    paddingTop:20
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  backArrow: {
  width:20,
  height:20,
  marginRight:8
  },
  fullOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "transparent",
  zIndex: 1,
},


  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  role: {
    fontSize: 14,
    color: "#1E9C4B",
    marginTop: 2,
  },

  label: {
    fontSize: 12,
    color: "#777",
  },

  value: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },

  menuIconWrap: {
    padding: 6,
  },

  menuIcon: {
    width: 20,
    height: 20,
  },

  fab: {
    position: "absolute",
    bottom: 64,
    right: 24,
    
  
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
   
  },

  fabIcon: {
    width: 44,
    height: 44,
   
  },
  dropdownBox: {
  position: "absolute",
  top: 40,
  right: 10,
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
