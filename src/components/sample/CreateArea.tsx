import React, { useContext, useState, useEffect } from "react";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import "./TablaStyle.css";
import { Providers, ProviderState } from "@microsoft/mgt-element";
import { useGraph, useGraphWithCredential } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { CloseIcon } from "@fluentui/react-icons-northstar";
import { Button, Input } from "@fluentui/react-northstar";
import { Grid, Flex, Dialog } from "@fluentui/react-northstar";
import { log } from "console";
import { NavLink } from "react-router-dom";
const CreateSolicitud = (props: {
  rol?: string
}) => {
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const [form, setForm] = useState({});
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      //await teamsfx.login(scope);
      if (Object.keys(form).length > 0) {
        const res = await graph
          .api(
            "groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/items"
          )
          .post(form);
        // Call graph api directly to get user profile information
        // Initialize Graph Toolkit TeamsFx provider
        //const provider = new TeamsFxProvider(teamsfx, scope);
        //Providers.globalProvider = provider;
        //Providers.globalProvider.setState(ProviderState.SignedIn);
        return { res };
      }

      const columns = await graph
        .api(
          "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/6f3c5eb2-86ab-43e1-a11e-94bc9b7afd8a/columns"
        )
        .get();
      return { columns };
    },
    { scope: ["User.Read.All", "Group.ReadWrite.All"], credential: teamsUserCredential }
  );
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
  function handleChange(e: any) {
    let form = {
      fields: {
        Title: e.target.value,
      },
    };
    setForm(form);
  }

  return (
    <>
      {
        props.rol === 'Administrador general' ?
          <NavLink to={`/nuevaarea`} >
            <Button className="buttonNewArea" content={"Nueva área"} secondary />
          </NavLink> : ''
      }
    </>
  );
};

export default CreateSolicitud;
