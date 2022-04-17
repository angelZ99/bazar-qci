import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ShopLayout } from '../../components/layouts';
import { AlertMessage } from '../../components/ui/';
import { AuthContext } from '../../context';
import {
	validateEmail,
	validatePassword,
	comparePassword,
	validateCode
} from '../../lib/helpers';

interface DataForm {
	userCode: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	password2: string;
}
interface Message {
	type: string;
	message: string;
}

const SignUpPage = () => {
	const router = useRouter();
	const { registerUser } = useContext(AuthContext);
	const [data, setData] = useState<DataForm>({
		userCode: 0,
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		password2: ''
	});
	const [message, setMessage] = useState<Message>({ type: '', message: '' });

	useEffect(() => {
		if (message.type !== '') {
			setTimeout(() => {
				setMessage({ type: '', message: '' });
			}, 3000);
		}
	}, [message]);

	const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		const { userCode, firstName, lastName, email, password, password2 } = data;
		e.preventDefault();
		if (validations()) {
			const isValidRegister = await registerUser(
				firstName,
				lastName,
				userCode,
				email,
				password
			);
			if (!isValidRegister) {
				return;
			}
			router.replace('/');
		}
	};

	const validations = () => {
		const { userCode, firstName, lastName, email, password, password2 } = data;
		if (!validateEmail(email)) {
			setMessage({ type: 'error', message: 'El correo no es valido' });
			return false;
		}
		if (!validateCode(userCode)) {
			setMessage({
				type: 'error',
				message: 'El codigo de usuario no es valido'
			});
			return false;
		}
		if (!validatePassword(password)) {
			setMessage({
				type: 'error',
				message:
					'La contraseña no es valida, debe contener un numero,una Mayuscula y 8 caracteres'
			});
			return false;
		}
		if (!comparePassword(password, password2)) {
			setMessage({
				type: 'error',
				message: 'Las contraseñas no coinciden'
			});
			return false;
		}
		return true;
	};

	return (
		<ShopLayout title='Login' pageDescription=''>
			<div className='flex flex-col m-auto w-full md:w-2/3 lg:w-1/2 2xl:w-1/3 border border-gray-500 p-5'>
				<h2 className='text-center text-xl font-semibold'>
					Registro de Usuario
				</h2>
				<form className='mt-5' onSubmit={handlerSubmit} noValidate>
					{/* first name */}
					<div className='mb-3'>
						<label htmlFor='' className='font-semibold'>
							Nombre(s):
						</label>
						<input
							type='text'
							placeholder='Ej. Juan'
							className='border border-gray-400 w-full rounded-sm p-1 pl-2'
							value={data.firstName}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setData({ ...data, firstName: e.target.value })
							}
						/>
					</div>
					{/* last name */}
					<div className='mb-3'>
						<label htmlFor='' className='font-semibold'>
							Apellido(s):
						</label>
						<input
							type='text'
							placeholder='Ej. Perez'
							className='border border-gray-400 w-full rounded-sm p-1 pl-2'
							value={data.lastName}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setData({ ...data, lastName: e.target.value })
							}
						/>
					</div>
					{/* email */}
					<div className='mb-3'>
						<label htmlFor='' className='font-semibold'>
							Correo institucional:
						</label>
						<input
							type='email'
							className='border border-gray-400 w-full rounded-sm p-1 pl-2'
							placeholder='Ej. 	nombre.apellido@correo.udg.mx'
							value={data.email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setData({ ...data, email: e.target.value })
							}
						/>
					</div>
					{/* userCode */}
					<div className='mb-3'>
						<label htmlFor='' className='font-semibold'>
							Codigo de Alumno:
						</label>
						<input
							type='number'
							className='border border-gray-400 w-full rounded-sm p-1 pl-2'
							placeholder='Ej. 	123456789'
							value={data.userCode}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setData({ ...data, userCode: Number(e.target.value) })
							}
						/>
					</div>
					{/* password */}
					<div className='mb-3'>
						<label htmlFor='' className='font-semibold'>
							Contraseña:
						</label>
						<input
							type='password'
							className='border border-gray-400 w-full rounded-sm p-1 pl-2'
							placeholder='Ej. 	********'
							value={data.password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setData({ ...data, password: e.target.value })
							}
						/>
					</div>
					{/* password2 */}
					<div className='mb-3'>
						<label htmlFor='' className='font-semibold'>
							Repite la contraseña:
						</label>
						<input
							type='password'
							className='border border-gray-400 w-full rounded-sm p-1 pl-2'
							placeholder='Ej. 	********'
							value={data.password2}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setData({ ...data, password2: e.target.value })
							}
						/>
					</div>
					{message.type !== '' && (
						<AlertMessage type={message.type} message={message.message} />
					)}
					<div className='text-center'>
						<button className='border-2 border-gray-600 rounded w-full bg-zinc-800 p-2 shadow mb-3'>
							<span className='font-semibold text-white uppercase italic text-lg'>
								Registrarse
							</span>
						</button>
						<p className='text-xs font-semibold'>
							¿Ya tienes una cuenta? <br />
							<Link href='/account/login'>
								<a className='text-blue-600'>Iniciar sesión...</a>
							</Link>
						</p>
					</div>
				</form>
			</div>
		</ShopLayout>
	);
};

export default SignUpPage;
