import { CollectionConfig } from 'payload/types'

const Agents: CollectionConfig = {
	slug: 'agents',
	access: {
		read: () => true,
		create: () => true,
	},
	admin: {
		useAsTitle: 'name',
	},
	fields: [
		{
			name: 'name',
			label: 'Name',
			type: 'text',
			required: true,
		},
		{
			name: 'email',
			label: 'Email',
			type: 'email',
			required: true,
			unique: true,
		},
		{
			name: 'telephone',
			type: 'text',
			label: 'Telephone',
		},
		{
			name: 'spokenLanguages',
			label: 'Spoken Languages',
			type: 'text',
		},
	],
}

export default Agents
