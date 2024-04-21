import { toast } from 'sonner'

// eslint-disable-next-line no-unused-vars
export default async function callServerActionWithToast(Prom: Promise<any>) {
    const ToastId = toast.loading('Processing your request...', {
        position: 'top-center',
    })
    const res = await Prom
    if (res?.error) {
        toast.error(res.error, { id: ToastId })
    } else {
        toast.success(res.success, { id: ToastId })
    }
    return res
}
