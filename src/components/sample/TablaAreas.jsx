import {
  gridCellMultipleFocusableBehavior,
  gridCellWithFocusableElementBehavior
} from '@fluentui/accessibility';
import { useBooleanKnob } from '@fluentui/docs-components';
import { CloseIcon, EditIcon, MoreIcon, TrashCanIcon } from '@fluentui/react-icons-northstar';
import { Button, Checkbox, Dialog, Flex, MenuButton } from '@fluentui/react-northstar';
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TeamsFxContext } from "../Context";
import TableMain from './TableMain';
function Tabla({rol,authenticated,setAuthenticated}) {
  const [open, setOpen] = useBooleanKnob({
    name: 'open',
  })

  const [iddelete, setIddelete] = useState('');
  const [checkAc, setCheckAc] = useState(false);
  const [statusdelete, setstatusdelete] = useState(false);
  const [indexcheck, setIndexcheck] = useState('');  
  const [estadodelete, setestadodelete] = useState('');
  const history = useNavigate();
    const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {   
      if (iddelete!=='') {
        const resDelete = await graph.api(`/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items/${iddelete}`).delete();
        resDelete.status = 204
        return { resDelete };
       }
      if (indexcheck!=='') {
        const fieldValueSet = {
          Estado: checkAc?'Activa':'Inactiva',          
      };
        const res = await graph
          .api(
            `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items/${indexcheck}/fields`
          )
          .update(fieldValueSet);
      }
      
      // Call graph api directly to get user profile information
      const columns = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/columns").get();
      const items = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items?expand=fields(select=*)").get();
      //if (!authenticated) {
      //await teamsfx.login(scope);
      //Initialize Graph Toolkit TeamsFx provider      
      //const provider = new TeamsFxProvider(teamsfx, scope);
      //Providers.globalProvider = provider;
      //Providers.globalProvider.setState(ProviderState.SignedIn);
      //setAuthenticated(true);
      //}
      
      return { columns, items };
    },
    { scope: ["User.Read", "Sites.Read.All"], credential: teamsUserCredential }
  );
  const header = {
    items: [{selector:'',label:''}],
  };
  const [opendialog, setOpendialog] = useState(false);
  const rowsPlain =[];
useEffect(() => {
  console.log(statusdelete);  
  reload();
  setstatusdelete(false);
}, [statusdelete])

 
  for (let index = 0; index < data?.columns.value.length; index++) {
    
    if (data?.columns.value[index].displayName === "NombreArea") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Nombre de área"})
    }
    
    if (data?.columns.value[index].displayName === "AdministradorArea") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Administrador de área"})
    }
    if (data?.columns.value[index].displayName === "CorreoAdmin") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Correo Administrador"})
    }
    if (data?.columns.value[index].displayName === "Aprobador") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Aprobador"})
    }   
    if (data?.columns.value[index].displayName === "CorreoAprobador") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Correo Aprobador"})
    }
    if (data?.columns.value[index].displayName === "Estado") {
      header.items.push({selector:data?.columns.value[index].displayName,label:data?.columns.value[index].displayName})
    }
    if (data?.columns.value.length - 1 === index) {
      header.items.push({selector:'Acciones',label:"Acciones"})
    }
  }
  function handleRowClick(index) {
    console.log(index);
    setIddelete(index);
    reload();
  }
  function checkClick(index){
    reload();
  } 

  let refresh = () =>{

    setOpendialog(false); 
    reload();  
    setIddelete('');
    setstatusdelete(true);
    
  }



  

  useEffect(() => {
    console.log(checkAc);
    reload();
    setIndexcheck('');  
  }, [indexcheck]);
  useEffect(() => {
    if (iddelete!=='') {
      setOpendialog(true);
    }    
  }, [iddelete])
  useEffect(() => {
    setstatusdelete('');   
    reload();   
  }, [])
 
  
  const moreOptionCell = {
    content: <Button tabIndex={-1} icon={<MoreIcon />} circular text iconOnly title="More options" />,
    truncateContent: true,
    accessibility: gridCellWithFocusableElementBehavior,
    onClick: e => {
      alert('more option button clicked')
      e.stopPropagation()
    },
  }
  const moreActionCell = {
    content: (
      <Flex gap="gap.small" vAlign="center">
        <Button tabIndex={1} role="Edit" icon={<EditIcon/>}  circular text iconOnly title="Edit" />     
        <Button tabIndex={2} role="Delete" icon={<TrashCanIcon />} circular text iconOnly title="Delete" />
        {/* table layout not support now more content in the cell */}
        {/* <Button tabIndex={-1} icon="edit" circular text iconOnly title="edit tags" /> */}
      </Flex>
    ),
    accessibility: gridCellMultipleFocusableBehavior,
  }
  const CheckOpc = {
    content: (
      <Flex gap="gap.small" vAlign="center">
        <Checkbox size="small" secondary ><Checkbox content="check" /></Checkbox>
      </Flex>
    ),
    accessibility: gridCellMultipleFocusableBehavior,

  }
  const contextMenuItems = ['Add to selection', 'Remove', 'Download']
  let conti = 1;
  let items = [];
  let contitem = 1;
  const dataItem = [];
  let datarows = []
  for (let index = 0; index < data?.items.value.length; index++) {
    contitem = 1;
    items = [];
    datarows =[];
    dataItem.push({id:data?.items.value[index].id})
    rowsPlain.push(
      {
        key: conti,
        'aria-labelledby': 'estado-1',
        'color': 'red',
        children: (Component, { key, ...rest }) => (
          <MenuButton menu={contextMenuItems} key={key} contextMenu trigger={<Component {...rest} />} />
        )
      }
    );
    for (let indexB = 0; indexB < data?.columns.value.length; indexB++) {
      /*
      if (data?.columns.value[indexB].displayName === "ID") {
        for (const key in data?.items.value[index].fields) {
          if (key === 'id') {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {
              items.push({ content: data?.items.value[index].fields[key], key: `${data?.items.value[index].id}-${contitem}` })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push(" ")
            }
            contitem++;
          }
        }
      }*/
      if (data?.columns.value[indexB].displayName === "CorreoAdmin") {
        for (const key in data?.items.value[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: data?.items.value[index].fields[key], key: `${data?.items.value[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }   
      if (data?.columns.value[indexB].displayName === "CorreoAprobador") {
        for (const key in data?.items.value[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: data?.items.value[index].fields[key], key: `${data?.items.value[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
     
      
      if (data?.columns.value[indexB].displayName === "Aprobador") {
        for (const key in data?.items.value[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: data?.items.value[index].fields[key], key: `${data?.items.value[index].id}-${contitem}`, truncateContent: false })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }    
      
      if (data?.columns.value[indexB].displayName === "AdministradorArea") {
        for (const key in data?.items.value[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: data?.items.value[index].fields[key], key: `${data?.items.value[index].id}-${contitem}`, truncateContent: false })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }      
      
      if (data?.columns.value[indexB].displayName === "Estado") {
        for (const key in data?.items.value[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: data?.items.value[index].fields[key], key: `${data?.items.value[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
      if (data?.columns.value[indexB].displayName === "NombreArea") {
        for (const key in data?.items.value[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: CheckOpc, key: `${data?.items.value[index].id}-${contitem}`})
              items.push({ content: data?.items.value[index].fields[key], key: `${data?.items.value[index].id}-${contitem}`, truncateContent: false })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
      if (data?.columns.value.length - 1 === indexB) {
        items.push({ content: moreActionCell, key: `${data?.items.value[index].id}-${contitem}`, onClick: () => handleRowClick(data?.items.value[index].fields.id), truncateContent: false })
      }
    }
    dataItem[index].items = datarows;
    rowsPlain[index].items = items;
    conti++;
  }

  return( <> 
  <div style={{ justifyContent:'center' }}>
  {statusdelete !== 'Ok' && <TableMain checkAc={checkAc} setCheckAc={setCheckAc} 
          rol={rol}
          paginador={true}
          table={'tableareas'}          
          setIndexcheck={setIndexcheck} indexcheck={indexcheck}
          check={false} acciones={{edit:'edit',delete:'delete'}} header={header} setIddelete={setIddelete} rows={dataItem}/>
      }
  </div>
    
   
    <Dialog
      open={opendialog}
      onOpen={() => setOpendialog(true)}
      onCancel={() => {
        setIddelete('');
        setOpendialog(false)}}
      onConfirm={() => {
        refresh();        
        }}
      cancelButton="No"
      confirmButton="Si"
      content="Antes de elminar el área por favor verificar que no cuente con aprobaciones pendientes"
      header="Eliminar Area"
      headerAction={{ icon: <CloseIcon />, title: 'Close', onClick: () => setOpendialog(false) }}      
    />
    </>);
}

export default Tabla;
