const LoginForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.user) || { isLoading: false }

  // Validation schema
  const schema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  })

  // react-hook-form
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: 'test@techzaa.com', password: 'password' },
  })

  // Redirect after login
  const redirectUser = () => {
    const redirectTo = searchParams.get('redirectTo')
    navigate(redirectTo || '/')
  }

  // Submit handler
  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await axios.post('https://dummyjson.com/auth/sign-in', values, {
        headers: { 'Content-Type': 'application/json' },
      })

      alert('Login success! Check console & network tab ✅')
      navigate('/')
    } catch (err) {
      console.error('❌ Login failed:', err)
      alert('Login failed ❌')
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
            <Link to="/auth/reset-pass" className="float-end text-muted text-unline-dashed ms-1">
              Reset password
            </Link>
            <label className="form-label" htmlFor="password-id">
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
