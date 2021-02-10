<template>
  <v-app>
    <v-app-bar app class="blue accent-4" flat>
      <div class="text-h5">Manage Links</div>

      <v-spacer />

      <v-btn color="accent" @click.stop="handleLogout">Logout</v-btn>
    </v-app-bar>

    <v-main class="blue darken-4">
      <v-container class="fill-height text-center" fluid>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer app class="blue accent-4">
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <div class="text-caption">YouTube Generator</div>
        </v-col>

        <v-col cols="auto">
          <div class="text-caption">{{ email }}</div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class Manage extends Vue {
  email = '';

  mounted() {
    if (this.$fire.auth.currentUser) {
      this.email = this.$fire.auth.currentUser.email as string;
    } else {
      this.$router.replace('/login');
    }
  }

  async handleLogout() {
    try {
      await this.$fire.auth.signOut();
    } catch (error) {
      // Ignore
    } finally {
      this.$router.replace('/login');
    }
  }
}
</script>
