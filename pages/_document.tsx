import Document, {
	DocumentContext,
	Html,
	Head,
	Main,
	NextScript
} from 'next/document';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initalProps = await Document.getInitialProps(ctx);

		return initalProps;
	}

	render() {
		return (
			<Html lang='es'>
				<Head>
					<link
						href='https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;600;700&display=swap'
						rel='stylesheet'
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
