# Render Run

Call `render_slideshow_run` / `slideshows render`. The Agent has already chosen a published Page Template
for each page role, fills public slot values, and delegates to Hosted Template
Render. A missing role match is a structured error; the agent must not silently
replace a page template locally.
