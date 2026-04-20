# CLAUDE.md — intellectual-map

This file documents the codebase structure, development workflows, and conventions for AI assistants working on this repository.

## Project Overview

**intellectual-map** is a personal scholarly project that visualizes 450+ books as an interactive network graph organized by core intellectual *problem domains* rather than traditional academic disciplines. It is deployed as a static site on GitHub Pages.

**Eight problem domains**: Consciousness, Language, Violence, Social Structure, Aesthetic Experience, Self/Subject, Temporality, Place/Space

**Eight bridge authors** (scholars who connect multiple domains): Sloterdijk, Foucault, Pynchon, Dennett, Wallace, Didion, Žižek, Collins

**Architecture**: Two layers — a Python data-processing pipeline that generates a static Plotly HTML visualization, and a vanilla JS/HTML/CSS frontend with an interactive author-biography modal system.

---

## Repository Structure

```
intellectual-map/
├── index.html                        # Main landing page (21KB) — hero, domain cards, bridge author links
├── favicon.svg                       # Network node icon
├── LICENSE                           # MIT
├── README.md                         # Quick-start and feature overview
├── CHANGELOG.md                      # Semantic versioning history and roadmap
├── requirements.txt                  # Python deps: networkx, plotly, pandas
├── css/
│   └── author-cards.css             # Modal styles, animations, responsive layout
├── js/
│   └── author-cards.js              # IIFE module: Wikipedia API integration + modal logic
├── data/
│   ├── authors.json                  # Bridge author metadata (keys → name, Wikipedia ID)
│   ├── goodreads_library_export.csv  # SOURCE OF TRUTH for book data — do not edit
│   └── processed/
│       ├── problem_categories.json   # Core taxonomy: problems, connections, bridge authors
│       └── book_metadata.json        # 450+ books with reading stats and metadata
├── src/
│   ├── __init__.py                  # Package metadata (version='1.0.0')
│   ├── create_network_viz.py        # Main entry point — generates Plotly HTML
│   └── utils/
│       ├── __init__.py              # Public API: load_problem_categories, load_book_metadata, build_network_graph
│       ├── data_loader.py           # JSON loading and validation utilities
│       └── graph_builder.py         # NetworkX graph construction; defines PROBLEM_COLORS
├── notebooks/
│   └── exploratory_analysis.ipynb   # Jupyter notebook for data exploration
├── visualizations/
│   └── intellectual_network_map.html # Generated Plotly output (4.8MB) — do not edit directly
└── docs/
    └── goodreads_intellectual_map.md # Deep intellectual analysis and reading recommendations
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Data processing | Python 3, NetworkX ≥3.5, Plotly ≥6.5, Pandas ≥2.3 |
| Frontend | Vanilla JavaScript (IIFE pattern, no framework) |
| Styling | Plain CSS with custom properties (no preprocessor, no framework) |
| Fonts | Cormorant Garamond (serif), JetBrains Mono (monospace) — Google Fonts |
| External API | Wikipedia REST API (`/api/rest_v1/page/summary/{page_id}`) |
| Caching | `sessionStorage` for Wikipedia API responses |
| Deployment | GitHub Pages (static, no build step) |

---

## Development Workflows

### Frontend local development
```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

### Regenerate visualization (after data or Python changes)
```bash
pip install -r requirements.txt
python src/create_network_viz.py
# Output: visualizations/intellectual_network_map.html
```
Commit the regenerated HTML file alongside any data/script changes.

### Data exploration
```bash
jupyter notebook notebooks/exploratory_analysis.ipynb
```

### Deployment
Push to `main` → GitHub Pages auto-publishes. No build step needed for frontend-only changes.

---

## Architecture & Data Flow

```
goodreads_library_export.csv
        │ (manual categorization)
        ▼
data/processed/
  problem_categories.json   ──► create_network_viz.py ──► intellectual_network_map.html
  book_metadata.json        ──► (Python/NetworkX/Plotly)     (Plotly interactive graph)

index.html
  ├── loads css/author-cards.css
  ├── loads js/author-cards.js
  │     ├── fetch('./data/authors.json')
  │     ├── fetch('./data/processed/problem_categories.json')
  │     └── fetch Wikipedia API on author modal open
  └── iframe or link to visualizations/intellectual_network_map.html
```

**Key data relationships**:
- `problem_categories.json` drives both the Python visualization and the JS modal system — it is the central data file
- `PROBLEM_COLORS` in `graph_builder.py` must stay synchronized with CSS custom properties in `index.html`
- `data/authors.json` keys (e.g. `"Pynchon"`) must match `key_bridge_authors` keys in `problem_categories.json`

---

## Python Conventions

- **Naming**: `snake_case` for functions and variables; `PascalCase` for classes (none currently)
- **Docstrings**: Use Args/Returns format
- **Type hints**: Import from `typing` module (`Dict`, `Any`, `List`, `Optional`)
- **Path resolution**: Use `Path(__file__).parent` to resolve paths relative to the module, not the working directory
- **Public API**: Only export from `src/utils/__init__.py`; consumers import from `src.utils`, not from submodules

**Key Python functions**:
- `src/utils/data_loader.py`: `load_problem_categories()`, `load_book_metadata()`, `validate_categories()`, `get_bridge_authors()`
- `src/utils/graph_builder.py`: `build_network_graph()`, `get_node_stats()`, `get_central_problems()`, `get_bridge_strength()`
- `src/create_network_viz.py`: `load_data()`, `build_graph()`, `create_visualization()`, `main()`

---

## JavaScript Conventions

- **Module pattern**: IIFE (`(function() { ... })()`) for namespace isolation — no `import`/`export`
- **Naming**: `camelCase` for all functions — `loadAuthorsData()`, `openAuthorModal()`, `calculateRelatedAuthors()`
- **Element identification**: Use `data-author="Key"` attributes; never query by index or position
- **Event handling**: Event delegation on stable container elements, not on dynamically created nodes
- **External API pattern**: `fetch` → check `sessionStorage` cache first → store response → render
- **State**: `currentAuthor` variable tracks open modal; `problemCategories` caches loaded taxonomy
- **Modal visibility**: Toggled via `.active` class, never inline styles

---

## CSS Conventions

- **Naming**: BEM-inspired — `.author-modal`, `.author-modal-close`, `.author-modal-header`
- **Theming**: All colors and fonts via CSS custom properties (defined in `index.html` `:root`):
  ```css
  --color-bg: #fafaf8;
  --color-text: #2c2c2c;
  --color-accent: #8b7355;
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
  ```
- **Selectors**: Prefer single-class selectors; avoid deep nesting or chained selectors for specificity
- **Layout**: CSS Grid and Flexbox; no CSS framework
- **Do not hardcode colors** — always reference an existing or new custom property

---

## Data Conventions

- **Problem names**: Title Case with slashes — `"Self/Subject"`, `"Place/Space"`, `"Consciousness"`
- **Author keys**: Simple surnames — `"Pynchon"`, `"Dennett"`, `"Žižek"`
- **JSON structure**: Maximum 2 levels of nesting (no deeply nested objects)
- **Color palette**: Single source of truth is `PROBLEM_COLORS` dict in `src/utils/graph_builder.py`
- **Edge weights**: Primary author→domain connection = 3; bridge connections = 1; problem–problem = `strength` field value (1–5)

---

## What NOT To Do

- **Do not edit** `visualizations/intellectual_network_map.html` directly — it is fully generated by `create_network_viz.py`
- **Do not add** Node.js, npm, Webpack, or any JS build tooling — this is intentionally zero-build-step
- **Do not add** CSS frameworks (Bootstrap, Tailwind) or JS frameworks (React, Vue) — vanilla only
- **Do not hardcode** colors in CSS or HTML — use the custom property system
- **Do not edit** `data/goodreads_library_export.csv` — it is the source-of-truth export from Goodreads
- **Do not nest** JSON deeper than 2 levels when extending data files

---

## Testing

There are no automated tests. Manual verification:

| Change type | Verification |
|---|---|
| Python data/script changes | Run `python src/create_network_viz.py`; verify the output HTML opens without errors |
| Data file changes | Call `validate_categories()` from `data_loader.py` in a Python shell |
| Frontend JS/CSS changes | Run local server (`python3 -m http.server 8000`) and test in browser |
| Modal system changes | Test open/close, ESC key, backdrop click, Wikipedia bio loading, and related authors |

---

## Deployment Checklist

1. Frontend-only changes: commit and push to `main` — GitHub Pages auto-publishes
2. Data or Python changes: regenerate the visualization first (`python src/create_network_viz.py`), then commit both the data changes and the updated `visualizations/intellectual_network_map.html`
3. No build step, no CI pipeline — changes are live shortly after push to `main`
