import React, { Component } from 'react';
import {StyleSheet, Text, TouchableOpacity, View } from "react-native";
import layout from "../assets/styles/layout";
import { getTextByKey } from '../helpers/language';
import CheckBox from 'react-native-check-box';
import collect from "collect.js";
import { color } from '../assets/colors/colors';
export default class CouponAppointment extends React.Component{
    state = {
        isShowPlusService: false,
        count: 0,
        DataserviceSelect: this.props.serviceSelect
    }

    promotions = {};
    grandTotal = 0;
    total = 0;
    serviceSelect = {};
    paid_total = this.props.paid_total;
    onPress = () => {
        this.props.onPress(0,'service_' + this.state.count);
    }
    setDataCoupon = (promotions) =>{
        this.promotions = promotions;
        this.setState({ isShowPlusService: true });
    }
    onChecked = (item,key) => {
        this.promotions[key].checked = item.checked ? false : true;
        this.setState({rerender: true });
    }
    setServices = (services) =>{ 
        let _this = this;
        _this.serviceSelect = services;
        _this.setState({rerender: true });
    }
    roundprice = (num) =>{
        return Math.round(num * 100) / 100;
    }
    renderCheckBoxPromotions=()=>{
        if(typeof(this.serviceSelect) == 'undefined'){
            return false;
        }
        let tempTotal = this.grandTotal;
        //console.log(tempTotal);
        if(tempTotal > 0){
            tempTotal -= this.paid_total;
        }
        tempTotal = this.roundprice(tempTotal);
        let _this = this;
        var display = Object.keys(this.promotions).map((key,i) => {

            let item = this.promotions[key];
            //console.log(item);
            let lbl = '';
            let availableAmount = 0;
            let disable = false;
            let amountpay = 0;
            if(item.id.split('-')[0] == "coupon"){
                let availableAmount = 0;
                let amount = 0;
                let paid_service = this.paid_total;
                if(Object.keys(_this.serviceSelect).length > 0){
                    if(item.service_type == 'allservice'){
                        if(item.discounttype == 'percent'){
                            amount = tempTotal * item.discountvalue / 100;
                        }else{
                            amount = item.discountvalue;
                        }
                    }else if(item.service_type == 'specifyservice' || item.service_type == 'exceptservice'){
                        amount = 0;
                        Object.keys(_this.serviceSelect).map((key,i) => {
                            let itemservice = _this.serviceSelect[key];
                            if(itemservice.isCombo == false){
                                let id = itemservice.id.split('_')[1];
                                if(item.services.indexOf(parseInt(id)) >= 0){
                                    let price = 0;
                                    if(paid_service > 0){
                                        if(itemservice.price >= paid_service){
                                            price = itemservice.price - paid_service;
                                            paid_service = 0;
                                        }else {
                                            price = 0;
                                            paid_service -= itemservice.price;
                                        }
                                    }else{
                                        price = itemservice.price;
                                    }
                                    if(price > 0){
                                        if(item.discounttype == 'percent'){
                                            amount += price * item.discountvalue / 100;
                                        }else{
                                            if(price <= item.discountvalue){
                                                amount += price;
                                            }else{
                                                amount += item.discountvalue;
                                            }
                                        }
                                    }
                                }else{
                                    if(paid_service > 0){
                                        if(itemservice.price >= paid_service){
                                            paid_service = 0;
                                        }else {
                                            paid_service -= itemservice.price;
                                        }
                                    }
                                }
                            }
                        })
                    }else{
                        amount = 0;
                    }
                }
                
                if (tempTotal <= amount) {
                    availableAmount = tempTotal;
                } else{
                    availableAmount = amount
                }
    
                if(availableAmount > 0){
                    item.appliedAmount = availableAmount; 
                }else{
                    item.appliedAmount = 0;
                } 
                if(item.checked && typeof(item.appliedAmount) != 'undefined'){
                    tempTotal -= availableAmount;
                }

            }else if(item.id.split('-')[0] == "membership"){
                let availableAmount = 0;
                let amount = 0;
                if(Object.keys(_this.serviceSelect).length > 0){
                    Object.keys(_this.serviceSelect).map((key,i) => {
                        let itemservice = _this.serviceSelect[key];
                        if(itemservice.isCombo == false){
                            let id = itemservice.id.split('_')[1];
                            if(item.services.indexOf(parseInt(id)) >= 0){
                                
                                amount += itemservice.price;
                            }
                        }
                    })
                }

                if (tempTotal <= amount) {
                    availableAmount = tempTotal;
                } else{
                    availableAmount = amount;
                }
                if(availableAmount > 0){
                    item.appliedAmount = availableAmount; 

                } 
                if(item.checked && typeof(item.appliedAmount) != 'undefined'){
                    tempTotal -= availableAmount;
                }
            }else if(item.id.split('-')[0] != "coupon" && item.id.split('-')[0] != "membership"){ 
                if (item.amount > 0 && item.checked) {
                    if (tempTotal <= item.amount) {
                        availableAmount = tempTotal;
                    } else{
                        availableAmount = item.amount;
                    }
                    tempTotal -= availableAmount;
                    amountpay = availableAmount;
                }else{
                    if (tempTotal <= item.amount) {
                        amountpay = tempTotal;
                    } else{
                        amountpay = item.amount;
                    }
                }
                if(availableAmount > 0){
                    item.appliedAmount = availableAmount;
                }
            }
            if(item.id == 'rewardpoint'){
                lbl = ''+getTextByKey(this.props.language,'Apply')+' ($'+amountpay+') '+getTextByKey(this.props.language,'reward point in total')+' $'+item.amount +' '+getTextByKey(this.props.language,'your reward point')+'';  
            }else if(item.id == 'gift'){
                lbl = ''+getTextByKey(this.props.language,'Apply')+' ($'+amountpay+') '+getTextByKey(this.props.language,'discount use gift balance')+' $' + item.amount;   
            }else if(item.id.split('-')[0] == "coupon"){
                lbl = ''+getTextByKey(this.props.language,'Apply discount use promotion code')+': ' + item.id.split('-')[1] ;  
            }else if(item.id.split('-')[0] == "membership"){
                lbl = ''+getTextByKey(this.props.language,'Apply membership')+' "'+item.name+'"';  
            }else if(item.id.split('-')[0] == 'giftcode'){
                lbl = ''+getTextByKey(this.props.language,'Apply')+' ($'+amountpay+') discount use gift code ' + item.code+' $' + item.amount;  
            }
            return (
                <View key={item.id} style={styles.checkboxcontainer}>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this.onChecked(item,key)}
                        isChecked={item.checked}
                        rightText={lbl}
                        rightTextStyle={{fontSize:13,color:color.silver}}
                        disabled={disable}
                    />
                </View>
            )           
        });
        return display;
    }

    renderAppliedCoupon = ()=>{
        this.total = this.grandTotal;
        if(this.total > 0){
            this.total -= this.paid_total;
        }
        this.total = this.roundprice(this.total);
        let priceApply = 0;
        let displayPromotion = Object.keys(this.promotions).map((key,i) => {
            let item = this.promotions[key];
            if(item.checked && typeof(item.appliedAmount) != 'undefined'){
                let lbl = '';   
                if(this.total > 0 && item.appliedAmount > 0){
                    this.total -= item.appliedAmount;
                    priceApply += item.appliedAmount;
                    if(item.id.split('-')[0] == "coupon"){
                        lbl = 'Applied promo code '+ item.id.split('-')[1]; 
                    }else if(item.id.split('-')[0] == "membership"){
                        lbl = 'Applied membership '+ item.name; 
                    }else if(item.id == 'rewardpoint'){
                        lbl = 'Applied Reward Point'; 
                    }else if(item.id == 'gift'){
                        lbl = 'Applied Egift'; 
                    }else if(item.id == 'giftcode'){
                        lbl = 'Applied Egift code'; 
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }

                return (
                    <View key={key}>
                        <View style={[styles.line]}></View>
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlblLong}>{lbl}</Text>
                            <Text style={styles.clientshortvalue}>-${item.appliedAmount}</Text>
                        </View>
                    </View>
                )
            }else{
                return false;        
            }
            
        })

        let promotionsData = [];
        Object.keys(this.promotions).map((key,i) => {
            let item = this.promotions[key];
            if(item.checked && typeof(item.appliedAmount) != 'undefined' && item.appliedAmount > 0){
                let promo = {
                    type: item.id,
                    appliedAmount: item.appliedAmount,
                };
                if(item.id.split('-')[0] == "membership"){
                    promo.type = "membership";
                    promo.id = item.id.split('-')[1];
                }

                if(item.id.split('-')[0] == "coupon"){
                    promo.type = "coupon";
                    promo.code = item.code;
                }
                if(item.id.split('-')[0] == "giftcode"){
                    promo.code = item.code;
                    promo.type = 'giftcode';
                }
                promotionsData.push(promo);
            }
        })
        this.props.onPress(priceApply, promotionsData);
        return displayPromotion;
    }
    paymentRender = (payments) =>{
        let display = Object.keys(payments).map((key,i) => {
            let item = payments[key];
            if(typeof(item) != "undefined" ){
                if(item.status != "cancelled" && item.amount > 0){
                    return(
                        <View key={key}>
                        <View style={[styles.line]}></View>
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlblLong}>{item.description}</Text>
                            <Text style={styles.clientshortvalue}>-${item.amount}</Text>
                        </View>
                    </View>
                    )
                }
            }

        })
        return display;
    }
    render(){
        this.paid_total = this.props.paid_total;
        this.grandTotal = 0;
        let paymentsdisplay = "";
        if(this.props.payments.length > 0){

            paymentsdisplay = this.paymentRender(this.props.payments);
        }
        if(typeof(this.state.DataserviceSelect) != 'undefined'){
            Object.keys(this.state.DataserviceSelect).map((key,i) => {
                let item = this.state.DataserviceSelect[key];
                let id = item.id;
                if(id != 0){
                    this.serviceSelect = this.state.DataserviceSelect;
                }
            })
        }

        Object.keys(this.serviceSelect).map((key,i) => {
            let item = this.serviceSelect[key];
            this.grandTotal += parseFloat(item.price);
        })
        if(this.state.isShowPlusService)
        {
            let display = this.renderCheckBoxPromotions();
            let displaycoupon = this.renderAppliedCoupon();
            return (
                <View style={styles.container}>
                    {display}
                    <View>
                    <View>
                        <View style={[styles.line]}></View>
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlblLong}>Subtotal</Text>
                            <Text style={styles.clientshortvalue}>${this.grandTotal}</Text>
                        </View>
                    </View>
                    {parseFloat(this.paid_total) > 0 && this.grandTotal > 0 &&
                        paymentsdisplay
                    }
                        {displaycoupon}
                        <View>
                        <View style={[styles.line]}></View>
                        <View style={styles.clientrow}>
                            <Text style={styles.clientlblLong}>Total</Text>
                            <Text style={styles.clientshortvalue}>${this.total}</Text>
                        </View>
                    </View>
                    </View>
                </View>
            );
        }else {
            return (
                <View style={styles.container}>
                    <Text style={styles.not}>Not Available</Text>
                </View>
            );
        }
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,marginTop: 10,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,backgroundColor:color.white
    },
    not:{
        padding: 20,
        fontSize:13,
        color:color.silver, 
        //fontFamily:'Futura'
    },
    line:{
        borderWidth: 0.5,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
        marginLeft:15,
        marginRight:15
    },
    clientrow:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:color.white,
        borderRadius:4,
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        position:'relative'
    },
    clientlblLong:{
        fontSize:14,
        color: color.blackish
    },
    clientshortvalue:{
        color:color.silver,
        fontSize:14,
        textAlign:'right'
    },
});