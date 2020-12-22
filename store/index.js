export const state = () => {
  return {
    authAdmin: {
      token: null,
      loggedIn: false,
    },
    auth: {
      token: null,
      user: null,
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
    const auth = this.$cookiz.get('auth')
    if (auth) {
      commit('setAuth', auth)
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
  async login({ commit }, loginData) {
    try {
      const tokenData = await this.$axios.$post('/api/auth', loginData)
      tokenData.loggedIn = true
      commit('setAuth', tokenData)
      const auth = {
        token: tokenData.token,
        user: tokenData.user,
        blocked: tokenData.is_blocked,
        loggedIn: true,
      }
      if (tokenData.is_super) {
        auth.is_super = true
      }
      this.$cookiz.set('auth', JSON.stringify(auth), {
        maxAge: 60 * 60 * 24,
      })
    } finally {
    }
  },
  logout({ commit }) {
    commit('setAuth', {
      token: null,
      user: null,
      loggedIn: false,
    })
    this.$cookiz.remove('auth')
  },
}

export const mutations = {
  setAdminAuth(state, auth) {
    state.authAdmin = auth
  },
  setAuth(state, auth) {
    state.auth = auth
  },
}

export const getters = {
  authAdmin: (state) => {
    return state.authAdmin
  },
  auth: (state) => {
    return state.auth
  },
}
