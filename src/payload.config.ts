import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb' // database-adapter-import
import { webpackBundler } from '@payloadcms/bundler-webpack' // bundler-import
import { slateEditor } from '@payloadcms/richtext-slate' // editor-import
import { buildConfig } from 'payload/config'

import Users from './collections/Users'
import RegisteredUsers from './collections/RegisteredUsers'
import Tenders from './collections/Tenders'
import Agents from './collections/Agents'

export default buildConfig({
	admin: {
		user: Users.slug,
		bundler: webpackBundler(), // bundler-config
	},
	endpoints: [
		{
			path: '/notify-two-weeks',
			method: 'get',
			handler: async (req, res, next) => {
				const result = await req.payload.find({
					collection: 'registered-users',
					where: {
						confirmed: {
							not_equals: true,
						},
					},
				})
				const users = result.docs
				let names = []
				let emails = []
				users.forEach((user) => {
					names.push(user.name)
					emails.push(user.email)
				})
				let isSent = false
				req.payload
					.sendEmail({
						to: [
							'stefanolami90@gmail.com',
							'stefano@groupontap.com',
						],
						from: 'stefanolami@trial-pxkjn41187p4z781.mlsender.net',
						subject: 'Missing payments notification',
						text: `the following users have not been confirmed yet: ${names.join()} - ${emails.join()}`,
					})
					.then(
						(response: {
							accepted: string[]
							rejected: string[]
						}) => {
							// Add type assertion
							console.log(response)
							if (response.accepted.length > 0) {
								isSent = true
							}
							if (response.rejected.length > 0) {
								console.warn(
									'Email rejected:',
									response.rejected
								)
							}
						}
					)
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
			},
		},
	],
	cors: '*',
	editor: slateEditor({}), // editor-config
	collections: [Users, RegisteredUsers, Tenders, Agents],
	typescript: {
		outputFile: path.resolve(__dirname, 'payload-types.ts'),
	},
	graphQL: {
		schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
	},
	plugins: [payloadCloud()],
	// database-adapter-config-start
	db: mongooseAdapter({
		url: process.env.DATABASE_URI,
	}),
	// database-adapter-config-end
})
