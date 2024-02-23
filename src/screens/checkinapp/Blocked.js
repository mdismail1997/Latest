import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Alert,
    TextInput    
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { color } from "../../assets/colors/colors";


var {height, width} = Dimensions.get('window');

export default class BlockedScreen extends React.Component {
    static route = {
        navigationBar: {
            visible: false
        }
    };

    UNSAFE_componentWillUnmount(){
        Dimensions.removeEventListener("change", () => {});
    }

    UNSAFE_componentWillMount(){

        let _this = this;
        Dimensions.addEventListener('change',function(){
            var screen = Dimensions.get('window');
            width = screen.width;
            height = screen.height;
            _this.setState({ appIsReady: true });
        })
    }

    

    render() {
      
        return(
            <LinearGradient start={[0, 0]} end={[1, 1.0]} colors={[color.reddish, color.reddish]} style={[styles.containerGradient]}>
                
                <Text style={styles.lblcheckinheader}>Account Blocked</Text>
                <Text style={styles.lblcheckin}>Please contact the Administrator. 302.543.2014</Text>
                
            </LinearGradient>  
            
            
        )
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:-45
    },
    btnSearch: {
        backgroundColor: color.white,
        height:70,
        borderRadius:50,
        alignItems: 'center',
        justifyContent: 'center',
        width:400,
        marginTop:20
    },
    txtSearch: {
        height: 70,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 50,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        paddingLeft: 20,
        color:  color.white,
        width:400,
        fontSize:24
    },
    containerGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lblcheckin:{
        color: color.white,
        fontSize:28,
        backgroundColor:'transparent',
        marginBottom:40,
        fontFamily:'Futura'
    },
    lblcheckinheader:{
        fontSize:36,
        color: color.white,
        backgroundColor:'transparent',
        marginBottom:20,
        fontFamily:'Futura'
    },
    txtsearchbtn: {
        fontSize:26,
        fontFamily:'Futura',
        color:color.reddish
    },
    closebtn:{
        position:'absolute',
        left:20,
        backgroundColor:'transparent',
        top:35
    }
});
