import React from "react";
import { StyleSheet ,Text, View, Modal, TouchableOpacity,Alert } from "react-native";
import CheckBox from 'react-native-check-box';
import { LinearGradient } from 'expo-linear-gradient';
import RadioButton from './RadioButton'
import { color } from "../assets/colors/colors";

//import layout from "../assets/styles/layout";

export default class ModalLocation extends React.Component {
    state = {
        modalVisible: false,
    }

    locations = {};
    total = 0;
    selectedid = 0;
    selectedLocation = {};

    close() {
        this.setState({modalVisible: false});
    }

    show = (locations) => {
        this.locations = locations;
        this.setState({modalVisible: true });
    }
    
    onChecked = (item,key) => {
        this.locations.forEach(function(item){
            item.checked = false;
        })
        //this.locations[key].checked = item.checked ? false : true;
        this.locations[key].checked = true;
        this.selectedid = item.id;
        this.selectedLocation = item;
        this.setState({modalVisible: true });
    }

    apply = () => {
        if(typeof(this.selectedLocation.id) == 'undefined'){
            Alert.alert('Error','Please choose location');
        }else{
            this.props.applylocations(this.selectedLocation);
            this.setState({modalVisible: false});
        }
        
    }

    render() {
        let tempTotal = this.total;
        var display = Object.keys(this.locations).map((key,i) => {
            let item = this.locations[key];
            let lbl = item.location;
            let availableAmount = 0;
            let disable = false;
            
            return (
                <View key={item.id} style={styles.checkboxcontainer}>                    
                    <RadioButton
                        animation={'bounceIn'}
                        isSelected={item.checked}
                        rightText={lbl}
                        onPress={()=>this.onChecked(item,key)}
                    />
                </View>
            )        
        });
 
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
                supportedOrientations={['landscape']}
            >
                <View style={styles.container}>
                    <View style={styles.promotioncontainer}>
                        
                        <Text style={styles.txtpromotionheader}>Select Location</Text>
                        {display}

                        {Object.keys(this.locations).length > 0 &&
                            <View style={[styles.btnBlockWraper]}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.btnSaveWraper}
                                    onPress={async () => {await this.apply()}}
                                >
                                    <LinearGradient
                                        start={[0, 0]}
                                        end={[1, 0]}
                                        colors={[color.reddish, color.reddish]}
                                        style={styles.btnLinear}
                                    >
                                        <Text style={styles.btnSaveText}>Choose Selected Location</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        }
                        
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.blackRGB
    },
    checkboxcontainer:{
        marginBottom:15
    },
    promotioncontainer:{
        width:600,
        padding:20,
        backgroundColor: color.white,
        position:'relative'
    },
    txtpromotionheader:{
        fontFamily:'Futura',
        fontSize:24,
        marginBottom:20,
        textAlign:'center'
    },
    btnSave: {
        height: 45,
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 15
    },
    btnSaveText: {
        color:  color.white,
        fontSize: 22,
        zIndex: 1,
        backgroundColor: "transparent"
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: color.lightWhite
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    btnClose:{
        position:'absolute',
        top:10,
        right:10,
        zIndex:1
    },
    btnBlockWraper:{
        height:50,
        width:560,
        marginTop:50
    },
    txtnopromotion:{
        color: color.silver,
        fontSize:18,
        marginTop:10,
        marginBottom:20,
        textAlign:'center'
    }
});
