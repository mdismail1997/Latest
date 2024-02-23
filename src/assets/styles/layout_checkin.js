import {StyleSheet} from "react-native";
import Colors from "../../constants/Colors_checkin";
import { color } from "../colors/colors";
export default StyleSheet.create({
    formgroupIpad: {
        width: 470,
    },
    formgroup: {
        width: 270,
    },
    textLoaderScreen: {
        color: Colors.spinnerLoaderColor,
        fontWeight: 'normal',
        fontSize: 20
    },
    textLoaderScreenSubmit: {
        color: Colors.spinnerLoaderColorSubmit,
        fontWeight: 'normal',
        fontSize: 16
    },
    textLoaderScreenSubmitSucccess: {
        color: Colors.spinnerLoaderColorSubmit,
        fontWeight: 'normal',
        fontSize: 14
    },
    navTitleText: {
        color: color.white,
        fontSize:16
    },
    navIcon:{
        zIndex:1
    },
    navIconIOS:{
        zIndex:10,
        marginTop:5
    },
    navContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navIconRight:{
        position: 'absolute',
        right:15,
        top:0,
        bottom:0,
        justifyContent: 'center',
    },
    headercontainer: {
        height:70
    },
    headercontainerAndroid: {
        height:60
    },
    headercontainerprofile: {
        height:190
    },
    headercontainerprofileAndroid: {
        height:175
    },
    headercontainerprofileModal: {
        height:170
    },
    headercontainerprofileAndroidModal: {
        height:155
    },
    header: {
        flex: 1,
        backgroundColor:'transparent',
        paddingTop:10
    },
    headerAndroid: {
        flex: 1,
        backgroundColor:'transparent',
        paddingTop:0
    },
    headertitle: {
        color: color.white,
        zIndex:1,
        backgroundColor:'transparent',
        fontSize:16
    },
    headercontrols: {
        flex: 1,
    },
    headerNavLeftContainer:{
        position: 'absolute',left:15,top:0,bottom:0,flex:1,
        zIndex:9
    },
    headerNavLeft:{
        flex:1 ,flexDirection: 'row',justifyContent: 'center', alignItems: 'center'
    },
    headerNavLeftContainer:{
        position: 'absolute',left:15,top:0,bottom:0,flex:1,
        zIndex:9
    },
    headerNavRightContainer:{
        position: 'absolute',right:15,top:0,bottom:0,flex:1,
        zIndex:9
    },
    headerNavRight:{
        flex:1 ,flexDirection: 'row',justifyContent: 'center', alignItems: 'center'
    },
    headerNavRightProfile:{
        flex:1 ,
        flexDirection: 'row',
         marginTop:25
    },
        headerNavRightProfileAndroid:{
        flex:1 ,
        flexDirection: 'row',
         marginTop:35
    },
        headerNavRightProfileModal:{
        flex:1 ,
        flexDirection: 'row',
         marginTop:25
    },
        headerNavRightProfileAndroidModal:{
        flex:1 ,
        flexDirection: 'row',
         marginTop:10
    },
    headerNavText:{
        fontSize:14,
        color:color.white
    },
    headerNavCenter:{
        flex:1, justifyContent: 'center', alignItems: 'center'
    },
    searchContainer: {
        height:70,
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:50,
        paddingRight:50,
        justifyContent: 'center'

    },
    searchbox:{
        flex:1,
        backgroundColor:color.white,
        height:50,
        borderRadius:4,
        paddingLeft:40,
        paddingRight:40,
        fontSize:16,
        borderRadius:50
    },
    iconsearchbox:{
        position:'absolute',
        backgroundColor:'transparent',
        zIndex:1,
        left:65
    },
    iconclosesearchbox:{
        position:'absolute',
        backgroundColor:'transparent',
        zIndex:1,
        right:65
    },
    listviewcontainer: {
        backgroundColor: color.lightWhite,
        flex:1
    },
    listview: {
        backgroundColor:color.white,

    },
    floatGroup:{
        height:50
    },
    floatGroupsection:{
        height:35,backgroundColor: color.lightWhite,justifyContent: 'center',paddingLeft:15,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
    },
    floatGroupSeperate:{
        height:10,
        backgroundColor: color.lightWhite,
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: color.whitishBorder,
    }
});
