import { Image } from "@fluentui/react-northstar";
import { useData } from "@microsoft/teamsfx-react";
import { useContext, useState } from "react";
import { TeamsFxContext } from "../Context";
import { Graph } from "./Graph";
import "./Welcome.css";


export function Welcome(props: { showFunction?: boolean; environment?: string }) {
  const { showFunction, environment } = {
    showFunction: true,
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const friendlyEnvironmentName =
    {
      local: "local environment",
      azure: "Azure environment",
    }[environment] || "local environment";

  const steps = ["local", "azure", "publish"];
  const friendlyStepsName: { [key: string]: string } = {
    local: "1. Build your app locally",
    azure: "2. Provision and Deploy to the Cloud",
    publish: "3. Publish to Teams",
  };
  const [selectedMenuItem, setSelectedMenuItem] = useState("local");
  const items = steps.map((step) => {
    return {
      key: step,
      content: friendlyStepsName[step] || "",
      onClick: () => setSelectedMenuItem(step),
    };
  });

  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      console.log(userInfo);
      return userInfo;

    }
  });
  console.log(data);
  //const userName = (loading || error) ? "" : data!.displayName;
  return (
    <div className="welcomeCss">
      <Image src="Portada PGN.png" className="imagen" />
      <h1 className="center">Bienvenido a la aplicación para gestionar tu Paz y Salvo</h1>
      <div className="sections" >
        <Graph />


      </div>
    </div>
  );
}