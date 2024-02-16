import React, { useContext, useState, useEffect } from "react";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import "./TablaAreas.css";
import { Providers, ProviderState } from "@microsoft/mgt-element";
import { useGraph, useGraphWithCredential } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { CloseIcon } from "@fluentui/react-icons-northstar";
import { Button, Input } from "@fluentui/react-northstar";
import { Grid, Flex, Dialog } from "@fluentui/react-northstar";
import { log } from "console";
import { NavLink } from "react-router-dom";
import Form from "./Form";
const CreateSolicitud = () => {
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const [form, setForm] = useState({});

  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      if (Object.keys(form).length > 0) {
        console.log(form);
        const res = await graph
          .api(
            "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/items"
          )
          .post(form);

        return { res };
      }

      const columns = await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6ede574f-6f0b-4eae-a3b2-7ceca635ae00/columns"
        )
        .get();
      // Call graph api directly to get user profile information
      // Initialize Graph Toolkit TeamsFx provider
      //const provider = new TeamsFxProvider(teamsfx, scope);
      //Providers.globalProvider = provider;
      //Providers.globalProvider.setState(ProviderState.SignedIn);
      return { columns };
    },
    { scope: ["User.Read", "Group.ReadWrite.All"], credential: teamsUserCredential }
  );
  console.log(data);

  const [state, setState] = useState(false);
  const colums = [];
  for (let index = 0; index < data?.columns.value.length; index++) {
    if (
      !data?.columns.value[index].readOnly &&
      data?.columns.value[index].name !== "Attachments" &&
      data?.columns.value[index].name !== "ContentType"
    ) {
      colums.push(data?.columns.value[index].name);
    }
  }
  console.log(colums);

  useEffect(() => {
    setForm({});
  }, []);

  useEffect(() => {
    if (data) {
      window.location.reload();
    }
  }, [setState]);

  const fields = [
    {
      label: "Nombre Solicitud",
      name: "nombresolicitud",
      id: "first-name-shorthand",
      key: "first-name",
      required: true,
      control: {
        as: Input,
        showSuccessIndicator: false,
      },
    },
    {
      label: "Correo Solicitante",
      name: "correosolicitante",
      id: "last-name-shorthand",
      key: "last-name",
      required: true,
      control: {
        as: Input,
        showSuccessIndicator: false,
      },
    },
    {
      label: "I agree to the Terms and Conditions",
      control: {
        as: "input",
      },
      type: "checkbox",
      id: "conditions-shorthand",
      key: "conditions",
    },
    {
      control: {
        as: Button,
        content: "Submit",
      },
      key: "submit",
    },
  ];
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
      <NavLink to={`/nuevassolicitudes`} >
        <Button content={"Nueva Solicitud"} secondary />
      </NavLink>
    </>
  );
};

export default CreateSolicitud;
