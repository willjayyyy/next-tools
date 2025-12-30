# Getting Started with Vercel Web Analytics

This guide will help you get started with using Vercel Web Analytics on the next-tools project, showing you how to enable it, configure your app, deploy to Vercel, and view your data in the dashboard.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

```bash
# pnpm
pnpm i -g vercel

# npm
npm i -g vercel

# yarn
yarn global add vercel

# bun
bun add -g vercel
```

## Enable Web Analytics in Vercel

On the [Vercel dashboard](/dashboard), select your Project and then click the **Analytics** tab and click **Enable** from the dialog.

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Configure Next-Tools for Vercel Analytics

### Step 1: Verify the package is installed

The next-tools project already includes `@vercel/analytics` in its dependencies. Verify it's installed:

```bash
pnpm install
```

### Step 2: Enable Vercel Analytics via environment variable

The project uses environment variables to control analytics. Create or update your `.env.local` file with:

```
VITE_ENABLE_VERCEL_ANALYTICS=true
```

For development with debug logging, optionally add:

```
VITE_DEBUG_VERCEL_ANALYTICS=true
```

### Step 3: How it works

The Analytics component is automatically initialized in the Vue app. Here's how it's integrated:

**In `src/App.vue`:**
```vue
<template>
  <div class="min-h-screen bg-background text-foreground" :class="[themeClass]" :style="themeVars">
    <component :is="layout">
      <RouterView />
    </component>
    <Analytics />
    <Toaster />
  </div>
</template>
```

**In `src/components/Analytics/Analytics.vue`:**
```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { config } from '@/config';

const VercelAnalytics = defineAsyncComponent(() => import('./VercelAnalytics.vue'));
const GoogleAnalytics = defineAsyncComponent(() => import('./GoogleAnalytics.vue'));
const UmamiAnalytics = defineAsyncComponent(() => import('./UmamiAnalytics.vue'));
</script>

<template>
  <VercelAnalytics v-if="config.vercelAnalytics.enabled" />
  <GoogleAnalytics v-if="!!config.googleAnalytics.id" />
  <UmamiAnalytics v-if="!!config.umamiAnalytics.websiteId" />
</template>
```

**In `src/components/Analytics/VercelAnalytics.vue`:**
```vue
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue';
import { config } from '@/config';
</script>

<template>
  <Analytics :debug="config.vercelAnalytics.debug" />
</template>
```

The Analytics component is a wrapper around the tracking script, offering seamless integration with Vue 3, including automatic route support.

## Configuration

The analytics configuration is defined in `src/config.ts`:

```typescript
vercelAnalytics: {
  enabled: {
    doc: 'Enable Vercel Analytics',
    schema: v.boolean(),
    default: false,
    env: 'VITE_ENABLE_VERCEL_ANALYTICS',
  },
  debug: {
    doc: 'Enable debug logging for Vercel Analytics',
    schema: v.boolean(),
    default: false,
    env: 'VITE_DEBUG_VERCEL_ANALYTICS',
  },
}
```

## Deploy Your App to Vercel

Deploy your app using the Vercel CLI:

```bash
vercel deploy
```

Or connect your Git repository to Vercel for automatic deployments:

1. Push your changes to your Git repository
2. On Vercel, connect your GitHub/GitLab/Bitbucket repository
3. Set the environment variable `VITE_ENABLE_VERCEL_ANALYTICS=true` in your Vercel project settings
4. Vercel will automatically deploy your latest commits to main

Once your app is deployed, it will start tracking visitors and page views.

> **💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.

## View Your Data in the Dashboard

Once your app is deployed and users have visited your site, you can view your data in the dashboard.

To do so:

1. Go to your [Vercel dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click the **Analytics** tab

After a few days of visitors, you'll be able to start exploring your data by viewing and filtering the panels.

## Additional Analytics Options

The next-tools project also supports other analytics providers:

### Google Analytics 4

Set the environment variable:
```
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Umami Analytics

Set the environment variables:
```
VITE_UMAMI_WEBSITE_ID=your-website-id
VITE_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js
```

All three analytics providers can be used simultaneously. Each will only be initialized if its configuration is present.

## Next Steps

- Learn more about [filtering your analytics data](https://vercel.com/docs/analytics/filtering)
- Explore [privacy and compliance standards](https://vercel.com/docs/analytics/privacy-policy) with Vercel Web Analytics
- Check the [Vercel Analytics documentation](https://vercel.com/docs/analytics)

## Troubleshooting

### Analytics not showing data

1. **Verify enablement:** Check that `VITE_ENABLE_VERCEL_ANALYTICS=true` is set in your environment
2. **Check network requests:** Open your browser's Developer Tools → Network tab and look for requests to `/_vercel/insights/view`
3. **Wait for deployment:** Analytics may take a few minutes to start tracking after deployment
4. **Check dashboard:** Ensure Web Analytics is enabled in your Vercel project dashboard

### Debug mode

Enable debug logging to see analytics activity:

```
VITE_DEBUG_VERCEL_ANALYTICS=true
```

This will log analytics events to your browser console.

## Configuration Reference

All analytics configuration is managed through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENABLE_VERCEL_ANALYTICS` | Enable Vercel Web Analytics | `false` |
| `VITE_DEBUG_VERCEL_ANALYTICS` | Enable debug logging for Vercel Analytics | `false` |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics Measurement ID (G-XXXXXXXXXX) | `` |
| `VITE_UMAMI_WEBSITE_ID` | Umami website ID | `` |
| `VITE_UMAMI_SCRIPT_URL` | Umami script URL | `https://analytics.umami.is/script.js` |
