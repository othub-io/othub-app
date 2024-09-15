import React, { useState, useEffect } from 'react';
import '../../css/main.css'; // Import your CSS file for styling

const AssemblyLine = () => {
    const [items, setItems] = useState([]);
  
    useEffect(() => {
      const interval = setInterval(() => {
        // Generate a unique key for each item to avoid React warnings
        const newItemKey = Date.now();
        setItems(prevItems => [...prevItems, newItemKey]);
      }, 1000); // Add a new item every second
  
      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="assembly-line-container">
        <div className="assembly-line">
          {items.map((itemKey, index) => (
            <div key={itemKey} className="assembly-line-item" style={{ animationDelay: `${index * 0.2}s` }}>
              {/* You can put your item content here */}
            </div>
          ))}
        </div>
      </div>
    );
  };

export default AssemblyLine;
