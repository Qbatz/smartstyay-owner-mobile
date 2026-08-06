import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, Image, PanResponder, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Animated } from "react-native";
import { CommonContexts } from "../../Context/CommonContext";
import { getHostels } from "../../Action/HostelAction";
import { storeData } from "../../Utils/Storage";
import { ACTIVEHOSTELID } from "../../Utils/Constant";
import Loader from "../Loader/Loader";
import { useNavigation } from "@react-navigation/native";



export default function OtherHostelSwitchSheet({
    visible,
    onClose,
}) {

    const navigation=useNavigation();
    const translateY = useRef(new Animated.Value(500)).current;
    const { hostelList, activeHostelId, setActiveHostelId, updateHostelList } = useContext(CommonContexts)
    const [otherHostelsList, setOtherHostelsList] = useState([])
    const [selectedSwitchHostel, setSelectedSwitchHostel] = useState("")
    const [loading,setLoading]=useState(false)


    console.log(otherHostelsList)
    const reorderHostels = (list, activeId) => {
        const selected = list.find(h => (h.hostelId ?? h.id) === activeId);
        const others = list.filter(h => (h.hostelId ?? h.id) !== activeId);

        // return selected ? [selected, ...others] : list;
        return others;

    };


    useEffect(() => {
        if (visible) {
            setLoading(true)
            try {
                getHostels().then((res) => {
                    console.log("resactivehostel", res);

                    if (res?.data) {
                        if (activeHostelId) {
                            const reordered = reorderHostels(res.data, activeHostelId);
                            console.log(reordered)
                            setOtherHostelsList(reordered)
                            if (reordered.length > 0) {
                                setSelectedSwitchHostel(reordered?.[0])
                            }
                            setLoading(false)

                        } else {
                            setOtherHostelsList(res.data);
                        }

                    }
                    setLoading(false)
                });
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
    }, [visible]);


    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : 500,
            duration: 250,
            useNativeDriver: true,
        }).start();

        if (!visible);
    }, [visible]);

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
        onPanResponderMove: (_, g) => {
            if (g.dy > 0) translateY.setValue(g.dy);
        },
        onPanResponderRelease: (_, g) => {
            if (g.dy > 130) handleClose();
            else
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
        },
    });

    const handleClose = () => {
        setSelectedSwitchHostel("")
        onClose();
    }

    const handleActivate = (id) => {
        const selected = hostelList.find(h => (h.hostelId ?? h.id) === id);
        const others = hostelList.filter(h => (h.hostelId ?? h.id) !== id);

        updateHostelList([selected, ...others]);
        if (id) {
            setActiveHostelId(id);
            storeData(ACTIVEHOSTELID, id)
        }
        // navigation.navigate("MyTabs")
        handleClose();

    };;


    if (!visible) return null;

    return (
        <>
            <View style={styles.overlay}>
                {loading && <Loader/>}
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>


                <Animated.View
                    style={[styles.sheet, { transform: [{ translateY }] }]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.handler} />

                    <Text style={styles.headerTxt}>Switch to</Text>
                    {otherHostelsList && (
                        <FlatList
                            data={otherHostelsList}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.hostelId.toString()}
                            contentContainerStyle={{ paddingBottom: 80 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => setSelectedSwitchHostel(item)}
                                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: "row", alignItems: 'center', flex: 1 }}>
                                        <View style={{
                                            width: 60, height: 60, borderRadius: 30, justifyContent: 'center',
                                            alignItems: 'center', backgroundColor: '#E2E8FF',
                                        }}>
                                            {item?.mainImage ?
                                                <Image source={{ uri: item?.mainImage }} style={{ width: 60, height: 60, borderRadius: 30 }} /> :
                                                <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold' }}>{item?.initials}</Text>}
                                        </View>

                                        <View style={{ marginLeft: 6, flex: 1, marginRight: 16 }}>
                                            <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold', flexShrink: 1 }} numberOfLines={1}>
                                                {item?.name}</Text>
                                            <View style={styles.locationField}>
                                                <Text style={styles.locationTxt}>
                                                    {item?.city}</Text>
                                            </View>

                                        </View>
                                    </View>

                                    <View>
                                        {selectedSwitchHostel?.hostelId === item?.hostelId && (
                                            <View style={styles.slctdCircle}>
                                                <View style={{ backgroundColor: '#1E45E1', borderRadius: 7, width: 14, height: 14 }} />
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            )} />
                    )}
                    <View style={{ backgroundColor: '#ffffff', position: 'relative' }}>
                        <View style={styles.bottomField}>
                            <TouchableOpacity onPress={handleClose}
                                style={{
                                    flex: 1, borderWidth: 1, borderColor: '#E7E7E7', borderRadius: 12,
                                    paddingVertical: 14, justifyContent: 'center', alignItems: 'center', marginTop: 5, marginRight: 8
                                }}>
                                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Medium' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleActivate(selectedSwitchHostel?.hostelId)}
                                style={{
                                    flex: 1, backgroundColor: "#1E45E1", borderRadius: 12,
                                    paddingVertical: 14, justifyContent: 'center', alignItems: 'center', marginTop: 5, marginLeft: 8
                                }}>
                                <Text style={{ fontSize: 16, fontFamily: 'Gilroy-Semibold', color: '#ffffff' }}>
                                    Continue</Text>
                            </TouchableOpacity>

                        </View>
                    </View>



                </Animated.View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        // justifyContent: "flex-end",
        zIndex: 9999,
        elevation: 9999,
    },

    sheet: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20, maxHeight: "98%"
    },
    handler: {
        width: 30, height: 4, backgroundColor: "#D9D9D9", marginVertical: 6, alignSelf: 'center',
        justifyContent: 'center'
    },
    headerTxt: {
        fontSize: 20, fontFamily: 'Gilroy-Semibold', marginTop: 8
    },
    locationField: {
        backgroundColor: '#FFEFCF', paddingVertical: 3, paddingHorizontal: 8, alignSelf: 'flex-start',
        borderRadius: 20, marginTop: 6, justifyContent: 'center', alignItems: 'center'
    },
    locationTxt: {
        fontSize: 14, fontFamily: 'Gilroy-Medium',
    },
    bottomField: {
        position: 'absolute', bottom: 0, flexDirection: 'row',
        backgroundColor: '#ffffff', alignItems: 'center', justifyContent: "space-between",
    },
    slctdCircle: {
        borderWidth: 1, borderRadius: 10, width: 20, height: 20, alignItems: 'center',
        justifyContent: 'center', marginRight: 10, borderColor: '#1E45E1',
    },

})