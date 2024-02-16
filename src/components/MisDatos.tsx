
import { ProviderState, Providers } from '@microsoft/mgt-element';
import { TeamsFxProvider } from '@microsoft/mgt-teamsfx-provider';
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useState } from "react";
import { TeamsFxContext } from "./Context";
import { WelcomeDatos } from './sample/WelcomeDatos';

const showFunction = Boolean(process.env.REACT_APP_FUNC_NAME);

export default function MisDatos() {
  const { themeString } = useContext(TeamsFxContext);
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const [rolespecifico, setrolespecifico] = useState(String);
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {
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
      // Initialize Graph Toolkit TeamsFx provider
      const provider = new TeamsFxProvider(teamsUserCredential, scope);
      Providers.globalProvider = provider;
      Providers.globalProvider.setState(ProviderState.SignedIn);
      return { dataForm, dataParam };
    },
    { scope: ["User.Read"], credential: teamsUserCredential }
  );

  console.log(rolespecifico);

  let Aprob = 'Aprobador';
  let JefeD = 'Jefe directo';
  let admin = 'Administrador';
  let admingeneral = 'Administrador general'
  let permiso = false;

  if (rolespecifico === Aprob) {
    permiso = false
  } else if (rolespecifico === JefeD) {
    permiso = false
  } else if (rolespecifico === admin) {
    permiso = false;
  } else if (rolespecifico === admingeneral) {
    permiso = false;
  }
  else if (rolespecifico === 'Gestor documental') {
    permiso = false;

  } else {
    permiso = true;
  }

  console.log(permiso);

  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <WelcomeDatos />
      {/* {permiso ? (
        <WelcomeDatos />) :
        <Permisos />
      } */}
    </div>
  );
}
