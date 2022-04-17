import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShopLayout } from '../../components/layouts';
import { AlertMessage } from '../../components/ui';
import { AuthContext } from '../../context';
import { validateEmail, validatePassword } from '../../lib/helpers';

interface DataForm {
	email: string;
	password: string;
}
interface Message {
	type: string;
	message: string;
}

const LoginPage = () => {
	const router = useRouter();
	const { loginUser } = useContext(AuthContext);
	const [data, setData] = useState<DataForm>({ email: '', password: '' });
	const [message, setMessage] = useState<Message>({ type: '', message: '' });

	useEffect(() => {
		if (message.type !== '') {
			setTimeout(() => {
				setMessage({ type: '', message: '' });
			}, 3000);
		}
	}, [message]);

	const validations = () => {
		const { email, password } = data;
		if (!validateEmail(email)) {
			setMessage({ type: 'error', message: 'El correo no es valido' });
			return false;
		}
		if (!validatePassword(password)) {
			setMessage({ type: 'error', message: 'La contraseña no es valida' });
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
				return;
			}

			router.replace('/');
		}
	};

	return (
		<ShopLayout title='Login' pageDescription='Inicio de sesión'>
			<div className='flex flex-col m-auto absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full md:w-2/3 lg:w-1/2 2xl:w-1/3 border border-gray-500 p-5'>
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
						<p className='text-xs font-semibold'>
							¿No tienes una cuenta? <br />
							<Link href='/account/signup'>
								<a className='text-blue-600'>Registrate...</a>
							</Link>
						</p>
					</div>
					{message.type !== '' && (
						<AlertMessage type={message.type} message={message.message} />
					)}
				</form>
			</div>
		</ShopLayout>
	);
};

export default LoginPage;
