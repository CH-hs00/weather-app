import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
// ApolloProvider 설정
import '../styles/globals.css'
// 폰트 설정

const client = new ApolloClient({
  uri: '/api/graphql', // GraphQL API 경로
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
