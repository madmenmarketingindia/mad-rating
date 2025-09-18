import Spinner from '@/components/Spinner'

export default function Loader({ text = 'Loading...', size = 'sm' }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-50"
      style={{ zIndex: 1050 }}
    >
      <Spinner size={size} />
      {text && <span className="mt-2 text-light fw-semibold">{text}</span>}
    </div>
  )
}
