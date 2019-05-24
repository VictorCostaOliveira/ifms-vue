<template>
  <div>
    <v-subheader>
      Tweets
    </v-subheader>
    <div v-if="tweets.length === 0" class="empty-list">
      <div class="icon-container">
        <v-icon light>block</v-icon>
      </div>
      <div class="message">Sem nenhum tweet por hora :(</div>
    </div>
    <div v-else v-for="(item, index) in tweets">
      <div class="tweet-container">
        <div class="tweet-header">
          <v-avatar size="50">
            <img :src="item.user.avatar">
          </v-avatar>
          <span>
            <strong>{{ item.user.name }}</strong>
          </span>
        </div>
        <div class="tweet">
          <p>
            {{ item.tweet }}
          </p>
          <div class="tweet-actions">
            <v-icon  v-if="!!item.likes && item.likes[currentUserId]">favorite</v-icon>
            <v-icon @click="like(index, item.firebase_key)" v-else>favorite_border</v-icon>
          </div>
        </div>
      </div>
      <v-divider
        v-if="!(index === tweets.length - 1)"
      ></v-divider>
    </div>
    <div class="text-xs-right fixed-button">
      <v-btn fab dark color="cyan" @click="openDialog">
        <v-icon dark >add</v-icon>
      </v-btn>
    </div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-textarea
                    label="O que vc tem a dizer?"
                    v-model="newTweet"
                    maxlength="170"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="saveTweet">Postar</v-btn>
            <v-btn color="green darken-1" flat @click="dialog = false">Descartar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
import firebase from 'firebase';

export default {
  name: 'Home',
  data() {
    return {
      fireDb: firebase.database(),
      currentUser: firebase.auth().currentUser,
      dialog: false,
      newTweet: '',
      tweets: [],
    };
  },
  mounted() {
    this.fireDb.ref('tweets').orderByChild('createdAt').on('child_added', (response) => {
      if (!this.tweets.some(tweet => tweet.id === response.val().id)) {
        const newTweet = response.val();
        newTweet.firebase_key = response.key;
        this.tweets.unshift(newTweet);
      }
    });
  },
  computed: {
    id() {
      return this.tweets.length;
    },
    currentUserId() {
      return this.currentUser.providerData[0].uid;
    },
  },
  methods: {
    like(index, tweetKey) {
      this.fireDb.ref(`tweets/${tweetKey}/likes`).set({
        [this.currentUserId]: true
      })
      this.fireDb.ref('tweets/' + tweetKey).on('child_added', (response) => {
        if (response.key === 'likes') {
          this.$set(this.tweets[index], 'likes', response.val());
        }
      });
    },
    openDialog() {
      this.dialog = true;
    },
    saveTweet() {
      this.dialog = false;
      this.fireDb.ref(`tweets`).push({
        id: this.uuidv4(),
        tweet: this.newTweet,
        createdAt: new Date().getTime(),
        user: {
          id: this.currentUserId,
          name: this.currentUser.displayName,
          avatar: this.currentUser.photoURL,
        },
      });
      this.newTweet = '';
    },
    uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    },
  },
};
</script>
<style lang="scss">
.empty-list {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 250px;
  width: 250px;
  transform: translate(-50%, -50%);

  .icon-container {
    position: relative;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    height: 100px;
    width: 100px;
    i {
      font-size: 100px;
    }
  }
  .message {
    margin: 50px 20px 0;
    width: 100%;
  }

}

.fixed-button {
  position: fixed;
  bottom: 0px;
  right: 0px;
  margin: 0 10px 10px
}

.tweet-container {
  margin-left: 8px;
  margin-top: 4px;
  margin-bottom: 14px;
  display: flex;

  .tweet-header {
    span {
      position: absolute;
      margin-left: 8px;
      font-weight: bold;
      color: #14171a;
    }
  }

  .tweet {
    margin-top: 28px;
    margin-left: 8px;
    p {
      margin-bottom: 8px;
      width: 100%;
      word-break: break-all;
    }
  }
  .tweet-actions {
    i {

    }
    // margin-bottom: 12px;
  }
}
</style>
