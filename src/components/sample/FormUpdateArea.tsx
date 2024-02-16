/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, CloseIcon, Dialog, Flex, Grid, Header, Input, Label, Text } from "@fluentui/react-northstar";
import { useContext, useState } from "react";

import { TrashCanIcon } from '@fluentui/react-icons-northstar';
import { UserType } from "@microsoft/mgt-components";
import { PeoplePicker } from '@microsoft/mgt-react';
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useNavigate, useParams } from "react-router-dom";
import { TeamsFxContext } from "../Context";
import "./Form.css";
const Form = () => {
  const [form, setForm] = useState({
    fields: {
      NombreArea: "",
      AdministradorArea: "",
      Aprobador: "",
      TiempoMaximoRespuestaSolicitudes: "",
      TiempoMaximoRespuestaDias: "",
      CorreoAprobador: "",
      CorreoAdmin: "",
      CargoAdmin: "",
      CargoAprobador: "",
      Estado: "Activa",
    },
  })
  const history = useNavigate();
  const id: any = useParams();

  let params = JSON.parse(id.id)
  console.log(params);






  const { teamsUserCredential } = useContext(TeamsFxContext);
  const [input, setInput] = useState([{ type: "", name: "", label: "", value: "" }]);
  const [edit, setEdit] = useState(false);
  const [correo, setCorreo] = useState("");
  const [correoAprob, setCorreoAprob] = useState("");
  const [updateConfirm, setupdateConfirm] = useState(false);
  const [updateInput, setUpdateInput] = useState(false);
  const [updateInputAdmin, setUpdateInputAdmin] = useState(false);
  const [datacorreoadmin, setdatacorreoadmin] = useState(Array);
  const [datacorreoaprob, setdatacorreoaprob] = useState(Array);
  const [newadddataaprob, setnewadddataaprob] = useState(Array);
  const [idadmin,] = useState(Array);
  const [idaprob,] = useState(Array);
  const [corrAprob, setcorrAprob] = useState(Array);
  const [corr,] = useState(Array);
  const [updateAprobs, setupdateAprobs] = useState(false);
  const [updateAdmin, setupdateAdmin] = useState(false);
  const [correoAdminTable, setcorreoAdminTable] = useState(Array);
  const [correAprobTable, setcorreAprobTable] = useState(Array);
  const [contadorremoveadmin, setcontadorremoveadmin] = useState(0);
  const [contadorremoveaprob, setcontadorremoveaprob] = useState(0);
  const inputItems = [
    'Días',
    'Semanas',
    'Mes'
  ];
  let update = false
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph: any, teamsfx: any, scope: any) => {


      //await teamsfx.login(scope); 
      let resUpdate = false;
      let resupdateAprob = false;
      if (form.fields.NombreArea !== "" && update) {
        const fieldValueSet = {
          NombreArea: form.fields.NombreArea,
          AdministradorArea: form.fields.AdministradorArea,
          TiempoMaximoRespuestaSolicitudes: form.fields.TiempoMaximoRespuestaSolicitudes,
          TiempoMaximoRespuestaDias: form.fields.TiempoMaximoRespuestaDias,
          CorreoAdmin: form.fields.CorreoAdmin,
          CargoAdmin: form.fields.CargoAdmin,
          CargoAprobador: form.fields.CorreoAprobador,
          Estado: "Activa",
        };
        const res = await graph
          .api(
            `groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items/${params.id}/fields`
          )
          .update(fieldValueSet);
        if (res.id) {
          resUpdate = true;
        }
      }
      const dataForm = await graph.api(`/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items/${params.id}`).get();
      const dataAprob = await graph.api(`/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/2dfcd421-b6ec-45a1-ae01-4dff92bf0f43/items?expand=fields(select=*)`).get();
      const dataAdmin = await graph.api(`/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/469d4c6a-b63b-4531-ab64-8d65bb17fb69/items?expand=fields(select=*)`).get();

      if (updateAprobs) {

        if (dataAprob.value.length > 0) {
          for (let index = 0; index < dataAprob.value.length; index++) {
            const element: any = dataAprob.value[index].fields;
            if (element['IDArea'] === params.id) {
              await graph.api(`/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/2dfcd421-b6ec-45a1-ae01-4dff92bf0f43/items/${element['id']}`).delete();
            }
          }

        }
        if (datacorreoaprob.length > 0) {
          let datacorreo: any = datacorreoaprob;

          for (let index = 0; index < datacorreo.length; index++) {
            let formAprob: any = {
              fields: {
                Title: "",
                NombreAprobador: datacorreo[index].name,
                CorreodelAprobador: datacorreo[index].mail,
                CargodelAprobador: '',
                IDArea: params.id,
              },
            };
            await graph
              .api(
                "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/2dfcd421-b6ec-45a1-ae01-4dff92bf0f43/items"
              )
              .post(formAprob);
          }
          let formAprob: any = {

            Aprobador: datacorreo[0].name,
            CorreoAprobador: datacorreo[0].mail

          };
          const res = await graph
            .api(
              `groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items/${params.id}/fields`
            )
            .update(formAprob);
          if (res.id) {
            resupdateAprob = true;
          }
        }

      }
      if (resUpdate || resupdateAprob) {

        setupdateConfirm(true);
      }
      if (updateAdmin) {
        if (dataAdmin.value.length > 0) {
          for (let index = 0; index < dataAdmin.value.length; index++) {
            const element: any = dataAdmin.value[index].fields;
            if (element['IDArea'] === params.id) {
              await graph.api(`/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/469d4c6a-b63b-4531-ab64-8d65bb17fb69/items/${element['id']}`).delete();
            }
          }
        }
        if (datacorreoadmin.length > 0) {
          let datacorreoAd: any = datacorreoadmin;
          for (let index = 0; index < datacorreoAd.length; index++) {
            let formAprob: any = {
              fields: {
                Title: "",
                AdministradorDelArea: datacorreoAd[index].name,
                CorreoDelAdministrador: datacorreoAd[index].mail,
                CargoDelAdministrador: '',
                IDArea: params.id,
              },
            };

            await graph
              .api(
                "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/469d4c6a-b63b-4531-ab64-8d65bb17fb69/items"
              )
              .post(formAprob);


          }
        }

      }
      if (datacorreoadmin.length === 0) {
        for (let index = 0; index < dataAdmin.value.length; index++) {
          const element: any = dataAdmin.value[index].fields;
          if (element['IDArea'] === params.id) {
            datacorreoadmin.push({ idAdmin: element['id'], name: element['AdministradorDelArea'], mail: element['CorreoDelAdministrador'] })
          }
        }
      }

      if (datacorreoaprob.length === 0) {
        for (let index = 0; index < dataAprob.value.length; index++) {
          const element: any = dataAprob.value[index].fields;
          if (element['IDArea'] === params.id) {
            datacorreoaprob.push({ idAprob: element['id'], name: element['NombreAprobador'], mail: element['CorreodelAprobador'] })
          }

        }
      }




      for (const key in dataForm.fields) {
        if (Object.prototype.hasOwnProperty.call(dataForm.fields, key)) {
          if (key === "NombreArea") {
            form.fields.NombreArea = dataForm.fields[key];
          }
          if (key === "CorreoAdmin") {
            form.fields.CorreoAdmin = dataForm.fields[key];
          }
          if (key === "AdministradorArea") {
            form.fields.AdministradorArea = dataForm.fields[key];
          }
          if (key === "Aprobador") {
            form.fields.Aprobador = dataForm.fields[key];
          }
          if (key === "TiempoMaximoRespuestaSolicitudes") {
            form.fields.TiempoMaximoRespuestaSolicitudes = dataForm.fields[key];
          }
          if (key === "TiempoMaximoRespuestaDias") {
            form.fields.TiempoMaximoRespuestaDias = dataForm.fields[key];
          }
          if (key === "CorreoAprobador") {
            form.fields.CorreoAprobador = dataForm.fields[key];
          }
          if (key === "CargoAdmin") {
            form.fields.CargoAdmin = dataForm.fields[key];
          }
          if (key === "CargoAprobador") {
            form.fields.CargoAprobador = dataForm.fields[key];
          }

        }
      }
      // Call graph api directly to get user profile information
      const columns: any = await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/columns"
        )
        .get();
      console.log(input.length);

      if (input.length === 1) {
        for (let index = 0; index < columns.value.length; index++) {
          if (columns.value[index].name === "NombreArea") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "NombreArea", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                }
              }
            }
          }
          if (columns.value[index].name === "AdministradorArea") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "AdministradorArea", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                  setTargetAdmin({ name: dataForm.fields[key], mail: '' });
                  setEstadoAdmin(true);
                }
              }
            }
          }
          if (columns.value[index].name === "Aprobador") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Aprobador", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                  setTargetAprob({ name: dataForm.fields[key], mail: '' });
                  setEstadoAprob(true);
                }
              }
            }
          }
          if (columns.value[index].name === "TiempoMaximoRespuestaSolicitudes") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({ type: "number", name: columns.value[index].name, label: "Tiempo maximo de respuesta para las solicitudes", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                }
              }
            }
          }
          if (columns.value[index].name === "TiempoMaximoRespuestaDias") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Tiempo maximo de respuesta para las solicitudes", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                }
              }
            }
          }
          if (columns.value[index].name === "CorreoAprobador") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  console.log(dataForm.fields[key]);

                  input.push({ type: "text", name: columns.value[index].name, label: "Correo del aprobador", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                }
              }
            }
          }
          if (columns.value[index].name === "CargoAdmin") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Cargo del administrador", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                }
              }
            }
          }
          if (columns.value[index].name === "CargoAprobador") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Cargo del aprobador", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                }
              }
            }
          }
          if (columns.value[index].name === "Estado") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({ type: "text", name: columns.value[index].name, label: "Estado", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                }
              }
            }
          }
          if (columns.value[index].name === "CorreoAdmin") {
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  console.log(dataForm.fields[key]);
                  input.push({ type: "text", name: columns.value[index].name, label: "Correo del administrador", value: dataForm.fields[key] ? dataForm.fields[key] : "" });
                }
              }
            }
          }
        }
      }

      const items = await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items?expand=fields(select=*)"
        )
        .get();
      // Initialize Graph Toolkit TeamsFx provider
      //const provider = new TeamsFxProvider(teamsfx, scope);
      //Providers.globalProvider = provider;
      //Providers.globalProvider.setState(ProviderState.SignedIn);
      return { columns, items };
    },
    {
      scope: ["User.Read", "Sites.Read.All", "Group.ReadWrite.All", "People.Read.All", "Directory.ReadWrite.All", "Directory.AccessAsUser.All", "DeviceManagementApps.ReadWrite.All", "Contacts.ReadWrite"],
      credential: teamsUserCredential,
    }
  );
  const [nombresAdmin, setNombresAdmin] = useState("");
  const [targetAdmin, setTargetAdmin] = useState({ name: '', mail: '' });
  const [cargoAdmin, setCargoAdmin] = useState('');
  const [cargoAprob, setCargoAprob] = useState('');
  const [targetAprob, setTargetAprob] = useState({ name: '', mail: '' });
  const [estadoAdmin, setEstadoAdmin] = useState(false);
  const [estadoAprob, setEstadoAprob] = useState(false);
  const [nombreAprob, setNombreAprob] = useState("");

  const handleSubmit = () => {
    update = true;
    reload();
    console.log(update);
  }
  function handleChange(e: any) {
    if (e.target.name === "NombreArea") {
      form.fields.NombreArea = e.target.value;
    }
    if (e.target.name === "CorreoAdmin") {
      form.fields.CargoAdmin = targetAdmin.mail;
    }
    if (e.target.name === "AdministradorArea") {
      form.fields.AdministradorArea = targetAdmin.name;
    }
    if (e.target.name === "Aprobador") {
      form.fields.Aprobador = targetAprob.name;
    }
    if (e.target.name === "TiempoMaximoRespuestaSolicitudes") {
      form.fields.TiempoMaximoRespuestaSolicitudes = e.target.value;
    }
    if (e.target.name === "TiempoMaximoRespuestaDias") {
      form.fields.TiempoMaximoRespuestaDias = e.target.value;
    }
    if (e.target.name === "CorreoAprobador") {
      form.fields.CorreoAprobador = targetAprob.mail;
    }
    if (e.target.name === "CargoAdmin") {
      form.fields.CargoAdmin = e.target.value;
    }
    if (e.target.name === "CargoAprobador") {
      form.fields.CargoAprobador = e.target.value;
    }
  }
  function handelInput(e: any, id: any) {
    if (id === "AdministradorArea") {
      if (e.target.selectedPeople[0] !== undefined) {
        setTargetAdmin({ name: e.target.selectedPeople[0].displayName, mail: e.target.selectedPeople[0].mail ? e.target.selectedPeople[0].mail : e.target.selectedPeople[0].scoredEmailAddresses[0].address })
        let correo = e.target.selectedPeople[0].mail ? e.target.selectedPeople[0].mail : e.target.selectedPeople[0].scoredEmailAddresses[0].address
        setCorreo(correo);

      }

    }
    if (e.target.name === "CargoAdmin") {
      setCargoAdmin(e.target.value);
    }
    if (id === "Aprobador") {
      if (e.target.selectedPeople[0] !== undefined) {
        setTargetAprob({ name: e.target.selectedPeople[0].displayName, mail: e.target.selectedPeople[0].mail ? e.target.selectedPeople[0].mail : e.target.selectedPeople[0].scoredEmailAddresses[0].address });
        let correo = e.target.selectedPeople[0].mail ? e.target.selectedPeople[0].mail : e.target.selectedPeople[0].scoredEmailAddresses[0].address
        setCorreoAprob(e.target.selectedPeople[0].mail ? e.target.selectedPeople[0].mail : e.target.selectedPeople[0].scoredEmailAddresses[0].address)

      }
    } if (e.target.name === "CargoAprobador") {
      setCargoAprob(e.target.value);
    }
  }
  const contentAdmin = [
    <Header color="brand" content="Administrador de area"
      style={{
        msGridRows: 1,
        msGridColumns: 6,
      }}
    />,
    <Label
      content={nombresAdmin}
      circular
      icon={
        <CloseIcon
          {...{
            onClick: handleRemoveAdmin,
          }}
        />
      }
      style={{
        msGridRows: 1,
        msGridColumns: 6,
      }}
    />
  ]
  const contentAprob = [
    <Header color="brand" content="Aprobador de area"
      style={{
        msGridRows: 1,
        msGridColumns: 6,
      }}
    />,
    <Label
      content={nombreAprob}
      circular
      icon={
        <CloseIcon
          {...{
            onClick: handleRemoveAprob,
          }}
        />
      }
      style={{
        msGridRows: 1,
        msGridColumns: 6,
      }}
    />
  ]
  function handleRemoveAdmin(index: any) {
    const nuevalista = datacorreoadmin.filter((item: any) => item.name !== index);
    setdatacorreoadmin(nuevalista);
    console.log(datacorreoadmin);
    idadmin.push(index);
  }
  function handleRemoveAprob(index: any) {
    const nuevalista = datacorreoaprob.filter((item: any) => item.name !== index);
    setdatacorreoaprob(nuevalista);
    console.log(datacorreoaprob);
    setupdateAprobs(true);
    idaprob.push(index)
  }
  function handleAddAdmin() {
    if (datacorreoadmin.length > 0) {
      datacorreoadmin.map((e: any) => {
        if (e.name !== targetAprob.name) {
          corrAprob.push({ name: targetAprob.name, mail: correoAprob });
          setdatacorreoadmin([...datacorreoadmin, { name: targetAprob.name, mail: correoAprob }]);
        }
      });
    } else {
      datacorreoadmin.push({ name: targetAprob.name, mail: correoAprob });
    }
    let cornum: any = corrAprob.length;
    let cordata: any = corrAprob;
    setCorreo(cordata[cornum]);
    setupdateAdmin(true);
    setEstadoAdmin(true);

  }
  function handleAddApro() {
    if (datacorreoaprob.length > 0) {
      datacorreoaprob.map((e: any) => {
        if (e.name !== targetAprob.name) {
          corrAprob.push({ name: targetAprob.name, mail: correoAprob });
          setdatacorreoaprob([...datacorreoaprob, { name: targetAprob.name, mail: correoAprob }]);
        }
      });
    } else {
      datacorreoaprob.push({ name: targetAprob.name, mail: correoAprob });
    }
    console.log(datacorreoaprob);
    let cornum: any = corrAprob.length;
    let cordata: any = corrAprob;
    setCorreoAprob(cordata[cornum]);
    let peopleaprob: any = document.querySelector('#peopleaprob');
    setupdateAprobs(true);
    peopleaprob.selectedPeople = [];
    setEstadoAprob(true);
  }

  console.log(datacorreoaprob);
  let aprobador = false;
  let admin = false;
  let admingeneral = false;
  if (params.rol === 'Aprobador') {
    aprobador = true;
  } else if (params.rol === 'Administrador') {
    admin = true;
  } else if (params.rol === 'Administrador general') {
    admingeneral = true;
  }

  return (
    <>
      {aprobador ? <Header className="NewAreaCrear" as="h4" content="Visualizar área" /> : admin ? <Header className="NewAreaCrear" as="h4" content="Actualizar aprobadores" /> : admingeneral ? <Header className="NewAreaCrear" as="h4" content="Actualizar aprobadores" /> : ''}
      <div id="cssSeleccion" className="diveij">
        <Grid className="GridNombre"
          columns={4}
          content={[input.map((element) => (
            element.name === "" && element.type === "" ? ""
              : element.name === "NombreArea" ?
                <Input className="InputArea"
                  type={`${element.type}`}
                  placeholder={`${"Escriba Aquí­"}`}
                  name={`${element.name}`}
                  id={`${element.name}`}
                  defaultValue={element.value}
                  onChange={(e) => handleChange(e)}
                  label={`${element.label}`}
                  disabled={aprobador ? true : admin ? false : admingeneral ? false : false}
                  required
                /> : ""
          ))]}
        />
        <Grid className="Grid1Update"
          columns={4}
          content={input.map((element) => (
            element.name === "" && element.type === "" ? ""
              : element.name === "AdministradorArea" ?
                <Grid className="columns"
                  columns={1}
                  rows={1}
                  content={[<Label className="labeladmapro" content={element.name === "AdministradorArea" ? "Administrador del área" : element.name === "CorreoAdmin" ? "Administrador del área" : ""} style={{ color: "black" }} />, <div className="peopleadmin"><PeoplePicker userType={UserType.user} className="PeoplePickerone" id="peopleadmin" selectionMode="single" selectionChanged={(e) => handelInput(e, element.name)} placeholder={element.name === "AdministradorArea" ? "Buscar..." : element.name === "CorreoAdmin" ? "Buscar..." : ""}></PeoplePicker></div>]}
                /> : element.name === "CorreoAdmin" ?
                  <div>
                    <Input className="Inputcorreoadmin"
                      label={`${element.label} `}
                      type={`${element.type}`}
                      name={`${element.name}`}
                      id={`${element.name}`}
                      value={correo ? correo : ""}
                      disabled={aprobador ? true : admin ? false : admingeneral ? false : false}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    {admingeneral ? <Button className="buttonagregar" content={"Agregar"} onClick={handleAddAdmin}></Button> : ''}
                  </div>
                  : ""
          ))}
        />
        <Grid className="Grid1Update"
          columns={4}
          content={input.map((element) => (
            element.name === "" && element.type === "" ? ""
              : element.name === "Aprobador" ?
                <Grid className="columns"
                  columns={1}
                  rows={1}
                  content={[<Label className="labeladmapro" content={element.name === "Aprobador" ? "Aprobador" : element.name === "CorreoAprobador" ? "Correo del Aprobador" : ""} />, <PeoplePicker userType={UserType.user} className="PeoplePickerone" disabled={aprobador ? true : false} selectionMode="single" selectionChanged={(e) => handelInput(e, element.name)} placeholder={element.name === "Aprobador" ? "Buscar..." : element.name === "CorreoAprobador" ? "Buscar..." : ""}></PeoplePicker>]}
                /> : element.name === "CorreoAprobador" ?
                  <div>
                    <Input className="Inputcorrapro"
                      label={`${element.label} `}
                      type={`${element.type}`}
                      name={`${element.name}`}
                      id={`${element.name}`}
                      value={correoAprob ? correoAprob : ""}
                      disabled={aprobador ? true : admin ? false : admingeneral ? false : false}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    {!aprobador ? <Button className="buttonagregar" content={"Agregar"} onClick={handleAddApro} ></Button> : ''}
                  </div> : ""
          ))}
        />
        <Grid id='cards' className="grid3"
          columns={3}
          content={[
            <Card className="areacard" aria-roledescription="card avatar">
              <Card.Header fitted>
                <Flex >
                  <Flex column>
                    <Text className="labelcard" content="Administrador del area" weight="bold" />
                  </Flex>
                </Flex>
              </Card.Header>
              {estadoAdmin === true ?

                <Card.Body fitted>
                  <Flex >
                    <Grid
                      columns={2}
                      content={datacorreoadmin.map((elem: any) => ([<Text content={elem.name} />, admingeneral ? <TrashCanIcon className="IcoBasura" onClick={() => handleRemoveAdmin(elem.name)} /> : '']))}
                    />
                  </Flex>
                </Card.Body> : ""}
            </Card>,
            <Card className="areacard" aria-roledescription="card avatar">
              <Card.Header fitted>
                <Flex>
                  <Flex column>
                    <Text className="labelcard" content="Aprobador del Area" weight="bold" />
                  </Flex>
                </Flex>
              </Card.Header>
              {estadoAprob === true ?
                <Card.Body fitted>
                  <Flex>
                    <Grid
                      columns={2}
                      content={datacorreoaprob.map((elm: any) => ([<Text content={elm.name} />, !aprobador ? <TrashCanIcon style={{ cursor: "pointer" }} className="IcoBasura" onClick={() => handleRemoveAprob(elm.name)} /> : '']))}
                    />
                  </Flex>
                </Card.Body> : ""}
            </Card>,
            !aprobador ?
              <Button className="buttonguardarend" disabled={loading} content={"Actualizar"} onClick={handleSubmit} primary></Button> : ''
          ]}
        />
      </div>
      <Dialog
        open={updateConfirm}
        onOpen={() => setupdateConfirm(true)}
        onCancel={() => {
          setupdateConfirm(false)
        }}
        onConfirm={() => history(`/areas`)}
        confirmButton="Aceptar"
        content="Los datos han sido actualizados exitosamente"
        header="Area actualizada"
      />
    </>
  );
};
Form.propTypes = {};
export default Form;
