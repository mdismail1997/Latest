import React from "react";
import { StyleSheet ,Text, View, FlatList } from "react-native";
import TechnicianSearchItem from "./TechnicianSearchItem";
//import layout from "../assets/styles/layout";

export default class TechnicianSearchList extends React.Component {

    state = {selected: 0};

    _keyExtractor = (item, index) => item.id + "_technicianheader";

    _onPressItem = (id, name) => {
        // updater functions are preferred for transactional updates
        //console.log(id);


        this.props.onSelectedTechnician(id,name);
        this.props.selected = id;
        //this.setState({selected:id});
        //console.log(this.state);
    };

    _renderItem = ({item}) => {
        if(typeof this.props.search == 'undefined' || (this.props.search != 'undefined' && item.fullname.toLowerCase().indexOf(this.props.search.toLowerCase()) >= 0))
        {
            return (
                <TechnicianSearchItem
                    id={item.id}
                    onPressItem={this._onPressItem}
                    selected={(item.id == this.props.selected)}
                    name={item.fullname}
                />
            )
        }

    };

    render() {
        //console.log(this.props.data);
        return(
            <FlatList
                data={this.props.data}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                extraData={(this.props.selected || this.props.search )}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
