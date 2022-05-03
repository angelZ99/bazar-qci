import React, { useEffect, useState } from 'react';
import { IAdmin } from '../../../interfaces';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const index = () => {
	const router = useRouter();

	useEffect(() => {
		if (!Cookies.get('admin')) {
			router.replace('/managment');
		} else {
			const { role } = JSON.parse(Cookies.get('admin') as string);
			if (role !== 'admin') {
				router.replace('/managment');
			}
		}
	}, []);
	return <div>index</div>;
};

export default index;
