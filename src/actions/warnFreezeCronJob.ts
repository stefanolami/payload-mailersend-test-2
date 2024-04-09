import usersToStrings from './helpers/usersToStrings'
import payload from 'payload'
import asyncWrapArray from './helpers/asyncWrapArray'

type Request = {
	payload: {
		find: (query: object) => Promise<{ docs: any[] }>
		sendEmail: (
			email: object
		) => Promise<{ accepted: string[]; rejected: string[] }>
	}
}

type Response = any
type NextFunction = () => void

const getRemainingUsers = (users: any[]) =>
	users.filter((user) => !user.warned && !user.frozen)

const sendErrorNotification = async (error: Error) => {
	await payload.sendEmail({
		to: ['stefanolami90@gmail.com'],
		from: 'stefano@trial-o65qngkvvrwlwr12.mlsender.net',
		subject: 'Error processing warn/freeze',
		text: `Error processing warn/freeze:', ${error}`,
	})
}

const updateUserStatus = async (userId: string, updateData: object) => {
	try {
		await payload.update({
			collection: 'registered-users',
			id: userId,
			data: updateData,
		})
	} catch (error) {
		console.error(`Error updating user ${userId}:`, error)
		await sendErrorNotification(error)
	}
}

const warnFreezeCronJob = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const oneDay = 24 * 60 * 60 * 1000 // 1 day in milliseconds
	const warningTime = 14 * oneDay
	const freezingTime = 28 * oneDay

	try {
		const result = await req.payload.find({
			collection: 'registered-users',
			where: {
				paymentReceived: {
					not_equals: true,
				},
			},
			limit: 1000,
		})

		const users = result.docs
		const remainingUsers = getRemainingUsers(users)

		const warnings = []
		const freezing = []
		const now = new Date()

		remainingUsers.forEach((user) => {
			const creation = new Date(user.creationDate)
			const timeDifference = now.getTime() - creation.getTime()
			if (timeDifference > freezingTime) {
				freezing.push(user)
			} else if (timeDifference > warningTime) {
				warnings.push(user)
			}
		})

		if (warnings.length === 0 && freezing.length === 0) {
			console.log('No users to warn or freeze')
			res.status(200).send('No users to warn or freeze')
			return null
		}

		await Promise.all([
			...warnings.map((user) =>
				updateUserStatus(user.id, { warned: true })
			),
			...freezing.map((user) =>
				updateUserStatus(user.id, { frozen: true })
			),
		])

		console.log(
			`Users updated. Warnings: ${warnings.map(
				(user) => user.email
			)}, Freezing: ${freezing.map((user) => user.email)}`
		)
		res.status(200).send(
			`Users updated. Warnings: ${warnings.map(
				(user) => user.email
			)}, Freezing: ${freezing.map((user) => user.email)}`
		)
	} catch (error) {
		console.error('Error processing warn/freeze:', error)
		res.status(500).send('Error processing warn/freeze')
		await sendErrorNotification(error)
	}
}

export default warnFreezeCronJob
