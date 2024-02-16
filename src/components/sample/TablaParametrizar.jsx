import {
    gridCellMultipleFocusableBehavior,
    gridCellWithFocusableElementBehavior
} from '@fluentui/accessibility';
import { CloseIcon, MoreIcon, TrashCanIcon } from '@fluentui/react-icons-northstar';
import { Button, Checkbox, Dialog, Flex, Grid, Label, MenuButton } from '@fluentui/react-northstar';
import { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { TeamsFxContext } from "../Context";
import "./TablaStyle.css";
import TableMain from './TableMain';
import "./Welcome.css";
import "./WelcomeParametrizar.css";


function Tabla({saveusername,
  setsaveusername,
  setOpendialog,
  opendialog
}) {

  const [iddelete, setiddelete] = useState('');
  const [advdelete, setadvdelete] = useState(false);
  const [statusdelete, setstatusdelete] = useState('');
  const [getmax, setgetmax] = useState('');
  const [getmin, setgetmin] = useState('');
  const [getescalamax, setgetescalamax] = useState('');
  const [getescalamin, setgetescalamin] = useState('');
  const [estadousu, setestadousu] = useState('');
  const [Estadousu, setEstadousu] = useState(false);
  const [escalatiempomin, setescalatiempomin] = useState('')
  const [escalatiempomax, setescalatiempomax] = useState('');
  const [permisos, setpermisos] = useState('');
  const [permisosindex, setpermisosindex] = useState('');

    const { teamsUserCredential } = useContext(TeamsFxContext); 
  let form  = {
    fields: {
      TiempoMinRespuesta: '',
      EscalaMin: '',
      TiempoMaxRespuesta: '',
      EscalaMax: '',      
    }
  };
  
  let formEstado  = {
      Estado: '' 
  };
    const { loading, error, data, reload } = useGraphWithCredential(
      async (graph, teamsfx, scope) => {

      
        const columns = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/columns").get();
        const items = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/items?expand=fields(select=*)").get(); 
        const getTiempo= await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/4a6f621c-c9cb-45db-8456-d4f467528557/items?expand=fields(select=*)"
        )
        .get();
        setgetmax(getTiempo.value[0].fields['TiempoMaxRespuesta']);
        setgetmin(getTiempo.value[0].fields['TiempoMinRespuesta']);
        setgetescalamax(getTiempo.value[0].fields['EscalaMax']);
        setgetescalamin(getTiempo.value[0].fields['EscalaMin']);
        
        setsaveusername(false);    
        
        
        
        if (iddelete!=='') {
          const resDelete = await graph.api(`/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/items/${iddelete}`).delete();
          setiddelete(''); 
          setstatusdelete('Ok');
          setadvdelete(false);
        }
        if (estadousu!=='') {
            const fieldValueSet = {
              Estado: Estadousu?'Activo':'Inactivo',          
          };
          const res = await graph
        .api(
          `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/items/${estadousu}/fields`
        )
        .update(fieldValueSet);
        }
        if (permisosindex!=='') {
          const fieldValueSet = {
            Permisos: permisos,          
        };
        const res = await graph
      .api(
        `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/items/${permisosindex}/fields`
      )
      .update(fieldValueSet);
      }
        if (form.fields.TiempoMinRespuesta!=='') {
          const fieldValueSet = {
            TiempoMinRespuesta: form.fields.TiempoMinRespuesta,          
        };
        
          const res = await graph
        .api(
          `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/4a6f621c-c9cb-45db-8456-d4f467528557/items/${getTiempo.value[0].id}/fields`
        )
        .update(fieldValueSet);  
        setgetmin('');
        } 
       
        if (escalatiempomin!=='') {
          const fieldValueSet = {
            EscalaMin: escalatiempomin,          
            };
            
          const res = await graph
        .api(
          `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/4a6f621c-c9cb-45db-8456-d4f467528557/items/${getTiempo.value[0].id}/fields`
        )
        .update(fieldValueSet);
        console.log(res);
        setescalatiempomin('');
        setgetescalamin(res.EscalaMin);
    
        
        
        } 
        if (form.fields.TiempoMaxRespuesta!=='') {
          const fieldValueSet = {
            TiempoMaxRespuesta: form.fields.TiempoMaxRespuesta,          
        };
          const res = await graph
        .api(
          `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/4a6f621c-c9cb-45db-8456-d4f467528557/items/${getTiempo.value[0].id}/fields`
        )
        .update(fieldValueSet);
        getmax('');
        }
        if (escalatiempomax!=='') {
          const fieldValueSet = {
            EscalaMax: escalatiempomax,          
        };
          const res = await graph
        .api(
          `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/4a6f621c-c9cb-45db-8456-d4f467528557/items/${getTiempo.value[0].id}/fields`
        )
        .update(fieldValueSet);

        setescalatiempomax('');
        setgetescalamax(res.EscalaMax);
        }
        
        
       
        // Initialize Graph Toolkit TeamsFx provider
        //const provider = new TeamsFxProvider(teamsfx, scope);
        //Providers.globalProvider = provider;
        //Providers.globalProvider.setState(ProviderState.SignedIn);
        return { columns ,items};
      },
      { scope: ["User.Read","Sites.Read.All"], credential: teamsUserCredential }
    ); 
const header = {
  items: [],  
};
useEffect(() => {
  reload();
}, [saveusername]);
useEffect(() => {
  reload();
}, [statusdelete]);




function handleChange(evt) {
  if (evt.target.name==='timpomin') {
    form.fields.TiempoMinRespuesta=evt.target.value
  }
  if (evt.target.name==='timpomax') {
    form.fields.TiempoMaxRespuesta=evt.target.value
  }  
};
function handleSelect(params) {
    if (params.name==='min') {
      setescalatiempomin(params.value)
      setgetescalamin(params.value);
    
    }
    if (params.name==='max') {
      setescalatiempomax(params.value)
      setgetescalamax(params.value);
    }
}
const inputItemsmin = [  
  {name:'min',label:'Días',value:'Días'},
  {name:'min',label:'Semana',value:'Semana'},
  {name:'min',label:'Mes',value:'Mes'},   
];
const inputItemsmax = [  
{name:'max',label:'Días',value:'Días'},
{name:'max',label:'Semana',value:'Semana'},
{name:'max',label:'Mes',value:'Mes'},   
];
const rowsPlain =[];
header.items.push({selector:"Habilitar",label:"Habilitar"})//agregado por sara
for (let index = 0; index < data?.columns.value.length; index++) {
  if(data?.columns.value[index].displayName==="Nombre"){   
    header.items.push({selector:data?.columns.value[index].displayName,label:"Nombre"})
  } 
  if(data?.columns.value[index].displayName==="Correo"){   
    header.items.push({selector:data?.columns.value[index].displayName,label:"Correo"})
    
  } 
  if(data?.columns.value[index].displayName==="Cargo"){ 
    header.items.push({selector:data?.columns.value[index].displayName,label:"Cargo"})  
  } 
  if(data?.columns.value[index].displayName==="Permisos"){  
    header.items.push({selector:data?.columns.value[index].displayName,label:"Permisos"}) 
  }
  if (data?.columns.value.length -1 === index) {
    header.items.push({selector:"AccionesPara",label:"Acciones"})
  }
}


  function handleRowClick(index) {   
    
    setadvdelete(true);
  }
 
  
  const moreOptionCell = {
    content: <Button tabIndex={-1} icon={<MoreIcon />} circular text iconOnly title="More options" />,
    truncateContent: true,
    accessibility: gridCellWithFocusableElementBehavior,
    onClick: e => {
      alert('more option button clicked');
      e.stopPropagation();
    },
  }
  const moreActionCell = {
    content: (
      <Flex gap="gap.small" vAlign="center">        
        <TrashCanIcon content="Delete" style={{cursor:'pointer'}}/>
        {/* table layout not support now more content in the cell */}
        {/* <Button tabIndex={-1} icon="edit" circular text iconOnly title="edit tags" /> */}
      </Flex>
    ),
    accessibility: gridCellMultipleFocusableBehavior,
  }
  const CheckOpc_2 = {
    content: ( 
      <Flex gap="gap.small" vAlign="center">
        <Checkbox size="small" secondary ><Checkbox content="check"/></Checkbox> 
      </Flex>
    ),
    accessibility: gridCellMultipleFocusableBehavior,
  }
  const contextMenuItems = ['Add to selection', 'Remove', 'Download']
  let conti = 1;
  let items=[];
  let contitem=1;
  let datarows = [];
  const dataItem = [];
  for (let index = 0; index < data?.items.value.length; index++) {   
    contitem=1;
    items=[];    
    datarows =[];
    dataItem.push({id:data?.items.value[index].id})
    rowsPlain.push(
      {
        key: conti,            
        'aria-labelledby': 'estado-1',
        'color':'red',
        children: (Component, { key, ...rest }) => (
          <MenuButton menu={contextMenuItems} key={key} contextMenu trigger={<Component {...rest} />} />
        )    
      }  
    );
    for (let indexB = 0; indexB < data?.columns.value.length; indexB++) {      
      if(data?.columns.value[indexB].displayName==="Nombre"){       
         for (const key in data?.items.value[index].fields) {
          if (key===data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) { 
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})      
              items.push({content:CheckOpc_2,key:`${data?.items.value[index].id}-${contitem}`})  
              items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`})
            }else{
              items.push(" ")
            }
            contitem++;
          }
        } 
      } 
      if(data?.columns.value[indexB].displayName==="Correo"){       
         for (const key in data?.items.value[index].fields) {
          if (key===data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {       
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})  
              items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`})
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            }else{
              items.push(" ")
            }
            contitem++;
          }
        } 
      } 
      if(data?.columns.value[indexB].displayName==="Cargo"){        
         for (const key in data?.items.value[index].fields) {
          if (key===data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {        
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName}) 
              items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`})
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
            }
            else{
              items.push(" ")
            }
            contitem++;
          }
        } 
      } 
      if(data?.columns.value[indexB].displayName==="Permisos"){       
         for (const key in data?.items.value[index].fields) {
          if (key===data?.columns.value[indexB].displayName) {
            if (Object.hasOwnProperty.call(data?.items.value[index].fields, key)) {  
              datarows.push({data:data?.items.value[index].fields[key],name:data?.columns.value[indexB].displayName})       
              items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`})
              // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
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
             datarows.push({data:data?.items.value[index].fields[key],name:"EstadoPara"})       
             items.push({content:data?.items.value[index].fields[key],key:`${data?.items.value[index].id}-${contitem}`})
             // rowsPlain[index].items.push({content:data?.items.value[index].fields,key:`${data?.items.value[index].id}-${contitem}`})
           }else{
             items.push(" ")
           }
           contitem++;
         }
       } 
     }
      if (data?.columns.value.length-1===indexB) {
        
        items.push({content:moreActionCell,key:`${data?.items.value[index].id}-${contitem}`,onClick: () => handleRowClick(data?.items.value[index].fields.id)})
      }
    }
    dataItem[index].items = datarows;     
    rowsPlain[index].items =  items;
    conti++;
  }  
  
  function handleApply() {
    reload();
  }
  useEffect(() => {
    reload();
  }, [iddelete])
  useEffect(() => {
      console.log(estadousu);
      reload();
      setestadousu('');
  }, [estadousu]) 
  useEffect(() => {
    console.log(permisosindex);
    reload();
    setpermisosindex('');
}, [permisosindex]) 



let optionmin = {name:'min',label:`${getescalamin}`,value:`${getescalamin}`};
let optionmax = {name:'max',label:`${getescalamax}`,value:`${getescalamax}`};

return <> 

<TableMain 
  header={header}
  rows={dataItem} 
  acciones={{delete:'delete'}}
  setiddelete={setiddelete}
  setestadousu={setestadousu}
  setEstadousu={setEstadousu}
  setpermisosindex={setpermisosindex}
  setpermisos={setpermisos}
  table={'tablepara'}/>
  <Label className="labelPlantillaParametriza" content="Establecer tiempos de respuesta" />
      <div className="pantallaparame">
          <Grid id="EmergenteParam" className="GridTiempos"
            columns={4}
            content={[
              <div id="Tminimo" className="GridEmergente">
              
              <Label className='LabelEmg' content="Tiempo mínimo" />
              <input 
                type='number'
                name='timpomin'
                id='timpomin'
                defaultValue={getmin}
                onChange={handleChange}/>
              <Label className='LabelEmg' content="Tiempo máximo"  />
              <input 
                type='number'
                name='timpomax'
                id='timpomax'
                defaultValue={getmax}
                onChange={handleChange}  />
                
            </div>,
              <div className='k'>
              <Select
                value={optionmin}
                options={inputItemsmin}
                
                onChange={(e) => handleSelect(e)}
              />
              <Select
              
                value={optionmax === ''?'':optionmax}
                options={inputItemsmax}
                onChange={(e) => handleSelect(e)}
              />
  
            </div>
            ]}
          />
          <div> 
              <Button className='btnAplicar' content={'Aplicar'} onClick={handleApply}primary></Button>
            </div>
          </div>
      <Dialog
        open={advdelete}
        onOpen={() => setadvdelete(true)}
        onCancel={() => {
          setadvdelete(false);
        }}
        onConfirm={() => {
          setadvdelete(false);
          reload();
        }}
        cancelButton='No'
        confirmButton="Si"
        content="Esta seguro que desea eliminar este usuario?"
        header=""
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => setadvdelete(false),
        }}
      />      
</>
}

export default Tabla;
