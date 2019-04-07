import Layout from '../components/MyLayout.js'
import { get } from '../lib/Request'
import Head from 'next/head'
import Link from 'next/link'

const pageStyle = {
    margin: '25px 50px 25px 30px'
  }

  const meetingImgStyle = {
      width: '100%',
      zIndex: '0'
  }

const Index = (props) => (
    <div>
        <Head>
             <link rel="shortcut icon" href="/static/favicon.ico" />
            <title>Minutes Made</title>
        </Head>
        <Layout >
        <img style={meetingImgStyle} src="/static/meeting.jpg" alt="my meeting" />
        </Layout>
    </div>
)

export default Index