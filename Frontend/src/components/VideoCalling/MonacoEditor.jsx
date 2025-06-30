/* eslint-disable react/prop-types */
import  { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { languageOptions, codeSnippets, langFiles } from "./constants.js";
import axios from "axios";
import Split from "react-split";
import { Sun, Moon } from "lucide-react";
import { io } from 'socket.io-client';


const socket = io(import.meta.env.VITE_PORT);


const executeCode = async (language, sourceCode, onCase) => {
    try {
        const response = await axios.post(
            "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
            {
              language: language,
              files: [
                {
                  name: `index.${langFiles[language]}`,
                  content: sourceCode,
                },
              ],
              stdin: onCase,
            },
            {
              headers: {
                "x-rapidapi-key": import.meta.env.VITE_RAPID_API,
                "x-rapidapi-host": import.meta.env.VITE_RAPID_API_HOST,
                "Content-Type": "application/json",
              },
            }
          );
          return response.data;
        
    } catch (error) {
        console.error("Error in running code:", error);
    return { error: "Execution failed!" };
    }
};


function MonacoEditor(props){
    const editorRef = useRef();
  const [language, setLanguage] = useState("java");
  const [value, setValue] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [testcase, setCase] = useState([]);
  const [onCase, setOnCase] = useState("");
  const [status, setStatus] = useState("");
  const [theme, setTheme] = useState("vs-dark");


useEffect(() => {
    if (props.onCodeChange) {
      props.onCodeChange(value);
    }
  }, [value, props]);

  useEffect(() => {
    if (props.onOutputChange) {
      props.onOutputChange(output, status);
    }
  }, [output, status, props]);


  useEffect(() => {
    socket.connect();
      socket.emit("join-room", {roomId:props.roomId, userId:props.userId });
      console.log("User joined room"); 
      socket.on('realtime-load-code',(code)=>{
        setValue(code);
      })
      return () => {
      socket.disconnect(); 
    };
  }, [props.roomId, props.userId]);

  
  useEffect(()=>{
    socket.on('load-code',(code) => {
      setValue(code);
    })
  },[])




  useEffect(() => {
  
    const savedLanguage = localStorage.getItem("selectedLanguage") || "java";
    setLanguage(savedLanguage);

    const savedTestCases = JSON.parse(localStorage.getItem(`testcase-${language}`)) || [];
    setCase(savedTestCases);
    
  }, [language]);



  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "vs-dark" ? "vs" : "vs-dark"));
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem("selectedLanguage", newLanguage);

  };

  const handleOutputChange = (e) => setOnCase(e.target.value);

  const handleCodeChange = (newValue) => {
    // setValue(newValue);
    console.log(props.roomId);
    socket.emit('code-changed', { roomId: props.roomId, code: newValue });
    
  };

  const handleAddCase = () => {
    const ans = window.prompt("Enter the input for the testcase");
    if (ans !== null) {
      setCase((prevTestcase) => {
        const updatedTestcase = [...prevTestcase, ans];
        localStorage.setItem(`testcase-${language}`, JSON.stringify(updatedTestcase));
        return updatedTestcase;
      });
    }
  };

  const handleRunCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) {
      alert("Please enter some code!");
      return;
    }
    setLoading(true);
    setOutput("Running...");
    try {
      const res = await executeCode(language, sourceCode, onCase);
      setLoading(false);
      setOutput(res.stdout || res.stderr || res.error || "No output received.");
      setStatus(res.stdout !== "" && res.status === "success" ? "Accepted" : "Wrong Answer");
    } catch (error) {
      setLoading(false);
      setOutput("Error running code.",error);
    }
  };

  return (
    <div
      className={`flex flex-col items-center border-4 border-black justify-center w-full h-screen p-4 ${
        theme === "vs-dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <Split
        className="flex flex-col w-full h-full border-2 border-black rounded-lg overflow-hidden"
        direction="vertical"
        sizes={[50, 50]}
        minSize={250}
      >
        <div
          className={`w-full h-full p-4 rounded-lg border-2 border-black ${
            theme === "vs-dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <label className="mr-4 font-bold">Language:</label>
          <select
            className="p-2 border border-black rounded-lg bg-gray-800 text-white"
            value={language}
            onChange={handleLanguageChange}
          >
            {Object.keys(languageOptions).map((lang) => (
              <option key={lang} value={lang}>
                {lang} (v{languageOptions[lang]})
              </option>
            ))}
          </select>
          <button onClick={toggleTheme} className="ml-4 p-2 rounded-full bg-gray-700 text-white">
            {theme === "vs-dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Editor
            height="90%"
            width="100%"
            theme={theme}
            onMount={onMount}
            language={language}
            value={value}
            onChange={handleCodeChange}
          />
        </div>

        {/* Output Section */}
        <div
          className={`w-full h-full p-4 flex flex-col items-center rounded-lg border-t border-black ${
            theme === "vs-dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <div className="space-x-9">
            <span className="text-green-400 font-bold">{status}</span>
            <button
              className="px-4 py-2 mb-3 bg-gray-700 text-green-500 rounded-lg shadow"
              onClick={handleAddCase}
            >
              Add Case
            </button>
            <button
              className="mb-3 px-4 py-2 bg-gray-700 text-green-500 rounded-lg shadow"
              onClick={handleRunCode}
            >
              {loading ? "Running..." : "Run Code"}
            </button>
            <select
              id="case"
              className="w-32 p-2 border h-10 bg-gray-800 text-white rounded-lg"
              onChange={handleOutputChange}
            >
              {testcase.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div
            id="output"
            className={`w-full h-full p-3 rounded-lg overflow-auto border border-white ${
              theme === "vs-dark" ? "bg-gray-900 text-green-400" : "bg-white text-black"
            }`}
          >
            {output}
          </div>
        </div>
      </Split>
    </div>
  );
}

export default MonacoEditor;
