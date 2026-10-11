#!/usr/bin/env node

import { readFileSync } from 'node:fs'

function fail(message) {
  process.stderr.write(`authoring-source invalid: ${message}\n`)
  process.exitCode = 1
}

function readInput(path) {
  if (path === '-')
    return readFileSync(0, 'utf8')
  return readFileSync(path, 'utf8')
}

function arbitraryTokens(className) {
  return className
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => token.includes('[') && token.includes(']'))
}

function inlineStyleSource(tag) {
  const objectStyle = tag.match(/\bstyle\s*=\s*\{\{([\s\S]*?)\}\}/)
  if (objectStyle)
    return objectStyle[1]

  const stringStyle = tag.match(/\bstyle\s*=\s*["']([^"']*)["']/)
  return stringStyle?.[1] ?? ''
}

function styleEntriesToSource(style) {
  if (!style || typeof style !== 'object')
    return ''
  return Object.entries(style).map(([key, item]) => `${key}:${String(item)}`).join(';')
}

function isAbsolutelyPositionedStyle(styleSource) {
  return /\bposition\s*:\s*['"]?absolute\b/i.test(styleSource)
}

function checkClassName(className, location, styleSource = '') {
  const arbitrary = arbitraryTokens(className)
  if (arbitrary.length > 0) {
    fail(
      `${location} uses runtime Tailwind arbitrary-value classes: ${arbitrary.join(', ')}. `
      + 'Move exact geometry, typography, and Theme values into inline style.',
    )
  }

  if (className.split(/\s+/).includes('absolute')) {
    const hasInlinePosition = /\bposition\s*:\s*['"]?absolute\b/.test(styleSource)
    const hasInlineCoordinate = /\b(?:left|right|top|bottom)\s*:/.test(styleSource)
    if (!hasInlinePosition || !hasInlineCoordinate) {
      fail(
        `${location} relies on className="absolute" without inline position and coordinates. `
        + 'Runtime authoring geometry must be deterministic inline style.',
      )
    }
  }
}

function tagNameFromJsx(tag) {
  const match = tag.match(/^<\/?\s*([A-Za-z][\w:-]*)/)
  return match?.[1]?.toLowerCase() ?? 'unknown'
}

/**
 * Flat-tree rule: absolutely positioned nodes must be canvas siblings.
 * Nesting absolute inside absolute breaks Studio drag/select coordinates.
 * Non-positioned text/inline children under a text unit remain allowed.
 */
function checkJsxFlatNesting(jsx) {
  const tags = jsx.match(/<\/?[A-Za-z][\s\S]*?>/g) ?? []
  const stack = []

  tags.forEach((tag, index) => {
    const name = tagNameFromJsx(tag)
    const location = `json tag ${index + 1} (<${name}>)`

    if (tag.startsWith('</')) {
      while (stack.length > 0) {
        const top = stack.pop()
        if (top.name === name)
          break
      }
      return
    }

    const styleSource = inlineStyleSource(tag)
    const absolute = isAbsolutelyPositionedStyle(styleSource)
    if (absolute) {
      const absAncestor = [...stack].reverse().find(frame => frame.absolute)
      if (absAncestor) {
        fail(
          `${location} is absolutely positioned inside another absolute node (<${absAncestor.name}>). `
          + 'Flatten to canvas siblings with canvas coordinates. '
          + 'Only non-positioned text/inline children may nest under a text unit; '
          + 'card chrome must be a separate decoration sibling.',
        )
      }
    }

    const selfClosing = /\/\s*>$/.test(tag) || /^<(?:img|br|hr|input|meta|link)\b/i.test(tag)
    if (!selfClosing)
      stack.push({ name, absolute })
  })
}

function checkJsxString(jsx) {
  const tags = jsx.match(/<[A-Za-z][\s\S]*?>/g) ?? []
  tags.forEach((tag, index) => {
    const classMatch = tag.match(/\bclass(?:Name)?\s*=\s*["']([^"']*)["']/)
    if (!classMatch)
      return
    checkClassName(classMatch[1], `json tag ${index + 1}`, inlineStyleSource(tag))
  })
  checkJsxFlatNesting(jsx)
}

function nodeTagName(value) {
  const raw = value.tagName || value.type || value.name
  return typeof raw === 'string' ? raw.toLowerCase() : 'node'
}

function nodeStyleSource(value) {
  const fromProps = value.props?.style
  if (fromProps && typeof fromProps === 'object')
    return styleEntriesToSource(fromProps)
  if (value.style && typeof value.style === 'object')
    return styleEntriesToSource(value.style)
  return ''
}

function nodeClassName(value) {
  if (typeof value.className === 'string')
    return value.className
  if (typeof value.class === 'string')
    return value.class
  if (typeof value.props?.className === 'string')
    return value.props.className
  if (typeof value.props?.class === 'string')
    return value.props.class
  return ''
}

function checkObjectFlatNesting(value, path = 'json', ancestorAbsolute = false) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkObjectFlatNesting(item, `${path}[${index}]`, ancestorAbsolute))
    return
  }
  if (!value || typeof value !== 'object')
    return

  const styleSource = nodeStyleSource(value)
  const absolute = isAbsolutelyPositionedStyle(styleSource)
  if (absolute && ancestorAbsolute) {
    fail(
      `${path} (<${nodeTagName(value)}>) is absolutely positioned inside another absolute node. `
      + 'Flatten to canvas siblings with canvas coordinates. '
      + 'Only non-positioned text/inline children may nest under a text unit.',
    )
  }

  const childAncestorAbsolute = ancestorAbsolute || absolute
  const children = value.children ?? value.props?.children
  if (Array.isArray(children))
    checkObjectFlatNesting(children, `${path}.children`, childAncestorAbsolute)
  else if (children && typeof children === 'object')
    checkObjectFlatNesting(children, `${path}.children`, childAncestorAbsolute)

  Object.entries(value).forEach(([key, item]) => {
    if (['children', 'props', 'style', 'className', 'class'].includes(key))
      return
    if (item && typeof item === 'object')
      checkObjectFlatNesting(item, `${path}.${key}`, false)
  })
}

function checkObjectProjection(value, path = 'json') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkObjectProjection(item, `${path}[${index}]`))
    return
  }
  if (!value || typeof value !== 'object')
    return

  const className = nodeClassName(value)
  const style = nodeStyleSource(value)
  if (className)
    checkClassName(className, path, style)

  Object.entries(value).forEach(([key, item]) => {
    if (!['className', 'class', 'style'].includes(key))
      checkObjectProjection(item, `${path}.${key}`)
  })
}

const inputPath = process.argv[2]
if (!inputPath) {
  process.stderr.write('Usage: node validate-authoring-source.mjs <authoring-source.json|->\n')
  process.exit(2)
}

let source
try {
  source = JSON.parse(readInput(inputPath))
}
catch (error) {
  fail(`cannot read JSON: ${error instanceof Error ? error.message : String(error)}`)
  process.exit()
}

if (!source?.canvas || !Number.isInteger(source.canvas.width) || source.canvas.width <= 0
  || !Number.isInteger(source.canvas.height) || source.canvas.height <= 0) {
  fail('canvas.width and canvas.height must be positive integers')
}

if (typeof source?.json === 'string') {
  checkJsxString(source.json)
}
else {
  checkObjectProjection(source?.json)
  checkObjectFlatNesting(source?.json)
}

if (!process.exitCode)
  process.stdout.write('authoring-source valid\n')
