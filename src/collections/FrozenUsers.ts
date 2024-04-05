import { CollectionConfig } from 'payload/types'
import confirmFieldHook from '../actions/confirmFieldHook'

const FrozenUsers: CollectionConfig = {
	slug: 'frozen-users',
	access: {
		read: () => true,
		create: () => true,
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

export default FrozenUsers
