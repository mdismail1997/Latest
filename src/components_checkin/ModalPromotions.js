import React from "react";
import { StyleSheet ,Text, View, Modal, TouchableOpacity } from "react-native";
import CheckBox from 'react-native-check-box';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { color } from "../assets/colors/colors";
//import layout from "../assets/styles/layout";

export default class ModalPromotions extends React.Component {
    state = {
        modalVisible: false,
    }

    promotions = {};
    total = 0;

    close() {
        this.setState({modalVisible: false});
    }

    show = (promotions,total) => {
        this.promotions = promotions;
        this.total = total;
        this.setState({modalVisible: true });
    }
    
    onChecked = (item,key) => {
        this.promotions[key].checked = item.checked ? false : true;
        this.setState({modalVisible: true });
    }

    apply = () => {
        this.props.applypromotions(this.promotions);
        this.setState({modalVisible: false});
    }

    render() {
        let tempTotal = this.total;
        var display = Object.keys(this.promotions).map((key,i) => {
            let item = this.promotions[key];
            let lbl = '';
            let availableAmount = 0;
            let disable = false;
            if(item.id == 'rewardpoint'){
                if (item.amount > 0) {
                    if (tempTotal <= item.amount) {
                        availableAmount = tempTotal;
                    } else{
                        availableAmount = item.amount;
                    }
                    tempTotal -= availableAmount;
                }
                if(availableAmount > 0){
                    item.appliedAmount = availableAmount;
                    lbl = 'Apply this reward point ($'+availableAmount+') to the this booking';        
                }else{
                    lbl = '$' +item.amount+ ' Reward Point';  
                    disable = true;             
                }
                
            }
            return (
                <View key={item.id} style={styles.checkboxcontainer}>
                    <CheckBox
                        style={{flex: 1, padding: 10}}
                        onClick={()=>this.onChecked(item,key)}
                        isChecked={item.checked}
                        rightText={lbl}
                        rightTextStyle={{fontSize:18,color: color.silver}}
                        disabled={disable}
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
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.btnClose}
                            onPress={() => this.close()}
                        >
                            <Icon
                                name={'close'}
                                size={30}
                                color={color.blackRGB}
                            />
                        </TouchableOpacity>
                        <Text style={styles.txtpromotionheader}>Reward Point</Text>
                        {display}

                        {Object.keys(this.promotions).length > 0 &&
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
                                        <Text style={styles.btnSaveText}>Apply Checked Promotions</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        }
                        {Object.keys(this.promotions).length == 0 && 
                            <Text style={styles.txtnopromotion}>No Promotions Available</Text>
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
    promotioncontainer:{
        width:500,
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
        width:460,
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
