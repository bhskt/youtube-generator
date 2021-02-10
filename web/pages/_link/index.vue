<template>
  <v-app>
    <v-main>
      <v-container class="fill-height text-center" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <v-icon color="red" size="10rem">fab fa-youtube</v-icon>

            <v-spacer class="my-10" />

            <div v-if="url" class="text-h5">
              <div class="text-caption">Click / Tap To Open</div>

              <v-btn
                ref="button"
                class="text-decoration-underline"
                :href="url"
                target="_blank"
                text
                x-large
                @click="handleClick"
                >{{ url }}</v-btn
              >
            </div>

            <div v-else class="text-h5">{{ message }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Link extends Vue {
  link = '';
  message = 'Finding...';
  url = '';

  created() {
    this.link = this.$route.params.link.trim().toLowerCase();
    window.location.href = `https://us-central1-yg-2021.cloudfunctions.net/requestVideoId/${this.link}`;
  }

  mounted() {
    // this.fetchUrl();
  }

  async fetchUrl() {
    const getVideoId = this.$fire.functions.httpsCallable('getVideoId');

    try {
      const videoId = (await getVideoId({ link: this.link })).data;

      this.url = `https://youtu.be/${videoId}`;
    } catch (error) {
      if (error.message) this.message = error.message;
      else this.message = 'An Error Occurred, Please Try Again Later.';
    }
  }

  handleClick() {
    this.message = 'Finding...';
    this.url = '';

    this.fetchUrl();
  }
}
</script>
