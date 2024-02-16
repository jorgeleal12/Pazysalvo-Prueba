/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProviderState, Providers } from '@microsoft/mgt-element';
import { TeamsFxProvider } from '@microsoft/mgt-teamsfx-provider';
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useEffect } from 'react';
import { TeamsFxContext } from "../Context";

const Admin = (porps: any) => {

  let { admin, setAdmin } = porps
  const { teamsUserCredential } = useContext(TeamsFxContext);

  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      const dataMe = await graph.api('/me').get();
      // Call graph api directly to get user profile information
      const columns = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/columns").get();
      const items = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/469d4c6a-b63b-4531-ab64-8d65bb17fb69/items?expand=fields(select=*)").get();

      // Initialize Graph Toolkit TeamsFx provider
      const provider = new TeamsFxProvider(teamsfx, scope);
      Providers.globalProvider = provider;
      Providers.globalProvider.setState(ProviderState.SignedIn);
      return { columns, items, dataMe };
    },
    { scope: ["User.Read"], credential: teamsUserCredential }
  );

  for (let index = 0; index < data?.items.value.length; index++) {
    if (data?.items.value[index].fields.CorreoDelAdministrador === data?.dataMe.mail) {
      setAdmin(true);
    }
  }
  useEffect(() => {
    reload();
  }, [])
  return admin ? (<></>)
    : (<></>)

}

export default Admin