/* eslint-disable @typescript-eslint/no-unused-vars */
import { useData } from "@microsoft/teamsfx-react";
import { useContext, useState } from "react";
import { TeamsFxContext } from "../Context";
import Search from "./Search";
import TablaGestionD from "./TablaGestionD";
import "./Welcome.css";

export function WelcomeGestion(props: {
  showFunction?: boolean;
  environment?: string;
  rolespecifico?: any
}) {
  const [crumbs, setCrumbs] = useState(["Home", "Category", "Sub Category"]);

  const selected = (crumb: any) => {
    console.log(crumb);
  };
  console.log(props.rolespecifico);

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
      {/* <Breadcrumb crumbs={crumbs} selected={selected} /> */}
      <div className="bodySoli">
        <Search />
        <TablaGestionD />
      </div>
    </>
    // <div className="welcome page">
    //   <div className="narrow page-padding">
    //     <Image src="hello.png" />
    //     <h1 className="center">Congratulations{userName ? ", " + userName : ""}!</h1>
    //     <p className="center">Your app is running in your {friendlyEnvironmentName}</p>
    //     <Menu defaultActiveIndex={0} items={items} underlined secondary />
    //     <div className="sections">
    //       {selectedMenuItem === "local" && (
    //         <div>
    //           <EditCode showFunction={showFunction} />
    //           <CurrentUser userName={userName} />
    //           <Graph />
    //           {showFunction && <AzureFunctions />}
    //         </div>
    //       )}
    //       {selectedMenuItem === "azure" && (
    //         <div>
    //           <Deploy />
    //         </div>
    //       )}
    //       {selectedMenuItem === "publish" && (
    //         <div>
    //           <Publish />
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}
