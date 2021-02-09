<template>
  <v-app>
    <v-main>
      <v-container class="fill-height text-center" fluid>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-card>
              <v-card-title class="d-block text-h5">
                YouTube Generator
              </v-card-title>
              <v-card-subtitle>Manage</v-card-subtitle>

              <v-spacer class="my-10" />

              <v-btn class="mb-5 mx-5" color="primary" x-large>
                <v-icon left>fab fa-google</v-icon>
                Login with Google
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Login extends Vue {}
</script>
