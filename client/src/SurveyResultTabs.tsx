import { useState } from 'react'
import Table from 'react-bootstrap/Table'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Badge from 'react-bootstrap/Badge'
import { PeopleAgeCompare } from './types'

export interface SurveyResultProps {
	peopleAgeCompare: PeopleAgeCompare
}

/**
 * Render the tabs for the mood survey result
 *
 * @param {SurveyResultProps} props
 * @returns SurveyResultTabs
 */
const SurveyResultTabs = (props: SurveyResultProps) => {
	const [key, setKey] = useState('last-survey')

	/**
	 * Render the individual mood survey result tabs
	 *
	 * @returns
	 */
	const renderTabs = () => {
		const person = props.peopleAgeCompare.person
		const previousSurvey = props.peopleAgeCompare.previousSurvey
		const ownAgeGroup = props.peopleAgeCompare.ownAgeGroup

		//console.log('otherAgeGroups', otherAgeGroups)

		return (
			<Tabs
				defaultActiveKey="profile"
				id="survey-result-tabs"
				className="mb-3"
				activeKey={key}
				onSelect={(k) => {
					if (k) setKey(k)
				}}
			>
				<Tab eventKey="last-survey" title="Last mood survey">
					<h6>Full Name: {person.fullName}</h6>
					<Badge bg="secondary">Age group {person.age}</Badge>
					<Table className="mt-3" striped bordered hover>
						<thead>
							<tr>
								<th>Category</th>
								<th>Last Survey</th>
								<th>Previous Survey</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Happiness</td>
								<td>{person.happyScale}</td>
								<td>{previousSurvey ? previousSurvey.happyScale : 'N/A'}</td>
							</tr>
							<tr>
								<td>Energy</td>
								<td>{person.energyScale}</td>
								<td>{previousSurvey ? previousSurvey.energyScale : 'N/A'}</td>
							</tr>
							<tr>
								<td>Hopefulness</td>
								<td>{person.hopefulnessScale}</td>
								<td>
									{previousSurvey ? previousSurvey.hopefulnessScale : 'N/A'}
								</td>
							</tr>
							<tr>
								<td>Sleep Time</td>
								<td>{person.sleepHours}</td>
								<td>{previousSurvey ? previousSurvey.sleepHours : 'N/A'}</td>
							</tr>
						</tbody>
					</Table>
				</Tab>
				<Tab eventKey="your-age-group" title="Your age group">
					<h6>Full Name: {person.fullName}</h6>
					<Badge bg="secondary">
						Age group {props.peopleAgeCompare.person.age}
					</Badge>
					{!ownAgeGroup && (
						<h6>
							No others in the same age groups as yours are found in the
							database.
						</h6>
					)}
					{ownAgeGroup && (
						<Table className="mt-3" striped bordered hover>
							<thead>
								<tr>
									<th>Category</th>
									<th>Last Survey</th>
									<th>Age Group Average</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Happiness</td>
									<td>{person.happyScale}</td>
									<td>{ownAgeGroup.happyAverage}</td>
								</tr>
								<tr>
									<td>Energy</td>
									<td>{person.energyScale}</td>
									<td>{ownAgeGroup.energyAverage}</td>
								</tr>
								<tr>
									<td>Hopefulness</td>
									<td>{person.hopefulnessScale}</td>
									<td>{ownAgeGroup.hopefulnessAverage}</td>
								</tr>
								<tr>
									<td>Sleep Time</td>
									<td>{person.sleepHours}</td>
									<td>{ownAgeGroup.sleepAverage}</td>
								</tr>
							</tbody>
						</Table>
					)}
				</Tab>

				{renderOtherAgeGroupsTab()}
			</Tabs>
		)
	}

	const renderOtherAgeGroupsTab = () => {
		const person = props.peopleAgeCompare.person
		const otherAgeGroups = props.peopleAgeCompare.otherAgeGroups

		if (!otherAgeGroups) return

		return (
			<Tab eventKey="other-age-groups" title="Other age groups">
				<>
					<h6>Full Name: {person.fullName}</h6>

					{otherAgeGroups.map((otherAgeGroup) => {
						return (
							<div>
								<Badge bg="secondary">Age group {otherAgeGroup.ageGroup}</Badge>
								<Table className="mt-3" striped bordered hover>
									<thead>
										<tr>
											<th>Category</th>
											<th>Last Survey</th>
											<th>Age Group Average</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Happiness</td>
											<td>{person.happyScale}</td>
											<td>{otherAgeGroup.happyAverage}</td>
										</tr>
										<tr>
											<td>Energy</td>
											<td>{person.energyScale}</td>
											<td>{otherAgeGroup.energyAverage}</td>
										</tr>
										<tr>
											<td>Hopefulness</td>
											<td>{person.hopefulnessScale}</td>
											<td>{otherAgeGroup.hopefulnessAverage}</td>
										</tr>
										<tr>
											<td>Sleep Time</td>
											<td>{person.sleepHours}</td>
											<td>{otherAgeGroup.sleepAverage}</td>
										</tr>
									</tbody>
								</Table>
							</div>
						)
					})}
				</>
			</Tab>
		)
	}

	return (
		<>
			<h3>Mood Survey Result</h3>

			{renderTabs()}
		</>
	)
}

export default SurveyResultTabs
