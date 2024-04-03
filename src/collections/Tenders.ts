import { CollectionConfig } from 'payload/types'
import notifyTenders from '../actions/notifyTenders'

const Tenders: CollectionConfig = {
	slug: 'tenders',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'opening', 'deadline', 'country', 'language'],
	},
	hooks: {
		afterChange: [notifyTenders],
	},
	fields: [
		{
			name: 'title',
			label: 'Title',
			type: 'text',
		},
		{
			name: 'content',
			label: 'Content',
			type: 'textarea',
		},
		{
			name: 'link',
			label: 'Link',
			type: 'text',
		},
		{
			name: 'yourContact',
			label: 'Your Contact',
			type: 'relationship',
			relationTo: 'agents',
			admin: {
				position: 'sidebar',
			},
		},
		{
			type: 'row',
			fields: [
				{
					name: 'opening',
					label: 'Opening',
					type: 'date',
					admin: {
						date: {
							displayFormat: 'dd/MM/yyyy',
						},
					},
				},
				{
					name: 'deadline',
					label: 'Deadline',
					type: 'date',
					admin: {
						date: {
							displayFormat: 'dd/MM/yyyy',
						},
					},
				},
			],
		},

		{
			name: 'country',
			label: 'Country',
			type: 'select',
			admin: {
				position: 'sidebar',
			},
			options: [
				{
					label: 'Germany',
					value: 'germany',
				},
				{
					label: 'France',
					value: 'france',
				},
				{
					label: 'Spain',
					value: 'spain',
				},
				{
					label: 'Italy',
					value: 'italy',
				},
			],
		},
		{
			name: 'language',
			label: 'Language',
			type: 'select',
			admin: {
				position: 'sidebar',
			},
			options: [
				{
					label: 'English',
					value: 'english',
				},
				{
					label: 'German',
					value: 'german',
				},
				{
					label: 'French',
					value: 'french',
				},
				{
					label: 'Spanish',
					value: 'spanish',
				},
			],
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
		{
			type: 'tabs',
			tabs: [
				{
					name: 'emobility',
					label: 'E-Mobility',
					fields: [
						{
							name: 'eVehicles',
							label: 'E-Vehicles',
							type: 'group',
							fields: [
								{
									name: 'typeOfVehicle',
									label: 'Type of Vehicle',
									type: 'select',
									hasMany: true,
									options: [
										{
											value: 'cars',
											label: 'Cars',
										},
										{
											value: 'buses',
											label: 'Buses',
										},
										{
											value: 'trucks',
											label: 'Trucks',
										},
										{
											value: 'planes',
											label: 'Planes',
										},
										{
											value: 'boats',
											label: 'Boats',
										},
										{
											value: 'twoWheelers',
											label: 'Two Wheelers',
										},
									],
								},
								{
									name: 'typeOfContract',
									label: 'Type of contract',
									type: 'select',
									hasMany: true,
									options: [
										{
											value: 'purchase',
											label: 'Purchase',
										},
										{
											value: 'leasing',
											label: 'Leasing / Rental agreement',
										},
										{
											value: 'rental',
											label: 'Rental vehicle including driver',
										},
										{
											value: 'fleetManagement',
											label: 'Fleet Management',
										},
										{
											value: 'dataManagement',
											label: 'Data management and software service contracts',
										},
									],
								},
							],
						},
						{
							name: 'eVehiclesMaintanance',
							label: 'E-Vehicles Maintenance',
							type: 'group',
							fields: [
								{
									name: 'evServices',
									label: 'EV repair and maintenance services',
									type: 'checkbox',
								},
								{
									name: 'batteries',
									label: 'Batteries for all EV types',
									type: 'group',
									fields: [
										{
											name: 'diagnosis',
											label: 'Diagnosis',
											type: 'checkbox',
										},
										{
											name: 'exchangePurchase',
											label: 'Exchange / Purchase',
											type: 'checkbox',
										},
									],
								},
								{
									name: 'spareParts',
									label: 'Purchase of other spare parts',
									type: 'select',
									hasMany: true,
									options: [
										{
											value: 'cars',
											label: 'Cars',
										},
										{
											value: 'buses',
											label: 'Buses',
										},
										{
											value: 'trucks',
											label: 'Trucks',
										},
										{
											value: 'planes',
											label: 'Planes',
										},
										{
											value: 'boats',
											label: 'Boats',
										},
										{
											value: 'twoWheelers',
											label: 'Two Wheelers',
										},
									],
								},
							],
						},
						{
							name: 'chargingStations',
							label: 'Charging Stations',
							type: 'group',
							fields: [
								{
									name: 'chargingVehiclesType',
									label: 'Purchase, Operations and/or Maintenance of stations',
									type: 'select',
									hasMany: true,
									options: [
										{
											value: 'bikesCars',
											label: 'Motorbikes & Cars',
										},
										{
											value: 'buses',
											label: 'Buses',
										},
										{
											value: 'trucks',
											label: 'Trucks',
										},
										{
											value: 'planes',
											label: 'Planes',
										},
										{
											value: 'boats',
											label: 'Boats',
										},
										{
											value: 'twoWheelers',
											label: 'Two Wheelers',
										},
									],
								},
								{
									name: 'typeOfMaintenance',
									label: 'Type of Maintenance',
									type: 'select',
									hasMany: true,
									options: [
										{
											value: 'exchange',
											label: 'Exchange',
										},
										{
											value: 'digitalUpdates',
											label: 'Digital updates',
										},
										{
											value: 'purchase',
											label: 'Purchase',
										},
									],
								},
							],
						},
					],
				},
				{
					name: 'energy',
					label: 'Energy',
					fields: [],
				},
				{
					name: 'construction',
					label: 'Construction',
					fields: [],
				},
				{
					name: 'transportation',
					label: 'Transportation',
					fields: [],
				},
			],
		},
	],
}

export default Tenders
