import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import ComingSoomImage from "../../Assets/Images/Coming_soon.png";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function AnnouncementScreen({onGoBack }) {
  const navigation = useNavigation();
  const announcements = [
    {
      id: 1,
      title: "August 2024 . Monthly Report",
      date: "01 Sep 2025",
      author: "Akash Rathod",
      likes: "11,565",
      comments: "986",
      avatar: require("../../Assets/Images/profile.png"),
    },
  
  ];

  return (
    // <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    //   {announcements.map((item) => (
    //     <View key={item.id} style={styles.card}>
       
    //       <View style={styles.header}>
    //         <Text style={styles.title}>{item.title}</Text>
    //         <Text style={styles.date}>{item.date}</Text>
    //       </View>

    //       <View style={styles.authorRow}>
    //         <Image source={item.avatar} style={styles.avatar} />
    //         <Text style={styles.authorName}>{item.author}</Text>
    //       </View>

    //       <View style={styles.footer}>
    //         <View style={styles.likeCommentRow}>
    //           <Text style={styles.iconText}>👍 {item.likes}</Text>
    //           <Text style={[styles.iconText, { marginLeft: 12 }]}>
    //             💬 {item.comments}
    //           </Text>
    //         </View>

    //         <TouchableOpacity style={styles.viewBtn}>
    //           <Text style={styles.viewText}>View →</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   ))}
    // </ScrollView>
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
    
          {/* <TouchableOpacity
  style={styles.button}
  onPress={onGoBack}
>
            <Text style={styles.buttonText}>← Go Back</Text>
          </TouchableOpacity> */}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F9FF",
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//     width: "75%",
//   },
//   date: {
//     fontSize: 12,
//     color: "#6B7280",
//   },
//   authorRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   avatar: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//   },
//   authorName: {
//     marginLeft: 8,
//     color: "#374151",
//     fontSize: 13,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 14,
//   },
//   likeCommentRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   iconText: {
//     fontSize: 12,
//     color: "#6B7280",
//   },
//   viewBtn: {
//     borderWidth: 1,
//     borderColor: "#3B82F6",
//     borderRadius: 20,
//     paddingVertical: 5,
//     paddingHorizontal: 14,
//   },
//   viewText: {
//     color: "#3B82F6",
//     fontWeight: "600",
//     fontSize: 13,
//   },
// });
