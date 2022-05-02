import React, { useEffect } from 'react';
import { IAdmin } from '../../../interfaces';
import { useRouter } from 'next/router';

const index = () => {
	const router = useRouter();
	useEffect(() => {
		const data: IAdmin = JSON.parse(localStorage.getItem('admin') || '{}');
		if (data.role === 'vendor') {
			router.push('/managment/vendors');
		} else if (data.role === 'admin') {
			router.push('/managment/admin');
		} else {
			router.push('/managment');
		}
	}, []);
	return <div>index</div>;
};

export default index;
