import * as React from "react"

const ToastContext = React.createContext({})

function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast: (toast) => {
          setToasts((prev) => [...prev, { id: Math.random(), ...toast }])
        },
        removeToast: (id) => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id))
        },
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export { ToastProvider, useToast }
