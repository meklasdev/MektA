import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import BigText from 'ink-big-text';
import Spinner from 'ink-spinner';
import path from 'path';
import fs from 'fs';
import { compile } from '../core/compiler.js';
import { getTemplate } from '../core/templates.js';
import { listAddons, installAddon } from '../core/addons.js';

const e = React.createElement;

const SidebarItem = ({ label, isSelected }) => (
  e(Box, { paddingX: 1, backgroundColor: isSelected ? '#8A2BE2' : 'transparent' },
    e(Text, { color: isSelected ? 'white' : 'gray', bold: isSelected }, `${isSelected ? '❯ ' : '  '}${label}`)
  )
);

const MektaDashboard = () => {
  const { exit } = useApp();
  const [activeTab, setActiveTab] = useState('Build'); // Build, AI, Addons, Docs, Settings
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState(['Mekta OS v1.2.0 initialized.', 'System ready for Architect.']);
  const [stats, setStats] = useState({ cpu: 0, mem: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 5),
        mem: Math.floor(Math.random() * 100 + 200)
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useInput((input, key) => {
    if (key.escape) exit();
    if (key.upArrow && !activeTab.includes('Select')) { /* Cycle tabs? */ }
  });

  const addLog = (msg) => setLogs(prev => [...prev.slice(-8), msg]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (trimmed === '/exit') exit();
    if (trimmed.startsWith('/tab ')) {
      const tab = trimmed.split(' ')[1];
      setActiveTab(tab.charAt(0).toUpperCase() + tab.slice(1));
      addLog(`Switched to ${tab} tab.`);
    } else {
      addLog(`AI: Processing "${trimmed}"...`);
    }
    setInput('');
  };

  const tabs = ['Build', 'AI Builder', 'Addons', 'Documentation', 'Settings'];

  return (
    e(Box, { flexDirection: 'column', padding: 1, height: 26, borderStyle: 'double', borderColor: '#8A2BE2' },
      // Header
      e(Box, { justifyContent: 'space-between', marginBottom: 1, borderStyle: 'single', borderColor: '#333', paddingX: 1 },
        e(Box, null,
          e(Text, { color: '#8A2BE2', bold: true }, 'MEKTA'),
          e(Text, { color: 'gray' }, ' // ARCHITECT_DASHBOARD')
        ),
        e(Box, null,
          e(Text, { color: 'cyan' }, `CPU: ${stats.cpu}%  `),
          e(Text, { color: 'magenta' }, `MEM: ${stats.mem}MB`)
        )
      ),

      // Main Content
      e(Box, { flexGrow: 1 },
        // Sidebar
        e(Box, { flexDirection: 'column', width: 20, borderStyle: 'single', borderColor: '#444', marginRight: 1 },
          tabs.map(t => e(SidebarItem, { key: t, label: t, isSelected: activeTab === t }))
        ),

        // Active Pane
        e(Box, { flexGrow: 1, flexDirection: 'column', paddingX: 1, borderStyle: 'round', borderColor: '#8A2BE2' },
          e(Text, { color: '#9370DB', bold: true, underline: true }, `[ ${activeTab.toUpperCase()} ]`),

          e(Box, { marginTop: 1, flexDirection: 'column', flexGrow: 1 },
            activeTab === 'Build' && e(Box, { flexDirection: 'column' },
              e(Text, { color: 'yellow' }, 'Ready to compile .mek assets.'),
              e(Text, { color: 'gray' }, 'Targets: React, HTML, PHP'),
              e(Text, { color: 'white', marginTop: 1 }, 'Run: /build <file> <target>')
            ),

            activeTab === 'AI Builder' && e(Box, { flexDirection: 'column' },
              e(Text, { color: 'cyan' }, 'Agentic UI Generation active.'),
              e(Text, { color: 'gray' }, 'Waiting for prompt...')
            ),

            activeTab === 'Addons' && e(Box, { flexDirection: 'column' },
              e(Text, { color: 'magenta' }, 'Extensions: GSAP, FiveM, Next.js'),
              e(Text, { color: 'gray' }, 'Type /addons to view list.')
            )
          ),

          // Log Box in Pane
          e(Box, { height: 10, flexDirection: 'column', borderStyle: 'single', borderColor: '#222', paddingX: 1, marginTop: 'auto' },
            logs.map((log, i) => (
              e(Text, { key: i, color: i === logs.length - 1 ? 'white' : 'gray' },
                `${i === logs.length - 1 ? '➜ ' : '  '} ${log}`
              )
            ))
          )
        )
      ),

      // Footer / Input
      e(Box, { marginTop: 1 },
        e(Text, { color: '#8A2BE2', bold: true }, ' > '),
        e(TextInput, { value: input, onChange: setInput, onSubmit: handleCommand, placeholder: 'Enter command or /tab name...' })
      )
    )
  );
};

export function startTUI() {
  render(e(MektaDashboard));
}
