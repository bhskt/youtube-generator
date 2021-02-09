<template>
  <v-app>
    <v-main>
      <v-container class="fill-height text-center" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <v-icon color="error" size="10rem">fa-exclamation-triangle</v-icon>

            <v-spacer class="my-10" />

            <div class="text-h2">{{ message }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';

@Component
export default class Error extends Vue {
  @Prop() readonly error!: any;

  message = 'An Unknown Error Occurred';

  created() {
    if (this.error?.message) {
      this.message = this.error.message;
    }
  }
}
</script>
