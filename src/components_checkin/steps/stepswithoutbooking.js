import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, Platform, Image } from "react-native";
import { color } from "../../assets/colors/colors";
import { images } from "../../components/Images";
var {height, width} = Dimensions.get('window');
width = 768;
var widthWithPadding = width - 40;
var stepWidth = 110;
var stepNumberWidth = 40;
var stepSize = 3;
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

    render() {
        let stepsContainerStyle = styles.stepsContainer;
        let stepTabNumberStyle = styles.stepTabNumber;
        if(Platform.OS != 'ios'){
            stepsContainerStyle = styles.stepsContainerAndroid;
            stepTabNumberStyle = styles.stepTabNumberAndroid;
        }
        return(
            <View style={[styles.stepsContainerCommon,stepsContainerStyle]}>
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
                    <View style={styles.stepName}>
                        <Text style={this.state.step == 1 ? styles.stepNameTextActive : styles.stepNameText}>Customer</Text>
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
                        <Text style={this.state.step == 2 ? styles.stepNameTextActive : styles.stepNameText}>Services</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.stepLineContainer}>
                    <View style={styles.stepLine}></View>
                </View>
                <TouchableOpacity style={[styles.stepTabNumberCommon,stepTabNumberStyle]} activeOpacity={1} onPress={() => {this.onPress(3)}}>
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
                        <Text style={this.state.step == 3 ? styles.stepNameTextActive : styles.stepNameText}>Summary</Text>
                    </View>
                </TouchableOpacity>
                
                <View style={{width:20}}></View>
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
        height:60,
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
        height:2,
        width:lineWidth,
        backgroundColor:'rgba(255,255,255,0.3)',
        top:15,
        //left:-30,
        zIndex:1
    },
    stepNumber:{
        backgroundColor:'rgba(255,255,255,0.4)',
        borderRadius:40,
        height:40,
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
        fontSize:20
    },
    stepName:{
        height:20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:5   
    },
    stepNameText:{
        color: color.whiteRGB05,
        fontSize:16,
        backgroundColor:'transparent',
        fontFamily:'Futura'
    },
    stepNameTextActive:{
        color: color.whiteRBG1,
        fontSize:16,
        backgroundColor:'transparent',
        fontFamily:'Futura'
    }
});
