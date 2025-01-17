# 🛰 Github CDN (Forked)

> This repo is forked and currently under development for my own propose. All newly added features may not be supported stably, and they are listed as follows:
> 
> * HTTP proxy
> * Allow CORS
> * New route and cache rules
> * Private mode (with custom access limits)
> * FIX: Landing page
> * FIX: Handle binary files
> * FIX: Hide error message in production environment

[Github CDN](https://github.com/memset0/github-cdn) is [UNPKG](https://unpkg.com/) for Github — an unofficial content delivery network for repo assets on Github.

## 🚀 Usage

```
cp githubcdn.config.sample.js githubcdn.config.js
npm install
npm start
```

## ⭐️ Features
- Fetch repo meta-data: branches, tags, and PRs
- Serve repo and Gist files
- Instant access to new changes pushed to Github *
- Great for quick prototyping / development
- Includes [npm excluded files](https://docs.npmjs.com/using-npm/developers.html#keeping-files-out-of-your-package)
- [Node API](https://github.com/privatenumber/github-cdn/blob/master/readme_node-api.md) for compatibility with Github Enterprise

_* Unless the request fails due to network failure or rate-limiting_

## 💁‍♀️ Endpoints

- `/:owner/:repo`
  - Get the default branch and all refs (branches, tags, and PRs)
  - eg. [`/vuejs/vue`](https://github-cdn.memset0.cn/vuejs/vue) to retrieve meta data on [vuejs/vue](https://github.com/vuejs/vue)

  <details>
  	<summary><i>Example output</i></summary>

  ```json5
  {
  	"default_branch": "master",
  	"refs": {
  		"heads": { ... },
  		"tags": { ... },
  		"pull": { ... }
  	}
  }
  ```

  </details>

- `/:owner/:repo@:ref`

  - Resolve repo ref if semver. Redirects to root of repo ref
  - eg. [`/vuejs/vue/master`](https://github-cdn.memset0.cn/vuejs/vue/master)
  - eg. [`/vuejs/vue/^2.0.0`](https://github-cdn.memset0.cn/vuejs/vue/^2.0.0)
  - eg. [`/vuejs/vue/latest`](https://github-cdn.memset0.cn/vuejs/vue/latest)

- `/:owner/:repo@:ref?badge`

  - Resolves the ref and redirects to [Badgen](https://badgen.net)
  - eg. `/vuejs/vue/latest?badge` ![Latest Vue badge](https://github-cdn.memset0.cn/vuejs/vue/latest?badge)

- `/:owner/:repo@:ref/:path`

  - Get a file or list directory in a repo ref
  - eg. [`/vuejs/vue/v2.6.11/dist/`](https://github-cdn.memset0.cn/vuejs/vue/v2.6.11/dist/)
  - eg. [`/vuejs/vue/v2.6.11/dist/vue.min.js`](https://github-cdn.memset0.cn/vuejs/vue/v2.6.11/dist/vue.min.js)

- `/gist/:gist-id`
  - Get meta-data on a Gist: url, owner, created/updated date, and files
  - eg. [`/gist/feff40b0a522f0c41c4eff0b77ea1d47`](https://github-cdn.memset0.cn/gist/feff40b0a522f0c41c4eff0b77ea1d47)

- `/gist/:gist-id/:path`
  - Get a file from a Gist
  - eg. [`/gist/feff40b0a522f0c41c4eff0b77ea1d47/tulip.jpg`](https://github-cdn.memset0.cn/gist/feff40b0a522f0c41c4eff0b77ea1d47/tulip.jpg)

- `/ratelimit`

  - See the rate limit quota available on the Github API
  - With rate limiting, **Github CDN is not a production-ready solution** to hosting code

### 🔑 Setting a custom token (for rate-limiting & private repos)
Use a [Personal access token (PAT)](https://github.com/settings/tokens) to access your private repos and to use your [rate limit quota](https://developer.github.com/v3/#rate-limiting).

_This token is only stored in your browser as a cookie._

<!-- insert-token-input -->

---

Built and maintained by [@privatenumber](https://github.com/privatenumber) [![GitHub followers](https://img.shields.io/github/followers/privatenumber.svg?style=social&label=Follow)](https://github.com/privatenumber?tab=followers) and powered by [Vercel](https://vercel.com) ❤️
