import { Card, CardBody, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import LogoBox from '@/components/LogoBox'
import PageMetaData from '@/components/PageTitle'
import ThirdPartyAuth from '@/components/ThirdPartyAuth'
import LoginForm from './components/LoginForm'
import logo from '@/assets/images/logo.png'
const SignIn2 = () => {
  return (
    <>
      <PageMetaData title="Sign In" />

      <Col xl={5} className="mx-auto">
        <Card className="auth-card">
          <CardBody className="px-3 py-5">
            <div className="mx-auto mb-4 text-center auth-logo">
              <img src={logo} alt="Logo" width={'150px'} className="img-fluid" />
            </div>
            <h2 className="fw-bold text-center fs-18">Sign In</h2>
            <p className="text-muted text-center mt-1 mb-4">Enter your email address and password to access admin panel.</p>
            <div className="px-4">
              <LoginForm />
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}
export default SignIn2
