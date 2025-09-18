import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import TextFormInput from '@/components/form/TextFormInput'
import { Button, FormCheck } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../../../../redux/features/user/userSlice'
import toast from 'react-hot-toast'

const LoginForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.user)

  // Validation schema
  const loginFormSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  })

  // Form setup
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  })

  // Redirect after login
  // const redirectUser = () => {
  //   const redirectLink = searchParams.get('redirectTo')
  //   navigate(redirectLink || '/')
  // }

  const onSubmit = handleSubmit(async (values, event) => {
    event.preventDefault()
    try {
      const { email, password } = values
      const result = await dispatch(login({ email, password })).unwrap()

      // ✅ Only navigate if login is successful
      if (result?.success) {
        toast.success('Login Successful')
        navigate('/dashboard/analytics')
      } else {
        toast.error(result?.message || 'Login failed')
      }
    } catch (err) {
      // If login fails (rejected)
      toast.error(err || 'Invalid email or password')
      console.error('❌ Login failed:', err)
    }
  })

  return (
    <form className="authentication-form" onSubmit={onSubmit}>
      {/* Email input */}
      <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" id="email-id" placeholder="Enter your email" />

      {/* Password input */}
      <PasswordFormInput
        control={control}
        name="password"
        containerClassName="mb-3"
        placeholder="Enter your password"
        id="password-id"
        label={
          <>
            <label className="form-label" htmlFor="example-password">
              Password
            </label>
          </>
        }
      />

      {/* Remember me */}
      <div className="mb-3">
        <FormCheck label="Remember me" id="sign-in" />
      </div>

      {/* Submit button */}
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
