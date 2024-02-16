import React, { useContext, useState, useEffect } from "react";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import "./TablaStyle.css";
import { Providers, ProviderState } from "@microsoft/mgt-element";
import { useGraph, useGraphWithCredential } from "@microsoft/teamsfx-react";
import { TeamsFxContext } from "../Context";
import { CloseIcon } from "@fluentui/react-icons-northstar";
import { Button, Input, Label, Dialog } from "@fluentui/react-northstar";
import { Usert } from './types'
import Select from 'react-select';
import { PeoplePicker } from '@microsoft/mgt-react';
const CreateUserPara = ({ setsaveusername }: any) => {
  interface FormState {
    inputValues: Usert
  }
  const { teamsUserCredential } = useContext(TeamsFxContext);

  const [open, setOpen] = useState(false);
  const [valuecorreo, setvaluecorreo] = useState('');
  const [namuse, setnamuse] = useState('')
  const [saveuser, setsaveuser] = useState(false);
  const [inputValues, setInputValues] = useState<FormState["inputValues"]>({
    Nombre: "",
    Correo: "",
    Cargo: "",
    Permisos: "",
  })
  let form: any = {
    fields: {
      Nombre: '',
      Correo: '',
      Cargo: '',
      Permisos: '',
      Estado: 'Activo'
    }
  };
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsfx, scope) => {
      if (form.fields.Nombre !== '' && form.fields.Correo !== '' && form.fields.Cargo !== '' && form.fields.Permisos !== '') {
        const res = await graph
          .api(
            "/groups/d7e4fa8f-0fb7-494d-9e6b-622718cf6298/sites/root/lists/9a945235-6750-401d-b700-5abe8aac5641/items"
          )
          .post(form);
        if (res) {
          form.fields.Nombre = '';
          form.fields.Correo = '';
          form.fields.Cargo = '';
          form.fields.Permisos = '';
          setvaluecorreo('');
          setnamuse('');
        }
        return { res };
      }
      //const provider = new TeamsFxProvider(teamsfx, scope);
      //Providers.globalProvider = provider;
      //Providers.globalProvider.setState(ProviderState.SignedIn);
      return {};
    },
    { scope: ["User.Read", "Group.ReadWrite.All"], credential: teamsUserCredential }
  );




  const inputItemspermisos = [
    { name: 'admin', label: 'Administrador', value: 'Administrador' },
    { name: 'adminGen', label: 'Administrador General', value: 'Administrador general' },
    { name: 'Aprob', label: 'Aprobador', value: 'Aprobador' },
    { name: 'usuarioFinal', label: 'Usuario final', value: 'Usuario final' },
    { name: 'gestorDocumental', label: 'Gestor documental', value: 'Gestor documental' },
    { name: 'jefedirecto', label: 'Jefe directo', value: 'Jefe directo' },
  ];





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
  function handleSubmit() {
    console.log('reload');
    setsaveusername(true);
    reload();
    setOpen(false)
  }
  function handelPeople(e: any) {
    setvaluecorreo(e.target.selectedPeople[0].scoredEmailAddresses[0].address);
    setnamuse(e.target.selectedPeople[0].displayName)
  }
  function handleInput(e: any) {
    form.fields.Nombre = namuse
    form.fields.Correo = valuecorreo
    if (e.target.name === 'cargo') {
      form.fields.Cargo = e.target.value
    }
  }
  function handleSelect(params: any) {
    form.fields.Permisos = params.value;
  }


  return (
    <>
      <Dialog
        id="EmgAgregar"
        open={open}
        onOpen={() => setOpen(true)}
        onCancel={() => {
          setOpen(false)
        }}
        onConfirm={handleSubmit}
        cancelButton='Cancelar'
        confirmButton="Guardar"
        content={[
          <div id="AgregarUsuario" style={{ display: "inline" }}>
            <Label className="TituloEmg" content="Agregar Usuario" />
            <Label className="TxtEmg" content="Agrega un usuario a la lista de permisos." />
            <Label content="Nombre" />
            <PeoplePicker
              style={{ width: "15px" }}
              selectionMode="single"
              selectionChanged={(e) => handelPeople(e)}
              placeholder="Nombre"
            ></PeoplePicker>
            <Label content="Correo" />
            <Input
              type="Correo"
              name="CorreoPersonal"
              id="CorreoPersonal"
              value={valuecorreo ? valuecorreo : ''}
              onChange={handleInput}
            />
            <Label content="Cargo" />
            <Input
              type="text"
              name="cargo"
              id="cargo"
              onChange={handleInput}
            />
            <Label content="Selecciona permisos" />
            <Select
              options={inputItemspermisos}
              onChange={(e) => handleSelect(e)}
            />
          </div>
        ]}
        headerAction={{
          icon: <CloseIcon />,
          title: "Close",
          onClick: () => setOpen(false),
        }}
        trigger={
          <Button
            className="btnparametrizar"
            content="Agregar Usuario"
            primary
          />
        }
      />
    </>
  );
};

export default CreateUserPara;
