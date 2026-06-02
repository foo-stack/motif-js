---
'@usemotif/migrate': patch
---

Fix Markdown fence parsing in the codemod scoper. The fence matcher only understood exactly-three-character fences, so a 4+-backtick block (which CommonMark allows precisely so it can contain a ``` example) — or a longer-tilde fence — matched only up to the first inner triple fence, leaving the real code unrewritten and mis-bucketing the trailing prose. A length-aware line scanner now matches an opener of N≥3 fence chars and a close of at least N of the same char.
