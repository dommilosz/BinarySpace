const interpreterBinarySpaces = (code) => `
r='replaceAll'
eval(String.fromCharCode(...
(a+"").split\`;\`[1][r](' ',0)[r]('\t',1).split\`
\`
.map(a=>parseInt(a,2))
))
`.trim()

const interpreterBinarySpacesStr = (code) => `
r='replaceAll'
eval(String.fromCharCode(...
\`${code}\`
[r](' ',0)[r]('\t',1).split\`
\`
.map(a=>parseInt(a,2))
))
`.trim()

const interpreter = (code) => `
eval(String.fromCharCode(...
(a+"").split\`;\`[1].split\`
\`
.map(_=>_.length)
))
`.trim()

const interpreterStr = (code) => `
eval(String.fromCharCode(...\`${code}\`.split\`
\`.map(_=>_.length)))
`.trim()

function transpile(code, format) {
    if (format.includes("binary")) {
        code = Array.from(code).map(char => {
            char = char.charCodeAt(0);
            char = char.toString(2);
            while (char.length < 7) char = "0" + char
            char = char.replaceAll("0", " ").replaceAll("1", "\t");
            return char;
        }).join("\n")
        if (format.includes("func")) {
            code = `a=()=>{;${code};}`
            code += `\n${interpreterBinarySpaces()}`
        }

        if (format.includes("string")) {
            code = `\n${interpreterBinarySpacesStr(code)}`
        }
    }

    if (format.includes("normal")) {
        code = Array.from(code).map(char => {
            char = char.charCodeAt(0);
            char = " ".repeat(char)
            return char;
        }).join("\n")

        if (format.includes("func")) {
            code = `a=()=>{;${code};}`
            code += `\n${interpreter()}`
        }

        if (format.includes("string")) {
            code = `\n${interpreterStr(code)}`
        }
    }

    let chars = Array.from(code).reduce((prev, curr) => {
        if (curr.charCodeAt(0) > 32 && curr.charCodeAt(0) < 127) {
            return prev + 1;
        }
        return prev;
    }, 0)
    code += `\n//Characters: ${chars}, length: ${code.length}`
    return code;
}
