import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { Alert, Button, ButtonLayout, Form, Avatar, Icon } from '@/components';
import Flag from 'react-native-flags';
import { openGallery, verifiedCheckMark } from '@/utils/render';
import { editUser } from '@/services/user';
import { logoutUser } from '@/services/app';
import {
	editProfileFormDataPrivileged,
	editProfileFormDataRegular,
	convertObjectToInitialValues
} from '@/data/FormData';

const { height, width } = Dimensions.get('screen');

class Profile extends Component {
	constructor(props) {
		super(props);

		this.state = { editProfileFormVisibility: false };
	}

	shouldComponentUpdate(nextProps) {
		return nextProps.firstName || nextProps.lastName || nextProps.firstName !== '';
	}

	render() {
		return this.renderContent();
	}

	renderContent() {
		const { email, major, points, privilege } = this.props.user;
		const { bioContainer, fieldContainerStyle, itemLabelText, itemValueText, textColor } = styles;

		return (
			<SafeAreaView style = {{ flex: 1, backgroundColor: '#0c0b0b' }}>
				<Form
					elements = { privilege.eboard ? editProfileFormDataPrivileged : editProfileFormDataRegular }
					values = { this.props.user }
					title = 'Edit Profile'
					visible = { this.state.editProfileFormVisibility }
					changeVisibility = { (visible) => this.setState({ editProfileFormVisibility: visible }) }
					onSubmit = { updatedUser => editUser(updatedUser) }
				/>
				<View style = {{ flex: 1, backgroundColor: 'black' }}>
					{ this.renderPicture() }
					<View style = { [bioContainer] }>
						<View style = {{ flex: 0.2 }}></View>
						<View style = {{ flexDirection: 'row', flex: 1.5, justifyContent: 'space-evenly' }}>
							<View style = {{ flex: 0.1 }}></View>
							<View style = { [fieldContainerStyle, { flex: 0.3 }] }>
								<View style = {{ flex: 1, justifyContent: 'center' }}>
									<Text style = { [itemLabelText, textColor] }>Email:</Text>
								</View>
								{ major !== '' && <View style = {{ flex: 1, justifyContent: 'center' }}>
									<Text style = { [itemLabelText, textColor] }>Major:</Text>
								</View> }
								<View style = {{ flex: 1, justifyContent: 'center' }}>
									<Text style = { [itemLabelText, textColor] }>Points:</Text>
								</View>
							</View>
							<View style = { [fieldContainerStyle] }>
								<View style = {{ flex: 1, justifyContent: 'center' }}>
									<Text style = { [itemValueText, textColor] }>{ email }</Text>
								</View>
								{ major !== '' && <View style = {{ flex: 1, justifyContent: 'center' }}>
									<Text style = { [itemValueText, textColor] }>{ major }</Text>
								</View> }
								<View style = {{ flex: 1, justifyContent: 'center' }}>
									<Text style = { [itemValueText, textColor] }>{ points }</Text>
								</View>
							</View>
							<View style = {{ flex: 0.1 }}></View>
						</View>
						<View style = {{ flex: 0.2 }}></View>
					</View>
					{ this.renderSocialMedia() }
					{ this.renderButtons() }
				</View>
			</SafeAreaView>
		);
	}

	renderPicture() {
		const { headerInfoContainer, taglineContainer, nameLabelText, textColor, row } = styles;
		const { firstName, lastName, picture, privilege, color, id } = this.props.user;

		return (
			<View style = { [headerInfoContainer] }>
				<View style = {{ flex: 1, paddingTop: '8%', marginBottom: '30%' }}>
					{ picture
						? <Avatar
							size = 'xlarge'
							source = { picture }
							onPress = { () => openGallery(`users/${id}`, id) }
							showEdit
						/>
						: <Avatar
							size = 'xlarge'
							titleStyle = {{ backgroundColor: color }}
							title = { firstName[0].concat(lastName[0]) }
							onPress = { () => openGallery(`users/${id}`, id) }
							showEdit
						/> }
				</View>
				<View style = { [taglineContainer] }>
					<View style = { row }>
						<Text style = { [nameLabelText, textColor] }>{ firstName } { lastName }</Text>
						{ verifiedCheckMark(privilege || {}) }
					</View>
				</View>
			</View>
		);
	}

	renderButtons() {
		const { flag } = this.props.user;

		let icon = flag !== '' && flag ? {
			data: <Flag
				type = 'flat'
				code = { flag }
				size = { 32 }
			/>,
			layer: 1
		} : null;

		return (
			<ButtonLayout icon = { icon }>
				<Button
					title = 'Edit profile'
					onPress = { () => this.setState({ editProfileFormVisibility: true }) }
				/>
				<Button
					title = 'Logout'
					onPress = { () => logoutUser() }
				/>
			</ButtonLayout>
		);
	}

	renderSocialMedia() {
		const { logoContainer, socialMediaRow } = styles;
		const { color } = this.props.user;

		return (
			<View style = {{ flex: 0.2 }}>
				<View style = {{ flex: 0.03 }} />
				<View style = { socialMediaRow }>
					<View style = { [logoContainer, { backgroundColor: color, flex: 1 }] }>
						<TouchableOpacity onPress = { () => Alert.alert('Coming Soon') }>
							<Icon name = 'logo-linkedin' size = { height * 0.045 } color = 'white' />
						</TouchableOpacity>
					</View>
					<View style = {{ flex: 0.01 }} />
					<View style = { [logoContainer, { backgroundColor: color, flex: 1 }] }>
						<TouchableOpacity onPress = { () => Alert.alert('Coming Soon') }>
							<Icon name = 'mail' size = { height * 0.045 } color = 'white' />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

const styles = {
	headerInfoContainer: {
		flex: 1.4,
		backgroundColor: 'black',
		alignItems: 'center',
		borderBottomColor: '#e0e6ed22'
	},
	textColor: {
		color: '#e0e6ed'
	},
	row: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row'
	},
	taglineContainer: {
		flex: 0.4,
		paddingVertical: '3%',
		alignItems: 'center',
		justifyContent: 'flex-end',
		width: '70%'
	},
	fieldContainerStyle: {
		height: '100%',
		flexDirection: 'column',
		alignItems: 'flex-start',
		flex: 1
	},
	nameLabelText: {
		fontSize: height * 0.03,
		fontWeight: 'bold',
		color: '#fff',
		lineHeight: height * 0.03
	},
	itemLabelText: {
		fontSize: width * 0.04,
		fontWeight: 'bold',
		color: '#fff',
		lineHeight: height * 0.03
	},
	itemValueText: {
		fontSize: height * 0.02,
		fontWeight: '500',
		color: '#fff'
	},
	logoContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	socialMediaRow: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: 'black'
	},
	bioContainer: {
		flex: 0.7,
		backgroundColor: '#21252b'
	}
};

const mapStateToProps = ({ user }) => {
	return { user };
};

export default connect(mapStateToProps)(Profile);