import React from "react";
import { StyleSheet, Text } from "react-native";

export default class AppointmentPaymentRemaining extends React.Component {
    state = {
        total: this.props.total
    };

    render() {
        return (
            <Text style={styles.summaryTotalRightValue}>
                ${this.state.total}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    summaryTotalRightValue: {
        fontSize: 24
    },
});
