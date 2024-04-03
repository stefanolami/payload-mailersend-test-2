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
			method: 'post',
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
				users.forEach(async (user) => {
					const email = user.email
					const name = user.name
					try {
						req.payload.sendEmail({
							to: ['stefanolami90@gmail.com'],
							from: 'stefanolami@trial-pxkjn41187p4z781.mlsender.net',
							subject: 'Missing payments notification',
							text: `the following users have not been confirmed yet: ${name} - ${email}`,
						})
						res.status(200).send(`Email sent to ${email}`)
					} catch (error) {
						console.error('Error sending email:', error)
						res.status(500).send('Error sending email')
					}
				})
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
