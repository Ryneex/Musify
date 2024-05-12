import Axios from 'axios'

export default async function FetchJiosaavn(params: any) {
    const axios = Axios.create({
        params: {
            _format: 'json',
            _marker: '0',
            ctx: 'web6dot0',
            api_version: '4',
            ...params,
        },
        headers: {
            Cookie: 'L=english',
        },
    })

    return await axios.get('https://www.jiosaavn.com/api.php')
}
