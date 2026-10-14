# EasySociable MCP Server

[![npm version](https://img.shields.io/npm/v/@easysociable/cli.svg?style=flat-square)](https://www.npmjs.com/package/@easysociable/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Standard-orange.svg?style=flat-square)](https://modelcontextprotocol.io/)

A Model Context Protocol (MCP) server that empowers AI agents (Claude Desktop, Claude Code, Cursor, Codex) to turn prompts, outlines, and markdown into branded, multi-page social carousels and slideshows for TikTok, LinkedIn, Instagram, Threads, and Xiaohongshu.

---

## What is EasySociable?

[EasySociable](https://easysociable.com) is an agent-native visual production layer that bridges the gap between text-based AI models and finished visual carousel decks:

- **AI Agent writes the content**: Claude or Cursor creates the story, pacing, and slide copy.
- **EasySociable binds the design**: Applies proven layout families, enforces Brand Kits (fonts, colors), and prepares a durable Slideshow Run.
- **In-Browser Studio**: Open the private review link in your browser to polish text or swap images without layout drift.
- **Multi-Platform PNG Pack**: One-click download optimized for TikTok (9:16), LinkedIn (4:5 / 1:1), Instagram (4:5 / 1:1), and Xiaohongshu (3:4).

---

## Quickstart & Installation

This server is listed in the [Official MCP Registry](https://registry.modelcontextprotocol.io).

### Option 1: Claude Desktop

Add this configuration to your `claude_desktop_config.json`:

* **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "easysociable": {
      "command": "npx",
      "args": ["-y", "@easysociable/cli", "mcp", "serve", "--transport", "stdio"]
    }
  }
}
```

### Option 2: Cursor

Add the MCP server to Cursor via **Cursor Settings > Features > MCP Servers > Add New**:

- **Name**: `easysociable`
- **Type**: `command`
- **Command**: `npx -y @easysociable/cli mcp serve --transport stdio`

### Option 3: Global CLI Install

```bash
# macOS / Linux automated installer
curl -fsSL https://easysociable.com/install.sh | bash

# Or via npm
npm install -g @easysociable/cli

# Run MCP server directly
easysociable mcp serve --transport stdio
```

---

## Available MCP Tools

36 tools, grouped by what the agent works on:

| Group | Tools |
|---|---|
| **Slideshow Runs** | `create_slideshow_run`, `get_slideshow_run`, `list_slideshow_runs`, `update_slideshow_run`, `archive_slideshow_run`, `restore_slideshow_run`, `delete_slideshow_run` |
| **Brands** | `create_brand`, `get_brand`, `list_brands`, `update_brand`, `archive_brand`, `restore_brand`, `delete_brand` |
| **Templates** | `list_templates`, `get_template` |
| **Template authoring** | `create_template_draft`, `get_template_draft`, `list_template_drafts`, `update_template_draft`, `delete_template_draft`, `publish_template_draft`, `create_template_preview_job`, `import_template_image` |
| **Images** | `import_image`, `get_image`, `list_images`, `update_image`, `attest_image`, `archive_image`, `restore_image`, `delete_image` |
| **Design assets** | `search_icons`, `get_icon`, `list_gradients`, `get_gradient` |

---

## Agent Skills

The [`skills/`](skills) folder holds the workflows the agent follows on top of the tools:

| Skill | Purpose |
|---|---|
| [`easysociable-slideshow`](skills/easysociable-slideshow/SKILL.md) | Topic → proven hook → structure → editable carousel, returned as a Studio link |
| [`easysociable-template`](skills/easysociable-template/SKILL.md) | Design and publish reusable page templates from a brief or an image |
| [`easysociable-content`](skills/easysociable-content/SKILL.md) | Pointer to the local [Content Engine](https://github.com/murphywuwu/content-engine) |

Install skills + MCP in one go with `easysociable install --yes`, or as a Claude Code plugin:

```
/plugin marketplace add murphywuwu/easysociable-mcp
/plugin install easysociable@easysociable
```

---

## Example Agent Workflow

When you ask your agent:
> *"Create a 5-slide LinkedIn carousel about 4 Micro-SaaS pricing mistakes with my Brand."*

Your Agent will:
1. Call `list_brands` to load your saved Brand (name, handle, colors, fonts).
2. Pick a proven hook and structure from the [Hook](https://easysociable.com/hooks) and [Formula](https://easysociable.com/formulas) catalogs, then draft the copy.
3. Call `list_templates` to choose a layout for each page.
4. Call `create_slideshow_run` to bind copy, layouts and Brand into a Slideshow Run.
5. Return a private Studio link for you to polish and download the finished PNG pack.

---

## Supported Formats

| Platform | Canvas Preset | Ratio |
|---|---|---|
| **TikTok** | 1080 × 1920 | 9:16 (Photo Mode) |
| **LinkedIn** | 1080 × 1350 | 4:5 (Document Carousel) |
| **Instagram** | 1080 × 1350 / 1080 × 1080 | 4:5 / 1:1 |
| **Xiaohongshu (RED)** | 1080 × 1440 | 3:4 |
| **Threads / X** | 1080 × 1080 / 1080 × 1350 | 1:1 / 4:5 |

---

## Links & Resources

- **Website**: [https://easysociable.com](https://easysociable.com)
- **Formula Catalog**: [https://easysociable.com/formulas](https://easysociable.com/formulas)
- **Hook Catalog**: [https://easysociable.com/hooks](https://easysociable.com/hooks)
- **LLM Specification**: [https://easysociable.com/llms.txt](https://easysociable.com/llms.txt)
- **npm Package**: [@easysociable/cli](https://www.npmjs.com/package/@easysociable/cli)

---

## License

MIT © [EasySociable](https://easysociable.com)
