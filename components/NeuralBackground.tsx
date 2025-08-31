'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  connections: number[];
}

export default function NeuralBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    
    // Adjust number of nodes based on screen size
    const isMobile = width < 768;
    const nodeCount = isMobile ? 10 : 15;
    
    // Create nodes with better distribution
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
      // Create a grid-like distribution with some randomness
      const gridSize = Math.ceil(Math.sqrt(nodeCount));
      const cellWidth = width / gridSize;
      const cellHeight = height / gridSize;
      
      const gridX = i % gridSize;
      const gridY = Math.floor(i / gridSize);
      
      // Add randomness within the cell
      const x = (gridX * cellWidth) + (Math.random() * cellWidth * 0.8 + cellWidth * 0.1);
      const y = (gridY * cellHeight) + (Math.random() * cellHeight * 0.8 + cellHeight * 0.1);
      
      return {
        x,
        y,
        connections: []
      };
    });
    
    // Create connections (each node connects to 2-3 closest nodes)
    nodes.forEach((node, i) => {
      const distances = nodes
        .map((otherNode, index) => ({
          index,
          distance: Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + 
            Math.pow(node.y - otherNode.y, 2)
          )
        }))
        .filter(d => d.index !== i)
        .sort((a, b) => a.distance - b.distance);
      
      const connectionCount = Math.floor(Math.random() * 2) + 2; // 2-3 connections
      node.connections = distances
        .slice(0, connectionCount)
        .map(d => d.index);
    });
    
    // Create SVG elements
    svg.innerHTML = '';
    
    // Add paths (connections)
    nodes.forEach((node, i) => {
      node.connections.forEach(connectionIndex => {
        const targetNode = nodes[connectionIndex];
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        path.setAttribute('d', `M ${node.x} ${node.y} L ${targetNode.x} ${targetNode.y}`);
        path.setAttribute('stroke', '#7303c0');
        // Adjust stroke width based on screen width
        const strokeWidth = width < 768 ? '2' : '1.5';
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('fill', 'none');
        path.setAttribute('style', `
          stroke-dasharray: 1000;
          animation: pathFlow 4s infinite;
          filter: drop-shadow(0 0 ${width < 768 ? '3' : '2'}px rgba(115, 3, 192, 0.5));
        `);
        
        svg.appendChild(path);
      });
    });
    
    // Add nodes
    nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      
      circle.setAttribute('cx', node.x.toString());
      circle.setAttribute('cy', node.y.toString());
      // Adjust node size based on screen width
      const nodeRadius = width < 768 ? '4' : '3';
      circle.setAttribute('r', nodeRadius);
      circle.setAttribute('fill', '#928dab');
      circle.setAttribute('style', `
        animation: nodeGlow 3s infinite, floatNodes 5s infinite;
        filter: drop-shadow(0 0 ${width < 768 ? '4' : '3'}px rgba(146, 141, 171, 0.6));
      `);
      
      svg.appendChild(circle);
    });
  }, []);
  
  return (
    <div className="absolute inset-0 w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full opacity-30 md:opacity-40"
        style={{ 
          filter: 'blur(0.5px)',
          transform: 'scale(1.1)',  // Slight scale to ensure edges are covered
          transformOrigin: 'center'
        }}
      />
    </div>
  );
}
