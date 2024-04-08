import { CollectionConfig } from 'payload/types'
import confirmFieldHook from '../actions/confirmFieldHook'

const RegisteredUsers: CollectionConfig = {
	slug: 'registered-users',
	access: {
		read: () => true,
		create: () => true,
		update: () => true,
	},
	admin: {
		group: 'Users',
		defaultColumns: ['confirmed', 'name', 'email'],
	},
	fields: [
		{
			name: 'paymentReceived',
			label: 'Payment Received',
			type: 'checkbox',
			defaultValue: false,
		},
		{
			name: 'warned',
			type: 'checkbox',
			admin: {
				readOnly: true,
			},
		},
		{
			name: 'frozen',
			type: 'checkbox',
			admin: {
				readOnly: true,
			},
		},
		{
			name: 'creationDate',
			label: 'Creation Date',
			type: 'date',
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			required: true,
			unique: true,
		},
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			required: true,
		},
		{
			name: 'sectors',
			label: 'Sectors of Interest',
			type: 'select',
			hasMany: true,
			required: true,
			options: [
				{
					label: 'E-mobility',
					value: 'e_mobility',
				},
				{
					label: 'Energy',
					value: 'energy',
				},
				{
					label: 'Construction',
					value: 'construction',
				},
				{
					label: 'Transportation',
					value: 'transportation',
				},
			],
		},
	],
}

export default RegisteredUsers
