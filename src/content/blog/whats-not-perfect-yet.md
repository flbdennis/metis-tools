---
title: "What’s Not Perfect Yet – And How You Can Help"
description: "An honest list of MetisTools’ current limitations and imperfections. Transparency is key."
pubDate: 2026-05-16
author: "Dennis Fan"
category: "Transparency"
tags: ["Limitations", "Bugs", "Improvement", "Honesty"]
readingTime: "3 min read"
---

No software is flawless. MetisTools is no exception. I believe in transparency, so here’s an honest list of the site’s current shortcomings. If you’ve encountered any of these, know that I’m actively working on them.

## 1. PDF to Office Conversions Are Still Limited

Right now, PDF to Word/Excel/PowerPoint conversions are **coming soon**. I haven’t implemented them yet because the pure‑frontend solutions are either slow or produce poor formatting. I’m evaluating a hybrid approach (local WASM + optional cloud fallback), but I refuse to compromise on privacy. Please bear with me.

## 2. Currency Converter Needs a More Reliable API

The currency converter sometimes fails due to API rate limits or CORS issues. I’ve implemented a fallback, but it’s not 100% reliable. I’m searching for a free, high‑uptime API or building my own proxy. Until then, if you see an error, just refresh or try later.

## 3. Mobile UX Can Be Clunky on Some Devices

While the site is responsive, a few pages (especially the image cropper) feel laggy on older phones. I’m profiling these pages and plan to optimize JavaScript execution and touch interactions.

## 4. Some Text Tools Lack Advanced Features

The regex tester, for example, doesn’t yet support replace functionality or syntax highlighting for capture groups. The text statistics tool doesn’t count paragraphs or reading time. These features are on the roadmap.

## 5. No Batch Processing for Files

You can only upload one file at a time. For batch image compression or PDF merging, you have to process files individually. This is a technical limitation of the browser’s memory and processing constraints. I’m researching chunked processing to enable batch operations safely.

## 6. Limited Error Messaging

Sometimes the site just says “Something went wrong.” That’s not helpful. I’m improving error messages to give you specific guidance (e.g., “File too large – max 50 MB” or “Unsupported format – try saving as PNG”).

## 7. No User Accounts or Favorites

If you frequently use the same tools, you have to search or navigate each time. I’m considering adding optional local‑storage based “favorites” – no account required – to remember your preferred tools.

## How You Can Help

- **Report bugs**: Use the [contact page](/support/contact) to describe the issue (include your browser and device).
- **Suggest improvements**: If a tool is missing a feature, let me know.
- **Be patient**: I’m a solo developer. Fixes take time, but I prioritize critical bugs.

## The Bottom Line

MetisTools is a work in progress. I release updates frequently (usually weekly). Your patience and feedback are what make this project better.

Thank you for understanding.