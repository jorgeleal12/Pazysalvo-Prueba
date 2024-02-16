import {
    gridCellMultipleFocusableBehavior,
    gridCellWithFocusableElementBehavior
} from "@fluentui/accessibility";
import { MoreIcon, SyncIcon, UrgentIcon } from "@fluentui/react-icons-northstar";
import { Button, CloseIcon, Dialog, Flex, MenuButton } from "@fluentui/react-northstar";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamsFxContext } from "../Context";
import "./TablaAreas.css";
import TableMain from './TableMain';

function Tabla(params,jefein,adminGen) {
  const history = useNavigate();
  const [idItem, setIdItem] = useState("");
  let Datenow= new Date()
  let fieldValueSet = {
    Estado: "",
    FechaAprobado:''
  };
 console.log(params);
  const [aprob, setAprob] = useState(true);
  const [alert, setAlert] = useState('');
  const [idarea, setArea] = useState('');
  const [menssageerror, setmenssageerror] = useState(false)
  const [aprobAdmin, setAprobAdmin] = useState(false);
    const { teamsUserCredential } = useContext(TeamsFxContext);
  const [menssageerrorjefe, setmenssageerrorjefe] = useState(false);
  const [mensaggePendiete, setmensaggePendiete] = useState(false);
  const [menssageArea, setmenssageArea] = useState(false);
  const [refrestb, setrefrestb] = useState(false);
  const [correoaprobador, setcorreoaprobador] = useState('');
  const [indexarea, setindexarea] = useState('');
  const [aprobadook, setaprobadook] = useState(false);
  const [rolespecifico, setrolespecifico] = useState(null);
  const [correologeado, setcorreologeado] = useState('');
  const [updateaprobado, setupdateaprobado] = useState(false);
  const [idaprobtable, setidaprobtable] = useState('');
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {

      // Call graph api directly to get user profile information
      const columns = await graph
      .api(
        "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/11e5896f-d46e-47a7-a759-74d9d34aa39b/columns"
      )
      .get();
    const items = await graph
      .api(
        "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/11e5896f-d46e-47a7-a759-74d9d34aa39b/items?expand=fields(select=*)"
      )
      .get();
      const dataForm = await graph.api(`/me`).get();
      const dataParam = await graph
      .api(
        `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/items?expand=fields(select=*)`
      )
      .get();
      const aprob = await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/2dfcd421-b6ec-45a1-ae01-4dff92bf0f43/items?expand=fields(select=*)"
        )
        .get();
        console.log(aprob);
        if (idItem!=="") {
          const aprobAreas = await graph  
          .api(
            `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/11e5896f-d46e-47a7-a759-74d9d34aa39b/items/${idItem}`
          )
          .get();
          dataParam.value.forEach((element) => {
            if (element.fields['Correo']===dataForm['mail']) { 
              setcorreologeado(dataForm['mail']); 
              setrolespecifico(element.fields['Permisos']);     
            }
          });
          let updateAprob=false;
          for (let index = 0; index < aprob.value.length; index++) {
            const element = aprob.value[index].fields;
            console.log(element.CorreodelAprobador,'tabla apobador 85');            
             if (dataForm['mail'] === element.CorreodelAprobador) {             
                console.log('true');              
                updateAprob=true;
              } 
          }
          if (dataForm['mail'] === correoaprobador && updateAprob ) {
            if (fieldValueSet.Estado === "Aprobado" && idItem !== "") {  
                 await graph
                    .api(
                      `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/11e5896f-d46e-47a7-a759-74d9d34aa39b/items/${idItem}/fields`
                    )
                    .update(fieldValueSet);
                    //setrefrestb(true);
                    }  
          } else {
            setmenssageerror(true);    
            //setrefrestb(true);        
          }
    }

      if (alert!=="" && idarea!=="") {
        const fieldValuearea= {
          Alertar: 'si',
      };
        await graph
            .api(
              `groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/11e5896f-d46e-47a7-a759-74d9d34aa39b/items/${idarea}/fields`
            )
            .update(fieldValuearea);
      }
      if (aprobAdmin) {
        const fieldAprobAdmin= {
          Estado: 'Aprobado',
      };      
        await graph.api(`/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items/${Number(params.params)}/fields`).update(fieldAprobAdmin);
       
      }

      // Initialize Graph Toolkit TeamsFx provider
      //const provider = new TeamsFxProvider(teamsfx, scope);
      //Providers.globalProvider = provider;
      //Providers.globalProvider.setState(ProviderState.SignedIn);
      return { columns, items };
    },
    {
      scope: ["User.Read", "Sites.Read.All", "Application.ReadWrite.All"],
      credential: teamsUserCredential,
    }
  );
  console.log(data?.items['value']);
const header = {
  items: [{selector:'',label:''}],
};
  const rowsPlain = [];
  for (let index = 0; index < data?.columns.value.length; index++) {
    if (data?.columns.value[index].displayName === "Estado") {
      header.items.push({selector:'EstadoAprob',label:"Estado"}); 
    }
    if (data?.columns.value[index].displayName === "Area") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Área"});
    }
    if (data?.columns.value[index].displayName === "AprobadorDeArea") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Aprobador de área"});
    }
    if (data?.columns.value[index].displayName === "CorreoDelAprobador") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Correo del aprobador"});
    }
    if (data?.columns.value[index].displayName === "Alertar" && params.table === 'solicitud') {
      header.items.push({selector:data?.columns.value[index].displayName,label:data?.columns.value[index].displayName});
    }
    if (data?.columns.value[index].displayName === "Contactar" && params.table === 'historial') {
      header.items.push({selector:data?.columns.value[index].displayName,label:data?.columns.value[index].displayName});
    }
    if (data?.columns.value[index].displayName === "Pendientes" && params.table === 'historial' ) {
      header.items.push({selector:data?.columns.value[index].displayName,label:data?.columns.value[index].displayName});
    }
    if (data?.columns.value[index].displayName === "Pendientes" && params.table === 'solicitud' ) {
      header.items.push({selector:'PendientesSolicitud',label:data?.columns.value[index].displayName});
    }
    if (data?.columns.value[index].displayName === "AdministradorDeArea") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Administrador de área"});
    }
    if (data?.columns.value[index].displayName === "CorreoDelAdministrador") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Correo del administrador"});
    }
    if (data?.columns.value[index].displayName === "FechaLimite") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Fecha límite"});
    }
    if (data?.columns.value[index].displayName === "FechaAprobado") {
      header.items.push({selector:data?.columns.value[index].displayName,label:"Fecha aprobado"});
    }
    
  }

  // function handleRowClick(index) {
  //   setIdForm(index);

  // }

  const moreOptionCell = {
    content: (
      <Button
        tabIndex={-1}
        icon={<MoreIcon />}
        circular
        text
        iconOnly
        title="More options"
      />
    ),
    truncateContent: true,
    accessibility: gridCellWithFocusableElementBehavior,
    onClick: (e) => {
      alert("more option button clicked");
      e.stopPropagation();
    },
  };
  function handleRowClick(index) {
    fieldValueSet.Estado = "Aprobado";
    fieldValueSet.FechaAprobado=Datenow.toLocaleDateString();
    setIdItem(index);
    reload();
  }
  function handleConfirm(){
    fieldValueSet.Estado = "";
    fieldValueSet.FechaAprobado='';
    setIdItem('index');
    setmenssageerror(false);
  }
  function handleRowAlert(index) {
    setAlert("si");
    setArea(index);
    reload();
  }
  const moreActionCell = {
    content: (
      <Flex gap="gap.small" vAlign="center">
        <Button size="small" secondary>
          <UrgentIcon className="btnAlerta"/>
        </Button>
        {/* table layout not support now more content in the cell */}
        {/* <Button tabIndex={-1} icon="edit" circular text iconOnly title="edit tags" /> */}
      </Flex>
    ),
    accessibility: gridCellMultipleFocusableBehavior,
  };

  useEffect(() => {
    console.log(indexarea);
    if(params.table!=="historial"){
      params.setidatableprob(indexarea);
    } 
  }, [indexarea])
  useEffect(() => {
    TableMain
  }, [refrestb])
  useEffect(() => {
    console.log(correoaprobador);
  }, [correoaprobador])
  
  
  
  function handleAprob() {
    let aprobado=false;
    
    for (let index = 0; index < data?.items.value.length; index++) {
      if (data?.items.value[index].fields.IDSolicitud===Number(params.params)) {
        
        if (data?.items.value[index].fields.Estado==="Aprobado") {
          
          aprobado=true;
        }
        else{
          aprobado=false;         
        }
      }
    }
    console.log(aprobado);
    if(!aprobado){
      setmensaggePendiete(true);
    }else{
      setAprobAdmin(true);
      setaprobadook(true);
    }   
  }
function handleArea() {
  setmenssageArea(true);
}
  const contextMenuItems = ["Add to selection", "Remove", "Download"];
  let conti = 1;
  let items = [];
  let contitem = 1;
  let itemAprobs=[];
  const dataItem = [];
  let datarows = [];
  for (let index = 0; index < data?.items.value.length; index++) {
   
  if (data?.items.value[index].fields.IDSolicitud===Number(params.params)) { 
  console.log(data?.items.value[index].fields); 
   itemAprobs.push(data?.items.value[index]);
    }
  }
  
  
  for (let index = 0; index < itemAprobs.length; index++) {
   console.log(itemAprobs[index]);
    contitem = 1;
    items = [];
    datarows =[];
    dataItem.push({id:itemAprobs[index].id})
    rowsPlain.push({
      key: conti,
      "aria-labelledby": "estado-1",
      children: (Component, { key, ...rest }) => (
        <MenuButton
          menu={contextMenuItems}
          key={key}
          contextMenu
          trigger={<Component {...rest} />}
        />
      ),
    });
    for (let indexB = 0; indexB < data?.columns.value.length; indexB++) {      
      if (data?.columns.value[indexB].displayName === "Estado") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:'EstadoAprob'})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: true })              
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }   
      if (data?.columns.value[indexB].displayName === "Area") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
     
      
      if (data?.columns.value[indexB].displayName === "AprobadorDeArea") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: false })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }    
      
      if (data?.columns.value[indexB].displayName === "CorreoDelAprobador") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: false })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }      
      
      if (data?.columns.value[indexB].displayName === "Alertar") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
      if (data?.columns.value[indexB].displayName === "AdministradorDeArea") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
      if (data?.columns.value[indexB].displayName === "CorreoDelAdministrador") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
      if (data?.columns.value[indexB].displayName === "FechaLimite") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
      if (data?.columns.value[indexB].displayName === "FechaAprobado") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
      if (data?.columns.value[indexB].displayName === "Pendientes") {
        for (const key in itemAprobs[index].fields) {
          if (key === data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(itemAprobs[index].fields, key)) {
              datarows.push({data:itemAprobs[index].fields[key],name:data?.columns.value[indexB].displayName})
              items.push({ content: itemAprobs[index].fields[key], key: `${itemAprobs[index].id}-${contitem}`, truncateContent: true })
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            } else {
              items.push("espacio")
            }
            contitem++;
          }
        }
      }
    }
    dataItem[index].items = datarows;
    rowsPlain[index].items = items;
    conti++;
 
}
let chekeable ;
if (params.table==='historial') {
  useEffect(() => {
    let notiusuario= '';
    let base64='';
  for (let index = 0; index < data?.items['value'].length; index++) {
    if (data?.items['value'][index]['id']===params.indexaprobnoti) {
      notiusuario= data?.items['value'][index]['fields'].TextoNoti !==''? data?.items['value'][index]['fields'].TextoNoti:'';
      base64= data?.items['value'][index]['fields'].AdjuntoNoti !==''? data?.items['value'][index]['fields'].AdjuntoNoti:'';
      params.setmensajeusufinalactual(data?.items['value'][index]['fields'].TextoNotiUsu!=='' ? data?.items['value'][index]['fields'].TextoNotiUsu:'');
    } 
  }
      params.setmensajeaprob(notiusuario);
      params.setbase64(base64);
}, [params.indexaprobnoti])
chekeable=false;
}
if (params.table==='solicitud') {  
  useEffect(() => {
    
  for (let index = 0; index < data?.items['value'].length; index++) {
    if (data?.items['value'][index]['id']===indexarea) {
      params.setmensajeusufinal(data?.items['value'][index]['fields'].TextoNotiUsu !=='' ? data?.items['value'][index]['fields'].TextoNotiUsu:'' );
      
      params.setusunotfibase64(data?.items['value'][index]['fields'].AdjuntoNotiUsu!=='' ?data?.items['value'][index]['fields'].AdjuntoNotiUsu:'');
      params.setmensajeactual(data?.items['value'][index]['fields'].TextoNoti!=='' ? data?.items['value'][index]['fields'].TextoNoti : '');
      params.setbase64actual(data?.items['value'][index]['fields'].AdjuntoNoti!=='' ?data?.items['value'][index]['fields'].AdjuntoNoti:'');
    } 
  }

  
  
}, [params.mensajeusufinal,indexarea])
chekeable=true;
}

function handleRefresh() {
  reload();
}

let Aprob = 'Aprobador';
let JefeD= 'Jefe directo'; 
let permisoaprob = false;
let permisojefe = false;
if (params.rol === Aprob ) { 
  permisoaprob =true;    
  permisojefe = false;
 }else if(params.rol=== JefeD ){
   permisojefe = true;
   permisoaprob =false;  
 }else{
  permisojefe = false;
  permisoaprob =false;  
 }
//onClick: () => handleRowClick(itemAprobs[index].fields.id),
  return (
    <>
    {indexarea!=='' && permisoaprob ?
      <Button className="btnApro" primary  content="Aprobar área" onClick={()=>handleRowClick(indexarea)}/>:<></>
    }                 
    <SyncIcon  onClick={()=>handleRefresh()}/>
   {permisojefe && params.correojefeinme === params.correo ? <Button className="btnApro" primary  content="Aprobar" onClick={()=>handleAprob()}/>:''}
    <div style={{           
            justifyContent:'center'
          }}><TableMain  paginador={false}
          handleRowAlert={handleRowAlert} 
          check={chekeable}
          setidaprobtable={setidaprobtable}
          table={'tableaprobador'}
          setcorreoaprobador={setcorreoaprobador}
          setindexarea={setindexarea}
          setnotificacion={params.setnotificacion}
          setindexaprobnoti={params.setindexaprobnoti}
          setnotificacionusufinal = {params.setnotificacionusufinal}

          acciones={{edit:'edit',delete:'delete'}} header={header}  rows={dataItem}/></div>
           
    
    <Dialog
      open={menssageerror}
      onOpen={() => setmenssageerror(true)}
      onCancel={() => {        
        setmenssageerror(false)}}
      onConfirm={() => {
        handleConfirm();
                      }}      
      confirmButton="Continuar"
      content="No puedes aprobar un área a la cual no estás asignado"
      header=""
      headerAction={{ icon: <CloseIcon />, title: 'Close', onClick: () => setmenssageerror(false) }}      
    />
    <Dialog
      open={menssageerrorjefe}
      onOpen={() => setmenssageerrorjefe(true)}
      onCancel={() => {        
        setmenssageerrorjefe(false)}}
      onConfirm={() => {
        setmenssageerrorjefe(false);
                      }}      
      confirmButton="Continuar"
      content="no tienes permitido aprobar esta solicitud"
      header=""
      headerAction={{ icon: <CloseIcon />, title: 'Close', onClick: () => setmenssageerrorjefe(false) }}      
    />
    <Dialog
      open={mensaggePendiete}
      onOpen={() => setmensaggePendiete(true)}
      onCancel={() => {        
        setmensaggePendiete(false)}}
      onConfirm={() => {
        setmensaggePendiete(false);
                      }}      
      confirmButton="Continuar"
      content="Aún existen áreas pendientes por aprobar."
      header=""
      headerAction={{ icon: <CloseIcon />, title: 'Close', onClick: () => setmenssageArea(false) }}      
    />
   
    <Dialog
      open={aprobadook}
      onOpen={() => setaprobadook(true)}
      onCancel={() => {        
        setaprobadook(false)}}
      onConfirm={() => {
        reload();
        setaprobadook(false);        
        history.push(`/solicitud`);
                      }}      
      confirmButton="Continuar"
      content="La solicitud ha sido aprobada exitosamente, en unos minutos el paz y salvo será enviado al correo del solicitante."
      header=""
      headerAction={{ icon: <CloseIcon />, title: 'Close', onClick: () => setaprobadook(false) }}      
    />

    </>
  );
}

export default Tabla;
