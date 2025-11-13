import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import RectangleImg from "../../Assets/Images/Rectangle.png";
import Screen1Img from "../../Assets/Images/ORGANIZEDIMG.png";
import Screen2Img from "../../Assets/Images/BillOverviewimg.png";
import Screen3Img from "../../Assets/Images/amnitesimg.png";

const { width, height } = Dimensions.get("window");

const slides = [
    {
        id: 1,
        title: "Organized Data in One Place",
        desc: "View tenant lists, room allocations, and billing details from a single admin dashboard.",
        image: Screen1Img,
    },
    {
        id: 2,
        title: "Clear Billing Overview",
        desc: "Instantly access all billing records including rent, food, electricity, and payment status.",
        image: Screen2Img,
    },
    {
        id: 3,
        title: "Amenities & Reports Access",
        desc: "Track which tenants are using amenities like Gym or Wi-Fi and download basic reports.",
        image: Screen3Img,
    },
];

export default function LandingScreen() {
    return (
        <View style={styles.container}>


            <View style={styles.swiperContainer}>
                <SwiperFlatList
                    index={0}
                    showPagination
                    paginationPressable
                    paginationActiveColor="#1A73E8"
                    paginationDefaultColor="#D3D3D3"

                    paginationStyle={{ marginTop: 15 }}
                    paginationStyleItem={{ width: 8, height: 8, marginHorizontal: 4, cursor: "pointer" }}
                    data={slides}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <View style={styles.card}>
                                <Image source={item.image} style={styles.image} />
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.desc}>{item.desc}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>


            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Login with Credentials</Text>
            </TouchableOpacity>


            <Image source={RectangleImg} style={styles.waveImage} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },

    
    swiperContainer: {
        height: height * 0.65,    
        width: "100%",
        marginTop: 60,
    },


    slide: {
        width: width,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        width: width * 0.70,
        backgroundColor: "#fff",
        borderRadius: 25,
        paddingVertical: 28,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#E6EAF2",
        alignItems: "center",
        elevation: 5,
    },

    image: {
        width: 240,
        height: 180,
        resizeMode: "contain",
        marginBottom: 20,
    },

    title: {
        fontSize: 22,
        fontWeight: "600",
        textAlign: "center",
        color: "#000",
        marginBottom: 8,
        fontFamily: "Gilroy"
    },

    desc: {
        fontSize: 14,
        textAlign: "center",
        color: "#666",
        lineHeight: 20,
        paddingHorizontal: 15,
    },

    button: {
        width: width * 0.78,
        height: 52,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1A73E8",
        marginBottom: 25,
        elevation: 5,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

    waveImage: {
        width: "100%",
        height: 140,
        position: "absolute",
        bottom: 0,
        resizeMode: "cover",
    },
});
