import { useState } from "react";

import {
  EditIcon,
  EyeIcon,
  FilesPdfColoredIcon,
  PresenceAvailableIcon,
  TrashCanIcon,
  UrgentIcon
} from "@fluentui/react-icons-northstar";
import { Checkbox, ExclamationTriangleIcon } from "@fluentui/react-northstar";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "./TableMain.css";



const TableMain = ({
  checkAc,
  setCheckAc,
  check,
  acciones,
  header,
  setIddelete,
  rows,
  indexcheck,
  setIndexcheck,
  paginador,
  handleRowAlert,
  table,
  setindexarea,
  setcorreoaprobador,
  setiddelete,
  setestadousu,
  setEstadousu,
  setidaprobtable,
  rol,
  setindexupdatetr,
  setestadotramite,
  setpermisos,
  setpermisosindex,
  setnotificacion,
  setindexaprobnoti,
  setnotificacionusufinal

}) => {
  const history = useNavigate();
  const [selectedValue, setSelectedValue] = useState("Aprobador");
  let headermain = header.items;

  headermain.unshift({ selector: 'AccionIn', label: "" })
  const [indexselect, setindexselect] = useState([])
  let handleView = (index) => {
    history.push(`/nuevassolicitudes/${Number(index)}`);
  };
  let handleViewHistory = (index) => {
    history.push(`/solicitudHistory/${Number(index)}`);
  };
  let handleViewGestor = (index) => {
    history.push(`/solicitudGestor/${Number(index)}`);
  };
  function handleEdit(index) {
    let params = {
      id: index,
      rol: rol
    };
    history.push(`/updatearea/${JSON.stringify(params)}`);
  }

  function handleNotificacion(params) {
    setnotificacion(true);
    setindexaprobnoti(params);
  }
  function handleNotificacionUsFinal(params) {
    setnotificacionusufinal(true);
    setindexarea(params);
  }
  async function handelDownload(base64, filename) {
    const linkSource = base64;
    const fileType = base64.split(";");
    const extension = fileType[0].split("/");
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = `Certificado_${filename}.${extension[1]}`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

  }

  let itemsTable = rows;
  let itemactual = [];
  let columns = [];
  const data = [];
  if (table === 'tableareas') {
    let auxcolincio = [];
    let auxcolfin = [];
    let aprob = [];

    aprob = headermain.splice(1, 1);

    auxcolincio = headermain.splice(1, 3);
    auxcolfin = headermain.splice(1, 4);
    auxcolincio.unshift(headermain[0])
    let newcolums = auxcolincio.concat(auxcolfin);


    console.log(newcolums);
    if (rol === 'Aprobador' || rol === 'Administrador') {
      for (let index = 1; index < newcolums.length; index++) {
        console.log(newcolums[index].selector);
        if (newcolums[index].selector === 'Estado' || newcolums[index].selector === 'AccionIn' || newcolums[index].selector === 'Acciones') {
          columns = [
            { name: "Nombre de area", selector: (row) => row.NombreArea },
            { name: "Administrador de área", selector: (row) => row.AdministradorArea },
            { name: "Aprobador", selector: (row) => row.Aprobador },
            { name: "Correo de administrador", selector: (row) => row.CorreoAdmin },
            { name: "Correo de Aprobador", selector: (row) => row.CorreoAprobador },
            { name: "Estado", selector: (row) => row.Estado },
            { name: "Acciones", selector: (row) => row.Acciones, className: [`Acciones`] }
        
          ];
        } else {
          columns.push({
            name: newcolums[index].label,
            selector: newcolums[index].selector,

          })
        }
        console.log(columns);
      }
    } else {
      for (let index = 0; index < newcolums.length; index++) {
        console.log(newcolums[index].selector);
        if (newcolums[index].selector === 'Estado' || newcolums[index].selector === 'AccionIn' || newcolums[index].selector === 'Acciones') {
          columns.push({
            name: newcolums[index].label,
            selector: newcolums[index].selector,
            className: [`${newcolums[index].selector}`],
          })
        } else {
          columns.push({
            name: newcolums[index].label,
            selector: newcolums[index].selector,

          })
        }
      }
    }

  } else if (table === 'tablesolici') {
    for (let index = 2; index < headermain.length; index++) {
      if (headermain[index].selector === 'EstadoSoli' || headermain[index].selector === 'ID' || headermain[index].selector === 'Acciones') {
         columns = [
          {
            name: "ID",
            selector: (row) => row.ID
          },
          {
            name: "Nombre Solicitante",
            selector: (row) => row.NombreSolicitante
          },
          {
            name: "Correo Solicitante",
      
            selector: (row) => row.CorreoSolicitante
          },
          {
            name: "Motivo",
      
            selector: (row) => row.Motivo
          },
          {
            name: "Jefe Inmediato",
      
            selector: (row) => row.JefeInmediato
          },
          {
            name: "Estado",
      
            selector: (row) => row.EstadoSoli
          },
          {
            name: "Fecha Creado",
            selector: (row) => row.FechaCreado
          },
          {
            name: "Acciones",
            selector: (row) => row.Acciones
          }
        ]
      } else {
        columns.push({
          name: headermain[index].label,
          selector: headermain[index].selector,

        })
      }

    }

  } else if (table === 'tablepara') {
    console.log(19)
    for (let index = 1; index < headermain.length; index++) {
      if (headermain[index].selector === 'Habilitar' || headermain[index].selector === 'AccionesPara') {
        columns.push({
          name: headermain[index].label,
          selector: headermain[index].selector,

        })
      } else {
        columns.push({
          name: headermain[index].label,
          selector: headermain[index].selector,

        })
      }

    }
  } else if (table === 'tableaprobador') {

    for (let index = 2; index < headermain.length; index++) {

      if (headermain[index].selector === 'Alertar' || headermain[index].selector === 'FechaLimite' || headermain[index].selector === 'FechaAprobado' || headermain[index].selector === 'Estado') {
        columns.push({
          name: headermain[index].label,
          selector: headermain[index].selector,

        })
      } else {
        columns.push({
          name: headermain[index].label,
          selector: headermain[index].selector,

        })
      }

    }
  } else if (table === 'tablehistorial') {
    for (let index = 2; index < headermain.length; index++) {
      if (headermain[index].selector === 'EstadoSoli' || headermain[index].selector === 'ID' || headermain[index].selector === 'Acciones') {
        columns.push({
          name: headermain[index].label,
          selector: headermain[index].selector,

        })
      } else {
        columns.push({
          name: headermain[index].label,
          selector: headermain[index].selector,

        })
      }

    }

  } else if (table === 'tablegestion') {
    for (let index = 2; index < headermain.length; index++) {
      if (headermain[index].selector === 'EstadoSoli' || headermain[index].selector === 'ID' || headermain[index].selector === 'Acciones' || headermain[index].selector === 'Tramite' || headermain[index].selector === 'FechaCreado') {
        columns.push({
          name: headermain[index].label,
          selector: headermain[index].selector,

        })
      } else {
        columns.push({
          name: headermain[index].label,
          selector: headermain[index].selector,

        })
      }

    }

  }

  let dataorder = [];
  function handleSelect(e, index) {
    setindexupdatetr(index);
    setestadotramite(e.target.value);
  }
  function handleSelectPermisos(e, index) {
    setpermisos(e.target.value);
    setpermisosindex(index);
  }
  let newitems = [];
  for (let index = 0; index < itemsTable.length; index++) {
    if (itemsTable[index].items.length > 0) {
      newitems.push(itemsTable[index]);
    }
  }
  for (let index = 0; index < newitems.length; index++) {
    let dataCol = {};
    let documento;
    for (let indexB = 0; indexB < newitems[index].items.length; indexB++) {
      let indexD = newitems[index].items[indexB].name;
      dataCol['id'] = itemsTable[index].id
   
      dataCol['Habilitar'] = <Checkbox onClick={() => {
        if (newitems[index].items[indexB].name === 'EstadoPara' && newitems[index].items[indexB].data === 'Activo') {
          setEstadousu(false);
          setestadousu(newitems[index].id);
        } else {
          setEstadousu(true);
          setestadousu(newitems[index].id);
        }
      }} toggle checked={newitems[index].items[indexB].name === 'EstadoPara' && newitems[index].items[indexB].data === 'Activo' ? true : false} />
      if (newitems[index].items[indexB].name === 'Documento') {
        documento = newitems[index].items[indexB].data
      }
      if (newitems[index].items[indexB].name === 'Certificado') {
        dataCol['AdjuntoBase'] = newitems[index].items[indexB].data !== '' ? <FilesPdfColoredIcon style={{ cursor: 'pointer', color: '#C2833A' }} onClick={() => handelDownload(newitems[index].items[indexB].data, documento)} /> : '';
      }


      dataCol[indexD] = newitems[index].items[indexB].name !== 'Pendientes' && newitems[index].items[indexB].data
      dataCol['Pendientes'] = newitems[index].items[indexB].data === 'Si' ? <ExclamationTriangleIcon style={{ cursor: 'pointer', color: '#C2833A' }} onClick={() => { handleNotificacion(newitems[index].id) }} /> : newitems[index].items[indexB].data === 'No' ? <PresenceAvailableIcon onClick={() => { handleNotificacion(newitems[index].id) }} /> : '';
      dataCol['PendientesSolicitud'] = newitems[index].items[indexB].data === 'Si' ? <ExclamationTriangleIcon style={{ cursor: 'pointer', color: '#C2833A' }} onClick={() => { handleNotificacionUsFinal(newitems[index].id) }} /> : '';

      dataCol['AccionIn'] = <Checkbox onClick={() => {
        if (newitems[index].items[indexB].name === 'Estado' && newitems[index].items[indexB].data === 'Activa') {
          setCheckAc(false);
          setIndexcheck(newitems[index].id);
        } else {
          setCheckAc(true);
          setIndexcheck(newitems[index].id);
        }
      }} toggle checked={newitems[index].items[indexB].name === 'Estado' && newitems[index].items[indexB].data === 'Activa' ? true : false} />


      if (indexD === 'Alertar') {
        dataCol[indexD] = <UrgentIcon outline styles={{ cursor: "pointer", transform: "rotate(0deg)" }} onClick={() => handleRowAlert(newitems[index].id)} />
      }
      if (acciones.delete === 'delete') {
        dataCol['AccionesPara'] = <TrashCanIcon onClick={() => { setiddelete(newitems[index].id) }} outline styles={{ cursor: "pointer", margin: "2px", paddingLeft: "2px", }}
        />
      }

      if (acciones.edit || acciones.delete || acciones.ver) {
        if (acciones.edit === 'edit' && acciones.delete === 'delete') {
          if (table === 'tableareas' && rol === 'Aprobador') {
            dataCol['Acciones'] = <EyeIcon onClick={() => handleEdit(newitems[index].id)} outline styles={{ cursor: "pointer", transform: "rotate(0deg)" }} />

          } else {
            dataCol['Acciones'] = [<EditIcon onClick={() => handleEdit(newitems[index].id)} outline styles={{
              cursor: "pointer", margin: "10px",
              paddingLeft: "10px",
            }}
            />, rol !== 'Administrador' ? <TrashCanIcon onClick={() => { setIddelete(newitems[index].id) }} outline styles={{ cursor: "pointer", margin: "2px", paddingLeft: "2px", }} /> : '']
          }

        } else {
          dataCol['Acciones'] = table === 'tablehistorial' ? <EyeIcon onClick={() => handleViewHistory(newitems[index].id)} outline styles={{ cursor: "pointer", transform: "rotate(0deg)" }} /> : table == 'tablegestion' ? <EyeIcon onClick={() => handleViewGestor(newitems[index].id)} outline styles={{ cursor: "pointer", transform: "rotate(0deg)" }} /> : <EyeIcon onClick={() => handleView(newitems[index].id)} outline styles={{ cursor: "pointer", transform: "rotate(0deg)" }} />
        }
      }
      dataCol['Permisos'] = newitems[index].items[indexB].data === 'Inactivo' ? <select defaultValue={newitems[index].items[3].data} onChange={(e) => handleSelectPermisos(e, itemsTable[index].id)}><option value="Administrador">Administrador</option><option value="Administrador general">Administrador general</option><option value="Usuario final">Usuario final</option><option value="Aprobador">Aprobador</option><option value="Gestor documental">Gestor documental</option><option value="Jefe directo">Jefe directo</option></select> : newitems[index].items[3].data
      dataCol['Tramite'] = <select style={{ color: newitems[index].items[indexB].data !== 'Cerrado' && '#A72F2F' }} defaultValue={newitems[index].items[indexB].data === 'Cerrado' ? itemsTable[index].items[indexB].data : 'Pendiente'} onChange={(e) => handleSelect(e, itemsTable[index].id)}><option value="Cerrado">Cerrado</option><option value="Pendiente">Pendiente</option></select>

    }
    dataorder.push(dataCol);
  }
  for (const key in dataorder) {
    if (Object.hasOwnProperty.call(dataorder, key)) {
      data.push(dataorder[key])
    }
  }

  return (
    <>
      <div id='tablemain'>
        <DataTable
          columns={columns}
          data={data}
          pagination={paginador}
          // selectableRows = {check}
          selectableRowsRadio="radio"
          selectableRowsSingle
          responsive
          onSelectedRowsChange={(e) => {
            try {
              itemactual = []
              itemactual.push(e.selectedRows[0])
              if (table === 'tableaprobador' && e.selectedRows[0] !== undefined) {

                setcorreoaprobador(e.selectedRows[0].CorreoDelAprobador)
                setindexarea(e.selectedRows[0].id);
              }
            } catch (error) {
              console.log(error);
            }
          }}
          highlightOnHover
          dense
          striped
        />
      </div>

    </>
  );
};

export default TableMain;
