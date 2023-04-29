import {basicSetup, EditorView} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import {transpile} from "./transpiler";

let g_codeEditor = new EditorView({
    extensions: [basicSetup, javascript()],
    parent: document.querySelector("#divCodeMirror")
})

export function main() {
    setupEditor();
    window.onkeydown = onKeyDown;
    window.onbeforeunload = onBeforeUnload;
}


async function setupEditor() {
    let text = await (await fetch("../examples/basic.bs")).text();
    g_codeEditor.dispatch({
        changes: {from: 0, to: g_codeEditor.state.doc.length, insert: text}
    })
}

function onBeforeUnload() {
    return "Your work will be lost if you close the page."
}


function onKeyDown(ev) {
    if (!ev.ctrlKey)
        return

    if (ev.key == "Enter") {
        ev.preventDefault()
        run()
    }
}


export function run() {
    let mode = document.getElementById("selectMode").value;
    let isRun = mode==="1";

    let format = document.getElementById("selectFormat").value;

    console.log(`Running: run: ${isRun}, format: ${format}`);

    let divText = document.getElementById("divOutputText");
    let code = g_codeEditor.state.doc.toString();
    let evalCode = transpile(code, format);
    let output = "";
    divText.style.color = "";
    if (isRun) {
        console.log = function (args) {
            output += args + "\n";
        }

        try {
            let r,a;
            eval(evalCode);
        } catch (ex2) {
            divText.style.color = "red";
            output = `${ex2}`;
        }
    } else {
        output = evalCode;
    }

    divText.innerHTML = output;
    divText.style.whiteSpace = "no-wrap"
}