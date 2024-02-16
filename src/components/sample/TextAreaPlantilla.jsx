import { Dialog } from '@fluentui/react-northstar';
import { ProviderState, Providers } from "@microsoft/mgt-element";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useEffect, useState } from 'react';
import { TeamsFxContext } from "../Context";
import "./Welcome.css";
const TextAreaPlantilla = () => {

  const [actualizarplan, setactualizarplan] = useState('');
  const [plantilla, setplantilla] = useState('');
  const [cambioupdate, setcambioupdate] = useState(false);
  const [mensajeupdate, setmensajeupdate] = useState(false);
    
      const { teamsUserCredential } = useContext(TeamsFxContext);
    const { loading, error, data, reload } = useGraphWithCredential(
        async (graph, teamsfx, scope) => {
          // Call graph api directly to get user profile information
          const columns = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/2dfcd421-b6ec-45a1-ae01-4dff92bf0f43/columns").get();
          const items = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/e31f7afb-c251-44f9-ae4e-2cafdc85132e/items/1").get();
          setplantilla(items.fields['TextoPlantilla']);
         
          if (cambioupdate) {
            const fieldValueSet = {
              TextoPlantilla: actualizarplan,
            };

            const items = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/e31f7afb-c251-44f9-ae4e-2cafdc85132e/items/1/fields").update(fieldValueSet);
           
            if (items) {
              const itemsupdate = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/e31f7afb-c251-44f9-ae4e-2cafdc85132e/items/1").get();
              setplantilla(itemsupdate.fields['TextoPlantilla']);
              setmensajeupdate(true);
              setcambioupdate(false);
              
            }
          }
          // Initialize Graph Toolkit TeamsFx provider
          const provider = new TeamsFxProvider(teamsfx, scope);
          Providers.globalProvider = provider;
          Providers.globalProvider.setState(ProviderState.SignedIn);
          return { columns ,items};
        },
        { scope: ["User.Read","Sites.Read.All"], credential: teamsUserCredential }
      );

function handelChange(e) {   
  
  if (e.target.value!==plantilla) {
    setactualizarplan(e.target.value);
    setcambioupdate(true);
    reload();
  }
}

useEffect(() => {
  reload();
}, [cambioupdate])


  return (
    <>
      <textarea
        className="TextArea1"
        inverted
        name='plantilla'
        onMouseOut={handelChange}
        defaultValue={plantilla}
      />
      <Dialog
      open={mensajeupdate}
      onOpen={() => setmensajeupdate(true)}
      onCancel={() => { setmensajeupdate(false)}}
      onConfirm={() => {setmensajeupdate(false)}}
      confirmButton="Aceptar"
      content="La plantilla de paz y salvos ha actualizado correctamente."
      header=""         
    />      
    </>
  );
  
};

export default TextAreaPlantilla;