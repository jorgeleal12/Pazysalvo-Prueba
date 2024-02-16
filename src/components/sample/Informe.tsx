import { Header, Label } from "@fluentui/react-northstar";
import { ProviderState, Providers } from "@microsoft/mgt-element";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { useContext, useEffect, useState } from "react";
import { TeamsFxContext } from "../Context";
import "./TablaAreas.css";


const ViewInforme = () => {

  const [targetAprob, setTargetAprob] = useState({ name: '', mail: '' });
  const [targetAdmin, setTargetAdmin] = useState({ name: '', mail: '' });
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const [input, setInput] = useState([{ type: "", name: "", label: "", value: '' }]);
  const [edit, setEdit] = useState(false);
  const [correo, setCorreo] = useState("");
  const [correoAprob, setCorreoAprob] = useState("");
  const [form, setForm] = useState({});

  const { loading, error, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      getdata(graph.api("/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items?expand=fields(select=*)").get());

      // Call graph api directly to get user profile information
      // Initialize Graph Toolkit TeamsFx provider
      const provider = new TeamsFxProvider(teamsfx, scope);
      Providers.globalProvider = provider;
      Providers.globalProvider.setState(ProviderState.SignedIn);
    },
    { scope: ["User.Read", "Group.ReadWrite.All"], credential: teamsUserCredential }
  );
  async function getdata(params: any) {
    console.log('informes');

  }

  const [state, setState] = useState(false);
  /*const colums = [];
   for (let index = 0; index < data?.columns.value.length; index++) {
   if (
     !data?.columns.value[index].readOnly &&
     data?.columns.value[index].name !== "Attachments" &&
     data?.columns.value[index].name !== "ContentType"
   ) {
     colums.push(data?.columns.value[index].name);
   }
 }
 console.log(colums);*/

  useEffect(() => {
    setForm({});
  }, []);

  useEffect(() => {

  }, []);


  function handleChange(e: any) {
    console.log(e.target.name);
    let form = {
      fields: {
        Title: e.target.value,
      },
    };
    setForm(form);
  }


  return (
    <>
      <div id='Inform' className="EstiloInformes">
        <Label as="h4" content={"Informes"} />
        <Header className='' as="h3" content={"Informe de Solicitudes"} />
        <Label as="h4" content={"Cumplimiento de tiempos en los trámites"} />
        <iframe title="Proc - Página 1" style={{ height: '65%', width: '100%' }} src="https://app.powerbi.com/reportEmbed?reportId=a7c6b73e-0477-46fd-b135-cf1cde4c3b81&autoAuth=true&ctid=fcb47a6d-46c6-4bf3-b119-d927900ffc19"  ></iframe>
      </div>


    </>
  );
};

export default ViewInforme;
