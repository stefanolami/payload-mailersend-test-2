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
import FrozenUsers from './collections/FrozenUsers'
import notifyCronJob from './actions/notifyCronJob'
import update from 'payload/dist/collections/operations/update'
import warnFreezeCronJob from './actions/warnFreezeCronJob'

export default buildConfig({
	admin: {
		user: Users.slug,
		bundler: webpackBundler(), // bundler-config
	},
	endpoints: [
		{
			path: '/notify',
			method: 'get',
			// @ts-ignore
			handler: notifyCronJob,
		},
		{
			path: '/warn-freeze-users',
			method: 'get',
			// @ts-ignore
			handler: warnFreezeCronJob,
		},
	],
	cors: '*',
	editor: slateEditor({}), // editor-config
	collections: [RegisteredUsers, FrozenUsers, Users, Tenders, Agents],
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
