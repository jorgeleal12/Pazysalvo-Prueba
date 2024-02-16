/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProviderState, Providers } from '@microsoft/mgt-element';
import { TeamsFxProvider } from '@microsoft/mgt-teamsfx-provider';
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext } from 'react';
import { TeamsFxContext } from "../Context";
const RolesAdminGen = () => {
  const { teamsUserCredential } = useContext(TeamsFxContext);


  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {
      //setrole('Administrador General')
      const dataForm: any = await graph.api(`/me`).get();
      const dataParam: any = await graph
        .api(
          `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/items?expand=fields(select=*)`
        )
        .get();
      console.log(dataParam);
      dataParam.value.forEach((element: any) => {
        if (element.fields['Correo'] === dataForm['mail']) {

          console.log(element.fields['Permisos']);
        }
      });
      // Initialize Graph Toolkit TeamsFx provider
      const provider = new TeamsFxProvider(teamsUserCredential, scope);
      Providers.globalProvider = provider;
      await teamsUserCredential.login(scope);
      Providers.globalProvider.setState(ProviderState.SignedIn);
      return { dataForm, dataParam };
    },
    { scope: ["User.Read", "Sites.Read.All", "Group.ReadWrite.All", "Application.ReadWrite.All"], credential: teamsUserCredential }
  );

  let user = 'Admingeneral'
  console.log(data?.dataForm);
  return user
}

export default RolesAdminGen