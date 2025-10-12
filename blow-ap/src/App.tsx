import { useEffect, useState } from "react";

import { BlowLoader } from "./components/ui/BlowLoader";
import projectConfig from "./config/projectConfig";
import { useProject } from "./hooks/useProject";
import { AppRoutes } from "./AppRoutes";

function App() {
  const [config, setConfig] = useState<any | null>(null);
  const project = useProject();

  useEffect(() => {
    if (!project) return;

    // пока в проекте нет ни чего по роутам
    // setConfig(project);
    setConfig(projectConfig);
  }, [project]);

  if (!config) return <BlowLoader />;

  return <AppRoutes config={config} />;
}

export default App;
