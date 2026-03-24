#!/usr/bin/env node
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const childProcess = require('node:child_process')
const { EventEmitter } = require('node:events')

const realExec = childProcess.exec

function normalizeExecArgs(options, callback) {
  if (typeof options === 'function') {
    return { options: undefined, callback: options }
  }
  return { options, callback }
}

childProcess.exec = function patchedExec(command, options, callback) {
  const { options: normalizedOptions, callback: normalizedCallback } = normalizeExecArgs(options, callback)
  const safeCommand = typeof command === 'string' ? command.trim().toLowerCase() : ''

  if (safeCommand === 'net use') {
    console.log('Skipping restricted "net use" call (CrazyGames-safe build).')

    if (typeof normalizedCallback === 'function') {
      setImmediate(() => normalizedCallback(null, '', ''))
    }

    const { Readable, Writable } = require('node:stream')
    const fakeProcess = new EventEmitter()
    fakeProcess.kill = () => {}
    fakeProcess.unref = () => {}
    fakeProcess.ref = () => {}
    fakeProcess.pid = 12345
    fakeProcess.stdin = new Writable({ write(c, e, cb) { cb() } })
    fakeProcess.stdout = new Readable({ read() { this.push(null) } })
    fakeProcess.stderr = new Readable({ read() { this.push(null) } })
    return fakeProcess
  }

  return realExec.call(this, command, normalizedOptions, normalizedCallback)
}

const cliCommand = process.argv[2] ?? 'dev'
const forwardedArgs = process.argv.slice(3)

const viteBin = path.resolve('node_modules/vite/bin/vite.js')
process.argv = [process.argv[0], viteBin, cliCommand, ...forwardedArgs]

try {
  await import(pathToFileURL(viteBin))
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
