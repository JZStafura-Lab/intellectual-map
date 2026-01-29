# Intellectual Network Map

> Interactive visualization of 450+ books organized by core intellectual problems rather than traditional academic disciplines

**[View Live Project →](https://jzstafura.github.io/intellectual-map/)**

## Overview

This project maps a personal reading collection to reveal patterns of intellectual inquiry across eight fundamental problem domains: Consciousness, Language, Violence, Social Structure, Aesthetic Experience, Self/Subject, Temporality, and Place/Space.

Rather than organizing by genre or discipline, books are categorized by the core questions they address, revealing which domains are well-covered, where gaps exist, and which authors serve as bridges between different modes of thinking.

## Features

### Interactive Landing Page
- **8 Problem Domains** - Organized by fundamental questions (consciousness, violence, social structure, etc.)
- **Network Statistics** - 450+ books, 8 domains, 14 key connections
- **Domain Overview** - Visual cards showing each intellectual problem area

### Wikipedia Author Cards ✨ *New*
- **Clickable Bridge Authors** - Click any of 8 bridge authors to open detailed biographical modals
- **Wikipedia Integration** - Automatic biography fetching via Wikipedia REST API
- **Smart Caching** - sessionStorage prevents redundant API calls
- **Related Authors** - Algorithm finds connections based on shared problem domains
- **Dark Elegant Design** - Smooth animations and mobile-responsive layout

### Network Visualization
- **Interactive Graph** - Zoom, pan, and hover for details
- **Connection Strengths** - Edge weights show relationships between domains
- **Bridge Authors** - Key thinkers who span multiple intellectual territories
- **Reading Volume** - Node sizing based on books per domain

## Technology Stack

**Frontend:**
- Vanilla JavaScript (no frameworks)
- CSS Grid & Flexbox
- Wikipedia REST API
- sessionStorage for caching

**Visualization:**
- Python (NetworkX, Plotly)
- Interactive HTML/CSS/JS

**Data:**
- JSON-based taxonomy
- 450+ books with metadata
- 8 problem categories with bridge authors

## Project Structure

```
intellectual-map/
├── index.html              # Landing page with author cards
├── favicon.svg             # Network node favicon
├── css/
│   └── author-cards.css    # Modal and link styling
├── js/
│   └── author-cards.js     # Wikipedia integration & modal logic
├── data/
│   ├── authors.json        # Wikipedia metadata for 8 bridge authors
│   └── processed/
│       ├── book_metadata.json
│       └── problem_categories.json
├── src/
│   └── create_network_viz.py
├── notebooks/
│   └── exploratory_analysis.ipynb
└── visualizations/
    └── intellectual_network_map.html
```

## Bridge Authors

The project identifies 8 key thinkers who bridge multiple intellectual domains:

- **Peter Sloterdijk** - Place/Space → Social Structure, Self/Subject
- **Michel Foucault** - Social Structure → Self/Subject, Place/Space
- **Thomas Pynchon** - Aesthetic Experience → Language, Social Structure, Temporality
- **Daniel Dennett** - Consciousness → Language, Self/Subject
- **David Foster Wallace** - Aesthetic Experience → Self/Subject, Language
- **Joan Didion** - Aesthetic Experience → Place/Space, Self/Subject
- **Slavoj Žižek** - Self/Subject → Social Structure, Aesthetic Experience
- **Randall Collins** - Violence → Social Structure

## Local Development

### View Landing Page

```bash
# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/index.html
```

### Generate Network Visualization

```bash
# Install dependencies
pip install -r requirements.txt

# Run visualization script
python src/create_network_viz.py

# Open result
open visualizations/intellectual_network_map.html
```

### Explore Data

```bash
# Launch Jupyter notebook
jupyter notebook notebooks/exploratory_analysis.ipynb
```

## Data Structure

### Problem Categories
Each problem domain includes:
- **Description** - Core questions addressed
- **Key Concepts** - Central ideas and frameworks
- **Representative Books** - Top-rated works (with ratings)
- **Bridge Authors** - Thinkers connecting to other domains
- **Connections** - Links to related problem areas with strength scores

### Author Metadata
Bridge authors include:
- Full name and Wikipedia links
- Primary problem domain
- Bridge domains (connections to other areas)
- Key works from the collection
- Significance scores

## Intellectual Problem Domains

1. **Consciousness** - Qualia, mind-body problem, phenomenology
2. **Language** - Meaning-making, cognitive linguistics, semantics
3. **Violence** - Micro-sociology, structural violence, conflict
4. **Social Structure** - Power, institutions, capitalism, networks
5. **Aesthetic Experience** - Art, beauty, horror, the sublime
6. **Self/Subject** - Subjectivity, identity, psychoanalysis
7. **Temporality** - Time, memory, historical consciousness
8. **Place/Space** - Phenomenology of place, spatial organization

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

**Joseph Z. Stafura**
- [GitHub](https://github.com/jzstafura)
- [Google Scholar](https://scholar.google.com/citations?user=F6LcYIoAAAAJ&hl=en)
- [LinkedIn](https://www.linkedin.com/in/jzstafura)

---

Built with Python, NetworkX, Plotly, and vanilla JavaScript • [View Project](https://jzstafura.github.io/intellectual-map/)
