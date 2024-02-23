import React, {useEffect, useState} from 'react';
import {Button, Dimensions, StyleSheet, TouchableOpacity, Text, View, TextInput, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import BtnSpinner from "../helpers/btnloader";
import {
    isLogged,
    jwtToken
} from "../helpers/authenticate";
import setting from "../constants/Setting";
import { color } from '../assets/colors/colors';
import { api } from '../api/api';
const finderWidth = 350;
const finderHeight = 150;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;
export default function ScanBarCodeScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(BarCodeScanner.Constants.Type.back);
    const [scanned, setScanned] = useState(false);
    const [datars, setData] = React.useState({
        result_scanned: '',
        btnLoginVisibleSpinner: false,
        btnLoginDisabled: false
    });
    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {
        if (!scanned) {
            const {type, data, bounds: {origin} = {}} = scanningResult;
            // @ts-ignore
            const {x, y} = origin;
            if (x >= viewMinX && y >= viewMinY && x <= (viewMinX + finderWidth / 2) && y <= (viewMinY + finderHeight / 2)) {
                setScanned(true);
                setData({
                    ...datars,
                    result_scanned: data,
                });
                // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
            }
        }
    };
    const onGetItemPress = async() => {
        let isLoggedIn = await isLogged();
        if (isLoggedIn) {
            let token = await jwtToken();
            setData({
                ...datars,
                btnLoginDisabled: true,
                btnLoginVisibleSpinner: true
            });
            let isSuccess = await fetch(setting.apiUrl + api.applyBarCode,{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    code: String.prototype.trim.call(datars.result_scanned),
                })
            }).then((response) => response.json()).then((responseJson) => {
                if(!responseJson.success){
                    Alert.alert('Invalid!', 'Not found code');
                    setData({
                        ...datars,
                        result_scanned:'',
                        btnLoginDisabled: false,
                        btnLoginVisibleSpinner: false
                    }); 
                }else{
                    setData({
                        ...datars,
                        result_scanned:'',
                        btnLoginDisabled: false,
                        btnLoginVisibleSpinner: false
                    }); 
                    Alert.alert('Success!', 'Apply code successfully');
                
                }
                
            }).catch((error) => {
                console.error(error);
            });
    
        }
    }
    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={{flex: 1}}>
            <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
                            type={type}
                            style={[StyleSheet.absoluteFillObject, styles.container]}>
                
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                    }}>
                    
                </View>
                <BarcodeMask edgeColor="#62B1F6" showAnimatedLine/>
                <TouchableOpacity
                     activeOpacity={0}
                        style={{
                            flex: 1,
                            alignItems: 'flex-end',
                        }}
                        onPress={() => {
                            setType(
                                type === BarCodeScanner.Constants.Type.back
                                    ? BarCodeScanner.Constants.Type.front
                                    : BarCodeScanner.Constants.Type.back
                            );
                        }}>
                        <Text style={{fontSize: 18, margin: 5, color: 'white'}}> Flip </Text>
                    </TouchableOpacity>
                {scanned && <Button title="Tap to Scan Again" color={color.white} onPress={() => setScanned(false)}/>}
                {scanned && 
                <View style={styles.lowerSection}>
                <TextInput style={styles.textbox} placeholder='Barcode of the item' value={datars.result_scanned} /> 
                <View style={styles.btnSave}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.btnSaveWraper}
                        onPress={async () => await onGetItemPress()}
                    >
                        <LinearGradient
                            start={[0, 0]}
                            end={[1, 0]}
                            colors={[color.reddish, color.reddish]}
                            style={styles.btnLinear}
                        >
                            <BtnSpinner visible={datars.btnLoginVisibleSpinner} textContent='Get Code' textStyle={styles.btnSaveText} color={color.white} size='small' />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
                }
                
            </BarCodeScanner>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    lowerSection: {
        marginTop:15,
        width:300,
    },
    textbox:{
        height:40,
        color: color.black,
        paddingRight:20,
        paddingLeft:20,
        fontSize:16,
        backgroundColor:color.white,
        borderBottomLeftRadius:5,
        borderTopLeftRadius:5,
        borderBottomRightRadius:5,
        borderTopRightRadius:5,
        fontFamily:'Futura',
    },
    btnSave: {
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15,
    },
    btnSaveWraper: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1
    },
    btnLinear: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        overflow: "hidden",
        flex: 1
    },
    btnSaveText: {
        color: color.white,
        fontSize: 16,
        zIndex: 1,
        backgroundColor: "transparent"
    },
});