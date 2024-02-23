/**
 * Created by bogdanbegovic on 8/20/16.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    LayoutAnimation,
    Easing,
    TouchableOpacity
} from 'react-native';
import styles from './Calendar.style.js';
import PropTypes from 'prop-types';
export default class CalendarDay extends Component {

    static propTypes = {
        date: PropTypes.object.isRequired,
        onDateSelected: PropTypes.func.isRequired,
        selected: PropTypes.bool.isRequired,
        enabled: PropTypes.bool.isRequired,

        showDayName: PropTypes.bool,
        showDayNumber: PropTypes.bool,

        calendarColor: PropTypes.string,

        dateNameStyle: PropTypes.any,
        dateNumberStyle: PropTypes.any,
        weekendDateNameStyle: PropTypes.any,
        weekendDateNumberStyle: PropTypes.any,
        highlightDateNameStyle: PropTypes.any,
        highlightDateNumberStyle: PropTypes.any,
        disabledDateNameStyle: PropTypes.any,
        disabledDateNumberStyle: PropTypes.any,
        styleWeekend: PropTypes.bool,

        daySelectionAnimation: PropTypes.object
    };

    // Reference: https://medium.com/@Jpoliachik/react-native-s-layoutanimation-is-awesome-4a4d317afd3e
    static defaultProps = {
        daySelectionAnimation: {
          type: '',  // animations disabled by default
          duration: 300,
          borderWidth: 1,
          borderHighlightColor: 'black',
          highlightColor: 'yellow',
          animType: LayoutAnimation.Types.easeInEaseOut,
          animUpdateType: LayoutAnimation.Types.easeInEaseOut,
          animProperty: LayoutAnimation.Properties.opacity,
          animSpringDamping: undefined,  // Only applicable for LayoutAnimation.Types.spring,
        },
        styleWeekend: true,
        showDayName: true,
        showDayNumber: true,
  };

    constructor(props) {
        super(props);

        this.state = {
          selected: props.selected
        }
		
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.state.selected !== nextProps.selected) {
        if (this.props.daySelectionAnimation.type !== '') {
          let configurableAnimation = {
            duration: this.props.daySelectionAnimation.duration || 300,
            create: {
              type: this.props.daySelectionAnimation.animType || LayoutAnimation.Types.easeInEaseOut,
              property: this.props.daySelectionAnimation.animProperty || LayoutAnimation.Properties.opacity,
            },
            update: {
              type: this.props.daySelectionAnimation.animUpdateType || LayoutAnimation.Types.easeInEaseOut,
              springDamping: this.props.daySelectionAnimation.animSpringDamping
            },
            delete: {
              type: this.props.daySelectionAnimation.animType || LayoutAnimation.Types.easeInEaseOut,
              property: this.props.daySelectionAnimation.animProperty || LayoutAnimation.Properties.opacity,
            },
          };
          LayoutAnimation.configureNext(configurableAnimation);
        }

        this.setState({ selected: nextProps.selected});
      }
    }

    render() {
      /*
      if (this.state.selected){
        console.log(this.props.date.format('YYYY-MM-DD HH:mm'));
      }*/

        let dateViewStyle;
        //let dateNameStyle = [styles.dateName, this.props.disabledDateNameStyle];
		let dateNameStyle = [styles.dateName, this.props.dateNameStyle];
        //let dateNumberStyle = [styles.dateNumber, this.props.disabledDateNumberStyle];
		let dateNumberStyle = [styles.dateNumber, this.props.dateNumberStyle];
		let dateNumberStyleText = [styles.dateNumberText, this.props.dateNumberStyleText];
        if (this.props.enabled) {
          //The user can disable animation, so that is why I use selection type
          //If it is background, the user have to input colors for animation
          //If it is border, the user has to input color for border animation
          switch (this.props.daySelectionAnimation.type) {
            case 'background':
              let dateViewBGColor = this.state.selected ? this.props.daySelectionAnimation.highlightColor : this.props.calendarColor;
              dateViewStyle = {backgroundColor: dateViewBGColor};
              break;
            case 'border':
              let dateViewBorderWidth = this.state.selected ? this.props.daySelectionAnimation.borderWidth : 0;
              dateViewStyle = {borderColor: this.props.daySelectionAnimation.borderHighlightColor, borderWidth: dateViewBorderWidth};
              break;
            default:
              // No animation styling by default
              break;
          }

          dateNameStyle = [styles.dateName, this.props.dateNameStyle];
          dateNumberStyle = [styles.dateNumber, this.props.dateNumberStyle];
		  dateNumberStyleText = [styles.dateNumberText, this.props.dateNumberStyleText];
          if (this.props.styleWeekend && (this.props.date.isoWeekday() === 6 || this.props.date.isoWeekday() === 7)) {
              //dateNameStyle = [styles.weekendDateName, this.props.weekendDateNameStyle];
              //dateNumberStyle = [styles.weekendDateNumber, this.props.weekendDateNumberStyle];
          }
          if (this.state.selected) {
            dateNameStyle = [styles.dateName, this.props.highlightDateNameStyle];
            dateNumberStyle = [styles.dateNumber, this.props.highlightDateNumberStyle];
			dateNumberStyleText = [styles.dateNumberText, this.props.highlightDateNumberStyleText];
          }
        }

        return (
          <TouchableOpacity onPress={this.props.onDateSelected.bind(this, this.props.date)}>
            <View key={this.props.date} style={[styles.dateContainer, dateViewStyle]}>
              { this.props.showDayName &&
                <Text style={dateNameStyle}>{this.props.date.format('dd')}</Text>
              }
              { this.props.showDayNumber &&
                <View style={dateNumberStyle}>
					<Text style={dateNumberStyleText}>{this.props.date.date()}</Text>
				</View>
              }
            </View>
          </TouchableOpacity>
        );
    }
}
