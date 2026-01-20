import React , {useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,BackHandler
} from "react-native";
import BackIcon from "../../../Assets/Images/Arrow_left.png";
import ComingSoomImage from "../../../Assets/Images/Coming_soon.png";

export default function Reports({ navigation }) {

    useEffect(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        navigation.goBack();
        return true;
      });
      return () => backHandler.remove();
    }, []);

  return (
    <View style={styles.container}>
      <Image
        source={ComingSoomImage}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        We’re still working on this feature!
      </Text>

      <Text style={styles.subtitle}>
        Our team is building something helpful for you.
        {"\n"}Check back again shortly.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>← Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: "100%",
    height: 230,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
