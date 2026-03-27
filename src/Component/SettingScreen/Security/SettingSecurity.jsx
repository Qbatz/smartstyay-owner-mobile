import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,BackHandler ,
} from "react-native";
import ArrowLeft from "../../../Assets/Images/Arrow_left.png";

export default function SecuritySettings({ navigation }) {
  /* -----------------------------------------------------
     STATES
  ----------------------------------------------------- */
  const [settings, setSettings] = useState({
    recurring: true,
    emailToggle: false,
    smsToggle: true,
  })

  const [initialSettings, setInitialSettings] = useState(settings);

  /* -----------------------------------------------------
     ANIMATED VALUES FOR 3 SWITCHES
  ----------------------------------------------------- */
  const recurringAnim = useRef(new Animated.Value(settings.recurring ? 18 : 0)).current;
  const emailAnim = useRef(new Animated.Value(settings.emailToggle ? 18 : 0)).current;
  const smsAnim = useRef(new Animated.Value(settings.smsToggle ? 18 : 0)).current;

  const getAnimRef = (key) => ({
    recurring: recurringAnim,
    emailToggle: emailAnim,
    smsToggle: smsAnim,
  }[key]);

 useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();  
        return true;
      }
    );
  
    return () => backHandler.remove();
  }, []);

  /* -----------------------------------------------------
     HANDLE SWITCH CHANGE + ANIMATION
  ----------------------------------------------------- */
  const toggleSwitch = (key) => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));

    Animated.timing(getAnimRef(key), {
      toValue: newValue ? 18 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  /* -----------------------------------------------------
     SAVE BUTTON ACTIVATION
  ----------------------------------------------------- */
  const isChanged = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  /* -----------------------------------------------------
     SUCCESS TOAST ANIMATION
  ----------------------------------------------------- */
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = () => {
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  /* -----------------------------------------------------
     SAVE TO API
  ----------------------------------------------------- */
  const saveSettings = async () => {
    console.log("Saving to API:", settings);

    // Mock API call
    await new Promise((res) => setTimeout(res, 500));

    setInitialSettings(settings);
    showToast();
  };

  /* -----------------------------------------------------
     CUSTOM SWITCH RENDERER (Animated)
  ----------------------------------------------------- */
  const renderSwitch = (value, key) => {
    const anim = getAnimRef(key);

    return (
      <TouchableOpacity onPress={() => toggleSwitch(key)}>
        <View
          style={[
            styles.switch,
            { backgroundColor: value ? "#3562FF" : "#A68DE3" },
          ]}
        >
          <Animated.View
            style={[
              styles.knob,
              {
                transform: [{ translateX: anim }],
              },
            ]}
          >
            <Text style={styles.knobText}>{value ? "✓" : "✕"}</Text>
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };

  /* -----------------------------------------------------
     UI
  ----------------------------------------------------- */

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={ArrowLeft} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.title}>Security</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ITEM 1 */}
        <View style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Recurring Bill Settings</Text>
            <Text style={styles.desc}>
             Enhance your account security by enabling two-factor authentication. This adds an extra layer of protection, ensuring only you can access your account.
            </Text>
          </View>

          <View style={{display:'flex', flexDirection:'row', alignItems: "flex-end" }}>
            <Text style={styles.labelOn}>
              {settings.recurring ? "On" : "Off"}
            </Text>
            {renderSwitch(settings.recurring, "recurring")}
          </View>
        </View>

        {/* ITEM 2 */}
        <View style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Email Setup</Text>
            <Text style={styles.desc}>
              Receive verification codes and alerts via email.
            </Text>
          </View>

          <View style={{display:'flex', flexDirection:'row', alignItems: "flex-end" }}>
            <Text style={styles.labelOn}>
              {settings.emailToggle ? "On" : "Off"}
            </Text>
            {renderSwitch(settings.emailToggle, "emailToggle")}
          </View>
        </View>

        {/* ITEM 3 */}
        <View style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>SMS Setup</Text>
            <Text style={styles.desc}>
              Receive login alerts & verification codes via SMS.
            </Text>
          </View>

          <View style={{display:'flex', flexDirection:'row', alignItems: "flex-end" }}>
            <Text style={styles.labelOn}>
              {settings.smsToggle ? "On" : "Off"}
            </Text>
            {renderSwitch(settings.smsToggle, "smsToggle")}
          </View>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { opacity: isChanged ? 1 : 0.5 },
          ]}
          disabled={!isChanged}
          onPress={saveSettings}
        >
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* SUCCESS TOAST */}
      <Animated.View
        style={[
          styles.toast,
          { opacity: toastOpacity },
        ]}
      >
        <Text style={styles.toastText}>Settings Updated Successfully</Text>
      </Animated.View>
    </View>
  );
}

/* -----------------------------------------------------
     STYLES
----------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 45,
    marginBottom: 20,
  },

  backArrow: { width: 22, height: 22, marginRight: 10 },

  title: {
    fontSize: 20,
    fontFamily:'Gilroy-Semibold'
  },

  item: {
    flexDirection: "row",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: "#F1F1F1",
  },

  label: { fontSize: 16,fontFamily:'Gilroy-Semibold'},

  desc: {
    fontSize: 13,
    fontFamily:'Gilroy-Regular',
    color: "#6B7280",
    lineHeight: 18,
    paddingRight: 40,
  },

  labelOn: {
    fontSize: 12,
    color: "#3562FF",
    marginBottom: 5,
    marginRight:7
  },

  switch: {
    width: 42,
    height: 24,
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
  },

  knob: {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  knobText: {
    fontSize: 10,
    fontWeight: "700",
  },

  saveBtn: {
    backgroundColor: "#2D6CDF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: 160,
    alignSelf: "flex-end",
    marginTop: 20,
  },

  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  toast: {
    position: "absolute",
    bottom: 60,
    left: "12%",
    right: "12%",
    backgroundColor: "#2D6CDF",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },

  toastText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

});
