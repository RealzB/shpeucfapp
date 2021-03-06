import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { Input, Button, FilterList, ButtonLayout, MemberPanel } from '@/components';
import { assignPosition } from '@/services/members';
import {
	addCommittee,
	editCommittee,
	committeeTitleChanged,
	committeeDescriptionChanged,
	deleteCommittee,
	chairPersonChanged
} from '@/ducks';

const dimension = Dimensions.get('screen');

class CommitteeForm extends Component {
	/*
	 * EventCreationError(text) {
	 * 	this.props.eventError(text);
	 * }
	 */
	constructor(props) {
		super(props);
		this.state = {
			oldTitle: this.props.committeeTitle,
			oldChair: this.props.chair
		};
	}

	renderError() {
		if (this.props.error) {
			return (
				<View>
					<Text style = { styles.errorTextStyle }>
						{ this.props.error }
					</Text>
				</View>
			);
		}
	}

	submitForm() {
		const {
			committeeTitle,
			committeeDescription,
			committeesList,
			chair,
			navigation,
			route: { params: { action } }
		} = this.props;

		let length = committeesList && committeesList ? Object.entries(committeesList).length : 0;
		let chairObj = { name: `${chair.firstName} ${chair.lastName}`, id: chair.id };

		if (committeeTitle === '') {
			// this.EventCreationError('Please enter a Candidate Name');
		}
		else if (committeeDescription === '') {
			// this.EventCreationError('Please enter a committee');
		}
		else {
			if (action === 'ADD')
				this.props.addCommittee(committeeTitle, committeeDescription, chairObj, length);
			else if (this.state.oldTitle !== committeeTitle)
				this.props.editCommittee(committeeTitle, committeeDescription, chairObj, this.state.oldTitle);
			else
				this.props.editCommittee(committeeTitle, committeeDescription, chairObj, null);

			assignPosition(committeeTitle, 'board', chair.id, this.state.oldChair);
			navigation.pop();
		}
	}

	render() {
		const {
			allMemberAccounts,
			chair,
			navigation,
			route: { params: { action } }
		} = this.props;

		return (
			<SafeAreaView style = { styles.formContainerStyle }>
				<View style = { styles.headerStyle }>
					<Text style = { styles.headerTextStyle }>{ action + ' COMMITTEE' }</Text>
				</View>
				<ScrollView
					ref = { (ref) => this.scrollView = ref }
					style = { styles.scrollView }
				>
					<View>
						<Input
							placeholder = 'Committee Title'
							value = { this.props.committeeTitle }
							onChangeText = { this.props.committeeTitleChanged.bind(this) }
						/>
						<Input
							placeholder = 'Committee Description'
							value = { this.props.committeeDescription }
							onChangeText = { this.props.committeeDescriptionChanged.bind(this) }
						/>
						<FilterList
							data = { allMemberAccounts }
							value = { allMemberAccounts[chair.id] }
							placeholder = { 'Director/Chairperson' }
							regexFunc = { member => { return `${member.firstName} ${member.lastName}` } }
							selectBy = { member => { return member.id } }
							onSelect = { member => { this.props.chairPersonChanged(member) } }
							itemJSX = { member => <MemberPanel member = { member } variant = 'General' /> }
						/>
					</View>
					{ this.renderError() }
				</ScrollView>
				<ButtonLayout>
					<Button
						title = { 'Done' }
						onPress = { () => {	this.submitForm() } }
					/>
					<Button
						title = 'Cancel'
						onPress = { () => navigation.pop() }
					/>
				</ButtonLayout>
			</SafeAreaView>
		);
	}
}

const styles = {
	formContainerStyle: {
		flex: 1,
		backgroundColor: '#0c0b0b'
	},
	headerStyle: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 0.5
	},
	headerTextStyle: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#e0e6ed'
	},
	errorTextStyle: {
		fontSize: 14,
		alignSelf: 'center',
		color: 'red',
		fontWeight: 'bold',
		padding: 10
	},
	pickerTextInput: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	scrollView: {
		backgroundColor: 'black',
		height: '50%',
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: '5%',
		paddingRight: '5%'
	},
	titleStyle: {
		flex: 0.13,
		alignSelf: 'center',
		fontSize: 20
	},
	buttonStyle: {
		flex: 1,
		alignSelf: 'center'
	},
	flatlistStyle: {
		flex: 0.8
	},
	buttonContainer: {
		flex: 0.2,
		flexDirection: 'row',
		borderTopColor: '#0001',
		borderTopWidth: 1
	},
	modalBackground: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#0003',
		margin: 0,
		height: dimension.height,
		width: dimension.width
	},
	modalStyle: {
		height: dimension.height * 0.4,
		width: dimension.width * 0.8,
		backgroundColor: '#fff',
		padding: 12,
		borderRadius: 12
	},
	textStyle: {
		color: '#e0e6ed',
		fontSize: dimension.width * 0.05
	}
};

const mapStateToProps = ({ committees, members }) => {
	const {
		allMemberAccounts
	} = members;
	const {
		committeeTitle,
		committeeDescription,
		title,
		committeesList,
		chair
	} = committees;

	return { committeeTitle, committeeDescription, title, committeesList, chair, allMemberAccounts };
};

const mapDispatchToProps = {
	addCommittee,
	editCommittee,
	committeeTitleChanged,
	committeeDescriptionChanged,
	deleteCommittee,
	chairPersonChanged
};

export default connect(mapStateToProps, mapDispatchToProps)(CommitteeForm);