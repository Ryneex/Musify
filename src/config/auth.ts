import Auth from '@/auth'
import dbconnect from '@/db/dbconnect'
import User from '@/db/models/user.model'

const auth = new Auth({
    dbconnect: dbconnect,
    UserModel: User,
})

export default auth
