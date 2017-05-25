var builder = require('xmlbuilder');

var nodeR = 'nr';
var nodeG = 'ng';
var nodeB = 'nb';
var nodeSize = 'size';

var edgeR = 'er';
var edgeG = 'eg';
var edgeB = 'eb';
var edgeSize = 'weight';

var sizeAndWeightType = 'double';
var rgbType = 'int';

function ToGraphML(jsonGraph, directed) {
  this.directed = directed;
  this.jsonGraph = jsonGraph;
  this.graphml;
  this.graphMLObj = {};
  this.graphNodes = [];
  this.graphEdges = [];

  this.addGraphMLRoot = function() {
    this.graphMLObj['graphml'] = {
      '@xmlns' : "http://graphml.graphdrawing.org/xmlns",
      '@xmlns:xsi' : "http://www.w3.org/2001/XMLSchema-instance",
      '@xsi:schemaLocation' : "http://graphml.graphdrawing.org/xmlns http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd"
    }
  }

  this.addKeysAndGraphElem = function() {
    this.graphMLObj.graphml['key'] = [
      {'@id': nodeR, '@for': 'node', '@attr.name': 'r', '@attr.type': rgbType},
      {'@id': nodeG, '@for': 'node', '@attr.name': 'g', '@attr.type': rgbType},
      {'@id': nodeB, '@for': 'node', '@attr.name': 'b', '@attr.type': rgbType},
      {'@id': edgeR, '@for': 'edge', '@attr.name': 'r', '@attr.type': rgbType},
      {'@id': edgeG, '@for': 'edge', '@attr.name': 'g', '@attr.type': rgbType},
      {'@id': edgeB, '@for': 'edge', '@attr.name': 'b', '@attr.type': rgbType},
      {'@id': nodeSize, '@for': 'node', '@attr.name': 'size', '@attr.type': sizeAndWeightType},
      {'@id': edgeSize, '@for': 'edge', '@attr.name': 'weight', '@attr.type': sizeAndWeightType}
    ]
    if (this.directed) {
      this.graphMLObj.graphml['graph'] = {
        '@id' : 'G', '@edgedefault' : 'directed'
      }
    } else {
      this.graphMLObj.graphml['graph'] = {
        '@id' : 'G', '@edgedefault' : 'undirected'
      }
    }
  }

  this.addNode = function(node) {
    var r = hexToR(node.color);
    var g = hexToG(node.color);
    var b = hexToB(node.color);

    this.graphNodes.push({
      '@id': node.id,
      'data': [
        {'@key': nodeR, '#text': r},
        {'@key': nodeG, '#text': g},
        {'@key': nodeB, '#text': b},
        {'@key': nodeSize, '#text': node.size}
      ]
    });
  }

  this.addEdge = function(edge) {
    var r = hexToR(edge.color);
    var g = hexToG(edge.color);
    var b = hexToB(edge.color);

    this.graphEdges.push({
      '@id': edge.id,
      '@source' : edge.source,
      '@target': edge.target,
      'data': [
        {'@key': edgeR, '#text': r},
        {'@key': edgeG, '#text': g},
        {'@key': edgeB, '#text': b},
        {'@key': edgeSize, '#text': edge.size}
      ]
    });
  }

  this.addGraphMLRoot();
  this.addKeysAndGraphElem();

  for (var i = 0; i < this.jsonGraph.nodes.length; i++) {
    this.addNode(this.jsonGraph.nodes[i]);
  }

  this.graphMLObj.graphml.graph['node'] = this.graphNodes;

  for (var i = 0; i < this.jsonGraph.edges.length; i++) {
    this.addEdge(this.jsonGraph.edges[i]);
  }

  this.graphMLObj.graphml.graph['edge'] = this.graphEdges;

}

ToGraphML.prototype.create = function() {
  console.log(this.graphMLObj);
  this.graphml = (builder.create(this.graphMLObj, {encoding: 'UTF-8'})).end({pretty: true});
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

module.exports = ToGraphML;
