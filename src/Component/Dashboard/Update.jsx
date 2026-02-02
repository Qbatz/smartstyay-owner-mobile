import React from "react";
import { View, Text, StyleSheet, ScrollView,Image,TouchableOpacity } from "react-native";
import ComingSoomImage from "../../Assets/Images/Coming_soon.png";

export default function UpdatesScreen({onGoBack}) {
  const updates = [
    {
      id: 1,
      date: "20 September 2024",
      title: "Introducing [Feature Name]: A Smarter Way to [Action/Benefit]",
      desc: "Lorem ipsum dolor sit amet consectetur. Sed sit est gravida varius est. Aliquet sapien tortor et mauris. Feugiat ut vestibulum mi sed varius vitae convallis purus. Pulvinar egestas mattis a sagittis a aliquet. Condimentum arcu ultricies vitae a. Ornare donec eget nec pulvinar amet pulvinar justo est. Orci ipsum luctus convallis dignissim porta facilisis a tincidunt arcu. Eget faucibus in euismod amet lectus ipsum aliquam. Lobortis sit suspendisse amet justo turpis. Blandit elementum posuere ut volutpat nisi sit nibh vitae nec.",
      images: [true, true],
      active: true,
    },
    {
      id: 2,
      date: "20 September 2024",
      title: "Introducing [Feature Name]: A Smarter Way to [Action/Benefit]",
      desc: "Lorem ipsum dolor sit amet consectetur. Sed sit est gravida varius est. Aliquet sapien tortor et mauris. Feugiat ut vestibulum mi sed varius vitae convallis purus. Pulvinar egestas mattis a sagittis a aliquet. Condimentum arcu ultricies vitae a. Ornare donec eget nec pulvinar amet pulvinar justo est. Orci ipsum luctus convallis dignissim porta facilisis a tincidunt arcu. Eget faucibus in euismod amet lectus ipsum aliquam.",
      images: [],
      active: false,
    },
    
  ];

  return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {updates.map((item, index) => (
//         <View key={item.id} style={styles.row}>
          
//           <View style={styles.timelineColumn}>
//             <View
//               style={[
//                 styles.dot,
//                 {
//                   backgroundColor: item.active ? "#3B82F6" : "#fff",
//                   borderWidth: item.active ? 0 : 2,
//                 },
//               ]}
//             />
//             {index < updates.length - 1 && <View style={styles.line} />}
//           </View>

       
//           <View style={styles.card}>
//             <Text style={styles.date}>{item.date}</Text>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.desc}>{item.desc}</Text>

            
            
//                 <View style={styles.imageRow}>
//   <View style={styles.imagePlaceholder} />
//   <View style={styles.imagePlaceholder} />
// </View>
//               </View>
          
       
//         </View>
//       ))}
//     </ScrollView>
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
  onPress={onGoBack}
>
            <Text style={styles.buttonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFF",
//     paddingHorizontal: 12,
//     paddingTop:5,
//     marginBottom:20
//   },
//   row: {
//     flexDirection: "row",
//     marginBottom: 30,
//   },
//   timelineColumn: {
//     width: 25,
//     alignItems: "center",
//   },
//   dot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     borderColor: "#3B82F6",
//     marginTop: 5,
//   },
//   line: {
//     width: 1,
//     flex: 1,
//     backgroundColor: "#E5E7EB",
//     marginTop: 2,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     elevation: 1,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   date: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginBottom: 6,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 8,
//   },
//   desc: {
//     fontSize: 13,
//     color: "#374151",
//     lineHeight: 20,
//   },
//   imageRow: {
//     flexDirection: "row",
//     marginTop: 12,
//   },
//   imagePlaceholder: {
//     width: 70,
//     height: 55,
//     backgroundColor: "#E7F1FF",
//     borderRadius: 8,
//     marginRight: 8,
//   },
// });
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