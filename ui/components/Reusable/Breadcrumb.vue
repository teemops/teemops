<template>
  <div>
    <v-breadcrumbs></v-breadcrumbs>
    {{ crumbs }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    crumbs() {
      const fullPath = this.$route.fullPath
      const params = fullPath.substring(1).split('/')
      params.pop()
      const crumbs = []
      let path = ''

      params.forEach((param, index, { length }) => {
        path = `${path}/${param}`
        const match = this.$router.match(path)
        console.log(path)
        if (match.name !== 'index') {
          if (index === length - 1) {
            crumbs.push({
              text: path.replace(/\//g, '-').slice(1),
              disabled: true,
            })
          } else {
            crumbs.push({
              text: path.replace(/\//g, '-').slice(1),
              disabled: false,
              href: path + '/',
            })
          }
        }
      })

      return crumbs
    },
  },
})
</script>