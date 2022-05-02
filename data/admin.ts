import { hashSync } from 'bcryptjs';

export const admin = [
	{
		id: 1,
		firstName: 'Administrador',
		lastName: 'BazarQci',
		email: 'admin_bazarqci@academicos.udg.mx',
		password: hashSync('UDG-BazarQci'),
		verified: true,
		role: 'admin'
	}
];
