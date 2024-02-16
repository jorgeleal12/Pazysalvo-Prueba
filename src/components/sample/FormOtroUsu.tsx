import { ChevronEndMediumIcon } from '@fluentui/react-icons-northstar';
import { Button, Header, Input, Label, } from "@fluentui/react-northstar";
import { ProviderState, Providers } from '@microsoft/mgt-element';
import { TeamsFxProvider } from '@microsoft/mgt-teamsfx-provider';
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from "react-router-dom";
import { TeamsFxContext } from "../Context";
import "./FormSolicitud.css";
const FormOtroUsu = () => {
  const id: any = useParams();
  let form = {
    fields: {
      Title: 'Solicitud',
      NombreSolicitante: '',
      Documento: "",
      Cargo: '',
      CorreoSolicitante: '',
      FechaIngreso: '',
      JefeInmediato: '',
      CargoJefeInmediato: "",
      Motivo: '',
      TelefonoCelular: '',
      CorreoPersonal: ''
    }
  };
  const [call, setcall] = useState({});
  const [input, setInput] = useState([{ type: '', name: '', label: '' }]);
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      const dataForm: any = await graph.api(`/me`).get();
      if (form.fields.NombreSolicitante !== "") {
        const res = await graph
          .api(
            "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items"
          )
          .post(form);
        return { res };
      }
      // Call graph api directly to get user profile information
      const columns: any = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/columns").get();
      const items: any = await graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items?expand=fields(select=*)").get();
      for (let index = 0; index < columns.value.length; index++) {
        if (columns.value[index].name === "NombreSolicitante") {
          input.push({ type: "text", name: columns.value[index].name, label: "Nombre del solicitante" });
        }
        if (columns.value[index].name === "Documento") {
          input.push({ type: "text", name: columns.value[index].name, label: "Documento" });
        }

        if (columns.value[index].name === "CorreoSolicitante") {
          input.push({ type: "mail", name: columns.value[index].name, label: "Correo" });
        }
        if (columns.value[index].name === "FechaIngreso") {
          input.push({ type: "date", name: columns.value[index].name, label: "Fecha de ingreso" });
        }
        if (columns.value[index].name === "JefeInmediato") {
          input.push({ type: "email", name: columns.value[index].name, label: "Jefe inmediato" });
        }
        if (columns.value[index].name === "CargoJefeInmediato") {
          input.push({ type: "text", name: columns.value[index].name, label: "Cargo del jefe inmediato" });
        }
        if (columns.value[index].name === "Motivo") {
          input.push({ type: "text", name: columns.value[index].name, label: "Motivo" });
        }
        if (columns.value[index].name === "TelefonoCelular") {
          input.push({ type: "text", name: columns.value[index].name, label: "Número de contacto" });
        }
        if (columns.value[index].name === "CorreoPersonal") {
          input.push({ type: "text", name: columns.value[index].name, label: "Correo personal" })
        }
      }
      // Initialize Graph Toolkit TeamsFx provider
      const provider = new TeamsFxProvider(teamsfx, scope);
      Providers.globalProvider = provider;
      await teamsfx.login(scope);
      Providers.globalProvider.setState(ProviderState.SignedIn);
      return { columns, items, dataForm };
    },
    { scope: ["User.Read", "Sites.Read.All"], credential: teamsUserCredential }
  );
  useEffect(() => {
  }, [loading])
  const [open, setOpen] = useState(
    false
  )
  function handleSubmit() {
    reload();
  }
  function handleChange(e: any) {
    if (e.target.name === "NombreSolicitante") {
      form.fields.NombreSolicitante = e.target.value;
    }
    if (e.target.name === "Documento") {
      form.fields.Documento = e.target.value;
    }
    if (e.target.name === "Cargo") {
      form.fields.Cargo = e.target.value;
    }
    if (e.target.name === "Correo") {
      form.fields.CorreoSolicitante = e.target.value;
    }
    if (e.target.name === "FechaIngreso") {
      form.fields.FechaIngreso = e.target.value;
    }
    if (e.target.name === "JefeInmediato") {
      form.fields.JefeInmediato = e.target.value;
    }
    if (e.target.name === "CargoJefeInmediato") {
      form.fields.CargoJefeInmediato = e.target.value;
    }
    if (e.target.name === "Motivo") {
      form.fields.Motivo = e.target.value;
    }
    if (e.target.name === "TelefonoCelular") {
      form.fields.TelefonoCelular = e.target.value;
    }
    if (e.target.name === "CorreoPersonal") {
      form.fields.CorreoPersonal = e.target.value;
    }

  }
  function handlecall() {

    let call = {
      '@odata.type': '#microsoft.graph.call',
      callbackUri: 'https://bot.contoso.com/callback',
      targets: [
        {
          '@odata.type': '#microsoft.graph.invitationParticipantInfo',
          identity: {
            '@odata.type': '#microsoft.graph.identitySet',
            user: {
              '@odata.type': '#microsoft.graph.identity',
              displayName: 'Taño',
              id: 'ae4527dc-dd7e-45e1-a3cd-cf3e6bde5462'
            }
          }
        }
      ],
      requestedModalities: [
        'audio'
      ],
      mediaConfig: {
        '@odata.type': '#microsoft.graph.serviceHostedMediaConfig'
      }
    }
    setcall(call)
    reload();
  }
  return (
    <>
      <div className='divcompleteMisDatos'>
        <NavLink to={`/areas`} >
          <Button className='botonmbackdatos' content={"Mis datos"} secondary />
        </NavLink><ChevronEndMediumIcon />
        <Label as="h2" content={"Solicitud"} />
        <Header className="NewDatosCrear" as="h4" content="La solicitud que vas a crear pertenece a otro usuario,
       es necesario que suministres todos sus datos para continuar con el trámite. Finalmente el paz y salvo será enviado a tu correo y el de tu compañero." />
        <div className='divTableMisDatosCrear'>

          {input.map(element =>
          (element.name !== "" && element.name !== 'FechaIngreso' ?
            <Input
              className='DatosTableInput'
              type={`${element.type}`}
              label={`${element.label} `}
              placeholder={`${element.label}`}
              name={`${element.name}`}
              id={`${element.name}`}
              onChange={(e) => handleChange(e)}
            /> : element.name === 'FechaIngreso' &&
            <Input
              className='DatosTableInput'
              type={`${element.type}`}
              label={`${element.label} `}
              placeholder={`${element.label}`}
              name={`${element.name}`}
              id={`${element.name}`}
              onChange={(e) => handleChange(e)}
            />
          ))}
          <div className='ButtonsInteract'>

          </div>
          <Button className="ButtonNuevaSolicitud" primary content={"Crear solicitud"} onClick={handleSubmit}></Button>
        </div>


      </div>
    </>
  )
}



export default FormOtroUsu