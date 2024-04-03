/* import payload from 'payload'
import { CollectionAfterChangeHook } from 'payload/types'

const notifyTenders: CollectionAfterChangeHook = async ({
	doc,
	operation,
	req,
}) => {
	const chosenSector = doc.sectors
	console.log(chosenSector)
	const result = await payload.find({
		collection: 'confirmed-users',
		where: {
			sectors: {
				all: chosenSector,
			},
		},
	})
	const emails = result.docs.map((user) => user.email)
	console.log('emails', emails)
	try {
		if (operation === 'create') {
			emails.forEach((email) => {
				req.payload.sendEmail({
					to: [email],
					from: 'stefanolami@trial-pxkjn41187p4z781.mlsender.net',
					subject: 'Notification',
					text: `A new article was created with the title: ${doc.title} and the sector: ${chosenSector}`,
				})
			})
			console.log('Email sent')
		}
	} catch (error) {
		console.error('Error sending email:', error)
	}
}

export default notifyTenders
 */
