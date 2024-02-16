
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useState } from "react";
import { TeamsFxContext } from "./Context";
import Permisos from "./sample/Permisos";
import { WelcomeAreas } from "./sample/WelcomeAreas";
const showFunction = Boolean(process.env.REACT_APP_FUNC_NAME);

export default function TabAreas() {
  const { themeString } = useContext(TeamsFxContext);
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const [rolespecifico, setrolespecifico] = useState(String);
  const [authenticated, setAuthenticated] = useState(false);
  let estadodeletevar = '';
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      //setrole('Administrador General')
      const dataForm: any = await graph.api(`/me`).get();
      const dataParam: any = await graph
        .api(
          `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/items?expand=fields(select=*)`
        )
        .get();

      dataParam.value.forEach((element: any) => {
        if (element.fields['Correo'] === dataForm['mail']) {
          setrolespecifico(element.fields['Permisos']);
        }
      });
      estadodeletevar = '';
      //if (!authenticated) {
      // Initialize Graph Toolkit TeamsFx provider
      //const provider = new TeamsFxProvider(teamsfx, scope);
      // Providers.globalProvider = provider;
      //Providers.globalProvider.setState(ProviderState.SignedIn);
      //setAuthenticated(true);
      //}

      return { dataForm, dataParam };
    },
    { scope: ["User.Read.All", "Group.ReadWrite.All"], credential: teamsUserCredential }
  );
  let usufinal = 'Usuario final';
  let jefedi = 'Jefe directo';
  let permiso = false;

  if (rolespecifico === usufinal) {
    permiso = false
  } else if (rolespecifico === jefedi) {
    permiso = false
  }
  else if (rolespecifico === 'Gestor documental') {
    permiso = false
  }
  else {
    permiso = true;
  }

  return (
    <div className={themeString === "default" ? "" : "dark"}>
      hola
      {permiso ?
        <WelcomeAreas rolespecifico={rolespecifico} showFunction={showFunction} authenticated={authenticated} setAuthenticated={setAuthenticated} /> :
        <Permisos />}
    </div>
  );
}

