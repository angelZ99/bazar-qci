import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { showToast } from '../../../lib/notifications';
import {
	validateEmail,
	validatePassword,
	comparePassword,
	validateCode
} from '../../../lib/helpers';

interface Props {
	setToRegister: (value: boolean) => void;
}

interface DataForm {
	vendorCode: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	password: string;
	password2: string;
}

export const SignupVendor: FC<Props> = ({ setToRegister }) => {
	const router = useRouter();
	const [data, setData] = useState<DataForm>({
		vendorCode: 0,
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		password: '',
		password2: ''
	});

	const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		const { vendorCode, firstName, lastName, email, password } = data;

		e.preventDefault();
		if (validations()) {
			const isValidRegister = await registerAdmin();
			if (!isValidRegister) {
				showToast('error', 'El correo o codigo ya estan registrados');
				return;
			}
			showToast('success', 'Bienvenido ' + firstName);
			Cookies.set('admin', JSON.stringify({ role: 'vendor', email }));
			router.reload();
		}
	};

	const validations = () => {
		const { vendorCode, email, password, password2 } = data;
		if (!validateEmail(email)) {
			showToast('error', 'El correo no es valido');
			return false;
		}
		if (!validateCode(vendorCode)) {
			showToast('error', 'El código no es valido');
			return false;
		}
		if (!validatePassword(password)) {
			showToast(
				'error',
				'La contraseña no es valida, debe contener un numero,una Mayuscula y 8 caracteres'
			);
			return false;
		}
		if (!comparePassword(password, password2)) {
			showToast('error', 'Las contraseñas no coinciden');
			return false;
		}
		return true;
	};

	const registerAdmin = async () => {
		const { vendorCode, firstName, lastName, email, password, phoneNumber } =
			data;

		return await fetch('/api/auth/adminRegister', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				vendorCode,
				firstName,
				lastName,
				email,
				password,
				phoneNumber,
				role: 'vendor'
			})
		})
			.then((res) => {
				if (res.status === 200) {
					return true;
				}
				return false;
			})
			.catch((err) => {
				console.log(err);
				return false;
			});
	};

	return (
		<div className='flex flex-col m-auto w-full md:w-2/3 lg:w-1/2 2xl:w-1/3 p-5'>
			<h2 className='text-center text-xl font-semibold'>
				Registro de Vendedor
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
						value={data.vendorCode}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setData({ ...data, vendorCode: Number(e.target.value) })
						}
					/>
				</div>
				{/* phoneNumber */}
				<div className='mb-3'>
					<label htmlFor='' className='font-semibold'>
						Numero de telefonico:
					</label>
					<input
						type='number'
						className='border border-gray-400 w-full rounded-sm p-1 pl-2'
						placeholder='Ej. 	123456789'
						value={data.phoneNumber}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setData({ ...data, phoneNumber: e.target.value })
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
				<div className='text-center'>
					<button className='border-2 border-gray-600 rounded w-full bg-zinc-800 p-2 shadow mb-3'>
						<span className='font-semibold text-white uppercase italic text-lg'>
							Registrarse
						</span>
					</button>
					<p className='text-xs font-semibold'>
						¿Ya tienes una cuenta? <br />
						<a
							className='text-blue-600 hover:cursor-pointer'
							onClick={() => {
								setToRegister(false);
							}}
						>
							Iniciar sesión...
						</a>
					</p>
				</div>
			</form>
		</div>
	);
};
