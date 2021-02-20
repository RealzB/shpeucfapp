import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner, Icon } from '@/components';
import { ColorPicker } from 'react-native-color-picker';
import CountryFlag from '@/components/general/CountryFlag';
import { editUser, loadCommittee } from '@/ducks';
import { EventPanel } from '@/utils/EventPanel';
import { filterPastEvents, fullMonths } from '@/utils/events';
import { Leaderboard, FavoriteCommittees } from './';
import { openAppOrWebsite } from '@/utils/appLinking';
import { Text, View, ScrollView, Dimensions, TouchableOpacity, Modal, SafeAreaView, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('screen');

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = { colorPickerVisible: false };
	}

	didBlurSubscription = this.props.navigation.addListener('didBlur',
		() => { this.setState({ refresh: true }) }
	);

	render() {
		return !this.props.activeUser.firstName ? <Spinner /> : this.renderContent();
	}

	renderContent() {
		const { page, dashCommittees, dashboardContent } = styles;
		const { allMemberPoints, activeUser, committeesList, navigation } = this.props;

		return (
			<SafeAreaView style = { page }>
				<StatusBar backgroundColor = '#0c0b0b' barStyle = 'light-content' />
				<ScrollView>
					{ this.renderHeader() }
					<View style = { dashboardContent }>
						{ this.renderEvents() }
						<View style = { dashCommittees }>
							<View style = {{ flex: 1 }}>
								<Leaderboard
									membersPoints = { allMemberPoints }
									activeUser = { activeUser }
									navigation = { navigation }
								/>
							</View>
							<View style = {{ flex: 1 }}>
								<FavoriteCommittees
									committeesList = { committeesList }
									userCommittees = { activeUser.userCommittees }
									loadCommittee = { this.props.loadCommittee }
									navigation = { navigation }
								/>
							</View>
						</View>
					</View>
					{ this.renderButtonLinks() }
					{ this.renderFooter() }
				</ScrollView>
				{ this.renderColorPicker() }
			</SafeAreaView>
		);
	}

	renderHeader() {
		const { headerContainer, headerOptionsContainer, textColor, greetingContainer } = styles;
		const date = new Date();

		return (
			<View style = { [headerContainer, { backgroundColor: this.props.activeUser.color } ] }>
				<View style = { greetingContainer }>
					<Text style = { [textColor, { fontSize: 20 }] }>
						{ date.getHours() >= 12 ? 'Good evening' : 'Good morning' }, { this.props.activeUser.firstName }.
					</Text>
					<Text style = { textColor }>Today is { fullMonths[date.getMonth()] } { date.getDate() }</Text>
				</View>
				<View style = { headerOptionsContainer }>
					<CountryFlag />
					<Icon
						type = 'FontAwesome'
						style = {{ color: 'white' }}
						name = 'chevron-down'
						onPress = { () => this.setState({ colorPickerVisible: true }) }
						size = { 15 }
					/>
				</View>
			</View>
		);
	}

	renderEvents() {
		const { upcomingEvents, eventListContainerFull, eventEmptyText, title, textColor } = styles;
		const events = filterPastEvents(this.props.sortedEvents) || [];

		return (
			<View>
				<View style = { upcomingEvents }>
					<Text style = { [title, textColor] }>Upcoming Events</Text>
				</View>
				<View style = { eventListContainerFull }>
					{ !events.length && <Text style = { [textColor, eventEmptyText ] }>No Upcoming Events</Text>
				|| events.slice(0, 3).map(event => <EventPanel event = { event } variant = { 'Dashboard' } />) }
				</View>
			</View>
		);
	}

	renderColorPicker() {
		return (
			<Modal visible = { this.state.colorPickerVisible } transparent = { true }>
				<View style = { [styles.modalBackground, { backgroundColor: 'transparent' }] }>
					<ColorPicker
						defaultColor = '#21252b'
						oldColor = { this.props.activeUser.color }
						onColorSelected = { color => {
							editUser({ color });
							this.setState({ colorPickerVisible: false });
						} }
						style = { [styles.modalContent, { backgroundColor: 'black' }] }
					/>
				</View>
			</Modal>
		);
	}

	renderButtonLinks() {
		const { socialMediaButton, socialMediaContainer, buttonRowContainer, black } = styles;

		const socialMediaLinks = [
			{ appLink: ['slack', 'announcements', { intent: 'channel' }], appImage: 'slack' },
			{ appLink: ['facebook', 'shpeucf', { intent: 'groups' }], appImage: 'facebook' },
			{ appLink: ['web', 'https://www.shpeucf.com/', {}], appImage: 'globe' },
			{ appLink: ['instagram', 'shpeucf', {}], appImage: 'instagram' },
			{ appLink: ['linkedin', 'shpeucf', { intent: 'company' }], appImage: 'linkedin' }
		];

		return (
			<View style = { socialMediaContainer }>
				<View style = { buttonRowContainer }>
					{ socialMediaLinks.map(({ appLink, appImage }, index) =>
						<TouchableOpacity
							key = { index }
							style = { socialMediaButton }
							onPress = { () => openAppOrWebsite(...appLink) }
						>
							<Icon type = 'FontAwesome' style = { black } name = { appImage } size = { height * 0.04 } />
						</TouchableOpacity>
					) }
				</View>
			</View>
		);
	}

	renderFooter() {
		const { footer, footerText, black, textColor } = styles;

		return (
			<View style = { footer }>
				<View style = { footerText }>
					<Text style = { black }>SHPE </Text>
					<Text style = { textColor }>UCF</Text>
				</View>
			</View>
		);
	}
}

const styles = {
	page: {
		flex: 1,
		backgroundColor: '#0c0b0b'
	},
	headerContainer: {
		paddingLeft: '4%',
		justifyContent: 'center',
		flexDirection: 'row',
		height: 100
	},
	greetingContainer: {
		flex: 1,
		justifyContent: 'center'
	},
	textColor: {
		color: '#e0e6ed'
	},
	socialMediaButton: {
		alignItems: 'center',
		justifyContent: 'space-evenly',
		backgroundColor: '#FECB00',
		width: height * 0.07,
		height: height * 0.07,
		borderRadius: 15,
		paddingBottom: '2%',
		marginBottom: '2%',
		marginLeft: '2%',
		marginRight: '2%'
	},
	title: {
		fontSize: 18,
		fontWeight: '500'
	},
	modalBackground: {
		justifyContent: 'center',
		alignItems: 'center',
		margin: 0,
		height: height,
		width: width,
		backgroundColor: '#000a'
	},
	modalContent: {
		height: '50%',
		width: '80%',
		padding: 10,
		backgroundColor: '#21252b'
	},
	index: {
		color: '#000',
		borderColor: '#FECB00',
		backgroundColor: '#FECB00',
		borderStyle: 'solid',
		borderRadius: height * 0.05 * 0.5,
		justifyContent: 'center',
		alignItems: 'center',
		height: height * 0.05,
		width: height * 0.05
	},
	socialMediaContainer: {
		flex: 0.2,
		alignItems: 'center',
		height: 150
	},
	buttonRowContainer: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center'
	},
	footer: {
		height: 50,
		justifyContent: 'center',
		backgroundColor: '#FECB00',
		width: '100%'
	},
	footerText: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	dashCommittees: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		paddingTop: 10,
		height: 400
	},
	dashboardContent: {
		paddingLeft: '5%',
		paddingRight: '5%'
	},
	headerOptionsContainer: {
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingLeft: '2%',
		paddingRight: '2%'
	},
	black: {
		color: 'black'
	},
	upcomingEvents: {
		alignItems: 'center',
		height: 100,
		justifyContent: 'center',
		padding: 20
	},
	eventListContainerFull: {
		backgroundColor: '#21252b'
	},
	eventEmptyText: {
		fontSize: 20,
		textAlign: 'center',
		padding: 20,
		height: 150
	}
};

const mapStateToProps = ({ user, members, events, elect, committees }) => {
	const { activeUser } = user;
	const { allMemberPoints } = members;
	const { sortedEvents } = events;
	const { election } = elect;
	const { committeesList } = committees;

	return {
		activeUser,
		allMemberPoints,
		sortedEvents,
		election,
		committeesList
	};
};

const mapDispatchToProps = { loadCommittee };

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);