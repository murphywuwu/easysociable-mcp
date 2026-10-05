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

| Tool | Description |
|---|---|
| `slideshows_create` | Creates a durable Slideshow Run from structured slide content or `content-pack.v1`, returning an interactive Studio review URL. |
| `formulas_list` | Lists validated viral carousel formulas filtered by niche, recipe, and platform. |
| `formulas_get` | Retrieves the exact narrative beat blueprint (`Hook → Point → Reason → CTA`) and prompt guidance for a specific formula. |
| `templates_list` | Retrieves available multi-platform layout templates for specific aspect ratios. |

---

## Example Agent Workflow

When you ask your agent:
> *"Create a 5-slide LinkedIn carousel about 4 Micro-SaaS pricing mistakes using the EasySociable productivity formula."*

Your Agent will:
1. Call `formulas_get` to retrieve the formula's narrative beat blueprint.
2. Draft punchy copy structured as:
   - Slide 1 (`hook`): Curiosity trigger
   - Slides 2–4 (`point`): The 3 pricing mistakes
   - Slide 5 (`cta`): Value recap & call to action
3. Call `slideshows_create` to bind the copy into an active Slideshow Run.
4. Return a private Studio link for you to preview and download the finished PNG pack.

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
