<template>
  <div>
    <v-subheader>
      Tweets
    </v-subheader>
    <div v-for="(item, index) in reversedTweets">
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
        </div>
      </div>
      <v-divider
        v-if="!(index === tweets.length - 1)"
      ></v-divider>
    </div>
    <div class="text-xs-right fixed-button">
      <v-btn fab dark color="cyan" @click="openDialog">
        <v-icon dark>add</v-icon>
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
      dialog: false,
      newTweet: '',
      tweets: [],
    };
  },
  mounted() {
    this.getAllTweets();
  },
  computed: {
    reversedTweets() {
      return this.tweets.reverse();
    },
  },
  methods: {
    getAllTweets() {
      this.fireDb.ref('tweets').once('value').then((response) => {
        if (response.val()) {
          const keys = Object.keys(response.val())
          keys.forEach((key) => {
            let tweet = response.val()[key];
            tweet.id = key;
            this.tweets.push(tweet);
          })
        }
      });
    },
    onTweetAdded() {
      this.fireDb.ref('tweets').on('child_added', (response) => {
        if (!this.tweets.some(tweet => tweet.id === response.key)) {
          console.log('asdasdas')
          const newTweet = response.val();
          newTweet.id = response.key;
          this.tweets.unshift(newTweet);
        }
      });
    },
    openDialog() {
      this.dialog = true;
    },
    saveTweet() {
      this.dialog = false;
      this.fireDb.ref('tweets').push({
        tweet: this.newTweet,
        user: {
          name: 'Victor',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
        },
      });
      this.newTweet = '';
      this.onTweetAdded();
    },
  },
};
</script>
<style lang="scss">
.fixed-button {
  position: fixed;
  bottom: 0px;
  right: 0px;
  margin: 0 10px 10px
}
.tweet-container {
  margin-left: 8px;
  margin-top: 4px;
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
      width: 100%;
      word-break: break-all;
    }
  }

}
</style>
