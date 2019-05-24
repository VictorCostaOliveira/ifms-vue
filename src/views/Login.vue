<template>
  <div class="">
    <div class="text-xs-center">
    </div>
      <v-btn block color="white" mt-5 large class="m-btn" @click="executeLogin">
        Login com Google
      </v-btn>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'LoginForm',
  data() {
    return {
      faceProvider: new firebase.auth.FacebookAuthProvider(),
      googleProvider: new firebase.auth.GoogleAuthProvider(),
      auth: firebase.auth(),
    };
  },
  methods: {
    executeLogin() {
      this.auth.languageCode = 'pt';
      this.auth.signInWithPopup(this.googleProvider).then((result) => {
        this.$router.replace('home')
      }).catch((error) => {
        console.log(error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-btn {
  margin: 120px 0 30px;
}
a {
  font-size: 16px;
  width: 100%;
  color: black;
}
.m-btn {
  display: block;
}
</style>
