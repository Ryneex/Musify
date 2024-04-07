import ky from 'ky'

const request = ky.create({
    method: 'get',
    searchParams: {
        _format: 'json',
        _marker: '0',
        ctx: 'web6dot0',
        api_version: '4',
    },
    timeout: 30000,
    headers: {
        Cookie: 'L=english',
    },
})

export default request
