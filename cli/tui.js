import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import BigText from 'ink-big-text';
import Spinner from 'ink-spinner';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { compile } from '../core/compiler.js';
import { getTemplate } from '../core/templates.js';
import { listAddons, installAddon } from '../core/addons.js';

const e = React.createElement;

const PurpleBox = ({ children, title }) => (
  e(Box, { borderStyle: 'round', borderColor: '#8A2BE2', padding: 1, flexDirection: 'column' },
    title && e(Box, { marginBottom: 1 }, e(Text, { color: '#9370DB', bold: true }, ` ${title} `)),
    children
  )
);

const MektaDashboard = () => {
  const { exit } = useApp();
  const [mode, setMode] = useState('Architect');
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState(['Welcome to Mekta Framework.', 'Type /help for commands.']);
  const [selection, setSelection] = useState(null);

  const addLog = (msg) => setLogs((prev) => [...prev.slice(-5), msg]);

  useInput((input, key) => {
    if (key.escape) exit();
  });

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (trimmed === '/help') {
      addLog('Commands: /new, /build <file>, /addons, /exit');
    } else if (trimmed === '/new') {
      setSelection('template');
    } else if (trimmed === '/addons') {
      setSelection('addons');
    } else if (trimmed.startsWith('/build ')) {
      const file = trimmed.split(' ')[1];
      try {
        const source = fs.readFileSync(path.resolve(file), 'utf8');
        const compiled = compile(source);
        fs.writeFileSync(file.replace('.mek', '.js'), compiled);
        addLog(`Build success: ${file} -> JS`);
      } catch (err) {
        addLog(`Build error: ${err.message}`);
      }
    } else if (trimmed === '/exit') {
      exit();
    } else {
      addLog(`AI Agent (Mock): Processing "${trimmed}"...`);
    }
    setInput('');
  };

  const handleTemplateSelect = (item) => {
    const template = getTemplate(item.value);
    const filename = `app-${item.value}.mek`;
    fs.writeFileSync(filename, template);
    addLog(`Created ${filename} from ${item.label} template.`);
    setSelection(null);
  };

  const handleAddonSelect = (item) => {
    const success = installAddon(item.value, process.cwd());
    if (success) addLog(`Addon ${item.label} installed.`);
    setSelection(null);
  };

  return (
    e(Box, { flexDirection: 'column', padding: 1, minHeight: 20 },
      e(BigText, { text: 'MEKTA', colors: ['#8A2BE2', '#9370DB'], font: 'block' }),

      e(Box, { marginBottom: 1 },
        e(Text, { color: '#E6E6FA' }, 'The Agentic UI Framework for high-fidelity terminal interfaces.')
      ),

      e(PurpleBox, { title: 'Status & Logs' },
        logs.map((log, i) => (
          e(Text, { key: i, color: i === logs.length - 1 ? 'white' : 'gray' },
            `${i === logs.length - 1 ? '➜ ' : '  '} ${log}`
          )
        ))
      ),

      selection === 'template' && e(Box, { marginTop: 1, flexDirection: 'column' },
        e(Text, { color: 'yellow' }, 'Select a template to generate:'),
        e(SelectInput, {
          items: [
            { label: 'Standard Web', value: 'web' },
            { label: 'FiveM UI (Mod)', value: 'fivem' },
            { label: 'Landing Page', value: 'landing' }
          ],
          onSelect: handleTemplateSelect
        })
      ),

      selection === 'addons' && e(Box, { marginTop: 1, flexDirection: 'column' },
        e(Text, { color: 'cyan' }, 'Available Addons:'),
        e(SelectInput, {
          items: listAddons().map(a => ({ label: a.name, value: a.id })),
          onSelect: handleAddonSelect
        })
      ),

      !selection && e(Box, { marginTop: 1, flexDirection: 'column' },
        e(Box, { borderStyle: 'single', borderColor: '#444', paddingX: 1 },
          e(Text, { color: '#8A2BE2' }, '/help for commands  /mode to switch mode  ! for shell mode')
        ),
        e(Box, { marginTop: 1 },
          e(Text, { color: '#9370DB', bold: true }, ' > '),
          e(TextInput, { value: input, onChange: setInput, onSubmit: handleCommand, placeholder: 'Type a message or /command...' })
        )
      ),

      e(Box, { marginTop: 'auto', borderStyle: 'single', borderColor: '#222', paddingX: 1, justifyContent: 'space-between' },
        e(Text, { color: 'cyan' }, 'mekta-user'),
        e(Box, null,
          e(Text, { color: 'yellow', bold: true }, mode),
          e(Text, { color: 'gray' }, ' | Anthropic: Mekta-v1.2 | '),
          e(Text, { color: 'green' }, e(Spinner, { type: 'dots' }), ' 0%')
        )
      )
    )
  );
};

export function startTUI() {
  render(e(MektaDashboard));
}
