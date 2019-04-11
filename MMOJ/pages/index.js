import Layout from "../components/MyLayout.js";
import Banner from "../components/index/Banner.js";
import Head from "next/head";
import Link from "next/link";

const pageStyle = {
  margin: "25px 50px 25px 30px"
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
