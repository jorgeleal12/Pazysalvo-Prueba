import { ChevronEndMediumIcon, TrashCanIcon } from '@fluentui/react-icons-northstar';
import { Button, Card, CloseIcon, Dialog, Flex, Grid, Header, Input, Label, Text } from "@fluentui/react-northstar";
import { UserType } from "@microsoft/mgt-components";
import { PeoplePicker } from '@microsoft/mgt-react';
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { TeamsFxContext } from "../Context";
import "./Form.css";
const Form = (dataArea: any) => {
  const history = useNavigate();
  const [form, setForm] = useState({
    fields: {
      Title: "",
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
  const id: any = useParams();
  const [opendialog, setOpendialog] = useState(false);

  const { teamsUserCredential } = useContext(TeamsFxContext);
  const [input, setInput] = useState([{ type: "", name: "", label: "" }]);
  const [edit, setEdit] = useState(false);
  const [correo, setCorreo] = useState("");
  const [correoAprob, setCorreoAprob] = useState("");
  const [corr,] = useState(Array);
  const [corrAprob,] = useState(Array);
  const [contadorremoveadmin, setcontadorremoveadmin] = useState(0);
  const [contadorremoveaprob, setcontadorremoveaprob] = useState(0);
  const [correoAdminTable, setcorreoAdminTable] = useState(Array);
  const [correAprobTable, setcorreAprobTable] = useState(Array);
  const [peoplereset, setpeoplereset] = useState(false);

  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph: any, teamsfx: any, scope: any) => {
      //await teamsfx.login(scope);
      if (form.fields.NombreArea !== "") {
        let datacorreo: any = correAprobTable;
        form.fields.Aprobador = datacorreo[0].name;
        form.fields.CorreoAprobador = datacorreo[0].mail;
        let datacorreoAd: any = correoAdminTable;
        form.fields.AdministradorArea = datacorreoAd[0].name;
        form.fields.CorreoAdmin = datacorreoAd[0].mail;
        const res = await graph
          .api(
            "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items"
          )
          .post(form);
        if (res.id) {
          if (correAprobTable.length > 0) {
            let datacorreo: any = correAprobTable;

            for (let index = 0; index < datacorreo.length; index++) {
              let formAprob: any = {
                fields: {
                  Title: "",
                  NombreAprobador: datacorreo[index].name,
                  CorreodelAprobador: datacorreo[index].mail,
                  CargodelAprobador: '',
                  IDArea: res.id,
                },
              };
              const resAprob = await graph
                .api(
                  "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/2dfcd421-b6ec-45a1-ae01-4dff92bf0f43/items"
                )
                .post(formAprob);
            }
          }
          if (correoAdminTable.length > 0) {
            let datacorreoAd: any = correoAdminTable;
            for (let index = 0; index < datacorreoAd.length; index++) {
              let formAprob: any = {
                fields: {
                  Title: "",
                  AdministradorDelArea: datacorreoAd[index].name,
                  CorreoDelAdministrador: datacorreoAd[index].mail,
                  CargoDelAdministrador: '',
                  IDArea: res.id,
                },
              };

              const resAprob = await graph
                .api(
                  "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/469d4c6a-b63b-4531-ab64-8d65bb17fb69/items"
                )
                .post(formAprob);


            }
          }



          setOpendialog(true);
        }
      }
      // Call graph api directly to get user profile information
      const columns: any = await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/columns"
        )
        .get();
      if (input.length === 1) {
        for (let index = 0; index < columns.value.length; index++) {
          if (columns.value[index].name === "NombreArea") {
            input.push({ type: "text", name: columns.value[index].name, label: "Nombre del Área" });
          }
          if (columns.value[index].name === "AdministradorArea") {
            input.push({ type: "text", name: columns.value[index].name, label: "Administrador del Área" });
          }
          if (columns.value[index].name === "Aprobador") {
            input.push({ type: "text", name: columns.value[index].name, label: "Aprobador del área" });
          }

          if (columns.value[index].name === "CorreoAprobador") {
            input.push({ type: "email", name: columns.value[index].name, label: "Correo del aprobador" });
          }
          if (columns.value[index].name === "CargoAdmin") {
            input.push({ type: "text", name: columns.value[index].name, label: "Cargo del administrador" });
          }
          if (columns.value[index].name === "CargoAprobador") {
            input.push({ type: "text", name: columns.value[index].name, label: "Cargo del aprobador" });
          }
          if (columns.value[index].name === "Estado") {
            input.push({ type: "text", name: columns.value[index].name, label: "Estado" });
          }
          if (columns.value[index].name === "CorreoAdmin") {
            input.push({ type: "text", name: columns.value[index].name, label: "Correo del administrador" });
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
  const inputItems = [
    { label: 'Días', value: 'Días' },
    { label: 'Semana', value: 'Semana' },
    { label: 'Mes', value: 'Mes' },
  ];

  function handleSubmit() {
    reload();
  }



  function handleSelect(params: any) {
    form.fields.TiempoMaximoRespuestaDias = params.value;
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

  let admin = []

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
    const nuevalista = correoAdminTable.filter((item: any) => item.name !== index);
    let indicador = index === contadorremoveaprob ? index + 1 : index;
    setcorreoAdminTable(nuevalista);
    setcontadorremoveadmin(indicador);
    console.log(contadorremoveadmin);
  }

  function handleRemoveAprob(index: any) {
    console.log(correAprobTable);

    const nuevalista = correAprobTable.filter((item: any) => item.name !== index);
    let indicador = index === contadorremoveaprob ? index + 1 : index;
    setcorreAprobTable(nuevalista);
    setcontadorremoveaprob(indicador);
    console.log(index);
  }

  function handleAddAdmin() {
    corr.push({ name: targetAdmin.name, mail: correo });
    setcorreoAdminTable(corr);
    let cornum: any = corr.length;
    let cordata: any = corr;
    console.log(cordata[cornum]);
    setCorreo(cordata[cornum]);
    setEstadoAdmin(true);
    let people: any = document.querySelector('#peopleadmin');
    people.selectedPeople = [];

    setpeoplereset(true);


  }

  function handleAddApro() {
    corrAprob.push({ name: targetAprob.name, mail: correoAprob });
    setcorreAprobTable([...correAprobTable, { name: targetAprob.name, mail: correoAprob }]);
    let cornum: any = corrAprob.length;
    let cordata: any = corrAprob
    setCorreoAprob(cordata[cornum]);
    let peopleaprob: any = document.querySelector('#peopleaprob');
    peopleaprob.selectedPeople = [];
    setEstadoAprob(true);
  }



  return (
    <>

      <NavLink to={`/areas`} >
        <Button className="btnVolverAreas" content={"Áreas"} secondary />
      </NavLink><ChevronEndMediumIcon />
      <Label as="h2" content={"Ver área"} />

      <Header className="NewAreaCrear" as="h4" content="Nueva Área" />
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
                  onChange={(e) => handleChange(e)}
                  label={`${element.label}`}
                  required
                /> : ""
          ))]}
        />
        <Grid className="Grid1"
          columns={4}
          content={input.map((element) => (
            element.name === "" && element.type === "" ? ""
              : element.name === "AdministradorArea" ?
                <Grid className="columns"
                  columns={1}
                  rows={1}
                  content={[<Label className="labeladmapro" content={element.name === "AdministradorArea" ? "Administrador del área" : element.name === "CorreoAdmin" ? "Administrador del área" : ""} style={{ color: "black" }} />, <div className="peopleadmin"><PeoplePicker userType={UserType.user} className="PeoplePickerone" id="peopleadmin" selectionMode="single" selectionChanged={(e) => handelInput(e, element.name)} placeholder={element.name === "AdministradorArea" ? "Buscar..." : element.name === "CorreoAdmin" ? "Buscar..." : ""}></PeoplePicker></div>]}
                /> : element.name === "CorreoAdmin" ?
                  <Input className="Inputcorreoadmin"

                    label={`${element.label} `}
                    type={`${element.type}`}
                    name={`${element.name}`}
                    id={`${element.name}`}
                    value={correo ? correo : ""}
                    onChange={(e) => handleChange(e)}
                  />
                  : element.name === "CargoAdmin" ?
                    <Button className="buttonagregar" content={"Agregar"} onClick={handleAddAdmin}></Button> : ""
          ))}
        />
        <Grid className="Grid1"
          columns={4}
          content={input.map((element) => (
            element.name === "" && element.type === "" ? ""
              : element.name === "Aprobador" ?
                <Grid className="columns"
                  columns={1}
                  rows={1}
                  content={[<Label className="labeladmapro" content={element.name === "Aprobador" ? "Aprobador del área" : element.name === "CorreoAprobador" ? "Correo del Aprobador" : ""} style={{ color: "black" }} />, <PeoplePicker userType={UserType.user} className="PeoplePickerone" id='peopleaprob' selectionMode="single" selectionChanged={(e) => handelInput(e, element.name)} placeholder={element.name === "Aprobador" ? "Buscar..." : element.name === "CorreoAprobador" ? "Buscar..." : ""} aria-required></PeoplePicker>]}
                /> : element.name === "CorreoAprobador" ?
                  <Input className="Inputcorrapro"
                    label={`${element.label} `}
                    type={`${element.type}`}
                    name={`${element.name}`}
                    id={`${element.name}`}
                    value={correoAprob ? correoAprob : ""}
                    onChange={(e) => handleChange(e)}

                  />
                  : element.name === "CargoAprobador" ?
                    <Button className="buttonagregar" content={"Agregar"} onClick={handleAddApro} ></Button> : ""
          ))}
        />
        <Grid id='cards' className="grid3"
          columns={3}
          content={[
            <Card className="areacard" aria-roledescription="card avatar">
              <Card.Header fitted>
                <Flex >
                  <Flex column>
                    <Text className="labelcard" content="Administrador del área" weight="bold" />
                  </Flex>
                </Flex>
              </Card.Header>
              {estadoAdmin === true ?

                <Card.Body fitted>
                  <Flex >
                    <Grid
                      columns={2}
                      content={correoAdminTable.map((element: any, index: any) => (
                        [<Text content={element.name} />, <TrashCanIcon className="IcoBasura" style={{ cursor: 'pointer' }} onClick={() => handleRemoveAdmin(element.name)} />]))}
                    />
                  </Flex>
                </Card.Body> : ""}
            </Card>,
            <Card className="areacard" aria-roledescription="card avatar">
              <Card.Header fitted>
                <Flex>
                  <Flex column>
                    <Text className="labelcard" content="Aprobador del área" weight="bold" />
                  </Flex>
                </Flex>
              </Card.Header>
              {estadoAprob === true ?

                <Card.Body fitted>
                  <Flex>
                    <Grid
                      columns={2}
                      content={correAprobTable.map((elemento: any, index: any) => ([<Text content={elemento.name} />, <TrashCanIcon className="IcoBasura" onClick={() => handleRemoveAprob(elemento.name)} />]))}
                    />
                  </Flex>
                </Card.Body> : ""}
            </Card>,
            <Button id="btnCrearArea" disabled={loading} content={"Guardar"} onClick={handleSubmit} primary></Button>
          ]}
        />
      </div>
      <Dialog open={opendialog}
        onOpen={() => setOpendialog(true)}
        onCancel={() => {
          setOpendialog(false)
        }}
        onConfirm={() => history(`/areas`)}
        confirmButton="Aceptar"
        content="El área se guardo exitosamente"
        header="Área creada"
      />
    </>
  );
};

Form.propTypes = {};

export default Form;
