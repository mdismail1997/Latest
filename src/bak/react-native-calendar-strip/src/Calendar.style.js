/**
 * Created by bogdanbegovic on 8/26/16.
 */

import {
    StyleSheet
} from 'react-native';

export default StyleSheet.create({

    //CALENDAR STYLES
    calendarContainer: {
        overflow: 'hidden'
    },
    datesStrip: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    calendarDates: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    calendarHeader: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },

    //CALENDAR DAY
    dateContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: 60,
        height: 60,
        borderRadius: 50 / 2
    },
    dateName: {
        fontSize: 10,
        textAlign: 'center'
    },
    weekendDateName: {
        fontSize: 10,
        color: '#A7A7A7',
        textAlign: 'center'
    },
    dateNumber: {
         alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
	 dateNumberText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    weekendDateNumber: {
        fontSize: 18,
        color: '#A7A7A7',
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
