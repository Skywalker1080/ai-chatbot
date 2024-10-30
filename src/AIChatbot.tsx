import React, { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Send } from 'lucide-react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { ScrollArea } from "./components/ui/scroll-area"

export default function Component() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' }
  ])
  const [input, setInput] = useState('')

  const predefinedPrompts = [
    "Analyze the current momentum and volatility of SOLUSD",
    "Generate a risk-adjusted performance report for $DOGE",
    "Generate a forecast for $BTC using Monte Carlo simulations",
    "Explain Ratios in Finance."
  ]

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }]);

      try {
        const response = await axios.post('https://api.together.xyz/v1/chat/completions', {
          messages: [{ role: 'user', content: input }],
          model: 'meta-llama/Llama-Vision-Free',
          max_tokens: 700,
          temperature: 0.7,
          top_p: 0.7,
          top_k: 50,
          repetition_penalty: 1,
          stop: ["<|eot_id|>", "<|eom_id|>"],
          stream: false
        }, {
          headers: {
            'Authorization': `Bearer ca3c3c550592880329347095e423692b3142282f1c1050fefc71015000c7dec8`
          }
        });

        const aiResponse = response.data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
        setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: aiResponse }]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: 'Error fetching response from AI.' }]);
      }

      setInput('');
    }
  }

  const handlePredefinedPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <header className="py-8 px-4 sm:px-6 lg:px-8 bg-white shadow">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center leading-tight text-gray-900">
          Prism LLM
        </h1>
        <p className="mt-4 text-xl text-center text-gray-600">
          Your AI-powered financial assistant & Data Driven insights advisor
        </p>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col py-8">
        <ScrollArea className="flex-grow mb-4 border border-gray-200 rounded-lg p-4 bg-white shadow">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </span>
            </div>
          ))}
        </ScrollArea>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {predefinedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handlePredefinedPrompt(prompt)}
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow bg-white text-gray-900 border-gray-300 focus:border-blue-500"
          />
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-600 bg-white border-t border-gray-200">
        © 2024 AI Chatbot. All rights reserved.
      </footer>
    </div>
  )
}