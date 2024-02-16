import { useEffect, useState } from "react";
import FormMisDatos from "./FormMisDatos";
import FormOtroUsu from "./FormOtroUsu";
import "./Welcome.css";



export function WelcomeDatos() {
  const [disable, setDisable] = useState()
 
  useEffect(() => {
   
  }, [])
  
  

  
  return (
    <>
    
       <FormMisDatos disable={disable} setDisable={setDisable}/> : <FormOtroUsu/>
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
