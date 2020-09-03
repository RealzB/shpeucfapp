import React from "react";
import { Text, TouchableOpacity } from "react-native";

/**
 * @description Creates a button with TouchableOpacity. *Accepts optional `Text` props*.
 *
 * @typedef {Object} Props
 * @prop {Function}         onPress     Called when the button is pressed.
 * @prop {String}           title       Text displayed in button.
 * @prop {Object}           style       Button style.
 * @prop {Object}           titleStyle  Button text style.
 * @prop {(String|Number)}  height      Button height.
 * @prop {(String|Number)}  width       Button width.
 *
 * @param {...Props}
 */

export const Button = ({ onPress, title, style, titleStyle, height, width, ...extraProps }) => {
	const { bStyle, tStyle } = styles;

	return (
		<TouchableOpacity style = { [bStyle, style, { height, width }] } onPress = { onPress }>
			<Text style = { [tStyle, titleStyle] } adjustsFontSizeToFit { ...extraProps }>{ title }</Text>
		</TouchableOpacity>
	);
};

Button.defaultProps = {
	title: "Add a title!",
	numberOfLines: 1
};

const styles = {
	tStyle: {
		flex: 1,
		color: "#000",
		textAlign: "center",
		fontSize: 18
	},
	bStyle: {
		flexDirection: "row",
		backgroundColor: "#FECB00",
		borderRadius: 15,
		borderColor: "#000",
		borderWidth: 1,
		padding: 5
	}
};