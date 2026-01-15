# Changelog

All notable changes to the Intellectual Network Map project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-15

### Added

- Initial release of interactive network visualization
- 8 intellectual problem domains (Consciousness, Language, Violence, Social Structure, Aesthetic Experience, Self/Subject, Temporality, Place/Space)
- 15 weighted connections between problem domains
- 8 key bridge authors/works (Sloterdijk, Pynchon, Dennett, Collins, Foucault, Wallace, Žižek, Didion)
- Interactive HTML visualization with Plotly
- Node sizing based on reading volume
- Connection strength visualization through line thickness
- Hover tooltips for problem nodes showing book count and average rating

### Data

- `problem_categories.json` with complete problem taxonomy, connections, and bridge authors
- `book_metadata.json` with reading statistics and patterns from 452 books
- Comprehensive documentation in `goodreads_intellectual_map.md`

### Code Structure

- Modular Python codebase with separate concerns:
  - `create_network_viz.py` - Main visualization generator
  - `data_loader.py` - JSON data loading and validation utilities
  - `graph_builder.py` - NetworkX graph construction and analysis

### Documentation

- README with project overview and quick start guide
- Detailed intellectual map analysis document
- Inline code documentation with type hints

-----

## [Unreleased]

### Planned Features

- Timeline visualization of reading trajectory over time
- Sankey diagram showing flows between problem domains
- Filterable views (fiction vs non-fiction, rating thresholds)
- “Next reads” layer showing recommended books as different node type
- Extended bridge author collection (Bolaño, Gaddis, Price, etc.)
- Click-through functionality to view book lists per problem
- Export functionality for network data
- Jupyter notebook with exploratory analysis

### Potential Enhancements

- Automated Goodreads CSV import and categorization
- Genre mixing visualization (philosophy-as-fiction, crime-as-sociology)
- Temporal animation of how reading interests evolved
- Citation network between books
- Integration with other reading platforms (LibraryThing, StoryGraph)

-----

## Version History

**[1.0.0]** - 2026-01-15 - Initial public release