import { hashSync } from 'bcryptjs';

export const vendors = [
	{
		vendorCode: 219296288,
		firstName: 'Angel',
		lastName: 'Zapata',
		email: 'angel.zapata2962@alumnos.udg.mx',
		phoneNumber: 3327948847,
		password: hashSync('123Zapata'),
		verified: false
	},
	{
		vendorCode: 219296289,
		firstName: 'Omar',
		lastName: 'Torres',
		email: 'omar.torres9895@alumnos.udg.mx',
		phoneNumber: 3327948848,
		password: hashSync('123Fernando'),
		verified: false
	}
];
