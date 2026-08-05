import React, { useContext, useEffect, useRef, useState } from "react";
import { FlatList, Image, PanResponder, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Animated } from "react-native";
import { CommonContexts } from "../../Context/CommonContext";
import { getHostels } from "../../Action/HostelAction";



export default function OtherHostelSwitchSheet({
    visible,
    onClose,
}) {

    const translateY = useRef(new Animated.Value(500)).current;
    const { hostelList, activeHostelId } = useContext(CommonContexts)
    const [otherHostelsList, setOtherHostelsList] = useState([])



    const reorderHostels = (list, activeId) => {
        const selected = list.find(h => (h.hostelId ?? h.id) === activeId);
        const others = list.filter(h => (h.hostelId ?? h.id) !== activeId);

        return selected ? [selected, ...others] : list;

    };


    useEffect(() => {
        getHostels().then((res) => {
            console.log("resactivehostel", res);

            if (res?.data) {
                if (activeHostelId) {
                    const reordered = reorderHostels(res.data, activeHostelId);
                    setOtherHostelsList(reordered)
                } else {
                    setOtherHostelsList(res.data);
                }

            }
        });
    }, []);


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
            if (g.dy > 130) onClose();
            else
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
        },
    });

    if (!visible) return null;

    return (
        <>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback >
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
                            // key={}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                    <View style={{
                                        width: 60, height: 60, borderRadius: 30, justifyContent: 'center',
                                        alignItems: 'center', backgroundColor: '#E2E8FF',
                                    }}>
                                        {item?.mainImage ?
                                            <Image source={{ uri: item?.mainImage }} style={{ width: 60, height: 60, borderRadius: 30 }} /> :
                                            <Text style={{ fontSize: 14, fontFamily: 'Gilroy-Semibold' }}>{item?.initials}</Text>}
                                    </View>

                                    <View style={{ marginLeft: 6 }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'Gilroy-Semibold' }}>{item?.name}</Text>
                                        <Text style={styles.locationField}>
                                            {item?.city}</Text>

                                    </View>
                                </TouchableOpacity>
                            )} />
                    )}
                    <View style={{ backgroundColor: '#ffffff', position: 'relative' }}>
                        <View style={styles.bottomField}>
                            <TouchableOpacity style={{
                                flex: 1, borderWidth: 1, borderColor: '#E7E7E7', borderRadius: 12,
                                paddingVertical: 14,justifyContent:'center',alignItems:'center',marginTop:5,marginRight:8
                            }}>
                                <Text style={{fontSize:16,fontFamily:'Gilroy-Medium'}}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flex: 1, backgroundColor: "#1E45E1", borderRadius: 12,
                                paddingVertical: 14,justifyContent:'center',alignItems:'center',marginTop:5,marginLeft:8
                             }}>
                                <Text style={{fontSize:16,fontFamily:'Gilroy-Semibold',color:'#ffffff'}}>
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
        fontSize: 14, fontFamily: 'Gilroy-Medium', backgroundColor: '#FFEFCF',
        paddingVertical: 3, paddingHorizontal: 8, borderRadius: 20, textAlign: 'center', marginTop: 6
    },
    bottomField: {
        position: 'absolute', bottom: 0, flexDirection: 'row',
        backgroundColor: '#ffffff', alignItems: 'center', justifyContent: "space-between",
    }
})