import {
    gridCellMultipleFocusableBehavior,
    gridCellWithFocusableElementBehavior
} from '@fluentui/accessibility';
import { EyeIcon, MoreIcon } from '@fluentui/react-icons-northstar';
import { Button, Flex, MenuButton } from '@fluentui/react-northstar';
import { useContext, useState } from 'react';
import "./TablaAreas.css";


import { useNavigate } from "react-router-dom";
import { TeamsFxContext } from "../Context";
import TableMain from './TableMain';



function TablaHistorial() {
  const history = useNavigate();
  const [idForm, setIdForm] = useState("");
  const [correoperso, setcorreoperso] = useState('');
  const [view, setView] = useState('');
    const { teamsUserCredential } = useContext(TeamsFxContext); 
    const { loading, error, data, reload } = useGraphWithCredential(
      async (graph, teamsfx, scope) => {

        //await teamsfx.login(scope);
      
       
        // Initialize Graph Toolkit TeamsFx provider
        //const provider = new TeamsFxProvider(teamsfx, scope);
        //Providers.globalProvider = provider;
        //Providers.globalProvider.setState(ProviderState.SignedIn);
        const dataForm = await graph.api(`/me`).get();
        // Call graph api directly to get user profile information
        const columns = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/columns").get();
        const items = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items?expand=fields(select=*)").get();

        return { columns ,items,dataForm};
      },
      { scope: ["User.Read","Sites.Read.All"], credential: teamsUserCredential }
    ); 
console.log(data?.itemsatach);
const header = {
  items: [{selector:'',label:''}],
};
const rowsPlain =[];
for (let index = 0; index < data?.columns.value.length; index++) {  
  if(data?.columns.value[index].displayName==="ID"){   
    header.items.push({selector:data?.columns.value[index].displayName,label:"ID"})
  }    
  if(data?.columns.value[index].displayName==="Motivo"){   
    header.items.push({selector:data?.columns.value[index].displayName,label:"Motivo"})
  } 
  if(data?.columns.value[index].displayName==="FechaCreado"){   
    header.items.push({selector:data?.columns.value[index].displayName,label:"Fecha Creado"})
  } 
  if(data?.columns.value[index].displayName==="FechaAprobado"){   
    header.items.push({selector:data?.columns.value[index].displayName,label:"Fecha aprobación"})
  }
  if(data?.columns.value[index].displayName==="Estado"){   
    header.items.push({selector:'EstadoSoli',label:"Estado"})
  }
  if(data?.columns.value[index].displayName==="AdjuntoBase"){   
    header.items.push({selector:data?.columns.value[index].displayName,label:"Certificado"})
  }

  
  

  if (data?.columns.value.length - 1 === index) {
    header.items.push({selector:'Acciones',label:"Acciones"})
  }
};
  


  const moreOptionCell = {
    content: <Button tabIndex={-1} icon={<MoreIcon />} circular text iconOnly title="More options" />,
    truncateContent: true,
    accessibility: gridCellWithFocusableElementBehavior,
    onClick: e => {
      alert('more option button clicked')
      e.stopPropagation()
    },
  }
  function handleRowClick(index) {   
    setIdForm(index);
    history.push(`/nuevassolicitudes/${Number(index)}`);
  }
  
  const moreActionCell = {
    content: ( 
      <Flex gap="gap.small" vAlign="center">
        <Button className="btnVer" size="small" secondary ><EyeIcon content="Detalle"/></Button> 
        
        {/* table layout not support now more content in the cell */}
        {/* <Button tabIndex={-1} icon="edit" circular text iconOnly title="edit tags" /> */}
      </Flex>
    ),
    accessibility: gridCellMultipleFocusableBehavior,
  }

  const contextMenuItems = ['Add to selection', 'Remove', 'Download']
  let conti = 1;
  let items=[];
  let contitem=1;
  const dataItem = [];
  let datarows = [];
  console.log(data?.items);
  for (let index = 0; index < data?.items.value.length; index++) {   
    contitem=1;
    items=[];  
    datarows =[];
    dataItem.push({id:data?.items.value[index].id})  
    rowsPlain.push(
      {
        key: conti,                 
        'aria-labelledby': 'estado-1',       
        children: (Component, { key, ...rest }) => (
          <MenuButton menu={contextMenuItems} key={key} contextMenu trigger={<Component {...rest} />} />
        )    
      }  
    );
    for (let indexB = 0; indexB < data?.columns.value.length; indexB++) { 
      if (data?.items.value[index].fields['CorreoSolicitante']===data?.dataForm['mail']) {
           if(data?.columns.value[indexB].displayName==="ID"){   
         for (const key in data?.items.value[index].fields) {
          if (key==='id') {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})             
              items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`,id:'IDColumn',truncateContent:true})
            }else{
              items.push(" ")
            } 
            contitem++;
          }
        } 
      } 
      if(data?.columns.value[indexB].displayName==="Documento"){      
        for (const key in data?.items.value[index].fields) {
         if (key===data?.columns.value[indexB].displayName) {
           if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {     
             datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})  
             items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`,truncateContent:true})
           }else{
             items.push(" ")
           }
           contitem++;
         }
       } 
     } 
      
      
       
      if(data?.columns.value[indexB].displayName==="Motivo"){      
         for (const key in data?.items.value[index].fields) {
          if (key===data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {     
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})  
              items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`,truncateContent:true})
            }else{
              items.push(" ")
            }
            contitem++;
          }
        } 
      }  
      if(data?.columns.value[indexB].displayName==="FechaAprobado"){       
        for (const key in data?.items.value[index].fields) {
         if (key===data?.columns.value[indexB].displayName) {
           if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {  
             datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})  
             items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`,truncateContent:true})
           }else{
             items.push(" ")
           }
           contitem++;
         }
       } 
     }
      if(data?.columns.value[indexB].displayName==="FechaCreado"){       
         for (const key in data?.items.value[index].fields) {
          if (key===data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {  
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})  
              items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`,truncateContent:true})
            }else{
              items.push(" ")
            }
            contitem++;
          }
        } 
      }  
      if(data?.columns.value[indexB].displayName==="Estado"){
         for (const key in data?.items.value[index].fields) {
          if (key===data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {             
              datarows.push({data:data?.items.value[index].fields[key],name:'EstadoSoli'})  
              items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`})
            }else{
              items.push(" ")
            }
            contitem++;
          }
        } 
      }
      if(data?.columns.value[indexB].displayName==="AdjuntoBase"){
        for (const key in data?.items.value[index].fields) {
         if (key===data?.columns.value[indexB].displayName) {
           if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {             
             datarows.push({data:data?.items.value[index].fields[key],name:'Certificado'})  
             items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`})
           }else{
             items.push(" ")
           }
           contitem++;
         }
       } 
     }
      if (data?.columns.value.length-1===indexB) {
        items.push({content:moreActionCell,key:`${data?.items.value[index].id}-${contitem}`, onClick: () => handleRowClick(data?.items.value[index].fields.id)})
      }

    } 
    dataItem[index].items = datarows;
    rowsPlain[index].items =  items;
    conti++;
    }
  }  
  
  return (<>
  <div style={{           
            justifyContent:'center'            
          }}><TableMain paginador={true} check={false} table={'tablehistorial'} acciones={{ver:'archivo'}} header={header}  rows={dataItem} view={view} setView={setView}/></div>
  
  </>);

}

export default TablaHistorial;
