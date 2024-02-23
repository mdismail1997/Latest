import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from "react-native";
import { color } from "../assets/colors/colors";

export default class navigationBarBG extends React.Component {
    render() {
        return(
            <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]} style={styles.container} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1
    }
});
