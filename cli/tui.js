import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import BigText from 'ink-big-text';
import Spinner from 'ink-spinner';
import chalk from 'chalk';
import gradient from 'gradient-string';
import path from 'path';
import fs from 'fs';
import { compile } from '../core/compiler.js';

const e = React.createElement;
const neonPurple = gradient(['#7c3aed', '#a78bfa']);
const neonCyan = gradient(['#22d3ee', '#818cf8']);

// --- Components ---

const Window = ({ children, title }) => (
  e(Box, {
    flexDirection: 'column',
    borderStyle: 'round',
    borderColor: '#7c3aed',
    paddingX: 1,
    minHeight: 28
  },
    e(Box, { justifyContent: 'space-between', marginBottom: 1 },
      e(Text, { color: '#22d3ee', bold: true }, ` ◆ ${title} `),
      e(Text, { color: '#6b7280' }, 'v1.5_ARCHITECT')
    ),
    children
  )
);

const Sidebar = ({ activeTab }) => {
  const tabs = [
    { label: 'GENERATE', id: 'generate' },
    { label: 'BUILD', id: 'build' },
    { label: 'DEV_SERVER', id: 'dev' },
    { label: 'DEPLOY', id: 'deploy' },
    { label: 'SETTINGS', id: 'settings' }
  ];

  return (
    e(Box, { flexDirection: 'column', width: 22, borderStyle: 'single', borderColor: '#4b5563', paddingX: 1, marginRight: 1 },
      e(Box, { marginBottom: 1 }, e(Text, { color: '#a78bfa', bold: true }, 'COMMANDS')),
      tabs.map(tab => (
        e(Box, { key: tab.id, backgroundColor: activeTab === tab.id ? '#7c3aed' : 'transparent', paddingX: 1 },
          e(Text, { color: activeTab === tab.id ? 'white' : '#6b7280', bold: activeTab === tab.id },
            activeTab === tab.id ? `❯ ${tab.label}` : `  ${tab.label}`
          )
        )
      ))
    )
  );
};

const Console = ({ messages }) => (
  e(Box, {
    flexGrow: 1,
    flexDirection: 'column',
    paddingX: 2,
    paddingY: 1,
    borderStyle: 'single',
    borderColor: '#374151',
    backgroundColor: '#0a0a0f'
  },
    messages.map((msg, i) => (
      e(Box, { key: i, marginBottom: 1 },
        e(Text, { color: msg.type === 'ai' ? '#22d3ee' : '#e5e7eb' },
          msg.type === 'ai' ? '🤖 ' : '👤 '
        ),
        e(Text, { color: msg.type === 'ai' ? '#a78bfa' : 'white' }, msg.text)
      )
    ))
  )
);

const StatusBar = ({ status, stats }) => (
  e(Box, {
    justifyContent: 'space-between',
    paddingX: 1,
    marginTop: 1,
    borderStyle: 'single',
    borderColor: '#1f2937'
  },
    e(Box, null,
      e(Text, { color: '#6b7280' }, 'STATUS: '),
      e(Text, { color: status === 'IDLE' ? '#10b981' : '#f59e0b' }, status),
      e(Text, null, '  '),
      e(Spinner, { type: 'dots' })
    ),
    e(Box, null,
      e(Text, { color: '#22d3ee' }, `CPU ${stats.cpu}% `),
      e(Text, { color: '#7c3aed' }, ` RAM ${stats.mem}MB`)
    )
  )
);

// --- Main App ---

const MektaTUI = () => {
  const { exit } = useApp();
  const [activeTab, setActiveTab] = useState('generate');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Welcome to Mekta Intelligence. How can I help you architect your UI today?' }
  ]);
  const [status, setStatus] = useState('IDLE');
  const [stats, setStats] = useState({ cpu: 2, mem: 412 });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 10),
        mem: Math.floor(Math.random() * 50 + 400)
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useInput((input, key) => {
    if (key.escape) exit();
    if (key.tab) {
      const tabs = ['generate', 'build', 'dev', 'deploy', 'settings'];
      const nextIdx = (tabs.indexOf(activeTab) + 1) % tabs.length;
      setActiveTab(tabs[nextIdx]);
    }
  });

  const handleCommand = (text) => {
    const cmd = text.trim();
    if (cmd === '/exit') exit();

    setMessages(prev => [...prev, { type: 'user', text: cmd }]);
    setStatus('GENERATING');

    // Mock AI Response with typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai', text: `Analyzing "${cmd}"... I will scaffold the .mek components for you immediately.` }]);
      setStatus('IDLE');
    }, 1500);

    setInput('');
  };

  return (
    e(Box, { flexDirection: 'column', padding: 1 },
      e(BigText, { text: 'MEKTA', colors: ['#7c3aed', '#22d3ee'], font: 'block' }),

      e(Window, { title: 'MEKTA_ARCHITECT_CONSOLE' },
        e(Box, { flexGrow: 1 },
          e(Sidebar, { activeTab }),
          e(Box, { flexDirection: 'column', flexGrow: 1 },
            e(Console, { messages }),

            // Input Area
            e(Box, {
              marginTop: 1,
              paddingX: 1,
              borderStyle: 'single',
              borderColor: '#7c3aed',
              backgroundColor: '#0a0a0f'
            },
              e(Text, { color: '#22d3ee', bold: true }, ' ❯ '),
              e(TextInput, {
                value: input,
                onChange: setInput,
                onSubmit: handleCommand,
                placeholder: 'Describe your UI or enter /command...'
              })
            )
          )
        ),
        e(StatusBar, { status, stats })
      ),

      e(Box, { marginTop: 1, justifyContent: 'center' },
        e(Text, { color: '#6b7280' }, 'TAB to switch commands • ESC to exit • ENTER to execute')
      )
    )
  );
};

export function startTUI() {
  render(e(MektaTUI));
}
