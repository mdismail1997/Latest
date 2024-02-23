import React from "react";
import { StyleSheet ,Text, View, Modal } from "react-native";
import Calendar from './Calendar';
import moment from "moment";
import { color } from "../../assets/colors/colors";
//import layout from "../assets/styles/layout";

export default class CalendarStripHeader extends React.Component {
    state = {
        modalVisible: false,
        //date: this.props.date
        date: new Date()
    }

    timezone = this.props.timezone;

    close() {
        this.setState({modalVisible: false});
    }

    show = (date) => {
        //this.props.date =
        //console.log(date);
        //console.log(date.format('YYYY-MM-DD HH:mm z'));
        //this.setState({modalVisible: true });
        //console.log(new Date(date.year(), date.month(), 1).getDay());;
        //this.setState({modalVisible: true, date: new Date(date) });
        //let daysInMonth = new Date(date.year(), date.month() + 1, 0).getDate();
        //console.log(daysInMonth);
        //console.log(date.month());
        //console.log(date.format('Y-M-D'));
        this.setState({modalVisible: true, date: date });
    }
    

    handleNextButtonPress() {
        //const date = new Date(this.state.date);
        //date.setMonth(date.getMonth() + 1);
        const date =this.state.date.add(1,'months');
        this.setState({
            date
        });
    }

    handlePrevButtonPress() {
        //const date = new Date(this.state.date);
        //date.setMonth(date.getMonth() - 1);
        const date =this.state.date.add(-1,'months');
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
                supportedOrientations={['landscape']}
            >
                <View style={styles.container}>
                    <Calendar
                        timezone={this.timezone}
                        date={this.state.date}
                        onPrevButtonPress={() => this.handlePrevButtonPress()}
                        onNextButtonPress={() => this.handleNextButtonPress()}
                        onDateSelect={(date) => this.handleDateSelect(date)} />
                </View>
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
