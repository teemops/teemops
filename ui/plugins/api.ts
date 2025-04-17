export default ({ $axios, app, store }, inject) => {
    var headers = {
        common: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    if (store.state.auth.token) {
        headers.common['x-access-token'] = `${store.state.auth.token}`
    }
    const api = $axios.create({
        headers: headers
    });
    const topsless = $axios.create({
        headers: headers
    });
    topsless.setBaseURL(process.env.topsless_api)
    const mfa = $axios.create({
        headers: headers
    });

    inject('api', api)
    inject('topsless', topsless)
    inject('mfa', mfa)
}