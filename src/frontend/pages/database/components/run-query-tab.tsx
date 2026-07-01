import { useState, useEffect, useRef, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Play, AlignLeft, Plus, X, ChevronDown } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DynamicTable } from "../../../components/web/dynamic-table/dynamic-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Resizable } from "../../../components/web/resizable/resizable";
import type { MonacoEditorInstance } from "../../../types/monacoEditorTypes";
import type { QueryTab } from "../../../types/queryTabTypes";

const DEFAULT_QUERY_1 = `-- newest signups with first order value
SELECT u.username,
       u.email,
       u.created_at,
       count(o.id)          AS orders,
       sum(o.total_cents) AS lifetime_cents
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at > now() - interval '30 days'
GROUP BY u.username, u.email, u.created_at
ORDER BY u.created_at DESC
LIMIT 8;`;

const MOCK_ROWS_1 = [
  {
    username: "arjun_mehta",
    email: "arjun.mehta@gmail.com",
    created_at: "2026-06-17 09:12",
    orders: 3,
    lifetime_cents: 48720,
  },
  {
    username: "priya.nair",
    email: "priya.nair@outlook.com",
    created_at: "2026-06-17 08:41",
    orders: 1,
    lifetime_cents: 12990,
  },
  {
    username: "CUST-000412",
    email: "rohan_d@zoho.in",
    created_at: "2026-06-16 22:03",
    orders: 0,
    lifetime_cents: null,
  },
  {
    username: "sneha_k",
    email: "sneha.kapoor@gmail.com",
    created_at: "2026-06-16 19:55",
    orders: 5,
    lifetime_cents: 91340,
  },
  {
    username: "vikram99",
    email: "vikram.rao@proton.me",
    created_at: "2026-06-16 14:20",
    orders: 2,
    lifetime_cents: 27050,
  },
  {
    username: "ananya.s",
    email: "ananya.singh@gmail.com",
    created_at: "2026-06-15 11:08",
    orders: 1,
    lifetime_cents: 8499,
  },
  {
    username: "dev_patel",
    email: "dev.patel@yahoo.in",
    created_at: "2026-06-15 09:47",
    orders: 4,
    lifetime_cents: 63200,
  },
];

const DEFAULT_QUERY_2 = `-- daily revenue overview for organization
SELECT date_trunc('day', payment_date)::date AS day,
       count(id)                               AS transaction_count,
       sum(amount_cents)                       AS total_cents,
       avg(amount_cents)::integer              AS average_cents
FROM payments
WHERE status = 'succeeded'
  AND payment_date >= now() - interval '7 days'
GROUP BY 1
ORDER BY 1 DESC;`;

const MOCK_ROWS_2 = [
  {
    day: "2026-06-29",
    transaction_count: 412,
    total_cents: 1248900,
    average_cents: 3031,
  },
  {
    day: "2026-06-28",
    transaction_count: 380,
    total_cents: 948200,
    average_cents: 2495,
  },
  {
    day: "2026-06-27",
    transaction_count: 355,
    total_cents: 882100,
    average_cents: 2484,
  },
  {
    day: "2026-06-26",
    transaction_count: 510,
    total_cents: 1690400,
    average_cents: 3314,
  },
  {
    day: "2026-06-25",
    transaction_count: 424,
    total_cents: 1320000,
    average_cents: 3113,
  },
  {
    day: "2026-06-24",
    transaction_count: 390,
    total_cents: 1104500,
    average_cents: 2832,
  },
  {
    day: "2026-06-23",
    transaction_count: 320,
    total_cents: 890000,
    average_cents: 2781,
  },
];

export default function RunQueryTab() {
  const { theme } = useTheme();
  const [tabs, setTabs] = useState<QueryTab[]>([
    {
      id: "1",
      name: "recent users",
      query: DEFAULT_QUERY_1,
      columns: ["username", "email", "created_at", "orders", "lifetime_cents"],
      rows: MOCK_ROWS_1,
      limit: "1 000",
    },
    {
      id: "2",
      name: "revenue by day",
      query: DEFAULT_QUERY_2,
      columns: ["day", "transaction_count", "total_cents", "average_cents"],
      rows: MOCK_ROWS_2,
      limit: "1 000",
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(true);
  const [execTime, setExecTime] = useState<number>(14);
  const [showLimitDropdown, setShowLimitDropdown] = useState<boolean>(false);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [tempTabName, setTempTabName] = useState<string>("");

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const editorRef = useRef<MonacoEditorInstance | null>(null);

  useEffect(() => {
    if (editorRef.current && activeTab) {
      editorRef.current.setValue(activeTab.query);
    }
  }, [activeTabId, activeTab]);

  const handleEditorDidMount = (editor: MonacoEditorInstance) => {
    editorRef.current = editor;
  };

  const handleQueryChange = (value: string | undefined) => {
    if (value === undefined) return;
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, query: value } : t)),
    );
  };

  const runQuery = () => {
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      // Simulate database execution delay
      const randomTime = Math.floor(Math.random() * 15) + 8; // 8ms to 23ms
      setExecTime(randomTime);
      setLoading(false);
      setShowResults(true);
    }, 450);
  };

  const runSelection = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      const selection = editorRef.current.getSelection();
      const selectedText =
        model && selection ? model.getValueInRange(selection) : "";
      if (selectedText) {
        console.log("Running selection:", selectedText);
        runQuery();
      } else {
        runQuery();
      }
    }
  };

  const formatQuery = () => {
    if (editorRef.current) {
      const currentVal = editorRef.current.getValue();
      // Capitalize core SQL keywords
      const keywords = [
        "select",
        "from",
        "where",
        "group by",
        "order by",
        "limit",
        "left join",
        "right join",
        "inner join",
        "join",
        "on",
        "as",
        "and",
        "or",
        "interval",
      ];
      let formatted = currentVal;
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        formatted = formatted.replace(regex, keyword.toUpperCase());
      });

      editorRef.current.setValue(formatted);
      handleQueryChange(formatted);
    }
  };

  const addNewTab = () => {
    const nextId = (
      Math.max(...tabs.map((t) => parseInt(t.id))) + 1
    ).toString();
    const newTab: QueryTab = {
      id: nextId,
      name: `query_${nextId}`,
      query: `-- Write your SQL query here\nSELECT * FROM users LIMIT 10;`,
      columns: ["id", "created_at"],
      rows: [
        { id: 1, created_at: "2026-06-30 10:00" },
        { id: 2, created_at: "2026-06-30 10:05" },
      ],
      limit: "1 000",
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(nextId);
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Keep at least one tab
    const remainingTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(remainingTabs);
    if (activeTabId === tabId) {
      setActiveTabId(remainingTabs[0].id);
    }
  };

  const startRenameTab = (tabId: string, currentName: string) => {
    setEditingTabId(tabId);
    setTempTabName(currentName);
  };

  const finishRenameTab = () => {
    if (tempTabName.trim() && editingTabId) {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === editingTabId ? { ...t, name: tempTabName.trim() } : t,
        ),
      );
    }
    setEditingTabId(null);
  };

  const changeLimit = (val: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, limit: val } : t)),
    );
    setShowLimitDropdown(false);
  };

  const formatCurrency = (val: unknown) => {
    if (val === null || val === undefined)
      return (
        <span className="italic text-muted-foreground/60 select-none">
          NULL
        </span>
      );
    if (typeof val === "number" && val > 1000) {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    return String(val);
  };

  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    return activeTab.columns.map((col) => ({
      accessorKey: col,
      header: col,
      cell: ({ getValue }) => formatCurrency(getValue()),
    }));
  }, [activeTab.columns]);

  const tableEndpoint = useMemo(() => {
    return async () => {
      return {
        data: activeTab.rows,
        total: activeTab.rows.length,
      };
    };
  }, [activeTab.rows]);

  const tableQueryKey = ["run-query-tab-results", activeTab.id, activeTab.rows];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]  overflow-hidden select-none">
      <div className="flex items-center border-b border-border-primary  h-10 gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isEditing = tab.id === editingTabId;

          return (
            <div
              key={tab.id}
              onClick={() => !isEditing && setActiveTabId(tab.id)}
              onDoubleClick={() => startRenameTab(tab.id, tab.name)}
              className={`
                group/tab flex items-center gap-2 px-3 h-full border-r  border-border-primary text-xs font-semibold cursor-pointer transition-colors relative
                ${isActive ? "bg-card text-foreground border-b-2 border-b-border-primary" : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/30"}
              `}
              style={{ minWidth: "120px" }}
            >
              {/* Dot Status indicator */}
              <div
                className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary" : "bg-muted-foreground/45"}`}
              />

              {isEditing ? (
                <input
                  type="text"
                  value={tempTabName}
                  onChange={(e) => setTempTabName(e.target.value)}
                  onBlur={finishRenameTab}
                  onKeyDown={(e) => e.key === "Enter" && finishRenameTab()}
                  className="bg-background border px-1 py-0.5 rounded text-xs w-20 focus:outline-none"
                  autoFocus
                />
              ) : (
                <span className="truncate max-w-[80px]">{tab.name}</span>
              )}

              {/* Close Button */}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => closeTab(e, tab.id)}
                  className="ml-auto w-4 h-4 rounded-full flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-muted/70 opacity-0 group-hover/tab:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          );
        })}

        {/* Plus Tab trigger */}
        <button
          onClick={addNewTab}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-1"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-border-primary px-4 py-2 bg-card select-none">
        <div className="flex items-center gap-2">
          {/* Run button */}
          <Button
            onClick={runQuery}
            disabled={loading}
            className="rounded-xl text-xs font-bold bg-foreground text-background hover:bg-foreground/90 gap-1.5  shadow-sm"
          >
            <Play size={8} fill="currentColor" />
            <span>Run</span>
          </Button>

          {/* Run Selection button */}
          <Button
            onClick={runSelection}
            disabled={loading}
            variant="outline"
            className="rounded-xl text-xs font-semibold gap-1.5 "
          >
            Run selection
          </Button>

          {/* Format button */}
          <Button
            onClick={formatQuery}
            variant="outline"
            className=" rounded-xl text-xs font-semibold gap-1.5 "
          >
            <AlignLeft size={4} />
            Format
          </Button>
        </div>

        {/* Limit Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLimitDropdown(!showLimitDropdown)}
            className="flex items-center gap-1.5 border border-border-primary rounded-xl px-3 py-1.5 text-xs font-semibold bg-background active:scale-90 text-foreground transition-colors shadow-sm cursor-pointer"
          >
            <span className="text-muted-foreground">Limit</span>
            <span className="font-bold">{activeTab.limit}</span>
            <ChevronDown size={12} className="text-muted-foreground" />
          </button>

          {showLimitDropdown && (
            <div className="absolute right-0 mt-1 bg-card border border-border-primary! shadow-lg z-50 py-1 min-w-[100px] divide-y divide-border-primary overflow-hidden">
              {["10", "50", "100", "1 000", "5 000"].map((lim) => (
                <button
                  key={lim}
                  onClick={() => changeLimit(lim)}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent  transition-colors"
                >
                  {lim}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Query Code Editor (Resizable on the bottom edge) */}
      <Resizable
        directions={["bottom"]}
        defaultHeight={240}
        minHeight={140}
        maxHeight={500}
        onResize={() => {
          if (editorRef.current) {
            editorRef.current.layout();
          }
        }}
      >
        <div className="h-full w-full bg-background border-b border-border-primary relative">
          <Editor
            height="100%"
            language="sql"
            theme={theme === "dark" ? "vs-dark" : "light"}
            value={activeTab.query}
            onChange={handleQueryChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineHeight: 22,
              fontFamily:
                "Fira Code, JetBrains Mono, Monaco, Courier New, monospace",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              lineNumbersMinChars: 3,
            }}
          />
        </div>
      </Resizable>

      {/* 4. Results Table Grid Area */}
      <div className="flex-1 flex flex-col bg-card overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
            <span className="text-sm font-semibold text-muted-foreground">
              Executing SQL query...
            </span>
          </div>
        ) : showResults && activeTab.rows.length > 0 ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Table wrapper */}
            <div className="flex-1 overflow-auto relative ">
              <DynamicTable
                columns={columns}
                endpoint={tableEndpoint}
                queryKey={tableQueryKey}
                enablePagination={false}
                rowClassName="bg-card"
              />
            </div>

            {/* Results Footer Bar */}
            <div className="h-8 border-t border-border-primary flex items-center justify-between px-4 bg-muted/25 text-[10px] font-bold text-muted-foreground select-none">
              <div className="flex items-center gap-1.5">
                <span>{activeTab.rows.length} rows</span>
                <span>•</span>
                <span>{execTime} ms</span>
              </div>

              {/* Read only status indicator */}
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-500 uppercase tracking-wider">
                  read-only
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <span className="text-sm font-bold text-foreground">
              No Query Executed
            </span>
            <p className="text-xs text-muted-foreground max-w-xs">
              Click the{" "}
              <span className="font-semibold text-foreground">Run</span> button
              to execute this SQL query and view results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
