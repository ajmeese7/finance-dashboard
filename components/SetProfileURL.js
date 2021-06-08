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

export default function SetProfileURL({ email, profileIsPublic, setProfileUrl }) {
	const [modalOpen, setModalOpen] = useState(false)
	const [urlValid, setUrlValid] = useState(false)
	const [userURL, setUserURL] = useState()

	const confirmUrl = async () => {
		const res = await fetch(`${API_URL}/account/profile_url`, {
			method: 'post',
			body: JSON.stringify({
				email: email,
				profileUrl: userURL,
			})
		})

		// TODO: Popup if successful
		if (res.ok) return console.log("Successfully set profile URL!")
		console.error('There was a problem deleting your account!')
	}

	/** Enables form submission if the input value matches the previously entered URL. */
	const checkInputValue = (event) => {
		const value = event.target.value
		setUrlValid(value === userURL)
	}

	return (<>
		<Button
			id="setProfileUrl"
			type="button"
			color="success"
			onClick={() => {
				setUserURL(document.getElementById("profileURL").value)
				setUrlValid(false)
				setModalOpen(!modalOpen)
			}}
			disabled={!profileIsPublic}
		>
			Set URL
		</Button>

		<Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen} fade>
			<div className="modal-header">
				<h5 className="modal-title"> 
					Set Profile URL
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
					unable to change your profile URL in the future.
				</p>
				<FormGroup>
					<Label for="confirmProfileURL">Confirm URL:</Label>
					<Input
						type="text"
						name="confirmProfileURL"
						id="confirmProfileURL"
						placeholder={userURL}
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
						confirmUrl()
						setProfileUrl(userURL)
						setModalOpen(!modalOpen)
					}}
					disabled={!urlValid}
				>
					Confirm URL
				</Button>
			</ModalFooter>
		</Modal>
	</>)
}