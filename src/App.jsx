import { useState } from "react";

import "./App.css";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import moment from "moment";


function App() {
  const model = new OpenAI({
    openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    temperature: 0,
  });

  const [inputValue, setInputValue] = useState("");
  const [ai, setAi] = useState("");
  const now = moment();
  const time = now.format("HH:mm:ss");
  const memory = new BufferMemory();
  const chain = new ConversationChain({ llm: model, memory: memory });
  let messages = JSON.parse(localStorage.getItem("list")) || [];

  //  let vals = JSON.parse(localStorage.getItem("listai"))

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const val = await chain.call({ input: inputValue });
    messages.push({ content: inputValue, time });
   //store user input locally
    let valstr = JSON.stringify(messages);
    localStorage.setItem("list", valstr);
   //store ai output locally

    messages.push({ content: val.response, time });
    let aistr = JSON.stringify(messages);
    localStorage.setItem("list", aistr);
    setAi(val.response);
    // clear input field
    setInputValue("");
  };

  return (
    <div className="main">
      <div className="chat">
        {!messages ? (
          <div>No previous chats</div>
        ) : (
          messages?.map((mess, index) => {
            return (
              <div className="sender" key={index}>
                <div className="message">{mess.content}!</div>
                <div className="time">{mess.time}</div>
              </div>
            );
          })
        )}

        <div className="input">
          <input
            type="text"
            className="inputf"
            placeholder="Enter your input"
            onChange={handleChange}
            value={inputValue}
          />
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
