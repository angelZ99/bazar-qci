export const validatePassword = (password: string) => {
	if (password.length <= 7) {
		return false;
	}

	if (password.search(/[a-z]/) < 0) {
		return false;
	}

	if (password.search(/[A-Z]/) < 0) {
		return false;
	}

	if (password.search(/[0-9]/) < 0) {
		return false;
	}

	return true;
};

export const validateEmail = (email: string) => {
	if (email.length < 15) {
		return false;
	}
	if (email.search(/[!"`'#%&,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+/) != -1) {
		return false;
	}
	if (!email.includes('.udg.mx')) {
		return false;
	}

	return true;
};

export const comparePassword = (password: string, password2: string) => {
	return password === password2;
};

export const validateCode = (userCode: number) => {
	if (userCode < 100000000 || userCode > 999999999) return false;
	if (userCode === NaN) return false;

	return true;
};
