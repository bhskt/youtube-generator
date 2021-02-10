<template>
  <v-row
    id="manage"
    align="center"
    align-content="start"
    class="fill-height"
    justify="start"
    no-gutters
  >
    <v-col cols="12" md="2">
      <v-card
        class="link-add ma-5"
        color="blue accent-4"
        flat
        @click.stop="linkAdd = true"
      >
        <v-card-title class="d-block">
          <v-icon>fa-plus</v-icon>

          <div>Add New</div>
        </v-card-title>
      </v-card>
    </v-col>

    <v-col v-for="link in links" :key="link.id" cols="12" md="2">
      <v-card class="ma-5">
        <v-card-title>/{{ link.link }}</v-card-title>

        <v-card-text>
          {{ link.keywords.join(', ') }}

          <v-row
            align="center"
            class="mt-5 text-caption"
            justify="space-between"
            no-gutters
          >
            <v-col cols="auto">Videos</v-col>

            <v-col class="font-weight-bold white--text" cols="auto">
              {{ link.videos ? link.videos : '...' }}
            </v-col>
          </v-row>

          <v-row
            align="center"
            class="text-caption"
            justify="space-between"
            no-gutters
          >
            <v-col cols="auto">Updated</v-col>

            <v-col
              class="font-weight-bold white--text text-capitalize"
              cols="auto"
            >
              {{
                link.lastUpdatedAt
                  ? $moment.unix(link.lastUpdatedAt).fromNow()
                  : '...'
              }}
            </v-col>
          </v-row>
        </v-card-text>

        <v-btn
          fab
          color="link-delete warning"
          light
          x-small
          @click.stop="linkDelete = link"
        >
          <v-icon>fa-times</v-icon>
        </v-btn>
      </v-card>
    </v-col>

    <v-dialog v-model="linkAdd" width="20rem">
      <v-card>
        <v-card-title class="d-block text-center">New Link</v-card-title>

        <v-spacer class="my-5" />

        <v-card-text>
          <v-alert
            v-model="newLinkError"
            class="text-subtitle-2"
            color="warning"
            dense
            dismissible
          >
            {{ newLinkErrorText }}
          </v-alert>

          <v-text-field
            v-model.trim="newLink"
            autofocus
            class="white mb-5"
            dense
            hide-details
            light
            outlined
            prefix="/"
            placeholder="Link"
          />

          <v-textarea
            v-model.trim="newLinkKeywords"
            class="white mb-5"
            dense
            hide-details
            light
            outlined
            placeholder="Keywords (1 Word or Phrase / Line)"
          />

          <v-row>
            <v-col cols="6">
              <v-btn color="primary" width="100%" @click.stop="handleLinkAdd">
                Add
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn
                color="secondary"
                width="100%"
                @click.stop="linkAdd = false"
              >
                Close
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-if="linkDelete" v-model="linkDelete" width="20rem">
      <v-card>
        <v-card-title class="d-block text-center">Delete Link?</v-card-title>

        <v-spacer class="my-5" />

        <v-card-text class="text-center">
          <div class="mb-5">
            The link <code class="mx-1" v-text="`/${linkDelete.link}`" /> will
            be permanently removed.
          </div>

          <v-row>
            <v-col cols="6">
              <v-btn
                color="error"
                width="100%"
                @click.stop="() => handleLinkDelete(linkDelete.id)"
              >
                Confirm
              </v-btn>
            </v-col>

            <v-col cols="6">
              <v-btn
                color="secondary"
                width="100%"
                @click.stop="linkDelete = null"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';

interface Link {
  id: string;
  link: string;
  keywords: string[];

  videos?: number;
  lastUpdatedAt?: number;
}

@Component
export default class Manage extends Vue {
  links: Link[] = [];
  linkAdd = false;
  linkDelete: Link | null = null;

  newLink = '';
  newLinkKeywords = '';

  newLinkError = false;
  newLinkErrorText = '';

  mounted() {
    this.fetchLinks();
  }

  layout() {
    return 'manage';
  }

  async fetchLinks() {
    const links: Link[] = [];
    const snapshot = await this.$fire.firestore.collection('links').get();

    snapshot.docs.forEach((doc) => {
      const data = doc.data();

      links.push({ id: doc.id, link: data.link, keywords: data.keywords });
    });

    this.links = links;

    this.fetchVideosData();
  }

  async fetchVideosData() {
    const links = [...this.links];

    for (const link of links) {
      const videosLinkDoc = await this.$fire.firestore
        .collection('videos')
        .doc(link.id)
        .get();

      link.lastUpdatedAt = videosLinkDoc.data()?.lastUpdatedAt;

      const videoIds = await this.$fire.firestore
        .collection('videos')
        .doc(link.id)
        .collection('ids')
        .get();

      link.videos = videoIds.size;
    }

    this.links = links;
  }

  async handleLinkAdd() {
    this.newLinkError = false;

    if (!this.newLink || !this.newLinkKeywords) {
      this.newLinkError = true;
      this.newLinkErrorText = 'Missing Parameters';

      return;
    }

    const addLink = this.$fire.functions.httpsCallable('addLink');

    try {
      await addLink({
        link: this.newLink,
        keywords: this.newLinkKeywords
      });

      this.linkAdd = false;
      this.newLink = '';
      this.newLinkKeywords = '';

      this.fetchLinks();
    } catch (error) {
      this.newLinkError = true;
      this.newLinkErrorText = error.message;
    }
  }

  async handleLinkDelete(id: string) {
    const deleteLink = this.$fire.functions.httpsCallable('deleteLink');

    try {
      await deleteLink({ id });

      this.fetchLinks();
    } catch (error) {
      alert('Could Not Delete Link!');
    } finally {
      this.linkDelete = null;
    }
  }
}
</script>

<style lang="scss">
#manage {
  .link-delete {
    position: absolute;
    top: -10px;
    right: -10px;
  }

  .link-add {
    border: 1px dashed white !important;
    cursor: pointer;
  }
}
</style>
