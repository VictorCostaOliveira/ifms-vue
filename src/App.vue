<template>
  <v-app>
    <v-toolbar app color="cyan" v-if="currentUser">
      <v-btn icon class="avatar-button" @click="changeMenu">
        <v-avatar
          size="40"
        >
          <img :src="avatar">
        </v-avatar>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>Twitter</v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="avatar">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ displayName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          @click="logout"
        >
          <v-list-tile-action>
            <v-icon>clear</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Sair</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'App',
  data () {
    return {
      drawer: false,
      currentUser: firebase.auth().currentUser,
    };
  },
  computed: {
    avatar() {
      if (this.currentUser) {
        return this.currentUser.photoURL;
      }
      return '';
    },
    displayName() {
      if (this.currentUser) {
        return this.currentUser.displayName;
      }
      return '';
    }
  },
  methods: {
    changeMenu() {
      this.drawer = !this.drawer;
    },
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      });
    },
  },
}
</script>
<style>
.avatar-button {
  height: 45px;
  width: 45px;
}
</style>
