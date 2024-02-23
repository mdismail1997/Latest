import React from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Dimensions
} from "react-native";
import layout from "../../assets/styles/layout_checkin";
import { LinearGradient } from 'expo-linear-gradient';
import { color } from "../../assets/colors/colors";

export default class ClientTabs extends React.Component{
    stata = {
        appIsReady: false
    }

    tabIndex = 0;

    onPress = (tabIndex) => {
        this.tabIndex = tabIndex;
        this.props.onPress(tabIndex);
        this.setState({appIsReady:true});
    }

    render() {  
   
        return (
            <View style={styles.tabWraper}>
                <View style={styles.tabItem}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.btnTabItem,(this.tabIndex == 0 ? styles.selected : '')]}
                        onPress={() => {this.onPress(0)}}
                    >
                        <Text style={styles.btnSaveTextLbl}>Return Customer</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tabItem}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.btnTabItem,(this.tabIndex == 1 ? styles.selected : '')]}
                        onPress={() => {this.onPress(1)}}
                    >
                        <Text style={styles.btnSaveTextLbl}>New Customer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabWraper:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor:'red',
        borderRadius:5,
        height:50
    },
    tabItem:{
        width:300,
        height:50
    },
    selected:{
        backgroundColor: color.white
    },
    btnTabItem:{
        height:50,
        backgroundColor: color.lightWhite,
        justifyContent: "center",
        alignItems: "center",
    },
    btnTabLinear: {
        justifyContent: "center",
        alignItems: "center",
        //borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    btnSaveTextLbl:{
        backgroundColor:'transparent',
        fontSize:18,
        fontFamily:'Futura',
        color: color.mediumDark
    }

    
})