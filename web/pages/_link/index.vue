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
              <div v-if="timer > 0" class="text-caption">
                Redirecting In {{ timer }} Seconds(s)...
              </div>

              <div v-else-if="timer === 0" class="text-caption">
                Redirecting...
              </div>
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
  timer = 5;

  created() {
    this.link = this.$route.params.link.trim().toLowerCase();
  }

  async mounted() {
    const getVideoId = this.$fire.functions.httpsCallable('getVideoId');

    try {
      const videoId = (await getVideoId({ link: this.link })).data;

      this.url = `https://youtu.be/${videoId}`;
      this.triggerTimer();

      setTimeout(() => {
        const vueEl = this.$refs.button as Vue;
        const el = vueEl.$el as HTMLAnchorElement;

        el.click();
      }, 0);
    } catch (error) {
      if (error.message) this.message = error.message;
      else this.message = 'An Error Occurred, Please Try Again Later.';
    }
  }

  handleClick(event: MouseEvent) {
    if (event.isTrusted) this.timer = -1;
  }

  triggerTimer() {
    setTimeout(() => {
      if (this.timer === 0) window.location.href = this.url;
      else if (this.timer < 0) return false;
      else {
        this.timer--;
        this.triggerTimer();
      }
    }, 1000);
  }
}
</script>
