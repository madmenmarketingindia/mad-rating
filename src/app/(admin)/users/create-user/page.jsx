import { useEffect, useState } from 'react'
import { Col, Row, FormLabel, FormSelect, Button, Spinner } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import TextFormInput from '@/components/form/TextFormInput.jsx'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { getUserById, registerUser, updateUser } from '../../../../redux/features/user/userSlice'
import toast from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../../../../components/PageHeader'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

export default function CreateUser() {
  const { control, handleSubmit, reset, register, setValue } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { getUserData, loading: reduxLoading } = useSelector((state) => state.user)
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('userId')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (userId) {
        // Edit user
        await dispatch(updateUser({ id: userId, ...data })).unwrap()
        toast.success('User updated successfully!')
        navigate('/users/users-list')
      } else {
        await dispatch(registerUser(data)).unwrap()
        toast.success('User created successfully!')
        reset()
        navigate(-1)
      }
    } catch (err) {
      toast.error(err || '❌ Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId))
    }
  }, [dispatch, userId])

  useEffect(() => {
    if (userId && getUserData?.data) {
      const { username, email, role } = getUserData.data
      setValue('username', username)
      setValue('email', email)
      setValue('role', role)
    }
  }, [userId, getUserData, setValue])

  return (
    <>
      <PageMetaData title={userId ? 'Edit User' : 'Create User'} />
      <PageHeader
        title={userId ? 'Edit User' : 'Create New User'}
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Users', href: '/users/users-list' }, { label: 'Create User' }]}
        rightContent={
          <div className="d-flex gap-2">
            <Button size="sm" variant="outline-secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
      />
      <Row>
        <Col>
          <ComponentContainerCard>
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <TextFormInput name="username" label="User Name" control={control} placeholder="Enter user name" containerClassName="" />

              <TextFormInput name="email" type="email" label="Email" control={control} placeholder="Enter email address" containerClassName="mt-3" />

              <div className="mt-3">
                <FormLabel htmlFor="role-select">Role</FormLabel>
                <FormSelect id="role-select" {...register('role')}>
                  <option value="Admin">Admin</option>
                  <option value="HR">HR</option>
                  <option value="Employee">Employee</option>
                </FormSelect>
              </div>

              {!userId && ( // Only show password field when creating
                <PasswordFormInput name="password" label="Password" control={control} placeholder="Enter password" containerClassName="mt-3" />
              )}

              <Button className="mt-3" variant="primary" type="submit" disabled={loading || reduxLoading}>
                {loading || reduxLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {userId ? 'Updating...' : 'Creating...'}
                  </>
                ) : userId ? (
                  'Update User'
                ) : (
                  'Create User'
                )}
              </Button>
            </form>
          </ComponentContainerCard>
        </Col>
      </Row>
    </>
  )
}
