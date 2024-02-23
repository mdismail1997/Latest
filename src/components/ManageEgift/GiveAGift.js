import React from "react";
import { StyleSheet, Text, View, TouchableOpacity,Dimensions,Alert, Keyboard, ScrollView, UIManager, TextInput, findNodeHandle } from "react-native";
import GiftAmount from "./GiftAmount";


var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class GiveAGift extends React.Component {
    keyboardheight = 0;
    amount = 0;
    keyboardScreenY = 0;
    inputheight = 60;
    extraheight = 30;


    inputAmount = (amount) => {
        this.amount = amount;
    }

   

    UNSAFE_componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    }

    _keyboardDidShow(e) {
        if(!this.keyboardheight){
            this.keyboardheight = e.endCoordinates.height;
            this.keyboardScreenY = e.endCoordinates.screenY;
            this.onFocus(this.event);
        }
    }
    async onPay () {
        this.props.onPay();
    }
    onFocus = (event) => {
        if(typeof(event) != 'undefined'){
            if(!this.keyboardheight){
                this.event = event;
            }else{
                if(typeof(event) != 'undefined'){
                    let currentlyFocusedField = findNodeHandle(event.target);
                    UIManager.measureInWindow(currentlyFocusedField,(x, y, width, height) => {
                        if(this.keyboardScreenY - y > 0 && this.keyboardScreenY - y < this.inputheight) {  
                            this.refs.scrollviewbuy.scrollTo({x: 0, y: this.inputheight + this.extraheight, animated: true});
                        }else if(this.keyboardScreenY - y <= 0){
                            this.refs.scrollviewbuy.scrollTo({x: 0, y: y - this.keyboardScreenY + (this.inputheight * 2), animated: true});
                        }
                    })
                }
            }
        }
    }

    onBlur = () => {
        this.refs.scrollviewbuy.scrollTo({x: 0, y: 0, animated: false});
    }

    render() {
        return (
            <ScrollView style={styles.container} ref="scrollviewbuy" keyboardShouldPersistTaps='always'>
                <GiftAmount provider={this.props.provider} onPay={async () => {await this.onPay()}} onInputAmount={this.inputAmount} language={this.props.language} token={this.props.token} clients={this.props.clients} type="giveagift" />    
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
