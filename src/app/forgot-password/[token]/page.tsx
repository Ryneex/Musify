import verifyPasswordResetToken from '@/actions/authentication/password-reset/verifyPasswordResetToken'
import ResetPasswordCard from './ResetPasswordCard'

export default async function page({ params: { token } }: any) {
    const res = await verifyPasswordResetToken(token)
    if (res.error) {
        return <span>{res.error}</span>
    } else {
        return <ResetPasswordCard token={token} />
    }
}
