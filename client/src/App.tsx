import React, { useState } from 'react'

import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import DatePicker from 'react-datepicker'
import SurveyResultTabs from './SurveyResultTabs'
import { PeopleAgeCompare } from './types'

import axios from 'axios'
import './App.css'

function App() {
	const [showError, setShowError] = useState('')

	const [fullName, setFullName] = useState('')
	const [birthday, setBirthday] = useState<Date | null | undefined>()
	const [happyScale, setHappyScale] = useState('')
	const [energyScale, setEnergyScale] = useState('')
	const [hopefulnessScale, setHopefulnessScale] = useState('')
	const [sleepHours, setSleepHours] = useState('')
	const [surveyResult, setSurveyResult] = useState<
		PeopleAgeCompare | undefined
	>()

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const surveyData = {
			fullName,
			birthday: birthday?.toISOString(),
			happyScale: parseInt(happyScale),
			energyScale: parseInt(energyScale),
			hopefulnessScale: parseInt(hopefulnessScale),
			sleepHours: parseInt(sleepHours),
		}

		axios
			.post<PeopleAgeCompare>('/people/survey', surveyData)
			.then((result) => {
				// Reset all form and error fields
				setShowError('')
				setFullName('')
				setBirthday(undefined)
				setHappyScale('')
				setEnergyScale('')
				setHopefulnessScale('')
				setSleepHours('')

				// Switch to result screen
				setSurveyResult(result.data)
				//console.log(result.data)
			})
			.catch((error) => {
				if (error.response && error.response.data) {
					setShowError(error.response.data)
				} else {
					setShowError(error.message)
				}
			})
	}

	const renderSurveyForm = () => {
		return (
			<>
				{showError.length > 0 && (
					<Alert
						className="mt-4 mb-4"
						variant="danger"
						onClose={() => setShowError('')}
						dismissible
					>
						<Alert.Heading>Something went wrong!</Alert.Heading>
						<p>{showError}</p>
					</Alert>
				)}
				<Form onSubmit={onSubmit}>
					<Form.Group className="mb-3" controlId="formFullName">
						<Form.Label>Enter your full name</Form.Label>
						<Form.Control
							required
							type="text"
							placeholder=""
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							onBlur={() => setFullName(fullName.trim())}
						/>
						<Form.Text className="text-muted"></Form.Text>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formBirthdayh">
						<Form.Label>Birthday</Form.Label>
						<DatePicker
							required
							selected={birthday}
							onChange={(date) => setBirthday(date)}
							isClearable={false}
							placeholderText="mm/dd/yyyy"
						/>
						<Form.Text className="text-muted"></Form.Text>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formHappyScale">
						<Form.Label>
							On a scale from 1-5, how happy do you feel ?
						</Form.Label>
						<Form.Select
							aria-label=""
							required
							placeholder="select 1-5"
							value={happyScale}
							onChange={(e) => setHappyScale(e.target.value)}
						>
							<option value=""></option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</Form.Select>
						<Form.Text className="text-muted"></Form.Text>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formEnergyScale">
						<Form.Label>
							On a scale form 1-5, how energetic do you feel ?
						</Form.Label>
						<Form.Select
							aria-label=""
							required
							placeholder="select 1-5"
							value={energyScale}
							onChange={(e) => setEnergyScale(e.target.value)}
						>
							<option value=""></option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</Form.Select>
						<Form.Text className="text-muted"></Form.Text>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formHopefulnessScale">
						<Form.Label>
							On a scale from 1-5, how hopefull do you feel about the future ?
						</Form.Label>
						<Form.Select
							aria-label=""
							required
							placeholder="select 1-5"
							value={hopefulnessScale}
							onChange={(e) => setHopefulnessScale(e.target.value)}
						>
							<option value=""></option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
						</Form.Select>
						<Form.Text className="text-muted"></Form.Text>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formHopefulnessScale">
						<Form.Label>How many hours have you slept last night ?</Form.Label>
						<Form.Select
							aria-label=""
							required
							placeholder="select 1-5"
							value={sleepHours}
							onChange={(e) => setSleepHours(e.target.value)}
						>
							<option value=""></option>
							<option value="0">0</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6">6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
							<option value="10">10</option>
							<option value="11">11</option>
							<option value="12">12</option>
						</Form.Select>
						<Form.Text className="text-muted"></Form.Text>
					</Form.Group>

					{/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
						<Form.Check type="checkbox" label="Compare to all age groups" />
					</Form.Group> */}

					<Button variant="primary" type="submit">
						Submit
					</Button>
				</Form>
			</>
		)
	}

	const renderSurveyResult = () => {
		if (!surveyResult) return null

		return (
			<>
				<SurveyResultTabs peopleAgeCompare={surveyResult} />
				<Button
					variant="primary"
					type="submit"
					onClick={() => setSurveyResult(undefined)}
				>
					Start Over
				</Button>
			</>
		)
	}

	return (
		<Container className="p-3">
			<Container className="p-5 mb-4 bg-light rounded-3">
				<>
					<h1 className="header">Mood Survey App</h1>
					{surveyResult && renderSurveyResult()}
					{surveyResult === undefined && renderSurveyForm()}
				</>
			</Container>
		</Container>
	)
}

export default App
