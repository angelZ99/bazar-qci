import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { showToast } from '../../../lib/notifications';
import { validateEmail, validatePassword } from '../../../lib/helpers';
import { LoginAdmin } from '../admin/login';

interface DataForm {
	email: string;
	password: string;
}

export const LoginVendor = () => {
	const router = useRouter();
	const [data, setData] = useState<DataForm>({ email: '', password: '' });

	const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { email, password } = data;

		const validations = () => {
			const { email, password } = data;
			if (!validateEmail(email)) {
				showToast('error', 'El correo no es valido');
				return false;
			}
			if (!validatePassword(password)) {
				showToast('error', 'El contraseña no es valida');
				return false;
			}
			return true;
		};

		if (validations()) {
			const isValidLogin = await LoginVendor(email, password);
			if (!isValidLogin) {
				showToast('error', 'El correo o la contraseña no son incorrectos');
				return;
			}
			showToast('success', 'Bienvenido de nuevo');
			setTimeout(() => {
				router.replace('/');
			}, 2000);
		}
	};

	return (
		<div className='flex flex-col m-auto w-full md:w-2/3 lg:w-1/2 2xl:w-1/3 mt-10 p-5'>
			<h2 className='text-center text-xl font-semibold'>Inicio de Sesión</h2>
			<form className='mt-5' onSubmit={handlerSubmit} noValidate>
				{/* Email */}
				<div className='mb-3'>
					<label htmlFor='' className='font-semibold'>
						Correo institucional:
					</label>
					<input
						type='email'
						className='border border-gray-400 w-full rounded-sm p-1 pl-2'
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setData({ ...data, email: e.target.value })
						}
					/>
				</div>
				{/* Password */}
				<div className='mb-5'>
					<label htmlFor='' className='font-semibold'>
						Contraseña:
					</label>
					<input
						type='password'
						className='border border-gray-400 w-full rounded-sm p-1 pl-2'
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setData({ ...data, password: e.target.value })
						}
					/>
					<a className='flex justify-center mt-1 text-xs text-blue-600 font-semibold'>
						¿Olvidaste tu contraseña?
					</a>
				</div>
				{/* Submit */}
				<div className='text-center'>
					<button className='border-2 border-gray-600 rounded w-full bg-zinc-800 p-2 shadow mb-3'>
						<span className='font-semibold text-white uppercase italic text-lg'>
							Iniciar Sesión
						</span>
					</button>
					<p className='text-xs font-semibold mb-3'>
						¿No tienes una cuenta? <br />
						<Link href='/user/signup'>
							<a className='text-blue-600'>Registrate...</a>
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
};
