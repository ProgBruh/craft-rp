export const state = () => {
  return {
    authAdmin: {
      token: null,
      loggedIn: false,
    },
  }
}

export const actions = {
  nuxtServerInit({ commit }) {
    const authAdmin = this.$cookiz.get('authAdmin')
    if (authAdmin) {
      commit('setAdminAuth', authAdmin)
    }
  },
  async loginAdmin({ commit }, loginData) {
    try {
      const tokenData = await this.$axios.$post('/api/admin/auth', loginData)
      commit('setAdminAuth', { token: tokenData.token, loggedIn: true })
      this.$cookiz.set(
        'authAdmin',
        JSON.stringify({ token: tokenData.token, loggedIn: true }),
        {
          path: '/admin',
          maxAge: 60 * 60 * 24,
        }
      )
    } finally {
    }
  },
  logoutAdmin({ commit }) {
    commit('setAdminAuth', {
      token: null,
      loggedIn: false,
    })
    this.$cookiz.remove('authAdmin', {
      path: '/admin',
    })
  },
}

export const mutations = {
  setAdminAuth(state, auth) {
    state.authAdmin = auth
  },
}

export const getters = {
  authAdmin: (state) => {
    return state.authAdmin
  },
}
