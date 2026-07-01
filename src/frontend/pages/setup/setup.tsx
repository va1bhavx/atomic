import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import type { TabItem } from "../../types/generalTypes";
import NewConnection from "./components/NewConnection";
import { SavedProfiles } from "./components/SavedProfiles";

const SETUP_TABS: TabItem[] = [
  {
    value: "new-connection",
    name: "New Connection",
    content: <NewConnection />,
  },
  {
    value: "saved-profiles",
    name: "Saved Profiles",
    content: <SavedProfiles />,
  },
  {
    value: "create-database",
    name: "Create Database",
    content: <></>,
  },
  {
    value: "install-create",
    name: "Install & Create",
    content: <></>,
  },
];

export default function SetupPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "new-connection";

  return (
    <div className="flex items-center justify-center max-w-3xl mx-auto">
      <Card className="w-xl rounded-sm p-0">
        <CardHeader className="p-0! bg-card-header border-b border-border-primary rounded-none m-0">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setSearchParams({ tab: value })}
            className="px-4 py-2 w-full"
          >
            <TabsList
              variant="default"
              className="w-full bg-transparent gap-2 justify-start rounded-none p-0"
            >
              {SETUP_TABS.map((tab) => (
                <TabsTrigger
                  value={tab.value}
                  key={tab.value}
                  className="text-xs font-bold data-active:rounded-sm px-4 py-2.5 data-active:bg-card! data-active:text-foreground text-muted-foreground/80 hover:text-foreground transition-all cursor-pointer border-none data-active:border-border-primary"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        {SETUP_TABS.map(
          (tab) =>
            tab.value === activeTab && (
              <CardContent
                key={tab.value}
                className="w-full pb-4 h-[600px] overflow-y-auto"
              >
                {tab.content}
              </CardContent>
            ),
        )}
      </Card>
    </div>
  );
}
