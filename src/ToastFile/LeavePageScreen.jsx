import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
} from "react-native";
import AlertContainer from "../Assets/Images/AlertContainer.png"

const LeavePageScreen = ({ visible, onClose,discardClose }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >

            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <View style={{flexDirection:'row'}}>
                        <Image source={AlertContainer} style={{width:48,height:48}}/>
                        <View style={{marginLeft:10,flex:1}}>
                            <Text style={styles.headerTxt}>Leave this screen ?</Text>
                            <Text style={styles.subTxt}
                            numberOfLines={2}>If you leave, your unsaved changes will be dicarded.</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
                        <TouchableOpacity onPress={discardClose}
                        style={{flex:1,borderWidth:1,borderRadius:8,paddingVertical:10,marginRight:8,
                                justifyContent:'center',alignItems:'center',borderColor:'#D1D5DC',elevation:2,backgroundColor:'#ffffff'}}>
                            <Text style={{fontSize:16,fontFamily:'Gilroy-Medium',color:'#0A0A0A'}}>
                                Discard</Text>
                        </TouchableOpacity>

                        <TouchableOpacity  onPress={onClose}
                        style={{flex:1,backgroundColor:'#1E45E1',borderRadius:8,paddingVertical:10,marginLeft:8,
                                justifyContent:'center',alignItems:'center',elevation:2}}>
                            <Text style={{fontSize:16,fontFamily:'Gilroy-Medium',color:'#ffffff'}}>
                            Keep Editing</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default LeavePageScreen;

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        alignItems: "center",
        justifyContent: "center",
    },
    popup: {
        width: "85%",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
    },
    headerTxt: {
        fontSize: 20, fontFamily: 'Gilroy-Semibold'
    },
    subTxt: {
        fontSize: 15, fontFamily: 'Gilroy-Regular', color: '#64748B',
        marginTop: 10,flexShrink:1,lineHeight:20
    }
})