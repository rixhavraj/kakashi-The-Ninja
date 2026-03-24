#!/usr/bin/env node
import fs from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import path from 'node:path'
import https from 'node:https'

const assetPackPath = path.resolve('public/assets/asset-pack.json')
const cacheRoot = path.resolve('public/assets/crazy-cache')

const readAssetPack = async () => {
  const json = await fs.readFile(assetPackPath, 'utf8')
  return JSON.parse(json)
}

const writeAssetPack = async (data) => {
  const pretty = JSON.stringify(data, null, 2)
  await fs.writeFile(assetPackPath, pretty)
}

const downloadFile = (fileUrl, destination) => new Promise((resolve, reject) => {
  https.get(fileUrl, (response) => {
    if (response.statusCode && response.statusCode >= 400) {
      reject(new Error(`Failed to download ${fileUrl} (${response.statusCode})`))
      response.resume()
      return
    }

    const fileStream = createWriteStream(destination)
    response.pipe(fileStream)
    fileStream.on('finish', () => fileStream.close(resolve))
    fileStream.on('error', reject)
  }).on('error', reject)
})

const copyRemoteAssetsLocally = async () => {
  const assetPack = await readAssetPack()
  await fs.mkdir(cacheRoot, { recursive: true })

  const categories = Object.keys(assetPack)
  for (const category of categories) {
    const block = assetPack[category]
    if (!block || !Array.isArray(block.files)) continue

    for (const file of block.files) {
      if (!file.url || !file.url.startsWith('http')) continue

      const url = new URL(file.url)
      const ext = path.extname(url.pathname)
      const filename = file.key ? `${file.key}${ext}` : path.basename(url.pathname)
      const targetDir = path.join(cacheRoot, category)
      const targetPath = path.join(targetDir, filename)
      await fs.mkdir(targetDir, { recursive: true })

      console.log(`Downloading ${file.url}`)
      await downloadFile(file.url, targetPath)

      const relativePath = path.relative(path.resolve('public'), targetPath).replace(/\\/g, '/')
      file.url = relativePath.startsWith('.') ? relativePath : relativePath
    }
  }

  await writeAssetPack(assetPack)
}

copyRemoteAssetsLocally().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
