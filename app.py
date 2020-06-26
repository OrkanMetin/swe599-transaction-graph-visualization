from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow


# init app
app = Flask(__name__)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/graph'
app.config['SQLALCHEMY_DATABASE_URI'] = 'DATABASE_URL'
app.debug = True
db = SQLAlchemy(app)


# init  ma - Serialize / Deserialize Objects...
ma = Marshmallow(app)


# Graph Class/Model
class Graph(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=True)
    description = db.Column(db.String(200), nullable=True)
    date = db.Column(db.Date, nullable=True)
    nodes = db.Column(db.JSON, nullable=True)
    edges = db.Column(db.JSON, nullable=True)
    data = db.Column(db.JSON, nullable=True)
    options = db.Column(db.JSON, nullable=True)

    def __init__(self, name, description, date, nodes, edges, data, options):
        self.name = name
        self.description = description
        self.date = date
        self.nodes = nodes
        self.edges = edges
        self.data = data
        self.options = options


# graph schema
class GraphSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'description', 'date', 'nodes', 'edges', 'data', 'options')


# init schema
graph_schema = GraphSchema(strict=True)
graphs_schema = GraphSchema(many=True, strict=True)

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


# Get All Graphs
@app.route('/graph', methods=['GET'])
def get_graphs():
    all_graphs = Graph.query.all()
    result = graphs_schema.dump(all_graphs)
    return jsonify(result.data)


# Get Single Graph By ID
@app.route('/graph/id/<int:id>', methods=['GET'])
def get_graph(id):
    graph = Graph.query.get(id)
    return graph_schema.jsonify(graph)


# Create a Graph
@app.route('/post_graph', methods=['POST'])
def post_graph():
    name = request.json['name']
    description = request.json['description']
    date = request.json['date']
    nodes = request.json['nodes']
    edges = request.json['edges']
    data = request.json['data']
    options = request.json['options']

    new_graph = Graph(name, description, date, nodes, edges, data, options)

    db.session.add(new_graph)
    db.session.commit()

    return graph_schema.jsonify(new_graph)


# Update a Graph
@app.route('/graph/id/<int:id>', methods=['PUT'])
def update_graph(id):
    graph = Graph.query.get(id)

    name = request.json['name']
    description = request.json['description']
    date = request.json['date']
    nodes = request.json['nodes']
    edges = request.json['edges']
    data = request.json['data']
    options = request.json['options']

    graph.name = name
    graph.description = description
    graph.date = date
    graph.nodes = nodes
    graph.edges = edges
    graph.data = data
    graph.options = options

    db.session.commit()

    return graph_schema.jsonify(graph)


# Delete Single Graph By ID
@app.route('/graph/id/<int:id>', methods=['DELETE'])
def delete_graph(id):
    graph = Graph.query.get(id)
    db.session.delete(graph)
    db.session.commit()

    return graph_schema.jsonify(graph)


# run server
if __name__ == '__main__':
    app.run(debug=True)
