import Layout from "../components/MyLayout.js";
import Banner from "../components/index/Banner.js";
import Head from "next/head";
import Link from "next/link";

const pageStyle = {
  margin: process.env.DEFAULT_PAGE_MARGINS
};

const Index = props => (
  <div>
    <Head>
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <title>Minutes Made</title>
    </Head>
    <Layout>
      <Banner />
    </Layout>
  </div>
);

export default Index;
