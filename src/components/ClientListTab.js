import React from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
//import layout from "../assets/styles/layout";
import ClientItemTab from "./ClientItemTab";
import { formatPhone } from "../helpers/Utils";
import { color } from "../assets/colors/colors";
var {height, width} = Dimensions.get('window');

export default class ClientListTab extends React.PureComponent {
    state = {
        search:'',
        isRefresh: false
    };

    data = this.props.data;
    userData = this.props.userData;

    
    async UNSAFE_componentWillMount(){
        var screen = Dimensions.get('window');
        width = screen.width;
        height = screen.height;
    }

    _onPressItem = (id,name) => {
        this.props.onPress(id,name);
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
            <ClientItemTab
                id={item.id}
                onPressItem={this._onPressItem}
                name={displayname}
                data={item}

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
                <View style={{flex:1}}>

                        <View style={{flexDirection: 'row', height:50}}>
                        <View style={[styles.itemContainer,{width: "100%"}]} >
                            <Text style={styles.technicianname}>Client infomation</Text>
                        </View>
                        {/* <View style={[styles.itemContainer,{width: 200}]} >
                            <Text style={styles.technicianname}>Last Visit</Text>
                        </View>
                        <View style={[styles.itemContainer,{width: 150}]} >
                            <Text style={styles.technicianname}>Reward Point</Text>
                        </View> */}
                    </View>
                <FlatList
                    data={this.data}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    initialNumToRender={10}
                    extraData={(this.state )}
                    removeClippedSubviews={true}
                />
                </View>
            );
        }else{
            return (
                <View style={styles.container}>
                    <Text style={styles.txtNotFound}>No Clients Found</Text>
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
    itemContainer: {
        borderBottomColor: color.cream,
        borderBottomWidth: 0.5,
        paddingLeft:10,
        backgroundColor: color.white,
        justifyContent:'center',
    },
    technicianname:{
        marginLeft:5,
        color: color.gray42,
        fontSize:16
    },
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
