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
  const [activeAddon, setActiveAddon] = useState(null);

  const addLog = (msg) => setLogs((prev) => [...prev.slice(-10), msg]);

  useInput((input, key) => {
    if (key.escape) {
      if (selection) setSelection(null);
      else exit();
    }
  });

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (trimmed === '/help') {
      addLog('Commands: /new (Templates), /build <file>, /addons, /exit');
    } else if (trimmed === '/new') {
      setSelection('template');
    } else if (trimmed === '/addons') {
      setSelection('addons');
    } else if (trimmed.startsWith('/build ')) {
      const parts = trimmed.split(' ');
      const file = parts[1];
      const target = parts[2] || 'react';
      try {
        const source = fs.readFileSync(path.resolve(file), 'utf8');
        const { js } = compile(source, { target });
        const ext = target === 'react' ? '.js' : (target === 'php' ? '.php' : '.html');
        fs.writeFileSync(file.replace('.mek', ext), js);
        addLog(`Build success: ${file} -> ${target.toUpperCase()}`);
      } catch (err) {
        addLog(`Build error: ${err.message}`);
      }
    } else if (trimmed === '/exit') {
      exit();
    } else if (trimmed === '/mode') {
      const modes = ['Architect', 'Builder', 'Agent'];
      const nextIdx = (modes.indexOf(mode) + 1) % modes.length;
      setMode(modes[nextIdx]);
      addLog(`Switched to ${modes[nextIdx]} mode.`);
    } else if (trimmed.startsWith('!')) {
      addLog(`Shell: Executing "${trimmed.slice(1)}"... (Simulated)`);
    } else {
      addLog(`AI: Processing "${trimmed}"...`);
    }
    setInput('');
  };

  const handleTemplateSelect = (item) => {
    const template = getTemplate(item.value);
    const filename = `app-${item.value}.mek`;
    fs.writeFileSync(filename, template);
    addLog(`SUCCESS: Created ${filename} from ${item.label} template.`);
    setSelection(null);
  };

  const handleAddonSelect = (item) => {
    const success = installAddon(item.value, process.cwd());
    if (success) addLog(`SUCCESS: Addon ${item.label} installed.`);
    setSelection(null);
  };

  const handleAddonHighlight = (item) => {
    const addon = listAddons().find(a => a.id === item.value);
    setActiveAddon(addon);
  };

  return (
    e(Box, { flexDirection: 'column', padding: 1, minHeight: 22 },
      e(BigText, { text: 'MEKTA', colors: ['#8A2BE2', '#9370DB'], font: 'block' }),

      e(Box, { marginBottom: 1 },
        e(Text, { color: '#E6E6FA' }, 'The Agentic UI Framework for high-fidelity terminal interfaces.')
      ),

      e(PurpleBox, { title: 'Status Dashboard' },
        e(Box, { justifyContent: 'space-between' },
          e(Text, { color: 'cyan' }, `MODE: ${mode}`),
          e(Text, { color: 'yellow' }, `TARGETS: React | HTML | PHP`),
          e(Text, { color: 'green' }, 'SYSTEM: Ready')
        ),
        e(Box, { marginTop: 1, flexDirection: 'column' },
          logs.map((log, i) => (
            e(Text, { key: i, color: log.startsWith('SUCCESS') ? 'green' : (i === logs.length - 1 ? 'white' : 'gray') },
              `${i === logs.length - 1 ? '➜ ' : '  '} ${log}`
            )
          ))
        )
      ),

      selection === 'template' && e(Box, { marginTop: 1, flexDirection: 'column' },
        e(Text, { color: 'yellow', bold: true }, '--- SELECT TEMPLATE ---'),
        e(SelectInput, {
          items: [
            { label: 'Standard Web', value: 'web' },
            { label: 'FiveM UI (Mod)', value: 'fivem' },
            { label: 'Landing Page', value: 'landing' }
          ],
          onSelect: handleTemplateSelect
        }),
        e(Text, { color: 'gray' }, 'Esc to go back')
      ),

      selection === 'addons' && e(Box, { marginTop: 1, flexDirection: 'column' },
        e(Text, { color: 'cyan', bold: true }, '--- AVAILABLE ADDONS ---'),
        e(Box, null,
          e(Box, { width: 30 },
            e(SelectInput, {
              items: listAddons().map(a => ({ label: a.name, value: a.id })),
              onSelect: handleAddonSelect,
              onHighlight: handleAddonHighlight
            })
          ),
          e(Box, { paddingLeft: 2, flexDirection: 'column', flexGrow: 1 },
            activeAddon && e(React.Fragment, null,
              e(Text, { color: 'magenta', underline: true }, activeAddon.name),
              e(Text, { color: 'white', wrap: 'wrap' }, activeAddon.description),
              e(Text, { color: 'gray' }, `Package: ${activeAddon.package}`)
            )
          )
        ),
        e(Text, { color: 'gray' }, 'Esc to go back')
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
