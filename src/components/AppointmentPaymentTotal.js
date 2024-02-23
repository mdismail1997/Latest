import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { color } from "../assets/colors/colors";

export default class AppointmentPaymentTotal extends React.Component {
    state = {
        total: this.props.total
    };

    render() {
        return (
            <Text style={styles.summaryTotalLeftValue}>
                ${this.state.total}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    summaryTotalLeftValue: {
        color: color.reddish,
        fontSize: 24
    },
});
