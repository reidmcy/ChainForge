import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import useStore from './store';

// CodeMirror text editor
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
// import { okaidia } from '@uiw/codemirror-theme-okaidia'; // dark theme
import { noctisLilac } from '@uiw/codemirror-theme-noctis-lilac'; // light theme

const EvaluatorNode = ({ data, id }) => {

  const inputEdgesForNode = useStore((state) => state.inputEdgesForNode);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const [codeText, setCodeText] = useState(data.code);
  
  const handleMouseEnter = () => {
    setHovered(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
  };
  const handleClick = () => {
    setSelected(!selected);
  };

  const handleInputChange = (code) => {
    setCodeText(code);
  };

  const handleRunClick = (event) => {
    // Get the ids from the connected input nodes:
    const input_node_ids = inputEdgesForNode(id).map(e => e.source);

    if (input_node_ids.length === 0) {
        console.warn("No inputs for evaluator node.");
        return;
    }

    const response = fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({
            id: id,
            code: codeText,
            responses: input_node_ids,
        }),
    }).then(function(response) {
        return response.json();
    }).then(function(json) {
        console.log(json);
    });
  };
  
  const borderStyle = selected
    ? '2px solid #222'
    : hovered
    ? '1px solid #222'
    : '1px solid #999';

  return (
    <div 
      className="evaluator-node"
      style={{ border: borderStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="node-header">
        Evaluator Node
        <button className="AmitSahoo45-button-3" onClick={handleRunClick}><div className="play-button"></div></button>
      </div>
      <Handle
          type="target"
          position="left"
          id="responseBatch"
          style={{ top: '50%', background: '#555' }}
        />
      <Handle
          type="source"
          position="right"
          id="output"
          style={{ top: '50%', background: '#555' }}
        />
      <div className="core-mirror-field">
        <div className="code-mirror-field-header">Function to map over each <span className="code-style">response</span>:</div>
        <CodeMirror
          value={data.code}
          height="200px"
          width="400px"
          theme={noctisLilac}
          onChange={handleInputChange}
          extensions={[javascript({ jsx: true })]}
        />
      </div>
      <hr/>
      <div>
        <div className="code-mirror-field-header">Method to reduce across <span className="code-style">responses</span>:</div>
        <select name="method" id="method">
            <option value="none">None</option>
            <option value="avg">Average across</option>
            <option value="sum">Sum over</option>
            <option value="median">Median for</option>
            <option value="custom">Custom reducer</option>
        </select>
        <span> </span>
        <input type="text" id="method-val" name="method-val"  />
        {/* <label for="avg">Average over: </label>
        <select name="avg" id="avg">
            <option value="mod">mod</option>
            <option value="paragraph">paragraph</option>
            <option value="_none">N/A</option>
        </select> */}
      </div>
    </div>
  );
};

export default EvaluatorNode;