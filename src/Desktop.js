import {
    useState,
    useEffect,
} from 'react';

import {
    Upload,
    Row,
} from 'antd'

import {
    InboxOutlined,
} from '@ant-design/icons'

const Desktop = () => {
    /*
    useEffect(() => {
        const jsCode = `
  function add(a, b, c) {
    return a + b;
  }

  const multiply = function(x, y, z) {
    return x * y;
  };

  const divide = (a, b, c, d) => {
    return a / b;
  };
`;

        const functionDeclarationRegex = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{/g;
        const functionExpressionRegex = /([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{/g;
        const arrowFunctionRegex = /([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{/g;

        const extractFunctions = (code, regex) => {
            const matches = [];
            let match;
            while ((match = regex.exec(code)) !== null) {
                matches.push({ name: match[1], params: match[2] });
            }
            return matches;
        };

        const declarations = extractFunctions(jsCode, functionDeclarationRegex);
        const expressions = extractFunctions(jsCode, functionExpressionRegex);
        const arrows = extractFunctions(jsCode, arrowFunctionRegex);

        console.log("Function Declarations: ", declarations);
        console.log("Function Expressions: ", expressions);
        console.log("Arrow Functions: ", arrows);
    }, [])
    */

    const importRegex = /import\s+(?:(?<default>\w+)\s*,?\s*)?(?:\{(?<named>[\w\s,]*)\}\s*,?\s*)?(?:\*\s+as\s+(?<namespace>\w+)\s*,?\s*)?from\s+['"`](?<module>.+?)['"`];?/g;

    const extractImportElements = (code) => {
        const matches = [];
        let match;
      
        while ((match = importRegex.exec(code)) !== null) {
          const importDetails = {
            module: match.groups.module || '',
            defaultImport: match.groups.default || '',
            namedImports: match.groups.named ? match.groups.named.split(',').map(i => i.trim()).filter(Boolean) : [],
            namespaceImport: match.groups.namespace || ''
          };
          matches.push(importDetails);
        }
      
        return matches;
      };

    // Combine the regex for function declarations, function expressions, and arrow functions
    const combinedFunctionRegex = /(function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*function\s*\(([^)]*)\)\s*\{)|(([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{)/g;

    const extractAllFunctions = (file_name, code, regex) => {
        const matches = [];
        let match;

        while ((match = regex.exec(code)) !== null) {
            if (match[2]) {
                // Function Declaration
                matches.push({ type: file_name, name: match[2], params: match[3] });
            } else if (match[5]) {
                // Function Expression
                matches.push({ type: file_name, name: match[5], params: match[6] });
            } else if (match[8]) {
                // Arrow Function
                matches.push({ type: file_name, name: match[8], params: match[9] });
            }
        }

        return matches;
    };


    useEffect(() => {
        const jsCode = `
        function add(a, b, c, d, e, f, g) {
          return a + b;
        }
      
        const multiply = function(x, y, z, w) {
          return x * y;
        };
      
        const divide = (a, b, c, d) => {
          return a / b;
        };
      `;



        // const allFunctions = extractAllFunctions(jsCode, combinedFunctionRegex);
        // console.log(allFunctions);

    }, [])

    return (
        <>
            <Row justify='center' align='middle' style={{ 'height': '80vh' }}>
                <Upload.Dragger directory={true} showUploadList={false} onChange={(info) => {
                    // console.log(info.file.originFileObj)
                    const file = info.file.originFileObj

                    // console.log(file.name)
                    const reader = new FileReader()

                    reader.onload = (e) => {
                        //console.log(e.target.result)
                        // console.log(e)
                        if (!file.name.includes('.js')) {
                            return
                        }
                        console.log(file.name)
                        console.log(extractImportElements(e.target.result))
                        console.log(extractAllFunctions(file.name, e.target.result, combinedFunctionRegex))
                    }

                    reader.readAsText(file)
                }}>
                    <div style={{ 'width': '400px' }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag folder or file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Easily upload your PDF by clicking to select files from your device or dragging a PDF file and dropping into the box here.
                        </p>
                    </div>
                </Upload.Dragger>
            </Row>
        </>
    );
};

export default Desktop;
