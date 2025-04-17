import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
  intro: true as boolean,
  credentials: [] as Array<any>
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  intro: (state) => state.intro,
  credentials: (state) => state.credentials,
}

export const mutations: MutationTree<RootState> = {
  HIDE_INTRO: (state, status: boolean) => (state.intro = status),
  UPDATE_CREDENTIALS: (state, credentials: Array<any>) => (state.credentials = credentials),
}

/**
 * Examples of using this.$router.push
 * // object
router.push({ path: 'home' })

// named route
router.push({ name: 'user', params: { userId: '123' } })

// with query, resulting in /register?plan=private
router.push({ path: 'register', query: { plan: 'private' } })
 */
export const actions: ActionTree<RootState, RootState> = {

  async credentials({ commit, state }) {
    try {

      const result = await this.app.$api.$get('credentials')
      if (result) {
        if (result.error != undefined) {
          throw result.error;
        } else {
          commit('UPDATE_CREDENTIALS', result.result)
        }
      } else {
        throw 'Error getting AWS accounts list'
      }

    } catch (e) {
      console.log(e)
      return false;
    }
  },
  async get({ commit, state }, params: { path: string }) {
    try {

      const result = await this.app.$api.$get(params.path)
      if (result) {
        if (result.error != undefined) {
          throw result.error;
        } else {
          return result;
        }

      } else {
        throw 'Error getting request'
      }

    } catch (e) {
      console.error(e)
      return false;
    }
  },
  async post({ commit, state }, params: { path: string, data: any }) {
    try {
      const result = await this.app.$api.$post(params.path,
        params.data
      )
      if (result) {
        if (result.error != undefined) {
          throw result.error;
        } else {
          return result;
        }
      } else {
        throw 'No token provided'
      }
    } catch (e) {
      console.error(e)
      return false;
    }
  },
  async topsless({ commit, state }, params: { path: string, data: any, token: string }) {
    try {
      var result;
      if (params.token) {

        result = await this.$axios.$post(`${process.env.topsless_api}${params.path}`,
          params.data
        )


        if (result) {
          if (result.error != undefined) {
            throw result.error;
          } else {
            return result;
          }

        } else {
          throw 'Error getting request'
        }
      } else {
        throw 'No token provided'
      }
    } catch (e) {
      console.error(e)
      return false;
    }
  },
  async getless({ commit, state }, params: { path: string, token: string }) {
    try {
      var result;
      if (params.token) {

        result = await this.$axios.$get(`${process.env.topsless_api}${params.path}`)


        if (result) {
          if (result.error != undefined) {
            throw result.error;
          } else {
            return result;
          }

        } else {
          throw 'Error getting request'
        }
      } else {
        throw 'No token provided'
      }
    } catch (e) {
      console.error(e)
      return false;
    }
  },

}
