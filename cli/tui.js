import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import BigText from 'ink-big-text';
import Spinner from 'ink-spinner';
import path from 'path';
import fs from 'fs';
import { compile } from '../core/compiler.js';
import { getTemplate } from '../templates/templates.js';
import { listAddons, installAddon } from '../addons/addons.js';

const e = React.createElement;

const SidebarItem = ({ label, isSelected }) => (
  e(Box, { paddingX: 1, backgroundColor: isSelected ? '#8A2BE2' : 'transparent' },
    e(Text, { color: isSelected ? 'white' : 'gray', bold: isSelected }, `${isSelected ? '❯ ' : '  '}${label}`)
  )
);

const MektaDashboard = () => {
  const { exit } = useApp();
  const [activeTab, setActiveTab] = useState('Overview'); // Overview, Build, AI, Addons, Docs, Settings
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState(['Mekta Architect OS v1.2.0 initialized.', 'System scanning for components...', 'Ready for Architect input.']);
  const [stats, setStats] = useState({ cpu: 0, mem: 212, net: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 8),
        mem: Math.floor(Math.random() * 150 + 400),
        net: Math.floor(Math.random() * 50)
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useInput((input, key) => {
    if (key.escape) exit();
  });

  const addLog = (msg) => setLogs(prev => [...prev.slice(-10), msg]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (trimmed === '/exit') exit();
    if (trimmed.startsWith('/tab ')) {
      const tab = trimmed.split(' ')[1];
      const found = tabs.find(t => t.toLowerCase() === tab.toLowerCase());
      if (found) {
        setActiveTab(found);
        addLog(`Switched view to ${found}.`);
      } else {
        addLog(`ERROR: Tab "${tab}" not found.`);
      }
    } else {
      addLog(`AI: Processing "${trimmed}"...`);
    }
    setInput('');
  };

  const tabs = ['Overview', 'Build', 'AI Builder', 'Addons', 'Documentation', 'Settings'];

  return (
    e(Box, { flexDirection: 'column', padding: 1, height: 28, borderStyle: 'double', borderColor: '#8A2BE2' },
      // Header
      e(Box, { justifyContent: 'space-between', marginBottom: 1, borderStyle: 'single', borderColor: '#333', paddingX: 1 },
        e(Box, null,
          e(Text, { color: '#8A2BE2', bold: true }, 'MEKTA'),
          e(Text, { color: 'gray' }, ' // ARCHITECT_v1.2 // PRO_CONSOLE')
        ),
        e(Box, null,
          e(Text, { color: 'cyan' }, `CPU: ${stats.cpu}%  `),
          e(Text, { color: 'magenta' }, `MEM: ${stats.mem}MB  `),
          e(Text, { color: 'yellow' }, `NET: ${stats.net}Mbps`)
        )
      ),

      // Main Layout
      e(Box, { flexGrow: 1 },
        // Sidebar
        e(Box, { flexDirection: 'column', width: 22, borderStyle: 'single', borderColor: '#444', marginRight: 1 },
          e(Box, { paddingX: 1, marginBottom: 1 }, e(Text, { color: '#9370DB', bold: true }, 'NAVIGATION')),
          tabs.map(t => e(SidebarItem, { key: t, label: t, isSelected: activeTab === t })),
          e(Box, { marginTop: 'auto', paddingX: 1 }, e(Text, { color: 'gray' }, 'Esc to quit'))
        ),

        // Main Workspace
        e(Box, { flexGrow: 1, flexDirection: 'column', paddingX: 1, borderStyle: 'round', borderColor: '#8A2BE2' },
          e(Box, { justifyContent: 'space-between', marginBottom: 1 },
            e(Text, { color: '#9370DB', bold: true, underline: true }, `[ WORKSPACE: ${activeTab.toUpperCase()} ]`),
            e(Text, { color: 'green' }, 'SYSTEM_OK')
          ),

          e(Box, { flexGrow: 1, flexDirection: 'column' },
            activeTab === 'Overview' && e(Box, { flexDirection: 'column' },
              e(Text, { color: 'white', bold: true }, 'Welcome, Architect.'),
              e(Text, { color: 'gray', marginTop: 1 }, 'Mekta is ready to compile high-fidelity Agentic UI components.'),
              e(Box, { marginTop: 2, flexDirection: 'column' },
                e(Text, { color: 'cyan' }, '• React Target: ACTIVE'),
                e(Text, { color: 'cyan' }, '• HTML Target: ACTIVE'),
                e(Text, { color: 'cyan' }, '• PHP Target: ACTIVE'),
                e(Text, { color: 'yellow', marginTop: 1 }, '• All Standard Libraries: LOADED')
              )
            ),

            activeTab === 'Build' && e(Box, { flexDirection: 'column' },
              e(Text, { color: 'yellow' }, 'Project: /app-production'),
              e(Text, { color: 'gray' }, 'Current Target: React (default)'),
              e(Box, { borderStyle: 'single', borderColor: '#333', marginTop: 1, padding: 1 },
                e(Text, { color: 'white' }, 'mekta build pages/index.mek --target=react')
              )
            ),

            activeTab === 'AI Builder' && e(Box, { flexDirection: 'column' },
              e(Text, { color: 'cyan' }, 'Mekta Intelligence Hub'),
              e(Box, { marginTop: 1 }, e(Text, { color: 'gray' }, 'Listening for Agentic UI prompts...'))
            )
          ),

          // Integrated Logs Area
          e(Box, { height: 12, flexDirection: 'column', borderStyle: 'single', borderColor: '#222', paddingX: 1, marginTop: 'auto' },
            e(Text, { color: '#444', bold: true, marginBottom: 1 }, 'SYSTEM_LOGS'),
            logs.map((log, i) => (
              e(Text, { key: i, color: i === logs.length - 1 ? 'white' : 'gray' },
                `${i === logs.length - 1 ? '➜ ' : '  '} ${log}`
              )
            ))
          )
        )
      ),

      // Input Prompt
      e(Box, { marginTop: 1, borderStyle: 'single', borderColor: '#222', paddingX: 1 },
        e(Text, { color: '#8A2BE2', bold: true }, ' > '),
        e(TextInput, { value: input, onChange: setInput, onSubmit: handleCommand, placeholder: 'Enter Architect Command (e.g. /tab AI)...' })
      )
    )
  );
};

export function startTUI() {
  render(e(MektaDashboard));
}
