import { FC } from 'react';

interface Props {
	setToRegister: (value: boolean) => void;
}

export const SignupVendor: FC<Props> = ({ setToRegister }) => {
	return <div>Registro Vendedor</div>;
};
