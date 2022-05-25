import Swal, { SweetAlertIcon } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { products } from '../data/products';

const Toast = withReactContent(Swal);
const Comment = withReactContent(Swal);
const Spinner = withReactContent(Swal);
const Report = withReactContent(Swal);

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

export const commentModal = async (
	productName: string,
	userCode: number,
	productId: number,
	ratingId: Number
) => {
	let comentario = {};
	return Comment.fire({
		title: 'Caja de Comentario',
		position: 'center',
		html:
			'<h2 class="text-left text-xl mb-3 font-semibold"> Ingresa un comentario y una calificacion: </h2>' +
			'<p class="text-center text-xl mb-3">Producto: </br> <span class="font-semibold">' +
			productName +
			'</span></p>' +
			'<textarea id="textComment" rows="4" class="w-full border-2 border-slate-500 p-2 mb-2" placeholder="Escribe aqui el comentario"></textarea>' +
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
	})
		.then(async (result) => {
			if (result.value) {
				const textComment = document.querySelector(
					'#textComment'
				) as HTMLTextAreaElement;
				const rating = document.querySelector(
					'input[name="rating"]:checked'
				) as HTMLInputElement;
				if (textComment.value === '' || rating === null) {
					showToast(
						'error',
						'Datos invalidos, no se pudo enviar el comentario'
					);
				} else {
					const comment = await fetch('/api/products/comments', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							comment: textComment.value,
							rating: parseInt(rating.value),
							ratingId,
							userCode,
							productId
						})
					});
					comentario = comment.json();
					return comentario;
				}
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

export const spinnerModal = (state: boolean) => {
	if (!state) {
		Spinner.fire({
			title: 'Cargando, espere porfavor...',
			didOpen: () => {
				Spinner.showLoading();
			},
			showConfirmButton: false,
			showCancelButton: false
		});
	} else {
		return Spinner.close();
	}
};

export const reportModal = (
	userCode: number = 0,
	productId: number,
	productName: string
) => {
	const title = productName;
	const user = userCode;
	const product = productId;
	let description: string;

	return Comment.fire({
		title: 'Caja de Reportes',
		position: 'center',
		html:
			'<h2 class="text-left text-xl mb-3 font-semibold"> Ingresa el motivo del report: </h2>' +
			'<p class="text-center text-xl mb-3">Producto: </br> <span class="font-semibold">' +
			productName +
			'</span></p>' +
			'<textarea id="textComment" rows="4" class="w-full border-2 border-slate-500 p-2 mb-2" placeholder="Escribe aqui el motivo"></textarea>',
		confirmButtonText: 'Enviar',
		showCancelButton: true,
		cancelButtonText: 'Cancelar',
		cancelButtonColor: '#d33'
	})
		.then(async (result) => {
			const textDescription = document.querySelector(
				'#textComment'
			) as HTMLTextAreaElement;
			description = textDescription.value;
			const report = await fetch('/api/products/reports', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title,
					description,
					productId: product,
					userCode: user
				})
			});
			return report.json();
		})
		.catch((err) => {
			console.log(err);
		});
};
