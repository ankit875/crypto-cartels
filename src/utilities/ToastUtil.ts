import React from 'react'
import ReactDOM from 'react-dom'
import { Toast } from '../components'

export const showToast = (toastMessage: any) => {
  const toastContainer = document.getElementById('toast')
  if (toastContainer) {
    ReactDOM.render(<Toast message={toastMessage} />, document.getElementById('toast'))
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById('toast'))
    }, 5000)
  }
}
