import { Button } from "@fluentui/react-northstar";
import { ProviderState, Providers } from '@microsoft/mgt-element';
import { TeamsFxProvider } from '@microsoft/mgt-teamsfx-provider';
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext } from "react";
import { TeamsFxContext } from "../Context";
import "./Graph.css";
import { PersonCardGraphToolkit } from './PersonCardGraphToolkit';

export function Graph() {
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      // Call graph api directly to get user profile information
      const profile = await graph.api("/me").get();

      // Initialize Graph Toolkit TeamsFx provider
      const provider = new TeamsFxProvider(teamsfx, scope);
      Providers.globalProvider = provider;
      Providers.globalProvider.setState(ProviderState.SignedIn);

      let photoUrl = "";
      try {
        const photo = await graph.api("/me/photo/$value").get();
        photoUrl = URL.createObjectURL(photo);
      } catch {
        // Could not fetch photo from user's profile, return empty string as placeholder.
      }
      return { profile, photoUrl };
    },
    { scope: ["User.Read"], credential: teamsUserCredential }
  );

  return (
    <div>
      <div className="Centrarbtn">
        <Button className="btnIngresar" primary content="Ingresar" disabled={loading} onClick={reload} />
      </div>
      <div >
        <PersonCardGraphToolkit loading={loading} data={data} error={error} />
      </div>
    </div>
  );
}
