import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { View } from 'react-native-animatable'
import PropTypes from 'prop-types'

const DEFAULT_SIZE_MULTIPLIER = 0.7
const DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER = 0.2

export default class RadioButton extends Component {
  static propTypes = {
    size: PropTypes.number,
    innerColor: PropTypes.string,
    outerColor: PropTypes.string,
    isSelected: PropTypes.bool,
    onPress: PropTypes.func
  }

  static defaultProps = {
    size: 16,
    lblFontSize:20,
    innerColor: 'black',
    outerColor: 'black',
    isSelected: false,
    onPress: () => null
  }

  render () {
    const { size, innerColor, outerColor, isSelected, onPress, lblFontSize } = this.props
    const outerStyle = {
      borderColor: outerColor,
      width: size + size * DEFAULT_SIZE_MULTIPLIER,
      height: size + size * DEFAULT_SIZE_MULTIPLIER,
      borderRadius: (size + size * DEFAULT_SIZE_MULTIPLIER) / 2,
      borderWidth: size * DEFAULT_OUTER_BORDER_WIDTH_MULTIPLIER
    }

    const innerStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: innerColor
    }

    return (
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <TouchableOpacity style={[styles.radio, outerStyle]} onPress={onPress}>
          {isSelected ? <View style={innerStyle} {...this.props}></View> : null }
        </TouchableOpacity>
        <Text onPress={onPress} style={{marginLeft:8,fontSize:lblFontSize}}>{this.props.rightText}</Text>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({
  radio: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
})