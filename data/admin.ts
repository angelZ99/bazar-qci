import { hashSync } from 'bcryptjs';

export const admin = [
	{
		firstName: 'Administrador',
		lastName: 'BazarQci',
		email: 'admin_bazarqci@academicos.udg.mx',
		password: hashSync('UDG-BazarQci0'),
		verified: true,
		role: 'admin'
	}
];
