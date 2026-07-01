import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import DependenciesTab from "./components/dependencies-tab";
import ERDiagramTab from "./components/er-diagram-tab";
import PreviewDataTab from "./components/preview-data-tab";
import RunQueryTab from "./components/run-query-tab";
import SchemaTab from "./components/schema-tab";
import StructureTab from "./components/structure-tab";

interface TabItem {
  value: string;
  name: string;
  content: React.ReactNode;
}

const TAB_LISTS: TabItem[] = [
  { value: "structure", name: "Structure", content: <StructureTab /> },
  { value: "preview-data", name: "Preview Data", content: <PreviewDataTab /> },
  { value: "dependencies", name: "Dependencies", content: <DependenciesTab /> },
  { value: "run-query", name: "Run Query", content: <RunQueryTab /> },
  { value: "er-diagram", name: "ER Diagram", content: <ERDiagramTab /> },
  { value: "schema", name: "Schema", content: <SchemaTab /> },
];

export default function DatabaseStructurePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "run-query";

  return (
    <div className="space-y-8 animate-fade-in w-full ">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setSearchParams({ tab: value })}
        className="px-4 rounded-none! bg-card py-2 w-full"
      >
        <TabsList
          variant={"line"}
          className="border-b border-border-primary w-full"
        >
          {TAB_LISTS.map((tab) => (
            <TabsTrigger value={tab.value} key={tab.value} className="text-xs!">
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {TAB_LISTS.map((tab) => (
          <TabsContent
            value={tab.value}
            key={tab.value}
            className="w-full mt-2 bg-background rounded-lg "
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
