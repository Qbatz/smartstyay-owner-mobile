import React, { useContext, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, PanResponder, ScrollView, Image, TouchableOpacity, NativeModules } from "react-native";
import Dots from "../../../Assets/Images/3dots.png";
import ShareIcon from "../../../Assets/Images/share.png";
import DownloadIcon from "../../../Assets/Images/download.png";
import { CommonContexts } from "../../../Context/CommonContext";
import { BillContext } from "../../../Context/BillsContext";


export default function TransactionDetailSheet({ visible, onClose, selectedTransaction }) {

    const { activeHostelId } = useContext(CommonContexts);
    const { shareReceiptOnWhatsapp,downloadReceipt } = useContext(BillContext);
    const detailsSheetY = useRef(new Animated.Value(0)).current;
    
    const { CommonModule } = NativeModules;

    console.log("selectedTransaction", selectedTransaction);
    

    useEffect(() => {
        if (visible) {
            detailsSheetY.setValue(300);

            Animated.timing(detailsSheetY, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible])

    const billDetailsPan = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) detailsSheetY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 120) {
                    Animated.timing(detailsSheetY, {
                        toValue: 700,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        onClose(); // ✅ IMPORTANT
                        detailsSheetY.setValue(0);
                    });
                } else {
                    Animated.spring(detailsSheetY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handelShare = async (transactionId) => {
        if (!activeHostelId || !transactionId) return;

        const res = await shareReceiptOnWhatsapp(activeHostelId, transactionId);
        console.log(res)

        if (res?.success && res?.data) {
            await CommonModule.downloadAndShareFile(res.data)
        } else {
            console.log(res?.message);
        }

    }

    const handleDowload=async(transactionId)=>{
          if (!activeHostelId || !transactionId) return;

          const res= await downloadReceipt(activeHostelId,transactionId);

          if(res.success || res.url){
            await CommonModule.downloadAndViewDocument(res.url)
          }else {
            console.log(res?.message);
        }
    }

    if (!visible) return null;

    return (
        <>
            <View style={styles.sheetOverlay}>
                <TouchableWithoutFeedback onPress={() => onClose()}>
                    <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>


                <Animated.View
                    style={[styles.transactionSheet,
                    { transform: [{ translateY: detailsSheetY }] }
                    ]}
                    {...billDetailsPan.panHandlers}
                >
                    <View style={styles.sheetHandle} />

                    <ScrollView >
                        <View style={styles.header}>
                            {/* <Text style={styles.billNametxt}>{selectedTransaction?.billName}</Text> */}
                            <Text style={styles.billNametxt}>Transaction Details</Text>

                            {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Text style={styles.paymentStatus}>{selectedTransaction?.status}</Text>
                                <Image source={Dots} style={{ width: 30, height: 30 }} />
                            </View> */}
                        </View>

                        <View style={{ borderWidth: 0.5, marginVertical: 15, borderColor: '#E7F1FF' }} />

                        <View style={styles.detaislFeild}>
                            <Text style={styles.totalLabel}>Total Paid</Text>
                            <Text style={styles.amntLabel}>₹ {selectedTransaction?.amountPaid}</Text>
                        </View>

                        <View style={styles.detaislFeild}>
                            <Text style={styles.headerLabel}>Payment Mode</Text>
                            <Text style={styles.valueLabel}>{selectedTransaction?.paymentMode}</Text>
                        </View>

                        <View style={[styles.detaislFeild, { marginTop: 12 }]}>
                            <Text style={styles.headerLabel}>Transaction ID</Text>
                            <Text style={styles.valueLabel}>{selectedTransaction?.transactionReferenceNumber}</Text>
                        </View>

                        <View style={[styles.detaislFeild, { marginTop: 12 }]}>
                            <Text style={styles.headerLabel}>Date</Text>
                            <Text style={styles.valueLabel}>{selectedTransaction?.transactionDate}</Text>
                        </View>

                        <View style={[styles.detaislFeild, { marginTop: 12 }]}>
                            <Text style={styles.headerLabel}>Paid To</Text>
                            <Text style={styles.valueLabel}>{selectedTransaction?.paidTo}</Text>
                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                            <TouchableOpacity style={styles.paidBtn} 
                            onPress={() => handelShare(selectedTransaction?.transactionId)}>
                                <Image source={ShareIcon} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.paidBtn}
                            onPress={() => handleDowload(selectedTransaction?.transactionId)}>
                                <Image source={DownloadIcon} style={{ width: 20, height: 20 }} />
                            </TouchableOpacity>

                        </View>
                    </ScrollView>

                </Animated.View>
            </View>
        </>
    )

}

const styles = StyleSheet.create({
    sheetOverlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
        zIndex: 9999,
    },
    transactionSheet: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 30,
        minHeight: 400,
    },
    sheetHandle: {
        width: 60,
        height: 5,
        backgroundColor: "#ccc",
        alignSelf: "center",
        borderRadius: 30,
        marginBottom: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', marginTop: 10
    },
    billNametxt: {
        fontSize: 18,
        fontFamily: 'Gilroy-Semibold'
    },
    paymentStatus: {
        backgroundColor: '#E8FFDE',
        color: '#53B928',
        fontSize: 13.72,
        fontFamily: 'Gilroy-Semibold',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        marginRight: 5
    },
    detaislFeild: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: 'Gilroy-Semibold',
    },
    amntLabel: {
        fontSize: 18,
        fontFamily: 'Gilroy-Semibold'
    },
    headerLabel: {
        fontSize: 14,
        fontFamily: "Gilroy-Medium",
        color: '#3C3C4399'
    },
    valueLabel: {
        fontSize: 14,
        fontFamily: "Gilroy-Semibold",
    },
    paidBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 6
    },

})