export default function ({ $axios, redirect, store }) {
  //check if state token exists and if it does add it to the header
  // $axios.onRequest(config => {
  //   console.log('Making request to ' + config.url)
  //   console.log('Axios plugin waz here 2023 yea boyz!!')
  //   if (store.state.auth.token) {
  //     config.headers.common['Authorization'] = `Bearer ${store.state.auth.token}`
  //   }
  // })

  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
    if (store.state.auth.token) {
      config.headers.common['Authorization'] = `Bearer ${store.state.auth.token}`
    }
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}
