import React from "react";
import { View, StyleSheet, TouchableHighlight, Animated, Text, TouchableOpacity, Platform, TouchableHighLight } from "react-native";
import { getLanguageName, getLanguage, getTextByKey } from "../helpers/language";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather'
import { color } from "../assets/colors/colors";
export default class AddButton extends React.Component {
    mode = new Animated.Value(0);
    buttonSize = new Animated.Value(1);
    handlePress = () => {
        Animated.sequence([
            Animated.timing(this.mode, {
                toValue: this.mode._value === 0 ? 1 : 0,
                duration: 300,
                useNativeDriver: false
            })
        ]).start();
    };
    actionTab = (tabname) =>{
        this.props.navigation.navigate(tabname);
        this.handlePress();
        this.props.onPress();
    }
    render() {
        const pulseX = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [25, -100]
        });
        const thermometerY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -50]
        });
        const scanY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -100]
        });
        const timeY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -150]
        });
        const pulseY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -200]
        });
        const manageEgiftY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -250]
        });
        const servicesY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -300]
        });
        const blockedtimeY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -350]
        });
        const staffY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -400]
        });
        const clientY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -450]
        });
        const salesreportY = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -500]
        });
        const rotation = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "45deg"]
        });
        const opacityStyle = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
if(Platform.OS === 'ios'){
    return (
        <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
            <Animated.View style={{ position: "absolute", left: pulseX, top: thermometerY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('more')}>
                    <Feather name="settings" size={20} color="#333" style={styles.icon}/>
                    <Text style={styles.styletab}>Setting</Text>
                </TouchableOpacity>
            </Animated.View>
            {
                this.props.role == 9 && 
            <Animated.View style={{ position: "absolute", left: pulseX, top: scanY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('dailyreports')}>
                    <Feather name="bar-chart-2" size={20} color="#333" style={styles.icon}/>
                    <Text style={styles.styletab}>Daily reports</Text>
                </TouchableOpacity>
            </Animated.View>
            }
            {
                this.props.role == 9 && 
            <Animated.View style={{ position: "absolute", left: pulseX, top: timeY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('weeklyreports')}>
                    <Feather name="bar-chart-2" size={20} color="#333" style={styles.icon}/>
                    <Text style={styles.styletab}>Weekly reports</Text>
                </TouchableOpacity>
            </Animated.View>
            }
            {
                this.props.role == 9 && 
            <Animated.View style={{ position: "absolute", left: pulseX, top: pulseY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('monthlyreports')}>
                    <Feather name="bar-chart-2" size={20} color="#333" style={styles.icon}/>
                    <Text style={styles.styletab}>Monthly reports</Text>
                </TouchableOpacity>
            </Animated.View>
            }
            {
                this.props.role == 4 && 
            <Animated.View style={{ position: "absolute", left: pulseX, top: scanY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('scanbarcode')}>
                    <Feather name="settings" size={20} color="#333" style={styles.icon}/>
                    <Text style={styles.styletab}>Scan Barcode</Text>
                </TouchableOpacity>
            </Animated.View>}
            {
                this.props.role == 4 && 
            <Animated.View style={{ position: "absolute", left: pulseX, top: timeY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('clients')}>
                <Feather name="activity" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.styletab}>Clients</Text>
                </TouchableOpacity>
            </Animated.View>}
            {
                this.props.role == 4 && 
            <Animated.View style={{ position: "absolute", left: pulseX, top: pulseY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('blockedtime')}>
                    <Feather name="clock" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.styletab}>Blocked Time</Text>
                </TouchableOpacity>
            </Animated.View>}
            {
                this.props.role == 4 && 
                <Animated.View style={{ position: "absolute", left: pulseX, top: blockedtimeY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('sms')}>
                    <Feather name="activity" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.styletab}>SMS Report</Text>
                </TouchableOpacity>
            </Animated.View>
            }
            
            {
                this.props.role == 4 && 
                <Animated.View style={{ position: "absolute", left: pulseX, top: manageEgiftY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('ManageEgift')}>
                    <Feather name="activity" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.styletab}>Manage E-gift</Text>
                </TouchableOpacity>
            </Animated.View>
            }
            
            {
                this.props.role == 4 && 
                <Animated.View style={{ position: "absolute", left: pulseX, top: servicesY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('service')}>
                    <Feather name="activity" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.styletab}>Services</Text>
                </TouchableOpacity>
            </Animated.View>
            }
            
            {
                this.props.role == 4 && 
                <Animated.View style={{ position: "absolute", left: pulseX, top: salesreportY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('salesreport')}>
                    <Feather name="activity" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.styletab}>Sales Report</Text>
                </TouchableOpacity>
            </Animated.View>
            }
            
            {
                this.props.role == 4 && 
                <Animated.View style={{ position: "absolute", left: pulseX, top: staffY, opacity: opacityStyle }}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('staff')}>
                    <Feather name="user" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.styletab}>Staff</Text>
                </TouchableOpacity>
            </Animated.View>
            }
            
            {
                this.props.role == 4 && 
                <Animated.View style={{ position: "absolute", left: pulseX, top: clientY, opacity: opacityStyle}}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => this.actionTab('charged')}>
                <Feather name="activity" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.styletab}>Charged New Client</Text>
                </TouchableOpacity>
            </Animated.View>
            }
        
            <Animated.View>
                <TouchableOpacity style={styles.containerbtn} onPress={this.handlePress}>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        <AntDesign name="plus" size={20} color={this.props.color} />
                    </Animated.View>
                <Text style={{color:this.props.color}}>More</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
 
        );
}else{
    return (

        <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
            <Animated.View>
                <TouchableOpacity style={styles.containerbtn} onPress={() => this.actionTab('more')}>
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        <AntDesign name="plus" size={20} color={this.props.color} />
                    </Animated.View>
                <Text style={{color:this.props.color}}>More</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
 
        );
}
        
    }
}

const styles = StyleSheet.create({
    test:{
        flex: 1, position: "absolute", left: -100, top: 0

    },
    icon:{
        marginLeft:5,
        marginRight: 5
    },
    containerbtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
      },
    button: {
        alignItems: "center",
        justifyContent: "center",
        // width: 72,
        // height: 72,
        borderRadius: 36,
        backgroundColor: "#7F58FF",
        position: "absolute",
        marginTop: -60,
        shadowColor: "#7F58FF",
        shadowRadius: 5,
        shadowOffset: { height: 10 },
        shadowOpacity: 0.3,
        borderWidth: 3,
        borderColor: color.white
    },
    secondaryButton: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // position: "absolute",
        alignItems: "center",
        // justifyContent: "center",
        width: 185,
        height: 40,
        borderRadius: 24,
        backgroundColor: "#007a70",
        zIndex:1
    },
    styletab:{
        color: color.white,
        fontWeight: 'bold'
    }
});