import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Varela+Round&display=swap" rel="stylesheet" /> 

          <link rel="shortcut icon" href="favicon.png" type="image/png" />
        </Head>
        <body className='bg-gray-900 text-slate-300'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}