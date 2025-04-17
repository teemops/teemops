import { GetterTree, ActionTree, MutationTree } from 'vuex'
import User from '@/types/user'
import ResourceOption from '@/types/ResourceOption';

export const state = () => ({
  intro: true as boolean,
  notify: '' as string,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  intro: (state) => state.intro,
  notify: (state) => state.notify,
}

export const mutations: MutationTree<RootState> = {
  HIDE_INTRO: (state, status: boolean) => (state.intro = status),
  NOTIFY_MESSAGE: (state, message: string) => (state.notify = message),
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
  /**
   * Adds a new conference and if no date/time it will
   * automatically redirect to the new video conference
   *
   * @param commit | used to commit to local mutations
   * @param conf | New Conference Details
   */
  async myFunctions(
    { commit },
    params: { conf: Object; instant: boolean }
  ) {

    commit('CHANGE_NAME', "blah")
  },
  /**
   * Gets something
   *
   * @param commit | used to commit to local mutations
   */
  async getSomething({ commit }) {


    commit("CHANGE_NAME", "blah")

  },
  async checkStripeSession({ state }, sessionId) {
    try {
      const result = await this.$axios.$post(`users/cart`, {
        checkout_id: sessionId
      })
      if (result) {

        return result
      } else {
        return false
      }
    } catch (e) {
      throw e
    }
  },
  async saveStripeSessionDetails({ state }, sessionId) {
    try {
      const result = await this.$axios.$post(`users/subs`, {
        checkout_id: sessionId
      })
      if (result) {

        return true
      } else {
        return false
      }
    } catch (e) {
      throw e
    }
  },
  updateNotify({ commit }, message) {
    commit('NOTIFY_MESSAGE', message)
  },
}
