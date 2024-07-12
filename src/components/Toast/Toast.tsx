import './toast.scss'

export const Toast = ({ message }: { message: string }) => {
  return <div className="toast">{message}</div>
}
