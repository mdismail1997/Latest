import React from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import {Expo} from "expo";
import { LinearGradient } from 'expo-linear-gradient';

// import Router from "../navigation/Router";
import SpinnerLoader from "../helpers/spinner";
import { color } from "../assets/colors/colors";

export default class ApplyLanguageScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false
        },
    };
    
    async UNSAFE_componentWillMount(){
        if(typeof(this.props.route.params.changeLanguage) != 'undefined'){
            let _this = this;
            setTimeout(function(){
                //   _this.props.navigation.push('tab',{language:_this.props.route.params.language, isSetLanguage: true});
                _this.props.navigation.popToTop();

        
            },2000)
        }
    }

    
    render() {
        
        return (
            <LinearGradient
                start={[0, 0]}
                end={[1, 1]}
                colors={[color.reddish, color.reddish]}
                style={styles.loader}
            >
                <SpinnerLoader
                    visible={true}
                    textStyle={styles.textLoader}
                    overlayColor={"transparent"}
                    textContent={"Applying Language..."}
                />
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white
    },
    statusBarUnderlay: {
        height: 24,
        backgroundColor: "rgba(0,0,0,0.2)"
    },
    textLoader: {
        color: color.white,
        fontWeight: "normal",
        fontSize: 16
    },
    loader: {
        flex: 1
    },
    Maintainloader: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    maintaintext:{
        color:color.white,
        fontSize:22
    }
});
