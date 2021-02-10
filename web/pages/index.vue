<template>
  <v-app>
    <v-main>
      <v-container class="fill-height text-center" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <v-icon color="red" size="10rem">fab fa-youtube</v-icon>

            <v-spacer class="my-10" />

            <div class="text-h5">Not Found</div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Home extends Vue {}
</script>
