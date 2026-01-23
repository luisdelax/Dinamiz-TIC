import { useEffect, useState } from "react";

export default function NetworkDeviceForm({ onSubmit, onCancel, initialData, persons, classrooms, sites }) {
  const [form, setForm] = useState({
    asset_tag: "",
    device_type: "router",
    brand: "",
    model: "",
    serial_number: "",
    ip_address: "",
    mac_address: "",
    location: "",
    status: "active",
    assigned_to_person: "",
    assigned_to_classroom: "",
    site: ""
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        assigned_to_person: initialData.assigned_to_person || "",
        assigned_to_classroom: initialData.assigned_to_classroom || "",
        site: initialData.site || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...form };
    if (dataToSend.assigned_to_person === "") {
      dataToSend.assigned_to_person = null;
    }
    if (dataToSend.assigned_to_classroom === "") {
      dataToSend.assigned_to_classroom = null;
    }
    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="asset_tag"
        placeholder="Código de activo"
        value={form.asset_tag}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      />

      <select
        name="device_type"
        value={form.device_type}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="router">Router</option>
        <option value="switch">Switch</option>
        <option value="ap">Access Point</option>
        <option value="patchpanel">Patch Panel</option>
        <option value="firewall">Firewall</option>
      </select>

      <input
        name="brand"
        placeholder="Marca"
        value={form.brand}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      />

      <input
        name="model"
        placeholder="Modelo"
        value={form.model}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      />

      <input
        name="serial_number"
        placeholder="Número de Serie"
        value={form.serial_number}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      />

      <input
        name="ip_address"
        placeholder="Dirección IP"
        value={form.ip_address}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <input
        name="mac_address"
        placeholder="Dirección MAC"
        value={form.mac_address}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <input
        name="location"
        placeholder="Ubicación (Rack, piso, sala, etc.)"
        value={form.location}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="active">Activo</option>
        <option value="maintenance">Mantenimiento</option>
        <option value="down">Fuera de servicio</option>
      </select>

      <select
        name="assigned_to_person"
        value={form.assigned_to_person}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Sin asignar (Persona)</option>
        {persons.map((person) => (
          <option key={person.id} value={person.id}>
            {person.first_name} {person.last_name}
          </option>
        ))}
      </select>

      <select
        name="assigned_to_classroom"
        value={form.assigned_to_classroom}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Sin asignar (Aula)</option>
        {classrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.id}>
            {classroom.name}
          </option>
        ))}
      </select>
        
        <select
        name="site"
        value={form.site}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        required
      >
        <option value="">Seleccione una sede</option>
        {sites.map((site) => (
          <option key={site.id} value={site.id}>
            {site.name}
          </option>
        ))}
      </select>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-gray-800"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
