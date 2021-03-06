import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavBar, Icon } from '@/components';
import _ from 'lodash';
import { FlatList, Text, View, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { filterEvents, convertNumToDate } from '@/utils/events';
import { loadEvent, getCommittees, loadCommittee } from '@/ducks';
import { editUser } from '@/services/user';

const dimension = Dimensions.get('screen');
const iteratees = ['level'];
const order = ['asc'];

class Committees extends Component {
	constructor(props) {
		super(props);
		this.state = { opened: {} };
	}

	componentDidMount() {
		this.props.getCommittees();
	}

	render() {
		const {
			content,
			page
		} = styles;
		const {
			committeesList,
			navigation
		} = this.props;

		const committeesArray = _.orderBy(committeesList, iteratees, order);

		return (
			<SafeAreaView style = { page }>
				<NavBar title = 'Committees' back onBack = { () => navigation.pop() } />
				<View style = { content }>
					{ this.renderFlatlist(committeesArray) }
				</View>
			</SafeAreaView>
		);
	}

	toggleEvents(title) {
		if (this.state.opened[title] && this.state.opened[title])
			return null;
		else
			return true;
	}

	filterDates(date) {
		let tempDate = date.split('-');
		let thisdate = new Date();
		let month = thisdate.getMonth() + 1;
		let year = thisdate.getFullYear();
		let day = thisdate.getDate();

		if (tempDate[0] < parseInt(year)) return true;
		if (tempDate[1] < parseInt(month)) return true;
		if (tempDate[2] < parseInt(day)) return true;
	}

	_keyExtractor = (item, index) => index;

	renderFlatlist(committees) {
		return (
			<View style = {{}}>
				<FlatList
					data = { committees }
					extraData = { this.props }
					keyExtractor = { this._keyExtractor }
					renderItem = { ({ item }) => this.renderCommittees(item) }
				/>
			</View>
		);
	}

	viewCommittee(item) {
		this.props.loadCommittee(item);
		this.props.navigation.push('CommitteePage');
	}

	renderCommittees(item) {
		const {
			containerStyle,
			contentContainerStyle,
			textColor
		} = styles;

		const {
			user,
			sortedEvents,
			route: { params }
		} = this.props;

		if (params && params.prevRoute === 'Dashboard') {
			return (
				<View >
					<View style = { contentContainerStyle }>
						<View style = {{ flex: 0.3 }}></View>
						<View style = { containerStyle }>
							<Text style = { [textColor, { fontSize: 16 }] }>{ item.title }</Text>
						</View>
						{ user.userCommittees && user.userCommittees[item.title]
							&& <View
								style = {{ backgroundColor: 'black', justifyContent: 'center', flex: 2, alignItems: 'flex-end' }}
							>
								<Icon
									name = 'star'
									size = { dimension.height * 0.03 }
									onPress = { () => {
										editUser({ userCommittees: {
											...user.userCommittees,
											...{ [item.title]: null }
										} });
										this.setState({});
									} }
									style = {{ color: '#FECB00' }}
								/>
							</View> }
						{ (!user.userCommittees || !user.userCommittees[item.title])
						&& <View
							style = {{ backgroundColor: 'black', justifyContent: 'center', flex: 2, alignItems: 'flex-end' }}
						>
							<Icon
								name = 'star-outline'
								size = { dimension.height * 0.03 }
								onPress = { () => {
									if (!user.userCommittees || Object.entries(user.userCommittees).length <= 4) {
										editUser({ userCommittees: {
											...user.userCommittees,
											...{ [item.title]: true }
										} });
									}
								} }
								style = {{ color: '#FECB00' }}
							/>
						</View> }
						<View style = {{ flex: 0.3 }}></View>
					</View>
				</View>
			);
		}

		return (
			<View >
				<TouchableOpacity onPress = { () => this.viewCommittee(item) } style = { contentContainerStyle }>
					<View style = {{ flex: 0.3 }}></View>
					<View style = { containerStyle }>
						<Text style = { [textColor, { fontSize: 16 }] }>{ item.title }</Text>
					</View>
					{ (!this.state.opened[item.title]
					&& <View
						style = {{ backgroundColor: 'black', justifyContent: 'center', flex: 2, alignItems: 'flex-end' }}
					>
						<Icon
							name = 'calendar'
							size = { dimension.height * 0.03 }
							onPress = { () => {
								this.setState({ opened: Object.assign(this.state.opened, { [item.title]: this.toggleEvents(item.title) }) });
							} }
							style = {{ color: 'white' }}
						/>
					</View>) }
					{ (this.state.opened[item.title]
					&& <View
						style = {{ backgroundColor: 'black', justifyContent: 'center', flex: 2, alignItems: 'flex-end' }}
					>
						<Icon
							name = 'calendar'
							size = { dimension.height * 0.03 }
							onPress = { () => {
								this.setState({ opened: Object.assign(this.state.opened, { [item.title]: this.toggleEvents(item.title) }) });
							} }
							style = {{ color: '#FECB00' }}
						/>
					</View>) }
					<View style = {{ flex: 1 }}></View>
					<View style = {{ flex: 0.6, justifyContent: 'center' }}>
						<Icon
							name = 'chevron-forward-circle-outline'
							size = { dimension.height * 0.025 }
							style = {{ color: '#FECB00', backgroundColor: 'transparent', alignSelf: 'center' }}
						/>
					</View>
					<View style = {{ flex: 0.3 }}></View>
				</TouchableOpacity>
				{ this.state.opened[item.title] && item.events
				&& <View style = {{}}>
					<FlatList
						data = { filterEvents(Object.keys(item.events), sortedEvents) }
						extraData = { this.props }
						keyExtractor = { this._keyExtractor }
						renderItem = { ({
							item
						}) =>
							this.renderEvents(item) }
					/>
				</View> }
			</View>
		);
	}

	viewEvent(item) {
		loadEvent(item);
	}

	renderEvents(event) {
		const {
			contentContainerStyle
		} = styles;

		if (this.filterDates(event.date) || !event) return null;
		const {
			name,
			date,
			startTime,
			endTime
		} = event;

		let realStart = this.convertHour(startTime);
		let realEnd = this.convertHour(endTime);

		return (
			<View>
				<View style = { [contentContainerStyle, { backgroundColor: '#0c0b0b' }] }>
					<View style = {{ flexDirection: 'row', flex: 1 }}>
						<View style = {{ flex: 0.1 }}></View>
						<View style = {{ alignItems: 'center', flexDirection: 'row', borderColor: 'white', flex: 1 }}>
							<View style = {{ flex: 1, alignItems: 'flex-start' }}>
								<View style = {{ alignItems: 'flex-start' }}>
									<Text style = {{ color: 'white', fontSize: dimension.width * 0.035 }}>{ name }</Text>
									<Text style = {{ color: 'white', fontSize: dimension.width * 0.035 }}>{ convertNumToDate(date) } - { realStart } - { realEnd } </Text>
								</View>
							</View>
							<View style = {{ flex: 0.08, height: '60%' }}></View>
						</View>
					</View>
				</View>
			</View>
		);
	}

	convertHour(time) {
		let array = time.split(':');
		let hour;

		if (array[2] === 'AM') {
			hour = '' + parseInt(array[0]);
			if (hour === '0') hour = '12';

			return hour + ':' + array[1] + ':' + array[2];
		}

		hour = '' + (parseInt(array[0]) - 12);
		if (hour === '0') hour = '12';

		return hour + ':' + array[1] + ':' + array[2];
	}

	renderbuttons(item) {
		const {
			position,
			id,
			firstName,
			lastName
		} = item;
		const {
			deleteApplication,
			approveApplication
		} = this.props;
		const {
			buttonContainerStyle
		} = styles;

		if (!item.approved) {
			return (
				<View style = { [{ flexDirection: 'row', flex: 1 }] }>
					<View style = { buttonContainerStyle }>
						<TouchableOpacity
							onPress = { () => approveApplication(position, id, firstName, lastName) }>
							<Icon name = 'md-checkmark-circle' size = { 40 } color = '#e0e6ed' />
						</TouchableOpacity>
					</View>
					<View style = { buttonContainerStyle }>
						<TouchableOpacity
							onPress = { () => deleteApplication(position, id) }>
							<Icon name = 'md-close-circle' size = { 40 } color = '#e0e6ed' />
						</TouchableOpacity>
					</View>
				</View>
			);
		}
		else {
			return (
				<View style = { [{ flexDirection: 'row', flex: 1 }] }>
					<View style = { buttonContainerStyle }>
						<TouchableOpacity onPress = { () => this.viewCandidate(item) }>
							<Icon name = 'md-create' size = { 40 } color = '#e0e6ed' />
						</TouchableOpacity>
					</View>
					<View style = { buttonContainerStyle }>
						<TouchableOpacity
							onPress = { () => deleteApplication(position, id) }>
							<Icon name = 'md-remove-circle' size = { 40 } color = '#e0e6ed' />
						</TouchableOpacity>
					</View>
				</View>
			);
		}
	}
}

const styles = {
	containerStyle: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'flex-start',
		backgroundColor: 'black',
		paddingHorizontal: 15
	},
	containerTextStyle: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingVertical: 10,
		paddingHorizontal: 15
	},
	textColor: {
		color: 'white'
	},
	contentContainerStyle: {
		backgroundColor: 'black',
		height: dimension.height * 0.09,
		flexDirection: 'row'
	},
	content: {
		flex: 0.98
	},
	buttonContainerStyle: {
		flex: 0.5,
		justifyContent: 'center'
	},
	page: {
		flex: 1,
		backgroundColor: '#0c0b0b'
	},
	candidateContainer: {
		flex: 0.5,
		marginTop: dimension.height * 0.002,
		flexDirection: 'row',
		justifyContent: 'center',
		height: dimension.height * 0.09
	}
};

const mapStateToProps = ({ committees, user, events }) => {
	const { committeesList } = committees;
	const { sortedEvents } = events;

	return { committeesList, user, sortedEvents };
};

const mapDispatchToProps = { getCommittees, loadCommittee };

export default connect(mapStateToProps, mapDispatchToProps)(Committees);