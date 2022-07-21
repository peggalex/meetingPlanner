import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html>
            <Head>
                <title>Meeting Planner</title>
                <link rel="shortcut icon" href={`${process.env.basePath}/favicon.ico`} />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}