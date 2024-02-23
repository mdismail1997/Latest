import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import layout from "../assets/styles/layout";
import FloatLabelSelect from "../components/FloatSelectInputPriceMultiple";
import FloatLabelSelectView from "../components/FloatSelectInputPriceView";
import FloatLabelInput from "../components/FloatLabelInput";
import { color } from "../assets/colors/colors";

export default class AppointmentSelectedServiceForTech extends React.Component {
    state = {
        selectServices: this.props.selectServices
    };

    /*
    onPress = () => {
        this.props.onPress(0,'service_' + this.state.count);
    }*/

    render() {
        //console.log(this.state.selectServices);
        let selectServicesData = this.state.selectServices;
        let selectServices = Object.keys(
            this.state.selectServices
        ).map((x, i) => {
            let data = selectServicesData[x];
            let dataId = parseInt(data.id.toString().replace('service_','').replace('combo_',''));
            let pricedisplay = "";
            //let layoutstyle = layout.floatGroup;
            let layoutstyle = '';
            
            if(i > 0){
                layoutstyle = styles.hrline;
            }
            if (data.price > 0) pricedisplay = "$" + data.price;
            let comboDisplay = '';
            
  
            return (
                <View key={x} style={layoutstyle}>
                    <View style={layout.floatGroup}>
        
                            <FloatLabelSelectView
                                placeholder={pricedisplay}
                                value={data.service_name}
                                id={data.id}
                            />
                    </View>
                    
                    
                </View>
            );
        });

        return (
            <View style={{backgroundColor:color.lightWhite}}>
                {selectServices}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    plusservicecontainer: {
        justifyContent: "center",
        borderBottomWidth: 1 / 2,
        borderColor: color.grayishBlue,
        paddingLeft: 15
    },
    plusservice: {
        color: color.reddish
    },
    lblservicewraper:{
        paddingLeft:15,
        justifyContent:'center',
        backgroundColor: color.white,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder
    },
    lblservice:{
        
        fontSize:16
        
    },
    hrline:{
        marginTop: 10,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder
    },
    servicetext:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor: color.white,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
        alignItems:'center'
    },
    lefttext:{
        position:'absolute',
        left:15,
        fontSize:16
    },
    righttext:{
        position:'absolute',
        right:35,
        fontSize:16
    }
    
});
