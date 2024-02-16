
import { Grid, Label } from "@fluentui/react-northstar";
import { useData } from "@microsoft/teamsfx-react";
import { useContext, useEffect, useState } from "react";
import { TeamsFxContext } from "../Context";
import CreateUserPara from "./CreateUserPara";
import SearchParametriza from "./SearchParametriza";
import TablaParametrizar from "./TablaParametrizar";
import TextArea from "./TextArea";
import TextAreaPlantilla from "./TextAreaPlantilla";
import "./Welcome.css";
import { DateFormsTiempo } from './types';


export function WelcomeParametrizar(props: {
  showFunction?: boolean;
  environment?: string;

}) {

  interface FormState {
    inputValues: DateFormsTiempo
  };
  const [saveusername, setsaveusername] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValues, setInputValues] = useState<FormState["inputValues"]>({
    Tiempomax: 0,
    Tiempomin: 0,
    Escalatiempomax: '',
    Escalatiempomin: '',
  });
  const inputItemsmin = [
    { name: 'min', label: 'Días', value: 'Días' },
    { name: 'min', label: 'Semana', value: 'Semana' },
    { name: 'min', label: 'Mes', value: 'Mes' },
  ];
  const inputItemsmax = [
    { name: 'max', label: 'Días', value: 'Días' },
    { name: 'max', label: 'Semana', value: 'Semana' },
    { name: 'max', label: 'Mes', value: 'Mes' },
  ];



  const [valuecorreo, setvaluecorreo] = useState('');
  const [opendialog, setOpendialog] = useState(false);
  const { showFunction, environment } = {
    showFunction: true,
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const inputItemspermisos = [
    { name: 'admin', label: 'Administrador', value: 'Administrador' },
    { name: 'adminGen', label: 'Adminitrador General', value: 'Adminitrador General' },
    { name: 'Aprob', label: 'Aprobador', value: 'Aprobador' },
  ];


  const steps = ["local", "azure", "publish"];
  const friendlyStepsName: { [key: string]: string } = {
    local: "1. Build your app locally",
    azure: "2. Provision and Deploy to the Cloud",
    publish: "3. Publish to Teams",
  };
  const [selectedMenuItem, setSelectedMenuItem] = useState("local");
  const items = steps.map((step) => {
    return {
      key: step,
      content: friendlyStepsName[step] || "",
      onClick: () => setSelectedMenuItem(step),
    };
  });

  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, data, error } = useData(async () => {
    if (teamsUserCredential) {
      const userInfo = await teamsUserCredential.getUserInfo();
      return userInfo;
    }
  });
  const userName = loading || error ? "" : data!.displayName;
  function handleChange(evt: any) {
    console.log(evt.target);
    setInputValues({
      ...inputValues,
      [evt.target.name]: evt.target.value,
    })
    console.log(inputValues);
  }
  function handelInput(e: any) {
    console.log(e);

    setvaluecorreo(e.target.selectedPeople[0].scoredEmailAddresses[0].address)

  }

  function handleSelect(params: any) {

  }
  function handleSubmit() {
    ;
  }
  function handleInput(e: any) {
    console.log(e);

  }
  useEffect(() => {
  }, [saveusername])

  return (
    <>
      {/* <Breadcrumb crumbs={crumbs} selected={selected} /> */}

      <SearchParametriza />
      <Grid
        columns={1}
        content={[
          <Label className="labelPlantillaParametriza" content="Asignar permisos" />
          ,
          <div className="celdaBtnCrear">
            <CreateUserPara setsaveusername={setsaveusername} />
          </div>
        ]}
      />
      <TablaParametrizar setsaveusername={setsaveusername} saveusername={saveusername} opendialog={opendialog} setOpendialog={setOpendialog} />

      <div className="pantallaparame">

        <Grid id='CuadrosParame' className="grid1parametriza"
          columns={2}
          content={[
            <Grid className="Plantillas"
              columns={1}
              rows={1}
              content={[
                <Label content="Plantilla de alertas vía correo" />,
                <TextArea />
              ]}
            />,
            <Grid className="Plantillas"
              columns={2}
              rows={1}
              content={[
                <div style={{ display: "inline" }}>
                  <Label content="Plantilla de Paz y Salvo" />
                  <TextAreaPlantilla />
                </div>
              ]}
            />
          ]}
        />

      </div>
    </>
  );
}
