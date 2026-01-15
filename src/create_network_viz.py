“””
Intellectual Network Map Generator

Creates an interactive network visualization of intellectual problems,
their connections, and key bridge authors from reading collection.
“””

import networkx as nx
import plotly.graph_objects as go
import json
from pathlib import Path

def load_data(data_dir=’../data/processed’):
“”“Load problem categories and metadata from JSON files.”””
data_path = Path(**file**).parent.parent / ‘data’ / ‘processed’

```
with open(data_path / 'problem_categories.json', 'r') as f:
    categories = json.load(f)

return categories
```

def build_graph(categories):
“”“Build NetworkX graph from problem categories data.”””
G = nx.Graph()

```
# Add problem nodes
for problem, data in categories['problems'].items():
    G.add_node(
        problem,
        node_type='problem',
        books=data['estimated_books'],
        avg_rating=data['avg_rating'],
        color=get_problem_color(problem)
    )

# Add connections between problems
for connection in categories['connections']:
    G.add_edge(
        connection['from'],
        connection['to'],
        weight=connection['strength']
    )

# Add key bridge authors
for author, data in categories['key_bridge_authors'].items():
    G.add_node(
        author,
        node_type='work',
        size=data['significance'],
        color='#CCCCCC'
    )
    # Connect to primary problem
    G.add_edge(author, data['primary_problem'], weight=3)
    # Connect to bridged problems
    for bridge in data['bridges']:
        G.add_edge(author, bridge, weight=1)

return G
```

def get_problem_color(problem):
“”“Return color for each intellectual problem.”””
colors = {
‘Consciousness’: ‘#FF6B6B’,
‘Language’: ‘#4ECDC4’,
‘Violence’: ‘#FF8C42’,
‘Social Structure’: ‘#95E1D3’,
‘Aesthetic Experience’: ‘#F38181’,
‘Self/Subject’: ‘#AA96DA’,
‘Temporality’: ‘#FCBAD3’,
‘Place/Space’: ‘#A8D8EA’
}
return colors.get(problem, ‘#CCCCCC’)

def create_edge_traces(G, pos):
“”“Create edge traces for the network visualization.”””
edge_traces = []
for edge in G.edges(data=True):
x0, y0 = pos[edge[0]]
x1, y1 = pos[edge[1]]
weight = edge[2].get(‘weight’, 1)

```
    edge_traces.append(go.Scatter(
        x=[x0, x1, None],
        y=[y0, y1, None],
        mode='lines',
        line=dict(width=weight*0.5, color='rgba(125,125,125,0.3)'),
        hoverinfo='none',
        showlegend=False
    ))

return edge_traces
```

def create_problem_node_trace(G, pos):
“”“Create node trace for intellectual problems.”””
nodes_x, nodes_y, texts, colors, sizes = [], [], [], [], []

```
for node in G.nodes():
    if G.nodes[node].get('node_type') == 'problem':
        x, y = pos[node]
        nodes_x.append(x)
        nodes_y.append(y)
        
        books = G.nodes[node]['books']
        rating = G.nodes[node]['avg_rating']
        texts.append(f"{node}<br>{books} books<br>Avg rating: {rating}")
        colors.append(G.nodes[node]['color'])
        sizes.append(books * 2)

return go.Scatter(
    x=nodes_x,
    y=nodes_y,
    mode='markers+text',
    text=[n for n in G.nodes() if G.nodes[n].get('node_type') == 'problem'],
    textposition='top center',
    textfont=dict(size=12, color='black', family='Arial Black'),
    hovertext=texts,
    hoverinfo='text',
    marker=dict(
        size=sizes,
        color=colors,
        line=dict(width=2, color='white')
    ),
    name='Intellectual Problems'
)
```

def create_work_node_trace(G, pos):
“”“Create node trace for key authors/works.”””
nodes_x, nodes_y, texts, sizes = [], [], [], []

```
for node in G.nodes():
    if G.nodes[node].get('node_type') == 'work':
        x, y = pos[node]
        nodes_x.append(x)
        nodes_y.append(y)
        texts.append(node)
        sizes.append(G.nodes[node]['size'] * 3)

return go.Scatter(
    x=nodes_x,
    y=nodes_y,
    mode='markers+text',
    text=[n for n in G.nodes() if G.nodes[n].get('node_type') == 'work'],
    textposition='bottom center',
    textfont=dict(size=9, color='#666666'),
    hovertext=texts,
    hoverinfo='text',
    marker=dict(
        size=sizes,
        color='#E0E0E0',
        line=dict(width=1, color='#999999')
    ),
    name='Key Authors/Works'
)
```

def create_visualization(G, output_path=’../visualizations/intellectual_network_map.html’):
“”“Create and save the interactive network visualization.”””
# Calculate layout
pos = nx.spring_layout(G, k=2, iterations=50, seed=42)

```
# Create traces
edge_traces = create_edge_traces(G, pos)
problem_trace = create_problem_node_trace(G, pos)
work_trace = create_work_node_trace(G, pos)

# Create figure
fig = go.Figure(data=edge_traces + [problem_trace, work_trace])

# Update layout
fig.update_layout(
    title=dict(
        text='Intellectual Network Map: Problems, Connections & Key Works',
        x=0.5,
        xanchor='center',
        font=dict(size=24, color='#333333')
    ),
    showlegend=True,
    hovermode='closest',
    margin=dict(b=20, l=5, r=5, t=80),
    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
    plot_bgcolor='#FAFAFA',
    height=800,
    font=dict(family='Arial, sans-serif')
)

# Add annotation
fig.add_annotation(
    text="Node size = number of books read | Line thickness = connection strength",
    xref="paper", yref="paper",
    x=0.5, y=-0.05,
    showarrow=False,
    font=dict(size=10, color='#666666')
)

# Save to HTML
output_file = Path(__file__).parent.parent / 'visualizations' / 'intellectual_network_map.html'
output_file.parent.mkdir(exist_ok=True)
fig.write_html(str(output_file))

return str(output_file)
```

def main():
“”“Main function to generate network visualization.”””
print(“Loading data…”)
categories = load_data()

```
print("Building graph...")
G = build_graph(categories)

print("Creating visualization...")
output_path = create_visualization(G)

print(f"\n✓ Network visualization created successfully!")
print(f"  Nodes: {len([n for n in G.nodes() if G.nodes[n].get('node_type') == 'problem'])} intellectual problems")
print(f"  Bridge authors: {len([n for n in G.nodes() if G.nodes[n].get('node_type') == 'work'])}")
print(f"  Connections: {len(G.edges())}")
print(f"  Saved to: {output_path}")
```

if **name** == ‘**main**’:
main()
