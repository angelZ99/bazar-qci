import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShopLayout } from '../../components/layouts';
import { AuthContext } from '../../context';
import { validateEmail, validatePassword } from '../../lib/helpers';
import { showToast } from '../../lib/notifications';

interface DataForm {
	email: string;
	password: string;
}

const LoginPage = () => {
	const router = useRouter();
	const { loginUser } = useContext(AuthContext);
	const [data, setData] = useState<DataForm>({ email: '', password: '' });

	const { isAuthenticated } = useContext(AuthContext);
	if (isAuthenticated) {
		router.push('/');
	}

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

	const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { email, password } = data;

		if (validations()) {
			const isValidLogin = await loginUser(email, password);
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
		<ShopLayout title='Login' pageDescription='Inicio de sesión'>
			<div className='flex flex-col m-auto w-full md:w-2/3 lg:w-1/2 2xl:w-1/3 border border-gray-500 p-5'>
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
					{/* Options Role */}
					<div className='text-center text-xs flex flex-col'>
						<p className='font-semibold'>¿Eres un vendedor o Administrador?</p>
						<div className='flex w-1/2 md:w-1/4 m-auto mt-2 justify-between'>
							<label className='mr-1' htmlFor='optVendor'>
								Usuario
							</label>
							<input
								className='mt-0.5'
								type='radio'
								name='optRole'
								id='optUser'
								value='user'
								defaultChecked={true}
							/>
						</div>
						<div className='flex w-1/2 md:w-1/4 m-auto mt-2 justify-between'>
							<label className='mr-1' htmlFor='optVendor'>
								Vendedor
							</label>
							<input
								className='mt-0.5'
								type='radio'
								name='optRole'
								id='optVendor'
								value='vendor'
							/>
						</div>
						<div className='flex w-1/2 md:w-1/4 m-auto mt-2 justify-between'>
							<label className='mr-1' htmlFor='optAdmin'>
								Administrador
							</label>
							<input
								className='mt-0.5'
								type='radio'
								name='optRole'
								id='optAdmin'
								value='Admin'
							/>
						</div>
					</div>
				</form>
			</div>
		</ShopLayout>
	);
};

export default LoginPage;
