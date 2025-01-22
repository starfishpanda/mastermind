import { toast } from 'react-toastify'

// Function to call when login is successful
export function showLoginSuccessToast() {
  toast.success('Logged in successfully!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

// Function to call when logout is successful
export function showLogoutSuccessToast() {
  toast.info('Logged out successfully!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export function showLoginUnsuccessfulToast() {
  toast.error('Incorrect username and password.', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export function showDeleteAccountSuccessToast() {
  toast.success('Account deleted successfully!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}
