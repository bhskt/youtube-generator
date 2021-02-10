<template>
  <v-app>
    <v-main class="blue darken-4">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-card min-width="20rem">
              <v-card-title class="d-block text-center text-h5">
                YouTube Generator
              </v-card-title>

              <v-card-subtitle class="text-center">Manage</v-card-subtitle>

              <v-card-text>
                <v-spacer class="my-5" />

                <v-alert
                  v-model="error"
                  class="text-subtitle-2"
                  color="warning"
                  dense
                  dismissible
                >
                  Incorrect Email / Password
                </v-alert>

                <v-form @submit.stop.prevent="handleLogin">
                  <v-text-field
                    v-model.trim="email"
                    autofocus
                    class="white mb-5"
                    hide-details
                    light
                    outlined
                    placeholder="Email"
                    type="email"
                  />

                  <v-text-field
                    v-model.trim="password"
                    class="white mb-5"
                    hide-details
                    light
                    outlined
                    placeholder="Password"
                    type="password"
                  />

                  <v-btn color="primary" type="submit" width="100%" x-large>
                    Login
                  </v-btn>
                </v-form>
              </v-card-text>
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
export default class Login extends Vue {
  error = false;

  email = '';
  password = '';

  mounted() {
    if (this.$fire.auth.currentUser) {
      this.$router.push('/manage');
    }
  }

  async handleLogin() {
    if (!this.email || !this.password) {
      return (this.error = true);
    }

    try {
      this.error = false;

      const response = await this.$fire.auth.signInWithEmailAndPassword(
        this.email,
        this.password
      );

      if (response.user?.email === this.email) {
        return this.$router.push('/manage');
      }
    } catch (error) {
      return (this.error = true);
    }
  }
}
</script>
