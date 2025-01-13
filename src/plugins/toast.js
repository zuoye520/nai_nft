let toastInstance = null

export const ToastPlugin = {
  install(app) {
    app.config.globalProperties.$toast = {
      show(message, type) {
        if (toastInstance) {
          toastInstance.addToast(message, type)
        }
      }
    }
  }
}

export function setToastInstance(instance) {
  toastInstance = instance
}

export function useGlobalToast() {
  return {
    show: (message, type) => toastInstance?.addToast(message, type)
  }
}