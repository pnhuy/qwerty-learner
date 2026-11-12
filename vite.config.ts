import react from '@vitejs/plugin-react'
import { getLastCommit } from 'git-last-commit'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'

/**
 * Absolute URLs in index.html (canonical, Open Graph, JSON-LD) are written as `__SITE_URL__/...`. With SITE_URL set
 * (e.g. SITE_URL=https://example.github.io/qwerty-learner/) they are filled in; without it those lines are dropped,
 * so a deployment never claims to be another site.
 */
function siteUrl(): PluginOption {
  const url = process.env.SITE_URL?.replace(/\/*$/, '/')
  return {
    name: 'site-url',
    transformIndexHtml: (html) =>
      url
        ? html.replaceAll('__SITE_URL__/', url)
        : html
            .split('\n')
            .filter((line) => !line.includes('__SITE_URL__'))
            .join('\n'),
  }
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const latestCommitHash = await new Promise<string>((resolve) => {
    return getLastCommit((err, commit) => (err ? 'unknown' : resolve(commit.shortHash)))
  })
  return {
    plugins: [
      react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
      siteUrl(),
      visualizer() as PluginOption,
      Icons({
        compiler: 'jsx',
        jsx: 'react',
      }),
    ],
    build: {
      minify: true,
      outDir: 'build',
      sourcemap: false,
    },
    esbuild: {
      drop: mode === 'development' ? [] : ['console', 'debugger'],
    },
    define: {
      REACT_APP_DEPLOY_ENV: JSON.stringify(process.env.REACT_APP_DEPLOY_ENV),
      LATEST_COMMIT_HASH: JSON.stringify(latestCommitHash + (process.env.NODE_ENV === 'production' ? '' : ' (dev)')),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
  }
})
