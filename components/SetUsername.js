import { useState } from 'react'
import {
	Button,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter
} from 'reactstrap'
const API_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`

export default function SetUsername({ email, profileIsPublic, setUsername, usernameAvailable }) {
	const [modalOpen, setModalOpen] = useState(false)
	const [usernameValid, setUsernameValid] = useState(false)
	const [newUsername, setNewUsername] = useState()

	const confirmUsername = async () => {
		const res = await fetch(`${API_URL}/account/profile_url`, {
			method: 'post',
			body: JSON.stringify({
				email: email,
				username: newUsername,
			})
		})

		// TODO: Popup if successful
		if (res.ok) return console.log("Successfully set username!")
		console.error('There was a problem setting your username!')
	}

	/** Enables form submission if the input value matches the previously entered username. */
	const checkInputValue = (event) => {
		const value = event.target.value
		setUsernameValid(value === newUsername)
	}

	return (<>
		<Button
			id="setUsername"
			type="button"
			color="success"
			onClick={() => {
				setNewUsername(document.getElementById("username").value)
				setUsernameValid(false)
				setModalOpen(!modalOpen)
			}}
			disabled={!profileIsPublic || !usernameAvailable}
		>
			Set Username
		</Button>

		<Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen} fade>
			<div className="modal-header">
				<h5 className="modal-title">
					Set Username
				</h5>
				<button
					aria-label="Close"
					className="btn-close"
					type="button"
					onClick={() => setModalOpen(!modalOpen)}
				></button>
			</div>
			<ModalBody>
				<p>
					Please note that <strong>this action is irreversable</strong>, you will be
					unable to change your username in the future.
				</p>
				<FormGroup>
					<Label for="confirmUsername">Confirm Username:</Label>
					<Input
						type="text"
						name="confirmUsername"
						id="confirmUsername"
						placeholder={newUsername}
						onChange={checkInputValue}
						required
					/>
				</FormGroup>
			</ModalBody>
			<ModalFooter>
				<Button
					color="secondary"
					type="button"
					onClick={() => setModalOpen(!modalOpen)}
				>
					Cancel
				</Button>
				<Button
					color="success"
					type="button"
					onClick={() => {
						confirmUsername()
						setUsername(newUsername)
						setModalOpen(!modalOpen)
					}}
					disabled={!usernameValid}
				>
					Confirm Username
				</Button>
			</ModalFooter>
		</Modal>
	</>)
}