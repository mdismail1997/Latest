import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import layout from "../assets/styles/layout";
import FloatLabelSelect from "../components/FloatSelectInputPriceMultiple";
import { color } from "../assets/colors/colors";

export default class AppointmentSelectedService extends React.Component {
    state = {
        selectServices: this.props.selectServices
    };
    userData = this.props.userData;
    services = this.props.services;
    combos = this.props.combos;
    onPressService = (id, refdata) => {
        this.props.onPress(id, refdata);
    };

    onPressTechnician = (id, refdata) => {
        this.props.onPressTechnician(id, refdata);
    };
    render() {
        let selectServicesData = this.state.selectServices;
        let selectServices = Object.keys(
            this.state.selectServices
        ).map((x, i) => {
            let data = selectServicesData[x];
            let dataId = parseInt(data.id.toString().replace('service_','').replace('combo_',''));
            let pricedisplay = "";
            let layoutstyle = '';
            if(i > 0){
                layoutstyle = styles.hrline;
            }
            if (data.price > 0) pricedisplay = "$" + data.price;
            let comboDisplay = '';
            return (
                <View key={x} style={layoutstyle}>
                    <View style={layout.floatGroup}>
                            <FloatLabelSelect
                                placeholder={pricedisplay}
                                value={data.service_name}
                                id={data.id}
                                refdata={x}
                                onPressDynamic={this.onPressService}
                                ref={x}
                                //ref="clientInput"
                            />
                        </View>
                    
                    {
                        dataId > 0 && this.userData.role == 4 && !data.isCombo
                        &&
                        <View style={layout.floatGroup}>
                            <FloatLabelSelect
                                placeholder={''}
                                value={data.technicianName}
                                id={data.technicianId}
                                refdata={x}
                                onPressDynamic={this.onPressTechnician}
                                ref={x}
                                //ref="clientInput"
                            />
                        </View>
                    }

                    {
                        dataId > 0 && this.userData.role == 4 && data.isCombo
                        && typeof data.servicesIncombo != 'undefined' &&
                        data.servicesIncombo.map((serviceitem, i) => {
                            return (
                                <View style={layout.floatDoubleGroup}
                                     key={serviceitem.serviceid + '_' + serviceitem.sp_combo_id}>
                                    <View style={[layout.floatGroup,styles.lblservicewraper]}>
                                        <Text style={styles.lblservice}>{serviceitem.servicename}</Text>
                                    </View>
                                    <View style={layout.floatGroup}>
                                        <FloatLabelSelect
                                            placeholder={''}
                                            value={serviceitem.technicianName}
                                            id={serviceitem.technicianId}
                                            refdata={x + '@combo' + serviceitem.serviceid}
                                            onPressDynamic={this.onPressTechnician}
                                            ref={x + '@combo' + serviceitem.serviceid}
                                            //ref="clientInput"
                                        />
                                    </View>
                                </View>
                                
                            )        
                        })
                        
                    }
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
