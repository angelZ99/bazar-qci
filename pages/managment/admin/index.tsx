import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Home = () => {
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

export default Home;
