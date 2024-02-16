import { CloseIcon } from '@fluentui/react-icons-northstar';
import { Button, Dialog, Grid, Header, Input, Label } from "@fluentui/react-northstar";
import { PeoplePicker } from '@microsoft/mgt-react';
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { TeamsFxContext } from "../Context";
import "./FormMisDatos.css";
import { DateForms } from './types';
const Form = (props: { disable: any; setDisable: any }) => {
  interface FormState {
    inputValues: DateForms
  }
  const [opendialog, setOpendialog] = useState(false);
  const { disable, setDisable } = props;
  const history = useNavigate();
  const [inputValues, setInputValues] = useState<FormState["inputValues"]>({
    NombreSolicitante: "",
    Documento: "",
    CorreoSolicitante: "",
    Dependencia: "",
    FechaIngreso: "",
    CorreoPersonal: "",
    TelefonoFijo: "",
    TelefonoCelular: "",
    DptoResidencia: "",
    CiudadResidencia: "",
    Direccion: "",
    Motivo: "",
    JefeInmediato: "",
    CargoJefeInmediato: "",
    CorreoJefeInmediato: '',
    Tercero: "",
    Estado: "",
    Area: "",
    AprobadorArea: "",
    CorreoAprobador: "",
    FechaAprobado: "",
    FechaLimite: "",
    Pendiente: "",
  })
  let Datenow = new Date()
  let form: any = {
    fields: {
      Title: '',
      NombreSolicitante: '',
      Documento: '',
      Dependencia: '',
      CorreoSolicitante: '',
      FechaIngreso: '',
      CorreoPersonal: '',
      TelefonoFijo: '',
      TelefonoCelular: '',
      DptoResidencia: '',
      CiudadResidencia: '',
      Direccion: '',
      Motivo: '',
      JefeInmediato: '',
      CorreoJefeInmediato: '',
      Estado: '',
      FechaCreado: Datenow.toLocaleDateString(),
    }
  };

  const [call, setcall] = useState({});
  const [input, setInput] = useState([{ type: '', name: '', label: '', value: '', disable: false }]);
  const [valueg, setValueg] = useState<Object>({});
  const [select, setSelect] = useState('empty');
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const [opendialogData, setOpendialogData] = useState(false);
  const [selecmotivo, setselecmotivo] = useState('empty');
  const [motivo, setmotivo] = useState([{ label: '', value: '' }])
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      //await teamsfx.login(scope);
      const resTiempo = await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/4a6f621c-c9cb-45db-8456-d4f467528557/items?expand=fields(select=*)"
        )
        .get();
      if (form.fields.NombreSolicitante !== "") {
        //await teamsfx.login(scope);
        const resTiempo = await graph
          .api(
            "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/4a6f621c-c9cb-45db-8456-d4f467528557/items?expand=fields(select=*)"
          )
          .get();
        const res: any = await graph
          .api(
            "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items"
          )
          .post(form);
        const itemsArea = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items?expand=fields(select=*)").get();
        let fechaCrea = new Date(res.fields.Created);


        let fechalim = new Date();
        if (resTiempo.value.length > 0) {

          const fieldValueSet = {
            FechaLimite: new Date(fechalim.setDate(Number(resTiempo.value[0].fields.TiempoMinRespuesta) + Number(resTiempo.value[0].fields.TiempoMaxRespuesta) + Number(fechaCrea.getDate()))).toLocaleDateString()
          };

          console.log(fieldValueSet);
          await graph
            .api(
              `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items/${res.id}/fields`
            )
            .update(fieldValueSet);
        }
        if (itemsArea) {
          setOpendialog(true);
        }
        for (let index = 0; index < itemsArea.value.length; index++) {
          if (itemsArea.value[index].fields.Estado !== 'Inactiva') {
            let formAreaaprob: any = {
              fields: {
                Title: '',
                Estado: 'Pendiente',
                Area: itemsArea.value[index].fields.NombreArea,
                AprobadorDeArea: itemsArea.value[index].fields.Aprobador,
                CorreoDelAprobador: itemsArea.value[index].fields.CorreoAprobador,
                Alertar: 'no',
                AdministradorDeArea: itemsArea.value[index].fields.AdministradorArea,
                CorreoDelAdministrador: itemsArea.value[index].fields.CorreoAdmin,
                FechaLimite: new Date(fechalim.setDate(Number(resTiempo.value[0].fields.TiempoMinRespuesta) + Number(resTiempo.value[0].fields.TiempoMaxRespuesta) + fechaCrea.getDate())).toLocaleDateString(),
                FechaAprobado: '',
                IDSolicitud: res.id,
                IDArea: itemsArea.value[index].fields.id
              }
            };
            await graph
              .api(
                "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/11e5896f-d46e-47a7-a759-74d9d34aa39b/items"
              )
              .post(formAreaaprob);
          }
        }

        return { res };

      }

      motivoData(await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/ab5c2dcc-052b-4f2c-a5a6-af956499ae72/items?expand=fields(select=*)").get());
      const dataForm: any = await graph.api(`/me`).get();
      // Call graph api directly to get user profile information
      const columns: any = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/columns").get();
      const items = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items?expand=fields(select=*)").get();

      if (input.length === 1) {
        for (let index = 0; index < columns.value.length; index++) {
          if (columns.value[index].displayName === "NombreSolicitante") {
            let indice = "";
            for (const key in dataForm) {
              if (key === 'displayName') {
                if (Object.hasOwnProperty.call(dataForm, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Nombre Solicitante", value: dataForm[key] ? dataForm[key] : "", disable: true });
                  if (dataForm[key]) {
                    form.fields.NombreSolicitante = dataForm[key];
                  }
                }
              } else {
                indice = index.toString();
              }
            }
            /*
            if (indice!=="") {
              input.push({ type: "text", name: columns.value[indice].name, label: "Nombre Solicitante",value:""});
            }
            */
          }

          if (columns.value[index].displayName === "CorreoSolicitante") {
            let indice = "";
            for (const key in dataForm) {
              if (key === 'mail') {
                if (Object.hasOwnProperty.call(dataForm, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Correo corporativo", value: dataForm[key] ? dataForm[key] : "", disable: true });
                  if (dataForm[key] !== "") {
                    form.fields.CorreoSolicitante = dataForm[key];
                  }
                }
              } else {
                indice = index.toString();
              }
            }
            /*
            if (indice!=="") {
              input.push({ type: "text", name: columns.value[indice].name, label: "Documento",value:""});
            }
            */
          }
          if (columns.value[index].displayName === "Dependencia") {
            let indice = "";
            input.push({ type: "text", name: columns.value[index].name, label: "Dependencia", value: "", disable: false });
          }
          if (columns.value[index].displayName === "FechaIngreso") {
            let indice = "";
            input.push({ type: "date", name: columns.value[index].name, label: "Fecha de ingreso", value: "", disable: false });
          }
          if (columns.value[index].displayName === "DptoResidencia") {
            let indice = "";
            input.push({ type: "text", name: columns.value[index].name, label: "Departamento de residencia", value: "", disable: false });
          }
          if (columns.value[index].displayName === "JefeInmediato") {
            let indice = "";
            for (const key in dataForm) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Jefe Inmediato", value: dataForm[key] ? dataForm[key] : "", disable: false });
                  if (dataForm[key] !== "") {
                    form.fields.JefeInmediato = dataForm[key];
                  }
                }
              } else {
                indice = index.toString();
              }
            }
          }
          if (columns.value[index].displayName === "Motivo") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Motivo", value: dataForm.fields[key] ? dataForm.fields[key] : "", disable: false });

                }
              } else {
                indice = index.toString();
              }
            }
          }
          if (columns.value[index].displayName === "TelefonoCelular") {
            let indice = "";
            for (const key in dataForm) {
              if (key === 'mobilePhone') {
                if (Object.hasOwnProperty.call(dataForm, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Número de contacto", value: dataForm[key] ? dataForm[key] : "", disable: false });
                  if (dataForm[key] !== "") {
                    form.fields.JefeInmediato = dataForm[key];
                  }
                }
              } else {
                indice = index.toString();
              }
            }
          }
          if (columns.value[index].displayName === "Documento") {
            let indice = "";
            input.push({ type: "text", name: columns.value[index].name, label: "Número de documento", value: '', disable: false });
          }
          if (columns.value[index].displayName === "CorreoPersonal") {
            let indice = "";
            input.push({ type: "text", name: columns.value[index].name, label: "Correo Personal", value: "", disable: false });

          }
          if (columns.value[index].displayName === "CiudadResidencia") {
            let indice = "";
            input.push({ type: "text", name: columns.value[index].name, label: "Ciudad residencia", value: "", disable: false });
          }

        }
      }

      // Initialize Graph Toolkit TeamsFx provider
      //const provider = new TeamsFxProvider(teamsfx, scope);
      //Providers.globalProvider = provider;

      //Providers.globalProvider.setState(ProviderState.SignedIn);
      return { columns, items, dataForm };
    },
    { scope: ["User.Read", "Sites.Read.All"], credential: teamsUserCredential }
  );

  let motivoData = (params: any) => {
    params.value.map((elemt: any): void => {
      motivo.push({ label: elemt.fields.Motivo, value: elemt.fields.Motivo })
    })
  }


  useEffect(() => {

  }, [])
  const [open, setOpen] = useState(
    false
  )
  const [nombre, setNombre] = useState('');
  function handleSubmit() {
    reload();
  }
  function handleSelect(params: any) {
    console.log(params.value);
    if (params.value === 'Solicitud Personal') {
      setStoogle(false);
      setChecked(true);
      setDisable(false);
      setInputDisable(true);
    } else if (params.value === 'Solicitud para otro usuario') {
      setChecked(false);
      setStoogle(true);
      setInputDisable(false);
    }
    setselecmotivo(params.value);
  }

  let verificarData = () => {
    input.map((element) => {
      if (element.name === 'NombreSolicitante') {
        if (element.value !== '') {
          form.fields.NombreSolicitante = element.value
        }
      }
      if (element.name === 'CorreoSolicitante') {
        if (element.value !== '') {
          form.fields.CorreoSolicitante = element.value
        }
      }
      if (element.name === 'TelefonoCelular') {
        if (element.value !== '') {
          form.fields.TelefonoCelular = element.value
        }
      }
    })

  }
  function handleChange(evt: any) {
    setInputValues({
      ...inputValues,
      [evt.target.name]: evt.target.value,
    })
  }

  const [checked, setChecked] = useState(true);
  const [stoogle, setStoogle] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);

  let validarData = () => {
    if (form.fields.NombreSolicitante !== "empty" && form.fields.Documento !== "empty"
      && form.fields.FechaIngreso !== "empty" && form.fields.CorreoPersonal !== "empty"
      && form.fields.DptoResidencia !== "empty" && form.fields.CiudadResidencia !== "empty"
      && form.fields.JefeInmediato !== "empty" && form.fields.CorreoJefeInmediato !== "empty"
      && selecmotivo !== "empty") {
      reload();
    } else {
      setOpendialogData(true);
    }
  }
  function handelInput(e: any) {
    setInputValues({
      ...inputValues,
      "JefeInmediato": e.target.selectedPeople[0].displayName,
      "CorreoJefeInmediato": e.target.selectedPeople[0].scoredEmailAddresses[0].address,
    })
  }
  function click() {
    if (!checked) {
      form.fields.Title = 'Solicitud';
      form.fields.NombreSolicitante = inputValues.NombreSolicitante !== "" ? inputValues.NombreSolicitante : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Documento = inputValues.Documento !== "" ? inputValues.Documento : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Dependencia = inputValues.Dependencia !== "" ? inputValues.Dependencia : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.CorreoSolicitante = inputValues.CorreoSolicitante !== "" ? inputValues.CorreoSolicitante : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.FechaIngreso = inputValues.FechaIngreso !== "" ? inputValues.FechaIngreso : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.CorreoPersonal = inputValues.CorreoPersonal !== "" ? inputValues.CorreoPersonal : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.TelefonoCelular = inputValues.TelefonoCelular !== "" ? inputValues.TelefonoCelular : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.DptoResidencia = inputValues.DptoResidencia !== "" ? inputValues.DptoResidencia : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.CiudadResidencia = inputValues.CiudadResidencia !== "" ? inputValues.CiudadResidencia : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Direccion = inputValues.Direccion !== "" ? inputValues.Direccion : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.JefeInmediato = inputValues.JefeInmediato !== "" ? inputValues.JefeInmediato : 'empty'
      form.fields.CorreoJefeInmediato = inputValues.CorreoJefeInmediato !== "" ? inputValues.CorreoJefeInmediato : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Motivo = selecmotivo !== "empty" ? selecmotivo : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Estado = 'Pendiente';
      validarData();
    } else {
      form.fields.Title = 'Solicitud';
      form.fields.NombreSolicitante = inputValues.NombreSolicitante !== "" ? inputValues.NombreSolicitante : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Documento = inputValues.Documento !== "" ? inputValues.Documento : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Dependencia = inputValues.Dependencia !== "" ? inputValues.Dependencia : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.CorreoSolicitante = inputValues.CorreoSolicitante !== "" ? inputValues.CorreoSolicitante : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.FechaIngreso = inputValues.FechaIngreso !== "" ? inputValues.FechaIngreso : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.CorreoPersonal = inputValues.CorreoPersonal !== "" ? inputValues.CorreoPersonal : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.TelefonoCelular = inputValues.TelefonoCelular !== "" ? inputValues.TelefonoCelular : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.DptoResidencia = inputValues.DptoResidencia !== "" ? inputValues.DptoResidencia : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.CiudadResidencia = inputValues.CiudadResidencia !== "" ? inputValues.CiudadResidencia : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Direccion = inputValues.Direccion !== "" ? inputValues.Direccion : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.JefeInmediato = inputValues.JefeInmediato !== "" ? inputValues.JefeInmediato : 'empty'
      form.fields.CorreoJefeInmediato = inputValues.CorreoJefeInmediato !== "" ? inputValues.CorreoJefeInmediato : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Motivo = selecmotivo !== "empty" ? selecmotivo : verificarData() === undefined ? 'empty' : verificarData();
      form.fields.Estado = 'Pendiente';


      validarData();
    }
  }
  // const onConfirm = useLogKnob(
  //   'onConfirm',
  //   () => click(),
  //   createCallbackLogFormatter(['open']),
  // )

  return (
    <>

      <div className="divcompleteMisDatos" >
        <div id='tablaDatos1' className="divTableMisDatos">
          <Header className="HeaderDatos" as="h4" content={"Datos"} />
          {input.map((element) =>
            element.name !== "" ? (
              <Input
                className="DatosTableInput"
                type={`${element.type}`}
                label={`${element.label} `}
                placeholder={`${element.label}`}
                name={`${element.name}`}
                id={`${element.name}`}
                onChange={handleChange}
                disabled={element.name === 'CorreoSolicitante' || element.name === 'NombreSolicitante' ? inputDisable : element.disable}
              />

            ) : (
              ""
            )
          )}
        </div>
        <div id="NuevaSolicitud" className="divTableMisDatos2">
          <Grid id="EmergenteCrear" className="GridOtroUsu"
            rows={4}
            content={[
              <div >
                <Label className="DatosTableInput" content="Jefe inmediato" />
                <PeoplePicker
                  id="g"
                  className="DatosTableInput"
                  selectionMode="single"
                  selectionChanged={(e) => handelInput(e)}
                  placeholder="Jefe inmediato"
                ></PeoplePicker>
              </div>,
              <div>
                <Label className="" content="Motivo" />
                <Select
                  options={motivo}
                  onChange={(e) => handleSelect(e)}
                />
              </div>,
              <div className="ButtonsInteract">
                <Button
                  className="ButtonNuevaSolicitud"
                  content="Crear solicitud"
                  // onClick={onConfirm}
                  primary
                />

              </div>

            ]}
          />
        </div>

      </div>







      <Dialog
        open={opendialog}
        onOpen={() => setOpendialog(true)}
        onCancel={() => {
          setOpendialog(false);
        }}
        onConfirm={() => {
          setOpendialog(false);
          history("/successoli");
        }}
        confirmButton="Ok"
        content="Su solicitud ha sido creada correctamente"
        header=""
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => setOpendialog(false),
        }}
      />
      <Dialog
        open={opendialogData}
        onOpen={() => setOpendialogData(true)}
        onCancel={() => {
          setOpendialogData(false);
        }}
        onConfirm={() => {
          setOpendialogData(false);
        }}
        confirmButton="Ok"
        content="Para continuar debes diligenciar todos los campos"
        header=""
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => setOpendialog(false),
        }}
      />
    </>
  );
}

Form.propTypes = {}

export default Form