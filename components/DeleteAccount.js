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
import { signOut } from 'next-auth/client'
const API_URL = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api`

// https://www.creative-tim.com/learning-lab/nextjs/modal/argon-dashboard
// https://reactstrap.github.io/components/modals/
export default function DeleteAccount({ user }) {
	const [modalOpen, setModalOpen] = useState(false)
	const [emailValid, setEmailValid] = useState(false)

	const deleteAccount = async () => {
		const res = await fetch(`${API_URL}/account/info?email=${user.email}`, {
			method: 'delete',
		})

		// TODO: Stop the `session TypeError: Failed to fetch` here
		if (res.ok) return signOut()
		console.error('There was a problem deleting your account!')
	}

	/** Enables form submission if the input value matches the user email. */
	const checkInputValue = (event) => {
		const value = event.target.value
		setEmailValid(value === user.email)
	}

	return (<>
		<Button
			color="primary"
			type="button"
			onClick={() => setModalOpen(!modalOpen)}
		>
			Delete Account
		</Button>
		<Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen} fade>
			<div className="modal-header">
				<h5 className="modal-title" id="exampleModalLabel">
					Delete Account
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
					Please note that <strong>this action is irreversable</strong>, all your data will be
					permanently deleted from the server. Confirm your email to delete your account.
				</p>
				<FormGroup>
					<Label for="email">Email:</Label>
					<Input
						type="email"
						name="email"
						id="confirmDeleteInput"
						placeholder={user.email}
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
					color="primary"
					type="button"
					onClick={() => {
						deleteAccount()
						setModalOpen(!modalOpen)
					}}
					disabled={!emailValid}
				>
					Delete Account
				</Button>
			</ModalFooter>
		</Modal>
	</>)
}