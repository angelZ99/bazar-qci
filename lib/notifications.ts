import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Toast = withReactContent(Swal);
const Comment = withReactContent(Swal);

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

export const commentModal = (productName: string) => {
	Comment.fire({
		title: 'Caja de Comentario',
		position: 'center',
		html:
			'<h2 class="text-left text-xl mb-3 font-semibold"> Ingresa un comentario y una calificacion: </h2>' +
			'<p class="text-center text-xl mb-3">Producto: </br> <span class="font-semibold">' +
			productName +
			'</span></p>' +
			'<textarea rows="4" class="w-full border-2 border-slate-500 p-2 mb-2" placeholder="Escribe aqui el comentario"></textarea>' +
			'<h3 class="text-xl font-semibold" > Calificacion: </h3>' +
			'<div class="rating">' +
			'<input type="radio" name="rating" value="5" id="5"><label for="5">☆</label>' +
			'<input type="radio" name="rating" value="4" id="4"><label for="4">☆</label>' +
			'<input type="radio" name="rating" value="3" id="3"><label for="3">☆</label>' +
			'<input type="radio" name="rating" value="2" id="2"><label for="2">☆</label>' +
			'<input type="radio" name="rating" value="1" id="1"><label for="1">☆</label>' +
			'</div>',
		confirmButtonText: 'Enviar',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		cancelButtonColor: '#d33'
	});
};
