import { Field } from 'payload/types'
import payload from 'payload'

let canValidate = true

const confirmFieldHook: Field = {
	name: 'confirmed',
	type: 'checkbox',
	validate: () =>
		canValidate
			? true
			: 'An user with this email has already been confirmed.',
	hooks: {
		beforeValidate: [
			async ({ value, originalDoc }) => {
				canValidate = true
				if (value === true) {
					const user = await payload
						.find({
							collection: 'confirmed-users',
							where: {
								email: {
									equals: originalDoc.email,
								},
							},
						})
						.then((res) => {
							if (res.docs.length > 0) {
								canValidate = false
							}
						})
				}
			},
		],
		afterChange: [
			async ({ value, previousValue, originalDoc }) => {
				if (value !== previousValue) {
					if (value === true) {
						const user = await payload
							.find({
								collection: 'confirmed-users',
								where: {
									email: {
										equals: originalDoc.email,
									},
								},
							})
							.then(async (res) => {
								if (res.docs.length > 0) {
									console.log(
										`An user with the email ${originalDoc.email} has already been confirmed.`
									)
								} else {
									delete originalDoc.confirmed
									delete originalDoc.createdAt
									delete originalDoc.updatedAt
									delete originalDoc.id
									const newUser = await payload
										.create({
											collection: 'confirmed-users',
											data: originalDoc,
										})
										.then(() => {
											console.log(
												`Confirmed ${originalDoc.email}.`
											)
										})
										.catch((error) => {
											console.log(
												`Account confirmation failed. ${error}`
											)
										})
								}
							})
							.catch((error) => {
								console.log(`Error: ${error}`)
							})
					}
				}
			},
		],
	},
}

export default confirmFieldHook
