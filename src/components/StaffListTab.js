import React from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
//import layout from "../assets/styles/layout";
import StaffItemTab from "./StaffItemTab";
import { formatPhone } from "../helpers/Utils";
import { color } from "../assets/colors/colors";


export default class StaffListTab extends React.PureComponent {
    state = {
        search:'',
        isRefresh: false
    };

    data = this.props.data;
    userData = this.props.userData;

    _onPressItem = (id,name) => {
        this.props.onPress(id,name);
    }
    onPressItemCommission = (id,name) => {
        this.props.onPressItemCommission(id,name);
    }
    _keyExtractor = (item, index) => 'list-item-' + item.id;

    _renderItem = ({ item }) => {
        let displayname = String.prototype.trim.call(item.fullname);
        let x = item;
  
        if(typeof x.phone != 'undefined' && x.phone != '' && x.phone != null){
            if(typeof x.fullname != 'undefined' && String.prototype.trim.call(x.fullname) != '' 
            && x.fullname != null){
                displayname += ' - ';
            }
            
            if(this.userData.role == 4){
                displayname += formatPhone(x.phone);
            }else{
                let displayphone = x.phone
                .replace(/[^\d]+/g, "")
                .replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "($1) $2-$3"
                );
                let displayphoneSplit = displayphone.split('-');
                if(displayphoneSplit.length > 1){
                    displayname += '(xxx) xxx-' + displayphoneSplit[1];
                }
                
            }
            
        }else if(typeof x.email != 'undefined' && x.email != '' && x.email != null && this.userData.role == 4){
            if(typeof x.fullname != 'undefined' && String.prototype.trim.call(x.fullname) != '' 
            && x.fullname != null){
                displayname += ' - ';
            }
            displayname += x.email;
        }  
        return (
            <StaffItemTab
                id={item.id}
                onPressItem={this._onPressItem}
                onPressItemCommission = {this.onPressItemCommission}
                name={displayname}
            />
        );
    };

    refreshClients = async () => {
        this.setState({isRefresh: true});
        await this.props.refresh(this.state.search);
        
    }

    render() {
        if(this.data.length){
            return (
                <FlatList
                    data={this.data}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    initialNumToRender={10}
                    extraData={(this.state )}
                    removeClippedSubviews={true}
                />
            );
        }else{
            return (
                <View style={styles.container}>
                    <Text style={styles.txtNotFound}>No Staffs Found</Text>
                    {!this.state.isRefresh &&
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.btnRefresh}
                        onPress={async () => {await this.refreshClients()}}
                    >
                        <Text style={styles.txtRefresh}>Refresh</Text>
                    </TouchableOpacity>
                    }
                    {this.state.isRefresh &&
                        <View style={styles.clientLoaderContainer}>
                            <View style={styles.clientLoader}>
                                <ActivityIndicator
                                    color={color.reddish}
                                    size={'large'}
                                    style={styles.Indicator}
                                    />
                                <View style={styles.textContainer}>
                                    <Text style={[styles.textContent]}>Refreshing...</Text>
                                </View>
                            </View>
                        </View>
                    }
                </View>
            )
        }
        
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    txtNotFound:{
        marginTop:20,
        color: color.blackish,
        textAlign:'center',
        fontSize:16,
        marginBottom:0
    },
    btnRefresh:{
        marginTop:20
    },
    txtRefresh:{
        color: color.reddish,
        textAlign:'center',
        fontSize:16
    },
    clientLoaderContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:20
    },
    clientLoader:{
        justifyContent: 'center',
        alignItems: 'center',
        height:100,
        width:120
    },
    textContent:{
        fontSize:16,
        marginTop:5,
        color: color.darkSilver    
    }
});
