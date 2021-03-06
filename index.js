'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import {
  StyleSheet,
  TextInput,
  LayoutAnimation,
  Animated,
  Easing,
  Text,
  View,
  Platform,
  ViewPropTypes
} from 'react-native';

var textPropTypes = Text.propTypes || ViewPropTypes
var textInputPropTypes = TextInput.propTypes || textPropTypes
var propTypes = {
  ...textInputPropTypes,
  inputStyle: textInputPropTypes.style,
  labelStyle: textPropTypes.style,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style
}

var FloatingLabel  = createReactClass({
  propTypes: propTypes,

  getInitialState () {
    var state = {
      text: this.props.value,
      dirty: (this.props.value || this.props.placeholder),
      focus: false
    };

    var style = state.dirty ? dirtyStyle : cleanStyle
    state.labelStyle = {
      fontSize: new Animated.Value(style.fontSize),
      top: new Animated.Value(style.top)
    }

    return state
  },

  UNSAFE_componentWillReceiveProps (props) {
    if (typeof props.value !== 'undefined' && props.value !== this.state.text) {
      this.setState({ text: props.value, dirty: !!props.value })
      this._animate(!!props.value)
    }
  },

  _animate(dirty) {
    var nextStyle = dirty ? dirtyStyle : cleanStyle
    var labelStyle = this.state.labelStyle
    var anims = Object.keys(nextStyle).map(prop => {
      return Animated.timing(
        labelStyle[prop],
        {
          toValue: nextStyle[prop],
          duration: 200,
          useNativeDriver: false
        },
        Easing.ease
      )
    })

    Animated.parallel(anims).start()
  },

  _onFocus () {
    this._animate(true)
    this.setState({dirty: true, focus: true})
    if (this.props.onFocus) {
      this.props.onFocus(arguments);
    }
  },

  _onBlur () {
    if (!this.state.text) {
      this._animate(false)
      this.setState({dirty: false, focus: false});
    }

    if (this.props.onBlur) {
      this.props.onBlur(arguments);
    }
  },

  onChangeText(text) {
    this.setState({ text })
    if (this.props.onChangeText) {
      this.props.onChangeText(text)
    }
  },

  // activeInput(){
  //   if(this.state.dirty){
  //     return this.props.activeInputStyle || styles.activeInputStyle;
  //   }else{
  //     return ;
  //   }
  // },

  updateText(event) {
    var text = event.nativeEvent.text
    this.setState({ text })

    if (this.props.onEndEditing) {
      this.props.onEndEditing(event)
    }
  },

  _renderLabel () {
    return (
      <Animated.Text
        ref='label'
        style={[this.state.labelStyle, styles.label, this.props.labelStyle]}
      >
        {this.props.children}
      </Animated.Text>
    )
  },

  _renderIconRight (){
    if(this.props.renderIconRight){
      return (
        <View style={styles.iconRight}>
          {this.props.renderIconRight}
        </View>
      );
    }
  },

  render() {
    var props = {
        autoCapitalize: this.props.autoCapitalize,
        autoCorrect: this.props.autoCorrect,
        autoFocus: this.props.autoFocus,
        bufferDelay: this.props.bufferDelay,
        clearButtonMode: this.props.clearButtonMode,
        clearTextOnFocus: this.props.clearTextOnFocus,
        controlled: this.props.controlled,
        editable: this.props.editable,
        enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
        keyboardType: this.props.keyboardType,
        multiline: this.props.multiline,
        numberOfLines: this.props.numberOfLines,
        onBlur: this._onBlur,
        onChange: this.props.onChange,
        onChangeText: this.onChangeText,
        onEndEditing: this.updateText,
        onFocus: this._onFocus,
        ref: this.props.myRef,
        onSubmitEditing: this.props.onSubmitEditing,
        password: this.props.secureTextEntry || this.props.password, // Compatibility
        placeholder: this.props.placeholder,
        secureTextEntry: this.props.secureTextEntry || this.props.password, // Compatibility
        returnKeyType: this.props.returnKeyType,
        selectTextOnFocus: this.props.selectTextOnFocus,
        selectionState: this.props.selectionState,
        style: [styles.input],
        testID: this.props.testID,
        value: this.state.text,
        underlineColorAndroid: this.props.underlineColorAndroid, // android TextInput will show the default bottom border
        onKeyPress: this.props.onKeyPress,
        activeInputStyle: this.props.activeInputStyle,
        renderIconRight: this.props.renderIconRight,
        maxLength: this.props.maxLength
      },
      elementStyles = [styles.element];

    if (this.props.inputStyle) {
      props.style.push(this.props.inputStyle);
    }

    if (this.props.style) {
      elementStyles.push(this.props.style);
    }

    if(this.state.dirty && this.state.focus){
      elementStyles.push(this.props.activeInputStyle || styles.activeInputStyle);
    }

    return (
  		<View style={elementStyles}>

        {this._renderIconRight()}
        {this._renderLabel()}
        <TextInput
          {...props}
        >
        </TextInput>
      </View>
    );
  },
});

var labelStyleObj = {
  marginTop: 21,
  paddingLeft: 20,
  color: '#AAA',
  position: 'absolute'
}

if (Platform.OS === 'web') {
  labelStyleObj.pointerEvents = 'none'
}

var styles = StyleSheet.create({
  element: {
    position: 'relative'
  },
  input: {
    borderColor: 'gray',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    color: 'black',
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: Platform.OS == 'ios' ? 16 : 0,
    marginTop: Platform.OS == 'ios' ? 16 : 6,
    top: 0
  },
  activeInputStyle:{
    borderColor: '#3F73A4'
  },
  inactiveInputStyle:{
    borderColor: '#EBEFF3'
  },
  iconRight: {
    backgroundColor: 'transparent',
    position: 'absolute', 
    justifyContent: 'center',
    zIndex: 1,
    right: 0, 
    marginTop: 0, 
    paddingRight: Platform.OS == 'ios' ? 45 : 20, 
    height: 55
  },
  label: labelStyleObj
})

var cleanStyle = {
  fontSize: 18,
  top: -5
}

var dirtyStyle = {
  fontSize: 12,
  top: -14
}

module.exports = FloatingLabel;
