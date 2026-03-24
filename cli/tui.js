import React, { useState, useEffect, useMemo } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import Spinner from 'ink-spinner';
import path from 'path';
import fs from 'fs';
import { listTemplates, getNextBridgeLinks } from '../templates/templates.js';

const e = React.createElement;

// --- Components ---

const Header = () => (
  e(Box, {
    paddingX: 2,
    marginBottom: 0,
    borderStyle: 'single',
    borderColor: '#475569',
    justifyContent: 'space-between'
  },
    e(Text, { color: '#94a3b8', bold: true }, ' ▣ MEKTA v1.5 ARCHITECT CORE '),
    e(Text, { color: '#64748b' }, `[ ${new Date().toLocaleTimeString()} ]`)
  )
);

const Pane = ({ title, children, width, height, color = '#334155' }) => (
  e(Box, {
    flexDirection: 'column',
    width,
    height,
    borderStyle: 'round',
    borderColor: color,
    paddingX: 1,
    marginX: 0
  },
    e(Box, { marginBottom: 1 },
      e(Text, { color: '#64748b', bold: true }, ` ${title.toUpperCase()} `)
    ),
    children
  )
);

const FileList = ({ files }) => (
  e(Box, { flexDirection: 'column' },
    files.map((file, i) => (
      e(Box, { key: i },
        e(Text, { color: '#475569' }, '  ├ '),
        e(Text, { color: '#cbd5e1' }, file)
      )
    )),
    e(Box, null, e(Text, { color: '#475569' }, '  └ '), e(Text, { color: '#475569', italic: true }, '(end of tree)'))
  )
);

const RouteList = ({ routes }) => (
  e(Box, { flexDirection: 'column' },
    routes.map((route, i) => (
      e(Box, { key: i, marginBottom: 0 },
        e(Text, { color: '#10b981' }, '  ● '),
        e(Text, { color: '#f1f5f9' }, route.path.padEnd(15)),
        e(Text, { color: '#64748b' }, ` → ${route.file}`)
      )
    ))
  )
);

const TemplateBrowser = () => (
  e(Box, { flexDirection: 'column' },
    listTemplates().map((t, i) => (
      e(Box, { key: i },
        e(Text, { color: '#818cf8' }, ` [${t.name}] `),
        e(Text, { color: '#64748b' }, t.description)
      )
    ))
  )
);

const LogConsole = ({ logs }) => (
  e(Box, { flexDirection: 'column', flexGrow: 1, overflowY: 'hidden' },
    logs.slice(-10).map((log, i) => (
      e(Box, { key: i },
        e(Text, { color: '#475569' }, `[${log.time}] `),
        e(Text, { color: log.type === 'error' ? '#ef4444' : (log.type === 'success' ? '#10b981' : '#94a3b8') }, log.text)
      )
    ))
  )
);

const Stats = ({ stats }) => (
  e(Box, { justifyContent: 'space-between', paddingX: 1, borderStyle: 'single', borderColor: '#334155', marginTop: 0 },
    e(Box, null,
      e(Text, { color: '#64748b' }, 'SYSTEM: '),
      e(Text, { color: '#10b981' }, 'STABLE'),
      e(Text, null, '  '),
      e(Spinner, { type: 'dots' })
    ),
    e(Box, null,
      e(Text, { color: '#475569' }, `PID ${process.pid} `),
      e(Text, { color: '#64748b' }, ` MEM ${stats.mem}MB`)
    )
  )
);

// --- Main App ---

const MektaDashboard = () => {
  const { exit } = useApp();
  const [stats, setStats] = useState({ mem: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) });
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), type: 'info', text: 'Initializing Mekta Architect Engine...' },
    { time: new Date().toLocaleTimeString(), type: 'success', text: 'V8 Context Layer Online.' },
    { time: new Date().toLocaleTimeString(), type: 'success', text: 'Nested Layout Bridge Ready.' }
  ]);

  const files = useMemo(() => {
    try {
      const allFiles = [];
      const scan = (dir) => {
         const entries = fs.readdirSync(dir, { withFileTypes: true });
         for (const entry of entries) {
            const res = path.join(dir, entry.name).replace(/\\/g, '/');
            if (entry.isDirectory()) scan(res);
            else if (res.endsWith('.mek')) allFiles.push(res);
         }
      };
      if (fs.existsSync('./pages')) scan('pages');
      return allFiles.length > 0 ? allFiles : ['pages/index.mek'];
    } catch (e) { return ['pages/index.mek']; }
  }, []);

  const routes = useMemo(() => {
    return files.map(f => {
       let p = f.replace('pages', '').replace('.mek', '').replace(/\\/g, '/');
       if (p.endsWith('index')) p = p.slice(0, -5);
       if (p === '') p = '/';
       return { path: p, file: f };
    });
  }, [files]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStats({ mem: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useInput((input, key) => {
    if (key.escape || (input === 'q')) exit();
  });

  return (
    e(Box, { flexDirection: 'column', padding: 1, width: 100 },
      e(Header),

      e(Box, { flexGrow: 1 },
        e(Pane, { title: 'Source Files', width: 35, height: 15 },
          e(FileList, { files })
        ),
        e(Pane, { title: 'Virtual Mapping', width: 45, height: 15 },
          e(RouteList, { routes })
        ),
        e(Pane, { title: 'Presets', width: 20, height: 15 },
          e(TemplateBrowser)
        )
      ),

      e(Pane, { title: 'Architecture System Trace', width: 100, height: 10, color: '#334155' },
        e(LogConsole, { logs })
      ),

      e(Stats, { stats }),

      e(Box, { marginTop: 1, justifyContent: 'center' },
        e(Text, { color: '#475569' }, 'Press ESC or Q to shutdown • Architect Edition v1.5.0')
      )
    )
  );
};

export function startTUI() {
  render(e(MektaDashboard));
}
