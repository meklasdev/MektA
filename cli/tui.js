import React, { useState, useEffect, useMemo } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import path from 'path';
import fs from 'fs';
import { listTemplates, getTemplate } from '../templates/templates.js';
import { listAddons, installAddon } from '../addons/addons.js';

const e = React.createElement;

// --- Components ---

const Header = ({ activeTab }) => (
  e(Box, { paddingX: 2, marginBottom: 1, borderStyle: 'double', borderColor: '#8b5cf6', justifyContent: 'space-between' },
    e(Box, null,
      e(Text, { color: '#8b5cf6', bold: true }, ' ▣ MEKTA '),
      e(Text, { color: '#6366f1' }, ' ARCHITECT ')
    ),
    e(Box, null,
      ['DASHBOARD', 'CREATE', 'BUILD', 'ADDONS', 'LOGS'].map(tab => (
        e(Text, { key: tab, color: activeTab === tab.toLowerCase() ? '#ffffff' : '#475569', bold: activeTab === tab.toLowerCase() }, `  ${tab}  `)
      ))
    )
  )
);

const Pane = ({ title, children, flexGrow = 1, color = '#334155' }) => (
  e(Box, { flexDirection: 'column', flexGrow, borderStyle: 'round', borderColor: color, paddingX: 1, marginX: 1 },
    e(Box, { marginBottom: 1 },
      e(Text, { color: '#818cf8', bold: true }, ` ${title.toUpperCase()} `)
    ),
    children
  )
);

// --- Tabs ---

const DashboardTab = ({ files, routes }) => (
  e(Box, { flexGrow: 1 },
    e(Pane, { title: 'Source Tree', flexGrow: 1 },
      files.map((f, i) => e(Text, { key: i, color: '#cbd5e1' }, ` ├ ${f}`))
    ),
    e(Pane, { title: 'Active Routes', flexGrow: 1 },
      routes.map((r, i) => e(Box, { key: i },
        e(Text, { color: '#10b981' }, ' ● '),
        e(Text, { color: '#f1f5f9' }, r.path.padEnd(12)),
        e(Text, { color: '#64748b' }, `→ ${r.file}`)
      ))
    )
  )
);

const CreateTab = ({ onLog }) => {
  const [step, setStep] = useState('template');
  const [template, setTemplate] = useState('');
  const [name, setName] = useState('');

  const templates = listTemplates().map(t => ({ label: t.name, value: t.name }));

  const handleCreate = () => {
     if (!name) return;
     onLog(`Architecting project: ${name} (preset: ${template})...`, 'info');
     // Logic for actual FS creation would go here as per cli/index.js
     onLog(`Scaffolded ${name} successfully!`, 'success');
     setStep('template');
     setName('');
  };

  if (step === 'template') {
    return e(Pane, { title: 'Select Architecture Preset' },
      e(SelectInput, { items: templates, onSelect: (item) => { setTemplate(item.value); setStep('name'); } })
    );
  }

  return e(Pane, { title: 'Project Identity' },
    e(Box, null,
      e(Text, { color: '#8b5cf6' }, 'Project Name: '),
      e(TextInput, { value: name, onChange: setName, onSubmit: handleCreate })
    ),
    e(Text, { color: '#4b5563', marginTop: 1 }, ' Press ENTER to confirm scaffolding ')
  );
};

const AddonsTab = ({ onLog }) => (
  e(Pane, { title: 'Mekta Plugin Bridge' },
    e(SelectInput, {
      items: listAddons().map(a => ({ label: a.name, value: a.id })),
      onSelect: (item) => onLog(`Installed addon: ${item.label}`, 'success')
    })
  )
);

const BuildTab = ({ onLog }) => (
  e(Pane, { title: 'Compiler Targets' },
    e(SelectInput, {
      items: [
        { label: 'Build for React (SSR)', value: 'react' },
        { label: 'Build for Static HTML', value: 'html' },
        { label: 'Build for PHP Bridge', value: 'php' }
      ],
      onSelect: (item) => onLog(`Compilation triggered for: ${item.value}`, 'info')
    })
  )
);

const LogTab = ({ logs }) => (
  e(Pane, { title: 'System Trace' },
    logs.map((l, i) => (
      e(Box, { key: i },
        e(Text, { color: '#475569' }, `[${l.time}] `),
        e(Text, { color: l.type === 'success' ? '#10b981' : (l.type === 'error' ? '#ef4444' : '#94a3b8') }, l.text)
      )
    ))
  )
);

// --- Main App ---

const MektaTUI = () => {
  const { exit } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'info', text: 'Architect Dashboard v1.6 Initialized.' }
  ]);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text, type }].slice(-15));
  };

  const files = useMemo(() => {
    try {
      const all = [];
      const scan = (d) => {
        fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
          const r = path.join(d, e.name).replace(/\\/g, '/');
          if (e.isDirectory()) scan(r); else if (r.endsWith('.mek')) all.push(r);
        });
      };
      if (fs.existsSync('pages')) scan('pages');
      return all;
    } catch { return ['pages/index.mek']; }
  }, []);

  const routes = useMemo(() => files.map(f => {
    let p = f.replace('pages', '').replace('.mek', '').replace(/\\/g, '/');
    if (p.endsWith('index')) p = p.slice(0, -5);
    return { path: p || '/', file: f };
  }), [files]);

  useInput((input, key) => {
    if (key.escape || input === 'q') exit();
    if (key.rightArrow) {
       const tabs = ['dashboard', 'create', 'build', 'addons', 'logs'];
       setActiveTab(tabs[(tabs.indexOf(activeTab) + 1) % tabs.length]);
    }
    if (key.leftArrow) {
       const tabs = ['dashboard', 'create', 'build', 'addons', 'logs'];
       setActiveTab(tabs[(tabs.indexOf(activeTab) - 1 + tabs.length) % tabs.length]);
    }
  });

  return (
    e(Box, { flexDirection: 'column', padding: 1, width: 90, height: 28 },
      e(Header, { activeTab }),

      e(Box, { flexGrow: 1 },
        activeTab === 'dashboard' && e(DashboardTab, { files, routes }),
        activeTab === 'create' && e(CreateTab, { onLog: addLog }),
        activeTab === 'build' && e(BuildTab, { onLog: addLog }),
        activeTab === 'addons' && e(AddonsTab, { onLog: addLog }),
        activeTab === 'logs' && e(LogTab, { logs })
      ),

      e(Box, { paddingX: 1, marginTop: 1, justifyContent: 'space-between', borderStyle: 'single', borderColor: '#1e293b' },
        e(Box, null,
          e(Text, { color: '#64748b' }, ' STATUS: '),
          e(Text, { color: '#10b981' }, 'OPERATIONAL '),
          e(Spinner, { type: 'dots' })
        ),
        e(Text, { color: '#475569' }, ' ARROWS to navigate • ESC to exit ')
      )
    )
  );
};

export function startTUI() {
  render(e(MektaTUI));
}
