import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import layout from "../assets/styles/layout";
import FloatLabelSelect from "../components/FloatSelectInputPriceMultiple";
import { color } from "../assets/colors/colors";

export default class CustomercheckinSelectedCategory extends React.Component {
    state = {
        selectCategory: this.props.selectCategory
    };

    userData = this.props.userData;
    categories = this.props.categories;

    

    onPressCategory = (id, refdata) => {
        this.props.onPress(id, refdata);
    };

    render() {
        let selectServicesData = this.state.selectCategory;
        let selectServices = Object.keys(
            this.state.selectCategory
        ).map((x, i) => {
            let data = selectServicesData[x];
            let pricedisplay = "";
            let layoutstyle = '';
            if(i > 0){
                layoutstyle = styles.hrline;
            }
        
            return (
                <View key={x} style={layoutstyle}>
                    <View style={layout.floatGroup}>
                            <FloatLabelSelect
                                placeholder={pricedisplay}
                                value={data.customName != "" ? data.customName : data.name}
                                id={data.categoryid}
                                refdata={x}
                                onPressDynamic={this.onPressCategory}
                                ref={x}
                            />
                        </View>
                </View>
            );
        });

        return (
            <View style={{backgroundColor: color.lightWhite}}>
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
