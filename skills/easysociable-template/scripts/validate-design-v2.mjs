#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: node scripts/validate-design-v2.mjs <design-plan.json|theme-tokens.json|visual-qa.json|->')
  process.exit(2)
}

let value
try {
  const input = filePath === '-'
    ? fs.readFileSync(0, 'utf8')
    : fs.readFileSync(path.resolve(filePath), 'utf8')
  value = JSON.parse(input)
}
catch (error) {
  console.error(`Invalid JSON: ${error.message}`)
  process.exit(1)
}

const errors = []
const nonEmpty = (candidate) => typeof candidate === 'string' && candidate.trim().length > 0
const HEX_RE = /^#[0-9A-Fa-f]{6}$/
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const THEME_COLOR_KEYS = ['canvas', 'text', 'accent', 'muted']

function validatePaletteCandidates(candidates, index) {
  if (!Array.isArray(candidates))
    return
  candidates.forEach((candidate, candidateIndex) => {
    if (!HEX_RE.test(candidate?.brandHex ?? ''))
      errors.push(`concepts[${index}].paletteCandidates[${candidateIndex}].brandHex must be #RRGGBB`)
    if (!['light', 'dark'].includes(candidate?.mode))
      errors.push(`concepts[${index}].paletteCandidates[${candidateIndex}].mode must be light or dark`)
    if (candidate?.name !== undefined && !nonEmpty(candidate.name))
      errors.push(`concepts[${index}].paletteCandidates[${candidateIndex}].name must be non-empty when present`)
    if (candidate?.bestFor !== undefined && !nonEmpty(candidate.bestFor))
      errors.push(`concepts[${index}].paletteCandidates[${candidateIndex}].bestFor must be non-empty when present`)
  })
}

function validateThemePreview(preview) {
  if (!preview)
    return
  if (!HEX_RE.test(preview.brandHex ?? ''))
    errors.push('themePreview.brandHex must be #RRGGBB')
  if (!['light', 'dark'].includes(preview.activeMode))
    errors.push('themePreview.activeMode must be light or dark')
  if (typeof preview.contrastPass !== 'boolean')
    errors.push('themePreview.contrastPass must be boolean')
  if (!nonEmpty(preview.themeTokensPath))
    errors.push('themePreview.themeTokensPath is required')
  if (preview.name !== undefined && !nonEmpty(preview.name))
    errors.push('themePreview.name must be non-empty when present')
  if (preview.userConfirmed !== undefined && typeof preview.userConfirmed !== 'boolean')
    errors.push('themePreview.userConfirmed must be boolean when present')
}

function validateSurfacePreview(preview) {
  if (!preview)
    return
  const kinds = new Set(['flat', 'gradient', 'image'])
  if (!kinds.has(preview.kind))
    errors.push('surfacePreview.kind must be flat, gradient, or image')
  if (typeof preview.userConfirmed !== 'boolean')
    errors.push('surfacePreview.userConfirmed must be boolean')
  if (preview.kind === 'gradient' || preview.kind === 'image') {
    if (preview.userConfirmed !== true)
      errors.push(`surfacePreview.userConfirmed must be true when kind is ${preview.kind}`)
  }
  if (preview.kind === 'gradient' && preview.userConfirmed === true && !nonEmpty(preview.recipeId))
    errors.push('surfacePreview.recipeId is required when kind is gradient and confirmed')
  if (preview.kind === 'image' && preview.userConfirmed === true) {
    if (!nonEmpty(preview.imageId) && preview.importPending !== true)
      errors.push('surfacePreview.imageId is required when kind is image and confirmed (or set importPending true)')
    if (preview.imageMode !== undefined && !['fixed', 'slot_default'].includes(preview.imageMode))
      errors.push('surfacePreview.imageMode must be fixed or slot_default when present')
  }
  if (preview.textSafeZone !== undefined
    && !['light_end', 'dark_end', 'needs_scrim'].includes(preview.textSafeZone)) {
    errors.push('surfacePreview.textSafeZone must be light_end, dark_end, or needs_scrim when present')
  }
  if (preview.contrastAnchor !== undefined && !HEX_RE.test(preview.contrastAnchor))
    errors.push('surfacePreview.contrastAnchor must be #RRGGBB when present')
}

const PHILOSOPHY_REQUIRED_FIELDS = [
  'movementName',
  'space',
  'color',
  'rhythm',
  'composition',
  'typographyAccent',
  'craftBar',
]

function validatePhilosophy(philosophy, required) {
  if (!philosophy || typeof philosophy !== 'object') {
    if (required)
      errors.push('philosophy is required')
    return
  }
  PHILOSOPHY_REQUIRED_FIELDS.forEach((field) => {
    if (!nonEmpty(philosophy[field]))
      errors.push(`philosophy.${field} is required`)
  })
}

function validateThemeTokensBlock(tokens, label) {
  const colors = tokens?.colors ?? {}
  THEME_COLOR_KEYS.forEach((key) => {
    if (!HEX_RE.test(colors[key] ?? ''))
      errors.push(`${label}.colors.${key} must be #RRGGBB`)
  })
  if (!nonEmpty(tokens?.fonts?.heading))
    errors.push(`${label}.fonts.heading is required`)
  if (!nonEmpty(tokens?.fonts?.body))
    errors.push(`${label}.fonts.body is required`)
  if (!nonEmpty(tokens?.surfaces?.radius))
    errors.push(`${label}.surfaces.radius is required`)
  if (!nonEmpty(tokens?.surfaces?.shadow))
    errors.push(`${label}.surfaces.shadow is required`)
}

const REFERENCE_SPEC_FIELDS = ['margins', 'gaps', 'radii', 'typeScale']
const IMAGE_INVENTORY_ROLES = new Set(['hero', 'screenshot', 'avatar', 'product'])
const IMAGE_SLOT_SOURCES = new Set(['user_upload', 'brand_kit', 'external_photo', 'generated'])
const SLOT_KEY_RE = /^image_\d+$/

function validateReferenceImageFields(plan, assetPlan) {
  const spec = plan.referenceSpec
  if (!spec || typeof spec !== 'object') {
    errors.push('referenceSpec is required when sourceKind is image_reference')
  }
  else {
    if (!Array.isArray(spec.stackOrder) || spec.stackOrder.length < 1)
      errors.push('referenceSpec.stackOrder must be a non-empty array')
    else {
      spec.stackOrder.forEach((entry, index) => {
        if (!nonEmpty(entry))
          errors.push(`referenceSpec.stackOrder[${index}] must be a non-empty string`)
      })
    }
    REFERENCE_SPEC_FIELDS.forEach((field) => {
      if (!nonEmpty(spec[field]))
        errors.push(`referenceSpec.${field} is required`)
    })
  }

  const inventory = plan.referenceImageInventory
  if (!Array.isArray(inventory)) {
    errors.push('referenceImageInventory must be an array when sourceKind is image_reference (empty if no pictures)')
    return
  }

  const seenSlotKeys = new Set()
  inventory.forEach((item, index) => {
    if (!nonEmpty(item?.label))
      errors.push(`referenceImageInventory[${index}].label is required`)
    if (!SLOT_KEY_RE.test(item?.slotKey ?? ''))
      errors.push(`referenceImageInventory[${index}].slotKey must match image_N`)
    else if (seenSlotKeys.has(item.slotKey))
      errors.push(`referenceImageInventory duplicate slotKey: ${item.slotKey}`)
    else
      seenSlotKeys.add(item.slotKey)
    if (!IMAGE_INVENTORY_ROLES.has(item?.imageRole))
      errors.push(`referenceImageInventory[${index}].imageRole must be hero|screenshot|avatar|product`)
    if (!nonEmpty(item?.boxApprox))
      errors.push(`referenceImageInventory[${index}].boxApprox is required`)
  })

  if (!Array.isArray(assetPlan))
    return

  seenSlotKeys.forEach((slotKey) => {
    const match = assetPlan.find((asset) => asset?.slotKey === slotKey)
    if (!match) {
      errors.push(`assetPlan must include an entry with slotKey ${slotKey} for each inventoried picture`)
      return
    }
    if (!IMAGE_SLOT_SOURCES.has(match.source))
      errors.push(`assetPlan entry for ${slotKey} must use user_upload|brand_kit|external_photo|generated (not css_svg stand-in)`)
  })
}

function validateDesignPlan(plan) {
  const allowedSourceKinds = new Set(['text_brief', 'image_reference'])
  const allowedRoles = new Set(['background', 'hero', 'decorative', 'avatar', 'logo', 'icon'])
  const allowedSources = new Set([
    'user_upload',
    'brand_kit',
    'css_svg',
    'gradient_catalog',
    'asset_library',
    'better_icons',
    'template_icon_catalog',
    'external_photo',
    'generated',
    'none',
  ])
  const conceptFields = [
    'id',
    'name',
    'rationale',
    'visualMotif',
    'layout',
    'hierarchy',
    'typography',
    'colorStrategy',
    'assetStrategy',
  ]

  if (!allowedSourceKinds.has(plan.sourceKind))
    errors.push('sourceKind must be text_brief or image_reference')
  if (!nonEmpty(plan.intent?.jobToBeDone))
    errors.push('intent.jobToBeDone is required')
  if (!nonEmpty(plan.intent?.primaryPlatform))
    errors.push('intent.primaryPlatform is required')
  if (!(Number(plan.intent?.canvas?.width) > 0) || !(Number(plan.intent?.canvas?.height) > 0))
    errors.push('intent.canvas width and height must be positive numbers')

  const concepts = Array.isArray(plan.concepts) ? plan.concepts : []
  const minimum = plan.sourceKind === 'image_reference' ? 1 : 2
  if (concepts.length < minimum || concepts.length > 3)
    errors.push(`${plan.sourceKind || 'text_brief'} requires ${minimum}–3 concepts`)

  // Both source kinds need a philosophy so Visual QA has a craft bar.
  validatePhilosophy(plan.philosophy, true)

  const ids = new Set()
  concepts.forEach((concept, index) => {
    conceptFields.forEach((field) => {
      if (!nonEmpty(concept?.[field]))
        errors.push(`concepts[${index}].${field} is required`)
    })
    if (!nonEmpty(concept?.philosophyExpression))
      errors.push(`concepts[${index}].philosophyExpression is required`)
    if (nonEmpty(concept?.id)) {
      if (ids.has(concept.id))
        errors.push(`Duplicate concept id: ${concept.id}`)
      ids.add(concept.id)
    }
    if (!Array.isArray(concept?.risks))
      errors.push(`concepts[${index}].risks must be an array`)
    validatePaletteCandidates(concept?.paletteCandidates, index)
  })

  if (!nonEmpty(plan.selectedConceptId) || !ids.has(plan.selectedConceptId))
    errors.push('selectedConceptId must reference an existing concept')
  if (!nonEmpty(plan.selectionReason))
    errors.push('selectionReason is required')
  validateThemePreview(plan.themePreview)
  validateSurfacePreview(plan.surfacePreview)
  if (!Array.isArray(plan.assetPlan))
    errors.push('assetPlan must be an array (it may be empty)')
  else {
    plan.assetPlan.forEach((asset, index) => {
      if (!allowedRoles.has(asset?.role))
        errors.push(`assetPlan[${index}].role is invalid`)
      if (!allowedSources.has(asset?.source))
        errors.push(`assetPlan[${index}].source is invalid`)
      if (typeof asset?.required !== 'boolean')
        errors.push(`assetPlan[${index}].required must be boolean`)
      if (!nonEmpty(asset?.description))
        errors.push(`assetPlan[${index}].description is required`)
      if (asset?.slotKey !== undefined && !SLOT_KEY_RE.test(asset.slotKey))
        errors.push(`assetPlan[${index}].slotKey must match image_N when present`)
    })
  }

  if (plan.sourceKind === 'image_reference')
    validateReferenceImageFields(plan, plan.assetPlan)
}

function validateThemeTokens(theme) {
  if (!HEX_RE.test(theme.brandHex ?? ''))
    errors.push('brandHex must be #RRGGBB')
  if (!['light', 'dark'].includes(theme.activeMode))
    errors.push('activeMode must be light or dark')
  if (theme.contrastPass !== true)
    errors.push('contrastPass must be true — regenerate theme or adjust hex/mode before authoring')

  SHADES.forEach((shade) => {
    if (!HEX_RE.test(theme.scale?.[shade] ?? ''))
      errors.push(`scale.${shade} must be #RRGGBB`)
  })
  ;['light', 'dark'].forEach((mode) => {
    const palette = theme.semantic?.[mode] ?? {}
    ;['canvas', 'text', 'accent', 'muted', 'primary', 'border'].forEach((key) => {
      if (!HEX_RE.test(palette[key] ?? ''))
        errors.push(`semantic.${mode}.${key} must be #RRGGBB`)
    })
  })

  validateThemeTokensBlock(theme.themeTokens, 'themeTokens')
  validateThemeTokensBlock(theme.themeTokensLight, 'themeTokensLight')
  validateThemeTokensBlock(theme.themeTokensDark, 'themeTokensDark')

  if (!Array.isArray(theme.contrast) || theme.contrast.length === 0)
    errors.push('contrast must be a non-empty array')
  else {
    theme.contrast.forEach((entry, index) => {
      if (!nonEmpty(entry?.pair))
        errors.push(`contrast[${index}].pair is required`)
      if (!['light', 'dark'].includes(entry?.mode))
        errors.push(`contrast[${index}].mode must be light or dark`)
      if (!HEX_RE.test(entry?.foreground ?? '') || !HEX_RE.test(entry?.background ?? ''))
        errors.push(`contrast[${index}] foreground and background must be #RRGGBB`)
      if (typeof entry?.ratio !== 'number' || entry.ratio <= 0)
        errors.push(`contrast[${index}].ratio must be a positive number`)
      if (typeof entry?.wcagAA !== 'boolean' || typeof entry?.wcagAAA !== 'boolean')
        errors.push(`contrast[${index}] wcagAA and wcagAAA must be boolean`)
    })
  }
}

function validateReferenceCompare(qa) {
  const compare = qa.referenceCompare
  if (qa.sourceKind !== 'image_reference') {
    if (compare !== undefined && (compare === null || typeof compare !== 'object'))
      errors.push('referenceCompare must be an object when present')
    return
  }
  if (!compare || typeof compare !== 'object') {
    errors.push('referenceCompare is required when sourceKind is image_reference')
    return
  }
  if (typeof compare.performed !== 'boolean')
    errors.push('referenceCompare.performed must be boolean')
  if (typeof compare.geometryMatch !== 'boolean')
    errors.push('referenceCompare.geometryMatch must be boolean')
  if (typeof compare.imageSlotsMatchInventory !== 'boolean')
    errors.push('referenceCompare.imageSlotsMatchInventory must be boolean')
  if (qa.verdict === 'pass') {
    if (compare.performed !== true)
      errors.push('pass verdict for image_reference requires referenceCompare.performed true')
    if (compare.geometryMatch !== true)
      errors.push('pass verdict for image_reference requires referenceCompare.geometryMatch true')
    if (compare.imageSlotsMatchInventory !== true)
      errors.push('pass verdict for image_reference requires referenceCompare.imageSlotsMatchInventory true')
  }
}

function validateVisualQa(qa) {
  const maxima = {
    hierarchy: 20,
    composition: 15,
    spacingAlignment: 15,
    typography: 15,
    colorContrast: 10,
    assetRelevance: 10,
    contentResilience: 10,
    editability: 5,
  }

  if (!nonEmpty(qa.draftId))
    errors.push('draftId is required')
  if (!Number.isInteger(qa.iteration) || qa.iteration < 0 || qa.iteration > 2)
    errors.push('iteration must be an integer from 0 to 2')
  if (!nonEmpty(qa.screenshotEvidence))
    errors.push('screenshotEvidence is required')
  if (!Array.isArray(qa.hardFailures))
    errors.push('hardFailures must be an array')
  if (!Array.isArray(qa.issues))
    errors.push('issues must be an array')
  if (!Array.isArray(qa.changesMade))
    errors.push('changesMade must be an array')
  if (!['pass', 'revise'].includes(qa.verdict))
    errors.push('verdict must be pass or revise')
  if (qa.sourceKind !== undefined && !['text_brief', 'image_reference'].includes(qa.sourceKind))
    errors.push('sourceKind must be text_brief or image_reference when present')

  let calculatedTotal = 0
  for (const [field, maximum] of Object.entries(maxima)) {
    const score = qa.scores?.[field]
    if (typeof score !== 'number' || score < 0 || score > maximum)
      errors.push(`scores.${field} must be between 0 and ${maximum}`)
    else
      calculatedTotal += score
  }

  if (qa.total !== calculatedTotal)
    errors.push(`total must equal calculated score ${calculatedTotal}`)
  if (qa.verdict === 'pass') {
    if (qa.hardFailures?.length > 0)
      errors.push('pass verdict cannot contain hardFailures')
    if (calculatedTotal < 80)
      errors.push('pass verdict requires a score of at least 80')
  }
  if (qa.verdict === 'revise' && calculatedTotal >= 80 && qa.hardFailures?.length === 0)
    errors.push('revise verdict conflicts with a passing score and no hardFailures')

  validateReferenceCompare(qa)
}

if (value?.schemaVersion === 'design_plan_v2_1')
  validateDesignPlan(value)
else if (value?.schemaVersion === 'theme_tokens_v2')
  validateThemeTokens(value)
else if (value?.schemaVersion === 'visual_qa_v2_1')
  validateVisualQa(value)
else
  errors.push('schemaVersion must be design_plan_v2_1, theme_tokens_v2, or visual_qa_v2_1')

if (errors.length > 0) {
  console.error(`V2.1 validation failed (${errors.length}):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`V2.1 validation passed: ${value.schemaVersion}`)
