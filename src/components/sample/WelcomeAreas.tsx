/* eslint-disable @typescript-eslint/no-unused-vars */
import { useData } from "@microsoft/teamsfx-react";
import { useContext, useState } from "react";
import { TeamsFxContext } from "../Context";
import CreateArea from "./CreateArea";
import SearchArea from "./SearchArea";
import TablaAreas from "./TablaAreas";
import "./Welcome.css";
export function WelcomeAreas(props: {
  showFunction?: boolean;
  environment?: string;
  rolespecifico?: string;
  authenticated?: boolean;
  setAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
      return userInfo;
    }
  });
  // const userName = (loading || error) ? "" : data!.displayName;
  return (
    <>
      <SearchArea />
      <CreateArea rol={props.rolespecifico} />
      <TablaAreas rol={props.rolespecifico} authenticated={props.authenticated} setAuthenticated={props.setAuthenticated} />
    </>
  );
}
