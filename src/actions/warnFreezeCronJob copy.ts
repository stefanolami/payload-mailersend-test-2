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

const getFrozenUsers = (users: any[]) =>
	users.filter((user) => user.frozen === true)
const getWarnedUsers = (users: any[]) =>
	users.filter((user) => user.warned === true && !user.frozen)
const getRemainingUsers = (users: any[]) =>
	users.filter((user) => !user.warned && !user.frozen)

const sendEmail = async (req: Request, res: Response, email: object) => {
	let isSent = false
	try {
		const response = await req.payload.sendEmail(email)
		console.log(response)
		if (response.accepted?.length > 0) {
			isSent = true
		}
		if (response.rejected?.length > 0) {
			console.warn('Email rejected:', response.rejected)
		}
	} catch (error) {
		console.error('Error sending email:', error)
		isSent = false
	} finally {
		if (!isSent) {
			await req.payload.sendEmail({
				to: ['stefanolami90@gmail.com'],
				from: 'stefanolami@trial-pxkjn41187p4z781.mlsender.net',
				subject: 'Error sending Missing payments notification',
				text: `Error sending email.`,
			})
			res.status(500).send('Error sending email')
		} else if (isSent) {
			res.status(200).send(`Email sent`)
		}
	}
}

const setWarnUsers = async (users: any[]) => {
	const promiseArray = users.map((user) => {
		return payload.update({
			collection: 'registered-users',
			id: user.id,
			data: {
				warned: true,
			},
		})
	})
	return asyncWrapArray(promiseArray)
}

const setFreezeUsers = async (users: any[]) => {
	const promiseArray = users.map((user) => {
		return payload.update({
			collection: 'registered-users',
			id: user.id,
			data: {
				frozen: true,
			},
		})
	})
	return asyncWrapArray(promiseArray)
}

const warnFreezeCronJob = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const result = await req.payload.find({
		collection: 'registered-users',
		where: {
			paymentReceived: {
				not_equals: true,
			},
		},
	})

	const users = result.docs
	const frozenUsers = getFrozenUsers(users)
	const warnedUsers = getWarnedUsers(users)
	const remainingUsers = getRemainingUsers(users)

	let warnings = []
	let freezing = []
	const now = new Date()
	const oneDay = 24 * 60 * 60 * 1000 // 1 day in milliseconds
	const warningTime = 14 * oneDay
	const freezingTime = 28 * oneDay

	remainingUsers.forEach((user) => {
		const creation = new Date(user.creationDate)
		const timeDifference = now.getTime() - creation.getTime()
		if (timeDifference > freezingTime) {
			freezing.push(user)
		} else if (timeDifference > warningTime) {
			warnings.push(user)
		}
	})

	if (warnings.length == 0 && freezing.length == 0) {
		console.log('No users to warn or freeze')
		res.status(200).send('No users to warn or freeze')
		return null
	}

	const warnedResults = await setWarnUsers(warnings)
	const frozenResults = await setFreezeUsers(freezing)
	const mergedArrays = warnedResults.concat(frozenResults)
	let dataArray = []
	let errorsArray = []
	mergedArrays.forEach((result) => {
		if (result.error) {
			errorsArray.push(result.error)
		} else if (result.data) {
			dataArray.push(result.data)
		}
	})

	if (errorsArray.length > 0 && dataArray.length == 0) {
		console.log('Error updating users', errorsArray)
		res.status(500).send('Error updating users')
	} else if (errorsArray.length > 0 && dataArray.length > 0) {
		console.log('Error updating some users', errorsArray)
		res.status(207).send('Error updating some users', errorsArray)
	} else if (errorsArray.length == 0 && dataArray.length > 0) {
		console.log('Users updated', dataArray)
		res.status(200).send('Users updated')
	} else {
		console.log('Something went wrong while updating users')
		res.status(500).send('Something went wrong while updating users')
	}
}

export default warnFreezeCronJob
