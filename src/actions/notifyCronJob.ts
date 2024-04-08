import usersToStrings from './helpers/usersToStrings'
import asyncWrap from './helpers/asyncWrap'

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
	const result = await asyncWrap(req.payload.sendEmail(email))
	if (result.error) {
		console.log('ERROR SENDING EMAIL: ', result.error)
		req.payload.sendEmail({
			to: ['stefano@groupontap.com'],
			from: 'stefano@trial-o65qngkvvrwlwr12.mlsender.net',
			subject: 'Error sending Missing payments notification',
			text: `Error sending email. ${result.error}`,
		})
		res.status(500).send('Error sending email')
	} else if (result.data && result.data.responseCode) {
		console.log('ERROR SENDING EMAIL: ', result.data)
		req.payload.sendEmail({
			to: ['stefano@groupontap.com'],
			from: 'stefano@trial-o65qngkvvrwlwr12.mlsender.net',
			subject: 'Error sending Missing payments notification',
			text: `Error sending email. ${result.data}`,
		})
		res.status(500).send('Error sending email')
	} else if (result.data && result.data.accepted) {
		if (result.data.rejected?.length > 0) {
			req.payload.sendEmail({
				to: ['stefano@groupontap.com'],
				from: 'stefano@trial-o65qngkvvrwlwr12.mlsender.net',
				subject:
					'Suppressed emails while sending Missing payments notification',
				text: `Suppressed emails: ${result.data.rejected.join(', ')}`,
			})
			console.warn('Email rejected:', result.data.rejected)
		}
		console.log('Email sent:', result.data.accepted)
		res.status(200).send(`Email sent`)
	}
}

const notifyCronJob = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const result = await asyncWrap(
		req.payload.find({
			collection: 'registered-users',
			where: {
				paymentReceived: {
					not_equals: true,
				},
			},
		})
	)
	if (result.error) {
		console.log('Error quering payload: ', result.error)
	}
	let frozenUsers
	let warnedUsers
	let remainingUsers
	if (result.data) {
		const users = result.data.docs
		frozenUsers = getFrozenUsers(users)
		warnedUsers = getWarnedUsers(users)
		remainingUsers = getRemainingUsers(users)
	}

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

	/* console.log('Warnings:', warnings)
	console.log('Freezing:', freezing)
	console.log('Warned users:', warnedUsers)
	console.log('Frozen users:', frozenUsers)
	console.log('Remaining users:', remainingUsers) */

	await sendEmail(req, res, {
		to: ['stefanolami90@gmail.com'],
		from: 'stefano@trial-o65qngkvvrwlwr12.mlsender.net',
		subject: 'Missing payments notification',
		text: `the following users are about to be warned: ${usersToStrings(
			warnings
		)};
the following users are about to be frozen: ${usersToStrings(freezing)};
Users that have been warned: ${usersToStrings(warnedUsers)};
Users still frozen: ${usersToStrings(frozenUsers)}.`,
	})
}

export default notifyCronJob
