import Layout from '../components/MyLayout.js'
import CompanySignupForm from '../components/CompanySignupForm.js'

const pageStyle = {
    background: '#E8E8E8'
  }

const Register = () => (
    <Layout >
        <div style={pageStyle}>
            <CompanySignupForm/>
        </div>      
    </Layout>
)

export default Register