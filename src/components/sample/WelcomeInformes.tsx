/* eslint-disable @typescript-eslint/no-unused-vars */
import { useData } from "@microsoft/teamsfx-react";
import { useContext, useState } from "react";
import { TeamsFxContext } from "../Context";
import ViewInforme from "./Informe";
import "./Welcome.css";

export function WelcomeInformes(props: {
  showFunction?: boolean;
  environment?: string;
}) {
  const [crumbs, setCrumbs] = useState(["Home", "Category", "Sub Category"]);

  const selected = (crumb: any) => {
    console.log(crumb);
  };

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
  const userName = loading || error ? "" : data!.displayName;

  return (
    <>
      <ViewInforme />
    </>
  );
}
