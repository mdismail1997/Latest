import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Modal, Platform, TextInput, FlatList, SafeAreaView } from "react-native";
import ClientSearchItem from "./ClientSearchItem";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import layout from "../assets/styles/layout";
import {
    fetchClientsData
} from "../helpers/fetchdata";
import { color } from "../assets/colors/colors";

export default class ClientSearchList extends React.Component {

    state = {
        modalVisible: true,
        showCloseSearchBoxClient: false,
        search:'',
        selected: this.props.selected
    }

    clients = this.props.data;

    async UNSAFE_componentWillMount(){
        this.clients = await fetchClientsData(this.props.token);
    }

    close() {
        this.props.onClose();
        this.setState({modalVisible: false});
    }

    show = async () => {
        this.clients = await fetchClientsData(this.props.token);
        //console.log(this.clients);
        this.setState({modalVisible: true});
    }
    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id, name) => {
        // updater functions are preferred for transactional updates
        //console.log(id);

        this.props.onSelectedClient(id,name);
        //this.setState({modalVisible: false});
        //this.props.selected = id;
        //this.setState({selected:id});
        //console.log(this.state);
    };

    _renderItem = ({item}) => {
        //console.log(item.fullname);
        if(typeof this.state.search == 'undefined' || (this.state.search != 'undefined' && item.fullname.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0))
        {
            return (
                <ClientSearchItem
                    id={item.id}
                    onPressItem={this._onPressItem}
                    selected={(item.id == this.state.selected)}
                    name={item.fullname}
                />
            )
        }

    };

    clearSearchClient = () => {
        this.refs['searchtextinput'].clear();
        this.setState({showCloseSearchBoxClient: false});
        //this.state.search = '';
        this.setState({search: ''});
    }

    changeSearchTextClient = (searchtext) => {
        if (String.prototype.trim.call(searchtext) == '') {
            this.setState({showCloseSearchBoxClient: false});
        } else {
            this.setState({showCloseSearchBoxClient: true});
        }
        //console.log(searchtext);
        this.setState({search: searchtext});
        //this.state.search = searchtext;
        //this.setState({modalVisible: true});
        //this.refs['listtechnician'].props.search = searchtext;
    }

    render() {
        //console.log(this.props.data);

        return(
            <Modal
                animationType={"none"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => this.close()}

            >
                <SafeAreaView style={{flex:1}}>
                <View style={(Platform.OS === 'android' ? layout.headercontainerAndroid : layout.headercontainer )}>
                    <LinearGradient start={[0, 0]} end={[1, 0]} colors={[color.reddish, color.reddish]}
                                    style={( Platform.OS === 'android' ? layout.headerAndroid : layout.header)}>
                        <View style={layout.headercontrols}>
                            <TouchableOpacity style={layout.headerNavLeftContainer} activeOpacity={1}
                                              onPress={() => this.close()}>
                                <View style={layout.headerNavLeft}>
                                    <Icon
                                        name={'close'}
                                        size={20}
                                        color={color.whiteRBG1} style={(Platform.OS === 'android' ? layout.navIcon : layout.navIconIOS)}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={layout.headertitle}>Select Client</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <View >
                    <View style={layout.searchContainer}>
                        <Icon
                            name={'magnify'}
                            size={20}
                            color={color.gray42} style={layout.iconsearchbox}
                        />
                        <TextInput
                            placeholder='Search Client' placeholderTextColor={color.gray42}
                            underlineColorAndroid={'transparent'}
                            style={layout.searchbox}
                            onChangeText={(searchtext) => this.changeSearchTextClient(searchtext)}
                            ref={'searchtextinput'}
                        />

                        {this.state.showCloseSearchBoxClient &&
                        <TouchableOpacity style={layout.iconclosesearchbox} activeOpacity={1}
                                          onPress={() => this.clearSearchClient()}>
                            <Icon
                                name={'close-circle-outline'}
                                size={20}
                                color={color.gray42}
                            />
                        </TouchableOpacity>
                        }


                    </View>
                </View>
                <View style={{flex:1}}>
                    <FlatList
                        data={this.clients}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        extraData={(this.state )}
                        initialNumToRender={10}
                    />
                </View>
                </SafeAreaView>
            </Modal>
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
