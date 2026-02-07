import React, { useRef, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
  Image,
  TextInput,
  BackHandler,
} from "react-native";
import { UseSetting } from "../../../Context/SettingContext";
import { CommonContexts } from "../../../Context/CommonContext";
import SuccessModal from "../../../ToastFile/ToastPage";
import ErrorMessage from "../../ErrorMessagr/Errormessagestyle";


export default function AddCategorySheet({ onClose, editData, onSuccess }) {
  const translateY = useRef(new Animated.Value(600)).current;
  const { getRoleModules, addRole, updateRole } = UseSetting();
  const { activeHostelId } = useContext(CommonContexts);
  const [initialRoleName, setInitialRoleName] = useState("");
  const [initialPermState, setInitialPermState] = useState([]);


  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [permState, setPermState] = useState([]);
  const [modalType, setModalType] = useState("success");
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [description,setDescription]=useState("")
  const toggleAll = () => {
    const newValue = !selectAll;

    setSelectAll(newValue);

    setPermState(
      permissions.map(() => ({
        add: newValue,
        read: newValue,
        edit: newValue,
        del: newValue,
      }))
    );
  };


  const roles = ["Accounts Manager", "Office Admin", "Hostel Manager", "Staff"];


  useEffect(() => {
    const backAction = () => {
      handleClose();
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => sub.remove();
  }, []);


  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, []);


  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: 600,
      duration: 220,
      useNativeDriver: true,
    }).start(() => onClose());
  };
  const isSamePermission = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  useEffect(() => {
    if (!editData || permissions.length === 0) return;

    setSelectedRole(editData.name);
    setInitialRoleName(editData.name);

    const updatedPermState = permissions.map((module) => {
      const found = editData.rolesPermissionDetails?.find(
        (p) => p.moduleId === module.id
      );

      return {
        add: !!found?.canWrite,
        read: !!found?.canRead,
        edit: !!found?.canUpdate,
        del: !!found?.canDelete,
      };
    });

    setPermState(updatedPermState);
    setInitialPermState(updatedPermState);

    setSelectAll(
      updatedPermState.every(
        (r) => r.add && r.read && r.edit && r.del
      )
    );
  }, [editData, permissions]);






  console.log("EDIT DATA", editData);
  console.log("PERMISSIONS", permissions);
  console.log("PERM STATE", permState);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 120) handleClose();
      else
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
    },
  });

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    const res = await getRoleModules();

    if (res.success) {
      const modules = res.data.data || res.data;

      setPermissions(modules);

      setPermState(
        modules.map(() => ({
          add: false,
          read: false,
          edit: false,
          del: false,
        }))
      );
    } else {
      console.log("Module API error", res.data);
    }
  };

  console.log("Module permissions", permissions);



  const toggle = (rowIndex, key) => {
    setPermState((prev) => {
      const updated = [...prev];
      const row = { ...updated[rowIndex] };

      if (key === "read") {
        row.read = !row.read;

        if (!row.read) {
          row.edit = false;
          row.del = false;
        }
      }

      else if (key === "edit" || key === "del") {
        row[key] = !row[key];

        if (row[key]) {
          row.read = true;
        }
      }

      else if (key === "add") {
        row.add = !row.add;
      }

      updated[rowIndex] = row;

      // 🔁 Update Select All checkbox
      const allChecked = updated.every(
        (r) => r.add && r.read && r.edit && r.del
      );
      setSelectAll(allChecked);

      return updated;
    });
  };

  const TickBox = ({ checked, onPress, disabled }) => (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      style={[
        styles.tickBox,
        {
          borderColor: checked ? "#1DBF73" : "#AFAFAF",
          backgroundColor: checked ? "#1DBF73" : "white",
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      {checked && <Text style={styles.tickMark}>✓</Text>}
    </TouchableOpacity>
  );


  const buildPermissionList = () => {
    return permissions.map((module, index) => ({
      moduleId: module.id,
      canRead: permState[index]?.read || false,
      canWrite: permState[index]?.add || false,
      canUpdate: permState[index]?.edit || false,
      canDelete: permState[index]?.del || false,
    }));
  };
  const [roleError, setRoleError] = useState("");
  const [permissionError, setPermissionError] = useState("");
  const hasAnyPermission = () => {
    return permState.some(
      (p) => p.add || p.read || p.edit || p.del
    );
  };

  const handleSaveRole = async () => {
    let valid = true;
    setRoleError("");
    setPermissionError("");


    if (!selectedRole.trim()) {
      setRoleError("Role name is required");
      valid = false;
    }


    if (!hasAnyPermission()) {
      setPermissionError("At least one permission must be selected");
      valid = false;
    }

    if (!valid) return;

    if (
      editData &&
      selectedRole === initialRoleName &&
      isSamePermission(permState, initialPermState)
    ) {

      setModalType("warning");
      setMessage("No changes detected");
      setShowSuccess(true);




      setTimeout(() => {
        setShowSuccess(false)
      }, 800);
      return;
    }

    const permissionList = buildPermissionList();

    const payload = {
      hostelId: activeHostelId,
      roleName: selectedRole,
      permissionList,
    };

    let res;

    if (editData?.id) {
      res = await updateRole(editData.id, payload); // PUT
    } else {
      res = await addRole(payload);
    }

    if (res.success) {
      setModalType("success");
      setMessage(editData ? res.data : res.data);
      setShowSuccess(true);

      onSuccess && onSuccess();


      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 800);
    }
    else {
      alert(res.data?.message || "Failed to save role");
    }
  };



  return (
    <>
      <SuccessModal
        visible={showSuccess}
        message={message}
        type={modalType}

      />
      <View style={styles.overlay}>
        {/* Sheet */}
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              {editData ? "Edit Category" : "Add Category"}
            </Text>



            <Text style={styles.label}>
              Role <Text style={{ color: "red" }}>*</Text>
            </Text>

            <TextInput
              style={styles.dropdownBox}
              placeholder="Enter role name"
              value={selectedRole}
              onChangeText={(text) => {
                const filtered = text.replace(/[^A-Za-z0-9./#@]/g, "");
                setSelectedRole(filtered);
                if (text.trim()) {
                  setRoleError("");
                }
              }}


              editable={!editData || ![3, 4].includes(editData?.id)}
            />
            {roleError && (
              <ErrorMessage message={roleError} type="error" />
            )}

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Manage all except Banking & Finance"
              multiline
               value={description}
              onChangeText={(text) => {
                const filtered = text.replace(/[^A-Za-z0-9./#@!^&*()]/g, "");
                setDescription(filtered);
                // if (text.trim()) {
                //   setRoleError("");
                // }
              }}
              
            />
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
              <TickBox checked={selectAll} onPress={toggleAll} />
              <Text style={{ marginLeft: 10, fontSize: 14, fontWeight: "600" }}>
                Select All
              </Text>
            </View>


            <View style={styles.tableWrapper}>
              <ScrollView horizontal nestedScrollEnabled>
                <View>
                  <View style={styles.headerRow}>
                    <Text style={styles.permissionFixedHeader}>Permission</Text>

                    <View style={styles.headerRight}>
                      {["Add", "Read", "Edit", "Delete"].map((h) => (
                        <View key={h} style={styles.headerCell}>
                          <Text style={styles.headerLabel}>{h}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <ScrollView style={{ maxHeight: 380 }} nestedScrollEnabled>
                    {permissions.map((p, i) => (
                      <View key={i} style={styles.row}>
                        <Text style={styles.permissionFixed}>{p.moduleName}</Text>

                        <View style={styles.rightRow}>
                          <TickBox checked={permState[i].add} onPress={() => {
                            toggle(i, "add");
                            setPermissionError("");
                          }} />
                          <TickBox checked={permState[i].read} onPress={() => { toggle(i, "read"); setPermissionError(""); }} />
                          <TickBox checked={permState[i].edit} onPress={() => { toggle(i, "edit"); setPermissionError(""); }} />
                          <TickBox checked={permState[i].del} onPress={() => { toggle(i, "del"); setPermissionError(""); }} />
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
            {permissionError && (
              <ErrorMessage message={permissionError} type="error" />
            )}

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveRole}>
              <Text style={styles.saveText}>Save Category</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
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
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    height: "92%",
  },

  handle: {
    width: 60,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  label: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: "600",
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

  dropdownMenu: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 130,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    zIndex: 999,
    elevation: 6,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  optionText: {
    fontSize: 15,
    color: "#000",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    height: 70,
    marginTop: 6,
  },

  /* TABLE */
  tableWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginTop: 20,
    overflow: "hidden",
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#E8ECFF",
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  permissionFixedHeader: {
    width: 150,
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
  },

  headerRight: {
    flexDirection: "row",
  },

  headerCell: {
    width: 90,
    alignItems: "center",
    paddingRight: 15,
  },

  headerLabel: {
    fontSize: 13,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },

  permissionFixed: {
    width: 150,
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 10,
  },

  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  tickBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
  },

  tickMark: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

  saveBtn: {
    backgroundColor: "#1D5BEE",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },

  saveText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
