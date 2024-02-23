import React from "react";
import { StyleSheet ,Text, View, Modal, SafeAreaView } from "react-native";
import Calendar from '../components/Calendar';
import { color } from "../assets/colors/colors";

export default class CalendarStripHeader extends React.Component {
    state = {
        modalVisible: false,
        //date: this.props.date
        date: new Date()
    }

    close() {
        this.setState({modalVisible: false});
    }

    show = (date) => {
        //this.props.date =
        //console.log(date);
        this.setState({modalVisible: true, date: new Date(date) });
    }

    handleNextButtonPress() {
        const date = new Date(this.state.date);
        date.setMonth(date.getMonth() + 1);
        this.setState({
            date
        });
    }

    handlePrevButtonPress() {
        const date = new Date(this.state.date);
        date.setMonth(date.getMonth() - 1);
        this.setState({
            date
        });
    }

    handleDateSelect(date) {
        //alert(`clicked: ${this.state.date.toString()}`);
        this.props.onPress(date);
        this.close();
        //setSelectedDate
    }

    render() {
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}
            >
                <SafeAreaView style={{flex:1}}>
                <View style={styles.container}>
                    <Calendar
                        date={this.state.date}
                        onPrevButtonPress={() => this.handlePrevButtonPress()}
                        onNextButtonPress={() => this.handleNextButtonPress()}
                        onDateSelect={(date) => this.handleDateSelect(date)} />
                </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.blackRGB
    }
});
