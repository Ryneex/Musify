import Auth from '@/auth'
import dbconnect from '@/db/dbconnect'

const auth = new Auth({
    dbconnect: dbconnect,
})

export default auth
