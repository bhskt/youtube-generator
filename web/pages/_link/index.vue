<template>
  <v-app>
    <v-main>
      <v-container class="fill-height text-center" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <v-icon color="red" size="10rem">fab fa-youtube</v-icon>

            <v-spacer class="my-10" />

            <div v-if="url" class="text-h5">
              <v-btn :href="url" target="_blank" text x-large>{{ url }}</v-btn>
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
  message = 'Loading...';
  url = '';

  created() {
    this.link = this.$route.params.link.trim().toLowerCase();
  }

  async mounted() {
    const getVideoId = this.$fire.functions.httpsCallable('getVideoId');

    try {
      const videoId = (await getVideoId({ link: this.link })).data;

      this.url = `https://youtu.be/${videoId}`;
      window.location.href = this.url;
    } catch (error) {
      if (error.message) this.message = error.message;
      else this.message = 'An Error Occurred, Please Try Again Later.';
    }
  }
}
</script>
