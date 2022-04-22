import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Toast = withReactContent(Swal);

export const showToast = (type: string, message: string) => {
	Toast.fire({
		title: message,
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 2000,
		icon: type as SweetAlertIcon
	});
};
