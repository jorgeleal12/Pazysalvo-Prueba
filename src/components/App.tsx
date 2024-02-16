/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
// https://fluentsite.z22.web.core.windows.net/quick-start
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { TeamsFxContext } from "./Context";
import MisDatos from "./MisDatos";
import Privacy from "./Privacy";
import Tab from "./Tab";
import TabAreas from "./TabAreas";
import TabParametrizar from "./TabParametrizar";
import TabSolicitud from "./TabSolicitud";
import TermsOfUse from "./TermsOfUse";
import config from "./sample/lib/config";
/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    initiateLoginEndpoint: config.initiateLoginEndpoint!,
    clientId: config.clientId!,
  });

  return (


    <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential }}>
      <FluentProvider
        theme={teamsLightTheme}


      >
        <Router>

          <Routes>
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/termsofuse" element={<TermsOfUse />} />
            <Route path="/" element={<Tab />} />
            <Route path="/solicitud" element={<TabSolicitud />} />
            <Route path="/misdatos" element={<MisDatos />} />
            <Route path="/areas" element={<TabAreas />} />
            <Route path="/parametrizar" element={<TabParametrizar />} />
            {/* <Route path="/informes" element={<TabInformes />} /> */}
            {/* <Route path="/successoli" element={<SuccesSoli />} />
              <Route path="/gestion" element={<TabGestion />} />
              <Route path="/historial" element={<TabHistorial />} />
              <Route path="/nuevassolicitudes/:id" element={<FormSolicitud />} />
              <Route path="/solicitudHistory/:id" element={<FormSolicitudHistory />} />
              <Route path="/solicitudGestor/:id" element={<FormSolicitudGestor />} />
              <Route path="/nuevaarea" element={<Form />} />
              <Route path="/updatearea/:id" element={<FormUpdateArea />} />
              <Route path="/config" element={<TabConfig />} /> */}
          </Routes>

        </Router>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}
