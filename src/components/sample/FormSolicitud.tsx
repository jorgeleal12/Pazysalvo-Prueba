/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CallControlShareIcon,
  ChatIcon,
  ChevronEndMediumIcon,
  CloseIcon,
  ExcelIcon,
  FilesPdfColoredIcon,
  FilesPictureColoredIcon,
  PhoneArrowIcon,
  PowerPointIcon,
  UrgentIcon,
  WordIcon
} from "@fluentui/react-icons-northstar";
import {
  Button,
  Dialog,
  Header,
  Input,
  Label,
  TextArea
} from "@fluentui/react-northstar";
import { ProviderState, Providers } from "@microsoft/mgt-element";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { TeamsFxContext } from "../Context";
import "./FormSolicitud.css";
import TablaAprob from "./TablaAprob";
const Form = () => {
  const id: any = useParams();
  let form = {
    fields: {
      Title: "Solicitud",
      NombreSolicitante: "",
      CorreoSolicitante: "",
      Dependencia: "",
      Cargo: "",
      FechaIngreso: "",
      CorreoPersonal: "",
      TelefonoFijo: "",
      TelefonoCelular: "",
      DptoResidencia: "",
      CiudadResidencia: "",
      Direccion: "",
      Motivo: "",
      JefeInmediato: "",
      Tercero: "",
      Estado: "",
      FechaAprobado: "",
      FechaLimite: "",
      Area: "",
      AprobadorArea: "",
      CorreoAprobador: "",
      Pendientes: "",
      MensajeAdjuntos: "",
      ColumnaPrueba: "",
      FechaCreado: "",
      AlertarATodos: "no",
    },
  };
  const [call, setcall] = useState({});
  const [input, setInput] = useState([
    { type: "", name: "", label: "", value: "" },
  ]);

  const [alert, setAlert] = useState("");
  const [numbretask, setNumbretask] = useState("");
  const [mailChatdestino, setMailChatdestino] = useState("");
  const [mailChatpartida, setMailChatpartida] = useState("");
  const [memail, setMemail] = useState("");
  const [idnotificacion, setidnotificacion] = useState('');
  const [urlchat, setUrlchat] = useState("");
  const [adminGen, setAdminGen] = useState(false);
  const [aprob, setaprob] = useState(false);
  const [admin, setadmin] = useState(false);
  const [invitado, setinvitado] = useState('');
  const [jefein, setJefein] = useState(false);
  const [gestorDocu, setgestorDocu] = useState(false);
  const [correo, setcorreo] = useState(String);
  const [notificacion, setnotificacion] = useState(false);
  const [notificacionusufinal, setnotificacionusufinal] = useState(false);
  const [correopermi, setcorreopermi] = useState(String);
  const [idatableprob, setidatableprob] = useState('');
  const [file, setFile] = useState(null);
  const [mensajeerror, setmensajeerror] = useState('');
  const [rolespecifico, setrolespecifico] = useState(null);
  const [opensim, setOpensim] = useState(false);
  const [opensiri, setOpensiri] = useState(false);
  const [correojefeinme, setcorreojefeinme] = useState('');
  const [mensajeNoti, setmensajeNoti] = useState('');
  const [notificacionDialog, setnotificacionDialog] = useState(false);
  const [mensajeusufinal, setmensajeusufinal] = useState('');
  const [usunotfibase64, setusunotfibase64] = useState('');
  const [adjuntousufinal64, setadjuntousufinal64] = useState('');
  const [fileext, setfileext] = useState('');
  const [filename, setfilename] = useState('');
  const [filenameactual, setfilenameactual] = useState('');
  const [mensajeactual, setmensajeactual] = useState('');
  const [base64actual, setbase64actual] = useState('');
  const [fileactual64, setfileactual64] = useState('');
  const [filexteactual, setfilexteactual] = useState('');
  const chat = {
    chatType: "oneOnOne",
    members: [
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        roles: ["owner"],
        "user@odata.bind": `https://graph.microsoft.com/v1.0/users(\'${mailChatpartida}\')`,
      },
      {
        "@odata.type": "#microsoft.graph.aadUserConversationMember",
        roles: ["owner"],
        "user@odata.bind": `https://graph.microsoft.com/v1.0/users(\'${mailChatdestino}\')`,
      },
    ],
  };


  const { teamsUserCredential } = useContext(TeamsFxContext);
  const history = useNavigate();
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      await teamsfx.login(scope);
      let resChat;
      const dataMe: any = await graph.api("/me").get();
      setMemail(dataMe.mail);
      setcorreo(dataMe.mail);
      if (Object.keys(call).length > 0) {
        await graph.api('/communications/calls')
          .post(call).then((response) => {
            console.log('Llamada realizada:', response);
            // Realizar cualquier otra acción después de realizar la llamada
          })
          .catch((error) => {
            console.error('Error al realizar la llamada:', error);
            // Manejar el error de alguna manera adecuada
          });
      }
      if (mailChatdestino !== '' && mailChatpartida !== '') {
        resChat = await graph.api('/chats').version("beta").post(chat);
        if (resChat.webUrl) {
          window.open(resChat.webUrl);
          setMailChatdestino('');
          setMailChatpartida('');
        }
      }
      const dataForm: any = await graph
        .api(
          `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items/${id.id}`
        )
        .get();

      const dataParam: any = await graph
        .api(
          `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/items?expand=fields(select=*)`
        )
        .get();


      dataParam.value.forEach((element: any) => {
        if (element.fields['Correo'] === dataMe['mail']) {
          setrolespecifico(element.fields['Permisos']);
        }
      });

      // Call graph api directly to get user profile information
      const columns: any = await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/columns"
        )
        .get();
      const items: any = await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items?expand=fields(select=*)"
        )
        .get();
      if (input.length === 1) {
        for (let index = 0; index < columns.value.length; index++) {
          if (columns.value[index].displayName === "NombreSolicitante") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Nombre Solicitante",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
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
          if (columns.value[index].displayName === "Documento") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Documento",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
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
          if (columns.value[index].displayName === "CorreoSolicitante") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Correo corporativo",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Correo de solicitante",value:""});
              } 
              */
          }
          if (columns.value[index].displayName === "Dependencia") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Dependencia",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Dependencia",value:""});
              }
              */
          }
          if (columns.value[index].displayName === "Cargo") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Cargo",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Cargo",value:""});
              }
              */
          }
          if (columns.value[index].displayName === "FechaIngreso") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Fecha de ingreso",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Fecha de ingreso",value:""});
              }
              */
          }
          if (columns.value[index].displayName === "FechaCreado") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Fecha de solicitud",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Fecha de creado",value:""});
              } 
              */
          }
          if (columns.value[index].displayName === "JefeInmediato") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Jefe Inmediato",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
                }
                if (dataMe.displayName === dataForm.fields[key]) {
                  setJefein(true);
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Jefe Inmediato",value:""});
              }
              */
          }
          if (columns.value[index].displayName === "CorreoJefeInmediato") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  setcorreojefeinme(dataForm.fields[key]);
                }
                if (dataMe.displayName === dataForm.fields[key]) {
                  setJefein(true);
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Jefe Inmediato",value:""});
              }
              */
          }
          if (columns.value[index].displayName === "Motivo") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Motivo",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Motivo",value:""});
              }
              */
          }
          if (columns.value[index].displayName === "TelefonoCelular") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Número de contacto",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Telefono Celular",value:""});
              }
              */
          }
          if (columns.value[index].displayName === "CorreoPersonal") {
            let indice = "";
            for (const key in dataForm.fields) {
              if (key === columns.value[index].displayName) {
                if (Object.hasOwnProperty.call(dataForm.fields, key)) {
                  input.push({
                    type: "text",
                    name: columns.value[index].name,
                    label: "Correo Personal",
                    value: dataForm.fields[key] ? dataForm.fields[key] : "",
                  });
                }
              } else {
                indice = index.toString();
              }
            }
            /*
              if (indice!=="") {
                input.push({ type: "text", name: columns.value[indice].name, label: "Correo Personal",value:""});
              }
              */
          }

        }
      }

      if (mensajeNoti && idatableprob !== '') {
        const fieldValueSet = {
          Notifica: 'Si',
          TextoNoti: mensajeNoti,
          AdjuntoNoti: JSON.stringify(file),
          Pendientes: 'Si'
        };
        await graph
          .api(
            `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/11e5896f-d46e-47a7-a759-74d9d34aa39b/items/${idatableprob}/fields`
          ).update(fieldValueSet);
        setnotificacionDialog(true);
      }
      if (form.fields.NombreSolicitante !== "") {
        const res = await graph
          .api(
            "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items"
          )
          .post(form);
        return { res };
      }
      if (alert !== " ") {
        const fieldValueSet = {
          AlertarATodos: "si",
        };
        await graph
          .api(
            `/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items/${id.id}/fields`
          )
          .update(fieldValueSet);
      }

      // if (Object.keys(call).length > 0) {
      //   await graph.api("/communications/calls").post(call);
      // }
      // if (mailChatdestino !== " " && mailChatpartida !== " ") {
      //   resChat = await graph.api("/chats").post(chat);
      // }
      // if (resChat.webUrl) {
      //   window.open(resChat.webUrl);
      // }
      // Initialize Graph Toolkit TeamsFx provider
      const provider = new TeamsFxProvider(teamsfx, scope);
      Providers.globalProvider = provider;
      await teamsfx.login(scope);
      Providers.globalProvider.setState(ProviderState.SignedIn);
      return { columns, items, dataForm, dataMe, dataParam, graph };
    },
    {
      scope: [
        "User.Read",
        "Sites.Read.All",
        "Sites.ReadWrite.All",
        "Group.ReadWrite.All",
        "Application.ReadWrite.All",
        "Chat.Create",
        "Chat.ReadWrite",
        "Calls.Initiate.All"
      ],
      credential: teamsUserCredential,
    }
  );

  let invitadoPer;
  let idAprob;
  for (let index = 0; index < data?.dataParam.value.length; index++) {
    const element = data?.dataParam.value[index];
    let correopermi = element.fields['Correo'].trim();
    let correome = correo;
    console.log(correopermi, correome);
    if (correopermi === correome) {
      invitadoPer = element.fields['Permisos']
      idAprob = element.fields['id'];
    }
  }
  function validarAdmin(params: any) {
    return true;
  }

  useEffect(() => { }, []);
  function handleSubmit() {
    reload();
  }
  function handleChange(e: any) {
    if (e.target.name === "NombreSolicitante") {
      form.fields.NombreSolicitante = e.target.value;
    }
    if (e.target.name === "CorreoSolicitante") {
      form.fields.CorreoSolicitante = e.target.value;
    }
    if (e.target.name === "Dependencia") {
      form.fields.Dependencia = e.target.value;
    }
    if (e.target.name === "Cargo") {
      form.fields.Cargo = e.target.value;
    }
    if (e.target.name === "FechaIngreso") {
      form.fields.FechaIngreso = e.target.value;
    }
    if (e.target.name === "FechaIngreso") {
      form.fields.FechaIngreso = e.target.value;
    }
    if (e.target.name === "CorreoPersonal") {
      form.fields.CorreoPersonal = e.target.value;
    }
    if (e.target.name === "TelefonoFijo") {
      form.fields.TelefonoFijo = e.target.value;
    }
    if (e.target.name === "TelefonoCelular") {
      form.fields.TelefonoCelular = e.target.value;
    }
    if (e.target.name === "DptoResidencia") {
      form.fields.DptoResidencia = e.target.value;
    }
    if (e.target.name === "CiudadResidencia") {
      form.fields.CiudadResidencia = e.target.value;
    }
    if (e.target.name === "Direccion") {
      form.fields.Direccion = e.target.value;
    }
    if (e.target.name === "Motivo") {
      form.fields.Motivo = e.target.value;
    }
    if (e.target.name === "JefeInmediato") {
      form.fields.JefeInmediato = e.target.value;
    }
    if (e.target.name === "Tercero") {
      form.fields.Tercero = e.target.value;
    }
    if (e.target.name === "Estado") {
      form.fields.Estado = e.target.value;
    }
    if (e.target.name === "FechaAprobado") {
      form.fields.FechaAprobado = e.target.value;
    }
    if (e.target.name === "Area") {
      form.fields.Area = e.target.value;
    }
    if (e.target.name === "AprobadorArea") {
      form.fields.AprobadorArea = e.target.value;
    }
    if (e.target.name === "CorreoAprobador") {
      form.fields.CorreoAprobador = e.target.value;
    }
    if (e.target.name === "MensajeAdjuntos") {
      form.fields.MensajeAdjuntos = e.target.value;
    }
    if (e.target.name === "ColumnaPrueba") {
      form.fields.ColumnaPrueba = e.target.value;
    }
    if (e.target.name === "FechaCreado") {
      form.fields.FechaCreado = e.target.value;
    }
  }
  const [open, setOpen] = useState(false);
  const [menssageerror, setmenssageerror] = useState("");
  function handleAlertar() {
    setAlert("si");
    reload();
  }
  function handlenotificacionSoli(params: any) {
    console.log();


  }
  function handlecall() {
    let call = {
      "@odata.type": "#microsoft.graph.call",
      callbackUri: "https://bot.contoso.com/callback",
      targets: [
        {
          "@odata.type": "#microsoft.graph.invitationParticipantInfo",
          identity: {
            "@odata.type": "#microsoft.graph.identitySet",
            user: {
              "@odata.type": "#microsoft.graph.identity",
              displayName: "Taño",
              id: "ae4527dc-dd7e-45e1-a3cd-cf3e6bde5462",
            },
          },
        },
      ],
      requestedModalities: ["audio"],
      mediaConfig: {
        "@odata.type": "#microsoft.graph.serviceHostedMediaConfig",
      },
    };
    setcall(call);
    reload();
  }
  useEffect(() => {

    if (usunotfibase64 !== '' && usunotfibase64 !== undefined) {
      let filenameBase = JSON.parse(usunotfibase64).filename;
      let extension = filenameBase.split('.');
      setadjuntousufinal64(JSON.parse(usunotfibase64).dataURL);
      setfilename(filenameBase);
      setfileext(extension[1].toString());
    } else {

      setfilename('');
      setfileext('');
    }
  }, [mensajeusufinal, usunotfibase64])
  function getSigdea() {


    const resultcc = input.find(searchcc);
    console.log(resultcc?.value);
    setOpen(true);
    fetch(
      `https://10.253.97.4/task?cedula=${resultcc?.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    )
      .then((res) => res.json())

      .catch((error) => console.error("Error:", error))

      .then((response) => {
        console.log("Success:", response);

        setNumbretask(response.numactividades);
      });
  }
  function searchcc(cc: any) {
    return cc.label == "Documento";
  }
  function handleChat() {
    setMailChatdestino("dcheca@procuraduria.gov.co");
    setMailChatpartida(memail);
    reload();
  }

  const handleFile = async (e: any) => {
    setmenssageerror("");
    const file = e.target.files[0];
    const base64: any = await convertBase64(file);
    setFile(base64);
    console.log(base64);

  };
  const uploadFile = () => {
    if (file) {
      reload();
    } else {
      setmenssageerror("No tiene ningun archivo adjunto");
    }
  };
  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        const result = {
          dataURL: fileReader.result,
          filename: file.name,
        };
        resolve(result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  function handlenotificacion() {
    if (idatableprob !== '') {
      setmensajeerror('');
      setnotificacion(true);
    } else {
      setmensajeerror('Debes primero seleccionar un areá');
    }

  }


  function handleSim() {
    setOpensim(true);
  }
  function handleSiri() {
    setOpensiri(true);
  }
  function handleMjsNotifi(e: any) {
    setmensajeNoti(e.target.value);
  }
  useEffect(() => {
    if (base64actual !== '') {
      if (base64actual !== undefined) {
        if (base64actual !== 'null') {
          console.log(base64actual);

          let filenameBase = JSON.parse(base64actual).filename;
          let extension = filenameBase.split('.');
          setfileactual64(JSON.parse(base64actual).dataURL);
          setfilenameactual(filenameBase);
          setfilexteactual(extension[1].toString());
        }

      } else {
        setfilenameactual('');
        setfilexteactual('');

      }



    }
  }, [base64actual]);


  async function handleDownload(base64: string, filename: string) {
    const linkSource = base64;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

  }


  return (
    <>
      <NavLink to={`/solicitud`}>
        <Button className="volverSoli" content={"Solicitudes"} secondary />
      </NavLink>

      <ChevronEndMediumIcon />
      <Label as="h2" content={"Ver solicitud"} />

      <div className="divcomplete">
        <Header className="IDSolicitud" as="h4" content={`ID #${id.id}`} />
        <div className="contenedor">
          <div className="divTable">
            {input.map(
              (element) =>
                element.name !== "" && (
                  <Input
                    type={`${element.type}`}
                    label={`${element.label} `}
                    placeholder={`${element.name}`}
                    name={`${element.name}`}
                    id={`${element.name}`}
                    value={`${element.value ? element.value : ""}`}
                    disabled
                    onChange={(e) => handleChange(e)}
                  />
                )
            )}
            <div className="ButtonsInteract">
              <Label
                className="labelcontactar"
                content={"Contactar al solicitante"}
              />
              <Button
                className="buttonMessage"
                content={"Chat"}
                onClick={handleChat}
                secondary
              >
                {" "}
                <ChatIcon size="large" />
              </Button>
              <Button
                className="buttonCall"
                content={"Llamar"}
                onClick={handlecall}
                secondary
              >
                {" "}
                <PhoneArrowIcon size="large" />
              </Button>
              {invitadoPer === 'solicitante' ?
                <Button
                  className="buttonShare"
                  content={"Compartir"}
                  onClick={handlenotificacionSoli}
                  secondary
                >
                  {" "}
                  <CallControlShareIcon size="large" />
                </Button>
                : <Button
                  className="buttonShare"
                  content={"Compartir"}
                  onClick={handlenotificacion}
                  secondary
                >
                  {" "}
                  <CallControlShareIcon size="large" />
                </Button>
              }
              {mensajeerror !== '' ? <h5>{mensajeerror}</h5> : ''}
            </div>
            <div style={{ color: "red" }}>{numbretask ? numbretask : ""}</div>
          </div>

          <div className="buttonexterno">
            <Button
              className="buttonSigdea"
              content={"Consultar SIGDEA"}
              onClick={getSigdea}
              secondary
            ></Button>
            <Button
              className="buttonSim"
              content={"Consultar SIM"}
              onClick={handleSim}
              secondary
            ></Button>
            <Button
              className="buttonSiri"
              content={"Consultar SIRI"}
              onClick={handleSiri}
              secondary
            ></Button>
          </div>
        </div>
      </div>

      <div className="n">
        <Button
          icon={<UrgentIcon className="campana" />}
          className="buttonsave"
          content={"Alertar a todos"}
          onClick={handleAlertar}
          secondary
        ></Button>
        <TablaAprob setmensajeactual={setmensajeactual} setusunotfibase64={setusunotfibase64} setbase64actual={setbase64actual} mensajeusufinal={mensajeusufinal} setnotificacionusufinal={setnotificacionusufinal} setmensajeusufinal={setmensajeusufinal} table={'solicitud'} setidatableprob={setidatableprob} params={id.id} correojefeinme={correojefeinme} correo={correo} rol={rolespecifico} jefein={jefein} adminGen={adminGen} />
      </div>

      <Dialog
        open={open}
        onOpen={() => setOpen(true)}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        confirmButton="Continuar"
        content="El usuario presenta procesos pendientes en el sistema SIGDEA, para mayor información por favor CONSULTA DIRECTAMENTE EN EL APLICATIVO."
        header=""
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => setOpen(false),
        }}
      />
      <Dialog
        open={opensim}
        onOpen={() => setOpensim(true)}
        onCancel={() => setOpensim(false)}
        onConfirm={() => setOpensim(false)}
        confirmButton="Continuar"
        content="Para obtener información por favor accede directamente al sistema SIM. "
        header=""
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => setOpen(false),
        }}
      />
      <Dialog
        open={opensiri}
        onOpen={() => setOpensiri(true)}
        onCancel={() => setOpensiri(false)}
        onConfirm={() => setOpensiri(false)}
        confirmButton="Continuar"
        content="Para obtener información por favor accede directamente al sistema SIRI. "
        header=""
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => setOpen(false),
        }}
      />
      <Dialog
        open={open}
        onOpen={() => setOpen(true)}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        confirmButton="Continuar"
        content="El usuario presenta procesos pendientes en el sistema SIGDEA, para mayor información por favor CONSULTA DIRECTAMENTE EN EL APLICATIVO."
        header=""
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => setOpen(false),
        }}
      />
      <Dialog
        open={notificacion}
        onOpen={() => setnotificacion(true)}
        onCancel={() => setnotificacion(false)}
        onConfirm={() => {
          reload();
          setnotificacion(false);
        }}
        cancelButton="Cancelar"
        confirmButton="Enviar"
        content={<div>
          <TextArea name="" id="" defaultValue={mensajeactual !== '' ? mensajeactual : ''} onChange={(e) => handleMjsNotifi(e)} placeholder={'Escribe aqui si deseas enviar un mensaje'} style={{ borderColor: '#B5B5B5', height: '100px', width: '530px' }} />
          <div className="fileaproblbl"><Input id='fileaprob' type='file' onChange={(e) => handleFile(e)} label={'Adjuntar archivo'} />

            {filexteactual !== '' ? filexteactual === 'docx' || filexteactual === 'doc' ? <WordIcon onClick={() => handleDownload(fileactual64, filenameactual)} size="larger" /> : filexteactual === 'xls' || filexteactual === 'xlsx' ? <ExcelIcon onClick={() => handleDownload(fileactual64, filenameactual)} size="larger" /> : filexteactual === 'ppt' || filexteactual === 'pptx' ? <PowerPointIcon onClick={() => handleDownload(fileactual64, filenameactual)} size="larger" /> : filexteactual === 'pdf' ? <FilesPdfColoredIcon onClick={() => handleDownload(fileactual64, filenameactual)} size="larger" /> : filexteactual === 'jpg' || filexteactual === 'jpeg' || filexteactual === 'png' || filexteactual === 'gif' ? <FilesPictureColoredIcon onClick={() => handleDownload(fileactual64, filenameactual)} size="larger" /> : '' : ''}
            <span>{filenameactual !== '' ? filenameactual : ''}</span>
          </div>

        </div>}
        header="Notificación"
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => {
            setnotificacion(false)

          },
        }}
      />
      <Dialog
        open={notificacionusufinal}
        onOpen={() => setnotificacionusufinal(true)}
        onCancel={() => setnotificacionusufinal(false)}
        onConfirm={() => {
          reload();
          setnotificacionusufinal(false);
        }}
        cancelButton="Cancelar"
        confirmButton="Continuar"
        content={<div>

          {mensajeusufinal !== '' ? <TextArea name="" id="" defaultValue={mensajeusufinal} style={{ borderColor: '#B5B5B5', height: '100px', width: '530px' }} disabled /> : ''}
          {fileext !== '' ? fileext === 'docx' || fileext === 'doc' ? <WordIcon id='iconoaporb' styles={{ cursor: 'pointer' }} onClick={() => handleDownload(adjuntousufinal64, filename)} size="larger" /> : fileext === 'xls' || fileext === 'xlsx' ? <ExcelIcon onClick={() => handleDownload(adjuntousufinal64, filename)} size="larger" /> : fileext === 'ppt' || fileext === 'pptx' ? <PowerPointIcon onClick={() => handleDownload(adjuntousufinal64, filename)} size="larger" /> : fileext === 'pdf' ? <FilesPdfColoredIcon onClick={() => handleDownload(adjuntousufinal64, filename)} size="larger" /> : fileext === 'jpg' || fileext === 'jpeg' || fileext === 'png' || fileext === 'gif' ? <FilesPictureColoredIcon onClick={() => handleDownload(adjuntousufinal64, filename)} size="larger" /> : '' : ''}
          <span>{filename !== '' ? filename : ''}</span>
        </div>}
        header="Notificación"
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => {
            setnotificacionusufinal(false)

          },
        }}
      />
      <Dialog
        open={notificacionDialog}
        onOpen={() => setnotificacionDialog(true)}
        onCancel={() => setnotificacionDialog(false)}
        onConfirm={() => setnotificacionDialog(false)}
        cancelButton="Cancelar"
        confirmButton="Aceptar"
        content={<div>
          <h4>Se le ha enviado la notificacion al usuario exitosamente</h4>
        </div>}
        header="Notificación"
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => {
            setnotificacionDialog(false);
          },
        }}
      />

    </>
  );
};

Form.propTypes = {};

export default Form;
