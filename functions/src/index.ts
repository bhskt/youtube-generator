import axios from 'axios';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const API_KEY = 'AIzaSyDq11Zs7Y3qp8vD2QU8osJ1kXgcmJVdbdU';
const SEARCH_API = 'https://www.googleapis.com/youtube/v3/search';
const DEFAULT_URL = 'https://yg-2021.web.app';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const checkNewVideos = async (linkId: string) => {
  const videoIdDocs = await db
    .collection('videos')
    .doc(linkId)
    .collection('ids')
    .get();

  if (videoIdDocs.size < 5) {
    insertNewVideos(linkId);
  }
};

const insertNewVideos = async (linkId: string) => {
  const linkDoc = await db
    .collection('links')
    .where('__name__', '==', linkId)
    .limit(1)
    .get();

  if (linkDoc.size !== 1) {
    throw new Error(`Link ${linkId} Not Found`);
  }

  const batch = db.batch();
  const keywords = linkDoc.docs[0].data().keywords as string[];
  const query = keywords.join(' ');

  let loop = 4;
  let nextPageToken;

  do {
    loop--;

    try {
      const response: {
        nextPageToken: string;
        items: { id: { videoId: string } }[];
      } = (
        await axios.get(SEARCH_API, {
          params: {
            key: API_KEY,
            maxResults: '50',
            part: 'snippet',
            order: 'date',
            q: query,
            type: 'video',
            videoEmbeddable: 'true',
            pageToken: nextPageToken
          }
        })
      ).data;

      nextPageToken = response.nextPageToken;

      await db
        .collection('videos')
        .doc(linkId)
        .set({ lastUpdatedAt: Math.floor(Date.now() / 1000) });

      const videoIdsRef = db.collection('videos').doc(linkId).collection('ids');

      for (const item of response.items) {
        try {
          batch.set(videoIdsRef.doc(item.id.videoId), item.id);
        } catch (error) {
          // Ignore
        }
      }
    } catch (error) {
      console.log(error);
    }
  } while (loop && nextPageToken);

  try {
    await batch.commit();
  } catch (error) {
    throw new Error(`Unable to Commit New Videos Into ${linkId}`);
  }

  return true;
};

export const addLink = functions.https.onCall(async (data) => {
  let link = data.link as string;
  let keywordsString = data.keywords as string;

  if (!link || !keywordsString) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing Parameters'
    );
  }

  try {
    link = link.trim().toLowerCase();
    keywordsString = keywordsString.trim().toLowerCase();

    if (!link) {
      throw new Error('Blank Link Text');
    }

    if (!keywordsString) {
      throw new Error('Blank Keywords');
    }

    if (
      !link.match(/^[a-z0-9][a-z0-9-]*?[a-z0-9]$/) &&
      !link.match(/^[a-z0-9]$/)
    ) {
      throw new Error('Invalid Link Text');
    }

    if (keywordsString.match(/[^a-z0-9 \n]/)) {
      throw new Error('Invalid Keywords');
    }

    const keywords = keywordsString
      .split('\n')
      .map((el) => el.trim())
      .filter((el) => el.length);

    if (!keywords.length) {
      throw new Error('Invalid Keywords');
    }

    const newLink = {
      link,
      keywords
    };

    const existingDoc = await db
      .collection('links')
      .where('link', '==', link)
      .limit(1)
      .get();

    if (existingDoc.size) {
      throw new Error('Link Exists');
    }

    const linkDoc = await db.collection('links').add(newLink);

    insertNewVideos(linkDoc.id);

    return true;
  } catch (error) {
    throw new functions.https.HttpsError('invalid-argument', error.message);
  }
});

export const deleteLink = functions.https.onCall(async (data) => {
  const id = data.id as string;

  if (!id) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing Parameter'
    );
  }

  try {
    await db.collection('links').doc(id).delete();

    return true;
  } catch (error) {
    throw new functions.https.HttpsError('invalid-argument', error.message);
  }
});

export const getVideoId = functions.https.onCall(async (data) => {
  const link = data.link as string;

  if (!link) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing Parameter'
    );
  }

  try {
    const linkDocs = await db
      .collection('links')
      .where('link', '==', link)
      .limit(1)
      .get();

    if (!linkDocs.size) {
      throw new Error('Not Found');
    }

    const linkId = linkDocs.docs[0].id;

    const videoIdDocs = await db
      .collection('videos')
      .doc(linkId)
      .collection('ids')
      .limit(1)
      .get();

    if (!videoIdDocs.size) {
      throw new Error('No Videos Found');
    }

    const videoIdDoc = videoIdDocs.docs[0];
    const videoId = videoIdDoc.id;

    videoIdDoc.ref.delete();

    checkNewVideos(linkId);

    return videoId;
  } catch (error) {
    throw new functions.https.HttpsError('invalid-argument', error.message);
  }
});

export const requestVideoId = functions.https.onRequest(async (req, res) => {
  if (!req.url.match(/^\/[a-z0-9-]+?$/)) {
    return res.redirect(DEFAULT_URL);
  }

  const link = req.url.slice(1).trim();

  if (!link) {
    return res.redirect(DEFAULT_URL);
  }

  try {
    const linkDocs = await db
      .collection('links')
      .where('link', '==', link)
      .limit(1)
      .get();

    if (!linkDocs.size) {
      return res.redirect(DEFAULT_URL);
    }

    const linkId = linkDocs.docs[0].id;

    const videoIdDocs = await db
      .collection('videos')
      .doc(linkId)
      .collection('ids')
      .limit(1)
      .get();

    if (!videoIdDocs.size) {
      return res.redirect(DEFAULT_URL);
    }

    const videoIdDoc = videoIdDocs.docs[0];
    const videoId = videoIdDoc.id;

    videoIdDoc.ref.delete();
    checkNewVideos(linkId);

    res.redirect(`https://youtu.be/${videoId}`);
  } catch (error) {
    return res.redirect(DEFAULT_URL);
  }
});
