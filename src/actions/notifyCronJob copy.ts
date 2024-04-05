import usersToStrings from './helpers/usersToStrings'

const notifyCronJob = async (req, res, next) => {
	const result = await req.payload.find({
		collection: 'registered-users',
		where: {
			paymentReceived: {
				not_equals: true,
			},
		},
	})
	const users = result.docs
	const frozenUsers = users.filter((user) => user.frozen === true)
	const warnedUsers = users.filter(
		(user) => user.warned === true && user.frozen === false
	)
	const remainingUsers = users.filter((user) => !user.warned && !user.frozen)
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
	console.log('Warnings:', warnings)
	console.log('Freezing:', freezing)
	console.log('Warned users:', warnedUsers)
	console.log('Frozen users:', frozenUsers)
	console.log('Remaining users:', remainingUsers)

	let isSent = false
	req.payload
		.sendEmail({
			to: ['stefanolami90@gmail.com'],
			from: 'stefanolami@trial-pxkjn41187p4z781.mlsender.net',
			subject: 'Missing payments notification',
			text: `the following users are about to be warned: ${usersToStrings(
				warnings
			)};
the following users are about to be frozen: ${usersToStrings(freezing)};
Users that have been warned: ${usersToStrings(warnedUsers)};
Users still frozen: ${usersToStrings(frozenUsers)}.`,
		})
		.then((response: { accepted: string[]; rejected: string[] }) => {
			// Add type assertion
			console.log(response)
			if (response.accepted.length > 0) {
				isSent = true
			}
			if (response.rejected.length > 0) {
				console.warn('Email rejected:', response.rejected)
			}
		})
		.catch((error) => {
			console.error('Error sending email:', error)
			isSent = false
		})
		.finally(() => {
			if (!isSent) {
				res.status(500).send('Error sending email')
			} else if (isSent) {
				res.status(200).send(`Email sent`)
			}
		})

	/* try {
        req.payload.sendEmail({
            to: ['sfsf@fsdfsf.com'],
            from: 'stefanolami@trial-pxkjn41187p4z781.mlsender.net',
            subject: 'Missing payments notification',
            text: `the following users have not been confirmed yet: ${names.join()} - ${emails.join()}`,
        })
        console.log('Email sent')
        res.status(200).send(`Email sent`)
    } catch (error) {
        console.error('Error sending email:', error)
        res.status(500).send('Error sending email')
    } */
}

export default notifyCronJob
