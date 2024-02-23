import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Platform, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "../../assets/colors/colors";
import { images } from "../../components/Images";
var {height, width} = Dimensions.get('window');

var wodthLeft = width * 0.7;
var widthWithPadding = wodthLeft - 40;
var stepWidth = 110;
var stepNumberWidth = 25;
var stepSize = 5;
var totalStepWidth = stepWidth * stepSize;
var lineContainerWidth = ((widthWithPadding - totalStepWidth) / 4);

var lineWidth = lineContainerWidth + (stepWidth - stepNumberWidth);

//var marginLeftRight = stepWidth - stepNumberWidth - 4;
//var lineWidth = ((widthWithPadding - (stepWidth * 5)) / 4) + marginLeftRight;

export default class Steps extends React.PureComponent {
    state = {
        step: this.props.step
    }

    setStep = (stepNumber) => {
        this.setState({step: stepNumber});    
    }

    onPress = (stepNumber) => {
        this.props.onPress(stepNumber,this.state.step);
    }
    close = () =>{
        var _this = this;
        _this.props.close();
    }
    render() {
        let stepsContainerStyle = styles.stepsContainer;
        let stepTabNumberStyle = styles.stepTabNumber;
        if(Platform.OS != 'ios'){
            stepsContainerStyle = styles.stepsContainerAndroid;
            stepTabNumberStyle = styles.stepTabNumberAndroid;
        }
        let textTitle = 'Book Appointment';
        switch (this.state.step){
            case 1:
                textTitle = 'Profile Information';
            break;
            case 2:
                textTitle = 'Please select your service';
            break;
            case 3:
                textTitle = 'Please select your date & time';
            break;
            case 4:
                textTitle = 'Please select you technician';
            break;
            case 5:
                textTitle = 'Confirming your booking';
            break;
        }
        return(
            <View>
            <View style={this.props.headerStyle}>
            {/* <Text style={styles.headerTitle}>{textTitle}</Text> */}
            {/* <TouchableOpacity style={styles.closebtn} activeOpacity={1}
                onPress={this.close}>
                <Icon
                    name={'close'}
                    size={30}
                    color={ color.whiteRBG1} style={styles.navIconIOS}
                />
            </TouchableOpacity> */}
            </View>
            <View style={[styles.stepsContainerCommon,stepsContainerStyle, {marginTop:15}]}>
                <View style={{width:20}}></View>
                <TouchableOpacity style={[styles.stepTabNumberCommon,stepTabNumberStyle]} activeOpacity={1} onPress={() => {this.onPress(1)}}>
                    {
                        this.state.step >= 1  && 
                        <View >
                            <Image 
                                source={images.stepNew1}
                                style={{width:45,height:45}}
                            /> 
                        </View>
                    }
                    {/* {
                        this.state.step != 1 &&
                        <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>1</Text>
                        </View>
                    } */}
                    <View style={styles.stepName}>
                        <Text style={this.state.step >= 1 ? styles.stepNameTextActive : styles.stepNameText}>Customer</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.stepLineContainer}>
                    <View style={styles.stepLine}></View>
                </View>
                <TouchableOpacity style={[styles.stepTabNumberCommon,stepTabNumberStyle]} activeOpacity={1} onPress={() => {this.onPress(2)}}>
                {
                        this.state.step < 2 &&
                        <View >
                            <Image 
                                source={images.stepNew2}
                                style={{width:45,height:45}}
                            /> 
                        </View>
                    }
                    {
                        this.state.step >= 2 &&
                        <View >
                            <Image 
                                source={images.stepNew02}
                                style={{width:45,height:45}}
                            /> 
                        </View>
                    }
                    <View style={styles.stepName}>
                        <Text style={this.state.step >= 2 ? styles.stepNameTextActive : styles.stepNameText}>Service</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.stepLineContainer}>
                    <View style={styles.stepLine}></View>
                </View>
                <TouchableOpacity style={[styles.stepTabNumberCommon,stepTabNumberStyle]} activeOpacity={1} onPress={() => {this.onPress(3)}}>
                    {
                        this.state.step < 3 &&
                        <View >
                            <Image 
                                source={images.stepNew3}
                                style={{width:45,height:45}}
                            /> 
                        </View>
                    }
                    {
                        this.state.step >= 3 &&
                        <View >
                            <Image 
                                source={images.stepNew03}
                                style={{width:45,height:45}}
                            /> 
                        </View>
                    }
                    <View style={styles.stepName}>
                        <Text style={this.state.step >= 3 ? styles.stepNameTextActive : styles.stepNameText}>Time</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.stepLineContainer}>
                    <View style={styles.stepLine}></View>
                </View>
                <TouchableOpacity style={[styles.stepTabNumberCommon,stepTabNumberStyle]} activeOpacity={1} onPress={() => {this.onPress(4)}}>
                    {
                        this.state.step < 4 &&
                        <View >
                            <Image 
                                source={images.stepNew4}
                                style={{width:45,height:45}}
                            /> 
                        </View>
                    }
                    {
                        this.state.step >= 4 &&
                        <View >
                            <Image 
                                source={images.stepNew04}
                                style={{width:45,height:45}}
                            /> 
                        </View>
                    }
                    <View style={styles.stepName}>
                        <Text style={this.state.step >= 4 ? styles.stepNameTextActive : styles.stepNameText}>Technician</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.stepLineContainer}>
                    <View style={styles.stepLine}></View>
                </View>
                <TouchableOpacity style={[styles.stepTabNumberCommon,stepTabNumberStyle]} activeOpacity={1} onPress={() => {this.onPress(5)}}>
                    {
                        this.state.step < 5 &&
                        <View >
                            <Image 
                                source={images.stepNew5}
                                style={{width:45,height:45}}
                            /> 
                        </View>
                    }
                    {
                        this.state.step >= 5 &&
                        <View >
                            <Image 
                                source={images.stepNew05}
                                style={{width:45,height:45}}
                            /> 
                        </View>
                    }
                    <View style={styles.stepName}>
                        <Text style={this.state.step >= 5 ? styles.stepNameTextActive : styles.stepNameText}>Summary</Text>
                    </View>
                </TouchableOpacity>
                <View style={{width:20}}></View>
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    stepsContainer:{
        height:70,
    },
    stepsContainer:{
        height:80,
    },
    stepsContainerCommon:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap:'wrap',
        paddingBottom:5
    },
    stepTabNumber:{
        height:70,
    },
    stepTabNumberAndroid:{
        height:70,
    },
    stepTabNumberCommon:{
        width:stepWidth,
        
        justifyContent: 'center',
        alignItems: 'center',     
    },
    stepLineContainer:{
        height:60,
        width:lineContainerWidth,
        justifyContent: 'center',
        alignItems: 'center'    
    },
    stepLine:{
        
        position:'absolute',
        height:3,
        width:lineWidth,
        backgroundColor: color.whiteRBG1,
        top:13,
        //left:-30,
        zIndex:1
    },
    stepNumber:{
        backgroundColor:'rgba(255,255,255,0.4)',
        borderRadius:25,
        height:25,
        width:stepNumberWidth,
        justifyContent: 'center',
        alignItems: 'center',    
    },
    stepNumberActive:{
        backgroundColor: color.whiteRBG1,
        borderRadius:40,
        height:40,
        width:stepNumberWidth,
        justifyContent: 'center',
        alignItems: 'center'    
    },
    stepNumberText:{
        color: color.reddish,
        fontSize:13
    },
    stepName:{
        height:30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:5   
    },
    stepNameText:{
        color: color.whiteRGB05,
        fontSize:17,
        backgroundColor:'transparent',
        fontFamily:'Futura'
    },
    stepNameTextActive:{
        color: color.whiteRBG1,
        fontSize:17,
        backgroundColor:'transparent',
        fontFamily:'Futura'
    },
    headerTitle:{
        color: color.white,
        backgroundColor:'transparent',
        fontSize:24,
        fontFamily:'Futura'
    },
    closebtn:{
        position:'absolute',
        right:-20,
        backgroundColor:'transparent',
        top:-30
    }
});
