import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from '../assets/colors/colors';
export default class BtnQuantity extends Component {
    onQuantityService = (type, id) =>{
        this.props.onPress(type, id);
    }

  render () {
    let  quantity = this.props.quantity;
    let  id = this.props.id;
    let selected = typeof(this.props.selected) != 'undefined' ? true : false; 
    let selectedStyle = {};
    if(selected){
        selectedStyle.color = color.white;
    }
    return (
        <View style={{flex:1, }}>
            <LinearGradient start={[0, 0]} end={[1, 0]} colors={["#d57c87", "rgba(249,193,152, 1)"]}  style={[styles.txtLoginFormborder]}>
                <View style={styles.border}>
                    <Text style={styles.textquntity}>{quantity}</Text>
                </View>
                <View style={{flexDirection:'column', alignItems:'stretch', alignSelf: 'flex-end',justifyContent: 'flex-end',}}> 
                    <TouchableOpacity style={styles.btnminus} onPress={()=>this.onQuantityService("plus", id)} activeOpacity={1}>
                        <Icon name='menu-up-outline' size={18} style={{color:color.white, textAlign:"center"}}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnplus} onPress={()=>this.onQuantityService("minus", id)} activeOpacity={1}>
                    <Icon name='menu-down-outline' size={18} style={{color:color.white, textAlign:"center"}} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>      
    )
  }
}

const styles = StyleSheet.create({
    btnplus:{
        borderRightColor:"transparent",
        borderTopColor: color.lightCream,
        borderLeftColor:"transparent",
        borderBottomWidth:0, 
        borderWidth:1, 
        height:17, 
        width:40,
    
    },
    btnminus:{
        borderRightColor:"transparent",
        borderTopColor:"transparent",
        borderLeftColor:"transparent",
        borderBottomWidth:0,                                   
        borderWidth:1, 
        height:13,
        width:40,
        marginBottom:5
    },
    textquntity:{
        fontSize:16, 
        height:30,
        width:40,
        padding:10,
        textAlign:"center",
        color: color.blackish,
        backgroundColor: color.white,

    },
    border:{
        padding:2
    },
    txtLoginFormborder: {
        flexDirection:'row',
         width:85,
         borderColor:color.white,
         borderWidth:1, 
    },
})