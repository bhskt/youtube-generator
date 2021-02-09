<template>
  <v-app>
    <v-app-bar app>
      <v-spacer />

      <v-btn @click.stop="logout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height text-center" fluid>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer app>Footer</v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Manage extends Vue {}
</script>
