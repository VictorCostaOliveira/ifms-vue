import Vue from 'vue';
import './plugins/vuetify';
import './plugins/firebase';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import firebase from 'firebase';

Vue.config.productionTip = false;


let app = '';
firebase.auth().onAuthStateChanged(() => {
  /* eslint-disable no-new */
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');
  }
});
